<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Publication extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'image',
        'likes_count',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'likes_count' => 'integer',
    ];

    /**
     * Relación con el usuario que publicó el clasificado
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación con la categoría del clasificado
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relación con los "me gusta"
     */
    public function likes()
    {
        return $this->hasMany(PublicationLike::class);
    }

    /**
     * Verifica si un usuario ya dio "me gusta" a este clasificado
     */
    public function isLikedBy($userId)
    {
        return $this->likes()->where('user_id', $userId)->exists();
    }

    /**
     * Scope para clasificados activos
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope para ordenar por popularidad (más "me gusta")
     */
    public function scopePopular($query)
    {
        return $query->orderBy('likes_count', 'desc');
    }
}
