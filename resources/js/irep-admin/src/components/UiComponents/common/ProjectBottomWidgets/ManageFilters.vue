<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useMetaStore } from "@/src/stores/useMeta";
import { useProjectStore } from "@/src/stores/useProject";
import Input from "../../form/Input.vue";
import Button from "../../form/Button.vue";
import { showToast } from "@/src/composables/helpers";
import { PLEASE_UPGRADE_TO_GOLD } from "@/src/composables/constants";

interface FilterRange {
  min: number;
  max: number;
  step: number;
}

interface FilterTab {
  id: string;
  label: string;
  metaKey: string;
  defaults: FilterRange;
  description: string;
}

const tabs: FilterTab[] = [
  {
    id: "price",
    label: "Price",
    metaKey: "price_filter_options",
    description: "Range values for the flats list price filter in the project currency.",
    defaults: { min: 0, max: 500000, step: 1000 }
  },
  {
    id: "area",
    label: "Area",
    metaKey: "area_filter_options",
    description: "Range values for the flats list area filter in the project area unit.",
    defaults: { min: 0, max: 300, step: 1 }
  },
  {
    id: "rooms",
    label: "Rooms",
    metaKey: "rooms_filter_options",
    description: "Range values for the flats list rooms filter.",
    defaults: { min: 0, max: 10, step: 1 }
  }
];

const metaStore = useMetaStore();
const projectStore = useProjectStore();
const { id: projectId } = storeToRefs(projectStore);

const activeTabId = ref(tabs[0].id);
const activeTab = computed(() => tabs.find((t) => t.id === activeTabId.value)!);

const filterData = ref<Record<string, FilterRange>>({});
const saving = ref(false);

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
  // Global container meta: filter_options = { price_filter_options: { min, max, step }, ... }
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

  tabs.forEach((tab) => {
    filterData.value[tab.id] = normalizeRange(container[tab.metaKey], tab.defaults);
  });
};

const activeRange = computed({
  get: () => filterData.value[activeTabId.value] ?? { ...activeTab.value.defaults },
  set: (val) => {
    filterData.value[activeTabId.value] = val;
  }
});

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
    stepDraft.value = String(activeRange.value.step);
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
    const payload: Record<string, FilterRange> = {};

    tabs.forEach((tab) => {
      payload[tab.metaKey] = normalizeRange(filterData.value[tab.id], tab.defaults);
    });

    await metaStore.setProjectMeta(
      [{ key: "filter_options", value: JSON.stringify(payload) }],
      projectId.value ? Number(projectId.value) : undefined
    );
    showToast("success", `${activeTab.value.label} filters saved!`);
  } catch {
    showToast("error", "Failed to save filters.");
  } finally {
    saving.value = false;
  }
};

const useDefaults = () => {
  filterData.value[activeTabId.value] = { ...activeTab.value.defaults };
};

onMounted(() => {
  loadAll();
});
</script>

<template>
  <div class="flex max-h-[85vh] w-[42rem] flex-col overflow-hidden">
    <header class="mb-4 shrink-0">
      <h3 class="text-lg font-semibold text-gray-900">Manage filters</h3>
    </header>

    <nav class="mb-4 flex shrink-0 gap-1 border-b border-gray-200">
      <button
        v-for="tab in tabs"
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

    <p class="mb-3 shrink-0 text-sm text-gray-500">{{ activeTab.description }}</p>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div class="grid grid-cols-3 gap-3">
          <div>
            <p class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Min</p>
            <Input
              v-model="minModel"
              type="number"
              placeholder="0"
            />
          </div>
          <div>
            <p class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Max</p>
            <Input
              v-model="maxModel"
              type="number"
              placeholder="0"
            />
          </div>
          <div>
            <p class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Step</p>
            <Input
              v-model="stepModel"
              type="number"
              :is-float="true"
              placeholder="1"
            />
          </div>
        </div>
      </div>

      <p class="mt-3 text-xs text-gray-500">Values are normalized automatically: min >= 0, max >= min, step > 0.</p>
    </div>

    <footer class="mt-5 flex shrink-0 items-center justify-between border-t border-gray-200 pt-4">
      <button type="button" class="text-sm text-gray-500 underline hover:text-gray-600" @click="useDefaults">
        Reset to defaults
      </button>
      <Button title="Save" class="!w-fit" :loading="saving" @click="saveFilters" />
    </footer>
  </div>
</template>
