<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'password',
        'role',
        'client_id',
        'name',
        'phone',
        'address',
        'publication_max',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'publication_max' => 'integer',
        ];
    }

    /**
     * Relación con clasificados publicados por el usuario
     */
    public function publications()
    {
        return $this->hasMany(Publication::class);
    }

    /**
     * Relación con los "me gusta" del usuario
     */
    public function publicationLikes()
    {
        return $this->hasMany(PublicationLike::class);
    }

    /**
     * Verifica si el usuario puede publicar más clasificados
     */
    public function canPublishMore()
    {
        return $this->publications()->count() < $this->publication_max;
    }

    /**
     * Obtiene la cantidad de publicaciones que aún puede publicar
     */
    public function remainingPublications()
    {
        return max(0, $this->publication_max - $this->publications()->count());
    }
}
