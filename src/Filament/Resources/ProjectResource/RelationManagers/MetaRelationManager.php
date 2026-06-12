<?php

namespace IrepPlugin\FilamentIrep\Filament\Resources\ProjectResource\RelationManagers;

use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class MetaRelationManager extends RelationManager
{
    protected static string $relationship = 'meta';

    protected static ?string $title = 'Project Meta';

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('meta_key')
                ->label('Key')
                ->options([
                    'path_color'               => 'Path Color',
                    'path_hover_color'         => 'Path Hover Color',
                    'reserved_color'           => 'Reserved Color',
                    'sold_color'               => 'Sold Color',
                    'stroke_color'             => 'Stroke Color',
                    'primary_color'            => 'Primary Color',
                    'available_flat_color'     => 'Available Flat Color',
                    'stroke_width'             => 'Stroke Width',
                    'border_radius'            => 'Border Radius',
                    'is_360_flow'              => '360 Flow Enabled',
                    'tooltip'                  => 'Tooltip',
                    'price_rounded'            => 'Round Prices',
                    'area_unit'                => 'Area Unit',
                    'flat_preview'             => 'Flat Preview',
                    'currency'                 => 'Currency',
                    'request_callback'         => 'Request Callback',
                    'redirect_to_callback_url' => 'Redirect to Callback URL',
                    'shareable_link'           => 'Shareable Link',
                    'receive_forms_on_email'   => 'Receive Forms on Email',
                    'custom_types'             => 'Custom Types (JSON)',
                ])
                ->searchable()
                ->required(),
            TextInput::make('meta_value')->label('Value')->nullable()->columnSpanFull(),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('meta_key')
            ->columns([
                TextColumn::make('meta_key')->searchable()->label('Key'),
                TextColumn::make('meta_value')->limit(60)->label('Value'),
                TextColumn::make('updated_at')->dateTime()->sortable(),
            ])
            ->headerActions([CreateAction::make()])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([DeleteBulkAction::make()]);
    }
}
