<script setup lang="ts">
/**
 * Additional views panel.
 *
 * A project can be presented from several angles. View 1 is the project's own
 * image; views 2..N live in the project's `views` array. Clicking a view puts
 * it on the canvas so its SVG polygons can be drawn, and each view can carry a
 * separate image for screens narrower than the mobile breakpoint.
 */
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import draggable from "vuedraggable";
import Upload from "@/src/components/UiComponents/icons/Upload.vue";
import Delete from "@/src/components/UiComponents/icons/Delete.vue";
import Mobile from "@/src/components/UiComponents/icons/Mobile.vue";
import UploadPreviewCard from "@/src/components/UiComponents/form/UploadPreviewCard.vue";
import MediaLibraryModal from "@/src/components/UiComponents/form/MediaLibraryModal.vue";
import { useProjectStore } from "@/src/stores/useProject";
import { imageInterface } from "@/types/components";

const projectStore = useProjectStore();
const {
  views,
  view_label,
  mobile_image,
  project_image,
  selected_view_index,
  selected_view_mode,
  mobile_breakpoint,
  polygon_data,
  mobile_polygon_data,
} = storeToRefs(projectStore);

// Which picker is open: the "add views" one, or a mobile image for a slot
// (index 0 = view 1, 1..N = views[i - 1]).
const libraryTarget = ref<"views" | number | null>(null);

const onLibrarySelect = (selected: imageInterface[]) => {
  if (libraryTarget.value === "views") {
    projectStore.addViews(selected);
  } else if (typeof libraryTarget.value === "number") {
    const image = selected[0] ?? null;
    if (libraryTarget.value === 0) {
      mobile_image.value = image;
    } else {
      const view = views.value[libraryTarget.value - 1];
      if (view) view.mobile_image = image;
    }
  }

  libraryTarget.value = null;
};

const clearMobileImage = (slot: number) => {
  if (slot === 0) {
    mobile_image.value = null;
    return;
  }

  const view = views.value[slot - 1];
  if (view) view.mobile_image = null;
};

const mobileImageFor = (slot: number) =>
  slot === 0 ? mobile_image.value : views.value[slot - 1]?.mobile_image ?? null;

const hasPolygons = (slot: number) =>
  slot === 0
    ? (polygon_data.value?.length ?? 0) > 0
    : (views.value[slot - 1]?.polygon_data?.length ?? 0) > 0;

// Polygons drawn on a slot that has no image can't be shown anywhere, so the
// marker would only be confusing — require both.
const hasMobilePolygons = (slot: number) => {
  if (!mobileImageFor(slot)?.url) return false;

  return slot === 0
    ? (mobile_polygon_data.value?.length ?? 0) > 0
    : (views.value[slot - 1]?.mobile_polygon_data?.length ?? 0) > 0;
};

const isMobileSlotSelected = (slot: number) =>
  selected_view_index.value === slot && selected_view_mode.value === "mobile";

const isDesktopSlotSelected = (slot: number) =>
  selected_view_index.value === slot && selected_view_mode.value === "desktop";

// An empty mobile slot opens the library; a filled one puts its image on the
// canvas so its own polygons can be drawn.
const onMobileTileClick = (slot: number) => {
  if (mobileImageFor(slot)?.url) {
    projectStore.selectView(slot, "mobile");
    return;
  }

  libraryTarget.value = slot;
};

const shortcodeHint = computed(() => views.value.length > 0);
</script>

