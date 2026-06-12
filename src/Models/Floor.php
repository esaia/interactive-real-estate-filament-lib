<?php

namespace IrepPlugin\FilamentIrep\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Floor extends Model
{
    protected $fillable = [
        'project_id', 'block_id', 'floor_number', 'title',
        'conf', 'svg', 'polygon_data', 'floor_image',
    ];

    protected function casts(): array
    {
        return [
            'polygon_data' => 'array',
            'floor_number' => 'integer',
            'floor_image'  => 'array',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function block(): BelongsTo
    {
        return $this->belongsTo(Block::class);
    }

    public function flats(): HasMany
    {
        return $this->hasMany(Flat::class);
    }
}
