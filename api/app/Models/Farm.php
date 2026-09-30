<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Farm extends Model
{
    protected $fillable = [
        'farmer_id',
        'farm_name',
        'location',
        'latitude',
        'longitude',
        'size_acres',
        'primary_crop',
        'coffee_varieties',
        'coffee_tree_count',
        'estimated_annual_production',
        'last_harvest_date',
        'challenges',
    ];

    protected $casts = [
        'challenges'                  => 'array',
        'latitude'                    => 'decimal:7',
        'longitude'                   => 'decimal:7',
        'size_acres'                  => 'decimal:2',
        'estimated_annual_production' => 'decimal:2',
    ];

    // ---------------------------------------------------------------------------
    // Relationships
    // ---------------------------------------------------------------------------

    public function farmer(): BelongsTo
    {
        return $this->belongsTo(Farmer::class);
    }

    public function farmInsight(): HasOne
    {
        return $this->hasOne(FarmInsight::class);
    }

    public function serviceRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class);
    }
}
