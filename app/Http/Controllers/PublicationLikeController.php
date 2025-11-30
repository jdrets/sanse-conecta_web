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
        $user = auth()->user();
        $userId = $user->id;


        // Verificar que el usuario no intente dar "me gusta" a su propia publicación
        if ((int)$publication->user_id === (int)$userId) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes dar "me gusta" a tu propia publicación.'
            ], 403);
        }

        // Verificar si ya existe el "me gusta"
        $like = PublicationLike::where('user_id', $userId)
            ->where('publication_id', $publicationId)
            ->first();

        if ($like) {
            // Si existe, eliminar el "me gusta"
            $like->delete();
            $publication->decrement('likes_count');
            
            return response()->json([
                'success' => true,
                'message' => 'Me gusta eliminado.',
                'liked' => false,
                'likes_count' => $publication->likes_count
            ]);
        } else {
            // Si no existe, crear el "me gusta"
            PublicationLike::create([
                'user_id' => $userId,
                'publication_id' => $publicationId,
            ]);
            $publication->increment('likes_count');
            
            return response()->json([
                'success' => true,
                'message' => 'Me gusta agregado.',
                'liked' => true,
                'likes_count' => $publication->likes_count
            ]);
        }
    }
}
