<script setup lang="ts">
import { createElement, createRoot } from "@wordpress/element";
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  component: any;
  componentProps: Record<string, unknown>;
}>();

const hostRef = ref<HTMLElement | null>(null);
let root: ReturnType<typeof createRoot> | null = null;
const UNMOUNT_DELAY_MS = 700;
let unmountTimer: ReturnType<typeof setTimeout> | null = null;

const renderReactComponent = () => {
  if (!root) return;
  root.render(createElement(props.component, props.componentProps || {}));
};

onMounted(() => {
  if (unmountTimer) {
    clearTimeout(unmountTimer);
    unmountTimer = null;
  }

  if (!hostRef.value) return;
  root = createRoot(hostRef.value);

  renderReactComponent();
});

watch(() => props.component, renderReactComponent);
watch(() => props.componentProps, renderReactComponent, { deep: true });

onUnmounted(() => {
  unmountTimer = setTimeout(() => {
    if (!root) return;
    root.unmount();
    root = null;
    unmountTimer = null;
  }, UNMOUNT_DELAY_MS);
});
</script>

<template>
  <div ref="hostRef" :class="{ 'w-full': props.componentProps?.type !== 'button' }"></div>
</template>
