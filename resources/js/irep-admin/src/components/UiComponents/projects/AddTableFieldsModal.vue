<script setup lang="ts">
// AI GENERATED
import { computed, onMounted, ref, watch, nextTick } from "vue";
import Input from "../form/Input.vue";
import Checkbox from "../form/Checkbox.vue";
import Button from "../form/Button.vue";
import TextArea from "../form/TextArea.vue";
import ajaxAxios from "@/src/utils/axios";
import { showToast } from "@/src/composables/helpers";
import Loading from "../common/Loading.vue";
// @ts-ignore
import draggable from "vuedraggable";
import DragIcon from "../icons/DragIcon.vue";
import Pencil from "../icons/Pencil.vue";
import Delete from "../icons/Delete.vue";
import { PLEASE_UPGRADE_TO_GOLD, COMMON_FIELDS } from "@/src/composables/constants";

interface ArrayItem {
  field: string;
  header: string;
  sortable: boolean;
}

const contactUrl = ref("");
const flatFieldQueryParameter = ref("id");
const typeOtherKey = ref("");
const oneColumnOnResponsive = ref(false);
const wholeRowClickable = ref(false);

const DEFAULT_CONTACT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none"><path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z" stroke="#1C274C" stroke-width="1.5"/><path d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/></svg>`;

const DEFAULT_DOWNLOAD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none"><path d="M12 12V19M12 19L9.75 16.6667M12 19L14.25 16.6667M6.6 17.8333C4.61178 17.8333 3 16.1917 3 14.1667C3 12.498 4.09438 11.0897 5.59198 10.6457C5.65562 10.6268 5.7 10.5675 5.7 10.5C5.7 7.46243 8.11766 5 11.1 5C14.0823 5 16.5 7.46243 16.5 10.5C16.5 10.5582 16.5536 10.6014 16.6094 10.5887C16.8638 10.5306 17.1284 10.5 17.4 10.5C19.3882 10.5 21 12.1416 21 14.1667C21 16.1917 19.3882 17.8333 17.4 17.8333" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const DEFAULT_MAGNIFY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 24 24"><path d="M3.624,15a8.03,8.03,0,0,0,10.619.659l5.318,5.318a1,1,0,0,0,1.414-1.414l-5.318-5.318A8.04,8.04,0,0,0,3.624,3.624,8.042,8.042,0,0,0,3.624,15Zm1.414-9.96a6.043,6.043,0,1,1-1.77,4.274A6,6,0,0,1,5.038,5.038ZM4.622,9.311a1,1,0,0,1,2,0A2.692,2.692,0,0,0,9.311,12a1,1,0,0,1,0,2A4.7,4.7,0,0,1,4.622,9.311Z" stroke="0"/></svg>`;

const contactSvg = ref("");
const downloadSvg = ref("");
const magnifySvg = ref("");

const contactSvgPreview = computed(() => contactSvg.value.trim() || DEFAULT_CONTACT_SVG);
const downloadSvgPreview = computed(() => downloadSvg.value.trim() || DEFAULT_DOWNLOAD_SVG);
const magnifySvgPreview = computed(() => magnifySvg.value.trim() || DEFAULT_MAGNIFY_SVG);

const flatFieldQueryParameterForRequest = () => {
  if (flatFieldQueryParameter.value === "type.other.*" && typeOtherKey.value.trim()) {
    return `type.other.${typeOtherKey.value.trim()}`;
  }
  return flatFieldQueryParameter.value;
};

const fields = ref<ArrayItem[]>([]);
const dataLoading = ref();
const formData = ref<ArrayItem>({
  field: COMMON_FIELDS[0] ?? "id",
  header: "",
  sortable: true
});
const editingIndex = ref<number | null>(null);
const drag = ref(false);
const formTopRef = ref<HTMLElement | null>(null);
/** Suffix when Field select is `type.other.*` (same idea as redirect query parameter). */
const tableFieldOtherKey = ref("");

