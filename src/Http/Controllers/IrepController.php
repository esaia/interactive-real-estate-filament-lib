<?php

namespace IrepPlugin\FilamentIrep\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use IrepPlugin\FilamentIrep\Models\Block;
use IrepPlugin\FilamentIrep\Models\Flat;
use IrepPlugin\FilamentIrep\Models\Floor;
use IrepPlugin\FilamentIrep\Models\Project;
use IrepPlugin\FilamentIrep\Models\ProjectMeta;
use IrepPlugin\FilamentIrep\Models\Reservation;
use IrepPlugin\FilamentIrep\Models\Setting;
use IrepPlugin\FilamentIrep\Models\Tooltip;
use IrepPlugin\FilamentIrep\Models\Type;
use Symfony\Component\HttpFoundation\Response;

class IrepController extends Controller
{
    private static array $map = [
        'irep_get_projects'                     => 'getProjects',
        'irep_create_project'                   => 'createProject',
        'irep_update_project'                   => 'updateProject',
        'irep_delete_project'                   => 'deleteProject',

        'irep_get_blocks'                       => 'getBlocks',
        'irep_create_block'                     => 'createBlock',
        'irep_update_block'                     => 'updateBlock',
        'irep_delete_block'                     => 'deleteBlock',
        'irep_change_block_status'              => 'changeBlockStatus',

        'irep_get_floors'                       => 'getFloors',
        'irep_create_floor'                     => 'createFloor',
        'irep_update_floor'                     => 'updateFloor',
        'irep_delete_floor'                     => 'deleteFloor',

        'irep_get_flats'                        => 'getFlats',
        'irep_create_flat'                      => 'createFlat',
        'irep_update_flat'                      => 'updateFlat',
        'irep_delete_flat'                      => 'deleteFlat',
        'irep_change_flat_status'               => 'changeFlatStatus',
        'irep_change_flat_config'               => 'changeFlatConfig',
        'irep_bulk_delete_flats'                => 'bulkDeleteFlats',
        'irep_import_flats_excel'               => 'importFlatsExcel',

        'irep_get_types'                        => 'getTypes',
        'irep_create_type'                      => 'createType',
        'irep_update_type'                      => 'updateType',
        'irep_delete_type'                      => 'deleteType',

        'irep_get_tooltip'                      => 'getTooltips',
        'irep_create_tooltip'                   => 'createTooltip',
        'irep_update_tooltip'                   => 'updateTooltip',
        'irep_delete_tooltip'                   => 'deleteTooltip',

        'irep_get_meta'                         => 'getMeta',
        'irep_create_or_update_meta'            => 'createOrUpdateMeta',
        'irep_get_custom_status_types'          => 'getCustomStatusTypes',
        'irep_update_custom_status_types'       => 'updateCustomStatusTypes',

        'irep_get_table_fields'                 => 'getTableFields',
        'irep_add_table_fields'                 => 'addTableFields',
        'irep_get_table_contact_url'            => 'getTableContactUrl',
        'irep_add_table_contact_url'            => 'addTableContactUrl',
        'irep_get_table_action_svgs'            => 'getTableActionSvgs',
        'irep_save_table_action_svgs'           => 'saveTableActionSvgs',
        'irep_get_table_one_column'             => 'getTableOneColumn',
        'irep_change_table_one_column'          => 'changeTableOneColumn',
        'irep_get_table_whole_row_clickable'    => 'getTableWholeRowClickable',
        'irep_change_table_whole_row_clickable' => 'changeTableWholeRowClickable',

        'irep_get_flat_fields'                  => 'getFlatFields',
        'irep_add_flat_custom_fields'           => 'addFlatCustomFields',

        'irep_get_shortcode_data'               => 'getShortcodeData',

        'irep_get_reservations'                 => 'getReservations',
        'irep_delete_reservation'               => 'deleteReservation',

        'irep_upload_image'                     => 'uploadImage',
        'irep_get_images'                       => 'getImages',
        'irep_delete_image'                     => 'deleteImage',

        'irep_import'                           => 'importProject',
        'irep_export_zip'                       => 'exportZip',
    ];

    public function handle(Request $request): Response
    {
        $action = $request->input('action', '');

        if (!isset(self::$map[$action])) {
            return response()->json(['success' => false, 'data' => 'Unknown action: ' . $action], 400);
        }

        return $this->{self::$map[$action]}($request);
    }

    // ─── Projects ────────────────────────────────────────────────────────────

    private function getProjects(Request $request): JsonResponse
    {
        $id = $request->input('project_id');

        if ($id) {
            $project = Project::with('meta')->find($id);
            $data = $project->toArray();
            $data['project_image'] = $this->normalizeProjectImage($project->project_image);
            $data['images_360'] = $this->normalizeImages360($data['images_360'] ?? []);
            return response()->json(['success' => true, 'data' => $data]);
        }

        $projects = Project::latest()->get()->map(function ($project) {
            $data = $project->toArray();
            $data['project_image'] = $this->normalizeProjectImage($project->project_image);
            return $data;
        });
        return response()->json(['success' => true, 'data' => $projects]);
    }

    private function normalizeImages360(array $images): array
    {
        return array_map(function ($image) {
            return [
                'img'          => $image['img'] ?? '',
                'svg'          => $this->decodeSvg($image['svg'] ?? ''),
                'polygon_data' => $image['polygon_data'] ?? [],
                'svgRef'       => null,
            ];
        }, $images);
    }

    private function normalizeProjectImage(mixed $value): array
    {
        if (is_array($value)) {
            return array_is_list($value) ? $value : [$value];
        }
        if (is_string($value) && $value !== '') {
            return [['id' => $value, 'url' => '/storage/' . $value]];
        }
        return [];
    }

    private function decodeSvg(?string $value): string
    {
        if (!$value) return '';
        $decoded = base64_decode($value, true);
        if ($decoded !== false && str_starts_with(ltrim($decoded), '<')) {
            return $decoded;
        }
        return $value;
    }

    private function decodeOrReturn(mixed $value): mixed
    {
        if (is_array($value) || is_null($value)) {
            return $value;
        }
        return json_decode($value, true) ?? $value;
    }

