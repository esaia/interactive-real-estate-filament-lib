<script setup lang="ts">
const props = defineProps<{ label: string; min: string; max: string; step: string; disabled?: boolean }>();
const model = defineModel<number | string>();

const onInput = (e: Event) => {
  model.value = Number((e.target as HTMLInputElement).value);
};
</script>

<template>
  <div class="w-full">
    <div class="mb-1 flex items-center justify-between">
      <label class="text-[11px] font-medium uppercase tracking-wide text-gray-600">{{ props.label }}</label>
      <span class="text-xs font-medium text-gray-900">{{ model ?? 0 }}</span>
    </div>
    <input
      type="range"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :value="Number(model ?? 0)"
      :disabled="props.disabled"
      class="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-100 accent-gray-900 disabled:opacity-50"
      @input="onInput"
    />
    <div class="mt-0.5 flex justify-between text-[10px] text-gray-500">
      <span>{{ props.min }}</span>
      <span>{{ props.max }}</span>
    </div>
  </div>
</template>
