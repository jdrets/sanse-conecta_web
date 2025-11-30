<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PublicationLike extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'publication_id',
    ];

    /**
     * Relación con el usuario que dio "me gusta"
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación con el clasificado
     */
    public function publication()
    {
        return $this->belongsTo(Publication::class);
    }
}
