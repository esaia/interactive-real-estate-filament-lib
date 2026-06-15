<?php

namespace IrepPlugin\FilamentIrep\Filament\Pages;

use Filament\Schemas\Components\Utilities\Get;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
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

    private const COMMON_FIELDS = [
        'id'               => 'id',
        'flat_number'      => 'flat_number',
        'floor_title'      => 'floor_title',
        'floor_number'     => 'floor_number',
        'block_title'      => 'block_title',
        'price'            => 'price',
        'conf'             => 'conf',
        'type.area_m2'     => 'type.area_m2',
        'type.rooms_count' => 'type.rooms_count',
        'type.title'       => 'type.title',
        'type.teaser'      => 'type.teaser',
        'type.other.*'     => 'type.other.*',
    ];

    public function getView(): string
    {
        return 'filament-irep::filament.pages.settings-page';
    }

    public function mount(): void
    {
        $savedParam = Setting::get('flatFieldQueryParameter', 'id');
        if (str_starts_with($savedParam, 'type.other.') && $savedParam !== 'type.other.*') {
            $flatFieldQueryParameter = 'type.other.*';
            $typeOtherKey = substr($savedParam, strlen('type.other.'));
        } else {
            $flatFieldQueryParameter = $savedParam;
            $typeOtherKey = '';
        }

        $tableFields = Setting::get('irep_table_fields', []);
        if (! is_array($tableFields) || (count($tableFields) > 0 && ! is_array(reset($tableFields)))) {
            $tableFields = [];
        }

        $customFields = Setting::get('irep_flat_custom_fields', []);
        if (! is_array($customFields) || (count($customFields) > 0 && ! is_array(reset($customFields)))) {
            $customFields = [];
        }

        $actionSvgs = Setting::get('irep_table_action_svgs', ['contactSvg' => '', 'downloadSvg' => '', 'magnifySvg' => '']);
        if (! is_array($actionSvgs)) {
            $actionSvgs = ['contactSvg' => '', 'downloadSvg' => '', 'magnifySvg' => ''];
        }

        $validParams = array_keys(self::COMMON_FIELDS);
        if (! in_array($flatFieldQueryParameter, $validParams)) {
            $flatFieldQueryParameter = 'id';
            $typeOtherKey = '';
        }

        $this->data = [
            'irep_table_one_column'          => (bool) Setting::get('irep_table_one_column', false),
            'irep_table_whole_row_clickable' => (bool) Setting::get('irep_table_whole_row_clickable', false),
            'irep_table_contact_url'         => Setting::get('irep_table_contact_url', ''),
            'flatFieldQueryParameter'        => $flatFieldQueryParameter,
            'typeOtherKey'                   => $typeOtherKey,
            'irep_table_action_svgs'         => $actionSvgs,
            'irep_table_fields'              => $tableFields,
            'irep_flat_custom_fields'        => $customFields,
        ];
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make()->tabs([

                        Tab::make('Table Settings')->schema([

                            Section::make('Display Options')->schema([
                                Toggle::make('data.irep_table_one_column')
                                    ->label('1 column on responsive'),
                                Toggle::make('data.irep_table_whole_row_clickable')
                                    ->label('Whole row clickable'),
                            ])->columns(2),

                            Section::make('Contact Action')->schema([
                                TextInput::make('data.irep_table_contact_url')
                                    ->label('Redirect URL')
                                    ->placeholder('https://example.com/?flatid=')
                                    ->helperText('Appended with the selected query parameter value.')
                                    ->nullable(),
                                Select::make('data.flatFieldQueryParameter')
                                    ->label('Query Parameter')
                                    ->options(self::COMMON_FIELDS)
                                    ->default('id')
                                    ->live()
                                    ->required(),
                                TextInput::make('data.typeOtherKey')
                                    ->label('Custom key')
                                    ->placeholder('e.g. status')
                                    ->helperText('Saved as: type.other.{key}')
                                    ->hidden(fn(Get $get) => $get('data.flatFieldQueryParameter') !== 'type.other.*')
                                    ->nullable(),
                            ])->columns(2),

                            Section::make('Action Icons')
                                ->description('Paste custom SVG for each icon. Leave blank to use the default.')
                                ->schema([
                                    Textarea::make('data.irep_table_action_svgs.contactSvg')
                                        ->label('Contact Icon SVG')
                                        ->rows(4)
                                        ->placeholder('<svg …>…</svg>')
                                        ->nullable(),
                                    Textarea::make('data.irep_table_action_svgs.downloadSvg')
                                        ->label('Download Icon SVG')
                                        ->rows(4)
                                        ->placeholder('<svg …>…</svg>')
                                        ->nullable(),
                                    Textarea::make('data.irep_table_action_svgs.magnifySvg')
                                        ->label('Magnify Icon SVG')
                                        ->rows(4)
                                        ->placeholder('<svg …>…</svg>')
                                        ->nullable(),
                                ])->columns(3)->collapsible()->collapsed(),

                            Section::make('Table Columns')->schema([
                                Repeater::make('data.irep_table_fields')
                                    ->label('')
                                    ->schema([
                                        Select::make('field')
                                            ->label('Field')
                                            ->options(self::COMMON_FIELDS)
                                            ->required(),
                                        TextInput::make('header')
                                            ->label('Header Label')
                                            ->placeholder('e.g. Flat Number')
                                            ->required(),
                                        Toggle::make('sortable')
                                            ->label('Sortable')
                                            ->default(true),
                                    ])
                                    ->columns(3)
                                    ->reorderable()
                                    ->reorderableWithDragAndDrop()
                                    ->addActionLabel('Add Column')
                                    ->defaultItems(0),
                            ]),

                        ]),

                        Tab::make('Flat Custom Fields')->schema([

                            Repeater::make('data.irep_flat_custom_fields')
                                ->label('')
                                ->schema([
                                    TextInput::make('key')
                                        ->label('Field Name')
                                        ->placeholder('e.g. balcony_area')
                                        ->required(),
                                    Select::make('type')
                                        ->label('Field Type')
                                        ->options([
                                            'text'   => 'Text Input',
                                            'select' => 'Select Dropdown',
                                        ])
                                        ->default('text')
                                        ->live()
                                        ->required(),
                                    TagsInput::make('values')
                                        ->label('Dropdown Options')
                                        ->placeholder('Add option, press Enter')
                                        ->hidden(fn(Get $get) => $get('type') !== 'select')
                                        ->nullable(),
                                ])
                                ->columns(3)
                                ->reorderable()
                                ->reorderableWithDragAndDrop()
                                ->addActionLabel('Add Field')
                                ->defaultItems(0),

                        ]),

                    ])->contained(false),
            ]);
    }

    public function save(): void
    {
        // Normalize flatFieldQueryParameter before saving
        $param = $this->data['flatFieldQueryParameter'] ?? 'id';
        if ($param === 'type.other.*') {
            $param = 'type.other.' . trim($this->data['typeOtherKey'] ?? '');
        }

        $settings = [
            'irep_table_one_column'          => ['value' => $this->data['irep_table_one_column'], 'type' => 'boolean'],
            'irep_table_whole_row_clickable' => ['value' => $this->data['irep_table_whole_row_clickable'], 'type' => 'boolean'],
            'irep_table_contact_url'         => ['value' => $this->data['irep_table_contact_url'] ?? '', 'type' => 'string'],
            'flatFieldQueryParameter'        => ['value' => $param, 'type' => 'string'],
            'irep_table_action_svgs'         => ['value' => json_encode($this->data['irep_table_action_svgs'] ?? []), 'type' => 'json'],
            'irep_table_fields'              => ['value' => json_encode($this->data['irep_table_fields'] ?? []), 'type' => 'json'],
            'irep_flat_custom_fields'        => ['value' => json_encode($this->data['irep_flat_custom_fields'] ?? []), 'type' => 'json'],
        ];

        foreach ($settings as $key => $config) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => (string) $config['value'], 'type' => $config['type']]
            );
        }

        Notification::make()
            ->title('Settings saved successfully')
            ->success()
            ->send();
    }
}
