<script setup lang="ts">
import { computed } from "vue";
import TooltipChoose from "./TooltipChoose.vue";
import FlatPreviewChoose from "./FlatPreviewChoose.vue";

type ProjectConfigModel = {
  chosenTooltip: string;
  chooseFlatPreview: string;
  chooseFlatPreviewOneStyle: string;
};

const modelValue = defineModel<ProjectConfigModel>({ required: true });

const chosenTooltipValue = computed({
  get: () => modelValue.value.chosenTooltip,
  set: (value: string) => {
    modelValue.value = { ...modelValue.value, chosenTooltip: value };
  }
});

const chooseFlatPreviewValue = computed({
  get: () => modelValue.value.chooseFlatPreview,
  set: (value: string) => {
    modelValue.value = { ...modelValue.value, chooseFlatPreview: value };
  }
});

const chooseFlatPreviewOneStyleValue = computed({
  get: () => modelValue.value.chooseFlatPreviewOneStyle,
  set: (value: string) => {
    modelValue.value = { ...modelValue.value, chooseFlatPreviewOneStyle: value };
  }
});
</script>

<template>
  <div class="flex justify-between gap-4">
    <div class="flex-1">
      <TooltipChoose v-model="chosenTooltipValue" />
    </div>

    <div class="flex-1">
      <FlatPreviewChoose v-model="chooseFlatPreviewValue" v-model:oneStyle="chooseFlatPreviewOneStyleValue" />
    </div>
  </div>
</template>
