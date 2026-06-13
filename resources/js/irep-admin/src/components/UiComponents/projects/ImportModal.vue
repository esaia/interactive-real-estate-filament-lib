<script setup lang="ts">
import ajaxAxios from "@/src/utils/axios";
import { ref } from "vue";
import Button from "../form/Button.vue";
import { showToast } from "@/src/composables/helpers";
import { useProjectStore } from "@/src/stores/useProject";

const emit = defineEmits<{
  (e: "close"): void;
}>();

const projectStore = useProjectStore();

const loading = ref(false);
const fileRef = ref<HTMLInputElement>();
const selectedFile = ref<File | null>(null);
const isDragging = ref(false);

const importProject = async () => {
  if (loading.value) return;

  if (!selectedFile.value) {
    showToast("error", "Please upload a .zip file!");
    return;
  }

  loading.value = true;

  const formData = new FormData();
  formData.append("file", selectedFile.value);
  formData.append("action", "irep_import");
  formData.append("nonce", irePlugin.nonce);

  const { data } = await ajaxAxios.post("", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  loading.value = false;

  if (data.success) {
    showToast("success", "Project imported successfully!");
    await projectStore.fetchProjects(null);
    emit("close");
  } else {
    showToast("error", data?.data ? data?.data : "Upgrade plan!");
  }
};

const applyFile = (file: File | undefined) => {
  if (file && file.name.endsWith(".zip")) {
    selectedFile.value = file;
  } else {
    showToast("error", "Please select a valid .zip file.");
    selectedFile.value = null;
    if (fileRef.value) fileRef.value.value = "";
  }
};

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  applyFile(file);
};

const clearFile = () => {
  selectedFile.value = null;
  if (fileRef.value) fileRef.value.value = "";
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;
  applyFile(e.dataTransfer?.files?.[0]);
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
</script>

<template>
  <div class="flex w-[360px] flex-col gap-4">
    <!-- Header -->
    <div class="flex items-center gap-3 border-b border-gray-200 pb-4">
      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-gray-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </div>
      <div>
        <h3 class="!m-0 text-[0.9375rem] font-semibold text-gray-900">Import Project</h3>
        <p class="!m-0 text-xs text-gray-400">Restore from a .zip archive</p>
      </div>
    </div>

    <!-- Drop zone -->
    <div
      v-if="!selectedFile"
      class="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center transition-colors hover:border-gray-300 hover:bg-gray-100"
      :class="{ '!border-gray-400 !bg-gray-100': isDragging }"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @click="fileRef?.click()"
    >
      <input ref="fileRef" type="file" name="project" accept=".zip" class="sr-only" @change="handleFileChange" />

      <div class="flex h-13 w-13 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 8v13H3V8"/><path d="M23 3H1v5h22V3z"/><path d="M10 12h4"/>
        </svg>
      </div>
      <div>
        <p class="!m-0 text-sm text-gray-500">
          <span class="font-semibold text-gray-800 underline decoration-dotted underline-offset-2">Click to browse</span>
          &nbsp;or drag &amp; drop
        </p>
        <p class="!m-0 mt-1 text-[0.6875rem] uppercase tracking-wide text-gray-400">ZIP files only</p>
      </div>
    </div>

    <!-- Selected file -->
    <div v-else class="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5">
      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-gray-600">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 8v13H3V8"/><path d="M23 3H1v5h22V3z"/><path d="M10 12h4"/>
        </svg>
      </div>
      <div class="min-w-0 flex-1">
        <p class="!m-0 truncate text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
        <p class="!m-0 text-xs text-gray-400">{{ formatSize(selectedFile.size) }}</p>
      </div>
      <button
        class="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded bg-transparent text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700"
        @click="clearFile"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Note -->
    <div class="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-xs leading-relaxed text-gray-400">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-px shrink-0">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      Images bundled inside the ZIP will be imported automatically.
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-2 pt-1">
      <button
        class="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
        @click="$emit('close')"
      >
        Cancel
      </button>
      <Button title="Import Project" :loading="loading" :disabled="loading || !selectedFile" @click="importProject" />
    </div>
  </div>
</template>
