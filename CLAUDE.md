# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Laravel package (`irep-plugin/filament-irep`) that adds an Interactive Real Estate visual editor to Filament v3+ admin panels. It ships compiled Vue 3 assets, Eloquent models, migrations, a single AJAX controller, and Filament resources/pages — all as a distributable composer artifact (no public repo).

## Commands

### Frontend (Vue 3 + Vite)

```bash
npm run build       # one-shot build → resources/dist/
npm run dev         # watch mode (rebuilds on change)
```

Built output goes to `resources/dist/irep-admin.js` and `resources/dist/irep-admin.css`, which are the files committed and published to the host app via `vendor:publish`.

### In the host Laravel app (not this repo)

```bash
php artisan vendor:publish --tag=filament-irep-assets      # copy dist/ → public/vendor/filament-irep/
php artisan vendor:publish --tag=filament-irep-config      # publish config/filament-irep.php
php artisan migrate
php artisan db:seed --class="IrepPlugin\FilamentIrep\Database\Seeders\IrepSettingsSeeder"
```

## Architecture

### PHP layer

| Path | Role |
|---|---|
| `src/FilamentIrepPlugin.php` | Implements `Filament\Contracts\Plugin`. Registers resources/pages and holds feature flags (`isPremium`, `isGold`, `priceHistoryAddon`, `building360Addon`). `getPluginConfig()` serialises these into the `window.irePlugin` global consumed by Vue. |
| `src/FilamentIrepServiceProvider.php` | Merges config, loads views/migrations, registers the single POST route (`/admin/irep-ajax` → `IrepController@handle`). |
| `src/Http/Controllers/IrepController.php` | Single-action AJAX controller. Dispatches on `request->action` string via a static `$map` array (e.g. `irep_get_flats` → `getFlats()`). All Vue→backend communication flows through this one endpoint. |
| `src/Filament/Pages/IrepAdminPage.php` | Renders the Blade shell that boots the Vue app. Passes `$irePlugin = $plugin->getPluginConfig()` into the view, which writes it to `window.irePlugin` before the JS bundle loads. |
| `src/Filament/Pages/SettingsPage.php` | Filament page for plugin settings. |
| `src/Filament/Resources/` | `ProjectResource` (with relation managers for blocks, floors, flats, types, tooltips, meta) and `ReservationResource`. |
| `src/Models/` | `Project`, `Block`, `Floor`, `Flat`, `Type`, `Tooltip`, `ProjectMeta`, `Reservation`, `Setting`. |

### Vue layer (`resources/js/irep-admin/`)

Entry point: `src/main.ts` — mounts two apps:
- `#irep-vue-app` → `App.vue` (main editor)
- `#irep-vue-app-responses` → `Responses.vue` (response display area embedded elsewhere on the page)

State management uses **Pinia** stores (`src/stores/`):
- `useProject`, `useBlock`, `useFloors`, `useFlats`, `useTypes`, `useActions`, `useMeta`

Path aliases (defined in `vite.config.js`):
- `ire-preview` → `resources/js/ire-preview-library/dist/lib.es.js` (pre-built, treat as a black-box dependency)
- `@components` → `src/components/`
- `@/src/...` and `@/types/...` → `resources/js/irep-admin/src/...` and `resources/js/irep-admin/types/...`

### ire-preview-library

A pre-built companion library located at `resources/js/ire-preview-library/dist/`. Its source is not in this repo — only the compiled `lib.es.js`, `styles.css`, and type declarations are present. Do not attempt to rebuild it from here.

### Data flow

```
Vue store action
  → axios POST to /admin/irep-ajax  (src/utils/axios.ts)
    → IrepController::handle()
      → dispatches to a private method via $map
        → Eloquent model operation
          → JSON response
```

`window.irePlugin` (set before the bundle loads) provides the AJAX URL, CSRF nonce, feature flags, and asset paths to Vue via `app.config.globalProperties.irePlugin`.

## Key config values (`config/filament-irep.php`)

- `ajax_path` — POST route for all Vue AJAX calls (default `/admin/irep-ajax`)
- `asset_url` — override the base URL for compiled assets; defaults to `asset('vendor/filament-irep')`
- `plugin_assets_path` — storage path for uploaded images (default `/storage/irep/`)

## Feature flags

Set fluently on the plugin in the host app's panel provider:

```php
FilamentIrepPlugin::make()
    ->premium()          // enables premium tier features
    ->gold()             // enables gold tier features
    ->priceHistory()     // enables price history addon
    ->building360()      // enables 360° building addon
```

These are forwarded to Vue through `window.irePlugin`.
