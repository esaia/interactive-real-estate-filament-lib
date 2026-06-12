<?php

namespace IrepPlugin\FilamentIrep;

use Illuminate\Support\ServiceProvider;
use IrepPlugin\FilamentIrep\Http\Controllers\IrepController;
use Illuminate\Support\Facades\Route;

class FilamentIrepServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../config/filament-irep.php', 'filament-irep');
    }

    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'filament-irep');

        $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');

        $this->registerRoutes();

        $this->publishes([
            __DIR__ . '/../config/filament-irep.php' => config_path('filament-irep.php'),
        ], 'filament-irep-config');

        $this->publishes([
            __DIR__ . '/../database/migrations' => database_path('migrations'),
        ], 'filament-irep-migrations');

        $this->publishes([
            __DIR__ . '/../resources/dist' => public_path('vendor/filament-irep'),
        ], 'filament-irep-assets');

        $this->publishes([
            __DIR__ . '/../database/seeders' => database_path('seeders'),
        ], 'filament-irep-seeders');
    }

    private function registerRoutes(): void
    {
        Route::middleware(['web', 'auth'])
            ->group(function () {
                Route::post(
                    config('filament-irep.ajax_path', '/admin/irep-ajax'),
                    [IrepController::class, 'handle']
                )->name('irep.handle');
            });
    }
}
