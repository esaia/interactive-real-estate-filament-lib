<script setup lang="ts">
// @ts-ignore
import SvgCanvas from "./SvgCanvas.vue";
import { PolygonDataCollection } from "../../types/components";
import Sidebar from "./UiComponents/common/Sidebar.vue";
import LinkPolygon from "./UiComponents/common/LinkPolygon/LinkPolygon.vue";
import { ref } from "vue";

defineEmits<{
  (e: "setActiveG", gTag: SVGGElement | null): void;
  (e: "deleteG", key: string): void;
  (e: "setSvgRef", svgContainer: HTMLDivElement): void;
  (e: "addPolygonData", key: string): void;
  (e: "updatePolygonData", key: string, updatedData: PolygonDataCollection): void;
}>();

defineProps<{
  projectImage: string;
  polygon_data: PolygonDataCollection[] | undefined;
  svgRef: HTMLElement | null;
  svg: string;
  activeGroup: SVGGElement | null;
  isFloorsCanvas: boolean;
  isBlockCanvas?: boolean;
}>();

const canvasRef = ref();

const onImgLoad = () => {
  setTimeout(() => {
    canvasRef.value?.setSvgViewBox();
  }, 500);
};
</script>

<template>
  <div class="relative overflow-x-hidden">
    <Sidebar
      v-if="polygon_data?.length"
      :active-group="activeGroup"
      :polygon_data="polygon_data"
      :svgRef="svgRef"
      @set-active-g="(gTag: any) => $emit('setActiveG', gTag)"
      @delete-g="(key: any) => $emit('deleteG', key)"
      @update-polygon-data="(key: any, data: any) => $emit('updatePolygonData', key, data)"
    />

    <Transition name="fade-in-out">
      <LinkPolygon
        v-if="activeGroup && canvasRef?.zoomLevel === 1"
        :key="(activeGroup && activeGroup.getAttribute('id')) || ''"
        :activeGroup="activeGroup"
        :polygon_data="polygon_data"
        :isFloorsCanvas="isFloorsCanvas"
        :isBlockCanvas="isBlockCanvas"
      />

      <div
        v-else-if="canvasRef?.zoomLevel != null && canvasRef?.zoomLevel !== 1"
        class="pointer-events-none absolute right-3 top-3 z-[99] flex items-center gap-3 rounded-xl border border-white/70 bg-white/85 px-3 py-2 text-gray-600 shadow-sm backdrop-blur-sm"
      >
        <div class="flex items-center gap-2">
          <p class="text-xs font-medium text-gray-400">Pan</p>
          <span
            class="inline-flex min-w-8 items-center justify-center rounded-md border border-gray-200 bg-white px-2 py-0.5 font-semibold uppercase tracking-wide text-gray-500 shadow-sm"
            >space</span
          >
          <span>+</span>
          <span
            class="inline-flex min-w-8 items-center justify-center rounded-md border border-gray-200 bg-white px-2 py-0.5 font-semibold uppercase tracking-wide text-gray-500 shadow-sm"
            >drag</span
          >
        </div>
        <span class="text-gray-600">|</span>
        <div class="flex items-center gap-2">
          <p class="text-xs font-medium text-gray-400">Reset</p>
          <span
            class="inline-flex min-w-8 items-center justify-center rounded-md border border-gray-200 bg-white px-2 py-0.5 font-semibold uppercase tracking-wide text-gray-500 shadow-sm"
            >ctrl</span
          >
          <span>+</span>
          <span
            class="inline-flex min-w-8 items-center justify-center rounded-md border border-gray-200 bg-white px-2 py-0.5 font-semibold uppercase tracking-wide text-gray-500 shadow-sm"
            >-</span
          >
        </div>
      </div>
    </Transition>

    <div class="max-h-[80vh] overflow-x-hidden">
      <div class="canvas-container relative h-full w-full select-none bg-white">
        <img :src="projectImage" class="left-0 top-0 h-full w-full" @load="onImgLoad" />
        <SvgCanvas
          ref="canvasRef"
          :svgRef="svgRef"
          :svg="svg"
          :active-group="activeGroup"
          @set-active-g="(gTag: SVGGElement | null) => $emit('setActiveG', gTag)"
          @set-svg-ref="(svgContainer: HTMLDivElement) => $emit('setSvgRef', svgContainer)"
          @add-polygon-data="(key: string) => $emit('addPolygonData', key)"
          @delete-g="(key: string) => $emit('deleteG', key)"
        />
      </div>
    </div>
  </div>
</template>

