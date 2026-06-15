<script setup lang="ts">
defineEmits<{
  (e: "deleteAction"): void;
  (e: "cancelAction"): void;
}>();

defineProps<{ text: string }>();
</script>

<template>
  <div class="flex w-[300px] flex-col items-center gap-4 pt-8 text-center">
<div class="flex flex-col gap-1">
      <h3 class="!m-0 text-[0.9375rem] font-semibold text-gray-900">Are you sure?</h3>
      <p class="!m-0 text-xs leading-relaxed text-gray-400">{{ text }}</p>
    </div>

    <div class="w-full border-t border-gray-100" />

    <div class="flex w-full gap-2">
      <button
        class="flex-1 cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800"
        @click="$emit('cancelAction')"
      >
        Cancel
      </button>
      <button
        class="flex-1 cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 active:bg-red-700"
        @click="$emit('deleteAction')"
      >
        Delete
      </button>
    </div>
  </div>
</template>
