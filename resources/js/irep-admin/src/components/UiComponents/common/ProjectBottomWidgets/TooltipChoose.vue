<script setup lang="ts">
import { PLUGIN_ASSETS_PATH } from "@/src/composables/constants";
import RadioCards from "../../form/RadioCards.vue";

const tooltipModel = defineModel<string>();

type TooltipOption = {
  value: number;
  label: string;
  image: string;
};

const options: TooltipOption[] = [
  {
    value: 1,
    label: "Tooltip 1",
    image: `${PLUGIN_ASSETS_PATH}tooltip-1.webp`
  },
  {
    value: 2,
    label: "Tooltip 2 - follow cursor",
    image: `${PLUGIN_ASSETS_PATH}tooltip-2-3.webp`
  },
  {
    value: 3,
    label: "Tooltip 3",
    image: `${PLUGIN_ASSETS_PATH}tooltip-2-3.webp`
  },
  {
    value: 4,
    label: "Tooltip 4",
    image: `${PLUGIN_ASSETS_PATH}tooltip-4.webp`
  },
  {
    value: 5,
    label: "Tooltip 5",
    image: `${PLUGIN_ASSETS_PATH}tooltip-5.webp`
  },
  {
    value: -1,
    label: "Without tooltip",
    image: ""
  }
];
</script>

<template>
  <RadioCards
    v-model="tooltipModel"
    label="Choose tooltip"
    name="tooltip"
    :options="options.map((option) => ({ value: option.value.toString(), label: option.label, image: option.image }))"
  />
</template>
