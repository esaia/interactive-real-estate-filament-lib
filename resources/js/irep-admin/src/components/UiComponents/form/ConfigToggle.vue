<script setup lang="ts">
import { PLEASE_UPGRADE_TO_GOLD } from "@/src/composables/constants";
import { showToast } from "@/src/composables/helpers";
import { nextTick } from "vue";

const emit = defineEmits<{
  (e: "change", value: string | null): void;
}>();

const props = defineProps<{
  disabled?: boolean;
}>();

const model = defineModel<string | null>({ default: null });

const toggle = async () => {
  if (props.disabled) {
    showToast("error", PLEASE_UPGRADE_TO_GOLD);
    return;
  }

  if (model.value === null) {
    model.value = "reserved";
  } else if (model.value === "reserved") {
    model.value = "sold";
  } else {
    model.value = null;
  }

  await nextTick();
  emit("change", model.value);
};

const getPosition = () => {
  if (!model.value) return "left-1 -translate-y-1/2";
  if (model.value === "reserved") return "left-1/2 -translate-x-1/2 -translate-y-1/2";
  return "right-1 -translate-y-1/2";
};

const getBackgroundColor = () => {
  if (!model.value) return "bg-green-500";
  if (model.value === "reserved") return "bg-yellow-500";
  if (model.value === "sold") return "bg-red-500";
  return "bg-gray-300";
};
</script>

<template>
  <div class="flex flex-col gap-1">
    <button
      type="button"
      role="switch"
      :aria-checked="model !== null"
      class="relative h-6 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      :class="getBackgroundColor()"
      @click="toggle"
    >
      <span class="absolute top-1/2 h-4 w-4 rounded-full bg-white shadow-md transition-all" :class="getPosition()" />
    </button>
  </div>
</template>
