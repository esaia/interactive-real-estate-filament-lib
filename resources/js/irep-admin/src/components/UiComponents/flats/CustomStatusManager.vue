<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import Input from "@components/UiComponents/form/Input.vue";
import Button from "@components/UiComponents/form/Button.vue";
import Checkbox from "@components/UiComponents/form/Checkbox.vue";
import ColorPicker from "@components/UiComponents/form/ColorPicker.vue";
import Delete from "@components/UiComponents/icons/Delete.vue";
import Pencil from "@components/UiComponents/icons/Pencil.vue";
import Lock from "@components/UiComponents/icons/Lock.vue";
import Reset from "@components/UiComponents/icons/Reset.vue";
import { useMetaStore } from "@/src/stores/useMeta";
import { DEFAULT_CONFIG, META, PLEASE_UPGRADE_TO_GOLD } from "@/src/composables/constants";
import { showToast } from "@/src/composables/helpers";
import type { CustomStatusType } from "@components/UiComponents/flats/StatusSelect.vue";
import LicensePlanBadge from "@components/UiComponents/common/LicensePlanBadge.vue";

const metaStore = useMetaStore();

const isGold = computed(() => Boolean(irePlugin?.is_gold));
const isPremium = computed(() => Boolean(irePlugin?.is_premium));

const reservedColor = ref("");
const reservedOpenModal = ref(false);
const soldColor = ref("");
const soldOpenModal = ref(false);
const savingBuiltIn = ref(false);

const editingBuiltIn = ref<"reserved" | "sold" | null>(null);

const newTitle = ref("");
const newValue = ref("");
const newTypeColor = ref("#6b7280");
const newOpenFlatModal = ref(true);
const editingId = ref<number | null>(null);
const addingNew = ref(false);
const saving = ref(false);

const customTypes = computed<CustomStatusType[]>(() => {
  const list = metaStore.customStatusTypes || [];
  return list.map((t) => ({
    value: t.value,
    title: t.title,
    open_flat_modal:
      typeof t.open_flat_modal === "boolean"
        ? t.open_flat_modal
        : t.open_flat_modal === 1 || t.open_flat_modal === "1" || String(t.open_flat_modal).toLowerCase() === "true",
    type_color: typeof t.type_color === "string" && t.type_color ? t.type_color : "#6b7280"
  }));
});

function resetForm() {
  newTitle.value = "";
  newValue.value = "";
  newTypeColor.value = "#6b7280";
  newOpenFlatModal.value = true;
  editingId.value = null;
  addingNew.value = false;
}

function restoreBuiltInValues() {
  reservedColor.value = metaStore.getMeta("reserved_color")?.meta_value || META.PREVIEW_RESERVED_COLOR;
  soldColor.value = metaStore.getMeta("sold_color")?.meta_value || META.PREVIEW_SOLD_COLOR;
  reservedOpenModal.value = metaStore.getMeta("open_reserved_flat")?.meta_value === "true";
  soldOpenModal.value = metaStore.getMeta("open_sold_flat")?.meta_value === "true";
}

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function startEditBuiltIn(type: "reserved" | "sold") {
  editingBuiltIn.value = type;
  editingId.value = null;
  addingNew.value = false;
}

function cancelEditBuiltIn() {
  editingBuiltIn.value = null;
  restoreBuiltInValues();
}

function startAddNew() {
  editingId.value = null;
  editingBuiltIn.value = null;
  resetForm();
  addingNew.value = true;
}

async function saveCustomTypes(types: CustomStatusType[]) {
  saving.value = true;
  try {
    await metaStore.setCustomStatusTypes(types);
    showToast("success", "Custom types saved.");
  } catch {
    showToast("error", "Failed to save custom types.");
  }
  saving.value = false;
}

async function addOrUpdateCustomType() {
  if (!irePlugin?.is_gold) {
    showToast("error", PLEASE_UPGRADE_TO_GOLD);
    return;
  }

  const title = newTitle.value?.trim();
  if (!title) {
    showToast("error", "Title is required.");
    return;
  }
  const value = newValue.value?.trim() || slugFromTitle(title);
  const reserved = DEFAULT_CONFIG.map((c) => c.value);
  if (reserved.includes(value)) {
    showToast("error", "This value is reserved for a default status.");
    return;
  }
  const idx = editingId.value;
  if (idx != null && idx >= 0 && idx < customTypes.value.length) {
    const existing = customTypes.value[idx];
    if (value !== existing.value && customTypes.value.some((t, i) => i !== idx && t.value === value)) {
      showToast("error", "A type with this value already exists.");
      return;
    }
    const next = customTypes.value.map((t, i) =>
      i === idx ? { value, title, open_flat_modal: newOpenFlatModal.value, type_color: newTypeColor.value } : t
    );
    await saveCustomTypes(next);
  } else {
    if (customTypes.value.some((t) => t.value === value)) {
      showToast("error", "A type with this value already exists.");
      return;
    }
    const next = [
      ...customTypes.value,
      { value, title, open_flat_modal: newOpenFlatModal.value, type_color: newTypeColor.value }
    ];
    await saveCustomTypes(next);
  }
  resetForm();
}

