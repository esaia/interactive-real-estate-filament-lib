<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import Input from "@components/UiComponents/form/Input.vue";
import Button from "../form/Button.vue";
import ajaxAxios from "@/src/utils/axios";
import { showToast } from "@/src/composables/helpers";
import Loading from "../common/Loading.vue";
import { Field } from "@/types/components";
import DragIcon from "../icons/DragIcon.vue";
import Pencil from "../icons/Pencil.vue";
import Delete from "../icons/Delete.vue";
import draggable from "vuedraggable";
import { PLEASE_UPGRADE_TO_GOLD, PLUGIN_ASSETS_PATH } from "@/src/composables/constants";

const emit = defineEmits<{
  (e: "close"): void;
}>();

const fieldTitle = ref("");
const selectedType = ref<"text" | "select">("text");
const selectedValueInput = ref("");
const selectFieldValues = ref<string[]>([]);
const fields = ref<Field[]>([]);
const editingFieldId = ref<string | null>(null);
const loading = ref(false);
const dataLoading = ref(false);
const formTopRef = ref<HTMLElement | null>(null);

const isEditing = computed(() => editingFieldId.value !== null);
const canAddSelectValue = computed(() => selectedValueInput.value.trim() !== "");
const canSaveField = computed(() => {
  if (!fieldTitle.value.trim()) return false;
  if (selectedType.value === "select" && selectFieldValues.value.length === 0) return false;
  return true;
});

const addSelectValue = () => {
  const value = selectedValueInput.value.trim();
  if (value && !selectFieldValues.value.includes(value)) {
    selectFieldValues.value.push(value);
    selectedValueInput.value = "";
  }
};

const removeSelectValue = (index: number) => {
  selectFieldValues.value.splice(index, 1);
};

const saveField = () => {
  if (!canSaveField.value) return;

  const fieldData: Field = {
    id: editingFieldId.value || Date.now().toString(),
    key: fieldTitle.value.trim(),
    type: selectedType.value
  };

  if (selectedType.value === "select") {
    fieldData.values = [...selectFieldValues.value];
  }

  if (isEditing.value) {
    const index = fields.value.findIndex((f) => f.id === editingFieldId.value);
    if (index !== -1) {
      fields.value[index] = fieldData;
    }
  } else {
    fields.value.push(fieldData);
  }

  resetForm();
};

