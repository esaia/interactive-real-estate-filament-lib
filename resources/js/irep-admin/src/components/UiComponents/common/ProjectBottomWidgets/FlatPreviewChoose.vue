<script setup lang="ts">
import { PLUGIN_ASSETS_PATH } from "@/src/composables/constants";
import RadioCards from "../../form/RadioCards.vue";

const flatPreviewModel = defineModel<string>();
const oneStyleModel = defineModel<string>("oneStyle");
const modalPlanModel = defineModel<string>("modalPlan");
const listPlanModel = defineModel<string>("listPlan");

const planOptions = [
  { value: "2d", label: "2D plan" },
  { value: "3d", label: "3D plan" },
];

type TooltipOption = {
  value: number;
  label: string;
  image: string;
};

const options: TooltipOption[] = [
  {
    value: 1,
    label: "Flat Preview 1",
    image: `${PLUGIN_ASSETS_PATH}flat-preview-1.webp`
  },
  {
    value: 2,
    label: "Flat Preview 2",
    image: `${PLUGIN_ASSETS_PATH}flat-preview-2.webp`
  }
];

const styleOptions = [
  { value: 1, label: "Style 1 — Centered" },
  { value: 2, label: "Style 2 — List" },
];
</script>

<template>
  <div class="flex flex-col gap-4">
    <RadioCards
      v-model="flatPreviewModel"
      label="Choose flat preview"
      name="flatPreview"
      :columns="'grid-cols-2'"
      :options="options.map((option) => ({ value: option.value.toString(), label: option.label, image: option.image }))"
    />

    <div v-if="flatPreviewModel === '1'" class="border-t border-gray-200 pt-4">
      <RadioCards
        v-model="oneStyleModel"
        label="Preview 1 — right side style"
        name="flatPreviewOneStyle"
        :columns="'grid-cols-2'"
        :options="styleOptions.map((option) => ({ value: option.value.toString(), label: option.label }))"
      />
    </div>

    <div class="border-t border-gray-200 pt-4">
      <RadioCards
        v-model="modalPlanModel"
        label="Default plan shown in flat modal"
        name="flatModalDefaultPlan"
        :options="planOptions"
      />
      <p class="mt-1.5 text-xs text-gray-400">
        When a flat has both 2D and 3D images, the modal opens on this plan. If the chosen
        plan has no image, the other one is shown.
      </p>
    </div>

    <div class="border-t border-gray-200 pt-4">
      <RadioCards
        v-model="listPlanModel"
        label="Default plan shown in grid list"
        name="flatListDefaultPlan"
        :options="planOptions"
      />
      <p class="mt-1.5 text-xs text-gray-400">
        When a flat has both 2D and 3D images, the flat cards in the list show this plan. If
        the chosen plan has no image, the other one is shown.
      </p>
    </div>
  </div>
</template>
