<?php

namespace IrepPlugin\FilamentIrep\Filament\Resources\ProjectResource\RelationManagers;

use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TypesRelationManager extends RelationManager
{
    protected static string $relationship = 'types';

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make()->tabs([
                Tab::make('Basic')->schema([
                    TextInput::make('title')->required()->maxLength(255)->columnSpanFull(),
                    Textarea::make('teaser')->rows(3)->nullable()->columnSpanFull(),
                    Grid::make(2)->schema([
                        TextInput::make('area_m2')->numeric()->step(0.01)->suffix('m²')->nullable(),
                        TextInput::make('rooms_count')->numeric()->step(0.5)->label('Rooms')->nullable(),
                    ]),
                ]),
                Tab::make('Images')->schema([
                    FileUpload::make('image_2d')->image()->disk('public')->directory('types/2d')->label('2D Image')->nullable(),
                    FileUpload::make('image_3d')->image()->disk('public')->directory('types/3d')->label('3D Image')->nullable(),
                    FileUpload::make('gallery')->image()->disk('public')->directory('types/gallery')->multiple()->reorderable()->label('Gallery')->nullable()->columnSpanFull(),
                ]),
                Tab::make('Other Info')->schema([
                    Repeater::make('other')
                        ->schema([
                            TextInput::make('key')->required(),
                            TextInput::make('value')->required(),
                        ])
                        ->columns(2)->collapsible()->nullable()->columnSpanFull(),
                ]),
            ])->columnSpanFull(),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('title')->searchable(),
                ImageColumn::make('image_2d')->size(40)->disk('public')->label('2D'),
                TextColumn::make('area_m2')->suffix(' m²')->sortable(),
                TextColumn::make('rooms_count')->sortable()->label('Rooms'),
                TextColumn::make('flats_count')->counts('flats')->label('Flats'),
            ])
            ->headerActions([CreateAction::make()])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([DeleteBulkAction::make()]);
    }
}
