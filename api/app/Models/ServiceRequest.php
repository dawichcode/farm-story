<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceRequest extends Model
{
    protected $fillable = [
        'reference',
        'farmer_id',
        'farm_id',
        'type',
        'status',
        'notes',
    ];

    protected $attributes = [
        'status' => 'pending',
    ];

    // ---------------------------------------------------------------------------
    // Relationships
    // ---------------------------------------------------------------------------

    public function farmer(): BelongsTo
    {
        return $this->belongsTo(Farmer::class);
    }

    public function farm(): BelongsTo
    {
        return $this->belongsTo(Farm::class);
    }

    // ---------------------------------------------------------------------------
    // Reference generation
    // ---------------------------------------------------------------------------

    /**
     * Generate the next sequential reference in the format REQ-000001.
     */
    public static function generateReference(): string
    {
        $last = static::lockForUpdate()->orderByDesc('id')->first();

        $next = $last ? ((int) substr($last->reference, -6)) + 1 : 1;

        return 'REQ-' . str_pad($next, 6, '0', STR_PAD_LEFT);
    }
}
