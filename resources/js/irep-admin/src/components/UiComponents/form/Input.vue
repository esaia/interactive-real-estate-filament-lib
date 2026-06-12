<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    type?: string;
    label?: string;
    required?: boolean;
    isFloat?: boolean;
    disabled?: boolean;
  }>(),
  { placeholder: "", type: "text", label: "" }
);

const emit = defineEmits<{ (e: "update:modelValue", params: typeof props.modelValue): void }>();

const sanitizeNumericString = (raw: string, allowFloat: boolean): string => {
  if (raw === "") return "";
  let negative = false;
  let rest = raw;
  if (rest.startsWith("-")) { negative = true; rest = rest.slice(1); }
  if (!allowFloat) {
    rest = rest.replace(/\D/g, "");
    return (negative ? "-" : "") + rest;
  }
  let dotSeen = false;
  let out = "";
  for (const c of rest) {
    if (c === "." && !dotSeen) { dotSeen = true; out += c; }
    else if (/\d/.test(c)) { out += c; }
  }
  return (negative ? "-" : "") + out;
};

const nativeType = computed(() => (props.type === "number" ? "text" : props.type));
const labelText = computed(() => (props.required && props.label ? `${props.label} *` : props.label));

const onInput = (e: Event) => {
  const raw = (e.target as HTMLInputElement).value;
  const value = props.type === "number" ? sanitizeNumericString(raw, Boolean(props.isFloat)) : raw;
  emit("update:modelValue", value);
};
</script>

<template>
  <div class="w-full">
    <label v-if="labelText" class="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-500">
      {{ labelText }}
    </label>
    <input
      :type="nativeType"
      :value="modelValue == null ? '' : String(modelValue)"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full rounded border border-gray-300 bg-gray-100 px-2.5 py-1.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:bg-gray-50 disabled:opacity-60"
      @input="onInput"
    />
  </div>
</template>
