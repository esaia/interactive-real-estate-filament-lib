<x-filament-panels::page>
    {{-- irePlugin config must be defined BEFORE the Vue bundle evaluates --}}
    <script>
        window.irePlugin = @json($irePlugin);
    </script>

    @php
        $assetUrl = config('filament-irep.asset_url') ?? asset('vendor/filament-irep');
    @endphp
    @php $v = @filemtime(public_path('vendor/filament-irep/irep-admin.js')) ?: time(); @endphp
    <link rel="stylesheet" href="{{ $assetUrl }}/irep-admin.css?v={{ $v }}">
    <script type="module" src="{{ $assetUrl }}/irep-admin.js?v={{ $v }}"></script>

    <div id="irep-vue-app" style="min-height: 600px;"></div>
    <div id="irep-vue-app-responses"></div>
</x-filament-panels::page>
