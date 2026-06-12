<?php

namespace IrepPlugin\FilamentIrep\Filament\Resources\ProjectResource\Pages;

use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use IrepPlugin\FilamentIrep\Filament\Resources\ProjectResource;

class EditProject extends EditRecord
{
    protected static string $resource = ProjectResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        if (!empty($data['project_image'])) {
            $img = $data['project_image'];
            if (is_array($img)) {
                $url = $img[0]['url'] ?? ($img['url'] ?? null);
                if ($url) {
                    $url = preg_replace('#^https?://[^/]+/storage/#', '', $url);
                }
                $data['project_image'] = $url;
            }
        }

        if (!empty($data['images_360'])) {
            $data['images_360'] = array_values(
                array_filter($data['images_360'], fn ($item) => !empty($item['url']))
            );
        }
        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (!empty($data['images_360'])) {
            $data['images_360'] = array_values(
                array_filter($data['images_360'], fn ($item) => !empty($item['url']))
            );
        }
        return $data;
    }
}
