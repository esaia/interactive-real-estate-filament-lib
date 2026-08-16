import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import {
  Image360Interface,
  imageInterface,
  PolygonDataCollection,
  ProjectInterface,
  ProjectViewInterface
} from "../../types/components";
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

  /* ── Additional views ──────────────────────────────────────────────────
   * `views` holds views 2..N; view 1 is the project's own image/svg/polygons.
   * `selected_view_index` is 0 for view 1, 1 for views[0], and so on — it
   * decides which image the canvas edits.
   */
  const views = ref<ProjectViewInterface[]>([]);
  const view_label = ref("");
  const mobile_image = ref<imageInterface | null>(null);
  const mobile_svg = ref("");
  const mobile_polygon_data = ref<PolygonDataCollection[]>([]);
  const mobileSvgRef = ref<HTMLDivElement | null>(null);
  const selected_view_index = ref(0);
  /** A mobile image is a different crop, so it is drawn on separately. */
  const selected_view_mode = ref<"desktop" | "mobile">("desktop");
  const mobile_breakpoint = ref(768);

  const selected_view = computed(() =>
    selected_view_index.value > 0 ? views.value[selected_view_index.value - 1] : undefined
  );

  const isMobileMode = computed(() => selected_view_mode.value === "mobile");

  /** Image, markup and polygons of whatever the canvas is currently editing. */
  const activeCanvas = computed(() => {
    const view = selected_view.value;

    if (!view) {
      return isMobileMode.value
        ? { image: mobile_image.value, svg: mobile_svg.value, polygon_data: mobile_polygon_data.value }
        : { image: project_image.value, svg: svg.value, polygon_data: polygon_data.value };
    }

    return isMobileMode.value
      ? { image: view.mobile_image, svg: view.mobile_svg, polygon_data: view.mobile_polygon_data }
      : { image: view.image, svg: view.svg, polygon_data: view.polygon_data };
  });

  const setActiveSvgRef = (container: HTMLDivElement | null) => {
    const view = selected_view.value;

    if (!view) {
      if (isMobileMode.value) mobileSvgRef.value = container;
      else svgRef.value = container;
      return;
    }

    if (isMobileMode.value) view.mobileSvgRef = container;
    else view.svgRef = container;
  };

  /**
   * Snapshot the live canvas markup of one slot into the store. Only one canvas
   * is mounted at a time, so this must run before switching away or the drawing
   * is lost on the way back.
   */
  const persistSvgFromRef = (index = selected_view_index.value, mode = selected_view_mode.value) => {
    const view = index > 0 ? views.value[index - 1] : undefined;
    const container = view
      ? mode === "mobile"
        ? view.mobileSvgRef
        : view.svgRef
      : mode === "mobile"
        ? mobileSvgRef.value
        : svgRef.value;

    const svgElement = container?.querySelector("svg");
    if (!container || !svgElement) return;

    resetCanvasAfterSave(container);
    const markup = svgElement.outerHTML;

    if (view) {
      if (mode === "mobile") view.mobile_svg = markup;
      else view.svg = markup;
      return;
    }

    if (mode === "mobile") mobile_svg.value = markup;
    else svg.value = markup;
  };

  /** Kept for the existing callers that only ever save view 1's desktop canvas. */
  const persistMainSvgFromRef = () => persistSvgFromRef(0, "desktop");
  const persistViewSvgFromRef = (index = selected_view_index.value) => persistSvgFromRef(index, "desktop");

  const clearSvgRef = (index: number, mode: "desktop" | "mobile") => {
    const view = index > 0 ? views.value[index - 1] : undefined;

    if (view) {
      if (mode === "mobile") view.mobileSvgRef = null;
      else view.svgRef = null;
      return;
    }

    if (mode === "mobile") mobileSvgRef.value = null;
    else svgRef.value = null;
  };

  const selectView = (index: number, mode: "desktop" | "mobile" = "desktop") => {
    if (!Number.isInteger(index) || index < 0 || index > views.value.length) return;
    if (index === selected_view_index.value && mode === selected_view_mode.value) return;

    persistSvgFromRef();
    clearSvgRef(selected_view_index.value, selected_view_mode.value);

    selected_view_index.value = index;
    selected_view_mode.value = mode;
    activeGroup.value = null;
  };

  const setSelectedViewIndex = (index: number) => selectView(index, "desktop");

  const setActivePolygons = (polygons: PolygonDataCollection[]) => {
    const view = selected_view.value;

    if (!view) {
      if (isMobileMode.value) mobile_polygon_data.value = polygons;
      else polygon_data.value = polygons;
      return;
    }

    if (isMobileMode.value) view.mobile_polygon_data = polygons;
    else view.polygon_data = polygons;
  };

  const addViewPolygonData = (key: string) => {
    setActivePolygons([...(activeCanvas.value.polygon_data || []), { id: "", key, type: "" }]);
  };

  const editViewPolygonData = (key: string, updatedData: PolygonDataCollection) => {
    const polygons = [...(activeCanvas.value.polygon_data || [])];
    const index = polygons.findIndex((polygon) => polygon.key === key);
    if (index === -1) return;

    polygons[index] = { ...polygons[index], ...updatedData };
    setActivePolygons(polygons);
  };

  const removeViewPolygonItem = (key: string) => {
    setActivePolygons((activeCanvas.value.polygon_data || []).filter((item) => item.key !== key));
  };

  const addViews = (images: imageInterface[]) => {
    views.value = [
      ...views.value,
      ...images.map((image) => ({
        label: "",
        image,
        mobile_image: null,
        svg: "",
        polygon_data: [],
        mobile_svg: "",
        mobile_polygon_data: [],
        svgRef: null,
        mobileSvgRef: null
      }))
    ];
  };

  const removeView = (index: number) => {
    if (index < 0 || index >= views.value.length) return;

    persistSvgFromRef();
    views.value = views.value.filter((_, i) => i !== index);

    // Keep the canvas on a view that still exists.
    if (selected_view_index.value > views.value.length) {
      selected_view_index.value = views.value.length;
      selected_view_mode.value = "desktop";
    }
    activeGroup.value = null;
  };

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
    mobile_image.value = project.mobile_image?.[0] || null;
    mobile_svg.value = project.mobile_svg || "";
    mobile_polygon_data.value = project.mobile_polygon_data || [];
    view_label.value = project.view_label || "";
    views.value = (project.views || []).map((view) => ({
      label: view?.label || "",
      image: view?.image || null,
      mobile_image: view?.mobile_image || null,
      svg: view?.svg || "",
      polygon_data: view?.polygon_data || [],
      mobile_svg: view?.mobile_svg || "",
      mobile_polygon_data: view?.mobile_polygon_data || [],
      svgRef: null,
      mobileSvgRef: null
    }));
    selected_view_index.value = 0;
    selected_view_mode.value = "desktop";
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

      const breakpoint = Number(metaStore.getMeta("mobile_breakpoint")?.meta_value);
      if (Number.isFinite(breakpoint) && breakpoint > 0) {
        mobile_breakpoint.value = breakpoint;
      }

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
    views,
    view_label,
    mobile_image,
    mobile_svg,
    mobile_polygon_data,
    mobileSvgRef,
    selected_view_index,
    selected_view_mode,
    selected_view,
    isMobileMode,
    activeCanvas,
    mobile_breakpoint,
    selectView,
    setSelectedViewIndex,
    setActiveSvgRef,
    persistSvgFromRef,
    persistViewSvgFromRef,
    persistMainSvgFromRef,
    addViewPolygonData,
    editViewPolygonData,
    removeViewPolygonItem,
    addViews,
    removeView,
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
