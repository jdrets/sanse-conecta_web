<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\PublicationLike;
use Illuminate\Http\Request;

class PublicationLikeController extends Controller
{
    /**
     * Dar o quitar "me gusta" a un clasificado
     */
    public function toggle(Request $request, $publicationId)
    {
        $publication = Publication::findOrFail($publicationId);
        $userId = auth()->id();

        // Verificar si ya existe el "me gusta"
        $like = PublicationLike::where('user_id', $userId)
            ->where('publication_id', $publicationId)
            ->first();

        if ($like) {
            // Si existe, eliminar el "me gusta"
            $like->delete();
            $publication->decrement('likes_count');
            
            return back()->with('success', 'Me gusta eliminado.');
        } else {
            // Si no existe, crear el "me gusta"
            PublicationLike::create([
                'user_id' => $userId,
                'publication_id' => $publicationId,
            ]);
            $publication->increment('likes_count');
            
            return back()->with('success', 'Me gusta agregado.');
        }
    }
}