    /**
     * Build a clean, URL-friendly slug from a title, appending a numeric
     * suffix only when needed to keep it unique (e.g. "360-module-demo-2").
     */
    private function uniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value) ?: 'project';
        $slug = $base;
        $i    = 2;

        while (
            Project::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $base . '-' . $i;
            $i++;
        }

        return $slug;
    }

    private function createProject(Request $request): JsonResponse
    {
        $title = $request->input('title', 'Untitled');
        $project = Project::create([
            'title'         => $title,
            'slug'          => $this->uniqueSlug($title),
            'svg'           => $this->decodeSvg($request->input('svg', '')),
            'polygon_data'  => $this->decodeOrReturn($request->input('polygon_data')) ?? [],
            'images_360'    => $this->decodeOrReturn($request->input('images_360')) ?? [],
            'project_image' => $this->normalizeProjectImage($this->decodeOrReturn($request->input('project_image'))),
        ]);

        return response()->json(['success' => true, 'data' => ['project_id' => $project->id, 'project' => $project]]);
    }

    private function updateProject(Request $request): JsonResponse
    {
        $project = Project::findOrFail($request->input('project_id'));

        $title   = $request->input('title', $project->title);
        $slugRaw = $request->input('slug');
        $slug    = ($slugRaw !== null && trim((string) $slugRaw) !== '')
            ? $this->uniqueSlug($slugRaw, $project->id)
            : $project->slug;

        $project->update([
            'title'         => $title,
            'slug'          => $slug,
            'svg'           => $this->decodeSvg($request->input('svg', $project->svg)),
            'polygon_data'  => $request->has('polygon_data') ? ($this->decodeOrReturn($request->input('polygon_data')) ?? []) : $project->polygon_data,
            'images_360'    => $request->has('images_360') ? ($this->decodeOrReturn($request->input('images_360')) ?? []) : $project->images_360,
            'project_image' => $request->has('project_image') ? $this->decodeOrReturn($request->input('project_image')) : $project->project_image,
        ]);

        return response()->json(['success' => true, 'data' => $project->fresh()]);
    }

    private function deleteProject(Request $request): JsonResponse
    {
        $id = (int) $request->input('project_id');

        // Delete in FK dependency order — avoids MySQL InnoDB multi-level cascade conflicts
        Flat::where('project_id', $id)->delete();   // also cascades Reservation rows
        Floor::where('project_id', $id)->delete();
        Block::where('project_id', $id)->delete();
        Type::where('project_id', $id)->delete();
        Tooltip::where('project_id', $id)->delete();
        ProjectMeta::where('project_id', $id)->delete();
        Project::destroy($id);

        return response()->json(['success' => true, 'data' => null]);
    }

    // ─── Blocks ──────────────────────────────────────────────────────────────

    private function getBlocks(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 99999);
        $page    = (int) $request->input('page', 1);

        $query = Block::where('project_id', $request->input('project_id'));
        $total = $query->count();
        $items = $query->skip(($page - 1) * $perPage)->take($perPage)->get();

        return response()->json(['success' => true, 'data' => ['data' => $items, 'page' => $page, 'per_page' => $perPage, 'total' => $total]]);
    }

    private function createBlock(Request $request): JsonResponse
    {
        $block = Block::create([
            'project_id'   => $request->input('project_id'),
            'title'        => $request->input('title', 'New Block'),
            'is_active'    => true,
            'conf'         => null,
            'svg'          => '',
            'polygon_data' => [],
            'images_360'   => [],
            'block_image'  => $request->input('block_image') ? json_decode($request->input('block_image'), true) : null,
        ]);

        return response()->json(['success' => true, 'data' => $block]);
    }

    private function updateBlock(Request $request): JsonResponse
    {
        $block = Block::findOrFail($request->input('block_id'));
        $block->update([
            'title'        => $request->input('title', $block->title),
            'svg'          => $this->decodeSvg($request->input('svg', $block->svg)),
            'polygon_data' => $request->input('polygon_data') ? $this->decodeOrReturn($request->input('polygon_data')) : $block->polygon_data,
            'images_360'   => $request->input('images_360') ? json_decode($request->input('images_360'), true) : $block->images_360,
            'block_image'  => $request->input('block_image') ? json_decode($request->input('block_image'), true) : $block->block_image,
            'conf'         => $request->input('conf', $block->conf),
        ]);

        return response()->json(['success' => true, 'data' => $block->fresh()]);
    }

    private function deleteBlock(Request $request): JsonResponse
    {
        Block::destroy($request->input('block_id'));
        return response()->json(['success' => true, 'data' => null]);
    }

    private function changeBlockStatus(Request $request): JsonResponse
    {
        $block = Block::findOrFail($request->input('block_id'));
        $block->update(['is_active' => filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN)]);
        return response()->json(['success' => true, 'data' => null]);
    }

    // ─── Floors ──────────────────────────────────────────────────────────────

    private function getFloors(Request $request): JsonResponse
    {
        $perPage     = (int) $request->input('per_page', 99999);
        $page        = (int) $request->input('page', 1);
        $blockFilter = $request->input('block');

        $query = Floor::where('project_id', $request->input('project_id'));
        if ($blockFilter === 'none') {
            $query->whereNull('block_id');
        } elseif ($blockFilter && $blockFilter !== 'all') {
            $query->where('block_id', $blockFilter);
        }

        $total = $query->count();
        $items = $query->orderBy('floor_number')->skip(($page - 1) * $perPage)->take($perPage)->get();

        return response()->json(['success' => true, 'data' => ['data' => $items, 'page' => $page, 'per_page' => $perPage, 'total' => $total]]);
    }

    private function createFloor(Request $request): JsonResponse
    {
        $floor = Floor::create([
            'project_id'   => $request->input('project_id'),
            'block_id'     => $request->input('block_id') ?: null,
            'floor_number' => (int) $request->input('floor_number', 1),
            'title'        => $request->input('title', 'Floor'),
            'conf'         => null,
            'svg'          => '',
            'polygon_data' => [],
            'floor_image'  => $request->input('floor_image') ? json_decode($request->input('floor_image'), true) : null,
        ]);

        return response()->json(['success' => true, 'data' => $floor]);
    }

    private function updateFloor(Request $request): JsonResponse
    {
        $floor = Floor::findOrFail($request->input('floor_id'));
        $floor->update([
            'title'        => $request->input('title', $floor->title),
            'floor_number' => $request->input('floor_number') !== null ? (int) $request->input('floor_number') : $floor->floor_number,
            'block_id'     => $request->input('block_id') ?: null,
            'svg'          => $this->decodeSvg($request->input('svg', $floor->svg)),
            'polygon_data' => $request->input('polygon_data') ? $this->decodeOrReturn($request->input('polygon_data')) : $floor->polygon_data,
            'floor_image'  => $request->input('floor_image') ? json_decode($request->input('floor_image'), true) : $floor->floor_image,
            'conf'         => $request->input('conf', $floor->conf),
        ]);

        return response()->json(['success' => true, 'data' => $floor->fresh()]);
    }

    private function deleteFloor(Request $request): JsonResponse
    {
        Floor::destroy($request->input('floor_id'));
        return response()->json(['success' => true, 'data' => null]);
    }

    // ─── Flats ───────────────────────────────────────────────────────────────

    private function getFlats(Request $request): JsonResponse
    {
        $perPage     = (int) $request->input('per_page', 99999);
        $page        = (int) $request->input('page', 1);
        $blockFilter = $request->input('block');
        $floorFilter = $request->input('floor');
        $search      = trim($request->input('search', ''));
        $sortField   = $request->input('sort_field');
        $sortOrder   = strtoupper($request->input('sort_order', 'ASC')) === 'DESC' ? 'DESC' : 'ASC';

        $allowedSortFields = ['id', 'flat_number', 'floor_id', 'block_id', 'price', 'offer_price', 'conf', 'is_active'];

        $query = Flat::with('type')->where('project_id', $request->input('project_id'));

        if ($blockFilter === 'none') {
            $query->whereNull('block_id');
        } elseif ($blockFilter && $blockFilter !== 'all') {
            $query->where('block_id', $blockFilter);
        }
        if ($floorFilter && $floorFilter !== 'all' && $floorFilter !== '') {
            $query->where('floor_id', $floorFilter);
        }
        if ($search !== '') {
            $query->where('flat_number', 'like', "%{$search}%");
        }
        if ($sortField && in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortOrder);
        }

        $total = $query->count();
        $items = $query->skip(($page - 1) * $perPage)->take($perPage)->get();

        return response()->json(['success' => true, 'data' => ['data' => $items, 'page' => $page, 'per_page' => $perPage, 'total' => $total]]);
    }

    private function createFlat(Request $request): JsonResponse
    {
        $flat = Flat::create([
            'project_id'    => $request->input('project_id'),
            'block_id'      => $request->input('block_id') ?: null,
            'floor_id'      => $request->input('floor_id'),
            'type_id'       => $request->input('type_id') ?: null,
            'flat_number'   => $request->input('flat_number', ''),
            'is_active'     => true,
            'conf'          => $request->input('conf') ?: null,
            'price'         => $request->input('price') ?: null,
            'offer_price'   => $request->input('offer_price') ?: null,
            'request_price' => filter_var($request->input('request_price', false), FILTER_VALIDATE_BOOLEAN),
            'click_action'  => $request->input('click_action') ?: null,
            'follow_link'   => $request->has('follow_link') ? $this->decodeOrReturn($request->input('follow_link')) : null,
            'use_type'      => $request->input('use_type') ?: null,
            'flat_type'     => $request->has('flat_type') ? $this->decodeOrReturn($request->input('flat_type')) : null,
            'files'         => $request->has('files') ? $this->decodeOrReturn($request->input('files')) : null,
        ]);

        return response()->json(['success' => true, 'data' => $flat->load('type')]);
    }

    private function updateFlat(Request $request): JsonResponse
    {
        $flat = Flat::findOrFail($request->input('flat_id'));

        $data = [];
        foreach (['flat_number', 'click_action', 'use_type'] as $field) {
            if ($request->has($field)) $data[$field] = $request->input($field);
        }
        if ($request->has('conf')) $data['conf'] = $request->input('conf') ?: null;
        foreach (['price', 'offer_price'] as $field) {
            if ($request->has($field)) $data[$field] = $request->input($field) ?: null;
        }
        foreach (['is_active', 'request_price'] as $field) {
            if ($request->has($field)) $data[$field] = filter_var($request->input($field), FILTER_VALIDATE_BOOLEAN);
        }
        foreach (['floor_id', 'block_id', 'type_id'] as $field) {
            if ($request->has($field)) $data[$field] = $request->input($field) ?: null;
        }
        foreach (['follow_link', 'files'] as $field) {
            if ($request->has($field)) $data[$field] = $this->decodeOrReturn($request->input($field));
        }
        if ($request->has('flat_type')) {
            $data['flat_type'] = $this->decodeOrReturn($request->input('flat_type'));
        }

        $flat->update($data);
        return response()->json(['success' => true, 'data' => $flat->fresh()->load('type')]);
    }

    private function deleteFlat(Request $request): JsonResponse
    {
        Flat::destroy($request->input('flat_id'));
        return response()->json(['success' => true, 'data' => null]);
    }

    private function changeFlatStatus(Request $request): JsonResponse
    {
        $flat = Flat::findOrFail($request->input('flat_id'));
        $flat->update(['is_active' => filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN)]);
        return response()->json(['success' => true, 'data' => null]);
    }

    private function changeFlatConfig(Request $request): JsonResponse
    {
        $flat = Flat::findOrFail($request->input('flat_id'));
        $flat->update(['conf' => $request->input('config') ?: null]);
        return response()->json(['success' => true, 'data' => $flat->fresh()]);
    }

    private function bulkDeleteFlats(Request $request): JsonResponse
    {
        $ids = $request->input('ids');
        if (is_string($ids)) {
            $ids = json_decode($ids, true);
        }
        $deleted = Flat::whereIn('id', (array) $ids)->delete();
        return response()->json(['success' => true, 'data' => ['deleted' => $deleted]]);
    }

    private function importFlatsExcel(Request $request): JsonResponse
    {
        $projectId = (int) $request->input('project_id');
        $flatsRaw  = $request->input('flats');

        if (!$projectId) {
            return response()->json(['success' => false, 'data' => 'project_id is required']);
        }

        if (is_string($flatsRaw)) {
            $flatsRaw = json_decode($flatsRaw, true);
        }

        if (!is_array($flatsRaw) || empty($flatsRaw)) {
            return response()->json(['success' => false, 'data' => 'No flat rows provided']);
        }

        $imported = 0;
        $failed   = 0;

        foreach ($flatsRaw as $row) {
            if (!is_array($row) || empty($row['flat_number'])) {
                $failed++;
                continue;
            }

            $typeRaw = isset($row['type']) && is_array($row['type']) ? $row['type'] : [];
            $useType = !empty($row['use_type']);
            $typeId  = $useType && !empty($row['type_id']) ? (int) $row['type_id'] : null;

            if ($useType && $typeId) {
                if (!Type::where('id', $typeId)->where('project_id', $projectId)->exists()) {
                    $useType = false;
                    $typeId  = null;
                }
            }

            $blockId = isset($row['block_id']) && $row['block_id'] !== '' ? (int) $row['block_id'] : null;
            if ($blockId && !Block::where('id', $blockId)->where('project_id', $projectId)->exists()) {
                $blockId = null;
            }

            $floorId = isset($row['floor_id']) && $row['floor_id'] !== '' ? (int) $row['floor_id'] : null;
            if ($floorId && !Floor::where('id', $floorId)->where('project_id', $projectId)->exists()) {
                $floorId = null;
            }

            $other = isset($typeRaw['other']) && is_array($typeRaw['other']) ? $typeRaw['other'] : [];

            $flat = Flat::create([
                'project_id'    => $projectId,
                'flat_number'   => (string) $row['flat_number'],
                'price'         => isset($row['price']) ? floatval($row['price']) : null,
                'offer_price'   => isset($row['offer_price']) ? floatval($row['offer_price']) : null,
                'conf'          => isset($row['conf']) && $row['conf'] !== '' ? (string) $row['conf'] : null,
                'floor_id'      => $floorId,
                'block_id'      => $blockId,
                'request_price' => !empty($row['request_price']),
                'is_active'     => true,
                'use_type'      => $useType ? 'true' : 'false',
                'type_id'       => $typeId,
                'click_action'  => isset($row['click_action']) && $row['click_action'] !== '' ? (string) $row['click_action'] : null,
                'follow_link'   => [
                    'link'   => isset($row['follow_link']['link']) ? (string) $row['follow_link']['link'] : '',
                    'target' => !empty($row['follow_link']['target']),
                ],
                'flat_type'     => [
                    'title'       => isset($typeRaw['title']) ? (string) $typeRaw['title'] : '',
                    'teaser'      => isset($typeRaw['teaser']) ? (string) $typeRaw['teaser'] : '',
                    'area_m2'     => isset($typeRaw['area_m2']) ? floatval($typeRaw['area_m2']) : 0.0,
                    'rooms_count' => isset($typeRaw['rooms_count']) ? floatval($typeRaw['rooms_count']) : 0.0,
                    'other'       => array_values(array_filter($other, fn ($o) => is_array($o) && isset($o['key']))),
                    'image_2d'    => [],
                    'image_3d'    => [],
                ],
                'files'         => [],
            ]);

            if ($flat) {
                $imported++;
            } else {
                $failed++;
            }
        }

        return response()->json(['success' => true, 'data' => ['imported' => $imported, 'failed' => $failed]]);
    }

    // ─── Types ───────────────────────────────────────────────────────────────

    private function getTypes(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 99999);
        $page    = (int) $request->input('page', 1);

        $query = Type::where('project_id', $request->input('project_id'));
        $total = $query->count();
        $items = $query->skip(($page - 1) * $perPage)->take($perPage)->get();

        return response()->json(['success' => true, 'data' => ['data' => $items, 'page' => $page, 'per_page' => $perPage, 'total' => $total]]);
    }

    private function createType(Request $request): JsonResponse
    {
        $type = Type::create([
            'project_id'  => $request->input('project_id'),
            'title'       => $request->input('title', 'New Type'),
            'teaser'      => $request->input('teaser') ?: null,
            'area_m2'     => $request->input('area_m2') ?: null,
            'rooms_count' => $request->input('rooms_count') ?: null,
            'image_2d'    => $request->has('image_2d') ? $this->decodeOrReturn($request->input('image_2d')) : null,
            'image_3d'    => $request->has('image_3d') ? $this->decodeOrReturn($request->input('image_3d')) : null,
            'gallery'     => $request->has('gallery') ? ($this->decodeOrReturn($request->input('gallery')) ?? []) : [],
            'other'       => $request->has('other') ? ($this->decodeOrReturn($request->input('other')) ?? []) : [],
        ]);

        return response()->json(['success' => true, 'data' => $type]);
    }

    private function updateType(Request $request): JsonResponse
    {
        $type = Type::findOrFail($request->input('type_id'));
        $type->update([
            'title'       => $request->input('title', $type->title),
            'teaser'      => $request->input('teaser') ?: $type->teaser,
            'area_m2'     => $request->input('area_m2') ?: $type->area_m2,
            'rooms_count' => $request->input('rooms_count') ?: $type->rooms_count,
            'image_2d'    => $request->has('image_2d') ? $this->decodeOrReturn($request->input('image_2d')) : $type->image_2d,
            'image_3d'    => $request->has('image_3d') ? $this->decodeOrReturn($request->input('image_3d')) : $type->image_3d,
            'gallery'     => $request->has('gallery') ? ($this->decodeOrReturn($request->input('gallery')) ?? []) : $type->gallery,
            'other'       => $request->has('other') ? ($this->decodeOrReturn($request->input('other')) ?? []) : $type->other,
        ]);

        return response()->json(['success' => true, 'data' => $type->fresh()]);
    }

    private function deleteType(Request $request): JsonResponse
    {
        Type::destroy($request->input('type_id'));
        return response()->json(['success' => true, 'data' => null]);
    }

    // ─── Tooltips ─────────────────────────────────────────────────────────────

    private function getTooltips(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 99999);
        $page    = (int) $request->input('page', 1);

        $query = Tooltip::where('project_id', $request->input('project_id'));
        $total = $query->count();
        $items = $query->skip(($page - 1) * $perPage)->take($perPage)->get();

        return response()->json(['success' => true, 'data' => ['data' => $items, 'page' => $page, 'per_page' => $perPage, 'total' => $total]]);
    }

    private function createTooltip(Request $request): JsonResponse
    {
        $data = $request->input('data', []);
        $tooltip = Tooltip::create([
            'project_id' => $request->input('project_id'),
            'title'      => $request->input('title', 'Action'),
            'data'       => is_string($data) ? json_decode($data, true) : $data,
        ]);

        return response()->json(['success' => true, 'data' => $tooltip]);
    }

    private function updateTooltip(Request $request): JsonResponse
    {
        $tooltip = Tooltip::findOrFail($request->input('tooltip_id') ?? $request->input('action_id'));
        $data = $request->input('data');
        $tooltip->update([
            'title' => $request->input('title', $tooltip->title),
            'data'  => $data ? (is_string($data) ? json_decode($data, true) : $data) : $tooltip->data,
        ]);

        return response()->json(['success' => true, 'data' => $tooltip->fresh()]);
    }

    private function deleteTooltip(Request $request): JsonResponse
    {
        Tooltip::destroy($request->input('tooltip_id') ?? $request->input('action_id'));
        return response()->json(['success' => true, 'data' => null]);
    }

    // ─── Meta ─────────────────────────────────────────────────────────────────

    private function getMeta(Request $request): JsonResponse
    {
        $meta = ProjectMeta::where('project_id', $request->input('project_id'))->get();
        return response()->json(['success' => true, 'data' => $meta]);
    }

    private function createOrUpdateMeta(Request $request): JsonResponse
    {
        $projectId = $request->input('project_id');
        $metaData  = $request->input('meta_data');

        if (is_string($metaData)) {
            $metaData = json_decode($metaData, true);
        }

        foreach ((array) $metaData as $item) {
            $key   = $item['key'] ?? $item['meta_key'] ?? null;
            $value = $item['value'] ?? $item['meta_value'] ?? '';
            if (!$key) continue;

            ProjectMeta::updateOrCreate(
                ['project_id' => $projectId, 'meta_key' => $key],
                ['meta_value' => $value]
            );
        }

        return response()->json(['success' => true, 'data' => null]);
    }

    private function getCustomStatusTypes(Request $request): JsonResponse
    {
        return response()->json(['success' => true, 'data' => Setting::get('irep_custom_status_types', [])]);
    }

    private function updateCustomStatusTypes(Request $request): JsonResponse
    {
        $value = $request->input('value');
        if (is_string($value)) {
            $value = json_decode($value, true);
        }
        Setting::updateOrCreate(['key' => 'irep_custom_status_types'], ['value' => json_encode($value), 'type' => 'json']);
        return response()->json(['success' => true, 'data' => null]);
    }

    // ─── Table Settings ───────────────────────────────────────────────────────

    private function getTableFields(Request $request): JsonResponse
    {
        return response()->json(['success' => true, 'data' => Setting::get('irep_table_fields', [])]);
    }

    private function addTableFields(Request $request): JsonResponse
    {
        $fields = $request->input('fields');
        if (is_string($fields)) $fields = json_decode($fields, true);
        Setting::updateOrCreate(['key' => 'irep_table_fields'], ['value' => json_encode($fields), 'type' => 'json']);
        return response()->json(['success' => true, 'data' => null]);
    }

    private function getTableContactUrl(Request $request): JsonResponse
    {
        return response()->json(['success' => true, 'data' => [
            'contactUrl'              => Setting::get('irep_table_contact_url', ''),
            'flatFieldQueryParameter' => Setting::get('flatFieldQueryParameter', 'flat'),
        ]]);
    }

    private function addTableContactUrl(Request $request): JsonResponse
    {
        Setting::updateOrCreate(['key' => 'irep_table_contact_url'], ['value' => $request->input('contactUrl', ''), 'type' => 'string']);
        Setting::updateOrCreate(['key' => 'flatFieldQueryParameter'], ['value' => $request->input('flatFieldQueryParameter', 'flat'), 'type' => 'string']);
        return response()->json(['success' => true, 'data' => null]);
    }

    private function getTableActionSvgs(Request $request): JsonResponse
    {
        $defaults = ['contactSvg' => '', 'downloadSvg' => '', 'magnifySvg' => ''];
        return response()->json(['success' => true, 'data' => Setting::get('irep_table_action_svgs', $defaults)]);
    }

    private function saveTableActionSvgs(Request $request): JsonResponse
    {
        $svgs = ['contactSvg' => $request->input('contactSvg', ''), 'downloadSvg' => $request->input('downloadSvg', ''), 'magnifySvg' => $request->input('magnifySvg', '')];
        Setting::updateOrCreate(['key' => 'irep_table_action_svgs'], ['value' => json_encode($svgs), 'type' => 'json']);
        return response()->json(['success' => true, 'data' => null]);
    }

    private function getTableOneColumn(Request $request): JsonResponse
    {
        return response()->json(['success' => true, 'data' => (bool) Setting::get('irep_table_one_column', false)]);
    }

    private function changeTableOneColumn(Request $request): JsonResponse
    {
        $val = filter_var($request->input('oneColumnOnResponsive', false), FILTER_VALIDATE_BOOLEAN);
        Setting::updateOrCreate(['key' => 'irep_table_one_column'], ['value' => $val ? '1' : '0', 'type' => 'boolean']);
        return response()->json(['success' => true, 'data' => null]);
    }

    private function getTableWholeRowClickable(Request $request): JsonResponse
    {
        return response()->json(['success' => true, 'data' => (bool) Setting::get('irep_table_whole_row_clickable', false)]);
    }

    private function changeTableWholeRowClickable(Request $request): JsonResponse
    {
        $val = filter_var($request->input('wholeRowClickable', false), FILTER_VALIDATE_BOOLEAN);
        Setting::updateOrCreate(['key' => 'irep_table_whole_row_clickable'], ['value' => $val ? '1' : '0', 'type' => 'boolean']);
        return response()->json(['success' => true, 'data' => null]);
    }

    // ─── Flat Fields ─────────────────────────────────────────────────────────

    private function getFlatFields(Request $request): JsonResponse
    {
        $fields = Setting::get('irep_flat_custom_fields', []);
        return response()->json(['success' => true, 'data' => array_values((array) $fields)]);
    }

    private function addFlatCustomFields(Request $request): JsonResponse
    {
        $fields = $request->input('fields');
        if (is_string($fields)) $fields = json_decode($fields, true);
        Setting::updateOrCreate(['key' => 'irep_flat_custom_fields'], ['value' => json_encode($fields), 'type' => 'json']);
        return response()->json(['success' => true, 'data' => null]);
    }

    // ─── Shortcode Data ───────────────────────────────────────────────────────

    private function getShortcodeData(Request $request): JsonResponse
    {
        $project = Project::with(['meta', 'blocks', 'floors', 'flats.type', 'types', 'tooltips'])
            ->find($request->input('project_id'));

        if (!$project) {
            return response()->json(['success' => false, 'data' => 'Project not found'], 404);
        }

        $customTypesSetting = Setting::where('key', 'irep_custom_status_types')->first();
        $customTypes = $customTypesSetting ? json_decode($customTypesSetting->value, true) : [];
        $meta = $project->meta->toArray();
        $meta[] = ['meta_key' => 'custom_types', 'meta_value' => is_array($customTypes) ? $customTypes : []];

        return response()->json(['success' => true, 'data' => [
            'project' => $project,
            'blocks'  => $project->blocks,
            'floors'  => $project->floors,
            'flats'   => $project->flats,
            'types'   => $project->types,
            'meta'    => $meta,
            'actions' => $project->tooltips,
        ]]);
    }

    // ─── Reservations ─────────────────────────────────────────────────────────

    private function getReservations(Request $request): JsonResponse
    {
        $perPage   = (int) $request->input('per_page', 20);
        $page      = (int) $request->input('page', 1);
        $search    = $request->input('search', '');
        $sortField = $request->input('sort_field', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        $allowedSort = ['id', 'name', 'email', 'phone', 'created_at'];
        if (!in_array($sortField, $allowedSort)) $sortField = 'created_at';

        $query = Reservation::with(['flat.project', 'flat.floor', 'flat.block'])
            ->when($search, fn ($q) => $q->where(function ($q2) use ($search) {
                $q2->where('name', 'like', "%$search%")
                   ->orWhere('email', 'like', "%$search%")
                   ->orWhere('phone', 'like', "%$search%");
            }))
            ->orderBy($sortField, $sortOrder === 'asc' ? 'asc' : 'desc');

        $total = $query->count();
        $items = $query->skip(($page - 1) * $perPage)->take($perPage)->get()->map(fn ($r) => [
            'id'           => $r->id,
            'name'         => $r->name,
            'email'        => $r->email,
            'phone'        => $r->phone,
            'comment'      => $r->comment,
            'created_at'   => $r->created_at,
            'flat_id'      => $r->flat_id,
            'flat_name'    => $r->flat?->flat_number,
            'flat_conf'    => $r->flat?->conf,
            'flat_price'   => $r->flat?->price,
            'offer_price'  => $r->flat?->offer_price,
            'flat_active'  => $r->flat?->is_active,
            'floor_number' => $r->flat?->floor?->floor_number,
            'block_id'     => $r->flat?->block_id,
            'block_name'   => $r->flat?->block?->title,
            'project_id'   => $r->flat?->project_id,
            'project_name' => $r->flat?->project?->title,
        ]);

        return response()->json(['success' => true, 'data' => ['data' => $items, 'page' => $page, 'per_page' => $perPage, 'total' => $total]]);
    }

    private function deleteReservation(Request $request): JsonResponse
    {
        Reservation::destroy($request->input('record_id'));
        return response()->json(['success' => true, 'data' => null]);
    }

    // ─── Image Upload ─────────────────────────────────────────────────────────

    private function uploadImage(Request $request): JsonResponse
    {
        if (!$request->hasFile('file')) {
            return response()->json(['success' => false, 'data' => 'No file provided'], 422);
        }

        $file = $request->file('file');

        // Preserve the original filename (so numeric names like 000, 001… stay
        // sortable) and append a short unique suffix to avoid collisions.
        $original  = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $ext       = $file->getClientOriginalExtension() ?: $file->guessExtension();
        $base      = Str::slug($original) ?: 'image';
        $filename  = $base . '-' . Str::lower(Str::random(8)) . ($ext ? '.' . $ext : '');

        $path = $file->storeAs('irep/images', $filename, 'public');
        $url  = '/storage/' . $path;

        $w = 0;
        $h = 0;
        $mime = $file->getMimeType() ?? '';
        if (!str_contains($mime, 'pdf') && !str_contains($mime, 'video')) {
            [$w, $h] = @getimagesize(Storage::disk('public')->path($path)) ?: [0, 0];
        }

        $sizeEntry = ['url' => $url, 'width' => $w, 'height' => $h, 'orientation' => $w >= $h ? 'landscape' : 'portrait'];

        return response()->json(['success' => true, 'data' => [
            'id'       => abs(crc32($path)),
            'url'      => $url,
            'alt'      => '',
            'title'    => $file->getClientOriginalName(),
            'filename' => basename($path),
            'width'    => $w,
            'height'   => $h,
            'sizes'    => ['thumbnail' => $sizeEntry, 'medium' => $sizeEntry, 'large' => $sizeEntry, 'full' => $sizeEntry],
        ]]);
    }

    private function getImages(Request $request): JsonResponse
    {
        $search  = strtolower(trim($request->input('search', '')));
        $page    = max(1, (int) $request->input('page', 1));
        $perPage = 40;
        $disk    = Storage::disk('public');
        $dir     = 'irep/images';

        if (!$disk->exists($dir)) {
            return response()->json(['success' => true, 'data' => ['images' => [], 'total' => 0, 'page' => $page]]);
        }

        $allFiles = collect($disk->files($dir))
            ->filter(fn ($f) => preg_match('/\.(jpe?g|png|gif|webp|svg|pdf|mp4)$/i', $f))
            ->sortByDesc(fn ($f) => $disk->lastModified($f))
            ->values();

        if ($search) {
            $allFiles = $allFiles->filter(fn ($f) => str_contains(strtolower(basename($f)), $search))->values();
        }

        $total  = $allFiles->count();
        $sliced = $allFiles->slice(($page - 1) * $perPage, $perPage)->values();

        $images = $sliced->map(function ($path) use ($disk) {
            $url  = '/storage/' . $path;
            $name = basename($path);
            $w = 0; $h = 0;
            $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
            if (!in_array($ext, ['pdf', 'mp4'])) {
                [$w, $h] = @getimagesize($disk->path($path)) ?: [0, 0];
            }
            $sizeEntry = ['url' => $url, 'width' => $w, 'height' => $h, 'orientation' => $w >= $h ? 'landscape' : 'portrait'];
            return [
                'id'                    => abs(crc32($path)),
                'url'                   => $url,
                'filename'              => $name,
                'title'                 => $name,
                'alt'                   => '',
                'width'                 => $w,
                'height'                => $h,
                'path'                  => $path,
                'date'                  => date('Y-m-d H:i', $disk->lastModified($path)),
                'filesizeHumanReadable' => $this->humanFilesize($disk->size($path)),
                'sizes'                 => ['thumbnail' => $sizeEntry, 'medium' => $sizeEntry, 'large' => $sizeEntry, 'full' => $sizeEntry],
            ];
        })->values();

        return response()->json(['success' => true, 'data' => ['images' => $images, 'total' => $total, 'page' => $page, 'per_page' => $perPage]]);
    }

    private function deleteImage(Request $request): JsonResponse
    {
        $path = $request->input('path');
        if (!$path || !str_starts_with($path, 'irep/images/')) {
            return response()->json(['success' => false, 'data' => 'Invalid path'], 422);
        }
        Storage::disk('public')->delete($path);
        return response()->json(['success' => true]);
    }

    // ─── Export / Import / Stubs ─────────────────────────────────────────────

    private function exportZip(Request $request): Response
    {
        $project = Project::with(['types', 'blocks', 'floors', 'flats', 'tooltips', 'meta'])
            ->find($request->input('project_id'));

        if (!$project) {
            return response()->json(['success' => false, 'data' => 'Project not found.'], 404);
        }

        $disk = Storage::disk('public');

        // Image registries (inverse of the importer's maps)
        $imageMap      = []; // url        => zip relative path
        $attachmentMap = []; // attach id  => url
        $zipFiles      = []; // zip rel    => absolute source path
        $pathToId      = []; // storage path => attach id (dedupe)
        $nextId        = 1;

        // Register an image by its storage path; returns a synthetic attachment id.
        $register = function (?string $storagePath) use (
            &$imageMap, &$attachmentMap, &$zipFiles, &$pathToId, &$nextId, $disk
        ): ?string {
            if (!$storagePath) return null;
            $storagePath = ltrim($storagePath, '/');
            if (isset($pathToId[$storagePath])) return $pathToId[$storagePath];

            $abs = $disk->path($storagePath);
            if (!is_file($abs)) return null;

            $id     = (string) $nextId++;
            $url    = '/storage/' . $storagePath;
            $zipRel = 'images/' . $id . '-' . basename($storagePath);

            $imageMap[$url]         = $zipRel;
            $attachmentMap[$id]     = $url;
            $zipFiles[$zipRel]      = $abs;
            $pathToId[$storagePath] = $id;
            return $id;
        };

        // Resolve the disk-relative storage path for an image entry. Entries come in
        // two shapes: native ({id: "irep/images/x.png", url}) and WordPress-imported
        // ({id: 3423314611, url: "/storage/irep/images/x.mp4", filename, sizes}). The
        // `url` always holds the real /storage path, so prefer it; fall back to id.
        $pathOf = function ($entry): ?string {
            $candidate = null;
            if (is_string($entry)) {
                $candidate = $entry;
            } elseif (is_array($entry)) {
                foreach (['url', 'id', 'filename'] as $key) {
                    $val = $entry[$key] ?? null;
                    if (is_string($val) && $val !== '') { $candidate = $val; break; }
                }
            }
            if (!is_string($candidate) || $candidate === '') return null;
            if (($pos = strpos($candidate, '/storage/')) !== false) {
                $candidate = substr($candidate, $pos + strlen('/storage/'));
            }
            return ltrim($candidate, '/') ?: null;
        };

        // First image of a single-image field ({id,url}[] or string) → attach id string.
        $firstId = function ($field) use ($register, $pathOf): string {
            $first = null;
            if (is_string($field) && $field !== '') {
                $first = $field;
            } elseif (is_array($field) && !empty($field)) {
                $first = $field[0] ?? reset($field);
            }
            return (string) ($register($pathOf($first)) ?? '');
        };

        // Multi-image field ({id,url}[]) → JSON array of attach ids (importer json_decodes).
        $idJson = function ($field) use ($register, $pathOf): string {
            $ids = [];
            if (is_array($field)) {
                foreach ($field as $img) {
                    $rid = $register($pathOf($img));
                    if ($rid !== null) $ids[] = $rid;
                }
            }
            return json_encode($ids);
        };

        // 360 images ({img,svg,polygon_data}[]) — img is a /storage/... url.
        $images360 = function ($field) use ($register, $pathOf): array {
            $out = [];
            if (is_array($field)) {
                foreach ($field as $item) {
                    if (!is_array($item)) continue;
                    $img = $item['img'] ?? '';
                    $sp  = $pathOf($img);
                    $rid = $register($sp);
                    $out[] = [
                        'img'          => $rid !== null ? '/storage/' . $sp : $img,
                        'svg'          => $item['svg'] ?? '',
                        'polygon_data' => $item['polygon_data'] ?? [],
                    ];
                }
            }
            return $out;
        };

        $strId = fn ($v) => $v !== null ? (string) $v : null;

        $data = [
            'irep_project' => [
                'id'            => (string) $project->id,
                'title'         => $project->title,
                'svg'           => $project->svg ?? '',
                'polygon_data'  => $project->polygon_data ?? [],
                '360images'     => json_encode($images360($project->images_360)),
                'project_image' => $firstId($project->project_image),
            ],
            'irep_types'        => [],
            'irep_blocks'       => [],
            'irep_floors'       => [],
            'irep_flats'        => [],
            'irep_tooltip'      => [],
            'irep_project_meta' => [],
        ];

        foreach ($project->types as $t) {
            $data['irep_types'][] = [
                'id'          => (string) $t->id,
                'title'       => $t->title,
                'teaser'      => $t->teaser,
                'area_m2'     => $t->area_m2,
                'rooms_count' => $t->rooms_count,
                'image_2d'    => $idJson($t->image_2d),
                'image_3d'    => $idJson($t->image_3d),
                'gallery'     => $idJson($t->gallery),
                'other'       => $t->other ?? [],
            ];
        }

        foreach ($project->blocks as $b) {
            $data['irep_blocks'][] = [
                'id'           => (string) $b->id,
                'title'        => $b->title,
                'is_active'    => $b->is_active,
                'conf'         => $b->conf,
                'svg'          => $b->svg ?? '',
                'polygon_data' => $b->polygon_data ?? [],
                '360images'    => json_encode($images360($b->images_360)),
                'block_image'  => $firstId($b->block_image),
            ];
        }

        foreach ($project->floors as $f) {
            $data['irep_floors'][] = [
                'id'           => (string) $f->id,
                'block_id'     => $strId($f->block_id),
                'floor_number' => $f->floor_number,
                'title'        => $f->title,
                'conf'         => $f->conf,
                'svg'          => $f->svg ?? '',
                'polygon_data' => $f->polygon_data ?? [],
                'floor_image'  => $firstId($f->floor_image),
            ];
        }

        foreach ($project->flats as $fl) {
            $data['irep_flats'][] = [
                'id'            => (string) $fl->id,
                'block_id'      => $strId($fl->block_id),
                'floor_id'      => $strId($fl->floor_id),
                'type_id'       => $strId($fl->type_id),
                'flat_number'   => $fl->flat_number,
                'is_active'     => $fl->is_active,
                'conf'          => $fl->conf,
                'price'         => $fl->price,
                'offer_price'   => $fl->offer_price,
                'request_price' => $fl->request_price,
                'click_action'  => $fl->click_action,
                'follow_link'   => $fl->follow_link ?? null,
                // importer treats '0'/falsy as false, anything else as true
                'use_type'      => in_array($fl->use_type, ['true', true, 1, '1'], true) ? '1' : '0',
                'type'          => $fl->flat_type ?? null,
                'files'         => $idJson($fl->files),
            ];
        }

        foreach ($project->tooltips as $tt) {
            $data['irep_tooltip'][] = [
                'id'    => (string) $tt->id,
                'title' => $tt->title,
                'data'  => $tt->data ?? [],
            ];
        }

        foreach ($project->meta as $m) {
            $data['irep_project_meta'][] = [
                'meta_key'   => $m->meta_key,
                'meta_value' => $m->meta_value,
            ];
        }

        $jsonFlags = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
        $tmpZip    = tempnam(sys_get_temp_dir(), 'irep_export_');

        $zip = new \ZipArchive();
        if ($zip->open($tmpZip, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
            return response()->json(['success' => false, 'data' => 'Could not create ZIP file.'], 500);
        }

        $zip->addFromString('project_data.json', json_encode($data, $jsonFlags));
        $zip->addFromString('image_map.json', json_encode($imageMap, $jsonFlags));
        $zip->addFromString('attachment_id_map.json', json_encode($attachmentMap, $jsonFlags));
        foreach ($zipFiles as $rel => $abs) {
            $zip->addFile($abs, $rel);
        }
        $zip->close();

        return response()
            ->download($tmpZip, 'project_' . $project->id . '.zip', ['Content-Type' => 'application/zip'])
            ->deleteFileAfterSend(true);
    }

    private function importProject(Request $request): JsonResponse
    {
        $file = $request->file('file');
        if (!$file) {
            return response()->json(['success' => false, 'data' => 'No file was received. It may exceed the upload size limit (upload_max_filesize / post_max_size).'], 422);
        }
        if (!$file->isValid()) {
            return response()->json(['success' => false, 'data' => 'Upload failed (PHP error code ' . $file->getError() . '): ' . $file->getErrorMessage()], 422);
        }
        if (strtolower($file->getClientOriginalExtension()) !== 'zip') {
            return response()->json(['success' => false, 'data' => 'Please upload a valid ZIP file.'], 422);
        }

        $tmpDir = sys_get_temp_dir() . '/irep_import_' . uniqid();
        mkdir($tmpDir, 0777, true);

        try {
            $zip = new \ZipArchive();
            $opened = $zip->open($file->getPathname());
            if ($opened !== true) {
                $reasons = [
                    \ZipArchive::ER_NOZIP   => 'not a zip archive',
                    \ZipArchive::ER_INCONS  => 'zip archive inconsistent',
                    \ZipArchive::ER_CRC     => 'CRC error (file corrupt/truncated)',
                    \ZipArchive::ER_OPEN    => 'cannot open file',
                    \ZipArchive::ER_READ    => 'read error',
                    \ZipArchive::ER_MEMORY  => 'out of memory',
                ];
                $detail = $reasons[$opened] ?? ('error code ' . $opened);
                $size   = @filesize($file->getPathname());
                return response()->json([
                    'success' => false,
                    'data'    => "Failed to open ZIP file: {$detail} (received {$size} bytes).",
                ], 422);
            }
            $zip->extractTo($tmpDir);
            $zip->close();

            $projectData    = json_decode(file_get_contents($tmpDir . '/project_data.json'), true);
            $imageMap       = json_decode(file_get_contents($tmpDir . '/image_map.json'), true) ?? [];
            $attachmentMap  = json_decode(file_get_contents($tmpDir . '/attachment_id_map.json'), true) ?? [];

            // ── Image upload phase ────────────────────────────────────────────
            $disk = Storage::disk('public');

            // Track which zip paths we already copied (avoid duplicates across maps)
            $zipPathToStoragePath = [];

            $copyImage = function (string $zipRelPath) use ($tmpDir, $disk, &$zipPathToStoragePath): ?string {
                if (isset($zipPathToStoragePath[$zipRelPath])) {
                    return $zipPathToStoragePath[$zipRelPath];
                }
                $fullPath = $tmpDir . '/' . $zipRelPath;
                if (!file_exists($fullPath)) {
                    return null;
                }
                $originalName = basename($zipRelPath);
                $storagePath  = 'irep/images/' . $originalName;
                if (!$disk->exists($storagePath)) {
                    $disk->put($storagePath, file_get_contents($fullPath));
                }
                $zipPathToStoragePath[$zipRelPath] = $storagePath;
                return $storagePath;
            };

            // attachment_id → storage path
            $attachIdToStoragePath = [];
            foreach ($attachmentMap as $id => $url) {
                if (isset($imageMap[$url])) {
                    $path = $copyImage($imageMap[$url]);
                    if ($path) {
                        $attachIdToStoragePath[(string) $id] = $path;
                    }
                }
            }

            // WordPress URL → storage path (for 360 img fields)
            $urlToStoragePath = [];
            foreach ($imageMap as $url => $zipRelPath) {
                $path = $copyImage($zipRelPath);
                if ($path) {
                    $urlToStoragePath[$url] = $path;
                }
            }

            // ── Helper closures ───────────────────────────────────────────────
            $makeObj = fn (string $p) => ['id' => $p, 'url' => '/storage/' . $p];

            $resolveId = function (?string $id) use ($attachIdToStoragePath, $makeObj): ?array {
                if (!$id || !isset($attachIdToStoragePath[$id])) return null;
                return $makeObj($attachIdToStoragePath[$id]);
            };

            $resolveIdArray = function (array $ids) use ($resolveId): array {
                return array_values(array_filter(array_map(fn ($id) => $resolveId((string) $id), $ids)));
            };

            $resolveIdJson = function (?string $json) use ($resolveIdArray): array {
                if (!$json) return [];
                $ids = json_decode($json, true);
                return is_array($ids) ? $resolveIdArray($ids) : [];
            };

            $decodeJson = function (mixed $val): mixed {
                if (is_array($val) || is_null($val)) return $val;
                return json_decode($val, true) ?? $val;
            };

            $resolve360Images = function (?string $json) use ($urlToStoragePath, $makeObj): array {
                if (!$json) return [];
                $items = is_string($json) ? (json_decode($json, true) ?? []) : $json;
                return array_map(function ($item) use ($urlToStoragePath, $makeObj) {
                    $imgUrl  = $item['img'] ?? '';
                    $newPath = $urlToStoragePath[$imgUrl] ?? null;
                    return [
                        'img'          => $newPath ? '/storage/' . $newPath : $imgUrl,
                        'svg'          => $item['svg'] ?? '',
                        'polygon_data' => $item['polygon_data'] ?? [],
                    ];
                }, $items);
            };

            $remapPolygon = function (array $items) use (&$blockIdMap, &$floorIdMap, &$flatIdMap): array {
                return array_map(function ($item) use (&$blockIdMap, &$floorIdMap, &$flatIdMap) {
                    $type  = $item['type'] ?? '';
                    $oldId = (string) ($item['id'] ?? '');
                    $newId = match ($type) {
                        'block' => (string) ($blockIdMap[$oldId] ?? $oldId),
                        'floor' => (string) ($floorIdMap[$oldId] ?? $oldId),
                        'flat'  => (string) ($flatIdMap[$oldId]  ?? $oldId),
                        default => $oldId,
                    };
                    return array_merge($item, ['id' => $newId]);
                }, $items);
            };

            // ── Phase 2: Create records ───────────────────────────────────────
            $blockIdMap = [];
            $floorIdMap = [];
            $flatIdMap  = [];

            $proj       = $projectData['irep_project'];
            $projImg    = $resolveId((string) ($proj['project_image'] ?? ''));

            $project = Project::create([
                'title'         => $proj['title'],
                'slug'          => $this->uniqueSlug($proj['title']),
                'svg'           => $proj['svg'] ?? '',
                'polygon_data'  => [],
                'images_360'    => $resolve360Images($proj['360images'] ?? null),
                'project_image' => $projImg ? [$projImg] : [],
            ]);

            // Types
            $typeIdMap = [];
            foreach ($projectData['irep_types'] as $t) {
                $type = Type::create([
                    'project_id'  => $project->id,
                    'title'       => $t['title'],
                    'teaser'      => $t['teaser'] ?: null,
                    'area_m2'     => $t['area_m2'] ?: null,
                    'rooms_count' => $t['rooms_count'] ?: null,
                    'image_2d'    => $resolveIdJson($t['image_2d'] ?? null),
                    'image_3d'    => $resolveIdJson($t['image_3d'] ?? null),
                    'gallery'     => $resolveIdJson($t['gallery'] ?? null),
                    'other'       => $decodeJson($t['other'] ?? null) ?? [],
                ]);
                $typeIdMap[(string) $t['id']] = $type->id;
            }

            // Blocks
            $createdBlocks    = []; // old_id => ['model' => Block, 'data' => array]
            foreach ($projectData['irep_blocks'] as $b) {
                $blockImg = $resolveId((string) ($b['block_image'] ?? ''));
                $block    = Block::create([
                    'project_id'   => $project->id,
                    'title'        => $b['title'],
                    'is_active'    => (bool) ($b['is_active'] ?? true),
                    'conf'         => $b['conf'] ?: null,
                    'svg'          => $b['svg'] ?? '',
                    'polygon_data' => [],
                    'images_360'   => $resolve360Images($b['360images'] ?? null),
                    'block_image'  => $blockImg ? [$blockImg] : null,
                ]);
                $blockIdMap[(string) $b['id']] = $block->id;
                $createdBlocks[(string) $b['id']] = ['model' => $block, 'data' => $b];
            }

            // Floors
            $createdFloors = []; // old_id => ['model' => Floor, 'data' => array]
            foreach ($projectData['irep_floors'] as $f) {
                $floorImg  = $resolveId((string) ($f['floor_image'] ?? ''));
                $newBlockId = isset($f['block_id']) ? ($blockIdMap[(string) $f['block_id']] ?? null) : null;
                $floor     = Floor::create([
                    'project_id'   => $project->id,
                    'block_id'     => $newBlockId,
                    'floor_number' => (int) ($f['floor_number'] ?? 0),
                    'title'        => $f['title'],
                    'conf'         => $f['conf'] ?: null,
                    'svg'          => $f['svg'] ?? '',
                    'polygon_data' => [],
                    'floor_image'  => $floorImg ? [$floorImg] : null,
                ]);
                $floorIdMap[(string) $f['id']] = $floor->id;
                $createdFloors[(string) $f['id']] = ['model' => $floor, 'data' => $f];
            }

            // Flats
            foreach ($projectData['irep_flats'] as $fl) {
                $newBlockId = isset($fl['block_id']) ? ($blockIdMap[(string) $fl['block_id']] ?? null) : null;
                $newFloorId = isset($fl['floor_id']) ? ($floorIdMap[(string) $fl['floor_id']] ?? null) : null;
                $newTypeId  = isset($fl['type_id'])  ? ($typeIdMap[(string) $fl['type_id']] ?? null)   : null;

                $filesRaw = $fl['files'] ?? null;
                $fileIds  = is_string($filesRaw) ? (json_decode($filesRaw, true) ?? []) : ($filesRaw ?? []);
                $files    = is_array($fileIds) ? $resolveIdArray(array_map('strval', $fileIds)) : [];

                $flat = Flat::create([
                    'project_id'    => $project->id,
                    'block_id'      => $newBlockId,
                    'floor_id'      => $newFloorId,
                    'type_id'       => $newTypeId,
                    'flat_number'   => $fl['flat_number'],
                    'is_active'     => (bool) ($fl['is_active'] ?? true),
                    'conf'          => $fl['conf'] ?: null,
                    'price'         => $fl['price'] ?: null,
                    'offer_price'   => $fl['offer_price'] ?: null,
                    'request_price' => (bool) ($fl['request_price'] ?? false),
                    'click_action'  => $fl['click_action'] ?: null,
                    'follow_link'   => $decodeJson($fl['follow_link'] ?? null),
                    'use_type'      => ($fl['use_type'] && $fl['use_type'] !== '0') ? 'true' : 'false',
                    'flat_type'     => $decodeJson($fl['type'] ?? null),
                    'files'         => $files,
                ]);
                $flatIdMap[(string) $fl['id']] = $flat->id;
            }

            // Tooltips
            foreach ($projectData['irep_tooltip'] as $tt) {
                Tooltip::create([
                    'project_id' => $project->id,
                    'title'      => $tt['title'],
                    'data'       => $decodeJson($tt['data'] ?? null) ?? [],
                ]);
            }

            // Meta
            foreach ($projectData['irep_project_meta'] as $m) {
                ProjectMeta::updateOrCreate(
                    ['project_id' => $project->id, 'meta_key' => $m['meta_key']],
                    ['meta_value' => $m['meta_value']]
                );
            }

            // ── Phase 3: Remap polygon_data ───────────────────────────────────
            $projPolygon = $decodeJson($proj['polygon_data'] ?? null) ?? [];
            $project->update(['polygon_data' => $remapPolygon($projPolygon)]);

            foreach ($createdBlocks as $oldBlockId => $entry) {
                /** @var Block $block */
                $block      = $entry['model'];
                $blockData  = $entry['data'];
                $bPolygon   = $decodeJson($blockData['polygon_data'] ?? null) ?? [];
                $bImages360 = $block->images_360 ?? [];

                $remappedImages360 = array_map(function ($img) use ($remapPolygon) {
                    $img['polygon_data'] = $remapPolygon($img['polygon_data'] ?? []);
                    return $img;
                }, $bImages360);

                $block->update([
                    'polygon_data' => $remapPolygon($bPolygon),
                    'images_360'   => $remappedImages360,
                ]);
            }

            foreach ($createdFloors as $oldFloorId => $entry) {
                /** @var Floor $floor */
                $floor     = $entry['model'];
                $floorData = $entry['data'];
                $fPolygon  = $decodeJson($floorData['polygon_data'] ?? null) ?? [];
                $floor->update(['polygon_data' => $remapPolygon($fPolygon)]);
            }

            // Also remap project 360images polygon_data
            $projImages360 = $project->images_360 ?? [];
            $remappedProj360 = array_map(function ($img) use ($remapPolygon) {
                $img['polygon_data'] = $remapPolygon($img['polygon_data'] ?? []);
                return $img;
            }, $projImages360);
            $project->update(['images_360' => $remappedProj360]);

        } catch (\Throwable $e) {
            $this->rmdirRecursive($tmpDir);
            return response()->json(['success' => false, 'data' => 'Import failed: ' . $e->getMessage()], 500);
        }

        $this->rmdirRecursive($tmpDir);
        return response()->json(['success' => true, 'data' => ['project_id' => $project->id]]);
    }

    private function rmdirRecursive(string $dir): void
    {
        if (!is_dir($dir)) return;
        foreach (scandir($dir) as $item) {
            if ($item === '.' || $item === '..') continue;
            $path = $dir . '/' . $item;
            is_dir($path) ? $this->rmdirRecursive($path) : unlink($path);
        }
        rmdir($dir);
    }

    private function stubNotImplemented(Request $request): JsonResponse
    {
        return response()->json(['success' => false, 'data' => 'Not yet implemented.']);
    }

    private function humanFilesize(int $bytes): string
    {
        if ($bytes < 1024) return $bytes . ' B';
        if ($bytes < 1048576) return round($bytes / 1024, 1) . ' KB';
        return round($bytes / 1048576, 1) . ' MB';
    }
}
