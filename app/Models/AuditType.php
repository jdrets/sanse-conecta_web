<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AuditType extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
    ];

    /**
     * Get the items for the audit type.
     */
    public function items(): HasMany
    {
        return $this->hasMany(AuditTypeItem::class);
    }

    /**
     * Get the audits for the audit type.
     */
    public function audits(): HasMany
    {
        return $this->hasMany(Audit::class);
    }
}
