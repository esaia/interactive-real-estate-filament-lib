<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
  }>(),
  { placeholder: "", label: "", disabled: false }
);

const emit = defineEmits<{ (e: "update:modelValue", params: typeof props.modelValue): void }>();

const labelText = computed(() => (props.required && props.label ? `${props.label} *` : props.label));

const onInput = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLTextAreaElement).value);
};
</script>

<template>
  <div class="w-full">
    <label v-if="labelText" class="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-500">
      {{ labelText }}
    </label>
    <textarea
      :value="modelValue || ''"
      :placeholder="placeholder"
      :disabled="disabled"
      class="min-h-[90px] w-full rounded border border-gray-300 bg-gray-100 px-2.5 py-1.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:bg-gray-50 disabled:opacity-60"
      @input="onInput"
    />
  </div>
</template>
