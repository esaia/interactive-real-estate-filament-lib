<script setup lang="ts">
import { computed } from "vue";
import ColorPicker from "../../form/ColorPicker.vue";
import Range from "../../form/Range.vue";
import LicensePlanBadge from "../LicensePlanBadge.vue";
import { pushToPlansPage } from "@/src/composables/helpers";
import { META } from "@/src/composables/constants";
const props = defineProps<{
  colors: {
    available_flat: string;
    path: string;
    path_hover: string;
    stroke: string;
    primary: string;
    stroke_width: number;
    border_radius: number;
  };
}>();

const emit = defineEmits<{
  (
    event: "update:colors",
    value: {
      available_flat: string;
      path: string;
      path_hover: string;
      stroke: string;
      primary: string;
      stroke_width: number;
      border_radius: number;
    }
  ): void;
}>();

const colors = computed({
  get: () => props.colors,
  set: (value) => emit("update:colors", value)
});

const emptyColors = {
  available_flat: "",
  path: "",
  path_hover: "",
  stroke: "",
  primary: "",
  stroke_width: 0,
  border_radius: 0
};

const metaColors = computed(() => {
  return Object.entries(colors.value || emptyColors).reduce(
    (arr, [key, value]) => {
      if (key !== "stroke_width" && key !== "border_radius") {
        arr.push({ key: `${key}_color`, value });
      } else {
        arr.push({ key, value });
      }
      return arr;
    },
    [] as { key: string; value: any }[]
  );
});

const bindColorField = <K extends keyof typeof emptyColors>(key: K) =>
  computed<(typeof emptyColors)[K]>({
    get: () => colors.value[key],
    set: (value) => {
      colors.value = { ...colors.value, [key]: value };
    }
  });

const availableFlat = bindColorField("available_flat");
const pathColor = bindColorField("path");
const pathHover = bindColorField("path_hover");
const strokeColor = bindColorField("stroke");
const primaryColor = bindColorField("primary");
const strokeWidth = bindColorField("stroke_width");
const borderRadius = bindColorField("border_radius");

const shapePreviewStyle = computed(() => {
  const w = Number(strokeWidth.value) || 0;
  const r = Number(borderRadius.value) || 0;
  const stroke = colors.value.stroke || "#64748b";
  const fill = "rgb(203 213 225 / 0.35)";

  return {
    width: "100%",
    maxWidth: "12rem",
    height: "6rem",
    boxSizing: "border-box" as const,
    borderStyle: w > 0 ? ("solid" as const) : "none",
    borderWidth: w > 0 ? `${w}px` : 0,
    borderColor: stroke,
    borderRadius: `${r}px`,
    backgroundColor: fill
  };
});

defineExpose({
  metaColors
});
</script>

<template>
  <div class="space-y-4">
    <div
      class="rounded-md border p-3"
      :class="irePlugin?.is_premium ? 'border-gray-200 bg-gray-50' : 'border-amber-200 bg-gray-50/40'"
    >
      <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Path Colors</p>
      <div class="relative mt-4">
        <div class="grid grid-cols-3 gap-3" :class="{ 'pointer-events-none opacity-60': !irePlugin?.is_premium }">
          <div class="rounded-md border bg-gray-50 p-2">
            <ColorPicker v-model="availableFlat" label="available flat" :default-color="META.PREVIEW_PATH_COLOR" />
          </div>
          <div class="rounded-md border bg-gray-50 p-2">
            <ColorPicker v-model="pathColor" label="path" :default-color="META.PREVIEW_PATH_COLOR" />
          </div>
          <div class="rounded-md border bg-gray-50 p-2">
            <ColorPicker v-model="pathHover" label="path hover" :default-color="META.PREVIEW_PATH_HOVER_COLOR" />
          </div>
          <div class="rounded-md border bg-gray-50 p-2">
            <ColorPicker v-model="strokeColor" label="stroke" :default-color="META.PREVIEW_STROKE_COLOR" />
          </div>
        </div>
        <div
          v-if="!irePlugin?.is_premium"
          class="absolute inset-0 cursor-pointer rounded-md bg-gray-400/20"
          @click="pushToPlansPage()"
        />
      </div>
      <div v-if="!irePlugin?.is_premium" class="mt-2">
        <LicensePlanBadge plan="premium" />
      </div>
    </div>

    <div class="rounded-md border border-amber-200 bg-gray-50/40 p-3">
      <div class="relative rounded-md border bg-gray-50 p-2">
        <ColorPicker
          v-model="primaryColor"
          label="Primary color"
          :default-color="META.PREVIEW_PRIMARY_COLOR"
          :disabled="!irePlugin?.is_gold"
        />
        <p class="mt-2 text-xs text-gray-500">Use a dark primary color for better contrast.</p>
        <div
          v-if="!irePlugin.is_gold"
          class="absolute bottom-0 left-0 h-full w-full cursor-pointer rounded-md bg-gray-400/35"
          @click="pushToPlansPage()"
        />
      </div>

      <div v-if="!irePlugin?.is_gold" class="mt-2">
        <LicensePlanBadge plan="gold" />
      </div>
    </div>

    <div class="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-6">
      <div class="min-w-0 flex-1 space-y-4">
        <div class="rounded-md border border-gray-200 bg-gray-50 p-3">
          <Range
            v-model="strokeWidth"
            label="Stroke width"
            min="0"
            max="20"
            step="0.1"
            :disabled="!irePlugin?.is_gold"
          />
        </div>

        <div class="rounded-md border border-gray-200 bg-gray-50 p-3">
          <Range
            v-model="borderRadius"
            label="Border radius"
            min="0"
            max="60"
            step="1"
            :disabled="!irePlugin?.is_gold"
          />
        </div>
      </div>

      <div
        class="flex min-w-0 flex-1 flex-col rounded-md border border-gray-200 bg-gray-50 p-4 md:max-w-sm"
        :class="{ 'pointer-events-none opacity-50': !irePlugin?.is_gold }"
      >
        <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Preview</p>
        <div
          class="flex min-h-[8rem] flex-1 items-center justify-center rounded-md border border-gray-200/80 bg-gray-50 p-6"
        >
          <div :style="shapePreviewStyle" />
        </div>
      </div>
    </div>
  </div>
</template>
