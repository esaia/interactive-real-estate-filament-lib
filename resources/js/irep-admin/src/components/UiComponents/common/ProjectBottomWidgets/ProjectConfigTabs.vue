<script setup lang="ts">
import { onMounted, ref, watch, type Component } from "vue";
import StylesTab from "@components/UiComponents/common/ProjectBottomWidgets/StylesTab.vue";
import ProjectsConfigTab from "@components/UiComponents/common/ProjectBottomWidgets/ProjectsConfigTab.vue";
import TooltipModalsTab from "@components/UiComponents/common/ProjectBottomWidgets/TooltipModalsTab.vue";
import InfoTab from "@components/UiComponents/common/ProjectBottomWidgets/InfoTab.vue";
import Button from "@components/UiComponents/form/Button.vue";
import ProjectConfigIcon from "@components/UiComponents/icons/ProjectConfigIcon.vue";
import ShortcodesIcon from "@components/UiComponents/icons/ShortcodesIcon.vue";
import StyleColorsIcon from "@components/UiComponents/icons/StyleColorsIcon.vue";
import Info from "@components/UiComponents/icons/Info.vue";
import { resetCanvasAfterSave, showToast, toBase64 } from "@/src/composables/helpers";
import { useProjectStore } from "@/src/stores/useProject";
import { useMetaStore } from "@/src/stores/useMeta";
import { storeToRefs } from "pinia";
import ajaxAxios from "@/src/utils/axios";
import { imageInterface, ProjectSettings } from "@/types/components";
import ShortcodesConfigTab from "@components/UiComponents/common/ProjectBottomWidgets/ShortcodesConfigTab.vue";
import ModalIcon from "@components/UiComponents/icons/ModalIcon.vue";
import FlatIcon from "@components/UiComponents/icons/FlatIcon.vue";
import CustomStatusManager from "@components/UiComponents/flats/CustomStatusManager.vue";

const TABS = [
  {
    id: 1,
    title: "Project Configs",
    icon: ProjectConfigIcon as Component
  },

  {
    id: 2,
    title: "Shortcodes",
    icon: ShortcodesIcon as Component
  },

  {
    id: 3,
    title: "Style & Colors",
    icon: StyleColorsIcon as Component
  },
  {
    id: 4,
    title: "Tooltip & modals",
    icon: ModalIcon as Component
  },
  {
    id: 5,
    title: "Manage Custom Types",
    icon: FlatIcon as Component
  },
  {
    id: 6,
    title: "Info",
    icon: Info as Component
  }
];

const showPreview = defineModel<boolean>({ required: true });

const projectStore = useProjectStore();
const metaStore = useMetaStore();

const { id, title, slug, polygon_data, svgRef, activeGroup, project_image, is_360_flow, images_360 } =
  storeToRefs(projectStore);

const activeTab = ref(1);
const loading = ref(false);

const projectTitle = ref("");
const projectImage = ref<imageInterface[] | null>(null);

const projectConfig = ref<ProjectSettings>({
  chosenTooltip: "1",
  chooseFlatPreview: "1",
  chooseFlatPreviewOneStyle: "1",
  chosenCurrency: { title: "🇺🇸 USD - $", value: "usd" },
  chosenArea: { title: "m", value: "m" },
  chosenPriceSeparator: { title: "dot (.)", value: "dot" },
  chosenSeparator: { title: "dot (.)", value: "dot" },
  isPriceRounded: false,
  requestCallback: false,
  redirectToCallbackUrl: false,
  receiveFormsOnEmail: false,
  shareableLink: false,
  removeWatermark: false,
  pathsHoverFill: false
});

const styleColors = ref({
  available_flat: "",
  path: "",
  path_hover: "",
  stroke: "",
  primary: "",
  stroke_width: 0,
  border_radius: 0
});

