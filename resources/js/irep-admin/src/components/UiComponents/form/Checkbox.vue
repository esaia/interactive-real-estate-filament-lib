<script setup lang="ts">
import { showToast } from "@/src/composables/helpers";

const emit = defineEmits<{ (e: "change", val: boolean): void }>();
const props = defineProps<{ title?: string; desc?: string; disabled?: boolean }>();
const model = defineModel<any>();

const toggle = () => {
  if (props.disabled) {
    showToast("error", "Upgrade plan!");
    return;
  }
  model.value = !model.value;
  emit("change", Boolean(model.value));
};
</script>

<template>
  <label class="flex cursor-pointer items-start gap-2" :class="{ 'pointer-events-none opacity-50': props.disabled }" @click.prevent="toggle">
    <span
      class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors"
      :style="model ? 'background:#2563eb;border-color:#2563eb' : 'background:#fff;border-color:#d1d5db'"
    >
      <svg v-if="model" class="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span class="flex flex-col">
      <span v-if="props.title" class="text-sm text-gray-600">{{ props.title }}</span>
      <span v-if="props.desc" class="text-xs text-gray-400">{{ props.desc }}</span>
    </span>
  </label>
</template>
