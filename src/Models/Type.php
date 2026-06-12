<?php

namespace IrepPlugin\FilamentIrep\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Type extends Model
{
    protected $fillable = [
        'project_id', 'title', 'teaser', 'image_2d', 'image_3d',
        'gallery', 'area_m2', 'rooms_count', 'other',
    ];

    protected function casts(): array
    {
        return [
            'image_2d'    => 'array',
            'image_3d'    => 'array',
            'gallery'     => 'array',
            'other'       => 'array',
            'area_m2'     => 'decimal:2',
            'rooms_count' => 'decimal:1',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function flats(): HasMany
    {
        return $this->hasMany(Flat::class);
    }
}
