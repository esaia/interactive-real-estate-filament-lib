<script setup lang="ts">
import { computed } from "vue";

type RadioCardOption = {
  value: string;
  label: string;
  image?: string;
};

const props = defineProps<{
  label: string;
  name: string;
  options: RadioCardOption[];
  columns?: string;
}>();

const model = defineModel<string>({ required: true });
const selectedOption = computed(() => props.options.find((item) => item.value === model.value));
</script>

<template>
  <div :data-name="name">
    <p v-if="props.label" class="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-500">
      {{ props.label }}
    </p>
    <div class="flex flex-wrap gap-2">
      <label
        v-for="option in props.options"
        :key="option.value"
        class="flex cursor-pointer items-center gap-1.5 rounded border px-2.5 py-1.5 text-sm transition-colors"
        :class="model === option.value
          ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'"
      >
        <input type="radio" :name="props.name" :value="option.value" v-model="model" class="sr-only" />
        {{ option.label }}
      </label>
    </div>
    <div v-if="selectedOption?.image" class="mt-2 rounded border border-gray-200 p-2">
      <img :src="selectedOption.image" :alt="selectedOption.label" class="h-32 w-full rounded object-contain" />
    </div>
  </div>
</template>
