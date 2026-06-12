<?php

namespace IrepPlugin\FilamentIrep\Filament\Resources\ReservationResource\Pages;

use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\ViewRecord;
use IrepPlugin\FilamentIrep\Filament\Resources\ReservationResource;

class ViewReservation extends ViewRecord
{
    protected static string $resource = ReservationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
