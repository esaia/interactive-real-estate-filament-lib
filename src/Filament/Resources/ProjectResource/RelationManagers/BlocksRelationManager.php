<?php

namespace IrepPlugin\FilamentIrep\Filament\Resources\ProjectResource\RelationManagers;

use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class BlocksRelationManager extends RelationManager
{
    protected static string $relationship = 'blocks';

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')->required()->maxLength(255),
            Toggle::make('is_active')->default(true),
            FileUpload::make('block_image')
                ->image()
                ->disk('public')
                ->directory('blocks')
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
                TextColumn::make('id')->sortable(),
                ImageColumn::make('block_image')->square()->size(40)->disk('public'),
                TextColumn::make('title')->searchable(),
                IconColumn::make('is_active')->boolean(),
                TextColumn::make('floors_count')->counts('floors')->label('Floors'),
                TextColumn::make('flats_count')->counts('flats')->label('Flats'),
            ])
            ->headerActions([CreateAction::make()])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([DeleteBulkAction::make()]);
    }
}
