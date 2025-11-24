<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AuditTypeItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'term',
        'laws',
        'order',
        'audit_type_id',
    ];

    protected $casts = [
        'order' => 'decimal:2',
        'audit_type_id' => 'integer',
    ];

    /**
     * Get the audit type that owns the item.
     */
    public function auditType(): BelongsTo
    {
        return $this->belongsTo(AuditType::class);
    }

    /**
     * Get the audit items for this type item.
     */
    public function auditItems(): HasMany
    {
        return $this->hasMany(AuditItem::class);
    }
}
