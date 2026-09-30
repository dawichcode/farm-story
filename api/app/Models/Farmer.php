<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Farmer extends Model
{
    protected $fillable = [
        'farmer_id',
        'full_name',
        'mobile_number',
        'email',
        'county',
        'preferred_language',
    ];

    // ---------------------------------------------------------------------------
    // Relationships
    // ---------------------------------------------------------------------------

    public function farms(): HasMany
    {
        return $this->hasMany(Farm::class);
    }

    public function serviceRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class);
    }

    // ---------------------------------------------------------------------------
    // Farmer ID generation
    // ---------------------------------------------------------------------------

    /**
     * Generate the next sequential Farmer ID in the format FS-KEN-000001.
     * Called before creating a new farmer record.
     */
    public static function generateFarmerId(): string
    {
        $last = static::lockForUpdate()->orderByDesc('id')->first();

        $next = $last ? ((int) substr($last->farmer_id, -6)) + 1 : 1;

        return 'FS-KEN-' . str_pad($next, 6, '0', STR_PAD_LEFT);
    }
}
