<script setup lang="ts">
import { computed, ref, Teleport, Transition } from "vue";
import Input from "../../form/Input.vue";
import UploadImg from "../../form/UploadImg.vue";
import CurrencySelect from "../CurrencySelect.vue";
import Select from "../../form/Select.vue";
import { useMetaStore } from "@/src/stores/useMeta";
import { PLUGIN_ASSETS_PATH } from "@/src/composables/constants";
import { imageInterface, ProjectSettings } from "@/types/components";
import Checkbox from "../../form/Checkbox.vue";
import Info from "../../icons/Info.vue";
import { pushToAddonsPage, setQuery } from "@/src/composables/helpers";
import Modal from "../../Modal.vue";
import { useProjectStore } from "@/src/stores/useProject";
import { storeToRefs } from "pinia";
import Toggle from "../../form/Toggle.vue";
import LicensePlanBadge from "../LicensePlanBadge.vue";

const metaStore = useMetaStore();
const projectStore = useProjectStore();

const { is_360_flow, is_premium, is_gold } = storeToRefs(projectStore);

const modelValue = defineModel<ProjectSettings>({ required: true });
const title = defineModel<string>("title", { required: true });
const projectImage = defineModel<imageInterface[] | null>("projectImage", {
    required: true,
});

const bindField = <K extends keyof ProjectSettings>(key: K) =>
    computed<ProjectSettings[K]>({
        get: () => modelValue.value[key],
        set: (value) => {
            modelValue.value = { ...modelValue.value, [key]: value };
        },
    });

const chosenCurrencyValue = bindField("chosenCurrency");
const chosenAreaValue = bindField("chosenArea");
const chosenPriceSeparatorValue = bindField("chosenPriceSeparator");
const chosenSeparatorValue = bindField("chosenSeparator");
const isPriceRoundedValue = bindField("isPriceRounded");
const removeWatermarkValue = bindField("removeWatermark");
const shareableLinkValue = bindField("shareableLink");
const requestCallbackValue = bindField("requestCallback");
const redirectToCallbackUrlValue = bindField("redirectToCallbackUrl");
const receiveFormsOnEmailValue = bindField("receiveFormsOnEmail");
const pathsHoverFillValue = bindField("pathsHoverFill");
const exampleImage = ref("");

const is360FlowDisabled = computed(() => !irePlugin?.building_360_addon);

const onToggle360FlowChange = async () => {
    await metaStore.setProjectMeta([{ key: "is_360_flow", value: is_360_flow.value }]);
};

