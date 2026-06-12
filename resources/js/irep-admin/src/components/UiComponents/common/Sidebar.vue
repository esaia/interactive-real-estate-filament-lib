<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import Collapse from "../icons/Collapse.vue";
import Edit from "../icons/Edit.vue";
import { ActionItem, FlatItem, PolygonDataCollection } from "../../../../types/components";
import Info from "../icons/Info.vue";
import Delete from "../icons/Delete.vue";
import Unlink from "../icons/Unlink.vue";
import { useFloorsStore } from "@/src/stores/useFloors";
import Modal from "../Modal.vue";
import { useFlatsStore } from "@/src/stores/useFlats";
import CreateEditFlatModal from "../flats/CreateEditFlatModal.vue";
import CreateEditFloorModal from "../floors/CreateEditFloorModal.vue";
import { useProjectStore } from "@/src/stores/useProject";
import { useBlocksStore } from "@/src/stores/useBlock";
import CreateEditBlockModal from "../blocks/CreateEditBlockModal.vue";
import CreateEditActionModal from "../tooltip/CreateEditActionModal.vue";
import { useActionsStore } from "@/src/stores/useActions";
import RightClick from "../icons/RightClick.vue";
import LeftClick from "../icons/LeftClick.vue";
import Esc from "../icons/Esc.vue";
import Ctrl from "../icons/Ctrl.vue";
import PlusBtn from "../icons/PlusBtn.vue";
import MinusBtn from "../icons/MinusBtn.vue";
import Space from "../icons/Space.vue";
import { useTypesStore } from "@/src/stores/useTypes";
const isClollapsed = ref(false);

const emit = defineEmits<{
  (e: "setActiveG", gTag: SVGGElement | null): void;
  (e: "deleteG", key: string): void;
  (e: "updatePolygonData", key: string, updatedData: PolygonDataCollection): void;
}>();

const props = defineProps<{
  polygon_data: PolygonDataCollection[] | undefined;
  activeGroup: SVGGElement | null;
  svgRef: HTMLElement | null;
}>();

const projectStore = useProjectStore();
const floorsStore = useFloorsStore();
const blocksStore = useBlocksStore();
const flatStore = useFlatsStore();
const actionStore = useActionsStore();
const typeStore = useTypesStore();

const sidebarRef = ref<HTMLDivElement>();
const showEditModal = ref<"tooltip" | "flat" | "floor" | "block" | "type" | "">("");
const activeFlat = ref<FlatItem>();
const activeAction = ref<ActionItem>();
const showInfo = ref(false);

const findGroupByKey = (key: string) => {
  const selectors = [
    props.svgRef,
    projectStore.selected_360_image?.svgRef,
    projectStore.svgRef,
    document.querySelector(".svg-canvas-container")
  ].filter(Boolean) as Element[];

  for (const container of selectors) {
    const gTag = (container.querySelector(`g#${key}`) as SVGGElement) || null;
    if (gTag) return gTag;
  }

  return null;
};

const setActiveG = async (item: PolygonDataCollection) => {
  let gTag = findGroupByKey(item.key);

  if (!gTag) {
    await nextTick();
    gTag = findGroupByKey(item.key);
  }

  if (gTag) {
    emit("setActiveG", gTag);
  }
};

const deleteG = (item: PolygonDataCollection) => {
  emit("deleteG", item.key);
};

const unlink = (key: string) => {
  emit("updatePolygonData", key, { id: "", key, type: "" });
  emit("setActiveG", null);
};

const editOrDuplicateModal = (item: PolygonDataCollection) => {
  switch (item.type) {
    case "floor": {
      const activeFloor = floorsStore.projectFloors?.find((floor) => floor.id === item.id);

      if (!activeFloor) return;

      floorsStore.setActiveFloor(activeFloor);

      showEditModal.value = "floor";

      break;
    }

    case "block": {
      const activeBlock = blocksStore.projectBlocks?.find((block) => block.id === item.id);

      if (!activeBlock) return;

      blocksStore.setActiveBlock(activeBlock);

      showEditModal.value = "block";
      break;
    }
    case "flat": {
      const findedActiveFlat = flatStore.projectFlats?.find((flat) => flat.id === item.id);

      if (!findedActiveFlat) return;

      activeFlat.value = findedActiveFlat;

      showEditModal.value = "flat";
      break;
    }
    case "tooltip": {
      const findedActiveAction = actionStore.projectActions?.find((action) => action.id === item.id);
      if (!findedActiveAction) return;
      activeAction.value = findedActiveAction;
      showEditModal.value = "tooltip";
      break;
    }
    default:
      break;
  }
};

const editPolygon = (item: PolygonDataCollection) => {
  editOrDuplicateModal(item);
};

watch(
  () => props.activeGroup,
  async () => {
    await nextTick();

    const activeElement = sidebarRef.value?.querySelector(".active");

    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
      });
    }
  }
);

watch(
  () => showEditModal.value,
  (_, os) => {
    const id = Number(projectStore?.id);

    if (os === "tooltip") {
      actionStore.fetchProjectActions(id);
    } else if (os === "block") {
      blocksStore.fetchProjectBLocks(id);
    } else if (os === "type") {
      typeStore.fetchProjectTypes(id);
    } else if (os === "floor") {
      floorsStore.fetchProjectFloors(id);
    } else if (os === "flat") {
      flatStore.fetchProjectFlats(id);
    }
  }
);
</script>

