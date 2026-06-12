<x-filament-panels::page>
    {{-- irePlugin config must be defined BEFORE the Vue bundle evaluates --}}
    <script>
        window.irePlugin = @json($irePlugin);
    </script>

    @php
        $assetUrl = config('filament-irep.asset_url') ?? asset('vendor/filament-irep');
    @endphp
    <link rel="stylesheet" href="{{ $assetUrl }}/irep-admin.css">
    <script type="module" src="{{ $assetUrl }}/irep-admin.js"></script>

    <div id="irep-vue-app" style="min-height: 600px;"></div>
    <div id="irep-vue-app-responses"></div>
</x-filament-panels::page>
