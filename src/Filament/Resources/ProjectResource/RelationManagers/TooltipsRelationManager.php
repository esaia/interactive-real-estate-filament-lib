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
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TooltipsRelationManager extends RelationManager
{
    protected static string $relationship = 'tooltips';

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')->required()->maxLength(255)->columnSpanFull(),

            Section::make('Tooltip Data')->schema([
                TextInput::make('data.url')->label('URL')->url()->nullable(),
                Textarea::make('data.script')->label('Script')->rows(4)->nullable()->columnSpanFull(),
                Toggle::make('data.targetBlank')->label('Open in new tab'),
                Select::make('data.actionType')
                    ->label('Action Type')
                    ->options(['link' => 'Link', 'modal' => 'Modal', 'script' => 'Script'])
                    ->nullable(),
            ])->columns(2)->columnSpanFull(),

            Section::make('Modal Content')->schema([
                TextInput::make('data.modalObject.title')->label('Modal Title')->nullable(),
                Textarea::make('data.modalObject.description')->label('Description')->rows(4)->nullable()->columnSpanFull(),
                FileUpload::make('data.modalObject.modalImage')
                    ->image()->disk('public')->directory('tooltips')->label('Modal Image')->nullable(),
            ])->collapsible()->collapsed()->columnSpanFull(),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('title')->searchable(),
                TextColumn::make('data.actionType')->label('Action Type'),
                TextColumn::make('data.url')->label('URL')->limit(40),
            ])
            ->headerActions([CreateAction::make()])
            ->actions([EditAction::make(), DeleteAction::make()])
            ->bulkActions([DeleteBulkAction::make()]);
    }
}