const tableFieldValueForSave = (): string => {
  if (formData.value.field === "type.other.*") {
    return tableFieldOtherKey.value.trim() ? `type.other.${tableFieldOtherKey.value.trim()}` : "";
  }
  return formData.value.field;
};

const tableFieldOptions = computed(() => {
  const used = new Set(
    fields.value
      .filter((_, i) => editingIndex.value === null || i !== editingIndex.value)
      .map((item) => String(item?.field ?? "").trim())
      .filter(Boolean)
  );

  let opts = COMMON_FIELDS.filter((f) => !used.has(f));

  const current = String(formData.value.field ?? "").trim();
  // Re-add only legacy/custom paths not in COMMON_FIELDS. Do not re-add a common field that is
  // merely unavailable because another row already uses it (e.g. "id").
  if (current && !opts.includes(current) && !COMMON_FIELDS.includes(current)) {
    opts = [...opts, current];
  }
  return opts;
});

watch(tableFieldOptions, (opts) => {
  if (opts.length && !opts.includes(formData.value.field)) {
    formData.value.field = opts[0];
  }
});

const addContactUrl = async () => {
  if (!irePlugin?.is_gold) {
    showToast("error", PLEASE_UPGRADE_TO_GOLD);
    return;
  }

  try {
    const { data } = await ajaxAxios.post("", {
      action: "irep_add_table_contact_url",
      nonce: irePlugin.nonce,
      contactUrl: contactUrl.value,
      flatFieldQueryParameter: flatFieldQueryParameterForRequest()
    });

    if (data?.success) {
      showToast("success", "Table fields saved!");
    } else {
      showToast("error", "Something went wrong!");
    }
  } catch (error) {
    showToast("error", "Something went wrong!");
  }
};

const saveTableActionSvgs = async () => {
  if (!irePlugin?.is_gold) {
    showToast("error", PLEASE_UPGRADE_TO_GOLD);
    return;
  }

  try {
    const { data } = await ajaxAxios.post("", {
      action: "irep_save_table_action_svgs",
      nonce: irePlugin.nonce,
      contactSvg: contactSvg.value,
      downloadSvg: downloadSvg.value,
      magnifySvg: magnifySvg.value
    });

    if (data?.success) {
      showToast("success", "Action SVGs saved!");
    } else {
      showToast("error", "Something went wrong!");
    }
  } catch (error) {
    showToast("error", "Something went wrong!");
  }
};

const changeWholeRowClickable = async () => {
  if (!irePlugin?.is_gold) {
    showToast("error", PLEASE_UPGRADE_TO_GOLD);
    return;
  }

  try {
    const { data } = await ajaxAxios.post("", {
      action: "irep_change_table_whole_row_clickable",
      nonce: irePlugin.nonce,
      wholeRowClickable: wholeRowClickable.value
    });

    if (data?.success) {
      showToast("success", "Config Saved!");
    } else {
      showToast("error", "Something went wrong!");
    }
  } catch (error) {
    showToast("error", "Something went wrong!");
  }
};

const changeOneColumnOnResponsive = async () => {
  if (!irePlugin?.is_gold) {
    showToast("error", PLEASE_UPGRADE_TO_GOLD);
    return;
  }

  try {
    const { data } = await ajaxAxios.post("", {
      action: "irep_change_table_one_column",
      nonce: irePlugin.nonce,
      oneColumnOnResponsive: oneColumnOnResponsive.value
    });

    if (data?.success) {
      showToast("success", "Config Saved!");
    } else {
      showToast("error", "Something went wrong!");
    }
  } catch (error) {
    showToast("error", "Something went wrong!");
  }
};