<template>
  <div>
    <div
      class="custom-scroll absolute left-0 top-0 z-[99] flex h-full max-h-[80vh] flex-col bg-white/90 text-gray-900 transition-all duration-300 ease-out"
      :class="{
        '-translate-x-full': isClollapsed,
        'translate-x-0': !isClollapsed
      }"
    >
      <div
        class="absolute left-full top-1/2 translate-y-1/2 cursor-pointer rounded-r-md bg-gray-50/80 p-1 transition-all hover:bg-gray-100"
        @click="isClollapsed = !isClollapsed"
      >
        <Collapse
          :class="{
            'rotate-180': isClollapsed,
            'rotate-0': !isClollapsed
          }"
        />
      </div>

      <div class="flex items-center justify-between border-b border-gray-200 p-3">
        <h3 class="!text-lg">Shapes:</h3>

        <div class="cursor-pointer" @mouseenter="showInfo = true" @mouseleave="showInfo = false">
          <Info />
        </div>
      </div>

      <div ref="sidebarRef" class="flex max-h-full flex-col gap-[1px] overflow-y-auto overscroll-contain py-2">
        <div
          v-if="polygon_data"
          v-for="item in Object.values(polygon_data)"
          :key="item.key"
          class="group flex w-full min-w-60 cursor-pointer items-center justify-between gap-5 px-3 py-3 transition-colors hover:bg-gray-100/80 hover:ring-1 hover:ring-primary"
          :class="{
            'active bg-gray-100/80 ring-1 ring-primary': item.key === activeGroup?.getAttribute('id')
          }"
          @click="setActiveG(item)"
        >
          <div class="flex items-center gap-1 text-sm">
            <span v-if="item.type"> {{ item.type }} id: {{ item.id }} </span>
            <span v-else>#{{ item.key?.slice(0, 6) }}</span>
          </div>

          <div class="flex">
            <template v-if="item.id">
              <div class="sidebar-item-svgicon svgicon-hover-text" @click="unlink(item.key)" title="unlink">
                <Unlink />
              </div>

              <div class="sidebar-item-svgicon svgicon-hover-text" @click.stop="editPolygon(item)" title="edit">
                <Edit />
              </div>
            </template>

            <div class="sidebar-item-svgicon svgicon-hover-text" @click.stop="deleteG(item)" title="delete">
              <Delete />
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade-in-out">
      <div
        v-if="showInfo"
        class="absolute right-3 top-3 z-[999] flex max-h-[calc(80vh-1.5rem)] w-[280px] flex-col gap-3 overflow-y-auto rounded-2xl border border-white/70 bg-white/95 p-4 text-gray-600 shadow-md backdrop-blur-sm"
      >
        <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Canvas Shortcuts</p>

        <div class="flex items-center gap-3 rounded-xl bg-white/70 px-2.5 py-2">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm [&_svg]:h-6 [&_svg]:w-6">
            <LeftClick />
          </div>
          <p class="text-sm font-medium text-gray-600">Start drawing</p>
        </div>

        <div class="flex items-center gap-3 rounded-xl bg-white/70 px-2.5 py-2">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm [&_svg]:h-6 [&_svg]:w-6">
            <RightClick />
          </div>
          <p class="text-sm font-medium text-gray-600">Select item</p>
        </div>

        <div class="flex items-center gap-3 rounded-xl bg-white/70 px-2.5 py-2">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm [&_svg]:h-6 [&_svg]:w-6">
            <Esc class="!h-6 !w-6" />
          </div>
          <p class="text-sm font-medium text-gray-600">Cancel drawing</p>
        </div>

        <div class="flex items-center gap-3 rounded-xl bg-white/70 px-2.5 py-2">
          <div
            class="flex h-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white px-2 shadow-sm [&_svg]:h-6 [&_svg]:w-6"
          >
            <Ctrl />
            <span class="text-gray-500">+</span>
            <PlusBtn class="!h-7 !w-7" />
          </div>
          <p class="text-sm font-medium text-gray-600">Zoom in</p>
        </div>

        <div class="flex items-center gap-3 rounded-xl bg-white/70 px-2.5 py-2">
          <div
            class="flex h-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white px-2 shadow-sm [&_svg]:h-6 [&_svg]:w-6"
          >
            <Ctrl />
            <span class="text-gray-500">+</span>
            <MinusBtn class="!h-7 !w-7" />
          </div>
          <p class="text-sm font-medium text-gray-600">Reset zoom</p>
        </div>

        <div class="flex items-center gap-3 rounded-xl bg-white/70 px-2.5 py-2">
          <div
            class="flex h-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white px-2 shadow-sm [&_svg]:h-6 [&_svg]:w-6"
          >
            <Space class="!h-10 !w-10" />
          </div>
          <p class="text-sm font-medium text-gray-600">Panning</p>
        </div>
      </div>
    </Transition>

    <teleport to="#irep-vue-app">
      <Transition name="fade">
        <Modal :show="showEditModal === 'floor'" @close="showEditModal = ''" type="2" width="w-11/12">
          <CreateEditFloorModal />
        </Modal>
      </Transition>

      <Transition name="fade">
        <Modal :show="showEditModal === 'block'" @close="showEditModal = ''" type="2" width="w-11/12">
          <CreateEditBlockModal />
        </Modal>
      </Transition>

      <Transition name="fade">
        <Modal
          :show="!!(showEditModal === 'flat' && activeFlat)"
          @close="showEditModal = ''"
          type="2"
          width="w-[500px]"
        >
          <CreateEditFlatModal :activeFlat="activeFlat || null" />
        </Modal>
      </Transition>
    </teleport>

    <teleport to="#irep-vue-app">
      <Transition name="fade">
        <Modal :show="showEditModal === 'tooltip'" @close="showEditModal = ''" type="2" width="w-[500px]">
          <CreateEditActionModal :activeAction="activeAction || null" />
        </Modal>
      </Transition>
    </teleport>
  </div>
</template>

