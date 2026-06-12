<script setup lang="ts">
const props = defineProps<{
  /** `gold` shows “Gold feature”, `premium` shows “Premium feature” (display is uppercase via styles). */
  plan: "gold" | "premium" | string;
}>();
</script>

<template>
  <span
    class="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800"
  >
    {{ plan }}
  </span>
</template>
