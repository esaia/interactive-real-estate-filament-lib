<script setup lang="ts">
import { ref } from "vue";
import Upload from "@/src/components/UiComponents/icons/Upload.vue";
import { imageInterface } from "@/types/components";
import draggable from "vuedraggable";
import { useProjectStore } from "@/src/stores/useProject";
import { storeToRefs } from "pinia";
import UploadPreviewCard from "@/src/components/UiComponents/form/UploadPreviewCard.vue";
import MediaLibraryModal from "@/src/components/UiComponents/form/MediaLibraryModal.vue";

const props = defineProps<{
  title: string;
  required?: boolean;
  multiple?: boolean;
  resolution?: string;
}>();

const projectStore = useProjectStore();
const { images_360, selected_360_image_index } = storeToRefs(projectStore);

const showLibrary = ref(false);

const onLibrarySelect = (selected: imageInterface[]) => {
  const newImages = selected.map((item) => ({
    img: item.url,
    svg: "",
    polygon_data: [],
    svgRef: null
  }));

  const combined = [...images_360.value, ...newImages];
  images_360.value = Array.from(new Map(combined.map((item) => [item.img, item])).values());
  projectStore.syncSelected360ImageIdentity();
};

const set360ImageIndex = (index: number) => {
  projectStore.setSelected360ImageIndex(index);
};

const sortImagesByName = () => {
  if (!Array.isArray(images_360.value) || images_360.value.length < 2) return;
  projectStore.persist360SvgFromRef();

  images_360.value = [...images_360.value].sort((a, b) => {
    const aName = (a?.img || "").split("/").pop() || "";
    const bName = (b?.img || "").split("/").pop() || "";
    return aName.localeCompare(bName, undefined, { sensitivity: "base", numeric: true });
  });
  projectStore.syncSelected360ImageIdentity();
};

const removeAllImages = () => {
  projectStore.persist360SvgFromRef();
  images_360.value = [];
  projectStore.setSelected360ImageIndex(0);
  projectStore.syncSelected360ImageIdentity();
};

const deleteImage = (img: string) => {
  projectStore.persist360SvgFromRef();
  images_360.value = images_360.value.filter((item) => item && item.img !== img);
  projectStore.syncSelected360ImageIdentity();
};
</script>
<template>
  <div class="mt-4 w-full rounded-md bg-white p-4">
    <div class="!mb-2 flex items-center justify-between">
      <p class="text-[11px] font-medium uppercase tracking-wide text-gray-600">
        {{ title }} <span v-if="required" class="text-red-600">*</span>
        <span v-if="resolution" class="text-gray-500"> - {{ resolution }}</span>
      </p>
      <div class="flex items-center gap-2">
        <button
          type="button"
          :disabled="!images_360?.length"
          class="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          @dblclick="removeAllImages"
        >
          Remove all
        </button>

        <button
          type="button"
          class="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
          @click="sortImagesByName"
        >
          Sort by name
        </button>
      </div>
    </div>

    <div class="flex w-full gap-2 overflow-x-auto py-4 pr-4">
      <button
        type="button"
        class="flex h-24 w-24 shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-gray-300 bg-white p-3 transition-all hover:bg-gray-50"
        @click.prevent="showLibrary = true"
      >
        <Upload class="size-5 text-gray-400" />
        <p class="text-xs text-gray-500">Upload</p>
      </button>

      <draggable
        v-if="images_360"
        v-model="images_360"
        item-key="img"
        handle=".drag-handle"
        ghost-class="opacity-50"
        class="flex items-center gap-2"
      >
        <template #item="{ element: image, index }">
          <UploadPreviewCard
            :is-selected="selected_360_image_index === index"
            :has-polygons="image?.polygon_data?.length > 0"
            :show-drag="images_360?.length > 1"
            @select="set360ImageIndex(index)"
            @delete="deleteImage(image.img)"
          >
            <div class="flex h-full w-full flex-col justify-between">
              <img v-if="image?.img" :src="image?.img" class="h-full w-full rounded-md object-cover" />
              <span class="mt-0.5 text-xs text-gray-500">{{ index }}</span>
            </div>
          </UploadPreviewCard>
        </template>
      </draggable>
    </div>
  </div>

  <MediaLibraryModal
    :show="showLibrary"
    :multiple="multiple ?? true"
    @close="showLibrary = false"
    @select="onLibrarySelect"
  />
</template>
