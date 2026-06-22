<?php

namespace IrepPlugin\FilamentIrep\Filament\Resources;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section as InfolistSection;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use IrepPlugin\FilamentIrep\Filament\Resources\ReservationResource\Pages;
use IrepPlugin\FilamentIrep\Models\Reservation;

class ReservationResource extends Resource
{
    protected static ?string $model = Reservation::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-inbox';

    protected static string|\UnitEnum|null $navigationGroup = 'Real Estate';

    protected static ?int $navigationSort = 3;

    public static function canCreate(): bool
    {
        return false;
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema->components([
            InfolistSection::make('Contact Details')->schema([
                TextEntry::make('name'),
                TextEntry::make('phone')->placeholder('—'),
                TextEntry::make('email')->placeholder('—'),
                TextEntry::make('comment')->placeholder('—')->columnSpanFull(),
            ])->columns(3),

            InfolistSection::make('Flat Info')->schema([
                TextEntry::make('flat.flat_number')->label('Flat Number'),
                TextEntry::make('flat.floor.title')->label('Floor')->placeholder('—'),
                TextEntry::make('flat.block.title')->label('Block')->placeholder('—'),
                TextEntry::make('flat.project.title')->label('Project'),
                TextEntry::make('flat.conf')->label('Status')->badge(),
                TextEntry::make('flat.price')->label('Price')->money('USD')->placeholder('—'),
            ])->columns(3),

            InfolistSection::make('Meta')->schema([
                TextEntry::make('created_at')->dateTime()->label('Submitted At'),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->sortable(),
                TextColumn::make('flat.flat_number')->label('Flat')->searchable(),
                TextColumn::make('flat.project.title')->label('Project')->searchable(),
                TextColumn::make('name')->searchable(),
                TextColumn::make('phone')->copyable()->placeholder('—'),
                TextColumn::make('email')->copyable()->placeholder('—'),
                TextColumn::make('flat.conf')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'available' => 'success',
                        'reserved'  => 'warning',
                        'sold'      => 'danger',
                        default     => 'gray',
                    })
                    ->label('Flat Status'),
                TextColumn::make('created_at')->dateTime()->sortable()->label('Submitted'),
            ])
            ->filters([
                Filter::make('created_at')
                    ->form([
                        DatePicker::make('from')->label('From'),
                        DatePicker::make('until')->label('Until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when($data['from'], fn($q, $d) => $q->whereDate('created_at', '>=', $d))
                            ->when($data['until'], fn($q, $d) => $q->whereDate('created_at', '<=', $d));
                    }),
            ])
            ->actions([ViewAction::make(), DeleteAction::make()])
            ->bulkActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListReservations::route('/'),
            'view'  => Pages\ViewReservation::route('/{record}'),
        ];
    }
}
