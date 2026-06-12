<script setup lang="ts">
const props = defineProps<{ name: string; label: string; value: string }>();
const model = defineModel<string>();
</script>

<template>
  <label class="flex cursor-pointer items-center gap-2">
    <span
      class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-gray-100 transition-colors"
      :class="model === props.value ? 'border-blue-400' : ''"
      @click="model = props.value"
    >
      <span v-if="model === props.value" class="h-2 w-2 rounded-full bg-blue-400" />
    </span>
    <span class="text-sm text-gray-600">{{ props.label }}</span>
    <input type="radio" :name="props.name" :value="props.value" v-model="model" class="sr-only" />
  </label>
</template>
