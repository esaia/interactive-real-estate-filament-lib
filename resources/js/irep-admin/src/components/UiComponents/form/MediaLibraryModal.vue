<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { imageInterface } from "@/types/components";
import ajaxAxios from "@/src/utils/axios";

const props = defineProps<{
  show: boolean;
  multiple?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "select", images: imageInterface[]): void;
}>();

type Tab = "library" | "upload";
const activeTab = ref<Tab>("library");

// ── Library state ────────────────────────────────────────────────────────────
const images = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const perPage = 40;
const search = ref("");
const loadingLibrary = ref(false);
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const selected = ref<any[]>([]);
const hoveredId = ref<number | null>(null);

// ── Upload state ─────────────────────────────────────────────────────────────
const isDragging = ref(false);
const uploadQueue = ref<{ file: File; status: "pending" | "uploading" | "done" | "error"; preview: string; result?: any }[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

// ── Fetch images ─────────────────────────────────────────────────────────────
async function fetchImages(reset = false) {
  if (reset) { page.value = 1; images.value = []; }
  loadingLibrary.value = true;
  try {
    const res = await ajaxAxios.post("", new URLSearchParams({
      action: "irep_get_images",
      search: search.value,
      page: String(page.value),
    }));
    if (res.data?.success) {
      const data = res.data.data;
      if (reset || page.value === 1) {
        images.value = data.images;
      } else {
        images.value = [...images.value, ...data.images];
      }
      total.value = data.total;
    }
  } finally {
    loadingLibrary.value = false;
  }
}

watch(() => props.show, (val) => {
  if (val) {
    activeTab.value = "library";
    selected.value = [];
    search.value = "";
    fetchImages(true);
  }
}, { immediate: true });

watch(search, () => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => fetchImages(true), 300);
});

// ── Selection ────────────────────────────────────────────────────────────────
function toggleSelect(img: any) {
  const idx = selected.value.findIndex(s => s.id === img.id);
  if (idx >= 0) {
    selected.value.splice(idx, 1);
  } else {
    if (!props.multiple) {
      selected.value = [img];
    } else {
      selected.value.push(img);
    }
  }
}

function isSelected(img: any) {
  return selected.value.some(s => s.id === img.id);
}

function confirmSelection() {
  emit("select", selected.value as imageInterface[]);
  emit("close");
}

// ── Upload ────────────────────────────────────────────────────────────────────
function openFilePicker() {
  fileInput.value?.click();
}

function onFilePick(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files ?? []);
  if (fileInput.value) fileInput.value.value = "";
  addToQueue(files);
}

function onDrop(e: DragEvent) {
  isDragging.value = false;
  const files = Array.from(e.dataTransfer?.files ?? []).filter(f =>
    f.type.startsWith("image/") || f.type === "application/pdf"
  );
  addToQueue(files);
}

function addToQueue(files: File[]) {
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      uploadQueue.value.push({
        file,
        status: "pending",
        preview: file.type === "application/pdf" ? "" : (ev.target?.result as string),
      });
      processQueue();
    };
    reader.readAsDataURL(file);
  });
}

async function processQueue() {
  const item = uploadQueue.value.find(i => i.status === "pending");
  if (!item) return;
  item.status = "uploading";
  const fd = new FormData();
  fd.append("action", "irep_upload_image");
  fd.append("file", item.file);
  try {
    const res = await ajaxAxios.post("", fd, { headers: { "Content-Type": "multipart/form-data" } });
    if (res.data?.success) {
      item.status = "done";
      item.result = res.data.data;
    } else {
      item.status = "error";
    }
  } catch {
    item.status = "error";
  }
  processQueue();
}

function insertUploaded() {
  const done = uploadQueue.value.filter(i => i.status === "done" && i.result);
  if (!done.length) return;
  const toInsert = props.multiple ? done.map(i => i.result) : [done[done.length - 1].result];
  emit("select", toInsert as imageInterface[]);
  emit("close");
  uploadQueue.value = [];
}

function clearQueue() {
  uploadQueue.value = [];
}

const hasUploadsDone = computed(() => uploadQueue.value.some(i => i.status === "done"));
const allUploaded = computed(() => uploadQueue.value.length > 0 && uploadQueue.value.every(i => i.status === "done" || i.status === "error"));

// ── Pagination ────────────────────────────────────────────────────────────────
const hasMore = computed(() => images.value.length < total.value);

