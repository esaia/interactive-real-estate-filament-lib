<?php

namespace IrepPlugin\FilamentIrep;

use Filament\Contracts\Plugin;
use Filament\Panel;
use IrepPlugin\FilamentIrep\Filament\Pages\IrepAdminPage;
use IrepPlugin\FilamentIrep\Filament\Pages\SettingsPage;
use IrepPlugin\FilamentIrep\Filament\Resources\ProjectResource;
use IrepPlugin\FilamentIrep\Filament\Resources\ReservationResource;

class FilamentIrepPlugin implements Plugin
{
    protected bool $isPremium = true;
    protected bool $isGold = true;
    protected bool $priceHistoryAddon = false;
    protected bool $building360Addon = true;

    public static function make(): static
    {
        return new static();
    }

    public function getId(): string
    {
        return 'filament-irep';
    }

    public function register(Panel $panel): void
    {
        $panel
            ->resources([
                ProjectResource::class,
                ReservationResource::class,
            ])
            ->pages([
                IrepAdminPage::class,
                SettingsPage::class,
            ]);
    }

    public function boot(Panel $panel): void {}

    // ─── Fluent configuration ─────────────────────────────────────────────────

    public function premium(bool $value = true): static
    {
        $this->isPremium = $value;
        return $this;
    }

    public function gold(bool $value = true): static
    {
        $this->isGold = $value;
        return $this;
    }

    public function priceHistory(bool $value = true): static
    {
        $this->priceHistoryAddon = $value;
        return $this;
    }

    public function building360(bool $value = true): static
    {
        $this->building360Addon = $value;
        return $this;
    }

    public function getPluginConfig(): array
    {
        return [
            'ajax_url'            => route('irep.handle'),
            'nonce'               => csrf_token(),
            'contact_admin_url'   => config('filament-irep.contact_admin_url', '/admin'),
            'plugin_url'          => url(config('filament-irep.plugin_url', '/admin/irep-admin-page')),
            'plugin_assets_path'  => config('filament-irep.plugin_assets_path', '/storage/irep/'),
            'is_premium'          => $this->isPremium,
            'is_gold'             => $this->isGold,
            'translations'        => [],
            'price_history_addon' => $this->priceHistoryAddon,
            'building_360_addon'  => $this->building360Addon,
        ];
    }
}