const handleSubmit = async () => {
  if (!irePlugin?.is_gold) {
    showToast("error", PLEASE_UPGRADE_TO_GOLD);
    return;
  }

  if (formData.value.field === "type.other.*" && !tableFieldOtherKey.value.trim()) {
    showToast("error", "Enter a custom key for type.other.*");
    return;
  }
  const fieldPath = tableFieldValueForSave();
  if (!fieldPath) {
    showToast("error", "Please choose a field.");
    return;
  }

  const row = { ...formData.value, field: fieldPath };

  if (editingIndex.value !== null) {
    fields.value[editingIndex.value] = row;
    editingIndex.value = null;
  } else {
    fields.value.push(row);
  }

  formData.value = { field: COMMON_FIELDS[0] ?? "id", header: "", sortable: true };
  tableFieldOtherKey.value = "";

  saveToDb();
};

const saveToDb = async () => {
  if (!irePlugin?.is_gold) {
    showToast("error", PLEASE_UPGRADE_TO_GOLD);
    return;
  }

  try {
    const { data } = await ajaxAxios.post("", {
      action: "irep_add_table_fields",
      nonce: irePlugin.nonce,
      fields: fields.value
    });

    if (data?.success) {
      showToast("success", "Table fields saved!");
    } else {
      showToast("error", "Something went wrong!");
    }
  } catch (error) {
    showToast("error", "Something went wrong!");
  }
};

