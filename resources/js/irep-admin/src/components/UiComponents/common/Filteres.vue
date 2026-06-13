<script setup lang="ts">
import { useBlocksStore } from "@/src/stores/useBlock";
import { computed } from "vue";
import Select from "../form/Select.vue";
import { selectDataItem } from "@/types/components";
import { useFloorsStore } from "@/src/stores/useFloors";
import { storeToRefs } from "pinia";

const selectedBlock = defineModel<any>("block", {
  set: (block: selectDataItem | undefined) => {
    return block?.value ?? "none";
  },
  get: (blockId: string | undefined) => {
    return blocks.value?.find((block) => String(block.value) === String(blockId));
  }
});

const selectedFloor = defineModel<any>("floor", {
  set: (floor: selectDataItem | undefined) => {
    return floor?.value;
  },
  get: (floorId: string | undefined) => {
    return floors.value?.find((floor) => String(floor.value) === String(floorId));
  }
});

defineProps<{
  showOnlyBlocks?: boolean;
}>();

const blocksStore = useBlocksStore();
const floorStore = useFloorsStore();

const { projectFloors } = storeToRefs(floorStore);

const blocks = computed(() => {
  const selectBlockData = blocksStore.projectBlocks?.map((block) => {
    return {
      title: block.title,
      value: block.id
    };
  });
  selectBlockData?.unshift({ title: "None", value: "none" });
  selectBlockData?.unshift({ title: "All", value: "all" });
  return selectBlockData;
});

// const floors = computed(() => {
//   const floors = new Set(floorStore.projectFloors?.map((floor) => floor?.floor_number));

//   return Array.from(floors)
//     .sort((a, b) => a - b)
//     .map((item) => {
//       return {
//         title: item.toString(),
//         value: item.toString()
//       };
//     });
// });

const floors = computed(() => {
  if (!projectFloors.value) return [];

  return projectFloors.value
    .sort((a, b) => Number(a.floor_number) - Number(b.floor_number))
    ?.map((floor) => {
      const blockTitle = floor?.block_id
        ? blocksStore.projectBlocks?.find((b) => String(b.id) === String(floor.block_id))?.title
        : null;
      return {
        title: `${floor.floor_number}${blockTitle ? " | " + blockTitle : ""}`,
        value: floor.id
      };
    });
});
</script>

<template>
  <div class="flex items-center gap-4">
    <Select
      v-if="blocks && blocks?.length > 1"
      v-model="selectedBlock"
      :data="blocks"
      placeholder="Filter by block"
      clearable
      class="min-w-[150px]"
    />

    <Select
      v-if="!showOnlyBlocks"
      v-model="selectedFloor"
      :data="floors"
      placeholder="Filter by Floors"
      clearable
      class="min-w-[150px]"
    />
  </div>
</template>
