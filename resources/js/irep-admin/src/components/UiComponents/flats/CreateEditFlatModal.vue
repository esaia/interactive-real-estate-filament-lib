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
    ?.sort((a, b) => a.floor_number.localeCompare(b.floor_number))
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

  if (Array.isArray(obj.files) && obj.files.length) {
    params.files = obj.files.map((i: any) => i.id);
  }

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
  activeType.value = projectTypes.value?.find((type) => type.id === obj.type_id?.value) || null;

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
    obj.type_id = typesData.value.find((type) => type.value === typeInstance.type_id) ?? null;
    obj.block_id = blockSelectData.value.find((block) => block.value === typeInstance.block_id) ?? null;
    obj.floor_id = floorsNumberData.value.find((floor) => floor.value === typeInstance.floor_id) ?? null;
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
  <div v-if="loading">
    <Loading />
  </div>

  <form v-else class="h-full w-full rounded-md border border-gray-200 shadow-sm" @submit.prevent="submitForm">
    <div class="flex w-full items-center justify-center bg-gray-100 p-3">
      <h2 class="!text-lg text-gray-900">
        {{ activeFlat ? "Editing flat with ID - " : "Add flat" }}

        <span v-if="activeFlat?.id" class="text-red-600"> {{ activeFlat?.id }} </span>
      </h2>
    </div>

    <div class="flex flex-col items-center gap-3 p-3">
      <div v-if="activeFlat" class="flex w-full items-center gap-2">
        <p class="min-w-max text-gray-600">Is active</p>
        <Toggle v-model="obj.is_active" :disabled="!is_gold" />
      </div>

      <Input v-model="obj.flat_number" placeholder="flat-57" label="Flat number/name" required />

      <Select v-model="obj.block_id" :data="blockSelectData" label="select block" clearable />

      <Select v-if="floorsNumberData" v-model="obj.floor_id" :data="floorsNumberData" label="Floor number" clearable />

      <Checkbox v-model="obj.request_price" title="Request Price" class="mt-2 w-full" />

      <Input v-if="!obj.request_price" v-model="obj.price" type="number" is-float placeholder="60000" label="Price" />
      <Input
        v-if="!obj.request_price"
        v-model="obj.offer_price"
        type="number"
        is-float
        placeholder="58000"
        label="Offer price"
      />

      <div v-if="activeFlat && hasPriceHistoryAddon()" class="w-fit">
        <Button type="button" outlined title="Manage price history" @click="showPriceHistoryModal = true" />
      </div>

      <StatusSelect v-model="obj.conf" label="Status" clearable />

      <div class="w-full">
        <p class="label">Action on click:</p>
        <div class="flex items-center gap-3">
          <Radio v-model="obj.click_action" label="Open flat modal" name="flat_click_action" value="" />
          <Radio v-model="obj.click_action" label="Follow link" name="flat_click_action" value="follow_link" />
        </div>
      </div>

      <div v-if="obj.click_action === 'follow_link'" class="w-full">
        <Input v-model="obj.follow_link.link" placeholder="https://example.com" label="Link" />

        <Checkbox v-model="obj.follow_link.target" title="Open in new window" class="mt-2" />
      </div>

      <div class="my-2 h-1 w-full bg-gray-100" />

      <div class="flex items-center gap-3">
        <Radio v-model="useType" label="Choose type" name="useTypeRadio" value="true" />
        <Radio v-model="useType" label="Manually" name="useTypeRadio" value="false" />
      </div>

      <div v-if="useType === 'true'">
        <Select
          v-model="obj.type_id"
          :data="typesData"
          label="Type"
          description="For apartments of the same type, (For example, apartments that have the same area M2, number of rooms, arrangement of rooms) you need to add an entry in the types and then select from this list, Because the same records should not be created many times"
          required
        />

        <Button v-if="obj.type_id" class="!p-1" title="edit type" outlined @click="showEditTypeModal" />
      </div>

      <div v-else class="flex w-full flex-col gap-4 rounded-md border border-gray-200 p-3">
        <Input v-model="obj.type.title" placeholder="corner apartment" label="Type title" />
        <TextArea
          v-model="obj.type.teaser"
          placeholder="Experience the perfect blend of comfort, style, and stunning views!"
          label="Type teaser"
        />

        <Input v-model="obj.type.area_m2" placeholder="62.5" label="area m²" is-float type="number" />
        <Input v-model="obj.type.rooms_count" placeholder="3" label="Rooms count" is-float type="number" />

        <div class="w-full space-y-2">
          <template v-if="fields.length">
            <p>Custom Fields</p>

            <div v-for="field in fields" class="flex w-full items-end justify-center gap-2">
              <Input v-model="field.key" placeholder="" label="Key" disabled class="w-full flex-1" />

              <div v-if="field?.type === 'select'" class="flex-1">
                <select v-model="field.value" :name="field.key" class="w-full !border !border-gray-300 !bg-gray-100 !py-[1px] !text-gray-900">
                  <option :value="''">empty</option>
                  <option v-for="value in field.values" :key="value" :value="value">{{ value }}</option>
                </select>
              </div>

              <Input v-else v-model="field.value as any" placeholder="" label="Value" class="w-full flex-1" />
            </div>
          </template>

          <button class="text-gray-500 hover:text-gray-800 hover:underline" @click.prevent="addOther">Add other type</button>

          <draggable
            v-model="obj.type.other"
            item-key="_id"
            handle=".drag-handle"
            ghost-class="opacity-50"
            class="space-y-4"
          >
            <template #item="{ element: other, index: i }">
              <div class="flex w-full items-end justify-center gap-2">
                <button
                  class="drag-handle cursor-grab text-gray-500 hover:text-gray-500 focus:outline-none"
                  title="Drag to reorder"
                >
                  <DragIcon class="size-5" />
                </button>

                <button
                  v-if="!other.type"
                  type="button"
                  class="shrink-0 rounded-md p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                  aria-label="Remove custom field"
                  @click.prevent="removeOther(i)"
                >
                  <Delete class="h-5 w-5" />
                </button>

                <Input v-model="other.key" placeholder="" label="Key" class="w-full flex-1" />

                <Input v-model="other.value" placeholder="" label="Value" class="w-full flex-1" />
              </div>
            </template>
          </draggable>
        </div>

        <UploadImg
          v-model="obj.type.image_2d"
          title="upload image 2d"
          resolution="400 x 400"
          :example-image="PLUGIN_ASSETS_PATH + 'flat_2d.webp'"
          multiple
        />
        <UploadImg
          v-model="obj.type.image_3d"
          title="upload image 3d"
          resolution="400 x 400"
          :example-image="PLUGIN_ASSETS_PATH + 'flat_3d.webp'"
          multiple
        />
      </div>

      <UploadImg v-model="obj.files" title="upload PDF file" />

      <Button v-if="activeFlat" type="submit" title="Edit flat" :loading="loading" />

      <div v-else-if="!is_premium && flatStore.projectFlats && flatStore.projectFlats?.length >= 25" class="w-full">
        <div @click="pushToPlansPage()">
          <Button type="submit" title="Upgrade to add more flats" :disabled="true" />
        </div>
        <p class="mt-2">You can add max 25 flat with free plan</p>
      </div>

      <Button v-else type="submit" :title="activeFlat ? 'Edit flat' : 'Add flat'" :loading="loading" />
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
