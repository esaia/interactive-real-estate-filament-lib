<script setup lang="ts">
import DragIcon from "@/src/components/UiComponents/icons/DragIcon.vue";
import Delete from "@/src/components/UiComponents/icons/Delete.vue";

withDefaults(
  defineProps<{
    isSelected?: boolean;
    showDrag?: boolean;
    hasPolygons?: boolean;
    /** Off for single-image fields, where "Replace" already covers the change. */
    showDelete?: boolean;
  }>(),
  {
    isSelected: false,
    showDrag: false,
    showDelete: true
  }
);

const emit = defineEmits<{
  (e: "select"): void;
  (e: "delete"): void;
}>();
</script>

<template>
  <div
    class="group relative flex h-24 w-24 cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 bg-gray-100 p-1 transition-all duration-200 hover:border-gray-300 hover:bg-gray-200"
    :class="{
      'border-blue-500 ring-2 ring-blue-500/40': isSelected
    }"
    @click="emit('select')"
  >
    <button
      v-if="showDrag"
      class="drag-handle absolute left-1 top-1 z-40 cursor-grab rounded bg-gray-50/90 p-0.5 text-gray-500 opacity-0 shadow-sm transition-opacity hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group-hover:opacity-100"
      title="Drag to reorder"
      aria-label="Drag to reorder"
      @click.stop
    >
      <DragIcon class="size-5" />
    </button>

    <div class="preview-content h-full w-full overflow-hidden rounded">
      <slot />
    </div>

    <div
      class="pointer-events-none absolute left-0 top-0 h-full w-full rounded-md bg-black/0 transition-all duration-200 group-hover:bg-black/25"
    ></div>

    <!-- Kept in the corner rather than over the middle of the card: the card
         itself is a select target, so a centred button invites misclicks. -->
    <button
      v-if="showDelete"
      type="button"
      class="absolute right-1 top-1 z-40 shrink-0 rounded-md bg-white/90 p-1 text-red-500 opacity-0 shadow-sm transition-all duration-200 hover:bg-red-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 group-hover:opacity-100"
      title="Remove image"
      aria-label="Remove image"
      @click.stop="emit('delete')"
    >
      <Delete class="size-4" />
    </button>

    <div
      v-if="hasPolygons"
      class="absolute left-1 top-1 size-1.5 rounded-full bg-orange-400"
      title="This image has SVG polygons drawn on it"
    ></div>
  </div>
</template>

<style scoped>
.group:hover .preview-content :deep(img) {
  transform: scale(1.1);
}

.preview-content :deep(img) {
  transition: transform 200ms ease;
}
</style>
