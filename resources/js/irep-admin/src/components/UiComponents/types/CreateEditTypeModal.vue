<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import Button from "../form/Button.vue";
import Input from "../form/Input.vue";
import UploadImg from "../form/UploadImg.vue";
import ajaxAxios from "@/src/utils/axios";
import { useProjectStore } from "@/src/stores/useProject";
import { storeToRefs } from "pinia";
import { Field, imageInterface, TypeItem } from "@/types/components";
import { showToast } from "@/src/composables/helpers";
import Delete from "../icons/Delete.vue";
import TextArea from "../form/TextArea.vue";
import DragIcon from "../icons/DragIcon.vue";
import draggable from "vuedraggable";
import { PLUGIN_ASSETS_PATH } from "@/src/composables/constants";

interface TypeFormInterface {
  title: string;
  teaser: string;
  image_2d: imageInterface[] | null;
  image_3d: imageInterface[] | null;
  gallery: imageInterface[] | null;
  area_m2: string;
  rooms_count: string;
  project_id: string;
  other: { _id?: string; key: string; value: string }[];
}

const emits = defineEmits<{
  (e: "setActiveType", activeType: TypeItem): void;
}>();

const props = defineProps<{
  duplicatedType?: TypeItem | null;
  activeType: TypeItem | null;
}>();

const projectStore = useProjectStore();

const { id } = storeToRefs(projectStore);

const obj = reactive<TypeFormInterface>({
  title: "",
  teaser: "",
  image_2d: null,
  image_3d: null,
  gallery: null,
  area_m2: "",
  rooms_count: "",
  project_id: id.value,
  other: []
});

const loading = ref(false);
const fields = ref<Field[]>([]);

