<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'address',
        'cadastral_nomenclature',
        'phone',
        'cuit',
        'contact_name',
        'responsible_email',
        'environmental_audit_responsible',
        'safety_audit_responsible',
        'category_id',
    ];

    protected $casts = [
        'category_id' => 'integer',
    ];

    /**
     * Get the category that owns the client.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(IndustryCategory::class, 'category_id');
    }

    public function user_access(): HasOne
    {
        return $this->hasOne(User::class);
    }

    /**
     * Get the audits for the client.
     */
    public function audits(): HasMany
    {
        return $this->hasMany(Audit::class);
    }
}
