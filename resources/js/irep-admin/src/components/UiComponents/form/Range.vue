<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ label: string; min: string; max: string; step: string; disabled?: boolean }>();
const model = defineModel<number | string>();

const onInput = (e: Event) => {
  model.value = Number((e.target as HTMLInputElement).value);
};

/** How far along the track the thumb sits, so the filled part can be painted. */
const percent = computed(() => {
  const min = Number(props.min) || 0;
  const max = Number(props.max) || 0;
  const value = Number(model.value ?? 0);

  if (max <= min) return 0;

  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
});

// Blue to match the rest of the admin (toggles, buttons); the track is filled
// up to the thumb rather than left flat grey.
const trackStyle = computed(() => ({
  background: `linear-gradient(to right, #3b82f6 ${percent.value}%, #e5e7eb ${percent.value}%)`
}));
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
      :style="trackStyle"
      class="irep-range h-1.5 w-full cursor-pointer appearance-none rounded-full accent-blue-500 disabled:opacity-50"
      @input="onInput"
    />
    <div class="mt-0.5 flex justify-between text-[10px] text-gray-500">
      <span>{{ props.min }}</span>
      <span>{{ props.max }}</span>
    </div>
  </div>
</template>

<style scoped>
/* `accent-color` alone leaves the thumb at the browser default size and paints
   no filled track, so the thumb is styled explicitly on both engines. */
.irep-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 1rem;
  width: 1rem;
  border-radius: 9999px;
  background: #3b82f6;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.irep-range::-moz-range-thumb {
  height: 1rem;
  width: 1rem;
  border-radius: 9999px;
  background: #3b82f6;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.irep-range:disabled::-webkit-slider-thumb,
.irep-range:disabled::-moz-range-thumb {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>
