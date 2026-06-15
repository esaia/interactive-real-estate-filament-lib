<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import Button from "@components/UiComponents/form/Button.vue";
import Input from "@components/UiComponents/form/Input.vue";
import Select from "@components/UiComponents/form/Select.vue";
import { useFloorsStore } from "@/src/stores/useFloors";
import { storeToRefs } from "pinia";
import { useTypesStore } from "@/src/stores/useTypes";
import ajaxAxios from "@/src/utils/axios";
import { useProjectStore } from "@/src/stores/useProject";
import { Field, FlatItem, imageInterface, selectDataItem, TypeItem } from "@/types/components";
import Modal from "@components/UiComponents/Modal.vue";
import CreateEditTypeModal from "@components/UiComponents/types/CreateEditTypeModal.vue";
import { useBlocksStore } from "@/src/stores/useBlock";
import { getBlockTitleById, pushToPlansPage, showToast, hasPriceHistoryAddon } from "@/src/composables/helpers";
import { useFlatsStore } from "@/src/stores/useFlats";
import { useMetaStore } from "@/src/stores/useMeta";
import UploadImg from "@components/UiComponents/form/UploadImg.vue";
import Radio from "@components/UiComponents/form/Radio.vue";
import Checkbox from "@components/UiComponents/form/Checkbox.vue";
import Delete from "../icons/Delete.vue";
import Toggle from "@components/UiComponents/form/Toggle.vue";
import DragIcon from "@components/UiComponents/icons/DragIcon.vue";
import draggable from "vuedraggable";
import StatusSelect from "@components/UiComponents/flats/StatusSelect.vue";
import PriceHistoryModal from "@components/UiComponents/flats/PriceHistoryModal.vue";
import { DEFAULT_CONFIG, PLUGIN_ASSETS_PATH } from "@/src/composables/constants";
import TextArea from "../form/TextArea.vue";
import Loading from "../common/Loading.vue";

const emits = defineEmits<{
  (e: "setActiveFlat", activeType: FlatItem): void;
}>();

const props = defineProps<{
  duplicatedFlat?: FlatItem | null;
  activeFlat: FlatItem | null;
}>();

const projectStore = useProjectStore();
const floorStore = useFloorsStore();
const blockStore = useBlocksStore();
const typesStore = useTypesStore();
const flatStore = useFlatsStore();
const metaStore = useMetaStore();
const { projectFloors } = storeToRefs(floorStore);
const { projectFlats } = storeToRefs(flatStore);

const { projectTypes } = storeToRefs(typesStore);
const { is_gold, is_premium } = storeToRefs(projectStore);

const obj = reactive<any>({
  is_active: true,
  flat_number: "",
  conf: null,
  type_id: null,
  floor_id: null,
  request_price: false,
  price: "",
  offer_price: "",
  block_id: null,
  click_action: "",
  follow_link: {
    link: "",
    target: true
  },
  type: {
    title: "",
    teaser: "",
    area_m2: "",
    rooms_count: "",
    other: [],
    image_2d: "",
    image_3d: ""
  },
  files: [] as imageInterface[]
});

const useType = ref("true");
const showTypeModal = ref(false);
const showPriceHistoryModal = ref(false);
const activeType = ref<TypeItem | null>(null);

// /** Price-history add-on: `irePlugin.price_history_addon` from Freemius `is_addon_activated`. */
// const hasPriceHistoryAddon = computed(() =>
//   Boolean((irePlugin as typeof irePlugin & { price_history_addon?: boolean }).price_history_addon)
// );

/** Price history from Pinia after `fetchProjectFlats` — `activeFlat` prop is not refreshed. */
const priceHistoryInitialEntries = computed(() => {
  const id = props.activeFlat?.id;
  if (id == null) return undefined;
  const list = projectFlats.value;
  if (list?.length) {
    const fresh = list.find((f) => String(f.id) === String(id));
    if (fresh) {
      return fresh.price_history ?? [];
    }
  }
  return props.activeFlat?.price_history ?? [];
});
const loading = ref(false);
const fields = ref<Field[]>([]);

const floorsNumberData = computed(() => {
  if (!projectFloors.value) return [];

  return projectFloors.value
    .filter((i) => {
      if (obj.block_id) {
        return i?.block_id === obj?.block_id?.value;
      } else {
        return !i.block_id;
      }
    })
    ?.sort((a, b) => Number(a.floor_number) - Number(b.floor_number))
    ?.map((floor) => {
      return {
        title: `id: ${floor.id} - ${floor.floor_number} ${floor?.block_id ? " | block (" + getBlockTitleById(floor.block_id) + ")" : ""}`,
        value: floor.id
      };
    });
});

