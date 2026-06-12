<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { selectDataItem } from "@/types/components";
import { pushToPlansPage } from "@/src/composables/helpers";

const props = withDefaults(
  defineProps<{
    data: selectDataItem[];
    modelValue: selectDataItem | null;
    defaultValue?: selectDataItem | null;
    placeholder?: string;
    label?: string;
    placeholderPrefix?: string;
    clearable?: boolean;
    required?: boolean;
    isSearchable?: boolean;
    description?: string;
  }>(),
  {
    placeholder: "Choose",
    placeholderPrefix: "",
    defaultValue: null,
    label: "",
    clearable: false,
    isSearchable: true,
    description: ""
  }
);

const emit = defineEmits<{ (e: "update:modelValue", param: typeof props.modelValue): void }>();

const open = ref(false);
const search = ref("");
const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const current = computed(() => props.modelValue ?? props.defaultValue);

const labelText = computed(() =>
  props.required && props.label ? `${props.label} *` : props.label
);

const options = computed(() =>
  (props.data || []).map((item) => ({
    ...item,
    _label:
      item.title +
      (item.isLinked && item.value !== current.value?.value ? " - linked" : "") +
      (item.isDisabled ? " - upgrade plan" : ""),
    _disabled: Boolean(item.isLinked && item.value !== current.value?.value)
  }))
);

const filtered = computed(() => {
  if (!props.isSearchable || !search.value) return options.value;
  const q = search.value.toLowerCase();
  return options.value.filter((o) => o._label.toLowerCase().includes(q));
});

const displayValue = computed(() => {
  if (!current.value) return "";
  const found = options.value.find((o) => String(o.value) === String(current.value!.value));
  return found?._label ?? current.value.title ?? "";
});

const select = (item: (typeof options.value)[0]) => {
  if (item._disabled) { pushToPlansPage(); return; }
  if (item.isLinked) return;
  emit("update:modelValue", item);
  open.value = false;
  search.value = "";
};

const clear = (e: MouseEvent) => {
  e.stopPropagation();
  emit("update:modelValue", null);
  search.value = "";
};

const toggle = async () => {
  open.value = !open.value;
  if (open.value && props.isSearchable) {
    await nextTick();
    inputRef.value?.focus();
  }
};

const onClickOutside = (e: MouseEvent) => {
  if (!containerRef.value?.contains(e.target as Node)) {
    open.value = false;
    search.value = "";
  }
};

onMounted(() => document.addEventListener("mousedown", onClickOutside));
onBeforeUnmount(() => document.removeEventListener("mousedown", onClickOutside));

watch(() => props.modelValue, () => { search.value = ""; });
</script>

<template>
  <div ref="containerRef" class="relative w-full">
    <p v-if="labelText" class="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
      {{ labelText }}
    </p>
    <p v-if="props.description" class="mb-1 text-xs text-gray-400">{{ props.description }}</p>

    <!-- Trigger -->
    <button
      type="button"
      class="flex w-full items-center justify-between rounded border border-gray-300 bg-gray-100 px-2.5 py-1.5 text-left text-sm text-gray-900 transition-colors hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
      @click="toggle"
    >
      <span v-if="current" class="flex items-center gap-1.5 truncate">
        <span
          v-if="current.color"
          class="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-black/10"
          :style="{ backgroundColor: current.color }"
        />
        <span class="truncate">{{ displayValue }}</span>
      </span>
      <span v-else class="text-gray-400">{{ props.placeholder }}</span>
      <span class="ml-1 flex shrink-0 items-center gap-1">
        <button
          v-if="props.clearable && current"
          type="button"
          class="flex h-4 w-4 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800"
          @click="clear"
        >
          <svg class="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <svg class="h-4 w-4 text-gray-500 transition-transform" :class="open ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
        </svg>
      </span>
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="absolute z-50 mt-1 w-full rounded border border-gray-200 bg-gray-50 shadow-lg shadow-gray-200/40"
        style="max-height: 280px; display: flex; flex-direction: column;"
      >
        <div v-if="props.isSearchable" class="border-b border-gray-200 p-1.5">
          <input
            ref="inputRef"
            v-model="search"
            type="text"
            class="w-full rounded border border-gray-300 bg-gray-100 px-2 py-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="Search..."
          />
        </div>
        <ul class="overflow-y-auto" style="max-height: 230px;">
          <li v-if="!filtered.length" class="px-3 py-2 text-sm text-gray-400">No options</li>
          <li
            v-for="item in filtered"
            :key="String(item.value)"
            class="flex cursor-pointer items-center gap-2 px-2.5 py-1.5 text-sm transition-colors"
            :class="[
              String(item.value) === String(current?.value) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100',
              item._disabled ? 'opacity-50' : ''
            ]"
            @click="select(item)"
          >
            <span
              v-if="item.color"
              class="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-black/10"
              :style="{ backgroundColor: item.color }"
            />
            <span class="truncate">{{ item._label }}</span>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>
