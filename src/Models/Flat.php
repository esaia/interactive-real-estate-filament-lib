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
        'price_history',
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
            'price_history'  => 'array',
        ];
    }

    /**
     * Price history is recorded automatically: one entry when a flat is first
     * given a price, one more on every later price change — no matter where the
     * change comes from (editor, Filament resource, Excel import). Admins can
     * still correct the list by hand through the price-history modal.
     */
    protected static function booted(): void
    {
        static::created(function (self $flat) {
            if ($flat->price_history !== null || !is_numeric($flat->price)) {
                return;
            }

            $flat->forceFill([
                'price_history' => [self::priceEntry($flat->price, $flat->created_at?->timestamp)],
            ])->saveQuietly();
        });

        static::updating(function (self $flat) {
            if (!$flat->isDirty('price') || !is_numeric($flat->price)) {
                return;
            }

            $original = $flat->getOriginal('price');

            // decimal:2 casting means the "change" can be cosmetic ("100" → "100.00").
            if (is_numeric($original) && (float) $original === (float) $flat->price) {
                return;
            }

            $history = is_array($flat->price_history) ? $flat->price_history : [];

            // A flat priced before this feature existed has no starting point;
            // seed one from the old price so the chart has something to compare.
            if ($history === [] && is_numeric($original)) {
                $history[] = self::priceEntry($original, $flat->created_at?->timestamp);
            }

            $history[] = self::priceEntry($flat->price);

            $flat->price_history = self::normalizePriceHistory($history);
        });
    }

    /**
     * One history row in the shape the viewer expects: a calendar day for the
     * label plus a unix timestamp (seconds) used for ordering.
     */
    public static function priceEntry(float|int|string $price, ?int $timestamp = null): array
    {
        $timestamp ??= time();

        return [
            'date'      => date('Y-m-d', $timestamp),
            'price'     => number_format((float) $price, 2, '.', ''),
            'timestamp' => $timestamp,
        ];
    }

    /**
     * Drop rows without a usable price, fill in missing date/timestamp pairs
     * from whichever of the two is present, and order oldest → newest.
     */
    public static function normalizePriceHistory(array $entries): array
    {
        $rows = [];

        foreach ($entries as $entry) {
            if (!is_array($entry) || !isset($entry['price']) || !is_numeric($entry['price'])) {
                continue;
            }

            $timestamp = isset($entry['timestamp']) && is_numeric($entry['timestamp'])
                ? (int) $entry['timestamp']
                : (strtotime((string) ($entry['date'] ?? '')) ?: time());

            $rows[] = [
                'date'      => $entry['date'] ?? date('Y-m-d', $timestamp),
                'price'     => number_format((float) $entry['price'], 2, '.', ''),
                'timestamp' => $timestamp,
            ];
        }

        usort($rows, fn ($a, $b) => $a['timestamp'] <=> $b['timestamp']);

        return array_values($rows);
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
