<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import * as XLSX from "xlsx";
import Modal from "@components/UiComponents/Modal.vue";
import { FlatItem, FlatsInterface } from "@/types/components";
import ajaxAxios from "@/src/utils/axios";
import { useProjectStore } from "@/src/stores/useProject";
import { useMetaStore } from "@/src/stores/useMeta";
import { storeToRefs } from "pinia";
import Table from "../common/table/Table.vue";
import TableTh from "../common/table/TableTh.vue";
import Pagination from "../common/Pagination.vue";
import DeleteModal from "../common/DeleteModal.vue";
import Input from "../form/Input.vue";
import Button from "../form/Button.vue";
import CreateEditFlatModal from "./CreateEditFlatModal.vue";
import { getBlockTitleById, getFloorTitleById, showToast } from "@/src/composables/helpers";
import Filteres from "../common/Filteres.vue";
import EmptyState from "../common/EmptyState.vue";
import Toggle from "../form/Toggle.vue";
import ConfigToggle from "../form/ConfigToggle.vue";
import { PLEASE_UPGRADE_TO_GOLD } from "@/src/composables/constants";

const props = defineProps<{
  defaultBlock?: string;
  defaultFloor?: string;
}>();

const projectStore = useProjectStore();
const metaStore = useMetaStore();
const { id } = storeToRefs(projectStore);

function getCustomStatusStyle(conf: string) {
  const customType = metaStore.customStatusTypes?.find((t) => t.value === conf);
  if (!customType?.type_color) return {};
  const color = customType.type_color;

  let r: number, g: number, b: number;
  if (color.startsWith("#")) {
    const h = color.replace("#", "");
    r = parseInt(h.substring(0, 2), 16);
    g = parseInt(h.substring(2, 4), 16);
    b = parseInt(h.substring(4, 6), 16);
  } else {
    const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return {};
    [r, g, b] = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  }

  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
    color: `rgb(${r}, ${g}, ${b})`
  };
}

const searchFlat = ref("");

const filterBlockId = ref(props.defaultBlock || "all");
const filterFloorId = ref(props.defaultFloor || "");

const showEditFlatModal = ref(false);

const flats = ref<FlatsInterface>();
const sortField = ref("");
const sortOrder = ref<"ASC" | "DESC" | "">("ASC");
const currentPage = ref(1);
const perPage = ref(20);

const activeFlat = ref<FlatItem | null>(null);
const duplicatedFlat = ref<FlatItem | null>(null);

const deleteFlatId = ref<number | null>(null);
const showDeleteModal = ref(false);
const loading = ref(false);

const importFileRef = ref<HTMLInputElement | null>(null);
const isImporting = ref(false);

const selectedIds = ref<Set<number>>(new Set());
const selectAllRef = ref<HTMLInputElement | null>(null);
const showBulkDeleteModal = ref(false);
const isBulkDeleting = ref(false);

const isAllSelected = computed(() => {
  const data = flats.value?.data;
  return !!data?.length && data.every((f: FlatItem) => selectedIds.value.has(Number(f.id)));
});

const isIndeterminate = computed(() => selectedIds.value.size > 0 && !isAllSelected.value);

const toggleAll = () => {
  const data = flats.value?.data ?? [];
  if (isAllSelected.value) {
    data.forEach((f: FlatItem) => selectedIds.value.delete(Number(f.id)));
  } else {
    data.forEach((f: FlatItem) => selectedIds.value.add(Number(f.id)));
  }
  selectedIds.value = new Set(selectedIds.value);
};

