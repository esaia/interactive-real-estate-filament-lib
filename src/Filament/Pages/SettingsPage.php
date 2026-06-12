<?php

namespace IrepPlugin\FilamentIrep\Filament\Pages;

use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use IrepPlugin\FilamentIrep\Models\Setting;

class SettingsPage extends Page
{
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static string|\UnitEnum|null $navigationGroup = 'Configuration';

    protected static ?string $title = 'Global Settings';

    protected static ?string $navigationLabel = 'Settings';

    protected static ?int $navigationSort = 10;

    public ?array $data = [];

    public function getView(): string
    {
        return 'filament-irep::filament.pages.settings-page';
    }

    public function mount(): void
    {
        $this->data = [
            'irep_table_fields'              => Setting::get('irep_table_fields', ['flat_number', 'floor', 'area', 'price', 'status']),
            'irep_table_contact_url'         => Setting::get('irep_table_contact_url', ''),
            'flatFieldQueryParameter'        => Setting::get('flatFieldQueryParameter', 'flat'),
            'irep_table_one_column'          => (bool) Setting::get('irep_table_one_column', false),
            'irep_table_whole_row_clickable' => (bool) Setting::get('irep_table_whole_row_clickable', false),
            'irep_custom_status_types'       => Setting::get('irep_custom_status_types', []),
            'irep_table_action_svgs'         => Setting::get('irep_table_action_svgs', ['contactSvg' => '', 'downloadSvg' => '', 'magnifySvg' => '']),
        ];
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Form::make()->schema([
                    Section::make('Table Display')->schema([
                        Toggle::make('data.irep_table_one_column')->label('Single Column Layout'),
                        Toggle::make('data.irep_table_whole_row_clickable')->label('Whole Row Clickable'),
                        TextInput::make('data.flatFieldQueryParameter')
                            ->label('URL Query Parameter Name')
                            ->default('flat')
                            ->required(),
                        TextInput::make('data.irep_table_contact_url')
                            ->label('CRM Contact URL')
                            ->url()
                            ->nullable(),
                    ])->columns(2),

                    Section::make('Flat Table Columns')->schema([
                        CheckboxList::make('data.irep_table_fields')
                            ->label('Visible Columns')
                            ->options([
                                'flat_number' => 'Flat Number',
                                'floor'       => 'Floor',
                                'area'        => 'Area (m²)',
                                'rooms'       => 'Rooms',
                                'price'       => 'Price',
                                'status'      => 'Status',
                            ])
                            ->columns(3),
                    ]),

                    Section::make('Custom Status Types')->schema([
                        KeyValue::make('data.irep_custom_status_types')
                            ->label('')
                            ->keyLabel('Status Key')
                            ->valueLabel('Display Label')
                            ->addActionLabel('Add Custom Status')
                            ->nullable(),
                    ]),

                    Section::make('Action SVGs')->schema([
                        Textarea::make('data.irep_table_action_svgs.contactSvg')
                            ->label('Contact Icon SVG')
                            ->rows(4)
                            ->nullable(),
                        Textarea::make('data.irep_table_action_svgs.downloadSvg')
                            ->label('Download Icon SVG')
                            ->rows(4)
                            ->nullable(),
                        Textarea::make('data.irep_table_action_svgs.magnifySvg')
                            ->label('Magnify Icon SVG')
                            ->rows(4)
                            ->nullable(),
                    ])->columns(3)->collapsible()->collapsed(),
                ]),
            ]);
    }

    public function save(): void
    {
        $types = [
            'irep_table_fields'              => 'json',
            'irep_table_contact_url'         => 'string',
            'flatFieldQueryParameter'        => 'string',
            'irep_table_one_column'          => 'boolean',
            'irep_table_whole_row_clickable' => 'boolean',
            'irep_custom_status_types'       => 'json',
            'irep_table_action_svgs'         => 'json',
        ];

        foreach ($this->data as $key => $value) {
            $type = $types[$key] ?? 'string';
            Setting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => is_array($value) ? json_encode($value) : (string) $value,
                    'type'  => $type,
                ]
            );
        }

        Notification::make()
            ->title('Settings saved successfully')
            ->success()
            ->send();
    }
}
