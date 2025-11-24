<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class IndustryCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'industries_categories';

    protected $fillable = [
        'name',
    ];

    /**
     * Get the clients for the category.
     */
    public function clients(): HasMany
    {
        return $this->hasMany(Client::class, 'category_id');
    }
}
