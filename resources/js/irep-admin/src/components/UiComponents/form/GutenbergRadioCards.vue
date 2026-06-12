<script setup lang="ts">
type Option = {
  value: string;
  label: string;
};

const props = defineProps<{
  label: string;
  options: Option[];
}>();

const model = defineModel<string>({ required: true });
</script>

<template>
  <div>
    <p v-if="props.label" class="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-600">
      {{ props.label }}
    </p>
    <div class="inline-flex rounded border border-gray-200 bg-gray-50 p-0.5">
      <button
        v-for="option in props.options"
        :key="option.value"
        type="button"
        class="rounded px-3 py-1 text-sm font-medium transition-all"
        :class="model === option.value
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-400 hover:text-gray-600'"
        @click="model = option.value"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
