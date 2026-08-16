<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useMetaStore } from "@/src/stores/useMeta";
import { useProjectStore } from "@/src/stores/useProject";
import Input from "../../form/Input.vue";
import Button from "../../form/Button.vue";
import Toggle from "../../form/Toggle.vue";
import { showToast } from "@/src/composables/helpers";
import { PLEASE_UPGRADE_TO_GOLD } from "@/src/composables/constants";

interface FilterRange {
  min: number;
  max: number;
  step: number;
}

interface RangeTab {
  id: string;
  label: string;
  metaKey: string;
  enabledKey: string;
  defaults: FilterRange;
  description: string;
}

/** Range filters. The status filter is handled separately below. */
const rangeTabs: RangeTab[] = [
  {
    id: "price",
    label: "Price",
    metaKey: "price_filter_options",
    enabledKey: "price_filter_enabled",
    description: "Range values for the flats list price filter in the project currency.",
    defaults: { min: 0, max: 500000, step: 1000 }
  },
  {
    id: "area",
    label: "Area",
    metaKey: "area_filter_options",
    enabledKey: "area_filter_enabled",
    description: "Range values for the flats list area filter in the project area unit.",
    defaults: { min: 0, max: 300, step: 1 }
  },
  {
    id: "rooms",
    label: "Rooms",
    metaKey: "rooms_filter_options",
    enabledKey: "rooms_filter_enabled",
    description: "Range values for the flats list rooms filter.",
    defaults: { min: 0, max: 10, step: 1 }
  },
  {
    id: "floor",
    label: "Floor",
    metaKey: "floor_filter_options",
    enabledKey: "floor_filter_enabled",
    description: "Range values for the flats list floor filter. Leave the range at its defaults to derive it from the project's floors.",
    defaults: { min: 0, max: 16, step: 1 }
  }
];

const STATUS_TAB_ID = "status";
const STATUS_ENABLED_KEY = "status_filter_enabled";
const HIDDEN_STATUSES_KEY = "hidden_statuses";

const metaStore = useMetaStore();
const projectStore = useProjectStore();
const { id: projectId } = storeToRefs(projectStore);

const activeTabId = ref(rangeTabs[0].id);
const activeTab = computed(() => rangeTabs.find((t) => t.id === activeTabId.value));
const isStatusTab = computed(() => activeTabId.value === STATUS_TAB_ID);

const filterData = ref<Record<string, FilterRange>>({});
const enabled = ref<Record<string, boolean>>({});
const hiddenStatuses = ref<string[]>([]);
const saving = ref(false);

/** Built-in statuses, plus whatever custom types the project defines. */
const statusOptions = computed(() => [
  { value: "available", title: "Available" },
  { value: "reserved", title: "Reserved" },
  { value: "sold", title: "Sold" },
  ...(metaStore.customStatusTypes || []).map((type) => ({
    value: String(type.value),
    title: String(type.title || type.value)
  }))
]);

const normalizeRange = (value: unknown, defaults: FilterRange): FilterRange => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...defaults };
  }

  const source = value as Partial<FilterRange>;
  const parsedMin = Number(source.min);
  const parsedMax = Number(source.max);
  const parsedStep = Number(source.step);

  const min = Number.isFinite(parsedMin) ? Math.max(0, parsedMin) : defaults.min;
  const maxCandidate = Number.isFinite(parsedMax) ? parsedMax : defaults.max;
  const max = Math.max(min, maxCandidate);
  const step = Number.isFinite(parsedStep) && parsedStep > 0 ? parsedStep : defaults.step;

  return { min, max, step };
};