function startEdit(index: number) {
  const t = customTypes.value[index];
  if (!t) return;
  editingId.value = index;
  addingNew.value = false;
  editingBuiltIn.value = null;
  newTitle.value = t.title;
  newValue.value = t.value;
  newTypeColor.value = t.type_color ?? "#6b7280";
  newOpenFlatModal.value = t.open_flat_modal;
}

function cancelEdit() {
  resetForm();
}

function removeCustomType(index: number) {
  const next = customTypes.value.filter((_, i) => i !== index);
  saveCustomTypes(next);
  if (editingId.value === index) resetForm();
  else if (editingId.value != null && editingId.value > index) editingId.value--;
}

async function saveBuiltInStatuses() {
  savingBuiltIn.value = true;
  try {
    await metaStore.setProjectMeta([
      { key: "reserved_color", value: reservedColor.value },
      { key: "sold_color", value: soldColor.value },
      { key: "open_reserved_flat", value: reservedOpenModal.value },
      { key: "open_sold_flat", value: soldOpenModal.value }
    ]);
    showToast("success", "Built-in statuses saved.");
    editingBuiltIn.value = null;
  } catch {
    showToast("error", "Failed to save.");
  }
  savingBuiltIn.value = false;
}

watch(
  () => metaStore.projectMeta,
  () => {
    restoreBuiltInValues();
  },
  { deep: true, immediate: true }
);