const addOther = () => {
  if (!obj.other) obj.other = [];
  obj.other.push({
    _id: `other-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    key: "",
    value: ""
  });
};

const removeOther = (index: number) => {
  obj.other.splice(index, 1);
};

const submitForm = async () => {
  const params: any = {
    ...obj,
    other: obj.other?.map(({ _id, ...rest }: any) => rest) ?? []
  };

  [...fields.value].reverse().forEach((field) => {
    params.other = params?.other.filter((item: any) => item.key !== field.key);

    params?.other.unshift(field);
  });

  if (obj.image_2d) {
    params.image_2d = JSON.stringify(obj.image_2d);
  }

  if (obj.image_3d) {
    params.image_3d = JSON.stringify(obj.image_3d);
  }

  if (obj.gallery) {
    params.gallery = JSON.stringify(obj.gallery);
  }

  loading.value = true;

  if (props.activeType) {
    try {
      await editType(params);
    } catch (error) {
      showToast("error", "Something went wrong!");
    }
  } else {
    try {
      await createType(params);
    } catch (error) {
      showToast("error", "Something went wrong!");
    }
  }

  loading.value = false;
};

const editType = async (params: any) => {
  const { data } = await ajaxAxios.post("", {
    action: "irep_update_type",
    nonce: irePlugin.nonce,
    type_id: props.activeType?.id,
    ...params
  });

  if (data.success) {
    showToast("success", "Type updated!");
  } else {
    showToast("error", data?.data || "Something went wrong!");
  }
};

const createType = async (params: any) => {
  const { data } = await ajaxAxios.post("", {
    action: "irep_create_type",
    nonce: irePlugin.nonce,
    ...params
  });

  if (data.success) {
    showToast("success", "Type created!");

    emits("setActiveType", data?.data);
  } else {
    showToast("error", data?.data || "Something went wrong!");
  }
};

const filterOtherFields = () => {
  obj.other = obj?.other.filter((item: any) => {
    const findedField = fields.value?.find((field) => field?.key === item?.key);
    return !findedField;
  });
};

onMounted(async () => {
  let typeInstance = null;
  if (props.activeType) {
    typeInstance = props.activeType;
  } else if (props.duplicatedType) {
    typeInstance = props.duplicatedType;
  }

  if (typeInstance) {
    obj.title = typeInstance.title;
    obj.teaser = typeInstance.teaser;
    obj.area_m2 = typeInstance.area_m2;
    obj.rooms_count = typeInstance.rooms_count;
    obj.image_2d = typeInstance.image_2d ?? null;
    obj.image_3d = typeInstance.image_3d ?? null;
    obj.gallery = typeInstance.gallery ?? null;
    const rawOther = typeInstance.other ?? [];
    obj.other = rawOther.map((o: any, i: number) => ({
      ...o,
      _id: o._id ?? `other-${i}-${Date.now()}`
    }));
  }

  const { data } = await ajaxAxios.post("", {
    action: "irep_get_flat_fields",
    nonce: irePlugin.nonce
  });

  if (data?.data && data?.data?.length) {
    fields.value = data?.data;

    obj.other.forEach((item: any) => {
      const findField = fields.value?.find((field) => field?.key === item?.key);

      if (findField && item.value) {
        fields.value = fields.value?.map((i) => (i.key === item?.key ? { ...i, value: item?.value } : i));
      }
    });

    filterOtherFields();
  }
});
</script>

<template>
  <form class="h-full w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm" @submit.prevent="submitForm">

    <!-- Header -->
    <div class="border-b border-gray-100 bg-gray-50 px-5 py-3.5">
      <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {{ activeType ? "Editing type" : "New type" }}
      </p>
      <h2 class="mt-0.5 text-base font-semibold text-gray-900">
        {{ activeType ? `#${activeType.id}` : "Add type" }}
        <span v-if="activeType?.title" class="ml-1 text-gray-500">— {{ activeType.title }}</span>
      </h2>
    </div>

    <div class="flex flex-col gap-0 divide-y divide-gray-100">

      <!-- Basic Info -->
      <section class="px-5 py-4">
        <p class="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Basic info</p>
        <div class="flex flex-col gap-3">
          <Input v-model="obj.title" placeholder="Corner apartment" label="Type title" required />
          <TextArea
            v-model="obj.teaser"
            placeholder="Experience the perfect blend of comfort, style, and stunning views!"
            label="Teaser"
          />
          <div class="grid grid-cols-2 gap-3">
            <Input v-model="obj.area_m2" placeholder="62.5" label="Area m²" type="number" is-float required />
            <Input v-model="obj.rooms_count" placeholder="3" label="Rooms count" type="number" is-float />
          </div>
        </div>
      </section>

      <!-- Custom Fields (from global settings) -->
      <section v-if="fields.length" class="px-5 py-4">
        <p class="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Custom fields</p>
        <div class="flex flex-col gap-2">
          <div v-for="field in fields" :key="field.key" class="flex items-end gap-2">
            <Input v-model="field.key" placeholder="" label="Key" disabled class="flex-1" />
            <div v-if="field?.type === 'select'" class="flex-1">
              <select v-model="field.value" :name="field.key" class="w-full rounded border border-gray-300 bg-gray-100 px-2.5 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300">
                <option :value="''">—</option>
                <option v-for="value in field.values" :key="value" :value="value">{{ value }}</option>
              </select>
            </div>
            <Input v-else v-model="field.value as any" placeholder="" label="Value" class="flex-1" />
          </div>
        </div>
      </section>

      <!-- Extra Fields -->
      <section class="px-5 py-4">
        <p class="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Extra fields</p>
        <draggable v-model="obj.other" item-key="_id" handle=".drag-handle" ghost-class="opacity-50" class="flex flex-col gap-2">
          <template #item="{ element: other, index: i }">
            <div class="flex items-end gap-2">
              <div class="flex items-center gap-1 mb-0.5">
                <button class="drag-handle cursor-grab text-gray-400 hover:text-gray-600 focus:outline-none" title="Drag">
                  <DragIcon class="size-4" />
                </button>
                <button
                  v-if="!other.type"
                  type="button"
                  class="shrink-0 rounded p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                  @click.prevent="removeOther(i)"
                >
                  <Delete class="h-4 w-4" />
                </button>
              </div>
              <Input v-model="other.key" placeholder="Key" label="Key" class="flex-1" />
              <Input v-model="other.value" placeholder="Value" label="Value" class="flex-1" />
            </div>
          </template>
        </draggable>
        <button
          class="mt-1 text-xs font-medium text-gray-500 transition hover:text-gray-800 hover:underline"
          @click.prevent="addOther"
        >
          + Add field
        </button>
      </section>

      <!-- Images -->
      <section class="px-5 py-4">
        <p class="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Images</p>
        <div class="flex flex-col gap-3">
          <UploadImg v-model="obj.image_2d" title="Image 2D" resolution="400×400" :example-image="PLUGIN_ASSETS_PATH + 'flat_2d.webp'" multiple allow-youtube />
          <UploadImg v-model="obj.image_3d" title="Image 3D" resolution="400×400" :example-image="PLUGIN_ASSETS_PATH + 'flat_3d.webp'" multiple allow-youtube />
        </div>
      </section>

      <!-- Actions -->
      <div class="bg-gray-50 px-5 py-4">
        <Button type="submit" :title="activeType ? 'Save changes' : 'Add type'" :loading="loading" />
      </div>

    </div>
  </form>
</template>