const handleEdit = (index: number) => {
  const item = fields.value[index];
  const raw = item.field;
  tableFieldOtherKey.value = "";
  if (raw.startsWith("type.other.") && raw !== "type.other.*") {
    formData.value = { ...item, field: "type.other.*" };
    tableFieldOtherKey.value = raw.slice("type.other.".length);
  } else {
    formData.value = { ...item };
  }
  editingIndex.value = index;
  nextTick(() => {
    formTopRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
};

const handleDelete = (index: number) => {
  fields.value.splice(index, 1);
  saveToDb();
};

const cancelEdit = () => {
  editingIndex.value = null;
  formData.value = { field: COMMON_FIELDS[0] ?? "id", header: "", sortable: true };
  tableFieldOtherKey.value = "";
};

const onDragEnd = () => {
  drag.value = false;
  saveToDb();
};

/** Example rows for the column layout preview (not real flat data). */
const TABLE_PREVIEW_DUMMY_ROW_COUNT = 3;

onMounted(async () => {
  dataLoading.value = true;
  const { data } = await ajaxAxios.post("", {
    action: "irep_get_table_fields",
    nonce: irePlugin.nonce
  });

  if (data?.data && data?.data.length) {
    fields.value = data?.data;
  }

  const { data: tableContactData } = await ajaxAxios.post("", {
    action: "irep_get_table_contact_url",
    nonce: irePlugin.nonce
  });

  const contactPayload = tableContactData?.data;
  if (contactPayload && typeof contactPayload === "object") {
    contactUrl.value = contactPayload.contactUrl ?? "";
    const saved = contactPayload.flatFieldQueryParameter ?? "id";
    if (saved.startsWith("type.other.") && saved !== "type.other.*") {
      flatFieldQueryParameter.value = "type.other.*";
      typeOtherKey.value = saved.replace(/^type\.other\./, "");
    } else {
      flatFieldQueryParameter.value = saved;
      typeOtherKey.value = "";
    }
  } else {
    contactUrl.value = contactPayload ?? "";
  }

  const { data: tableOneCol } = await ajaxAxios.post("", {
    action: "irep_get_table_one_column",
    nonce: irePlugin.nonce
  });

  oneColumnOnResponsive.value = tableOneCol?.data || false;

  const { data: tableWholeRow } = await ajaxAxios.post("", {
    action: "irep_get_table_whole_row_clickable",
    nonce: irePlugin.nonce
  });

  wholeRowClickable.value = tableWholeRow?.data || false;

  const { data: actionSvgsData } = await ajaxAxios.post("", {
    action: "irep_get_table_action_svgs",
    nonce: irePlugin.nonce
  });

  if (actionSvgsData?.data && typeof actionSvgsData.data === "object") {
    contactSvg.value = actionSvgsData.data.contactSvg ?? "";
    downloadSvg.value = actionSvgsData.data.downloadSvg ?? "";
    magnifySvg.value = actionSvgsData.data.magnifySvg ?? "";
  }

  dataLoading.value = false;
});
</script>

<template>
  <div v-if="dataLoading" class="mx-auto max-h-[90svh] w-full p-6 md:w-[800px]">
    <Loading />
  </div>

  <div v-else class="mx-auto max-h-[90svh] w-full p-6 md:w-[800px]">
    <h3 class="mb-6 text-2xl font-bold">Add table Fields</h3>

    <div class="mb-6 flex gap-4">
      <div class="flex-1 space-y-4 rounded-lg bg-white p-6 shadow">
        <Checkbox
          v-model="oneColumnOnResponsive"
          title="1 column on table responsive"
          @change="changeOneColumnOnResponsive"
        />

        <Checkbox
          v-model="wholeRowClickable"
          title="Whole row clickable"
          @change="changeWholeRowClickable"
        />

        <div class="flex-1 space-y-4 rounded-lg bg-white p-6 shadow">
          <h3 class="text-base font-semibold text-gray-600">Table Action Icons (SVG)</h3>
          <p class="text-xs text-gray-400">
            Paste custom SVG markup for each action icon. Leave blank to use the default icon.
          </p>

          <div class="space-y-4">
            <!-- Contact icon -->
            <div class="flex items-start gap-4">
              <div class="flex-1">
                <TextArea v-model="contactSvg" label="Contact icon SVG" placeholder="<svg …>…</svg>" />
              </div>
              <div class="flex shrink-0 flex-col items-center gap-1">
                <span class="text-xs text-gray-400">Preview</span>
                <div class="flex size-8 items-center justify-center [&_svg]:size-full" v-html="contactSvgPreview" />
              </div>
            </div>

            <!-- Download icon -->
            <div class="flex items-start gap-4">
              <div class="flex-1">
                <TextArea v-model="downloadSvg" label="Download icon SVG" placeholder="<svg …>…</svg>" />
              </div>
              <div class="flex shrink-0 flex-col items-center gap-1">
                <span class="text-xs text-gray-400">Preview</span>
                <div class="flex size-8 items-center justify-center [&_svg]:size-full" v-html="downloadSvgPreview" />
              </div>
            </div>

            <!-- Magnify icon -->
            <div class="flex items-start gap-4">
              <div class="flex-1">
                <TextArea v-model="magnifySvg" label="Magnify icon SVG" placeholder="<svg …>…</svg>" />
              </div>
              <div class="flex shrink-0 flex-col items-center gap-1">
                <span class="text-xs text-gray-400">Preview</span>
                <div class="flex size-8 items-center justify-center [&_svg]:size-full" v-html="magnifySvgPreview" />
              </div>
            </div>
          </div>

          <Button title="Save Action Icons" class="!w-fit" @click="saveTableActionSvgs" />
        </div>
      </div>

      <div class="flex-1 space-y-4 rounded-lg bg-white p-6 shadow">
        <Input
          v-model="contactUrl"
          label="Table Contact Action button redirect Url"
          placeholder="http://example.com/?flatid="
        />

        <div>
          <p class="mb-1">Choose redirect field query parameter (default is ID): http://example.com/?flatid={field}</p>
          <select
            v-model="flatFieldQueryParameter"
            class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option v-for="field in COMMON_FIELDS" :key="field" :value="field">
              {{ field }}
            </option>
          </select>
          <div v-if="flatFieldQueryParameter === 'type.other.*'" class="mt-2">
            <Input
              v-model="typeOtherKey"
              label="Custom key for type.other (replaces *)"
              placeholder="e.g. status, type"
            />
            <p class="mt-1 text-xs text-gray-400">Will be sent as: type.other.{{ typeOtherKey || "…" }}</p>
          </div>
        </div>

        <Button title="save" class="!w-fit" @click="addContactUrl" />
      </div>
    </div>

    <div class="mb-4 flex flex-wrap items-center gap-2">
      <p>Common fields:</p>
      <span v-for="field in COMMON_FIELDS" :key="field" class="badge">
        {{ field }}
      </span>
    </div>

    <!-- Form -->
    <div ref="formTopRef" class="mb-6 rounded-lg bg-white p-6 shadow">
      <h2 class="mb-4 text-lg font-semibold">
        {{ editingIndex !== null ? "Edit Item" : "Add New Field" }}
      </h2>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p class="mb-1">Field</p>
            <select
              v-model="formData.field"
              required
              class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option v-for="field in tableFieldOptions" :key="field" :value="field">
                {{ field }}
              </option>
            </select>
            <div v-if="formData.field === 'type.other.*'" class="mt-2">
              <Input
                v-model="tableFieldOtherKey"
                label="Custom key for type.other (replaces *)"
                placeholder="e.g. equipment, status"
              />
              <p class="mt-1 text-xs text-gray-400">Stored as: type.other.{{ tableFieldOtherKey || "…" }}</p>
            </div>
          </div>

          <Input v-model="formData.header" label="Header" placeholder="e.g., type" required />
        </div>

        <Checkbox v-model="formData.sortable" title="Sortable" class="w-fit" />

        <div class="flex gap-2">
          <Button type="submit" :title="editingIndex !== null ? 'Update' : 'Add'" class="!w-fit" />
          <button
            v-if="editingIndex !== null"
            type="button"
            @click="cancelEdit"
            class="rounded-md bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Table with Drag & Drop -->
    <div class="overflow-hidden rounded-lg bg-white shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-white">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              <DragIcon class="size-4" />
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Field</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Header</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Sortable</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Actions</th>
          </tr>
        </thead>

        <draggable
          v-model="fields"
          tag="tbody"
          item-key="field"
          class="divide-y divide-gray-200 bg-white"
          handle=".drag-handle"
          ghost-class="opacity-50"
          @start="drag = true"
          @end="onDragEnd"
        >
          <template #item="{ element: item, index }">
            <tr :class="['hover:bg-white', drag ? 'cursor-grabbing' : '']">
              <td class="px-6 py-4">
                <button
                  class="drag-handle cursor-grab text-gray-500 hover:text-gray-500 focus:outline-none"
                  title="Drag to reorder"
                >
                  <DragIcon class="size-5" />
                </button>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ item.field }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ item.header }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                <span
                  :class="item.sortable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="rounded-full px-2 py-1 text-xs font-medium"
                >
                  {{ item.sortable ? "Yes" : "No" }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <div class="flex shrink-0 gap-0.5">
                  <button
                    type="button"
                    class="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-500"
                    title="Edit"
                    @click="handleEdit(index)"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    class="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                    @click="handleDelete(index)"
                  >
                    <Delete class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </draggable>
      </table>

      <div v-if="fields.length === 0" class="py-8 text-center text-gray-400">
        No items yet. Add your first item above.
      </div>
    </div>

    <!-- Example table preview: same columns as above, dummy rows only -->
    <div class="mt-8 rounded-lg bg-white p-6 shadow">
      <h2 class="mb-2 text-lg font-semibold">Table preview (example)</h2>

      <div
        v-if="fields.length === 0"
        class="rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600"
      >
        Add at least one column above to see the preview.
      </div>

      <div v-else class="overflow-x-auto rounded-md border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-white">
            <tr>
              <th
                v-for="(col, i) in fields"
                :key="`${col.field}-${i}`"
                class="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
              >
                {{ col.header || col.field }}
              </th>

              <th
                class="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="row in TABLE_PREVIEW_DUMMY_ROW_COUNT" :key="row" class="hover:bg-white">
              <td
                v-for="(col, ci) in fields"
                :key="`${col.field}-${row}-${ci}`"
                class="whitespace-nowrap px-4 py-3 text-gray-500"
              >
                <span class="italic text-gray-500">—</span>
              </td>

              <td>
                <div class="flex items-center gap-2 [&_svg]:size-4">
                  <span v-html="magnifySvgPreview" />
                  <span v-html="contactSvgPreview" />
                  <span v-html="downloadSvgPreview" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="h-8"></div>
  </div>
</template>
