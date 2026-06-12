import { ToastProps, useToast } from "vue-toast-notification";
import { useBlocksStore } from "../stores/useBlock";
import { useFloorsStore } from "../stores/useFloors";

export const generateUniqueId = (length = 14) => {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let uniqueId = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueId += characters[randomIndex];
  }
  return "ui" + uniqueId;
};

export const irep_transformSvgString = (svgString: string) => {
  // Remove backslashes and unescape characters
  // let transformedSvg = svgString
  //   .replace(/\\/g, "") // Remove backslashes
  //   .replace(/&amp;/g, "&") // Unescape HTML entities
  //   .replace(/(\s)([a-zA-Z0-9-]+)=""/g, '$1$2=""'); // Fix empty attributes if any

  // Ensure the SVG element is properly formatted
  // transformedSvg = transformedSvg
  //   .replace(/<svg[^>]*>/, (match) =>
  //     match.replace(/class="[^"]*"/, 'class="canvas-svg absolute left-0 top-0 cursor-crosshair"')
  //   )
  //   .replace(/&lt;/g, "<") // Unescape <
  //   .replace(/&gt;/g, ">") // Unescape >
  //   .replace(/&quot;/g, '"'); // Unescape "

  return svgString;
};

export const resetCanvasAfterSave = (svgRef: HTMLDivElement) => {
  const { CIRCLE_RADIUS, PATH_COLOR } = constants;

  svgRef.dispatchEvent(new CustomEvent("ire-canvas-reset"));

  const imgElement = svgRef?.parentElement?.parentElement?.querySelector("img");
  const svg = svgRef.querySelector("svg");

  if (imgElement) {
    imgElement.style.transform = "scale(1)";
  }

  if (svg) {
    svg.style.transform = "scale(1)";

    const g = svgRef.querySelectorAll("g");

    g.forEach((gtag) => {
      if (!gtag.getAttribute("id")) {
        gtag.remove();
      }
    });

    const circles = svg.querySelectorAll("circle");
    circles.forEach((circle) => {
      if (circle.classList.contains("ire-path-preview-circle")) return;
      circle.setAttribute("fill", "#00000000");
      circle.setAttribute("r", CIRCLE_RADIUS.toString());
      circle.removeAttribute("stroke");
      circle.removeAttribute("stroke-width");
    });

    const paths = svg.querySelectorAll("path");
    paths.forEach((path) => {
      path.setAttribute("fill", PATH_COLOR);
      path.setAttribute("stroke", "black");
      path.setAttribute("stroke-width", "1");
    });
  }
};

export const getFloorTitleById = (id: number) => {
  const floorsStore = useFloorsStore();

  if (!id) return;
  return floorsStore.projectFloors?.find((floor) => floor.id === id?.toString())?.floor_number;
};

export const getBlockTitleById = (id: number) => {
  const blocksStore = useBlocksStore();

  if (!id) return;
  return blocksStore.projectBlocks?.find((block) => block.id === id?.toString())?.title;
};

export function showToast(type: "success" | "error", message: string) {
  const $toast = useToast();

  const options: ToastProps = {
    position: "top"
  };

  if (type === "success") {
    $toast.success(message, options);
  } else if (type === "error") {
    $toast.error(message, options);
  }
}

export const pushToPlansPage = () => {};

export const pushToAddonsPage = () => {};

export const toBase64 = async (svgElement: SVGSVGElement | null | undefined) => {
  if (!svgElement) return "";

  // Clone SVG to avoid modifying the original DOM
  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

  // Remove preview circle(s) before encoding
  const previewCircles = clonedSvg.querySelectorAll(".ire-path-preview-circle");
  previewCircles.forEach((circle) => circle.remove());

  const svgHTML = clonedSvg.outerHTML;
  const encoder = new TextEncoder();
  const bytes = encoder.encode(svgHTML);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary) || "";
};

export const setQuery = (key: string, value: string) => {
  // @ts-ignore
  const url = new URL(window.location);
  if (value === "") {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  window.history.pushState({}, "", url);
};

/** Price-history add-on: `irePlugin.price_history_addon` from Freemius `is_addon_activated`. */
export const hasPriceHistoryAddon = () => {
  return Boolean((irePlugin as typeof irePlugin & { price_history_addon?: boolean }).price_history_addon);
};