const typesData = computed(() => {
  if (!projectTypes.value) return [];

  return projectTypes.value?.map((type) => {
    return { title: type.title, value: type.id.toString() };
  });
});

const blockSelectData = computed(() => {
  return (
    blockStore.projectBlocks?.map((block) => {
      return {
        title: block?.title,
        value: block.id
      };
    }) || []
  );
});

const addOther = () => {
  if (!obj?.type?.other) obj.type.other = [];
  obj.type.other?.push({
    _id: `other-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    key: "",
    value: ""
  });
};

const removeOther = (index: number) => {
  obj.type?.other?.splice(index, 1);
};

const submitForm = async () => {
  const { type: _omit, ...objRest } = obj;

  const flatTypeData = {
    ...obj.type,
    image_2d: Array.isArray(obj.type.image_2d) ? obj.type.image_2d : [],
    image_3d: Array.isArray(obj.type.image_3d) ? obj.type.image_3d : [],
    other: obj.type.other?.map(({ _id, ...rest }: any) => rest) ?? []
  };

  [...fields.value].reverse()?.forEach((field) => {
    flatTypeData.other = flatTypeData.other?.filter((item: any) => item.key !== field.key);
    flatTypeData.other?.unshift(field);
  });

  const params: any = {
    ...objRest,
    conf: (obj.conf as selectDataItem | null)?.value || "",
    type_id: (obj.type_id as selectDataItem | null)?.value,
    floor_id: (obj.floor_id as selectDataItem | null)?.value,
    project_id: projectStore?.id,
    block_id: obj.block_id?.value || null,
    use_type: useType.value,
    flat_type: JSON.stringify(flatTypeData)
  };

  params.files = JSON.stringify(Array.isArray(obj.files) ? obj.files : []);

  loading.value = true;

  if (props.activeFlat) {
    try {
      await editFlat(params);
    } catch (error) {
      showToast("error", "Something went wrong!");
    }
  } else {
    try {
      await createFlat(params);
    } catch (error) {
      showToast("error", "Something went wrong!");
    }
  }

  loading.value = false;

  flatStore.fetchProjectFlats(projectStore.id);
};

const editFlat = async (params: any) => {
  const { data } = await ajaxAxios.post("", {
    action: "irep_update_flat",
    nonce: irePlugin.nonce,
    flat_id: props.activeFlat?.id,
    ...params
  });

  if (data.success) {
    showToast("success", "Flat Updated!");
  } else {
    showToast("error", data?.data || "Something went wrong!");
  }
};

const createFlat = async (params: any) => {
  const { data } = await ajaxAxios.post("", {
    action: "irep_create_flat",
    nonce: irePlugin.nonce,
    ...params
  });

  if (data.success) {
    showToast("success", "Flat Created!");

    emits("setActiveFlat", data.data);
  } else {
    showToast("error", data?.data || "Something went wrong!");
  }
};

const showEditTypeModal = () => {
  activeType.value = projectTypes.value?.find((type) => String(type.id) === String(obj.type_id?.value)) || null;

  if (activeType.value) {
    showTypeModal.value = true;
  }
};

const closeTypeModal = () => {
  showTypeModal.value = false;
  typesStore.fetchProjectTypes(projectStore.id);
};

const filterOtherFields = () => {
  obj.type.other = obj.type.other?.filter((item: any) => {
    const findedField = fields.value.find((field) => field.key === item.key);
    return !findedField;
  });
};

/** Status options: defaults + global custom types (site-wide). */
function getStatusOptions(): { title: string; value: string }[] {
  const custom = (metaStore.customStatusTypes || [])
    .filter((t) => t && typeof t.title === "string" && typeof t.value === "string")
    .map((t) => ({ title: t.title, value: t.value }));
  return [...DEFAULT_CONFIG, ...custom];
}

onMounted(async () => {
  loading.value = true;
  floorStore.fetchProjectFloors(Number(projectStore.id));
  await metaStore.getCustomStatusTypes();

  let typeInstance = null;
  if (props.activeFlat) {
    typeInstance = props.activeFlat;
  } else if (props.duplicatedFlat) {
    typeInstance = props.duplicatedFlat;
  }

  if (typeInstance) {
    obj.is_active = typeInstance.is_active;
    obj.flat_number = typeInstance.flat_number;
    const statusOptions = getStatusOptions();
    obj.conf = statusOptions.find((item) => item.value === typeInstance.conf) ?? null;
    obj.request_price = typeInstance.request_price ?? "";
    obj.price = typeInstance.price ?? "";
    obj.offer_price = typeInstance.offer_price ?? "";
    obj.type_id = typesData.value.find((type) => String(type.value) === String(typeInstance.type_id)) ?? null;
    obj.block_id = blockSelectData.value.find((block) => String(block.value) === String(typeInstance.block_id)) ?? null;
    obj.floor_id = floorsNumberData.value.find((floor) => String(floor.value) === String(typeInstance.floor_id)) ?? null;
    obj.click_action = typeInstance?.click_action ?? "";
    obj.follow_link = typeInstance?.follow_link ?? { link: "", target: false };
    obj.files = typeInstance?.files || [];
    useType.value = String(typeInstance.use_type) === "true" ? "true" : "false";
    if (typeInstance.flat_type) {
      obj.type = typeInstance.flat_type;
      if (obj.type.other?.length) {
        obj.type.other = obj.type.other.map((o: any, i: number) => ({
          ...o,
          _id: o._id ?? `other-${i}-${Date.now()}`
        }));
      }
    }
  }

  const { data } = await ajaxAxios.post("", {
    action: "irep_get_flat_fields",
    nonce: irePlugin.nonce
  });

  if (data?.data && data?.data?.length) {
    fields.value = data?.data;

    obj.type.other?.forEach((item: any) => {
      const findField = fields.value.find((field) => field.key === item.key);

      if (findField && item.value) {
        fields.value = fields.value.map((i) => (i.key === item.key ? { ...i, value: item.value } : i));
      }
    });

    filterOtherFields();
  }

  loading.value = false;
});
</script>

<template>
  <div v-if="loading" class="flex min-h-[200px] items-center justify-center">
    <Loading />
  </div>

  <form v-else class="flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm" @submit.prevent="submitForm">

    <!-- Header -->
    <div class="border-b border-gray-100 bg-gray-50 px-5 py-3.5">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            {{ activeFlat ? "Editing flat" : "New flat" }}
          </p>
          <h2 class="mt-0.5 text-base font-semibold text-gray-900">
            {{ activeFlat ? `#${activeFlat.id}` : "Add flat" }}
            <span v-if="activeFlat?.flat_number" class="ml-1 text-gray-500">— {{ activeFlat.flat_number }}</span>
          </h2>
        </div>
        <div v-if="activeFlat" class="flex items-center gap-2">
          <span class="text-xs text-gray-500">Active</span>
          <Toggle v-model="obj.is_active" :disabled="!is_gold" />
        </div>
      </div>
    </div>

    <div class="flex flex-1 flex-col divide-y divide-gray-100 overflow-y-auto">

      <!-- Identity & Location -->
      <section class="px-5 py-4">
        <p class="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Identity & Location</p>
        <div class="flex flex-col gap-3">
          <Input v-model="obj.flat_number" placeholder="flat-57" label="Flat number / name" required />
          <div class="grid grid-cols-2 gap-3">
            <Select v-model="obj.block_id" :data="blockSelectData" label="Block" clearable />
            <Select v-if="floorsNumberData" v-model="obj.floor_id" :data="floorsNumberData" label="Floor" clearable />
          </div>
        </div>
      </section>

      <!-- Pricing -->
      <section class="px-5 py-4">
        <p class="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Pricing</p>
        <div class="flex flex-col gap-3">
          <Checkbox v-model="obj.request_price" title="Request Price (hide price, show inquiry)" />
          <template v-if="!obj.request_price">
            <div class="grid grid-cols-2 gap-3">
              <Input v-model="obj.price" type="number" is-float placeholder="60 000" label="Price" />
              <Input v-model="obj.offer_price" type="number" is-float placeholder="58 000" label="Offer price" />
            </div>
          </template>
          <div v-if="activeFlat && hasPriceHistoryAddon()" class="pt-1">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-400 hover:text-gray-900"
              @click="showPriceHistoryModal = true"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Price history
            </button>
          </div>
        </div>
      </section>

      <!-- Status & Behaviour -->
      <section class="px-5 py-4">
        <p class="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Status & Behaviour</p>
        <div class="flex flex-col gap-3">
          <StatusSelect v-model="obj.conf" label="Status" clearable />
          <div>
            <p class="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-500">On click</p>
            <div class="flex items-center gap-4">
              <Radio v-model="obj.click_action" label="Open flat modal" name="flat_click_action" value="" />
              <Radio v-model="obj.click_action" label="Follow link" name="flat_click_action" value="follow_link" />
            </div>
          </div>
          <template v-if="obj.click_action === 'follow_link'">
            <Input v-model="obj.follow_link.link" placeholder="https://example.com" label="URL" />
            <Checkbox v-model="obj.follow_link.target" title="Open in new tab" />
          </template>
        </div>
      </section>

      <!-- Type -->
      <section class="px-5 py-4">
        <div class="mb-3 flex items-center justify-between">
          <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Type configuration</p>
          <div class="flex items-center gap-3">
            <Radio v-model="useType" label="Choose type" name="useTypeRadio" value="true" />
            <Radio v-model="useType" label="Manually" name="useTypeRadio" value="false" />
          </div>
        </div>

        <!-- Choose from list -->
        <div v-if="useType === 'true'" class="flex flex-col gap-2">
          <Select
            v-model="obj.type_id"
            :data="typesData"
            label="Select type"
            description="Group apartments of the same layout/area under one type to avoid duplicate records."
            required
          />
          <div v-if="obj.type_id">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-400 hover:text-gray-900"
              @click="showEditTypeModal"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              Edit selected type
            </button>
          </div>
        </div>

        <!-- Manual entry -->
        <div v-else class="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <Input v-model="obj.type.title" placeholder="Corner apartment" label="Type title" />
          <TextArea
            v-model="obj.type.teaser"
            placeholder="Experience the perfect blend of comfort, style, and stunning views!"
            label="Teaser"
          />
          <div class="grid grid-cols-2 gap-3">
            <Input v-model="obj.type.area_m2" placeholder="62.5" label="Area m²" is-float type="number" />
            <Input v-model="obj.type.rooms_count" placeholder="3" label="Rooms" is-float type="number" />
          </div>

          <template v-if="fields.length">
            <div class="border-t border-gray-200 pt-3">
              <p class="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Custom fields</p>
              <div v-for="field in fields" class="mb-2 flex items-end gap-2">
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
          </template>

          <div class="border-t border-gray-200 pt-3">
            <p class="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Extra fields</p>
            <draggable v-model="obj.type.other" item-key="_id" handle=".drag-handle" ghost-class="opacity-50" class="flex flex-col gap-2">
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
          </div>

          <div class="flex flex-col gap-3 border-t border-gray-200 pt-3">
            <UploadImg v-model="obj.type.image_2d" title="Image 2D" resolution="400×400" :example-image="PLUGIN_ASSETS_PATH + 'flat_2d.webp'" multiple allow-youtube />
            <UploadImg v-model="obj.type.image_3d" title="Image 3D" resolution="400×400" :example-image="PLUGIN_ASSETS_PATH + 'flat_3d.webp'" multiple allow-youtube />
          </div>
        </div>
      </section>

      <!-- Attachments -->
      <section class="px-5 py-4">
        <p class="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Attachments</p>
        <UploadImg v-model="obj.files" title="Upload PDF / file" multiple />
      </section>

      <!-- Actions -->
      <div class="bg-gray-50 px-5 py-4">
        <template v-if="activeFlat">
          <Button type="submit" title="Save changes" :loading="loading" />
        </template>
        <template v-else-if="!is_premium && flatStore.projectFlats && flatStore.projectFlats?.length >= 25">
          <div @click="pushToPlansPage()">
            <Button type="submit" title="Upgrade to add more flats" :disabled="true" />
          </div>
          <p class="mt-2 text-xs text-gray-500">Free plan is limited to 25 flats.</p>
        </template>
        <template v-else>
          <Button type="submit" title="Add flat" :loading="loading" />
        </template>
      </div>

    </div>
  </form>

  <teleport to="#irep-vue-app">
    <Transition name="fade">
      <Modal :show="showTypeModal" @close="closeTypeModal" type="2" width="w-[500px]">
        <CreateEditTypeModal :activeType="activeType" />
      </Modal>
    </Transition>
  </teleport>

  <PriceHistoryModal
    v-if="activeFlat && hasPriceHistoryAddon"
    :show="showPriceHistoryModal"
    :flat-id="String(activeFlat.id)"
    :project-id="Number(projectStore.id)"
    :initial-entries="priceHistoryInitialEntries"
    @close="showPriceHistoryModal = false"
  />
</template>