const updateProject = async () => {
  // if (!svgRef.value) return;

  const metas = [
    { key: "tooltip", value: projectConfig.value.chosenTooltip },
    { key: "flat_preview", value: projectConfig.value.chooseFlatPreview },
    { key: "flat_preview_one_style", value: projectConfig.value.chooseFlatPreviewOneStyle },
    { key: "currency", value: projectConfig.value.chosenCurrency.value },
    { key: "area_unit", value: projectConfig.value.chosenArea.value },
    { key: "price_separator", value: projectConfig.value.chosenPriceSeparator.value },
    { key: "separator", value: projectConfig.value.chosenSeparator.value },
    { key: "price_rounded", value: projectConfig.value.isPriceRounded },
    { key: "redirect_to_callback_url", value: projectConfig.value.redirectToCallbackUrl },
    { key: "request_callback", value: projectConfig.value.requestCallback },
    { key: "receive_forms_on_email", value: projectConfig.value.receiveFormsOnEmail },
    { key: "shareable_link", value: projectConfig.value.shareableLink },
    { key: "remove_watermark", value: projectConfig.value.removeWatermark },
    { key: "paths_hover_fill", value: projectConfig.value.pathsHoverFill }
  ];

  const styleMetas = Object.entries(styleColors.value).reduce(
    (arr, [key, value]) => {
      if (key === "stroke_width" || key === "border_radius") {
        arr.push({ key, value });
      } else {
        arr.push({ key: `${key}_color`, value });
      }
      return arr;
    },
    [] as { key: string; value: any }[]
  );

  metaStore.setProjectMeta([...styleMetas, ...metas]);

  if (svgRef.value) {
    resetCanvasAfterSave(svgRef.value);
  }

  let images360Payload = images_360.value;
  if (is_360_flow.value) {
    images360Payload = await Promise.all(
      images_360.value.map(async (item) => {
        if (!item.svgRef) {
          return { ...item };
        }

        resetCanvasAfterSave(item.svgRef);

        const svgElement = item.svgRef.querySelector("svg");
        if (!svgElement) {
          return { ...item };
        }

        const svgBase64 = await toBase64(svgElement);

        return {
          ...item,
          svg: svgBase64
        };
      })
    );
  }

  const svgElement = svgRef.value?.querySelector("svg");

  const svgBase64 = await toBase64(svgElement);

  const params: any = {
    project_id: id.value,
    title: projectTitle.value,
    slug: slug.value,
    svg: svgBase64,
    polygon_data: polygon_data.value,
    images_360: JSON.stringify(images360Payload)
  };

  if (project_image.value) {
    params.project_image = JSON.stringify([project_image.value]);
  }

  loading.value = true;

  try {
    const { data } = await ajaxAxios.post("", {
      action: "irep_update_project",
      nonce: irePlugin.nonce,
      ...params
    });

    if (data?.success) {
      activeGroup.value = null;
      showToast("success", "Project Updated!");
    } else {
      showToast("error", "Something went wrong!");
    }
  } catch (error) {
    showToast("error", "Something went wrong!");
  }

  loading.value = false;
};

watch(
  () => showPreview.value,
  () => {
    if (!showPreview.value) {
      projectStore.fetchProjects(projectStore.id);
    }
  }
);

watch(
  () => projectImage.value,
  (nextValue) => {
    if (nextValue?.[0]) {
      project_image.value = nextValue[0];
    }
  }
);

watch(
  () => projectTitle.value,
  (nextTitle) => {
    title.value = nextTitle;
  }
);

