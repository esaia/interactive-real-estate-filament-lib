<script setup lang="ts">
import { ref, watch } from "vue";
import { imageInterface } from "@/types/components";
import Info from "@/src/components/UiComponents/icons/Info.vue";
import Modal from "@/src/components/UiComponents/Modal.vue";
import MediaLibraryModal from "@/src/components/UiComponents/form/MediaLibraryModal.vue";
import UploadPreviewCard from "@/src/components/UiComponents/form/UploadPreviewCard.vue";
import draggable from "vuedraggable";
import Upload from "../icons/Upload.vue";

const emit = defineEmits<{
    (e: "update:modelValue", params: typeof props.modelValue): void;
}>();

const props = defineProps<{
    modelValue?: imageInterface[] | null;
    title: string;
    floorImagePreviews?: string[];
    required?: boolean;
    multiple?: boolean;
    exampleImage?: string;
    resolution?: string;
}>();

function normalizeModelValue(val: typeof props.modelValue): imageInterface[] {
    if (Array.isArray(val)) return val.filter(Boolean);
    return [];
}

function filesOrderKey(list: imageInterface[]) {
    return list.map((i) => i?.id).join(",");
}

const showLibrary = ref(false);
const showExampleImage = ref(false);
const imagesArray = ref<imageInterface[]>([]);

const deleteImage = (id: number) => {
    imagesArray.value = imagesArray.value.filter(
        (item) => item && item.id !== id,
    );
};

function onLibrarySelect(images: imageInterface[]) {
    if (props.multiple) {
        const existing = imagesArray.value;
        const newOnes = images.filter(
            (img) => !existing.some((e) => e.id === img.id),
        );
        imagesArray.value = [...existing, ...newOnes];
    } else {
        imagesArray.value = images.slice(0, 1);
    }
}

watch(
    () => imagesArray.value,
    () => {
        const normalized = imagesArray.value.filter((item) => item);
        emit("update:modelValue", normalized);
    },
);

watch(
    () => props.modelValue,
    (val) => {
        const next = normalizeModelValue(val);
        if (filesOrderKey(next) === filesOrderKey(imagesArray.value)) return;
        imagesArray.value = next;
    },
    { immediate: true, deep: true },
);
</script>

<template>
    <div class="w-full">
        <!-- Header -->
        <div class="mb-2 flex items-center justify-between">
            <p
                class="text-[11px] font-semibold uppercase tracking-widest text-gray-400"
            >
                {{ title }}
                <span v-if="required" class="text-red-500">*</span>
                <span
                    v-if="resolution"
                    class="ml-1 font-normal normal-case text-gray-500"
                    >{{ resolution }}</span
                >
            </p>
            <button
                v-if="exampleImage"
                type="button"
                class="flex items-center gap-1 text-[11px] text-gray-400 transition-colors hover:text-gray-600"
                @mouseenter="showExampleImage = true"
                @mouseleave="showExampleImage = false"
            >
                <Info class="size-3.5" />
            </button>
        </div>

        <!-- Drop zone (empty state) -->
        <button
            v-if="!imagesArray?.length"
            type="button"
            class="group flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50/60 py-6 text-gray-400 transition-all hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600"
            @click.prevent="showLibrary = true"
        >
            <Upload class="size-5" />
            <span class="text-xs font-medium">Choose or upload image</span>
        </button>

        <!-- Previews + actions -->
        <div v-else class="space-y-2">
            <draggable
                v-model="imagesArray"
                item-key="id"
                handle=".drag-handle"
                ghost-class="opacity-40"
                class="flex flex-wrap items-start gap-2"
            >
                <template #item="{ element: image }">
                    <UploadPreviewCard
                        :show-drag="imagesArray?.length > 1"
                        @delete="deleteImage(image.id)"
                    >
                        <div
                            v-if="image?.url && image.url.endsWith('.pdf')"
                            class="flex h-full w-full flex-col items-center justify-center gap-1 p-1"
                        >
                            <svg
                                class="size-6 text-gray-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                            >
                                <path
                                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <polyline
                                    points="14 2 14 8 20 8"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                            <span
                                class="line-clamp-2 text-center text-[10px] text-gray-500"
                            >
                                {{ image.url?.split("/")?.pop() || "PDF" }}
                            </span>
                        </div>
                        <img
                            v-else-if="image?.url"
                            :src="image?.url"
                            class="h-full w-full object-cover"
                        />
                    </UploadPreviewCard>
                </template>
            </draggable>

            <button
                type="button"
                class="flex items-center gap-1.5 rounded border border-dashed border-gray-300 px-2.5 py-1.5 text-[11px] text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-600"
                @click.prevent="showLibrary = true"
            >
                <svg
                    class="size-3.5"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                >
                    <path d="M8 3v10M3 8h10" stroke-linecap="round" />
                </svg>
                {{ multiple ? "Add more" : "Replace" }}
            </button>
        </div>

        <!-- Example image modal -->
        <teleport to="#irep-vue-app">
            <Transition name="fade-in-out">
                <Modal
                    :show="showExampleImage"
                    :show-close-btn="false"
                    :is-preview="true"
                >
                    <div>
                        <p class="mb-2 text-sm font-medium text-gray-600">
                            Example image
                        </p>
                        <img
                            :src="exampleImage"
                            class="max-h-[500px] w-full rounded-md object-contain"
                        />
                    </div>
                </Modal>
            </Transition>
        </teleport>

        <!-- Media Library Modal -->
        <MediaLibraryModal
            :show="showLibrary"
            :multiple="multiple"
            @close="showLibrary = false"
            @select="onLibrarySelect"
        />
    </div>
</template>
