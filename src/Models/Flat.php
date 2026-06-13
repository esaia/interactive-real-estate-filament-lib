<?php

namespace IrepPlugin\FilamentIrep\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Flat extends Model
{
    protected $fillable = [
        'project_id', 'block_id', 'floor_id', 'type_id',
        'flat_number', 'is_active', 'conf', 'price', 'offer_price',
        'request_price', 'click_action', 'follow_link', 'use_type', 'flat_type', 'files', 'custom_fields',
    ];

    protected function casts(): array
    {
        return [
            'is_active'     => 'boolean',
            'request_price' => 'boolean',
            'price'         => 'decimal:2',
            'offer_price'   => 'decimal:2',
            'follow_link'    => 'array',
            'flat_type'      => 'array',
            'files'          => 'array',
            'custom_fields'  => 'array',
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

    public function floor(): BelongsTo
    {
        return $this->belongsTo(Floor::class);
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(Type::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
