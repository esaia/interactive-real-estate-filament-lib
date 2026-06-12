<?php

namespace IrepPlugin\FilamentIrep\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectMeta extends Model
{
    protected $table = 'project_meta';

    protected $fillable = ['project_id', 'meta_key', 'meta_value'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function scopeKey(Builder $query, string $key): Builder
    {
        return $query->where('meta_key', $key);
    }
}