const loadAll = () => {
  // Global container meta: filter_options = {
  //   price_filter_options: { min, max, step }, price_filter_enabled: true,
  //   …, status_filter_enabled: true, hidden_statuses: ["sold"]
  // }
  const raw = metaStore.getMeta("filter_options")?.meta_value;
  let container: Record<string, unknown> = {};

  if (raw) {
    try {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (parsed && !Array.isArray(parsed) && typeof parsed === "object") {
        container = parsed as Record<string, unknown>;
      }
    } catch {
      // ignore, we'll fall back to defaults
    }
  }

  rangeTabs.forEach((tab) => {
    filterData.value[tab.id] = normalizeRange(container[tab.metaKey], tab.defaults);
    // A filter is on unless it was explicitly switched off.
    enabled.value[tab.id] = container[tab.enabledKey] !== false;
  });

  enabled.value[STATUS_TAB_ID] = container[STATUS_ENABLED_KEY] !== false;

  const hidden = container[HIDDEN_STATUSES_KEY];
  hiddenStatuses.value = Array.isArray(hidden) ? hidden.map(String) : [];
};

const activeRange = computed({
  get: () => filterData.value[activeTabId.value] ?? { ...(activeTab.value?.defaults ?? { min: 0, max: 0, step: 1 }) },
  set: (val) => {
    filterData.value[activeTabId.value] = val;
  }
});

const activeEnabled = computed({
  get: () => enabled.value[activeTabId.value] ?? true,
  set: (val: boolean) => {
    enabled.value[activeTabId.value] = val;
  }
});

const isStatusShown = (value: string) => !hiddenStatuses.value.includes(value);

const setStatusShown = (value: string, shown: boolean) => {
  hiddenStatuses.value = shown
    ? hiddenStatuses.value.filter((item) => item !== value)
    : [...new Set([...hiddenStatuses.value, value])];
};

const minModel = computed({
  get: () => String(activeRange.value.min),
  set: (rawValue: string) => {
    const num = parseFloat(rawValue);
    const min = Number.isNaN(num) ? 0 : Math.max(0, num);
    activeRange.value = {
      ...activeRange.value,
      min,
      max: Math.max(min, activeRange.value.max)
    };
  }
});

const maxModel = computed({
  get: () => String(activeRange.value.max),
  set: (rawValue: string) => {
    const num = parseFloat(rawValue);
    activeRange.value = {
      ...activeRange.value,
      max: Number.isNaN(num) ? activeRange.value.min : Math.max(activeRange.value.min, num)
    };
  }
});

const stepDraft = ref("");

watch(
  () => activeTabId.value,
  () => {
    if (!isStatusTab.value) {
      stepDraft.value = String(activeRange.value.step);
    }
  },
  { immediate: true }
);

const stepModel = computed({
  get: () => stepDraft.value,
  set: (rawValue: string) => {
    stepDraft.value = rawValue;
    if (rawValue === "" || rawValue === "." || rawValue === "-" || rawValue === "-.") {
      return;
    }

    const num = parseFloat(rawValue);
    if (Number.isNaN(num)) {
      return;
    }

    activeRange.value = {
      ...activeRange.value,
      step: Math.max(0.0001, num)
    };
  }
});

const saveFilters = async () => {
  if (!irePlugin?.is_gold) {
    showToast("error", PLEASE_UPGRADE_TO_GOLD);
    return;
  }

  saving.value = true;
  try {
    const payload: Record<string, unknown> = {};

    rangeTabs.forEach((tab) => {
      payload[tab.metaKey] = normalizeRange(filterData.value[tab.id], tab.defaults);
      payload[tab.enabledKey] = enabled.value[tab.id] !== false;
    });

    payload[STATUS_ENABLED_KEY] = enabled.value[STATUS_TAB_ID] !== false;
    payload[HIDDEN_STATUSES_KEY] = [...hiddenStatuses.value];

    await metaStore.setProjectMeta(
      [{ key: "filter_options", value: JSON.stringify(payload) }],
      projectId.value ? Number(projectId.value) : undefined
    );
    showToast("success", "Filters saved!");
  } catch {
    showToast("error", "Failed to save filters.");
  } finally {
    saving.value = false;
  }
};