async function loadMore() {
  page.value++;
  await fetchImages(false);
}

// ── Keyboard ──────────────────────────────────────────────────────────────────
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") emit("close");
}
</script>

<template>
  <Teleport to="#irep-vue-app">
    <Transition name="ml-fade">
      <div
        v-if="show"
        class="media-lib-overlay"
        @keydown="onKeydown"
        tabindex="-1"
      >
        <!-- Backdrop -->
        <div class="media-lib-backdrop" @click="emit('close')" />

        <!-- Modal -->
        <div class="media-lib-modal">

          <!-- ── Header ────────────────────────────────────────────────── -->
          <div class="ml-header">
            <div class="ml-tabs">
              <button
                class="ml-tab"
                :class="{ active: activeTab === 'library' }"
                @click="activeTab = 'library'"
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" class="ml-tab-icon">
                  <rect x="1" y="1" width="6" height="6" rx="1" />
                  <rect x="9" y="1" width="6" height="6" rx="1" />
                  <rect x="1" y="9" width="6" height="6" rx="1" />
                  <rect x="9" y="9" width="6" height="6" rx="1" />
                </svg>
                Media Library
              </button>
              <button
                class="ml-tab"
                :class="{ active: activeTab === 'upload' }"
                @click="activeTab = 'upload'"
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" class="ml-tab-icon">
                  <path d="M8 11V4m0 0L5.5 6.5M8 4l2.5 2.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M2 13h12" stroke-linecap="round" />
                </svg>
                Upload Files
              </button>
            </div>

            <div class="ml-header-right">
              <div v-if="activeTab === 'library'" class="ml-search-wrap">
                <svg class="ml-search-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="6.5" cy="6.5" r="4" />
                  <path d="m9.5 9.5 3 3" stroke-linecap="round" />
                </svg>
                <input
                  v-model="search"
                  class="ml-search"
                  type="text"
                  placeholder="Search images…"
                  spellcheck="false"
                />
                <button v-if="search" class="ml-search-clear" @click="search = ''">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M2 2l8 8M10 2l-8 8" stroke-linecap="round" />
                  </svg>
                </button>
              </div>
              <button class="ml-close" @click="emit('close')" aria-label="Close">
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.75">
                  <path d="M1 1l12 12M13 1L1 13" stroke-linecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <!-- ── Body ──────────────────────────────────────────────────── -->
          <div class="ml-body">

            <!-- Library Tab -->
            <template v-if="activeTab === 'library'">
              <div v-if="loadingLibrary && !images.length" class="ml-loading">
                <div class="ml-spinner" />
                <span>Loading media…</span>
              </div>

              <div v-else-if="!images.length && !loadingLibrary" class="ml-empty">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.25" class="ml-empty-icon">
                  <rect x="4" y="8" width="40" height="32" rx="3" />
                  <circle cx="16" cy="19" r="4" />
                  <path d="M4 32l10-10 8 8 6-6 8 8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="ml-empty-title">No images found</p>
                <p class="ml-empty-sub">{{ search ? 'Try a different search term' : 'Upload your first image to get started' }}</p>
                <button v-if="!search" class="ml-btn-primary" @click="activeTab = 'upload'">
                  Upload Images
                </button>
              </div>

              <div v-else class="ml-grid-wrap">
                <div class="ml-grid">
                  <button
                    v-for="img in images"
                    :key="img.id"
                    class="ml-thumb"
                    :class="{ 'is-selected': isSelected(img) }"
                    @click="toggleSelect(img)"
                    @mouseenter="hoveredId = img.id"
                    @mouseleave="hoveredId = null"
                  >
                    <div class="ml-thumb-img">
                      <img v-if="!img.filename.match(/\.pdf$/i)" :src="img.url" loading="lazy" />
                      <div v-else class="ml-thumb-pdf">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-linecap="round" />
                          <polyline points="14 2 14 8 20 8" stroke-linecap="round" />
                        </svg>
                        <span>PDF</span>
                      </div>
                    </div>
                    <div class="ml-thumb-check">
                      <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.75">
                        <path d="M2 5l2.5 2.5L8 3" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div class="ml-thumb-name">{{ img.filename }}</div>
                  </button>
                </div>

                <div v-if="hasMore" class="ml-load-more-wrap">
                  <button class="ml-load-more" :disabled="loadingLibrary" @click="loadMore">
                    <div v-if="loadingLibrary" class="ml-spinner-sm" />
                    <span v-else>Load more ({{ total - images.length }} remaining)</span>
                  </button>
                </div>
              </div>
            </template>

            <!-- Upload Tab -->
            <template v-else>
              <div class="ml-upload-area">
                <!-- Drop zone -->
                <div
                  class="ml-dropzone"
                  :class="{ 'is-dragging': isDragging }"
                  @dragenter.prevent="isDragging = true"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="onDrop"
                  @click="openFilePicker"
                >
                  <div class="ml-drop-inner">
                    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.25" class="ml-drop-icon">
                      <path d="M24 30V14m0 0l-7 7m7-7 7 7" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M8 36h32" stroke-linecap="round" />
                      <path d="M6 26a6 6 0 0 1 0-12h1.5a9 9 0 0 1 17-4A7 7 0 1 1 40 22" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <p class="ml-drop-title">Drop files here or click to browse</p>
                    <p class="ml-drop-sub">Supports JPG, PNG, GIF, WebP, SVG, PDF</p>
                  </div>
                </div>

                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*,application/pdf"
                  :multiple="multiple"
                  class="sr-only"
                  @change="onFilePick"
                />

                <!-- Upload Queue -->
                <div v-if="uploadQueue.length" class="ml-queue">
                  <div class="ml-queue-header">
                    <span class="ml-queue-title">{{ uploadQueue.length }} file{{ uploadQueue.length !== 1 ? 's' : '' }}</span>
                    <button class="ml-queue-clear" @click="clearQueue">Clear all</button>
                  </div>
                  <div class="ml-queue-list">
                    <div v-for="(item, i) in uploadQueue" :key="i" class="ml-queue-item" :class="item.status">
                      <div class="ml-qi-preview">
                        <img v-if="item.preview" :src="item.preview" />
                        <div v-else class="ml-qi-pdf">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6z" />
                            <path d="M9 2v4h4" stroke-linecap="round" />
                          </svg>
                        </div>
                      </div>
                      <div class="ml-qi-info">
                        <span class="ml-qi-name">{{ item.file.name }}</span>
                        <span class="ml-qi-size">{{ (item.file.size / 1024).toFixed(1) }} KB</span>
                      </div>
                      <div class="ml-qi-status">
                        <div v-if="item.status === 'uploading'" class="ml-spinner-sm" />
                        <svg v-else-if="item.status === 'done'" class="ml-qi-done" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M2 6l3 3 5-5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <svg v-else-if="item.status === 'error'" class="ml-qi-err" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M2 2l8 8M10 2l-8 8" stroke-linecap="round" />
                        </svg>
                        <div v-else class="ml-qi-pending" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- ── Footer ────────────────────────────────────────────────── -->
          <div class="ml-footer">
            <div class="ml-footer-info">
              <template v-if="activeTab === 'library' && selected.length">
                <span class="ml-sel-count">{{ selected.length }} selected</span>
                <button class="ml-sel-clear" @click="selected = []">Clear</button>
              </template>
              <template v-else-if="activeTab === 'library'">
                <span class="ml-total-count">{{ total }} image{{ total !== 1 ? 's' : '' }}</span>
              </template>
            </div>
            <div class="ml-footer-actions">
              <button class="ml-btn-ghost" @click="emit('close')">Cancel</button>
              <button
                v-if="activeTab === 'library'"
                class="ml-btn-primary"
                :disabled="!selected.length"
                @click="confirmSelection"
              >
                Insert {{ selected.length > 1 ? `${selected.length} images` : 'image' }}
              </button>
              <button
                v-else
                class="ml-btn-primary"
                :disabled="!hasUploadsDone"
                @click="insertUploaded"
              >
                Use uploaded {{ multiple ? 'images' : 'image' }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Overlay & Modal ──────────────────────────────────────────────────────── */
.media-lib-overlay {
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.media-lib-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
}

.media-lib-modal {
  position: relative;
  z-index: 1;
  width: min(96vw, 1060px);
  height: min(90vh, 740px);
  background: #111318;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 32px 96px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04);
}

/* ── Transition ───────────────────────────────────────────────────────────── */
.ml-fade-enter-active { transition: opacity 180ms ease; }
.ml-fade-leave-active { transition: opacity 140ms ease; }
.ml-fade-enter-from, .ml-fade-leave-to { opacity: 0; }
.ml-fade-enter-active .media-lib-modal { animation: ml-pop-in 200ms cubic-bezier(0.34,1.56,0.64,1); }
.ml-fade-leave-active .media-lib-modal { animation: ml-pop-out 140ms ease forwards; }
@keyframes ml-pop-in { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
@keyframes ml-pop-out { to { opacity:0; transform:scale(0.97); } }

/* ── Header ───────────────────────────────────────────────────────────────── */
.ml-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 4px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  background: #0d0f13;
  flex-shrink: 0;
}

.ml-tabs {
  display: flex;
  gap: 0;
}

.ml-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 13px 16px;
  font-size: 12.5px;
  font-weight: 500;
  color: rgba(255,255,255,0.4);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 150ms, border-color 150ms;
  letter-spacing: 0.01em;
}

