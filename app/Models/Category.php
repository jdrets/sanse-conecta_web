<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'is_active',
        'parent_id',
        'order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'parent_id' => 'integer',
        'order' => 'integer',
    ];

    /**
     * Relación con la categoría padre
     */
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Relación con las subcategorías (hijos)
     */
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id')->orderBy('order');
    }

    /**
     * Relación con clasificados/publicaciones
     */
    public function publications()
    {
        return $this->hasMany(Publication::class);
    }

    /**
     * Scope para obtener solo categorías padre (sin parent_id)
     */
    public function scopeParents($query)
    {
        return $query->whereNull('parent_id')->orderBy('order');
    }

    /**
     * Scope para obtener solo subcategorías
     */
    public function scopeChildren($query)
    {
        return $query->whereNotNull('parent_id')->orderBy('order');
    }

    /**
     * Verifica si es una categoría padre
     */
    public function isParent()
    {
        return is_null($this->parent_id);
    }

    /**
     * Obtiene el nombre completo (Padre > Hijo)
     */
    public function getFullNameAttribute()
    {
        if ($this->parent) {
            return $this->parent->name . ' > ' . $this->name;
        }
        return $this->name;
    }
}