const pushToFormResponsesPage = () => {
    setQuery("project", "");
    setQuery("page", "irep-form-responses");
    window.location.reload();
};
</script>
<template>
    <div class="space-y-4">
        <Input v-model="title" label="Project Title" class="w-full" />

        <div v-if="!is_360_flow || is360FlowDisabled" class="w-52">
            <UploadImg
                v-model="projectImage"
                title="Upload project image"
                :example-image="PLUGIN_ASSETS_PATH + 'mainRender.webp'"
                required
            />

            <p class="mt-1 text-red-700 text-xs">
                <span class="font-semibold">IMPORTANT:</span> Changing the image
                may cause svg paths mismatches.
            </p>
        </div>

        <div class="flex gap-4">
            <CurrencySelect v-model="chosenCurrencyValue" class="flex-1" />
            <Select
                label="Area unit"
                :data="metaStore.areaSelectData"
                v-model="chosenAreaValue"
                class="flex-1"
            />
            <div class="flex-1">
                <Select
                    label="Float number separator"
                    :data="metaStore.separatorData"
                    v-model="chosenSeparatorValue"
                />
                <div class="text-xs opacity-80">
                    This config will applay on
                    <div class="badge !mx-0 !mb-1 !mt-2 inline-block !py-0">
                        area m2
                    </div>
                    and
                    <div class="badge !mx-0 !my-0 inline-block !py-0">
                        rooms count
                    </div>
                </div>
            </div>

            <div class="flex-1">
                <Select
                    label="Price number separator"
                    :data="metaStore.separatorData"
                    v-model="chosenPriceSeparatorValue"
                />
            </div>
        </div>

        <div class="space-y-2">
            <Checkbox
                v-model="isPriceRoundedValue"
                title="Rounded Price"
                class="!w-fit"
            />

            <div v-if="!is_premium" class="border-b text-lg font-semibold">
                PREMIUM license
            </div>

            <Checkbox
                v-model="removeWatermarkValue"
                title="Remove watermark"
                :disabled="!is_premium"
                class="!w-fit"
            />

            <div v-if="!is_gold" class="border-b text-lg font-semibold">
                GOLD license
            </div>

            <div class="flex w-fit justify-between gap-2">
                <Checkbox
                    v-model="shareableLinkValue"
                    title="Create a shareable link"
                    :disabled="!is_gold"
                    class="w-fit"
                />

                <div
                    class="flex cursor-pointer justify-end"
                    @mouseenter="
                        exampleImage = PLUGIN_ASSETS_PATH + 'sharable-link.webp'
                    "
                    @mouseleave="exampleImage = ''"
                >
                    <Info />
                </div>
            </div>

            <div class="flex w-fit justify-between gap-2">
                <Checkbox
                    v-model="requestCallbackValue"
                    title="Allow clients fill request callback form"
                    :disabled="!is_gold"
                    class="w-fit"
                />

                <div
                    class="flex cursor-pointer justify-end"
                    @mouseenter="
                        exampleImage =
                            PLUGIN_ASSETS_PATH + 'requestCallback.webp'
                    "
                    @mouseleave="exampleImage = ''"
                >
                    <Info />
                </div>
            </div>

            <div
                v-if="requestCallbackValue"
                class="flex w-fit justify-between gap-2"
            >
                <Checkbox
                    v-model="redirectToCallbackUrlValue"
                    title="Redirect to specific URL after click callback button"
                    desc="URL must be added to the table fields modal"
                    :disabled="!is_gold"
                    class="w-fit"
                />

                <div
                    class="flex cursor-pointer justify-end"
                    @mouseenter="
                        exampleImage =
                            PLUGIN_ASSETS_PATH + 'redirectToCallbackUrl.webp'
                    "
                    @mouseleave="exampleImage = ''"
                >
                    <Info />
                </div>
            </div>

            <Checkbox
                v-model="receiveFormsOnEmailValue"
                title="Receive form requests on administrator email"
                :disabled="!is_gold"
                class="w-fit"
            />

            <p>
                You can see form responses
                <span
                    class="cursor-pointer font-semibold text-blue-700 underline"
                    @click="pushToFormResponsesPage"
                >
                    here</span
                >
            </p>

            <div
                v-if="!is360FlowDisabled"
                class="mt-3 rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3"
            >
                <div class="flex items-center justify-between gap-4">
                    <div class="space-y-1">
                        <p class="text-sm font-semibold text-gray-900">
                            360 view mode
                        </p>
                        <p class="min-w-max text-xs text-gray-400">
                            Use 360 images feature
                        </p>
                    </div>

                    <Toggle
                        v-model="is_360_flow"
                        @change="onToggle360FlowChange"
                    />
                </div>

                <Checkbox
                    v-model="pathsHoverFillValue"
                    title="SVG Path visible only on hover"
                    class="mt-4 w-fit"
                />
            </div>

            <div
                v-else
                class="relative mt-3 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
                <div class="mb-3 flex items-center justify-between">
                    <LicensePlanBadge plan="Building 360 Module" />

                    <span class="text-xl" aria-hidden="true">🔒</span>
                </div>
                <p class="mb-1 text-sm font-semibold text-gray-900">
                    360° View Mode requires the 360 Add-on.
                </p>
                <p class="mb-4 text-xs text-gray-500">
                    Activate the 360 Add-on to enable interactive 360° building
                    views with SVG polygon overlays.
                </p>
                <div
                    class="mb-4 cursor-pointer text-blue-400 hover:underline"
                    @click="pushToAddonsPage"
                >
                    Activate
                </div>
                <div class="flex items-center justify-between gap-4 opacity-50">
                    <Toggle :model-value="false" disabled />
                </div>
            </div>
        </div>
    </div>

    <Teleport to="#irep-vue-app">
        <Transition name="fade-in-out">
            <Modal
                :show="!!exampleImage"
                :show-close-btn="false"
                :is-preview="true"
            >
                <div>
                    <p class="!mb-2">Example image</p>
                    <img
                        :src="exampleImage"
                        class="max-h-[500px] w-full object-contain"
                    />
                </div>
            </Modal>
        </Transition>
    </Teleport>
</template>