.ml-tab:hover { color: rgba(255,255,255,0.7); }
.ml-tab.active {
  color: #fff;
  border-bottom-color: #4f8ef7;
}

.ml-tab-icon { width: 14px; height: 14px; flex-shrink: 0; }

.ml-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ml-search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.ml-search-icon {
  position: absolute;
  left: 9px;
  width: 13px;
  height: 13px;
  color: rgba(255,255,255,0.3);
  pointer-events: none;
}

.ml-search {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  padding: 6px 28px 6px 30px;
  font-size: 12.5px;
  color: #fff;
  width: 200px;
  outline: none;
  transition: border-color 150ms, background 150ms;
}

.ml-search::placeholder { color: rgba(255,255,255,0.25); }
.ml-search:focus { border-color: rgba(79,142,247,0.5); background: rgba(255,255,255,0.08); }

.ml-search-clear {
  position: absolute;
  right: 7px;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255,255,255,0.35);
  padding: 2px;
  display: flex;
  transition: color 150ms;
}
.ml-search-clear:hover { color: rgba(255,255,255,0.7); }
.ml-search-clear svg { width: 10px; height: 10px; }

.ml-close {
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255,255,255,0.35);
  padding: 6px;
  display: flex;
  border-radius: 5px;
  transition: color 150ms, background 150ms;
}
.ml-close:hover { color: #fff; background: rgba(255,255,255,0.08); }
.ml-close svg { width: 12px; height: 12px; }

/* ── Body ─────────────────────────────────────────────────────────────────── */
.ml-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Loading / Empty ─────────────────────────────────────────────────────── */
.ml-loading, .ml-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(255,255,255,0.3);
}

