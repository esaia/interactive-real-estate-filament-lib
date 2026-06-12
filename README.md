# Filament IREP

Interactive Real Estate visual editor for Filament v3+ admin panels. Lets you manage projects, blocks, floors, flats, types, tooltips, and reservations through a Vue-powered editor embedded directly in your Filament panel.

**Requirements:** PHP 8.2+, Laravel 11–13, Filament 3–5

---

## Installation

### 1. Add as a git submodule

Inside your Laravel project root, run:

```bash
git submodule add https://github.com/esaia/interactive-real-estate-filament-lib.git packages/filament-irep
```

This clones the package into `packages/filament-irep/`.

> If you're cloning an existing project that already has this submodule, run:
> ```bash
> git submodule update --init --recursive
> ```

### 2. Register the path repository in composer.json

Add the `repositories` block and the package requirement to your `composer.json`:

```json
{
    "repositories": [
        {
            "type": "path",
            "url": "./packages/filament-irep"
        }
    ],
    "require": {
        "irep-plugin/filament-irep": "^1.0"
    }
}
```

Then install:

```bash
composer require irep-plugin/filament-irep
```

Composer will symlink `vendor/irep-plugin/filament-irep` → `packages/filament-irep`.

### 3. Publish assets

Copy the compiled Vue/CSS assets to your public folder:

```bash
php artisan vendor:publish --tag=filament-irep-assets
```

This creates `public/vendor/filament-irep/irep-admin.js` and `irep-admin.css`.

### 4. Run migrations

```bash
php artisan migrate
```

Creates tables: `projects`, `blocks`, `floors`, `flats`, `types`, `tooltips`, `project_meta`, `reservations`, `settings`.

### 5. (Optional) Seed default settings

```bash
php artisan db:seed --class="IrepPlugin\FilamentIrep\Database\Seeders\IrepSettingsSeeder"
```

### 6. Register the plugin in your Filament panel

Open `app/Providers/Filament/AdminPanelProvider.php` and add the plugin:

```php
use IrepPlugin\FilamentIrep\FilamentIrepPlugin;

public function panel(Panel $panel): Panel
{
    return $panel
        // ... your existing config
        ->plugins([
            FilamentIrepPlugin::make(),
        ]);
}
```

### 7. Done

Visit `/admin/irep-admin-page` in your browser to open the visual editor.

---

## Feature Flags

Enable optional tiers and addons fluently on the plugin:

```php
FilamentIrepPlugin::make()
    ->premium()       // Enable premium tier features
    ->gold()          // Enable gold tier features
    ->priceHistory()  // Enable price history addon
    ->building360()   // Enable 360° building view addon
```

---

## Configuration

Publish the config file to customize paths and URLs:

```bash
php artisan vendor:publish --tag=filament-irep-config
```

This creates `config/filament-irep.php`:

```php
return [
    // POST route for all AJAX calls from the Vue editor
    'ajax_path' => '/admin/irep-ajax',

    // URL shown as the admin link inside the editor
    'contact_admin_url' => '/admin',

    // URL of the editor page
    'plugin_url' => '/admin/irep-admin-page',

    // Storage path where uploaded images are served from
    'plugin_assets_path' => '/storage/irep/',

    // Override the base URL for compiled assets (e.g. CDN URL)
    // Defaults to asset('vendor/filament-irep')
    'asset_url' => null,
];
```

---

## Filament Panel Resources

The plugin registers these automatically into your panel:

| Resource | URL |
|---|---|
| Projects | `/admin/projects` |
| Reservations | `/admin/reservations` |
| Visual Editor | `/admin/irep-admin-page` |
| Settings | `/admin/irep-settings` |

---

## Image Uploads

Uploaded images are stored under `storage/app/public/irep/`. Make sure the storage symlink exists:

```bash
php artisan storage:link
```

---

## Development Workflow

When working on the package locally, assets need to be rebuilt after JS/CSS changes.

**Option A — Symlink (recommended):** Replace the published assets with a symlink so rebuilds are reflected instantly without re-publishing:

```bash
rm -rf public/vendor/filament-irep
ln -s "$(pwd)/packages/filament-irep/resources/dist" public/vendor/filament-irep
```

Then run the package watcher in a separate terminal:

```bash
cd packages/filament-irep
npm install
npm run dev
```

**Option B — Manual:** After each build in the package, republish the assets:

```bash
cd packages/filament-irep && npm run build
cd ../.. && php artisan vendor:publish --tag=filament-irep-assets --force
```

PHP changes (service providers, resources, models) are reflected immediately via the composer symlink — no rebuild needed.

---

## Upgrading

Pull the latest submodule and republish assets:

```bash
git submodule update --remote packages/filament-irep
php artisan vendor:publish --tag=filament-irep-assets --force
php artisan migrate
```

Then commit the updated submodule pointer in your main repo:

```bash
git add packages/filament-irep
git commit -m "chore: update filament-irep submodule"
```
