<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Audit extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'client_id',
        'audit_type_id',
        'creation_date',
    ];

    protected $casts = [
        'creation_date' => 'date',
        'client_id' => 'integer',
        'audit_type_id' => 'integer',
    ];

    /**
     * Get the client that owns the audit.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the audit type that owns the audit.
     */
    public function auditType(): BelongsTo
    {
        return $this->belongsTo(AuditType::class);
    }

    /**
     * Get the items for the audit.
     */
    public function items(): HasMany
    {
        return $this->hasMany(AuditItem::class)
            ->whereHas('auditTypeItem', function ($query) {
                $query->whereNull('deleted_at');
            });
    }
}