watch(
  () => metaStore.projectMeta,
  () => {
    projectConfig.value.chosenTooltip = metaStore.getMeta("tooltip")?.meta_value.toString() || "1";
    projectConfig.value.chooseFlatPreview = metaStore.getMeta("flat_preview")?.meta_value.toString() || "1";
    projectConfig.value.chooseFlatPreviewOneStyle = metaStore.getMeta("flat_preview_one_style")?.meta_value.toString() || "1";

    const activeCurrency = metaStore.getMeta("currency")?.meta_value.toString() || "usd";
    const foundCurrency = metaStore.currencyData.find((item) => item.value === activeCurrency);
    if (foundCurrency) {
      projectConfig.value.chosenCurrency = foundCurrency;
    }

    const foundArea = metaStore.areaSelectData.find(
      (item) => item.value === metaStore.getMeta("area_unit")?.meta_value
    );
    if (foundArea) {
      projectConfig.value.chosenArea = foundArea;
    }

    const foundSeparator = metaStore.separatorData.find(
      (item) => item.value === metaStore.getMeta("separator")?.meta_value
    );
    if (foundSeparator) {
      projectConfig.value.chosenSeparator = foundSeparator;
    }

    const savedPriceSep =
      metaStore.getMeta("price_separator")?.meta_value?.toString() ??
      metaStore.getMeta("separator")?.meta_value?.toString();
    const foundPriceSeparator = metaStore.separatorData.find((item) => item.value === savedPriceSep);
    if (foundPriceSeparator) {
      projectConfig.value.chosenPriceSeparator = foundPriceSeparator;
    }

    projectConfig.value.isPriceRounded = metaStore.getMeta("price_rounded")?.meta_value === "true";
    projectConfig.value.requestCallback = metaStore.getMeta("request_callback")?.meta_value === "true";
    projectConfig.value.redirectToCallbackUrl = metaStore.getMeta("redirect_to_callback_url")?.meta_value === "true";
    projectConfig.value.receiveFormsOnEmail = metaStore.getMeta("receive_forms_on_email")?.meta_value === "true";
    projectConfig.value.shareableLink = metaStore.getMeta("shareable_link")?.meta_value === "true";
    projectConfig.value.removeWatermark = metaStore.getMeta("remove_watermark")?.meta_value === "true";
    projectConfig.value.pathsHoverFill = metaStore.getMeta("paths_hover_fill")?.meta_value === "true";

    styleColors.value.available_flat = metaStore.getMeta("available_flat_color")?.meta_value.toString() || "";
    styleColors.value.path = metaStore.getMeta("path_color")?.meta_value.toString() || "";
    styleColors.value.path_hover = metaStore.getMeta("path_hover_color")?.meta_value.toString() || "";
    styleColors.value.stroke = metaStore.getMeta("stroke_color")?.meta_value.toString() || "";
    styleColors.value.primary = metaStore.getMeta("primary_color")?.meta_value.toString() || "";
    styleColors.value.stroke_width = Number(metaStore.getMeta("stroke_width")?.meta_value) || 0;
    styleColors.value.border_radius = Number(metaStore.getMeta("border_radius")?.meta_value) || 0;
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  projectTitle.value = title.value || "";
  projectImage.value = project_image.value?.id ? [project_image.value] : null;
});

defineExpose({
  showPreview
});
</script>

<template>
  <div class="mt-8 flex bg-white">
    <div class="w-[300px] border border-gray-200 bg-gray-50">
      <div class="flex flex-col gap-1">
        <button
          v-for="(tab, index) in TABS"
          :key="tab.id"
          type="button"
          class="group flex w-full items-center gap-3 border-y px-3 py-2.5 text-left text-sm font-medium transition-colors"
          :class="
            tab.id === activeTab
              ? 'border-gray-200 bg-gray-100 text-blue-600'
              : 'border-transparent bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          "
          @click="activeTab = tab.id"
        >
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors"
            :class="
              tab.id === activeTab ? 'bg-gray-200 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
            "
          >
            <component
              :is="tab.icon"
              class="h-4 w-4"
              :class="
                tab.id === activeTab
                  ? {
                      '[&_path]:stroke-blue-600 [&_rect]:stroke-blue-600': [4].includes(index),
                      '[&_path]:fill-blue-600 [&_rect]:fill-blue-600': ![4].includes(index)
                    }
                  : {
                      '[&_path]:stroke-gray-400 [&_rect]:stroke-gray-400': [4].includes(index),
                      '[&_path]:fill-gray-400 [&_rect]:fill-gray-400': ![4].includes(index)
                    }
              "
            />
          </span>
          <span>{{ tab.title }}</span>
        </button>
      </div>
    </div>
    <div class="flex-1 bg-white p-4">
      <div class="mb-4 flex items-center justify-between gap-4">
        <p class="text-2xl font-semibold text-gray-900">{{ TABS[activeTab - 1]?.title }}</p>

        <div class="flex gap-4">
          <Button v-if="!is_360_flow" title="Preview" outlined @click="showPreview = true" class="w-fit" />
          <Button title="Update" @click="updateProject" :loading="loading" />
        </div>
      </div>

      <ProjectsConfigTab
        v-if="activeTab === 1"
        v-model="projectConfig"
        v-model:title="projectTitle"
        v-model:projectImage="projectImage"
      />

      <ShortcodesConfigTab v-if="activeTab === 2" />
      <StylesTab v-if="activeTab === 3" v-model:colors="styleColors" />
      <TooltipModalsTab v-if="activeTab === 4" v-model="projectConfig" />
      <CustomStatusManager v-if="activeTab === 5" />
      <InfoTab v-if="activeTab === 6" />
    </div>
  </div>
</template>
