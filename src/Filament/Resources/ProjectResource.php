<?php

namespace IrepPlugin\FilamentIrep\Filament\Resources;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ReplicateAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;
use IrepPlugin\FilamentIrep\Filament\Resources\ProjectResource\Pages;
use IrepPlugin\FilamentIrep\Filament\Resources\ProjectResource\RelationManagers;
use IrepPlugin\FilamentIrep\Models\Project;

class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-building-office-2';

    protected static string|\UnitEnum|null $navigationGroup = 'Real Estate';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make()->tabs([
                Tab::make('General')->schema([
                    TextInput::make('title')
                        ->required()
                        ->maxLength(255)
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn (string $state, callable $set) => $set('slug', Str::slug($state))),
                    TextInput::make('slug')
                        ->required()
                        ->maxLength(255)
                        ->unique(Project::class, 'slug', ignoreRecord: true),
                    Placeholder::make('project_image_preview')
                        ->label('Current Image')
                        ->content(function (?Project $record): HtmlString {
                            $value = $record?->project_image;
                            if (! $value) {
                                return new HtmlString('<span style="color:#94a3b8;font-size:0.875rem;">No image uploaded yet.</span>');
                            }
                            $url = is_array($value)
                                ? ($value[0]['url'] ?? ($value['url'] ?? null))
                                : asset('storage/' . $value);
                            if (! $url) {
                                return new HtmlString('<span style="color:#94a3b8;font-size:0.875rem;">No image uploaded yet.</span>');
                            }
                            return new HtmlString(
                                '<img src="' . e($url) . '" style="max-height:120px;border-radius:6px;border:1px solid #e2e8f0;" />'
                            );
                        })
                        ->visibleOn('edit'),
                    FileUpload::make('project_image')
                        ->label('Upload New Image')
                        ->image()
                        ->disk('public')
                        ->directory('projects')
                        ->nullable()
                        ->fetchFileInformation(false),
                ])->columns(1),

                Tab::make('Canvas Editor')->schema([
                    Placeholder::make('canvas_editor_link')
                        ->label('')
                        ->content(fn (?Project $record): HtmlString => $record?->id
                            ? new HtmlString(
                                '<div style="padding:2rem;text-align:center;">'
                                . '<p style="margin-bottom:1rem;color:#64748b;font-size:0.875rem;">Edit the SVG canvas, draw polygons, and configure flats visually.</p>'
                                . '<a href="/admin/irep-admin-page?project=' . $record->id . '" '
                                . 'style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.625rem 1.25rem;background:#1e293b;color:#fff;border-radius:0.5rem;font-size:0.875rem;font-weight:500;text-decoration:none;">'
                                . 'Open Canvas Editor &rarr;</a>'
                                . '</div>'
                            )
                            : new HtmlString(
                                '<div style="padding:2rem;text-align:center;color:#94a3b8;font-size:0.875rem;">'
                                . 'Save the project first, then return here to open the canvas editor.'
                                . '</div>'
                            )
                        )
                        ->columnSpanFull(),
                ]),

                Tab::make('360 Images')->schema([
                    Repeater::make('images_360')
                        ->schema([
                            FileUpload::make('url')
                                ->image()
                                ->disk('public')
                                ->directory('360images')
                                ->label('Image')
                                ->fetchFileInformation(false),
                            TextInput::make('label')->nullable(),
                        ])
                        ->collapsible()
                        ->columnSpanFull(),
                ]),
            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->sortable(),
                ImageColumn::make('project_image')
                    ->label('Image')
                    ->square()
                    ->size(48)
                    ->getStateUsing(function ($record): ?string {
                        $value = $record?->project_image;
                        if (is_array($value)) {
                            return $value[0]['url'] ?? null;
                        }
                        if (is_string($value) && $value !== '') {
                            return str_starts_with($value, 'http') ? $value : asset('storage/' . $value);
                        }
                        return null;
                    }),
                TextColumn::make('title')->searchable()->sortable(),
                TextColumn::make('slug')->searchable()->copyable(),
                TextColumn::make('blocks_count')->counts('blocks')->label('Blocks'),
                TextColumn::make('flats_count')->counts('flats')->label('Flats'),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->actions([
                EditAction::make(),
                ReplicateAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelationManagers(): array
    {
        return [
            RelationManagers\BlocksRelationManager::class,
            RelationManagers\FloorsRelationManager::class,
            RelationManagers\TypesRelationManager::class,
            RelationManagers\FlatsRelationManager::class,
            RelationManagers\TooltipsRelationManager::class,
            RelationManagers\MetaRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListProjects::route('/'),
            'create' => Pages\CreateProject::route('/create'),
            'edit'   => Pages\EditProject::route('/{record}/edit'),
        ];
    }
}
