<?php

namespace IrepPlugin\FilamentIrep\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Project extends Model
{
    protected $fillable = [
        'title', 'slug', 'svg', 'polygon_data', 'images_360', 'project_image',
        'views', 'view_label', 'mobile_image', 'mobile_svg', 'mobile_polygon_data',
    ];

    protected function casts(): array
    {
        return [
            'polygon_data' => 'array',
            'images_360' => 'array',
            'views' => 'array',
            'mobile_polygon_data' => 'array',
        ];
    }

    protected function projectImage(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? (json_decode($value, true) ?? $value) : null,
            set: fn ($value) => is_array($value) ? json_encode($value) : $value,
        );
    }

    /** The mobile-specific image for view 1, stored the same way as project_image. */
    protected function mobileImage(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? (json_decode($value, true) ?? $value) : null,
            set: fn ($value) => is_array($value) ? json_encode($value) : $value,
        );
    }

    public function blocks(): HasMany
    {
        return $this->hasMany(Block::class);
    }

    public function floors(): HasMany
    {
        return $this->hasMany(Floor::class);
    }

    public function flats(): HasMany
    {
        return $this->hasMany(Flat::class);
    }

    public function types(): HasMany
    {
        return $this->hasMany(Type::class);
    }

    public function tooltips(): HasMany
    {
        return $this->hasMany(Tooltip::class);
    }

    public function meta(): HasMany
    {
        return $this->hasMany(ProjectMeta::class);
    }

    public function reservations(): HasManyThrough
    {
        return $this->hasManyThrough(Reservation::class, Flat::class);
    }
}
