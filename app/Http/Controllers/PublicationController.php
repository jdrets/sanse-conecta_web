<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Http\Controllers\FilesController;

class PublicationController extends Controller
{
    /**
     * Mostrar página principal con buscador
     */
    public function home()
    {
        $user = auth()->user(); 
        // Solo cargar categorías padre con sus hijos
        $categories = Category::where('is_active', true)
            ->whereNull('parent_id')
            ->with('children')
            ->orderBy('order')
            ->get();
        
        return Inertia::render('Home', [
            'categories' => $categories,
            'user' => $user,
        ]);
    }

    /**
     * Buscar clasificados
     */
    public function search(Request $request)
    {
        $user = auth()->user();
        $query = Publication::query()
            ->with(['user', 'category'])
            ->active();
        $selectedCategory = null;

        // Búsqueda por categoría
        if ($request->has('category_id') && $request->category_id) {
            $categoryId = $request->category_id;
            
            // Obtener la categoría seleccionada
            $selectedCategory = Category::find($categoryId);
            
            if ($selectedCategory) {
                // Si es una categoría padre (no tiene parent_id)
                if (is_null($selectedCategory->parent_id)) {
                    // Buscar publicaciones de esta categoría Y de todas sus subcategorías
                    $childCategoryIds = Category::where('parent_id', $categoryId)->pluck('id')->toArray();
                    $allCategoryIds = array_merge([$categoryId], $childCategoryIds);
                    $query->whereIn('category_id', $allCategoryIds);
                } else {
                    // Si es una subcategoría, buscar solo por esa categoría específica
                    $query->where('category_id', $categoryId);
                }
            }
        }

        // Búsqueda por texto
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Ordenar por popularidad (más likes)
        $publications = $query->popular()->paginate(12);

        // Solo categorías padre para el filtro, con sus hijos
        $categories = Category::where('is_active', true)
            ->whereNull('parent_id')
            ->with('children')
            ->orderBy('order')
            ->get();

        return Inertia::render('Search', [
            'user' => $user,
            'publications' => $publications,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_id']),
            'selectedCategory' => $selectedCategory,
        ]);
    }

    /**
     * Mostrar detalle de un clasificado
     */
    public function show($id)
    {
        $user = auth()->user();
        $publication = Publication::with(['user', 'category', 'likes.user'])
            ->findOrFail($id);

        $isLiked = false;
        if (auth()->check()) {
            $isLiked = $publication->isLikedBy(auth()->id());
        }

        return Inertia::render('PublicationDetails', [
            'user' => $user,
            'publication' => $publication,
            'isLiked' => $isLiked,
        ]);
    }

    /**
     * Mostrar formulario de crear clasificado
     */
    public function create()
    {
        $user = auth()->user();

        // Cargar todas las categorías (padre e hijos) para el selector en cascada
        $categories = Category::where('is_active', true)
            ->orderByRaw('COALESCE(parent_id, 0), `order`')
            ->get();
        
        // Obtener categorías ya usadas por el usuario (solo subcategorías)
        $usedCategories = $user->publications()->pluck('category_id')->toArray();

        return Inertia::render('PublicationCreate', [
            'user' => $user,
            'categories' => $categories,
            'usedCategories' => $usedCategories,
            'remainingPublications' => $user->remainingPublications(),
            'canPublishMore' => $user->canPublishMore(),
        ]);
    }

    /**
     * Guardar nuevo clasificado
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$user->canPublishMore()) {
            return back()->withErrors(['message' => 'Has alcanzado el límite de publicaciones permitidas.']);
        }

        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Verificar que el usuario no tenga ya un clasificado en esta categoría
        $existingPublication = Publication::where('user_id', $user->id)
            ->where('category_id', $request->category_id)
            ->exists();

        if ($existingPublication) {
            return back()->withErrors(['category_id' => 'Ya tienes un clasificado publicado en esta categoría.']);
        }

        $data = $request->only(['category_id', 'title', 'description']);
        $data['user_id'] = $user->id;

        // Manejar la imagen usando FilesController
        if ($request->hasFile('image')) {
            $filesController = new FilesController();
            $result = $filesController->uploadPublicationImage($request);
            
            if ($result['success']) {
                $data['image'] = $result['path'];
            } else {
                return back()->withErrors(['image' => $result['error']])->withInput();
            }
        }

        $publication = Publication::create($data);

        return redirect()->route('publication.show', $publication->id)
            ->with('success', 'Clasificado publicado exitosamente.');
    }

    /**
     * Mostrar formulario de editar clasificado
     */
    public function edit($id)
    {
        $user = auth()->user();
        $publication = Publication::findOrFail($id);

        // Verificar que el usuario sea el dueño del clasificado
        if ($publication->user_id !== auth()->id()) {
            abort(403, 'No tienes permiso para editar este clasificado.');
        }

        // Cargar todas las categorías (padre e hijos) para el selector en cascada
        $categories = Category::where('is_active', true)
            ->orderByRaw('COALESCE(parent_id, 0), `order`')
            ->get();
        
        // Obtener categorías ya usadas por el usuario (excluyendo la actual, solo subcategorías)
        $usedCategories = $user->publications()
            ->where('id', '!=', $publication->id)
            ->pluck('category_id')
            ->toArray();

        return Inertia::render('PublicationEdit', [
            'user' => $user,
            'publication' => $publication,
            'categories' => $categories,
            'usedCategories' => $usedCategories,
        ]);
    }

    /**
     * Actualizar clasificado
     */
    public function update(Request $request, $id)
    {
        $publication = Publication::findOrFail($id);

        // Verificar que el usuario sea el dueño del clasificado
        if ($publication->user_id !== auth()->id()) {
            abort(403, 'No tienes permiso para editar este clasificado.');
        }

        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Verificar que el usuario no tenga ya un clasificado en esta categoría (excepto el actual)
        if ($request->category_id != $publication->category_id) {
            $existingPublication = Publication::where('user_id', auth()->id())
                ->where('category_id', $request->category_id)
                ->where('id', '!=', $publication->id)
                ->exists();

            if ($existingPublication) {
                return back()->withErrors(['category_id' => 'Ya tienes un clasificado publicado en esta categoría.']);
            }
        }

        $data = $request->only(['category_id', 'title', 'description']);

        // Manejar la imagen usando FilesController
        if ($request->hasFile('image')) {
            $filesController = new FilesController();
            
            // Eliminar imagen anterior si existe
            if ($publication->image) {
                $filesController->deletePublicationImage($publication->image);
            }
            
            // Subir nueva imagen
            $result = $filesController->uploadPublicationImage($request);
            
            if ($result['success']) {
                $data['image'] = $result['path'];
            } else {
                return back()->withErrors(['image' => $result['error']])->withInput();
            }
        }

        $publication->update($data);

        return redirect()->route('publication.show', $publication->id)
            ->with('success', 'Clasificado actualizado exitosamente.');
    }

    /**
     * Eliminar clasificado
     */
    public function destroy($id)
    {
        $publication = Publication::findOrFail($id);

        // Verificar que el usuario sea el dueño del clasificado
        if ($publication->user_id !== auth()->id()) {
            abort(403, 'No tienes permiso para eliminar este clasificado.');
        }

        // Eliminar imagen si existe usando FilesController
        if ($publication->image) {
            $filesController = new FilesController();
            $filesController->deletePublicationImage($publication->image);
        }

        $publication->delete();

        return redirect()->route('home')
            ->with('success', 'Clasificado eliminado exitosamente.');
    }
}
