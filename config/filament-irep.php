<?php

return [
    /*
     * The POST route path for AJAX requests from the Vue editor.
     */
    'ajax_path' => '/admin/irep-ajax',

    /*
     * URL shown as the "admin" link inside the editor.
     */
    'contact_admin_url' => '/admin',

    /*
     * The URL of the editor page itself.
     */
    'plugin_url' => '/admin/irep-admin-page',

    /*
     * Storage path where uploaded images are served from.
     */
    'plugin_assets_path' => '/storage/irep/',

    /*
     * Base URL for the compiled Vue/CSS assets published to public/vendor/filament-irep/.
     * Defaults to asset('vendor/filament-irep').
     */
    'asset_url' => null,
];
