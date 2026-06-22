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
    allowYoutube?: boolean;
}>();

function normalizeModelValue(val: typeof props.modelValue): imageInterface[] {
    if (Array.isArray(val)) return val.filter((item): item is imageInterface => !!item && typeof item === "object" && "url" in item);
    return [];
}

function filesOrderKey(list: imageInterface[]) {
    return list.map((i) => i?.id).join(",");
}

const showLibrary = ref(false);
const showExampleImage = ref(false);
const imagesArray = ref<imageInterface[]>([]);

const showYoutubeInput = ref(false);
const youtubeInputValue = ref("");

function extractYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

function addYoutubeLink() {
    const id = extractYouTubeId(youtubeInputValue.value.trim());
    if (!id) return;
    const url = `https://www.youtube.com/watch?v=${id}`;
    const already = imagesArray.value.some((i) => i.url === url);
    if (!already) {
        imagesArray.value = [
            ...imagesArray.value,
            { id: Date.now(), url, type: "youtube", mime: "youtube", filename: "youtube", alt: "", title: "" } as any,
        ];
    }
    youtubeInputValue.value = "";
    showYoutubeInput.value = false;
}

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
            <p class="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                {{ title }}
                <span v-if="required" class="text-red-500">*</span>
                <span v-if="resolution" class="ml-1 font-normal normal-case text-gray-500">{{ resolution }}</span>
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
        <div v-if="!imagesArray?.length" class="flex flex-wrap gap-2">
            <button
                type="button"
                class="group flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50/60 py-6 text-gray-400 transition-all hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600"
                @click.prevent="showLibrary = true"
            >
                <Upload class="size-5" />
                <span class="text-xs font-medium">Choose or upload image</span>
            </button>
            <template v-if="allowYoutube">
                <div v-if="showYoutubeInput" class="flex flex-col items-start justify-center gap-2 rounded-lg border border-dashed border-red-200 bg-red-50/40 px-4 py-4">
                    <input
                        v-model="youtubeInputValue"
                        type="text"
                        placeholder="Paste YouTube URL..."
                        class="w-48 rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-300"
                        @keydown.enter.prevent="addYoutubeLink"
                        @keydown.esc="showYoutubeInput = false"
                    />
                    <div class="flex gap-2">
                        <button type="button" class="text-xs font-medium text-red-500 hover:underline" @click="addYoutubeLink">Add</button>
                        <button type="button" class="text-xs text-gray-400 hover:text-gray-600" @click="showYoutubeInput = false">Cancel</button>
                    </div>
                </div>
                <button
                    v-else
                    type="button"
                    class="group flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-red-200 bg-red-50/40 px-4 py-6 text-red-300 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-400"
                    @click.prevent="showYoutubeInput = true"
                >
                    <svg class="size-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/>
                    </svg>
                    <span class="text-xs font-medium">YouTube</span>
                </button>
            </template>
        </div>

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
                        <!-- YouTube -->
                        <div v-if="image?.type === 'youtube'" class="relative h-full w-full">
                            <img
                                :src="`https://img.youtube.com/vi/${extractYouTubeId(image.url)}/mqdefault.jpg`"
                                class="h-full w-full object-cover"
                            />
                            <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                                <svg class="size-7" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.55)" />
                                    <polygon points="10,8 16,12 10,16" fill="white" />
                                </svg>
                            </div>
                        </div>
                        <!-- PDF -->
                        <div
                            v-else-if="image?.url && image.url.match(/\.pdf$/i)"
                            class="flex h-full w-full flex-col items-center justify-center gap-1 p-1"
                        >
                            <svg class="size-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-linecap="round" stroke-linejoin="round" />
                                <polyline points="14 2 14 8 20 8" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span class="line-clamp-2 text-center text-[10px] text-gray-500">
                                {{ image.url?.split("/")?.pop() || "PDF" }}
                            </span>
                        </div>
                        <!-- MP4 -->
                        <div v-else-if="image?.url && image.url.match(/\.mp4$/i)" class="relative h-full w-full">
                            <video :src="image.url" preload="metadata" class="h-full w-full object-cover" />
                            <div class="absolute inset-0 flex items-center justify-center">
                                <svg class="size-7 text-white drop-shadow" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.5)" />
                                    <polygon points="10,8 16,12 10,16" fill="white" />
                                </svg>
                            </div>
                        </div>
                        <!-- Image -->
                        <img v-else-if="image?.url" :src="image?.url" class="h-full w-full object-cover" />
                    </UploadPreviewCard>
                </template>
            </draggable>

            <!-- Action buttons row -->
            <div class="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    class="flex items-center gap-1.5 rounded border border-dashed border-gray-300 px-2.5 py-1.5 text-[11px] text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-600"
                    @click.prevent="showLibrary = true"
                >
                    <svg class="size-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M8 3v10M3 8h10" stroke-linecap="round" />
                    </svg>
                    {{ multiple ? "Add more" : "Replace" }}
                </button>

                <template v-if="allowYoutube">
                    <div v-if="showYoutubeInput" class="flex items-center gap-1.5">
                        <input
                            v-model="youtubeInputValue"
                            type="text"
                            placeholder="Paste YouTube URL..."
                            class="w-48 rounded border border-gray-300 bg-gray-100 px-2.5 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-300"
                            @keydown.enter.prevent="addYoutubeLink"
                            @keydown.esc="showYoutubeInput = false"
                        />
                        <button type="button" class="text-xs font-medium text-red-500 hover:underline" @click="addYoutubeLink">Add</button>
                        <button type="button" class="text-xs text-gray-400 hover:text-gray-600" @click="showYoutubeInput = false">Cancel</button>
                    </div>
                    <button
                        v-else
                        type="button"
                        class="flex items-center gap-1.5 rounded border border-dashed border-red-200 px-2.5 py-1.5 text-[11px] text-red-300 transition-colors hover:border-red-400 hover:text-red-500"
                        @click.prevent="showYoutubeInput = true"
                    >
                        <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/>
                        </svg>
                        Add YouTube
                    </button>
                </template>
            </div>
        </div>

        <!-- Example image modal -->
        <teleport to="#irep-vue-app">
            <Transition name="fade-in-out">
                <Modal :show="showExampleImage" :show-close-btn="false" :is-preview="true">
                    <div>
                        <p class="mb-2 text-sm font-medium text-gray-600">Example image</p>
                        <img :src="exampleImage" class="max-h-[500px] w-full rounded-md object-contain" />
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