const useDefaults = () => {
  if (isStatusTab.value) {
    hiddenStatuses.value = [];
    enabled.value[STATUS_TAB_ID] = true;
    return;
  }

  if (!activeTab.value) return;

  filterData.value[activeTabId.value] = { ...activeTab.value.defaults };
  enabled.value[activeTabId.value] = true;
  stepDraft.value = String(activeTab.value.defaults.step);
};

onMounted(() => {
  loadAll();

  if (!metaStore.customStatusTypes?.length) {
    metaStore.getCustomStatusTypes?.();
  }
});
</script>

<template>
  <div class="flex max-h-[85vh] w-[42rem] flex-col overflow-hidden">
    <header class="mb-4 shrink-0">
      <h3 class="text-lg font-semibold text-gray-900">Manage filters</h3>
    </header>

    <nav class="mb-4 flex shrink-0 gap-1 border-b border-gray-200">
      <button
        v-for="tab in [...rangeTabs, { id: STATUS_TAB_ID, label: 'Status' }]"
        :key="tab.id"
        type="button"
        class="-mb-px px-4 py-2 text-sm font-medium transition-colors"
        :class="
          activeTabId === tab.id ? 'border-b-2 border-gray-300 text-gray-900' : 'text-gray-500 hover:text-gray-600'
        "
        @click="activeTabId = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <p class="mb-3 shrink-0 text-sm text-gray-500">
      {{
        isStatusTab
          ? "Show or hide the status dropdown filter, and control which statuses appear as options."
          : activeTab?.description
      }}
    </p>

    <div class="min-h-0 flex-1 space-y-3 overflow-y-auto">
      <div class="flex items-center justify-between rounded-lg border border-gray-200 p-4">
        <span class="text-sm font-medium text-gray-900">
          Enable {{ isStatusTab ? "Status" : activeTab?.label }} filter
        </span>
        <Toggle v-if="isStatusTab" v-model="enabled[STATUS_TAB_ID]" />
        <Toggle v-else v-model="activeEnabled" />
      </div>

      <!-- Status: which statuses are offered, and shown at all -->
      <template v-if="isStatusTab">
        <p class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Turning a status off does two things on the frontend: it removes that option from the status
          dropdown <strong>and</strong> hides every flat with that status from the flats list.
        </p>

        <div class="divide-y divide-gray-200 rounded-lg border border-gray-200">
          <div
            v-for="status in statusOptions"
            :key="status.value"
            class="flex items-center justify-between px-4 py-3"
          >
            <span class="text-sm text-gray-900">{{ status.title }}</span>
            <Toggle
              :model-value="isStatusShown(status.value)"
              @update:model-value="(value: boolean) => setStatusShown(status.value, value)"
            />
          </div>
        </div>
      </template>

      <!-- Range filters -->
      <template v-else>
        <div class="rounded-lg border border-gray-200 bg-gray-50 p-4" :class="{ 'opacity-50': !activeEnabled }">
          <div class="grid grid-cols-3 gap-3">
            <div>
              <p class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Min</p>
              <Input v-model="minModel" type="number" placeholder="0" />
            </div>
            <div>
              <p class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Max</p>
              <Input v-model="maxModel" type="number" placeholder="0" />
            </div>
            <div>
              <p class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Step</p>
              <Input v-model="stepModel" type="number" :is-float="true" placeholder="1" />
            </div>
          </div>
        </div>

        <p class="text-xs text-gray-500">Values are normalized automatically: min >= 0, max >= min, step > 0.</p>
      </template>
    </div>

    <footer class="mt-5 flex shrink-0 items-center justify-between border-t border-gray-200 pt-4">
      <button type="button" class="text-sm text-gray-500 underline hover:text-gray-600" @click="useDefaults">
        Reset to defaults
      </button>
      <Button title="Save" class="!w-fit" :loading="saving" @click="saveFilters" />
    </footer>
  </div>
</template>
