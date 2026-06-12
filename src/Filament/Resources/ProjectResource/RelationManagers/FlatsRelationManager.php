<?php

namespace IrepPlugin\FilamentIrep\Filament\Resources\ProjectResource\RelationManagers;

use Filament\Actions\BulkAction;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;
use IrepPlugin\FilamentIrep\Models\Setting;

class FlatsRelationManager extends RelationManager
{
    protected static string $relationship = 'flats';

    public function form(Schema $schema): Schema
    {
        $projectId = $this->getOwnerRecord()->id;

        $statusOptions = array_merge(
            ['available' => 'Available', 'reserved' => 'Reserved', 'sold' => 'Sold'],
            Setting::get('irep_custom_status_types', []) ?? []
        );

        return $schema->components([
            Tabs::make()->tabs([
                Tab::make('Basic Info')->schema([
                    Grid::make(2)->schema([
                        TextInput::make('flat_number')->required(),
                        Toggle::make('is_active')->default(true),
                    ]),
                    Grid::make(3)->schema([
                        Select::make('floor_id')
                            ->relationship('floor', 'title', fn ($query) => $query->where('project_id', $projectId))
                            ->required()->searchable()->preload(),
                        Select::make('block_id')
                            ->relationship('block', 'title', fn ($query) => $query->where('project_id', $projectId))
                            ->nullable()->searchable()->preload()->placeholder('No block'),
                        Select::make('type_id')
                            ->relationship('type', 'title', fn ($query) => $query->where('project_id', $projectId))
                            ->nullable()->searchable()->preload()->placeholder('No type'),
                    ]),
                    Select::make('conf')->options($statusOptions)->required()->default('available'),
                ]),

                Tab::make('Pricing')->schema([
                    Grid::make(3)->schema([
                        TextInput::make('price')->numeric()->prefix('$')->nullable(),
                        TextInput::make('offer_price')->numeric()->prefix('$')->label('Offer Price')->nullable(),
                        Toggle::make('request_price')->label('Request Price Instead'),
                    ]),
                ]),

                Tab::make('Click Action')->schema([
                    Select::make('click_action')
                        ->options(['link' => 'Follow Link', 'modal' => 'Open Modal', 'none' => 'Nothing'])
                        ->nullable(),
                    Grid::make(2)->schema([
                        TextInput::make('follow_link.link')->label('Link URL')->url()->nullable(),
                        Select::make('follow_link.target')
                            ->label('Open In')
                            ->options(['_blank' => 'New Tab', '_self' => 'Same Tab'])
                            ->nullable(),
                    ]),
                    TextInput::make('use_type')->nullable(),
                ]),

                Tab::make('Files')->schema([
                    Repeater::make('files')
                        ->schema([
                            TextInput::make('name')->required(),
                            FileUpload::make('path')->disk('public')->directory('flats/files'),
                        ])
                        ->collapsible()->nullable()->columnSpanFull(),
                ]),
            ])->columnSpanFull(),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('flat_number')
            ->columns([
                TextColumn::make('flat_number')->searchable()->sortable(),
                TextColumn::make('floor.title')->label('Floor'),
                TextColumn::make('block.title')->label('Block')->placeholder('—'),
                TextColumn::make('type.title')->label('Type')->placeholder('—'),
                TextColumn::make('conf')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'available' => 'success',
                        'reserved'  => 'warning',
                        'sold'      => 'danger',
                        default     => 'gray',
                    })
                    ->label('Status'),
                TextColumn::make('price')->money('USD')->sortable(),
                IconColumn::make('is_active')->boolean(),
                TextColumn::make('created_at')->dateTime()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('conf')->options(['available' => 'Available', 'reserved' => 'Reserved', 'sold' => 'Sold'])->label('Status'),
                SelectFilter::make('block_id')->relationship('block', 'title'),
                SelectFilter::make('floor_id')->relationship('floor', 'title'),
                SelectFilter::make('type_id')->relationship('type', 'title'),
                TernaryFilter::make('is_active')->label('Active'),
            ])
            ->headerActions([CreateAction::make()])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([
                DeleteBulkAction::make(),
                BulkAction::make('mark_available')->label('Mark as Available')->icon('heroicon-o-check-circle')->color('success')
                    ->action(fn (Collection $records) => $records->each->update(['conf' => 'available']))->requiresConfirmation(),
                BulkAction::make('mark_reserved')->label('Mark as Reserved')->icon('heroicon-o-clock')->color('warning')
                    ->action(fn (Collection $records) => $records->each->update(['conf' => 'reserved']))->requiresConfirmation(),
                BulkAction::make('mark_sold')->label('Mark as Sold')->icon('heroicon-o-x-circle')->color('danger')
                    ->action(fn (Collection $records) => $records->each->update(['conf' => 'sold']))->requiresConfirmation(),
            ]);
    }
}
