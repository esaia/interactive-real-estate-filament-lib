<script setup lang="ts">
import { computed, ref, Teleport, Transition } from "vue";
import { COMMON_FIELDS, PLUGIN_ASSETS_PATH } from "@/src/composables/constants";
import { useProjectStore } from "@/src/stores/useProject";
import { useBlocksStore } from "@/src/stores/useBlock";
import { selectDataItem } from "@/types/components";
import { storeToRefs } from "pinia";
import Duplicate from "../../icons/Duplicate.vue";
import Check from "../../icons/Check.vue";
import Info from "../../icons/Info.vue";
import Input from "../../form/Input.vue";
import Select from "../../form/Select.vue";
import GutenbergRadioCards from "../../form/GutenbergRadioCards.vue";
import Button from "../../form/Button.vue";
import Modal from "../../Modal.vue";
import LicensePlanBadge from "../LicensePlanBadge.vue";
import ManageFilters from "./ManageFilters.vue";

const projectStore = useProjectStore();
const blocksStore = useBlocksStore();
const { projectBlocks } = storeToRefs(blocksStore);

const projectId = computed(() => Number(projectStore.id || 0));
const perPage = ref("12");
const blockId = ref<selectDataItem | null>(null);
const layout = ref<"mixed" | "table" | "grid">("grid");
const defaultView = ref<"table" | "grid">("grid");
const orderBy = ref<selectDataItem>({ title: "Id", value: "id" });
const layoutOptions = [
  { value: "mixed", label: "Mixed" },
  { value: "table", label: "Table" },
  { value: "grid", label: "Grid" }
];
const defaultViewOptions = [
  { value: "grid", label: "Grid" },
  { value: "table", label: "Table" }
];
const orderByOptions = computed<selectDataItem[]>(() =>
  COMMON_FIELDS.map((field) => ({
    title: field,
    value: field
  }))
);
const blockOptions = computed<selectDataItem[]>(() =>
  (projectBlocks.value || []).map((block) => ({
    title: block.title,
    value: String(block.id)
  }))
);
const customTypeOtherField = ref("");
const selectedOrderBy = computed(() => {
  if (orderBy.value.value !== "type.other.*") {
    return orderBy.value.value;
  }

  if (!customTypeOtherField.value.trim()) {
    return "type.other.*";
  }

  return `type.other.${customTypeOtherField.value.trim()}`;
});

const isGold = computed(() => Boolean(irePlugin?.is_gold));
const is360FlowDisabled = computed(() => !irePlugin?.building_360_addon);
const projectShortcode = computed(() => `[irep_project id="${projectId.value}"]`);
const flatsShortcode = computed(() => {
  const blockIdParam = blockId.value?.value ? ` block_id="${blockId.value.value}"` : "";
  const defaultViewParam = layout.value === "mixed" ? ` default_view="${defaultView.value}"` : "";
  return `[irep_flats id="${projectId.value}" per_page="${perPage.value}" layout="${layout.value}"${defaultViewParam}${blockIdParam} order_by="${selectedOrderBy.value}"]`;
});
const shortcode360 = computed(() => `[irep_360 id="${projectId.value}"]`);
const copiedProject = ref(false);
const copiedFlats = ref(false);
const copied360 = ref(false);
const showManageFiltersModal = ref(false);
const exampleImage = ref("");
let copiedTimer: ReturnType<typeof setTimeout> | null = null;

const copyText = async (value: string, type: "project" | "flats" | "360") => {
  try {
    await navigator.clipboard.writeText(value);
    copiedProject.value = type === "project";
    copiedFlats.value = type === "flats";
    copied360.value = type === "360";
    if (copiedTimer) {
      clearTimeout(copiedTimer);
    }
    copiedTimer = setTimeout(() => {
      copiedProject.value = false;
      copiedFlats.value = false;
      copied360.value = false;
    }, 1400);
  } catch (error) {
    // no-op
  }
};
</script>

