<script setup lang="ts">
import Canvas from "@components/Canvas.vue";
import { storeToRefs } from "pinia";
import { useProjectStore } from "@/src/stores/useProject";
import ModalBoxes from "@components/UiComponents/projects/ModalBoxes.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useFloorsStore } from "../stores/useFloors";
import { useTypesStore } from "../stores/useTypes";
import { useFlatsStore } from "../stores/useFlats";
import { useBlocksStore } from "../stores/useBlock";
import { useActionsStore } from "../stores/useActions";
import ShortCode from "../components/ShortcodeComponents/ShortCode.vue";
import Loading from "../components/UiComponents/common/Loading.vue";
import Advertisements from "../components/UiComponents/common/advertisements.vue";
import ProjectConfigTabs from "../components/UiComponents/common/ProjectBottomWidgets/ProjectConfigTabs.vue";
import Button from "../components/UiComponents/form/Button.vue";
import Upload360Images from "../components/UiComponents/projects/Upload360Images.vue";
import AdditionalViews from "../components/UiComponents/projects/AdditionalViews.vue";
const projectStore = useProjectStore();
const floorsStore = useFloorsStore();
const blockStore = useBlocksStore();
const typesStore = useTypesStore();
const flatsStore = useFlatsStore();
const actionsStore = useActionsStore();

const {
    polygon_data,
    activeGroup,
    svgRef,
    svg,
    id,
    project_image,
    is_360_flow,
    selected_360_image,
    images_360,
    selected_360_image_index,
    selected_view,
    selected_view_index,
    selected_view_mode,
    activeCanvas,
    mobileSvgRef,
} = storeToRefs(projectStore);

const loading = ref(true);
const showPreview = ref(false);
const canvasKey = ref(0);

const is360FlowDisabled = computed(() => !irePlugin?.building_360_addon);

const fetchAllData = async () => {
    const projectId = Number(id.value);
    loading.value = true;

    await Promise.all([
        projectStore.fetchProjects(String(projectId)),
        floorsStore.fetchProjectFloors(projectId),
        blockStore.fetchProjectBLocks(projectId),
        typesStore.fetchProjectTypes(projectId),
        flatsStore.fetchProjectFlats(projectId),
        actionsStore.fetchProjectActions(projectId),
    ]);

    loading.value = false;
    canvasKey.value++;
};

const exitPreview = async () => {
    showPreview.value = false;
    await fetchAllData();
};

// The canvas ref of whatever the editor is drawing on right now.
const activeSvgRef = computed(() => {
    const view = selected_view.value;
    if (!view) {
        return selected_view_mode.value === "mobile" ? mobileSvgRef.value : svgRef.value;
    }

    return selected_view_mode.value === "mobile" ? view.mobileSvgRef : view.svgRef;
});

const deleteG = (key: string) => {
    activeGroup.value = null;
    if (is_360_flow.value && selected_360_image.value) {
        projectStore.remove360PolygonItem(key);
        selected_360_image.value.svgRef?.querySelector(`#${key}`)?.remove();
        return;
    }

    projectStore.removeViewPolygonItem(key);
    activeSvgRef.value?.querySelector(`#${key}`)?.remove();
};

const setSelected360SvgRef = (svgContainer: any) => {
    projectStore.syncSelected360ImageIdentity();
    if (
        selected_360_image_index.value < 0 ||
        !images_360.value[selected_360_image_index.value]
    )
        return;
    images_360.value[selected_360_image_index.value].svgRef = svgContainer;
};

watch(
    () => selected_360_image_index.value,
    () => {
        activeGroup.value = null;
    },
);

onMounted(fetchAllData);
</script>

<template>
    <div v-if="loading" class="p-3">
        <Loading />
    </div>

    <div v-else class="container-fluid">
        <ShortCode v-if="showPreview" :project-id="projectStore.id" />

        <Canvas
            v-else-if="is_360_flow && selected_360_image && !is360FlowDisabled"
            :key="`${canvasKey}-${selected_360_image?.img || selected_360_image_index}`"
            :projectImage="selected_360_image?.img || ''"
            :polygon_data="selected_360_image.polygon_data"
            :svgRef="selected_360_image.svgRef"
            :svg="selected_360_image.svg"
            :activeGroup="activeGroup"
            :isFloorsCanvas="false"
            @set-svg-ref="setSelected360SvgRef"
            @set-active-g="(gTag: any) => (activeGroup = gTag)"
            @delete-g="(key: any) => deleteG(key)"
            @add-polygon-data="
                (key: any) => projectStore.add360PolygonData(key)
            "
            @update-polygon-data="
                (key: any, data: any) =>
                    projectStore.edit360PoligonData(key, data)
            "
        />

        <!-- One canvas for whichever view (and desktop/mobile image) is selected -->
        <Canvas
            v-else
            :key="`${canvasKey}-${selected_view_index}-${selected_view_mode}`"
            :projectImage="activeCanvas.image?.url || ''"
            :polygon_data="activeCanvas.polygon_data"
            :svgRef="activeSvgRef"
            :svg="activeCanvas.svg"
            :activeGroup="activeGroup"
            :isFloorsCanvas="false"
            @set-svg-ref="
                (svgContainer: any) => projectStore.setActiveSvgRef(svgContainer)
            "
            @set-active-g="(gTag: any) => (activeGroup = gTag)"
            @delete-g="(key: any) => deleteG(key)"
            @add-polygon-data="(key: any) => projectStore.addViewPolygonData(key)"
            @update-polygon-data="
                (key: any, data: any) =>
                    projectStore.editViewPolygonData(key, data)
            "
        />

        <div v-if="showPreview" class="mt-8 flex justify-end">
            <Button
                title="Exit Preview"
                outlined
                @click="exitPreview"
                class="w-fit"
            />
        </div>

        <Upload360Images
            v-if="!showPreview && is_360_flow && !is360FlowDisabled"
            title="Upload images for 360 view"
            required
            multiple
        />

        <AdditionalViews v-if="!showPreview && !is_360_flow" />

        <ModalBoxes v-if="!showPreview" />

        <ProjectConfigTabs v-if="!showPreview" v-model="showPreview" />
    </div>
</template>
