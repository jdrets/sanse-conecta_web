<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicationController extends Controller
{
    /**
     * Mostrar página principal con buscador
     */
    public function home()
    {
        $user = auth()->user(); 
        $categories = Category::where('is_active', true)->get();
        
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

        // Búsqueda por categoría
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
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

        $categories = Category::where('is_active', true)->get();

        return Inertia::render('Search', [
            'user' => $user,
            'publications' => $publications,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_id']),
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
        
        if (!$user->canPublishMore()) {
            return redirect()->route('home')
                ->with('error', 'Has alcanzado el límite de publicaciones permitidas.');
        }

        $categories = Category::where('is_active', true)->get();
        
        // Obtener categorías ya usadas por el usuario
        $usedCategories = $user->publications()->pluck('category_id')->toArray();

        return Inertia::render('PublicationCreate', [
            'user' => $user,
            'categories' => $categories,
            'usedCategories' => $usedCategories,
            'remainingPublications' => $user->remainingPublications(),
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

        // Manejar la imagen
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('publications', 'public');
            $data['image'] = $path;
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

        $categories = Category::where('is_active', true)->get();
        
        // Obtener categorías ya usadas por el usuario (excluyendo la actual)
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

        // Manejar la imagen
        if ($request->hasFile('image')) {
            // Eliminar imagen anterior si existe
            if ($publication->image) {
                Storage::disk('public')->delete($publication->image);
            }
            
            $path = $request->file('image')->store('publications', 'public');
            $data['image'] = $path;
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

        // Eliminar imagen si existe
        if ($publication->image) {
            Storage::disk('public')->delete($publication->image);
        }

        $publication->delete();

        return redirect()->route('home')
            ->with('success', 'Clasificado eliminado exitosamente.');
    }
}