<template>
  <div class="space-y-5">
    <div class="rounded-lg bg-gray-50 p-4">
      <div class="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-100 p-2">
        <div class="flex-1 text-gray-600">{{ projectShortcode }}</div>
        <button
          type="button"
          class="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-600"
          @click="copyText(projectShortcode, 'project')"
        >
          <Check v-if="copiedProject" class="size-4 text-emerald-600" />
          <Duplicate v-else class="size-4" />
        </button>
      </div>
    </div>

    <div class="rounded-lg bg-gray-50 p-4">
      <div class="mb-2 flex items-center justify-between gap-2">
        <p class="text-sm font-semibold uppercase text-orange-400">Flats List Configuration</p>
        <div
          class="z-10 flex cursor-pointer justify-end"
          @mouseenter="exampleImage = PLUGIN_ASSETS_PATH + 'table-shortcode.webp'"
          @mouseleave="exampleImage = ''"
        >
          <Info />
        </div>
      </div>

      <template v-if="isGold">
        <div class="mb-4 flex items-center gap-2 rounded-md border border-gray-200 bg-gray-100 p-2">
          <div class="flex-1 text-gray-600">{{ flatsShortcode }}</div>
          <button
            type="button"
            class="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-600"
            @click="copyText(flatsShortcode, 'flats')"
          >
            <Check v-if="copiedFlats" class="size-4 text-emerald-600" />
            <Duplicate v-else class="size-4" />
          </button>
        </div>

        <div class="mb-4 grid grid-cols-3 gap-4">
          <Input v-model="perPage" label="Per Page" type="number" />
          <Select v-model="orderBy" label="Order By" :data="orderByOptions" :clearable="false" :is-searchable="false" />
          <Select v-model="blockId" label="Block" :data="blockOptions" clearable :is-searchable="false" />
        </div>

        <div class="ire-layout-style-group mb-4">
          <GutenbergRadioCards v-model="layout" label="Layout Style" :options="layoutOptions" />
        </div>

        <div v-if="layout === 'mixed'" class="ire-layout-style-group mb-4">
          <GutenbergRadioCards v-model="defaultView" label="Default View" :options="defaultViewOptions" />
        </div>

        <div v-if="orderBy.value === 'type.other.*'" class="mb-4">
          <Input
            v-model="customTypeOtherField"
            label='Replace "*" in type.other.*'
            placeholder="Enter custom key, e.g. balcony_area"
          />
        </div>

        <div class="mb-1 flex items-center justify-between gap-2">
          <Button title="Manage filters" outlined @click="showManageFiltersModal = true" />
        </div>
      </template>

      <template v-else>
        <div
          class="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4"
        >
          <div class="mb-3 flex items-center justify-between">
            <LicensePlanBadge plan="gold" />
            <span class="text-xl" aria-hidden="true">🔒</span>
          </div>
          <p class="mb-1 text-sm font-semibold text-gray-900">
            Flats List Configuration is available in Gold license.
          </p>
          <p class="mb-4 text-xs text-gray-500">
            Upgrade to customize layout style, sorting, pagination, block filtering, and shortcode generation.
          </p>
          <div class="grid grid-cols-3 gap-3 opacity-60">
            <Input :model-value="'12'" label="Per Page" type="number" disabled />
            <Input :model-value="'price'" label="Order By" disabled />
            <Input :model-value="''" label="Block ID" type="number" disabled />
          </div>
        </div>
      </template>
    </div>

    <div class="rounded-lg bg-gray-50 p-4">
      <div class="mb-2 flex items-center justify-between gap-2">
        <p class="text-sm font-semibold uppercase text-orange-400">360° Viewer Shortcode</p>
        <div
          class="z-10 flex cursor-pointer justify-end"
          @mouseenter="exampleImage = PLUGIN_ASSETS_PATH + 'table-shortcode.webp'"
          @mouseleave="exampleImage = ''"
        >
          <Info />
        </div>
      </div>

      <template v-if="!is360FlowDisabled">
        <div class="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-100 p-2">
          <div class="flex-1 text-gray-600">{{ shortcode360 }}</div>
          <button
            type="button"
            class="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-600"
            @click="copyText(shortcode360, '360')"
          >
            <Check v-if="copied360" class="size-4 text-emerald-600" />
            <Duplicate v-else class="size-4" />
          </button>
        </div>
      </template>

      <template v-else>
        <div
          class="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4"
        >
          <div class="mb-3 flex items-center justify-between">
            <LicensePlanBadge plan="Building 360 Module" />
            <span class="text-xl" aria-hidden="true">🔒</span>
          </div>
          <p class="mb-1 text-sm font-semibold text-gray-900">
            360° Viewer Shortcode requires the Building 360 Module Add-on.
          </p>
          <p class="mb-4 text-xs text-gray-500">
            Activate the 360 Add-on to embed an interactive 360° building viewer on any page using a shortcode.
          </p>
        </div>
      </template>
    </div>
  </div>

  <Teleport to="#irep-vue-app">
    <Transition name="fade-in-out">
      <Modal :show="showManageFiltersModal" @close="showManageFiltersModal = false">
        <ManageFilters />
      </Modal>
    </Transition>
  </Teleport>

  <Teleport to="#irep-vue-app">
    <Transition name="fade-in-out">
      <Modal :show="!!exampleImage" :show-close-btn="false" :is-preview="true">
        <div>
          <p class="!mb-2">Example image</p>
          <img :src="exampleImage" class="max-h-[500px] w-full object-contain" />
        </div>
      </Modal>
    </Transition>
  </Teleport>
</template>

<style scoped>
:deep(.ire-layout-style-group .components-toggle-group-control::before) {
  background-color: var(--wp-admin-theme-color, #3858e9) !important;
}

:deep(.ire-layout-style-group .components-toggle-group-control [role="radio"][aria-checked="true"]) {
  color: #fff !important;
}

:deep(.ire-layout-style-group .components-toggle-group-control [role="radio"][aria-checked="true"] > div) {
  color: inherit !important;
}
</style>
