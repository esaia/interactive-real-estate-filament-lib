<?php

namespace IrepPlugin\FilamentIrep\Filament\Resources\ProjectResource\RelationManagers;

use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class FloorsRelationManager extends RelationManager
{
    protected static string $relationship = 'floors';

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('floor_number')->integer()->required(),
            TextInput::make('title')->required()->maxLength(255),
            Select::make('block_id')
                ->relationship('block', 'title')
                ->nullable()
                ->searchable()
                ->preload()
                ->placeholder('No block'),
            FileUpload::make('floor_image')
                ->image()
                ->disk('public')
                ->directory('floors')
                ->nullable()
                ->columnSpanFull(),
            Textarea::make('svg')->rows(8)->columnSpanFull()->nullable(),
            Textarea::make('polygon_data')->rows(4)->columnSpanFull()->nullable()->hint('JSON'),
            Textarea::make('conf')->rows(3)->nullable()->columnSpanFull(),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('floor_number')->sortable()->label('Floor #'),
                TextColumn::make('title')->searchable(),
                TextColumn::make('block.title')->label('Block')->placeholder('—'),
                TextColumn::make('flats_count')->counts('flats')->label('Flats'),
                ImageColumn::make('floor_image')->size(40)->disk('public'),
            ])
            ->filters([
                SelectFilter::make('block_id')->relationship('block', 'title')->label('Block'),
            ])
            ->headerActions([CreateAction::make()])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([DeleteBulkAction::make()]);
    }
}
