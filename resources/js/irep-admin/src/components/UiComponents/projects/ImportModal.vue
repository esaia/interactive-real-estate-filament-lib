<script setup lang="ts">
import ajaxAxios from "@/src/utils/axios";
import { ref } from "vue";
import { showToast } from "@/src/composables/helpers";
import { useProjectStore } from "@/src/stores/useProject";

const emit = defineEmits<{
  (e: "close"): void;
}>();

const projectStore = useProjectStore();

const loading = ref(false);
const fileRef = ref();
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

const handleFileChange = (event: any) => {
  const file = event.target?.files?.[0];
  setFile(file);
};

const setFile = (file: File | undefined) => {
  if (file && file.name.endsWith(".zip")) {
    selectedFile.value = file;
  } else {
    showToast("error", "Please select a valid .zip file.");
    selectedFile.value = null;
    if (fileRef.value) fileRef.value.value = null;
  }
};

const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  setFile(file);
};

const clearFile = () => {
  selectedFile.value = null;
  if (fileRef.value) fileRef.value.value = null;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
</script>

<template>
  <div class="import-modal">
    <div class="modal-header">
      <div class="header-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      <div>
        <h3 class="modal-title">Import Project</h3>
        <p class="modal-subtitle">Upload a ZIP archive to restore a project</p>
      </div>
    </div>

    <!-- Drop zone -->
    <div
      class="drop-zone"
      :class="{ 'drop-zone--active': isDragging, 'drop-zone--filled': selectedFile }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="!selectedFile && fileRef?.click()"
    >
      <input
        ref="fileRef"
        type="file"
        name="project"
        accept=".zip"
        class="hidden-input"
        @change="handleFileChange"
      />

      <!-- Empty state -->
      <template v-if="!selectedFile">
        <div class="drop-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
        </div>
        <p class="drop-label">Drop your <span class="drop-accent">.zip</span> file here</p>
        <p class="drop-or">or</p>
        <span class="browse-btn">Browse files</span>
      </template>

      <!-- Filled state -->
      <template v-else>
        <div class="file-preview">
          <div class="file-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div class="file-info">
            <p class="file-name">{{ selectedFile.name }}</p>
            <p class="file-size">{{ formatSize(selectedFile.size) }}</p>
          </div>
          <button class="file-clear" @click.stop="clearFile" title="Remove file">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </template>
    </div>

    <p class="hint-text">
      <svg viewBox="0 0 20 20" fill="currentColor" class="hint-icon">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
      </svg>
      Images bundled inside the ZIP will be imported automatically.
    </p>

    <div class="modal-footer">
      <button class="cancel-btn" @click="emit('close')" :disabled="loading">Cancel</button>
      <button
        class="import-btn"
        :class="{ 'import-btn--loading': loading, 'import-btn--ready': selectedFile && !loading }"
        :disabled="loading || !selectedFile"
        @click="importProject"
      >
        <svg v-if="loading" class="spin-icon" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <svg v-else viewBox="0 0 20 20" fill="currentColor" class="btn-icon">
          <path fill-rule="evenodd" d="M10 3a.75.75 0 01.75.75v9.546l2.47-2.47a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 111.06-1.06l2.47 2.47V3.75A.75.75 0 0110 3z" clip-rule="evenodd" />
          <path d="M3 17.25a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" />
        </svg>
        {{ loading ? "Importing…" : "Import Project" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.import-modal {
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #475569;
}

.header-icon svg {
  width: 20px;
  height: 20px;
}

.modal-title {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
}

.modal-subtitle {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
  margin-top: 2px;
}

/* Drop zone */
.drop-zone {
  border: 1.5px dashed #cbd5e1;
  border-radius: 12px;
  padding: 28px 24px;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.2s, background-color 0.2s;
  background: #f8fafc;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.drop-zone:hover:not(.drop-zone--filled) {
  border-color: #94a3b8;
  background: #f1f5f9;
}

.drop-zone--active {
  border-color: #3b82f6;
  background: #eff6ff;
  border-style: solid;
}

.drop-zone--filled {
  cursor: default;
  background: #f0fdf4;
  border-color: #86efac;
  border-style: solid;
}

.hidden-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
}

.drop-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  margin-bottom: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.drop-icon svg {
  width: 22px;
  height: 22px;
}

.drop-label {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
  margin: 0;
}

.drop-accent {
  font-family: ui-monospace, monospace;
  background: #e2e8f0;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 12px;
  color: #334155;
}

.drop-or {
  font-size: 11px;
  color: #94a3b8;
  margin: 0;
}

.browse-btn {
  font-size: 12px;
  font-weight: 600;
  color: #3b82f6;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}

/* File preview */
.file-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
}

.file-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  flex-shrink: 0;
}

.file-icon svg {
  width: 20px;
  height: 20px;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 13px;
  font-weight: 600;
  color: #166534;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 11px;
  color: #4ade80;
  margin: 0;
  margin-top: 2px;
  font-family: ui-monospace, monospace;
}

.file-clear {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: #fecaca;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}

.file-clear:hover {
  background: #fca5a5;
}

.file-clear svg {
  width: 13px;
  height: 13px;
}

/* Hint */
.hint-text {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 11.5px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.5;
}

.hint-icon {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  margin-top: 1px;
  color: #cbd5e1;
}

/* Footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
}

.cancel-btn {
  padding: 7px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.cancel-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.import-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 18px;
  border-radius: 8px;
  border: none;
  background: #e2e8f0;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
  cursor: not-allowed;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}

.import-btn--ready {
  background: #1e293b;
  color: white;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}

.import-btn--ready:hover {
  background: #0f172a;
}

.import-btn--loading {
  background: #475569;
  color: white;
  cursor: not-allowed;
}

.btn-icon,
.spin-icon {
  width: 14px;
  height: 14px;
}

.spin-icon {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
