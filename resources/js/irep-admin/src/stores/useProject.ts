import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { Image360Interface, imageInterface, PolygonDataCollection, ProjectInterface } from "../../types/components";
import { useMetaStore } from "./useMeta";
import ajaxAxios from "../utils/axios";
import { resetCanvasAfterSave } from "../composables/helpers";

export const useProjectStore = defineStore("project", () => {
  const metaStore = useMetaStore();

  const project = ref<ProjectInterface>();
  const projects = ref<ProjectInterface[]>();

  const id = ref();
  const title = ref("");
  const svg = ref("");
  const project_image = ref<imageInterface | null>(null);
  const slug = ref("");
  const polygon_data = ref<PolygonDataCollection[]>([]);
  const created_at = ref("");
  const updated_at = ref("");

  const images_360 = ref<Image360Interface[]>([]);
  const selected_360_image_index = ref<number>(0);
  const selected_360_image_key = ref<string>("");
  const is_360_flow = ref<boolean>(false);

  const svgRef = ref<HTMLDivElement | null>(null);
  const activeGroup = ref<SVGGElement | null>(null);

  const is_premium = computed(() => {
    return irePlugin.is_premium;
  });

  const is_gold = computed(() => {
    return irePlugin.is_gold;
  });

  const get360ImageKey = (image?: Image360Interface | null) => image?.img || "";

  const resolveSelected360ImageIndex = () => {
    if (!images_360.value.length) return -1;
    if (!selected_360_image_key.value) {
      return selected_360_image_index.value >= 0 && selected_360_image_index.value < images_360.value.length
        ? selected_360_image_index.value
        : 0;
    }

    const indexByKey = images_360.value.findIndex((image) => get360ImageKey(image) === selected_360_image_key.value);
    if (indexByKey !== -1) return indexByKey;

    return selected_360_image_index.value >= 0 && selected_360_image_index.value < images_360.value.length
      ? selected_360_image_index.value
      : 0;
  };

  const selected_360_image = computed(() => {
    const index = resolveSelected360ImageIndex();
    return index >= 0 ? images_360.value[index] : undefined;
  });

  const persist360SvgFromRef = (index = resolveSelected360ImageIndex()) => {
    if (index < 0 || !images_360.value[index]) return;

    const container = images_360.value[index].svgRef;
    if (!container) return;

    resetCanvasAfterSave(container);

    const svgElement = container?.querySelector("svg");

    if (!svgElement) return;

    images_360.value[index].svg = svgElement.outerHTML;
  };

  const setSelected360ImageIndex = (index: number) => {
    const normalizedIndex = Number(index);
    if (!Number.isInteger(normalizedIndex)) return;
    if (normalizedIndex < 0 || normalizedIndex >= images_360.value.length) return;
    const currentIndex = resolveSelected360ImageIndex();
    if (normalizedIndex === currentIndex) return;

    persist360SvgFromRef(currentIndex);

    if (currentIndex >= 0 && images_360.value[currentIndex]) {
      images_360.value[currentIndex].svgRef = null;
    }

    selected_360_image_index.value = normalizedIndex;
    selected_360_image_key.value = get360ImageKey(images_360.value[normalizedIndex]);
  };

  const syncSelected360ImageIdentity = () => {
    if (!images_360.value.length) {
      selected_360_image_index.value = 0;
      selected_360_image_key.value = "";
      return;
    }

    const resolvedIndex = resolveSelected360ImageIndex();
    if (resolvedIndex < 0) {
      selected_360_image_index.value = 0;
      selected_360_image_key.value = get360ImageKey(images_360.value[0]);
      return;
    }

    selected_360_image_index.value = resolvedIndex;
    selected_360_image_key.value = get360ImageKey(images_360.value[resolvedIndex]);
  };

  const addPolygonData = (key: string) => {
    if (!polygon_data.value.length) {
      polygon_data.value = [];
    }

    polygon_data.value = [...polygon_data.value, { id: "", key, type: "" }];
  };

  const add360PolygonData = (key: string) => {
    if (selected_360_image_index.value < 0 || !images_360.value[selected_360_image_index.value]) return;
    images_360.value[selected_360_image_index.value].polygon_data = [
      ...images_360.value[selected_360_image_index.value].polygon_data,
      { id: "", key, type: "" }
    ];
  };

  const editpoligonData = (key: string, updatedData: PolygonDataCollection) => {
    const index = polygon_data.value?.findIndex((polygon) => polygon.key === key);
    if (index !== -1) {
      polygon_data.value[index] = { ...polygon_data.value[index], ...updatedData };
    } else {
      console.error(`Polygon with id ${id.value} not found.`);
    }
  };

  const edit360PoligonData = (key: string, updatedData: PolygonDataCollection) => {
    if (selected_360_image_index.value < 0 || !images_360.value[selected_360_image_index.value]) return;

    const polygons = images_360.value[selected_360_image_index.value].polygon_data || [];
    const index = polygons.findIndex((polygon) => polygon.key === key);

    if (index !== -1) {
      polygons[index] = { ...polygons[index], ...updatedData };
    }
  };

  const removePoligonItem = (key: string) => {
    if (!key || !polygon_data.value) return;

    polygon_data.value = polygon_data.value.filter((item) => item.key !== key);
  };

  const remove360PolygonItem = (key: string) => {
    if (selected_360_image_index.value < 0 || !images_360.value[selected_360_image_index.value]) return;

    const polygons = images_360.value[selected_360_image_index.value].polygon_data || [];
    images_360.value[selected_360_image_index.value].polygon_data = polygons.filter((item) => item.key !== key);
  };

  const fetchProjects = async (projectID: string | null) => {
    const { data } = await ajaxAxios.post("", {
      action: "irep_get_projects",
      nonce: irePlugin.nonce,
      project_id: projectID
    });

    if (projectID && data.success && !data.data.length) {
      setProject(data?.data);
      project.value = data?.data;
      images_360.value = data?.data?.images_360 || [];
      syncSelected360ImageIdentity();
    } else {
      projects.value = data?.data;
    }
  };

  const setProject = (project: ProjectInterface) => {
    id.value = +project.id;
    title.value = project.title || "";
    svg.value = project.svg || "";
    project_image.value = project.project_image[0] || null;
    slug.value = project.slug || "";
    polygon_data.value = project.polygon_data || "";
    created_at.value = project.created_at || "";
    updated_at.value = project.updated_at || "";

    metaStore.getProjectMeta();
  };

  // Keep `is_360_flow` in sync with project meta.
  // The backend stores meta_value as a string, but we tolerate common boolean/string representations.
  watch(
    () => metaStore.projectMeta,
    () => {
      // On free tier, ignore `is_360_flow` meta even if it exists
      // (e.g. project was created on higher tier and later downgraded).
      // if (!irePlugin?.is_premium && !irePlugin?.is_gold) {
      //   is_360_flow.value = false;
      //   return;
      // }

      const raw = metaStore.getMeta("is_360_flow")?.meta_value;
      if (raw === undefined || raw === null || raw === "") return;

      if (typeof raw === "boolean") {
        is_360_flow.value = raw;
        return;
      }

      const normalized = String(raw).toLowerCase();
      if (normalized === "true" || normalized === "1") is_360_flow.value = true;
      else if (normalized === "false" || normalized === "0") is_360_flow.value = false;
    },
    { deep: true, immediate: true }
  );

  watch(
    images_360,
    () => {
      syncSelected360ImageIdentity();
    },
    { deep: true }
  );

  return {
    project,
    projects,
    id,
    title,
    svg,
    project_image,
    slug,
    polygon_data,
    created_at,
    updated_at,
    svgRef,
    activeGroup,
    addPolygonData,
    add360PolygonData,
    editpoligonData,
    edit360PoligonData,
    removePoligonItem,
    remove360PolygonItem,
    setProject,
    fetchProjects,
    images_360,
    selected_360_image_index,
    selected_360_image_key,
    selected_360_image,
    persist360SvgFromRef,
    setSelected360ImageIndex,
    syncSelected360ImageIdentity,
    is_360_flow,
    is_premium,
    is_gold
  };
});