const toggleOne = (id: number) => {
  const next = new Set(selectedIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  selectedIds.value = next;
};

const bulkDelete = async () => {
  isBulkDeleting.value = true;
  try {
    const { data } = await ajaxAxios.post("", {
      action: "irep_bulk_delete_flats",
      nonce: irePlugin.nonce,
      ids: JSON.stringify([...selectedIds.value])
    });
    if (data?.success) {
      showToast("success", `Deleted ${data.data.deleted} flat(s)`);
      selectedIds.value = new Set();
      fetchFlats();
    } else {
      showToast("error", "Bulk delete failed");
    }
  } catch {
    showToast("error", "Bulk delete failed");
  } finally {
    isBulkDeleting.value = false;
    showBulkDeleteModal.value = false;
  }
};

watchEffect(() => {
  if (selectAllRef.value) {
    selectAllRef.value.indeterminate = isIndeterminate.value;
  }
});

const editFlat = (flat: FlatItem | null) => {
  showEditFlatModal.value = true;
  activeFlat.value = flat;
};

const duplicateFlat = (flat: FlatItem | null) => {
  if (!flat) return;
  showEditFlatModal.value = true;
  duplicatedFlat.value = { ...flat };
};

const showDeleteFlatModal = (flat: FlatItem | null) => {
  if (!flat) return;
  deleteFlatId.value = Number(flat.id);
  showDeleteModal.value = true;
};

const deleteFlat = async () => {
  await ajaxAxios.post("", {
    action: "irep_delete_flat",
    nonce: irePlugin.nonce,
    flat_id: deleteFlatId.value
  });
  showDeleteModal.value = false;
  fetchFlats();
};

const sort = (field: string, sortOrderString: "ASC" | "DESC" | "") => {
  sortField.value = field;
  sortOrder.value = sortOrderString;

  fetchFlats();
};

const submitForm = () => {
  currentPage.value = 1;
  fetchFlats();
};

const changeFlatStatus = async (flat: FlatItem, is_active: boolean) => {
  if (!irePlugin?.is_gold) {
    showToast("error", PLEASE_UPGRADE_TO_GOLD);
    return;
  }

  try {
    const { data } = await ajaxAxios.post("", {
      action: "irep_change_flat_status",
      nonce: irePlugin.nonce,
      flat_id: flat.id,
      is_active
    });

    if (data?.success) {
      showToast("success", "Flat Status Changed");
    } else {
      showToast("error", "something went wrong!");
    }
  } catch (error) {
    showToast("error", "something went wrong!");
  }
};

const changeFlatConf = async (flat: FlatItem, conf: string | null) => {
  if (!irePlugin?.is_gold) {
    showToast("error", PLEASE_UPGRADE_TO_GOLD);
    return;
  }

  try {
    const { data } = await ajaxAxios.post("", {
      action: "irep_change_flat_config",
      nonce: irePlugin.nonce,
      flat_id: flat.id,
      conf
    });

    if (data?.success) {
      showToast("success", "Flat Config Changed");
    } else {
      showToast("error", "something went wrong!");
    }
  } catch (error) {
    showToast("error", "something went wrong!");
  }
};

const triggerImport = () => {
  if (!irePlugin?.is_gold) {
    showToast("error", PLEASE_UPGRADE_TO_GOLD);
    return;
  }
  importFileRef.value?.click();
};

const downloadExampleExcel = () => {
  const rows = [
    {
      flat_number: "A-101",
      price: 120000,
      offer_price: 115000,
      conf: "",
      floor_id: 1,
      block_id: 1,
      request_price: 0,
      use_type: 0,
      type_id: "",
      type_title: "Studio",
      type_teaser: "Compact studio apartment",
      type_area_m2: 40,
      type_rooms_count: 1,
      type_equipment: "Full",
      click_action: "",
      follow_link_link: "",
      follow_link_target: 0
    },
    {
      flat_number: "B-201",
      price: 90000,
      offer_price: 85000,
      conf: "sold",
      floor_id: "",
      block_id: "",
      request_price: 0,
      use_type: 1,
      type_id: 5,
      type_title: "",
      type_teaser: "",
      type_area_m2: "",
      type_rooms_count: "",
      type_equipment: "",
      click_action: "follow_link",
      follow_link_link: "https://example.com",
      follow_link_target: 1
    }
  ];

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Flats");
  XLSX.writeFile(wb, "flats-import-example.xlsx");
};

const KNOWN_TYPE_COLS = new Set(["type_title", "type_teaser", "type_area_m2", "type_rooms_count", "type_id"]);

function mapRowToFlat(row: Record<string, any>) {
  const col = (key: string) => {
    const found = Object.keys(row).find((k) => k.toLowerCase() === key);
    return found !== undefined ? row[found] : undefined;
  };

  const other = Object.keys(row)
    .filter((k) => k.toLowerCase().startsWith("type_") && !KNOWN_TYPE_COLS.has(k.toLowerCase()))
    .map((k) => ({ key: k.slice("type_".length), value: String(row[k] ?? "") }));

  const typeIdRaw = col("type_id");
  const typeId = typeIdRaw != null && typeIdRaw !== "" ? Number(typeIdRaw) : null;
  const useType = typeId != null && typeId > 0;

  const clickAction = col("click_action") ?? "";
  const followLinkLink = col("follow_link_link") ?? "";
  const followLinkTargetRaw = col("follow_link_target");
  const followLinkTarget =
    followLinkTargetRaw === true ||
    followLinkTargetRaw === 1 ||
    followLinkTargetRaw === "true" ||
    followLinkTargetRaw === "1";

  return {
    flat_number: String(col("flat_number") ?? ""),
    price: parseFloat(col("price") ?? 0),
    offer_price: parseFloat(col("offer_price") ?? 0),
    conf: col("conf") ?? "",
    floor_id: col("floor_id") != null && col("floor_id") !== "" ? Number(col("floor_id")) : null,
    block_id: col("block_id") != null && col("block_id") !== "" ? Number(col("block_id")) : null,
    request_price: Number(col("request_price") ?? 0) === 1,
    use_type: useType,
    type_id: useType ? typeId : null,
    type: {
      title: col("type_title") ?? "",
      teaser: col("type_teaser") ?? "",
      area_m2: parseFloat(col("type_area_m2") ?? 0),
      rooms_count: parseFloat(col("type_rooms_count") ?? 0),
      other,
      image_2d: [],
      image_3d: []
    },
    click_action: clickAction,
    follow_link: { link: followLinkLink, target: followLinkTarget },
    files: []
  };
}

const handleImportFile = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  isImporting.value = true;

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

    if (!rows.length) {
      showToast("error", "No rows found in the file");
      return;
    }

    const flats = rows.map(mapRowToFlat).filter((f) => f.flat_number);

    const { data } = await ajaxAxios.post("", {
      action: "irep_import_flats_excel",
      nonce: irePlugin.nonce,
      project_id: id.value,
      flats: JSON.stringify(flats)
    });

    if (data?.success) {
      const { imported, failed } = data.data;
      showToast("success", `Imported ${imported} flat(s)${failed ? `, ${failed} failed` : ""}`);
      fetchFlats();
    } else {
      showToast("error", "Import failed");
    }
  } catch {
    showToast("error", "Failed to read file");
  } finally {
    isImporting.value = false;
    input.value = "";
  }
};

