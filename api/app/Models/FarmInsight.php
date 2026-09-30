<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FarmInsight extends Model
{
    protected $fillable = [
        'farm_id',
        'score',
        'summary',
        'recommendations',
    ];

    protected $casts = [
        'recommendations' => 'array',
        'score'           => 'integer',
    ];

    public function farm(): BelongsTo
    {
        return $this->belongsTo(Farm::class);
    }
}
