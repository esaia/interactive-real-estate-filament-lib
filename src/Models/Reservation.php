<?php

namespace IrepPlugin\FilamentIrep\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    protected $fillable = ['flat_id', 'name', 'phone', 'email', 'comment'];

    public function flat(): BelongsTo
    {
        return $this->belongsTo(Flat::class);
    }
}
