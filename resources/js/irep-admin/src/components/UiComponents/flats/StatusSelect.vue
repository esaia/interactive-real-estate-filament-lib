<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import Select from "@components/UiComponents/form/Select.vue";
import { DEFAULT_CONFIG } from "@/src/composables/constants";
import { useMetaStore } from "@/src/stores/useMeta";
import { useProjectStore } from "@/src/stores/useProject";
import { selectDataItem } from "@/types/components";
import Modal from "@components/UiComponents/Modal.vue";
import Plus from "@components/UiComponents/icons/Plus.vue";
import CustomStatusManager from "@components/UiComponents/flats/CustomStatusManager.vue";

export interface CustomStatusType {
  value: string;
  title: string;
  open_flat_modal: boolean;
  type_color: string;
}

const model = defineModel<selectDataItem | null>({ default: null });

const props = withDefaults(
  defineProps<{
    label?: string;
    clearable?: boolean;
  }>(),
  {
    label: "configuration",
    clearable: true
  }
);

const projectStore = useProjectStore();
const metaStore = useMetaStore();

const showManageModal = ref(false);

const customTypes = computed<CustomStatusType[]>(() => {
  const list = metaStore.customStatusTypes || [];
  return list.map((t) => ({
    value: t.value,
    title: t.title,
    open_flat_modal:
      typeof t.open_flat_modal === "boolean"
        ? t.open_flat_modal
        : t.open_flat_modal === 1 || t.open_flat_modal === "1" || String(t.open_flat_modal).toLowerCase() === "true",
    type_color: typeof t.type_color === "string" && t.type_color ? t.type_color : "#6b7280"
  }));
});

const defaultStatusColors: Record<string, string | undefined> = {
  reserved: undefined,
  sold: undefined
};

const statusOptions = computed<selectDataItem[]>(() => {
  const reservedColor = metaStore.getMeta?.("reserved_color")?.meta_value as string | undefined;
  const soldColor = metaStore.getMeta?.("sold_color")?.meta_value as string | undefined;
  const defaultColorMap: Record<string, string | undefined> = {
    ...defaultStatusColors,
    reserved: reservedColor,
    sold: soldColor
  };

  const availableColor = metaStore.getMeta?.("available_flat_color")?.meta_value as string | undefined;
  const availableItem: selectDataItem = { title: "Available", value: "", color: availableColor };

  const defaultItems = DEFAULT_CONFIG.map((item) => ({
    ...item,
    color: defaultColorMap[item.value]
  }));
  const custom = (customTypes.value || []).map((t) => ({
    title: t.title,
    value: t.value,
    color: t.type_color
  }));
  return [availableItem, ...defaultItems, ...custom];
});

async function openManageModal() {
  await metaStore.getCustomStatusTypes();
  showManageModal.value = true;
}

function closeManageModal() {
  showManageModal.value = false;
}

onMounted(async () => {
  if (projectStore.id) {
    await metaStore.getProjectMeta();
  }
});

watch(
  () => projectStore.id,
  async (id) => {
    if (id) {
      await metaStore.getProjectMeta();
    }
  },
  { immediate: false }
);
</script>

<template>
  <div class="flex w-full items-end gap-2">
    <div class="min-w-0 flex-1">
      <Select v-model="model" :data="statusOptions" :label="props.label" :clearable="props.clearable" />
    </div>
    <button
      type="button"
      class="flex size-8 shrink-0 items-center justify-center rounded-sm border border-gray-300 bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
      title="Manage custom status types"
      @click="openManageModal"
    >
      <Plus class="h-5 w-5" />
    </button>
  </div>

  <teleport to="#irep-vue-app">
    <Transition name="fade">
      <Modal :show="showManageModal" width="w-[min(480px,calc(100vw-2rem))]" @close="closeManageModal">
        <div class="max-h-[calc(90vh-5rem)] min-w-[500px] max-w-[min(480px,calc(100vw-2rem))] overflow-y-auto overscroll-contain">
          <CustomStatusManager v-if="showManageModal" />
        </div>
      </Modal>
    </Transition>
  </teleport>
</template>