const fetchFlats = async () => {
  try {
    loading.value = true;

    const { data } = await ajaxAxios.post("", {
      action: "irep_get_flats",
      nonce: irePlugin.nonce,
      project_id: id.value,
      sort_field: sortField.value,
      sort_order: sortOrder.value,
      page: currentPage.value,
      per_page: perPage.value,
      search: searchFlat.value,
      block: filterBlockId.value,
      floor: filterFloorId.value
    });

    if (!data.success) {
      flats.value = { data: [] } as any;
      return;
    }

    flats.value = data?.data;
    selectedIds.value = new Set();
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

watch(
  () => currentPage.value,
  () => {
    fetchFlats();
  }
);

watch(
  () => showEditFlatModal.value,
  (ns) => {
    if (!ns) {
      fetchFlats();

      duplicatedFlat.value = null;
      activeFlat.value = null;
    }
  }
);

watch(
  () => [filterBlockId.value, filterFloorId.value],
  () => {
    currentPage.value = 1;
    fetchFlats();
  },
  { deep: true }
);

onMounted(() => {
  fetchFlats();
  metaStore.getCustomStatusTypes();
});
</script>

<template>
  <div class="mt-14 text-gray-900">
    <form @submit.prevent="submitForm" class="mb-3 flex items-center justify-between gap-4 border-b border-gray-200 pb-3 shadow-sm">
      <h3 class="!text-lg font-semibold capitalize">Flats</h3>

      <Input v-model="searchFlat" placeholder="Filter flats list..." />

      <Filteres v-model:block="filterBlockId" v-model:floor="filterFloorId" />

      <div class="flex min-w-max items-center gap-2">
        <Button
          v-if="selectedIds.size > 0"
          type="button"
          :title="`Delete selected (${selectedIds.size})`"
          outlined
          @click="showBulkDeleteModal = true"
        />
        <Button type="button" title="Download Example" outlined @click="downloadExampleExcel" />
        <Button
          type="button"
          :title="isImporting ? 'Importing...' : 'Import Excel'"
          outlined
          :disabled="isImporting"
          @click="triggerImport"
        />
        <input ref="importFileRef" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="handleImportFile" />
        <Button type="button" title="Add Flat" outlined @click="showEditFlatModal = true" />
      </div>
    </form>

    <div v-if="loading">LOADING...</div>

    <div v-else-if="flats?.data?.length" class="relative overflow-x-auto shadow-sm">
      <Table
        :data="flats?.data"
        @edit-action="(flat: FlatItem | null) => editFlat(flat)"
        @duplicate-action="(flat: FlatItem | null) => duplicateFlat(flat)"
        @delete-action="(flat: FlatItem | null) => showDeleteFlatModal(flat)"
      >
        <template #header>
          <th class="w-8 !border-l-0 px-2 py-2">
            <input
              ref="selectAllRef"
              type="checkbox"
              class="cursor-pointer"
              :checked="isAllSelected"
              @change="toggleAll"
            />
          </th>

          <TableTh
            fieldTitle="status"
            field="is_active"
            :sortable="true"
            :sortField="sortField"
            :sortOrder="sortOrder"
            @sort="(field: any, sortOrder: any) => sort(field, sortOrder)"
          />

          <TableTh
            fieldTitle="id"
            field="id"
            :sortable="true"
            :sortField="sortField"
            :sortOrder="sortOrder"
            @sort="(field: any, sortOrder: any) => sort(field, sortOrder)"
          />

          <TableTh
            fieldTitle="title"
            field="flat_number"
            :sortable="true"
            :sortField="sortField"
            :sortOrder="sortOrder"
            @sort="(field: any, sortOrder: any) => sort(field, sortOrder)"
          />

          <TableTh
            fieldTitle="Floor number"
            field="floor_id"
            :sortable="true"
            :sortField="sortField"
            :sortOrder="sortOrder"
            @sort="(field: any, sortOrder: any) => sort(field, sortOrder)"
          />

          <TableTh
            fieldTitle="Block"
            field="block_id"
            :sortable="true"
            :sortField="sortField"
            :sortOrder="sortOrder"
            @sort="(field: any, sortOrder: any) => sort(field, sortOrder)"
          />

          <TableTh
            fieldTitle="Price"
            field="price"
            :sortable="true"
            :sortField="sortField"
            :sortOrder="sortOrder"
            @sort="(field: any, sortOrder: any) => sort(field, sortOrder)"
          />
          <TableTh
            fieldTitle="Offer price"
            field="offer_price"
            :sortable="true"
            :sortField="sortField"
            :sortOrder="sortOrder"
            @sort="(field: any, sortOrder: any) => sort(field, sortOrder)"
          />
          <TableTh
            fieldTitle="Conf"
            field="conf"
            :sortable="true"
            :sortField="sortField"
            :sortOrder="sortOrder"
            @sort="(field: any, sortOrder: any) => sort(field, sortOrder)"
          />
        </template>

        <template #default="flat">
          <td class="w-8">
            <input
              type="checkbox"
              class="cursor-pointer"
              :checked="selectedIds.has(Number(flat.slotProps.id))"
              @change="toggleOne(Number(flat.slotProps.id))"
            />
          </td>
          <td class="w-44 items-center">
            <div class="flex w-fit items-center justify-center gap-4">
              <Toggle
                v-model="flat.slotProps.is_active"
                :disabled="!irePlugin.is_gold"
                @change="(e) => changeFlatStatus(flat.slotProps, e)"
              />

              <ConfigToggle
                v-model="flat.slotProps.conf"
                :disabled="!irePlugin.is_gold"
                @change="(e) => changeFlatConf(flat.slotProps, e)"
              />
            </div>
          </td>
          <td>{{ flat.slotProps?.id }}</td>
          <td>{{ flat.slotProps?.flat_number }}</td>
          <td>{{ getFloorTitleById(flat.slotProps?.floor_id) }}</td>
          <td>{{ getBlockTitleById(flat.slotProps?.block_id) }}</td>
          <td>{{ flat.slotProps?.price }}</td>
          <td>{{ flat.slotProps?.offer_price }}</td>
          <td>
            <div
              class="rounded-md px-2"
              :class="{
                'bg-orange-200 text-orange-500': flat.slotProps?.conf === 'reserved',
                'bg-red-300 text-red-800': flat.slotProps?.conf === 'sold'
              }"
              :style="
                flat.slotProps?.conf && flat.slotProps.conf !== 'reserved' && flat.slotProps.conf !== 'sold'
                  ? getCustomStatusStyle(flat.slotProps.conf)
                  : undefined
              "
            >
              {{ flat.slotProps?.conf }}
            </div>
          </td>
        </template>
      </Table>

      <Pagination :totalItems="Number(flats?.total)" :perPage="perPage" v-model="currentPage" />
    </div>

    <EmptyState v-else />
  </div>

  <teleport to="#irep-vue-app">
    <Transition name="fade">
      <Modal :show="showEditFlatModal" @close="showEditFlatModal = false" type="2" width="w-[500px]">
        <CreateEditFlatModal
          :activeFlat="activeFlat"
          :duplicatedFlat="duplicatedFlat"
          @set-active-flat="(flat: any) => (activeFlat = flat)"
        />
      </Modal>
    </Transition>
  </teleport>

  <teleport to="#irep-vue-app">
    <Transition name="fade">
      <Modal :show="showDeleteModal" @close="showDeleteModal = false">
        <DeleteModal
          :text="`Are you sure you want to delete flat with id ${deleteFlatId || ''}?`"
          @delete-action="deleteFlat()"
          @cancel-action="showDeleteModal = false"
        />
      </Modal>
    </Transition>
  </teleport>

  <teleport to="#irep-vue-app">
    <Transition name="fade">
      <Modal :show="showBulkDeleteModal" @close="showBulkDeleteModal = false">
        <DeleteModal
          :text="`Are you sure you want to delete ${selectedIds.size} selected flat(s)?`"
          @delete-action="bulkDelete()"
          @cancel-action="showBulkDeleteModal = false"
        />
      </Modal>
    </Transition>
  </teleport>
</template>