<template>
  <div class="mt-4 w-full rounded-md bg-white p-4">
    <div class="mb-2 flex flex-wrap items-center justify-between gap-3">
      <p class="text-[11px] font-medium uppercase tracking-wide text-gray-600">
        Additional views
      </p>

      <div class="flex items-center gap-3 text-xs text-gray-500">
        <label class="flex items-center gap-2">
          <span>Mobile breakpoint</span>
          <input
            v-model.number="mobile_breakpoint"
            type="number"
            min="320"
            max="1600"
            class="w-20 rounded-md border border-gray-300 px-2 py-1 text-center text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
          />
          <span>px</span>
        </label>
        <span class="text-gray-400">Click a view to edit its SVG polygons</span>
      </div>
    </div>

    <div class="flex w-full items-start gap-2 overflow-x-auto py-4 pr-4">
      <button
        type="button"
        class="flex h-24 w-24 shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-gray-300 bg-white p-3 transition-all hover:bg-gray-50"
        @click.prevent="libraryTarget = 'views'"
      >
        <Upload class="size-5 text-gray-400" />
        <p class="text-xs text-gray-500">Upload</p>
      </button>

      <!-- View 1: the project's own image -->
      <div class="flex w-24 shrink-0 flex-col gap-2">
        <UploadPreviewCard
          :is-selected="isDesktopSlotSelected(0)"
          :has-polygons="hasPolygons(0)"
          :show-delete="false"
          @select="projectStore.selectView(0, 'desktop')"
        >
          <img
            v-if="project_image?.url"
            :src="project_image.url"
            class="h-full w-full rounded-md object-cover"
          />
          <div v-else class="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
            No image
          </div>
        </UploadPreviewCard>

        <input
          v-model="view_label"
          type="text"
          placeholder="View 1"
          class="w-24 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-900 focus:border-blue-500 focus:outline-none"
        />

        <button
          type="button"
          class="group relative flex h-14 w-24 items-center justify-center gap-1 overflow-hidden rounded-md border border-dashed border-gray-300 text-[11px] text-gray-500 transition-colors hover:bg-gray-50"
          :class="{ 'border-solid border-blue-500 ring-2 ring-blue-500/40': isMobileSlotSelected(0) }"
          :title="mobileImageFor(0)?.url ? 'Edit polygons on the mobile image' : 'Choose a mobile image'"
          @click="onMobileTileClick(0)"
        >
          <img
            v-if="mobileImageFor(0)?.url"
            :src="mobileImageFor(0)!.url"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <span
            class="relative z-10 flex items-center gap-1 rounded px-1"
            :class="mobileImageFor(0)?.url ? 'bg-white/85' : ''"
          >
            <Mobile class="size-3.5" />
            Mobile
          </span>
          <span
            v-if="hasMobilePolygons(0)"
            class="absolute left-1 top-1 z-20 size-1.5 rounded-full bg-orange-400"
          ></span>
          <span
            v-if="mobileImageFor(0)?.url"
            class="absolute right-1 top-1 z-20 rounded bg-white/90 p-0.5 text-red-500 opacity-0 transition-opacity group-hover:opacity-100"
            title="Remove mobile image"
            @click.stop="clearMobileImage(0)"
          >
            <Delete class="size-3.5" />
          </span>
        </button>
      </div>

      <!-- Views 2..N -->
      <draggable
        v-model="views"
        item-key="label"
        handle=".drag-handle"
        ghost-class="opacity-50"
        class="flex items-start gap-2"
      >
        <template #item="{ element: view, index }">
          <div class="flex w-24 shrink-0 flex-col gap-2">
            <UploadPreviewCard
              :is-selected="isDesktopSlotSelected(index + 1)"
              :has-polygons="hasPolygons(index + 1)"
              :show-drag="views.length > 1"
              @select="projectStore.selectView(index + 1, 'desktop')"
              @delete="projectStore.removeView(index)"
            >
              <img
                v-if="view?.image?.url"
                :src="view.image.url"
                class="h-full w-full rounded-md object-cover"
              />
            </UploadPreviewCard>

            <input
              v-model="view.label"
              type="text"
              :placeholder="`View ${index + 2}`"
              class="w-24 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-900 focus:border-blue-500 focus:outline-none"
            />

            <button
              type="button"
              class="group relative flex h-14 w-24 items-center justify-center gap-1 overflow-hidden rounded-md border border-dashed border-gray-300 text-[11px] text-gray-500 transition-colors hover:bg-gray-50"
              :class="{ 'border-solid border-blue-500 ring-2 ring-blue-500/40': isMobileSlotSelected(index + 1) }"
              :title="view?.mobile_image?.url ? 'Edit polygons on the mobile image' : 'Choose a mobile image'"
              @click="onMobileTileClick(index + 1)"
            >
              <img
                v-if="view?.mobile_image?.url"
                :src="view.mobile_image.url"
                class="absolute inset-0 h-full w-full object-cover"
              />
              <span
                class="relative z-10 flex items-center gap-1 rounded px-1"
                :class="view?.mobile_image?.url ? 'bg-white/85' : ''"
              >
                <Mobile class="size-3.5" />
                Mobile
              </span>
              <span
                v-if="hasMobilePolygons(index + 1)"
                class="absolute left-1 top-1 z-20 size-1.5 rounded-full bg-orange-400"
                title="This image has SVG polygons drawn on it"
              ></span>
              <span
                v-if="view?.mobile_image?.url"
                class="absolute right-1 top-1 z-20 rounded bg-white/90 p-0.5 text-red-500 opacity-0 transition-opacity group-hover:opacity-100"
                title="Remove mobile image"
                @click.stop="clearMobileImage(index + 1)"
              >
                <Delete class="size-3.5" />
              </span>
            </button>
          </div>
        </template>
      </draggable>
    </div>

    <p v-if="shortcodeHint" class="text-xs text-gray-500">
      Shortcode:
      <code class="rounded bg-gray-100 px-1.5 py-0.5">[irep_project id="…" view="2"]</code>
      for view 2,
      <code class="rounded bg-gray-100 px-1.5 py-0.5">view="3"</code>
      for view 3, etc.
    </p>
  </div>

  <MediaLibraryModal
    :show="libraryTarget !== null"
    :multiple="libraryTarget === 'views'"
    @close="libraryTarget = null"
    @select="onLibrarySelect"
  />
</template>