watch(
  newTitle,
  (v) => {
    if (editingId.value == null) {
      newValue.value = slugFromTitle(v);
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await metaStore.getCustomStatusTypes();
});
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium">Status Types</h3>

    <ul class="space-y-2">
      <!-- Reserved -->
      <li class="overflow-hidden rounded border border-gray-200 bg-gray-50">
        <div class="flex items-center gap-2 p-2">
          <span class="h-5 w-5 shrink-0 rounded-full border border-gray-300" :style="{ backgroundColor: reservedColor }" />
          <span class="flex-1 font-medium">Reserved</span>
          <span class="text-sm text-gray-500">reserved</span>
          <div
            v-if="isPremium"
            class="cursor-pointer rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
            :class="{ 'bg-gray-100 text-gray-600': editingBuiltIn === 'reserved' }"
            title="Edit"
            @click="editingBuiltIn === 'reserved' ? cancelEditBuiltIn() : startEditBuiltIn('reserved')"
          >
            <Pencil class="h-4 w-4" />
          </div>
          <div v-else class="rounded p-1 text-gray-400" title="Requires Premium">
            <Lock class="h-4 w-4" />
          </div>
        </div>
        <div v-if="editingBuiltIn === 'reserved'" class="border-t border-gray-200 bg-white p-3 space-y-3">
          <div class="flex items-center gap-2">
            <ColorPicker v-model="reservedColor" label="Color" :default-color="META.PREVIEW_RESERVED_COLOR" />
            <div
              v-if="reservedColor !== META.PREVIEW_RESERVED_COLOR"
              class="mt-4 cursor-pointer rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
              title="Reset to default"
              @click="reservedColor = META.PREVIEW_RESERVED_COLOR"
            >
              <Reset class="h-4 w-4" />
            </div>
          </div>
          <Checkbox v-model="reservedOpenModal" title="Open flat modal when flat status is RESERVED" class="w-fit" />
          <div class="flex gap-2">
            <Button title="Save" :loading="savingBuiltIn" @click="saveBuiltInStatuses" />
            <Button title="Cancel" outlined @click="cancelEditBuiltIn" />
          </div>
        </div>
      </li>

      <!-- Sold -->
      <li class="overflow-hidden rounded border border-gray-200 bg-gray-50">
        <div class="flex items-center gap-2 p-2">
          <span class="h-5 w-5 shrink-0 rounded-full border border-gray-300" :style="{ backgroundColor: soldColor }" />
          <span class="flex-1 font-medium">Sold</span>
          <span class="text-sm text-gray-500">sold</span>
          <div
            v-if="isPremium"
            class="cursor-pointer rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
            :class="{ 'bg-gray-100 text-gray-600': editingBuiltIn === 'sold' }"
            title="Edit"
            @click="editingBuiltIn === 'sold' ? cancelEditBuiltIn() : startEditBuiltIn('sold')"
          >
            <Pencil class="h-4 w-4" />
          </div>
          <div v-else class="rounded p-1 text-gray-400" title="Requires Premium">
            <Lock class="h-4 w-4" />
          </div>
        </div>
        <div v-if="editingBuiltIn === 'sold'" class="border-t border-gray-200 bg-white p-3 space-y-3">
          <div class="flex items-center gap-2">
            <ColorPicker v-model="soldColor" label="Color" :default-color="META.PREVIEW_SOLD_COLOR" />
            <div
              v-if="soldColor !== META.PREVIEW_SOLD_COLOR"
              class="mt-4 cursor-pointer rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
              title="Reset to default"
              @click="soldColor = META.PREVIEW_SOLD_COLOR"
            >
              <Reset class="h-4 w-4" />
            </div>
          </div>
          <Checkbox v-model="soldOpenModal" title="Open flat modal when flat status is SOLD" class="w-fit" />
          <div class="flex gap-2">
            <Button title="Save" :loading="savingBuiltIn" @click="saveBuiltInStatuses" />
            <Button title="Cancel" outlined @click="cancelEditBuiltIn" />
          </div>
        </div>
      </li>

      <!-- Premium upgrade notice -->
      <li v-if="!isPremium">
        <div class="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div class="mb-3 flex items-center justify-between">
            <LicensePlanBadge plan="premium" />
            <span class="text-xl" aria-hidden="true">🔒</span>
          </div>
          <p class="mb-1 text-sm font-semibold text-gray-900">Built-in status configuration requires Premium.</p>
          <p class="text-xs text-gray-500">Upgrade to customize reserved and sold colors and modal behavior.</p>
        </div>
      </li>

      <!-- Custom types -->
      <li
        v-for="(item, index) in customTypes"
        :key="item.value"
        class="overflow-hidden rounded border border-gray-200 bg-gray-50"
      >
        <div class="flex flex-wrap items-center gap-2 p-2">
          <span class="h-5 w-5 shrink-0 rounded-full border border-gray-300" :style="{ backgroundColor: item.type_color ?? '#6b7280' }" />
          <span class="flex-1 font-medium">{{ item.title }}</span>
          <span class="text-sm text-gray-500">{{ item.value }}</span>
          <template v-if="isGold">
            <div
              class="cursor-pointer rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
              :class="{ 'bg-gray-100 text-gray-600': editingId === index }"
              title="Edit"
              @click="editingId === index ? cancelEdit() : startEdit(index)"
            >
              <Pencil class="h-4 w-4" />
            </div>
            <div
              class="cursor-pointer rounded p-1 text-gray-500 hover:bg-red-900/40 hover:text-red-400"
              title="Delete"
              @click="removeCustomType(index)"
            >
              <Delete class="h-4 w-4" />
            </div>
          </template>
        </div>
        <div v-if="editingId === index && isGold" class="border-t border-gray-200 bg-white p-3 space-y-3">
          <Input v-model="newTitle" label="Title" placeholder="e.g. Under offer" />
          <Input v-model="newValue" label="Value (slug)" placeholder="e.g. under_offer" disabled />
          <ColorPicker v-model="newTypeColor" label="Color" />
          <Checkbox v-model="newOpenFlatModal" title="Open flat modal when it has this status" class="w-fit" />
          <div class="flex gap-2">
            <Button title="Update status" :loading="saving" @click="addOrUpdateCustomType" />
            <Button title="Cancel" outlined @click="cancelEdit" />
          </div>
        </div>
      </li>
    </ul>

    <!-- Add new / Gold gate -->
    <template v-if="isGold">
      <div v-if="addingNew" class="space-y-3 rounded border border-gray-200 bg-gray-50 p-3">
        <p class="text-sm font-medium">Add new status</p>
        <Input v-model="newTitle" label="Title" placeholder="e.g. Under offer" />
        <Input v-model="newValue" label="Value (slug)" placeholder="e.g. under_offer" disabled />
        <ColorPicker v-model="newTypeColor" label="Color" />
        <Checkbox v-model="newOpenFlatModal" title="Open flat modal when it has this status" class="mt-2 w-fit" />
        <div class="flex gap-2">
          <Button title="Add custom status" :loading="saving" @click="addOrUpdateCustomType" />
          <Button title="Cancel" outlined @click="cancelEdit" />
        </div>
      </div>
      <div
        v-else
        class="cursor-pointer flex items-center gap-2 rounded border border-dashed border-gray-300 p-2 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-600"
        @click="startAddNew"
      >
        <span class="text-base leading-none">+</span>
        <span>Add Status</span>
      </div>
    </template>

    <template v-else>
      <div class="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div class="mb-3 flex items-center justify-between">
          <LicensePlanBadge plan="gold" />
          <span class="text-xl" aria-hidden="true">🔒</span>
        </div>
        <p class="mb-1 text-sm font-semibold text-gray-900">Custom Status Types is available in Gold.</p>
        <p class="text-xs text-gray-500">Upgrade to create custom statuses with unique labels, slugs, and colors for your flats.</p>
      </div>
    </template>
  </div>
</template>
