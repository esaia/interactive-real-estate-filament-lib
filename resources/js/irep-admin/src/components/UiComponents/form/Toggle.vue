<script setup lang="ts">
import { PLEASE_UPGRADE_TO_GOLD } from "@/src/composables/constants";
import { showToast } from "@/src/composables/helpers";

const emit = defineEmits<{ (e: "change", value: boolean): void }>();
const props = defineProps<{ disabled?: boolean; label?: string }>();
const model = defineModel<boolean>({ default: false });

const toggle = () => {
  if (props.disabled) {
    showToast("error", PLEASE_UPGRADE_TO_GOLD);
    return;
  }
  model.value = !model.value;
  emit("change", model.value);
};
</script>

<template>
  <label class="flex cursor-pointer items-center gap-2" :class="{ 'pointer-events-none opacity-50': props.disabled }">
    <button
      type="button"
      role="switch"
      :aria-checked="model"
      class="relative h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
      :class="model ? 'bg-blue-500' : 'bg-gray-200'"
      @click.stop.prevent="toggle"
    >
      <span
        class="block h-4 w-4 rounded-full bg-white shadow transition-transform"
        :class="model ? 'translate-x-4' : 'translate-x-0'"
      />
    </button>
    <span v-if="props.label" class="text-sm text-gray-600">{{ props.label }}</span>
  </label>
</template>
