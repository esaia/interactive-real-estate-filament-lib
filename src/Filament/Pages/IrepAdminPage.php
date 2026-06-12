<?php

namespace IrepPlugin\FilamentIrep\Filament\Pages;

use Filament\Facades\Filament;
use Filament\Pages\Page;
use IrepPlugin\FilamentIrep\FilamentIrepPlugin;

class IrepAdminPage extends Page
{
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-map';

    protected static string|\UnitEnum|null $navigationGroup = 'Real Estate';

    protected static ?string $title = 'Visual Editor';

    protected static ?string $navigationLabel = 'Visual Editor';

    protected static ?int $navigationSort = 2;

    public function getView(): string
    {
        return 'filament-irep::filament.pages.irep-admin-page';
    }

    public function getViewData(): array
    {
        /** @var FilamentIrepPlugin $plugin */
        $plugin = Filament::getCurrentPanel()->getPlugin('filament-irep');

        return [
            'irePlugin' => $plugin->getPluginConfig(),
        ];
    }
}
