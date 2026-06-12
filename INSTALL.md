# Filament IREP — Installation Guide

## 1. Add the package zip

Place `filament-irep-1.0.0.zip` anywhere on your server, e.g. `/packages/`.

## 2. Register the artifact repository

In your Laravel app's `composer.json`, add:

```json
{
    "repositories": [
        {
            "type": "artifact",
            "url": "/packages"
        }
    ],
    "require": {
        "irep-plugin/filament-irep": "^1.0"
    }
}
```

Then run:

```bash
composer require irep-plugin/filament-irep
```

## 3. Publish assets and run migrations

```bash
# Publish the compiled Vue/CSS assets to public/vendor/filament-irep/
php artisan vendor:publish --tag=filament-irep-assets

# Run migrations (creates projects, blocks, floors, flats, types, tooltips, project_meta, reservations, settings tables)
php artisan migrate

# (Optional) Seed default settings
php artisan db:seed --class="IrepPlugin\FilamentIrep\Database\Seeders\IrepSettingsSeeder"

# (Optional) Publish and customise config
php artisan vendor:publish --tag=filament-irep-config
```

## 4. Register the plugin in your Filament panel

In `app/Providers/Filament/AdminPanelProvider.php`:

```php
use IrepPlugin\FilamentIrep\FilamentIrepPlugin;

->plugins([
    FilamentIrepPlugin::make()
        // optional fluent config:
        ->premium()
        ->gold()
        ->building360(),
])
```

## 5. Done

Visit `/admin/irep-admin-page` to open the visual editor.

---

## Publishing assets manually (optional)

If you prefer to serve the assets from a CDN or custom path, publish the config:

```bash
php artisan vendor:publish --tag=filament-irep-config
```

Then set `asset_url` in `config/filament-irep.php` to your custom base URL.