.ml-empty-icon { width: 52px; height: 52px; color: rgba(255,255,255,0.12); }
.ml-empty-title { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.5); margin: 0; }
.ml-empty-sub { font-size: 12px; color: rgba(255,255,255,0.25); margin: 0; }

/* ── Grid ─────────────────────────────────────────────────────────────────── */
.ml-grid-wrap {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.12) transparent;
}

.ml-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 8px;
}

.ml-thumb {
  position: relative;
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  background: rgba(255,255,255,0.04);
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  transition: border-color 150ms, transform 100ms;
}

.ml-thumb:hover { border-color: rgba(255,255,255,0.2); transform: scale(1.02); }
.ml-thumb.is-selected { border-color: #4f8ef7; box-shadow: 0 0 0 1px #4f8ef7; }
.ml-thumb.is-selected:hover { transform: none; }

.ml-thumb-img {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.ml-thumb-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 200ms ease;
}

.ml-thumb:hover .ml-thumb-img img { transform: scale(1.06); }
.ml-thumb.is-selected .ml-thumb-img img { transform: none; }

.ml-thumb-pdf {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: rgba(255,255,255,0.3);
}
.ml-thumb-pdf svg { width: 28px; height: 28px; }
.ml-thumb-pdf span { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; }

.ml-thumb-check {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4f8ef7;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 150ms, transform 150ms;
}
.ml-thumb.is-selected .ml-thumb-check { opacity: 1; transform: scale(1); }
.ml-thumb-check svg { width: 10px; height: 10px; color: #fff; }

.ml-thumb-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px 5px 3px;
  font-size: 9px;
  color: rgba(255,255,255,0.7);
  background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0;
  transition: opacity 150ms;
}
.ml-thumb:hover .ml-thumb-name { opacity: 1; }

/* ── Load more ────────────────────────────────────────────────────────────── */
.ml-load-more-wrap {
  display: flex;
  justify-content: center;
  padding: 16px 0 4px;
}

.ml-load-more {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  padding: 7px 20px;
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 150ms, color 150ms;
}
.ml-load-more:hover:not(:disabled) { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); }
.ml-load-more:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Upload area ──────────────────────────────────────────────────────────── */
.ml-upload-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
}

