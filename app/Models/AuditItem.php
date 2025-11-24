<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AuditItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'audit_id',
        'audit_type_item_id',
        'date',
        'expiry_date',
        'apply',
        'complies',
        'documents',
        'comments',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
        'expiry_date' => 'date',
        'apply' => 'boolean',
        'complies' => 'boolean',
        'audit_id' => 'integer',
        'audit_type_item_id' => 'integer',
    ];

    /**
     * Get the audit that owns the item.
     */
    public function audit(): BelongsTo
    {
        return $this->belongsTo(Audit::class);
    }

    /**
     * Get the audit type item that owns the item.
     */
    public function auditTypeItem(): BelongsTo
    {
        return $this->belongsTo(AuditTypeItem::class);
    }
}
