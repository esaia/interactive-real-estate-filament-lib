<script setup lang="ts">
const props = defineProps<{
  title: string;
  outlined?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}>();
</script>

<template>
  <button
    :type="props.type || 'button'"
    :disabled="props.disabled || props.loading"
    class="inline-flex items-center justify-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-50"
    :class="props.outlined
      ? 'border border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200'
      : 'bg-gray-900 text-white hover:bg-gray-700'"
  >
    <svg v-if="props.loading" class="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
    {{ props.title }}
  </button>
</template>