.ml-dropzone {
  border: 2px dashed rgba(255,255,255,0.12);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 150ms, background 150ms;
}

.ml-dropzone:hover, .ml-dropzone.is-dragging {
  border-color: rgba(79,142,247,0.5);
  background: rgba(79,142,247,0.04);
}

.ml-drop-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 44px 24px;
  text-align: center;
}

.ml-drop-icon { width: 48px; height: 48px; color: rgba(255,255,255,0.18); }
.ml-drop-title { font-size: 13.5px; font-weight: 500; color: rgba(255,255,255,0.55); margin: 0; }
.ml-drop-sub { font-size: 11.5px; color: rgba(255,255,255,0.25); margin: 0; }

/* ── Queue ────────────────────────────────────────────────────────────────── */
.ml-queue {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ml-queue-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ml-queue-title { font-size: 11.5px; font-weight: 500; color: rgba(255,255,255,0.4); }

.ml-queue-clear {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  transition: color 150ms;
}
.ml-queue-clear:hover { color: rgba(255,255,255,0.6); }

.ml-queue-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ml-queue-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.04);
  border-radius: 7px;
  padding: 7px 10px;
  border: 1px solid rgba(255,255,255,0.06);
}

.ml-queue-item.done { border-color: rgba(34,197,94,0.2); background: rgba(34,197,94,0.04); }
.ml-queue-item.error { border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.04); }

.ml-qi-preview {
  width: 36px;
  height: 36px;
  border-radius: 5px;
  overflow: hidden;
  background: rgba(255,255,255,0.06);
  flex-shrink: 0;
}
.ml-qi-preview img { width: 100%; height: 100%; object-fit: cover; display: block; }

.ml-qi-pdf {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.3);
}
.ml-qi-pdf svg { width: 18px; height: 18px; }

.ml-qi-info { flex: 1; min-width: 0; }
.ml-qi-name { display: block; font-size: 11.5px; color: rgba(255,255,255,0.7); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ml-qi-size { font-size: 10px; color: rgba(255,255,255,0.3); }

.ml-qi-status { width: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ml-qi-done { width: 14px; height: 14px; color: #22c55e; }
.ml-qi-err { width: 12px; height: 12px; color: #ef4444; }
.ml-qi-pending { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.15); }

/* ── Spinners ─────────────────────────────────────────────────────────────── */
.ml-spinner {
  width: 28px;
  height: 28px;
  border: 2px solid rgba(255,255,255,0.08);
  border-top-color: rgba(255,255,255,0.4);
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}
.ml-spinner-sm {
  width: 14px;
  height: 14px;
  border: 1.5px solid rgba(255,255,255,0.08);
  border-top-color: rgba(255,255,255,0.5);
  border-radius: 50%;
  animation: spin 600ms linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Footer ───────────────────────────────────────────────────────────────── */
.ml-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 16px;
  border-top: 1px solid rgba(255,255,255,0.07);
  background: #0d0f13;
  flex-shrink: 0;
  gap: 12px;
}

.ml-footer-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}

.ml-total-count { color: rgba(255,255,255,0.3); }
.ml-sel-count { color: rgba(255,255,255,0.7); font-weight: 500; }
.ml-sel-clear {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 11.5px;
  color: rgba(255,255,255,0.3);
  transition: color 150ms;
}
.ml-sel-clear:hover { color: rgba(255,255,255,0.6); }

.ml-footer-actions { display: flex; align-items: center; gap: 8px; }

.ml-btn-ghost {
  background: none;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px;
  padding: 7px 14px;
  font-size: 12.5px;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: background 150ms, color 150ms;
}
.ml-btn-ghost:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }

.ml-btn-primary {
  background: #4f8ef7;
  border: 1px solid rgba(79,142,247,0.3);
  border-radius: 6px;
  padding: 7px 16px;
  font-size: 12.5px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  transition: background 150ms, opacity 150ms;
  white-space: nowrap;
}
.ml-btn-primary:hover:not(:disabled) { background: #3a7ef0; }
.ml-btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border-width: 0;
}
</style>