const editField = (field: Field) => {
  editingFieldId.value = field.id;
  fieldTitle.value = field.key;
  selectedType.value = field.type;
  selectFieldValues.value = field.values ? [...field.values] : [];
  nextTick(() => {
    formTopRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
};

const deleteField = (id: string) => {
  fields.value = fields.value.filter((f) => f.id !== id);
};

const resetForm = () => {
  fieldTitle.value = "";
  selectedType.value = "text";
  selectedValueInput.value = "";
  selectFieldValues.value = [];
  editingFieldId.value = null;
};

const cancelEdit = () => {
  resetForm();
};

const saveFields = async () => {
  if (!irePlugin?.is_gold) {
    showToast("error", PLEASE_UPGRADE_TO_GOLD);
    return;
  }

  loading.value = true;

  try {
    const { data } = await ajaxAxios.post("", {
      action: "irep_add_flat_custom_fields",
      nonce: irePlugin.nonce,
      fields: fields.value
    });

    if (data?.success) {
      showToast("success", "Flat fields saved!");
    } else {
      showToast("error", "Something went wrong!");
    }
  } catch (error) {
    showToast("error", "Something went wrong!");
  }

  loading.value = false;
};

onMounted(async () => {
  dataLoading.value = true;
  const { data } = await ajaxAxios.post("", {
    action: "irep_get_flat_fields",
    nonce: irePlugin.nonce
  });

  if (data?.data && data?.data.length) {
    fields.value = data?.data;
  }
  dataLoading.value = false;
});
</script>

<template>
  <div v-if="dataLoading" class="mx-auto max-h-[90svh] w-full p-6 md:w-[800px]">
    <Loading />
  </div>

  <div v-else class="mx-auto max-h-[90svh] w-full p-6 md:w-[800px]">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Dynamic Flat Field Builder</h2>
      <p class="mt-1 text-sm text-gray-500">Create and manage custom form fields for flats</p>
    </div>

    <img
      :src="PLUGIN_ASSETS_PATH + 'custom-fields.webp'"
      alt="custom-fields"
      class="my-4 h-full w-full max-w-[500px] rounded-lg border-2 !border-solid !border-gray-300 object-cover"
    />

    <!-- Field Editor Card -->
    <div ref="formTopRef" class="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <h3 class="mb-4 text-lg font-semibold text-gray-600">
        {{ isEditing ? "Edit Field" : "Add New Field" }}
      </h3>

      <!-- Field Title & Type -->
      <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-600">Field Title</label>
          <Input v-model="fieldTitle" placeholder="Enter field name" class="w-full" :disabled="isEditing" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-600">Field Type</label>
          <select
            v-model="selectedType"
            class="w-full rounded-lg border !border-gray-200 !py-[1px] px-4 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
          >
            <option value="text">Text Input</option>
            <option value="select">Select Dropdown</option>
          </select>
        </div>
      </div>

      <!-- Select Options (if type is select) -->
      <div v-if="selectedType === 'select'" class="mb-4">
        <label class="mb-2 block text-sm font-medium text-gray-600">Dropdown Options</label>

        <div class="mb-3 flex gap-2">
          <Input
            v-model="selectedValueInput"
            placeholder="Enter option value"
            class="flex-1"
            @keyup.enter="addSelectValue"
          />
          <button
            @click="addSelectValue"
            :disabled="!canAddSelectValue"
            class="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            Add
          </button>
        </div>

        <!-- Options List -->
        <div v-if="selectFieldValues.length > 0" class="space-y-2">
          <div
            v-for="(value, index) in selectFieldValues"
            :key="index"
            class="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2"
          >
            <span class="text-sm text-gray-600">{{ value }}</span>
            <button @click="removeSelectValue(index)" class="text-sm font-medium text-red-600 hover:text-red-800">
              Remove
            </button>
          </div>
        </div>

        <p v-else class="text-sm italic text-gray-400">No options added yet</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button
          @click="saveField"
          :disabled="!canSaveField"
          class="rounded-lg bg-green-600 px-6 py-2 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          {{ isEditing ? "Update Field" : "Add Field" }}
        </button>

        <button
          v-if="isEditing"
          @click="cancelEdit"
          class="rounded-lg bg-gray-100 px-6 py-2 font-medium text-gray-700 transition hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Fields List -->
    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <h3 class="mb-4 text-lg font-semibold text-gray-600">Created Fields ({{ fields.length }})</h3>

      <div v-if="fields.length === 0" class="py-8 text-center text-gray-400">
        <p>No fields created yet. Add your first field above!</p>
      </div>

      <draggable
        v-else
        v-model="fields"
        item-key="id"
        handle=".drag-handle"
        ghost-class="opacity-50"
        class="mb-4 w-full space-y-4"
      >
        <template #item="{ element: field }">
          <div
            class="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-gray-200"
          >
            <button
              class="drag-handle cursor-grab text-gray-500 hover:text-gray-500 focus:outline-none"
              title="Drag to reorder"
            >
              <DragIcon class="size-5" />
            </button>

            <div class="flex-1">
              <div class="mb-1 flex items-center gap-3">
                <h4 class="font-semibold text-gray-800">{{ field.key }}</h4>
                <span
                  class="rounded px-2 py-1 text-xs font-medium"
                  :class="field.type === 'text' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'"
                >
                  {{ field.type === "text" ? "Text" : "Select" }}
                </span>
              </div>

              <div v-if="field.type === 'select' && field.values" class="mt-2 flex flex-wrap gap-1">
                <span
                  v-for="value in field.values"
                  :key="value"
                  class="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500"
                >
                  {{ value }}
                </span>
              </div>
            </div>

            <div class="ml-4 flex shrink-0 gap-0.5">
              <button
                type="button"
                class="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-500"
                title="Edit"
                @click="editField(field)"
              >
                <Pencil class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                title="Delete"
                @click="deleteField(field.id)"
              >
                <Delete class="h-4 w-4" />
              </button>
            </div>
          </div>
        </template>
      </draggable>

      <Button v-if="fields.length > 0" title="Save" :disabled="loading" class="!w-fit" @click="saveFields" />
    </div>

    <!-- JSON Output (for debugging) -->
    <div class="mt-6 rounded-lg bg-white p-4">
      <p class="mb-2 font-mono text-sm text-gray-500">JSON Output:</p>
      <pre class="overflow-x-auto font-mono text-xs text-green-400">{{ JSON.stringify(fields, null, 2) }}</pre>
    </div>

    <div class="h-4"></div>
  </div>
</template>
