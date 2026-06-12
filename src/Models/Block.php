<?php

namespace IrepPlugin\FilamentIrep\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Block extends Model
{
    protected $fillable = [
        'project_id', 'title', 'is_active', 'conf', 'svg',
        'polygon_data', 'images_360', 'block_image',
    ];

    protected function casts(): array
    {
        return [
            'is_active'    => 'boolean',
            'polygon_data' => 'array',
            'images_360'   => 'array',
            'block_image'  => 'array',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function floors(): HasMany
    {
        return $this->hasMany(Floor::class);
    }

    public function flats(): HasMany
    {
        return $this->hasMany(Flat::class);
    }
}
