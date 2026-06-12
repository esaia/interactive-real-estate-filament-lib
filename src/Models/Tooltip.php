<?php

namespace IrepPlugin\FilamentIrep\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tooltip extends Model
{
    protected $fillable = ['project_id', 'title', 'data'];

    protected function casts(): array
    {
        return ['data' => 'array'];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
