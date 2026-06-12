<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { generateUniqueId } from "../composables/helpers";
import { useProjectStore } from "../stores/useProject";
import { useFloorsStore } from "../stores/useFloors";
import { useBlocksStore } from "../stores/useBlock";

const emit = defineEmits(["setSvgRef", "setActiveG", "addPolygonData", "deleteG"]);

const props = defineProps({
  svgRef: HTMLDivElement | null,
  svg: String,
  activeGroup: SVGGElement | null
});

const projectStore = useProjectStore();
const floorsStore = useFloorsStore();
const blocksStore = useBlocksStore();

const {
  CIRCLE_COLOR,
  CIRCLE_RADIUS,
  CIRCLE_STROKE_COLOR,
  CIRCLE_STROKE_WIDTH,
  HOVER_CIRCLE_RADIUS,
  NON_SELECTED_PATH_COLOR,
  PATH_COLOR,
  SELECTED_PATH_COLOR,
  CIRCLE_HOVER_COLOR,
  FIRST_CIRCLE_COLOR,
  FIRST_CIRCLE_HOVER_COLOR
} = constants;

const svgCanvas = ref(null);
const points = ref([]);
const shapeClosed = ref(false);
const currentPath = ref(null);
const group = ref(null);
const firstCircle = ref(null);
const circleTarget = ref(null);
const updateMode = ref(false);
const draggedCircle = ref(null);
const isDragging = ref(false);
const zoomLevel = ref(1);
const lastCursorClientX = ref(0);
const lastCursorClientY = ref(0);
const panMode = ref(false);
const pan = ref(false);
const panOffsetX = ref(0);
const panOffsetY = ref(0);
const panStartClientX = ref(0);
const panStartClientY = ref(0);
const panStartOffsetX = ref(0);
const panStartOffsetY = ref(0);
const justFinishedPanning = ref(false);
const panDragStarted = ref(false);
const previewCircle = ref(null);
const copiedPolygon = ref(null);
const draggedGroup = ref(null);
const draggedPath = ref(null);
const isGroupDragging = ref(false);
const groupDragStartPoint = ref(null);
const groupDragPoints = ref([]);
const hasGroupDragged = ref(false);
const skipNextStrokeInsert = ref(false);
const updateUndoStack = ref([]);
const PREVIEW_CIRCLE_CLASS = "ire-path-preview-circle";
const PREVIEW_OPACITY = 0.5;
const STROKE_HIT_THRESHOLD = 4;
const PASTE_OFFSET = 10;

const ZOOM_TRANSITION_MS = 250;

const PAN_CURSOR_GRAB = "ire-pan-grab";
const PAN_CURSOR_GRABBING = "ire-pan-grabbing";

const setCanvasCursor = (cursor) => {
  if (!svgCanvas.value) return;
  const container = svgCanvas.value.parentElement;
  if (!container) return;
  container.classList.remove(PAN_CURSOR_GRAB, PAN_CURSOR_GRABBING);
  if (cursor === "grab") {
    container.classList.add(PAN_CURSOR_GRAB);
  } else if (cursor === "grabbing") {
    container.classList.add(PAN_CURSOR_GRABBING);
  }
  svgCanvas.value.style.cursor = cursor;
  container.style.cursor = cursor;
  const img = container.querySelector("img");
  const svg = container.querySelector("svg");
  if (img) img.style.cursor = cursor;
  if (svg) svg.style.cursor = cursor;
};

const clearContainerCursor = () => {
  const container = svgCanvas.value?.parentElement;
  if (!container) return;
  container.classList.remove(PAN_CURSOR_GRAB, PAN_CURSOR_GRABBING);
  container.style.cursor = "";
  const img = container.querySelector("img");
  const svg = container.querySelector("svg");
  if (img) img.style.cursor = "";
  if (svg) svg.style.cursor = "";
};
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.4;

const throttle = (fn, delay) => {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    fn(...args);
  };
};

const getSVGCoordinates = (event, svgElement) => {
  const svgPoint = svgElement.createSVGPoint();
  svgPoint.x = event.clientX;
  svgPoint.y = event.clientY;
  const svgMatrix = svgElement.getScreenCTM().inverse();
  const svgCoords = svgPoint.matrixTransform(svgMatrix);
  return { x: svgCoords.x, y: svgCoords.y };
};

const onCanvasClick = async (event) => {
  // Ignore the synthetic click fired after a drag-drop move.
  if (hasGroupDragged.value) {
    hasGroupDragged.value = false;
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (justFinishedPanning.value) {
    justFinishedPanning.value = false;
    return;
  }
  if (event.target.nodeName === "path" && points.value?.length === 0) {
    if (!updateMode.value || !currentPath.value || !event.target.isSameNode(currentPath.value)) {
      skipNextStrokeInsert.value = true;
    }
    onPathContextMenu(event);
    return;
  }

  if (shapeClosed.value || updateMode.value) return;

  const svg = svgCanvas.value.querySelector("svg");
  const svgRect = svg.getBoundingClientRect();
  const x = event.clientX - svgRect.left;
  const y = event.clientY - svgRect.top;
  const viewBox = svg.viewBox.baseVal;
  const svgX = (x / svgRect.width) * viewBox.width;
  const svgY = (y / svgRect.height) * viewBox.height;

  if (points.value.length > 2 && isCloseToFirstPoint(svgX, svgY, points.value[0])) {
    firstCircle.value.setAttribute("fill", "black");
    firstCircle.value.setAttribute("r", CIRCLE_RADIUS);

    closeShape();
    return;
  }

  if (points.value.length === 0) {
    group.value = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(group.value);

    currentPath.value = document.createElementNS("http://www.w3.org/2000/svg", "path");
    currentPath.value.setAttribute("fill", PATH_COLOR);
    currentPath.value.setAttribute("stroke", "black");
    currentPath.value.setAttribute("stroke-width", "1"); // path stroke always 1px (CIRCLE_STROKE_WIDTH is for circles only)
    group.value.appendChild(currentPath.value);

    firstCircle.value = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    firstCircle.value.setAttribute("cx", svgX);
    firstCircle.value.setAttribute("cy", svgY);
    firstCircle.value.setAttribute("r", CIRCLE_RADIUS);
    firstCircle.value.setAttribute("class", "first-circle");
    firstCircle.value.setAttribute("fill", CIRCLE_COLOR);
    firstCircle.value.setAttribute("stroke", CIRCLE_STROKE_COLOR);
    firstCircle.value.setAttribute("stroke-width", String(CIRCLE_STROKE_WIDTH));
    group.value.appendChild(firstCircle.value);
  } else if (!isCloseToFirstPoint(svgX, svgY, points.value[0])) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", svgX);
    circle.setAttribute("cy", svgY);
    circle.setAttribute("r", CIRCLE_RADIUS);
    circle.setAttribute("fill", CIRCLE_COLOR);
    circle.setAttribute("stroke", CIRCLE_STROKE_COLOR);
    circle.setAttribute("stroke-width", String(CIRCLE_STROKE_WIDTH));
    group.value.appendChild(circle);
  }

  points.value.push({ x: svgX, y: svgY });
};

const circleMouseMove = (event) => {
  if (event.target.nodeName === "circle" && event.target.parentNode.isSameNode(group.value)) {
    circleTarget.value = event.target;

    group.value.querySelectorAll("circle").forEach((circle) => {
      if (circle.isSameNode(event.target)) {
        animateRadius(circle, HOVER_CIRCLE_RADIUS, CIRCLE_HOVER_COLOR);
      } else {
        animateRadius(circle, CIRCLE_RADIUS, CIRCLE_COLOR);
      }
    });
  } else {
    if (circleTarget.value) {
      animateRadius(circleTarget.value, CIRCLE_RADIUS, CIRCLE_COLOR);
    }
  }
};

const throttledMouseMove = throttle((event) => {
  if (pan.value) {
    // Cursor already set on mousedown; skip to avoid flicker
  } else if (panMode.value) {
    setCanvasCursor("grab");
  } else {
    clearContainerCursor();
    if (svgCanvas.value) {
      if (event.target.nodeName === "path" && !points.value?.length) {
        svgCanvas.value.style.cursor = "pointer";
      } else {
        svgCanvas.value.style.cursor = "crosshair";
      }
    }
  }

  setCursorValues(event);

  if (pan.value) {
    const deltaX = event.clientX - panStartClientX.value;
    const deltaY = event.clientY - panStartClientY.value;
    panOffsetX.value = panStartOffsetX.value - deltaX;
    panOffsetY.value = panStartOffsetY.value - deltaY;
    applyTransform({ panOnly: true });
  }

  if (updateMode.value) {
    circleMouseMove(event);
    if (!draggedCircle.value) {
      const svg = svgCanvas.value?.querySelector("svg");
      if (svg && group.value && currentPath.value) {
        if (event.target?.tagName === "circle" && event.target?.parentNode?.isSameNode(group.value)) {
          hidePreview();
        } else {
          const { x, y } = getSVGCoordinates(event, svg);
          const circles = Array.from(group.value.querySelectorAll("circle")).filter(
            (c) => !c.classList.contains(PREVIEW_CIRCLE_CLASS)
          );
          if (circles.length >= 2) {
            const closest = getClosestPointOnPath(circles, x, y);
            if (closest.distance < STROKE_HIT_THRESHOLD) {
              showPreviewAt(closest.x, closest.y);
              svgCanvas.value.style.cursor = "pointer";
            } else {
              hidePreview();
            }
          } else {
            hidePreview();
          }
        }
      } else {
        hidePreview();
      }
    } else {
      hidePreview();
    }
  }
  if (shapeClosed.value || points.value.length === 0) return;

  const { x, y } = getSVGCoordinates(event, svgCanvas.value.querySelector("svg"));

  if (updateMode.value && draggedCircle.value) {
    draggedCircle.value.setAttribute("cx", x || 0);
    draggedCircle.value.setAttribute("cy", y || 0);
    updatePath();
  }

  let pathData = `M ${points.value[0].x} ${points.value[0].y}`;
  for (let i = 1; i < points.value.length; i++) {
    pathData += ` L ${points.value[i].x} ${points.value[i].y}`;
  }
  pathData += ` L ${x} ${y}`;
  currentPath.value.setAttribute("d", pathData);

  if (points.value.length > 1 && isCloseToFirstPoint(x, y, points.value[0])) {
    animateRadius(firstCircle.value, HOVER_CIRCLE_RADIUS, FIRST_CIRCLE_HOVER_COLOR);
  } else {
    animateRadius(firstCircle.value, CIRCLE_RADIUS, FIRST_CIRCLE_COLOR);
  }
}, 10);

const onPathContextMenu = (event, activeGroup) => {
  circleTarget.value = null;
  updateUndoStack.value = [];

  if (points.value.length) return;

  if (event) {
    event.preventDefault();
    updateMode.value = event.target.nodeName === "path";
    group.value = event.target.parentNode;

    if (updateMode.value) {
      emit("setActiveG", group.value);
    }
  } else if (activeGroup) {
    updateMode.value = true;
    group.value = activeGroup;
  } else {
    updateMode.value = false;
  }

  if (firstCircle.value) return;

  const circles = svgCanvas.value.querySelectorAll("g circle");
  const paths = svgCanvas.value.querySelectorAll("g path");

  circles.forEach((circle) => {
    if (updateMode.value) {
      circle.style.cursor = "pointer";
    } else {
      circle.style.cursor = "default";
    }

    if (circle.parentNode.isSameNode(group.value)) {
      circle.setAttribute("fill", updateMode.value ? CIRCLE_COLOR : "#00000000");
      if (updateMode.value) {
        circle.setAttribute("stroke", CIRCLE_STROKE_COLOR);
        circle.setAttribute("stroke-width", String(CIRCLE_STROKE_WIDTH));
      } else {
        circle.removeAttribute("stroke");
        circle.removeAttribute("stroke-width");
      }
    } else {
      circle.setAttribute("fill", "#00000000");
      circle.removeAttribute("stroke");
      circle.removeAttribute("stroke-width");
    }
  });

  paths.forEach((path) => {
    const parentGroup = path.parentNode;
    if (parentGroup.isSameNode(group.value) && updateMode.value) {
      path.setAttribute("fill", SELECTED_PATH_COLOR);
      currentPath.value = path;
      svgCanvas.value?.querySelector("svg").appendChild(group.value);
    } else {
      path.setAttribute("fill", updateMode.value ? NON_SELECTED_PATH_COLOR : PATH_COLOR);
    }
  });

  if (updateMode.value) {
    hidePreview();
    clearContainerCursor();
    svgCanvas.value.style.cursor = "pointer";
    svgCanvas.value.addEventListener("click", onPathStrokeClick);
  } else {
    svgCanvas.value.removeEventListener("click", onPathStrokeClick);
    hidePreview();
    clearContainerCursor();
    svgCanvas.value.style.cursor = "crosshair";

    emit("setActiveG", null);
  }
};

const onCircleMouseDown = (event) => {
  if (event.button !== 0) return;
  const svg = svgCanvas.value?.querySelector("svg");
  if (!svg) return;

  if (event.target.tagName === "circle") {
    if (!updateMode.value || !currentPath.value) return;
    const parentG = event.target.parentNode;
    if (!parentG.isSameNode(currentPath.value.parentNode)) return;
    pushUndoSnapshot();
    draggedCircle.value = event.target;
    isDragging.value = true;
    event.preventDefault();
    return;
  }

  if (event.target.tagName === "path" && points.value.length === 0) {
    const activeGroup = event.target.parentNode;
    if (!activeGroup) return;
    const circles = Array.from(activeGroup.querySelectorAll("circle")).filter(
      (c) => !c.classList.contains(PREVIEW_CIRCLE_CLASS)
    );
    if (!circles.length) return;
    pushUndoSnapshot(activeGroup);
    const { x, y } = getSVGCoordinates(event, svg);
    draggedGroup.value = activeGroup;
    draggedPath.value = event.target;
    isGroupDragging.value = true;
    hasGroupDragged.value = false;
    groupDragStartPoint.value = { x, y };
    groupDragPoints.value = circles.map((circle) => ({
      circle,
      x: parseFloat(circle.getAttribute("cx") || "0"),
      y: parseFloat(circle.getAttribute("cy") || "0")
    }));
    event.preventDefault();
  }
};

const onCircleMouseUp = (event) => {
  if (isGroupDragging.value) {
    isGroupDragging.value = false;
    draggedGroup.value = null;
    draggedPath.value = null;
    groupDragStartPoint.value = null;
    groupDragPoints.value = [];
    if (hasGroupDragged.value) {
      event.preventDefault();
      return;
    }
  }

  if (event.target.nodeName === "svg" && updateMode.value) {
    const svg = svgCanvas.value?.querySelector("svg");
    if (svg && group.value && currentPath.value) {
      const { x, y } = getSVGCoordinates(event, svg);
      const circles = Array.from(group.value.querySelectorAll("circle")).filter(
        (c) => !c.classList.contains(PREVIEW_CIRCLE_CLASS)
      );
      if (circles.length >= 2) {
        const closest = getClosestPointOnPath(circles, x, y);
        if (closest.distance < STROKE_HIT_THRESHOLD) {
          return;
        }
      }
    }
    setTimeout(() => {
      onPathContextMenu(undefined, undefined);
    }, 100);
    return;
  }

  if (!updateMode.value) return;

  draggedCircle.value = null;
  isDragging.value = false;
  hasGroupDragged.value = false;
  event.preventDefault();
};

const onCircleDoubleClick = (event) => {
  if (!updateMode.value) return;
  if (event.target.tagName !== "circle") return;
  const parentG = event.target.parentNode;
  if (!parentG || !group.value || !parentG.isSameNode(group.value)) return;
  if (event.target.classList.contains(PREVIEW_CIRCLE_CLASS)) return;

  const circles = Array.from(group.value.querySelectorAll("circle")).filter(
    (c) => !c.classList.contains(PREVIEW_CIRCLE_CLASS)
  );
  if (circles.length <= 3) return;

  pushUndoSnapshot();
  event.target.remove();
  updatePath();
};

const onCircleMouseMoveWhileDragging = (event) => {
  if (isGroupDragging.value && draggedGroup.value && groupDragStartPoint.value) {
    const svg = svgCanvas.value?.querySelector("svg");
    if (!svg) return;
    const { x, y } = getSVGCoordinates(event, svg);
    const dx = x - groupDragStartPoint.value.x;
    const dy = y - groupDragStartPoint.value.y;
    hasGroupDragged.value = Math.abs(dx) > 0 || Math.abs(dy) > 0;
    groupDragPoints.value.forEach(({ circle, x: startX, y: startY }) => {
      circle.setAttribute("cx", String(startX + dx));
      circle.setAttribute("cy", String(startY + dy));
    });
    updatePathFor(draggedGroup.value, draggedPath.value);
    event.preventDefault();
    return;
  }

  if (!updateMode.value) return;
  if (!isDragging.value || !draggedCircle.value) return;

  const { x, y } = getSVGCoordinates(event, svgCanvas.value.querySelector("svg"));

  draggedCircle.value.setAttribute("cx", x);
  draggedCircle.value.setAttribute("cy", y);
  updatePath();
  event.preventDefault();
};

const updatePath = () => {
  updatePathFor(group.value, currentPath.value);
};

const updatePathFor = (targetGroup, targetPath) => {
  if (!targetGroup || !targetPath) return;
  const circles = Array.from(targetGroup.querySelectorAll("circle")).filter(
    (c) => !c.classList.contains(PREVIEW_CIRCLE_CLASS)
  );
  if (circles.length === 0) return;

  let pathData = `M ${circles[0].getAttribute("cx")} ${circles[0].getAttribute("cy")}`;
  circles.forEach((circle, index) => {
    if (index > 0) {
      pathData += ` L ${circle.getAttribute("cx")} ${circle.getAttribute("cy")}`;
    }
  });
  pathData += " Z";
  targetPath.setAttribute("d", pathData);
};

function closestPointOnSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.sqrt(dx * dx + dy * dy) || 1e-9;
  let t = ((px - ax) * dx + (py - ay) * dy) / (len * len);
  t = Math.max(0, Math.min(1, t));
  const qx = ax + t * dx;
  const qy = ay + t * dy;
  const dist = Math.sqrt((px - qx) ** 2 + (py - qy) ** 2);
  return { x: qx, y: qy, distance: dist };
}

function getClosestPointOnPath(circles, px, py) {
  const n = circles.length;
  if (n < 2) return { x: px, y: py, distance: Infinity, segmentIndex: 0 };
  let best = { x: px, y: py, distance: Infinity, segmentIndex: 0 };
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const ax = parseFloat(circles[i].getAttribute("cx"));
    const ay = parseFloat(circles[i].getAttribute("cy"));
    const bx = parseFloat(circles[j].getAttribute("cx"));
    const by = parseFloat(circles[j].getAttribute("cy"));
    const result = closestPointOnSegment(px, py, ax, ay, bx, by);
    if (result.distance < best.distance) {
      best = { ...result, segmentIndex: i };
    }
  }
  return best;
}

function ensurePreviewCircle() {
  const svg = svgCanvas.value?.querySelector("svg");
  if (!svg) return null;
  if (previewCircle.value && svg.contains(previewCircle.value)) {
    svg.appendChild(previewCircle.value);
    return previewCircle.value;
  }
  previewCircle.value = null;
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("r", CIRCLE_RADIUS);
  circle.setAttribute("fill", CIRCLE_COLOR);
  circle.setAttribute("stroke", CIRCLE_STROKE_COLOR);
  circle.setAttribute("stroke-width", String(CIRCLE_STROKE_WIDTH));
  circle.setAttribute("opacity", String(PREVIEW_OPACITY));
  circle.setAttribute("class", PREVIEW_CIRCLE_CLASS);
  circle.style.pointerEvents = "none";
  circle.style.visibility = "hidden";
  svg.appendChild(circle);
  previewCircle.value = circle;
  return circle;
}

function showPreviewAt(x, y) {
  const el = ensurePreviewCircle();
  if (!el) return;
  el.setAttribute("cx", x);
  el.setAttribute("cy", y);
  el.style.visibility = "visible";
}

function hidePreview() {
  if (previewCircle.value) {
    previewCircle.value.style.visibility = "hidden";
  }
}

function onPathStrokeClick(event) {
  if (skipNextStrokeInsert.value) {
    skipNextStrokeInsert.value = false;
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  if (hasGroupDragged.value) {
    hasGroupDragged.value = false;
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  if (!group.value || !currentPath.value) return;
  if (event.target?.tagName === "circle" && event.target?.parentNode?.isSameNode(group.value)) return;
  const svg = svgCanvas.value?.querySelector("svg");
  if (!svg) return;
  const { x, y } = getSVGCoordinates(event, svg);
  const circles = Array.from(group.value.querySelectorAll("circle")).filter(
    (c) => !c.classList.contains(PREVIEW_CIRCLE_CLASS)
  );
  if (circles.length < 2) return;
  const closest = getClosestPointOnPath(circles, x, y);
  if (closest.distance >= STROKE_HIT_THRESHOLD) return;
  pushUndoSnapshot();
  const newCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  newCircle.setAttribute("cx", closest.x);
  newCircle.setAttribute("cy", closest.y);
  newCircle.setAttribute("r", CIRCLE_RADIUS);
  newCircle.setAttribute("fill", CIRCLE_COLOR);
  newCircle.setAttribute("stroke", CIRCLE_STROKE_COLOR);
  newCircle.setAttribute("stroke-width", String(CIRCLE_STROKE_WIDTH));
  newCircle.style.cursor = "pointer";
  const refNode = circles[closest.segmentIndex].nextSibling;
  group.value.insertBefore(newCircle, refNode);
  updatePath();
  event.preventDefault();
  event.stopPropagation();
}

const isCloseToFirstPoint = (x, y, firstPoint) => {
  const dx = x - firstPoint.x;
  const dy = y - firstPoint.y;
  return Math.sqrt(dx * dx + dy * dy) < 10 / zoomLevel.value;
};

const closeShape = () => {
  shapeClosed.value = true;
  const circles = group.value.querySelectorAll("circle");
  let pathData = `M ${circles[0].getAttribute("cx")} ${circles[0].getAttribute("cy")}`;
  circles.forEach((circle, index) => {
    if (index > 0) {
      pathData += ` L ${circle.getAttribute("cx")} ${circle.getAttribute("cy")}`;
    }
  });

  pathData += " Z";
  currentPath.value.setAttribute("d", pathData);
  circles.forEach((c) => {
    c.setAttribute("fill", "#00000000");
    c.removeAttribute("stroke");
    c.removeAttribute("stroke-width");
  });

  svgCanvas.value.removeEventListener("click", onCanvasClick);
  svgCanvas.value.removeEventListener("mousemove", throttledMouseMove);

  const generatedKey = generateUniqueId();

  group.value.setAttribute("id", generatedKey);

  emit("addPolygonData", generatedKey);

  resetShape();
};

const resetShape = () => {
  points.value = [];
  shapeClosed.value = false;
  group.value = null;
  currentPath.value = null;
  firstCircle.value = null;

  svgCanvas.value.addEventListener("click", onCanvasClick);
  svgCanvas.value.addEventListener("mousemove", throttledMouseMove);
};

const pushUndoSnapshot = (targetGroup) => {
  const g = targetGroup || group.value;
  if (!g) return;
  updateUndoStack.value.push({ g, html: g.innerHTML });
  if (updateUndoStack.value.length > 20) updateUndoStack.value.shift();
};

const applyUpdateUndo = () => {
  if (!updateUndoStack.value.length) return;
  const { g, html } = updateUndoStack.value.pop();
  if (!g || !g.parentNode) return;
  g.innerHTML = html;
  if (g === group.value) {
    currentPath.value = group.value.querySelector("path");
  }
};

const undoLastDrawingPoint = () => {
  if (points.value.length === 0 || shapeClosed.value) return;
  if (points.value.length === 1) {
    group.value && group.value.remove();
    resetShape();
    return;
  }
  const allCircles = Array.from(group.value.querySelectorAll("circle"));
  const lastCircle = allCircles[allCircles.length - 1];
  if (lastCircle) lastCircle.remove();
  points.value.pop();
};

const animateRadius = (element, targetRadius, color = "black") => {
  const currentRadius = parseFloat(element.getAttribute("r"));
  const step = (targetRadius - currentRadius) / 5;
  let currentStep = 0;

  element.setAttribute("fill", color);

  function animateStep() {
    currentStep++;
    const newRadius = currentRadius + step * currentStep;
    element.setAttribute("r", newRadius);

    if (currentStep < 5) {
      requestAnimationFrame(animateStep);
    }
  }

  animateStep();
};

const setCursorValues = (event) => {
  lastCursorClientX.value = event.clientX;
  lastCursorClientY.value = event.clientY;
};

const onDocumentKeydown = (event) => {
  const isInputFocused = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
  const hasCommandKey = event.ctrlKey || event.metaKey;

  if (event.key === "Escape") {
    if (points.value.length > 0 && !shapeClosed.value) {
      group.value && group.value.remove();
      resetShape();
    } else if (updateMode.value) {
      onPathContextMenu(undefined, undefined);
    }
  }

  if (!isInputFocused && (event.key === "Delete" || event.key === "Backspace")) {
    if (points.value.length > 0 && !shapeClosed.value) {
      group.value && group.value.remove();
      resetShape();
    } else if (updateMode.value && group.value) {
      const key = group.value.getAttribute("id");
      group.value.remove();
      updateUndoStack.value = [];
      updateMode.value = false;
      group.value = null;
      currentPath.value = null;
      emit("setActiveG", null);
      if (key) emit("deleteG", key);
    }
  }

  if (hasCommandKey && !isInputFocused && event.key.toLowerCase() === "z") {
    event.preventDefault();
    if (points.value.length > 0 && !shapeClosed.value) {
      undoLastDrawingPoint();
    } else if (updateUndoStack.value.length > 0) {
      applyUpdateUndo();
    }
    return;
  }

  if (hasCommandKey && !isInputFocused) {
    if (event.key.toLowerCase() === "c" && updateMode.value && group.value) {
      event.preventDefault();
      copiedPolygon.value = group.value.cloneNode(true);
      return;
    } else if (event.key.toLowerCase() === "v" && copiedPolygon.value) {
      event.preventDefault();

      const svg = svgCanvas.value?.querySelector("svg");
      if (!svg) return;

      onPathContextMenu(undefined, undefined);

      const pastedGroup = copiedPolygon.value.cloneNode(true);
      const circles = Array.from(pastedGroup.querySelectorAll("circle"));

      circles.forEach((circle) => {
        const x = parseFloat(circle.getAttribute("cx") || "0");
        const y = parseFloat(circle.getAttribute("cy") || "0");
        circle.setAttribute("cx", String(x + PASTE_OFFSET));
        circle.setAttribute("cy", String(y + PASTE_OFFSET));
      });

      const pastedPath = pastedGroup.querySelector("path");
      if (pastedPath) {
        const d = pastedPath.getAttribute("d") || "";
        const translatedPath = d.replace(
          /(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g,
          (_, x, y) => `${parseFloat(x) + PASTE_OFFSET} ${parseFloat(y) + PASTE_OFFSET}`
        );
        pastedPath.setAttribute("d", translatedPath);
      }

      const generatedKey = generateUniqueId();
      pastedGroup.setAttribute("id", generatedKey);
      svg.appendChild(pastedGroup);
      emit("addPolygonData", generatedKey);
      onPathContextMenu(undefined, pastedGroup);
      return;
    }
  }

  if (hasCommandKey) {
    if (event.key === "=") {
      event.preventDefault();
      const container = props.svgRef?.parentElement?.parentElement ?? svgCanvas.value?.parentElement;
      const currentZoom = zoomLevel.value;
      const nextZoom = Math.min(currentZoom + ZOOM_STEP, ZOOM_MAX);
      if (nextZoom !== currentZoom && container) {
        const rect = container.getBoundingClientRect();
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w && h) {
          const cx = lastCursorClientX.value - rect.left;
          const cy = lastCursorClientY.value - rect.top;
          const ratio = nextZoom / currentZoom;
          panOffsetX.value -= (cx - w / 2) * (1 - ratio);
          panOffsetY.value -= (cy - h / 2) * (1 - ratio);
        }
        zoomLevel.value = nextZoom;
        applyTransform({ smooth: true });
      }
    } else if (event.key === "-") {
      event.preventDefault();
      resetZoom();
    }
  }

  if (event.key === " " && !isInputFocused) {
    event.preventDefault();
    panMode.value = true;
    setCanvasCursor("grab");
  }
};

const onDocumentKeyUp = (event) => {
  if (event.key === " ") {
    panMode.value = false;
    pan.value = false;
    clearContainerCursor();
    if (svgCanvas.value) svgCanvas.value.style.cursor = "crosshair";
  }
};

const onCanvasPanMouseDown = (event) => {
  if (!panMode.value || event.button !== 0) return;
  event.preventDefault();
  panDragStarted.value = true;
  panStartClientX.value = event.clientX;
  panStartClientY.value = event.clientY;
  panStartOffsetX.value = panOffsetX.value;
  panStartOffsetY.value = panOffsetY.value;
  pan.value = true;
  setCanvasCursor("grabbing");
};

const onDocumentPanMouseUp = () => {
  if (pan.value || panDragStarted.value) {
    justFinishedPanning.value = true;
  }
  pan.value = false;
  panDragStarted.value = false;
  if (panMode.value) {
    setCanvasCursor("grab");
  } else {
    clearContainerCursor();
    if (svgCanvas.value) svgCanvas.value.style.cursor = "crosshair";
  }
};

const applyTransform = (options = {}) => {
  const { smooth = false, panOnly = false } = options;
  const container = props.svgRef?.parentElement?.parentElement;
  if (!container) return;
  const imgElement = container.querySelector("img");
  const svgElement = container.querySelector("svg");
  if (!imgElement || !svgElement) return;

  const tx = panOffsetX.value;
  const ty = panOffsetY.value;
  const scale = zoomLevel.value;
  const transform = `translate(${-tx}px, ${-ty}px) scale(${scale})`;

  let originX = "50%";
  let originY = "50%";
  if (!panOnly && options.originAtCursor) {
    const rect = container.getBoundingClientRect();
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w && h) {
      originX = ((options.originAtCursor.x - rect.left) / w) * 100 + "%";
      originY = ((options.originAtCursor.y - rect.top) / h) * 100 + "%";
    }
  }

  const transitionValue = smooth ? `transform ${ZOOM_TRANSITION_MS}ms ease-out` : "none";
  imgElement.style.transition = transitionValue;
  svgElement.style.transition = transitionValue;
  imgElement.style.transform = transform;
  imgElement.style.transformOrigin = `${originX} ${originY}`;
  svgElement.style.transform = transform;
  svgElement.style.transformOrigin = `${originX} ${originY}`;
};

const resetZoom = () => {
  const container = props.svgRef?.parentElement?.parentElement;
  if (!container) return;

  const imgElement = container.querySelector("img");
  const svgElement = container.querySelector("svg");
  if (!imgElement || !svgElement) return;

  panOffsetX.value = 0;
  panOffsetY.value = 0;
  zoomLevel.value = 1;

  imgElement.style.transition = `transform ${ZOOM_TRANSITION_MS}ms ease-out`;
  svgElement.style.transition = `transform ${ZOOM_TRANSITION_MS}ms ease-out`;
  imgElement.style.transform = "translate(0px, 0px) scale(1)";
  svgElement.style.transform = "translate(0px, 0px) scale(1)";
  imgElement.style.transformOrigin = "center center";
  svgElement.style.transformOrigin = "center center";
};

const onExternalCanvasReset = () => {
  resetZoom();
};

const addListeners = () => {
  if (svgCanvas.value) {
    svgCanvas.value.addEventListener("click", onCanvasClick);
    svgCanvas.value.addEventListener("mousemove", throttledMouseMove);
    svgCanvas.value.addEventListener("contextmenu", onPathContextMenu);
    svgCanvas.value.addEventListener("mousedown", onCanvasPanMouseDown);
    svgCanvas.value.addEventListener("mousedown", onCircleMouseDown);
    svgCanvas.value.addEventListener("mouseup", onCircleMouseUp);
    svgCanvas.value.addEventListener("mousemove", onCircleMouseMoveWhileDragging);
    svgCanvas.value.addEventListener("dblclick", onCircleDoubleClick);
    svgCanvas.value.addEventListener("ire-canvas-reset", onExternalCanvasReset);
  }
  document.addEventListener("keydown", onDocumentKeydown);
  document.addEventListener("keyup", onDocumentKeyUp);
  document.addEventListener("mouseup", onDocumentPanMouseUp);
};

const removeListeners = () => {
  if (svgCanvas.value) {
    svgCanvas.value.removeEventListener("click", onCanvasClick);
    svgCanvas.value.removeEventListener("mousemove", throttledMouseMove);
    svgCanvas.value.removeEventListener("contextmenu", onPathContextMenu);
    svgCanvas.value.removeEventListener("mousedown", onCanvasPanMouseDown);
    svgCanvas.value.removeEventListener("mousedown", onCircleMouseDown);
    svgCanvas.value.removeEventListener("mouseup", onCircleMouseUp);
    svgCanvas.value.removeEventListener("mousemove", onCircleMouseMoveWhileDragging);
    svgCanvas.value.removeEventListener("dblclick", onCircleDoubleClick);
    svgCanvas.value.removeEventListener("ire-canvas-reset", onExternalCanvasReset);
  }
  document.removeEventListener("keydown", onDocumentKeydown);
  document.removeEventListener("keyup", onDocumentKeyUp);
  document.removeEventListener("mouseup", onDocumentPanMouseUp);
};

const setSvgViewBox = () => {
  if (!svgCanvas.value) return;
  const svg = svgCanvas.value.querySelector("svg");
  const viewBox = svg.viewBox?.baseVal;
  const width = svgCanvas.value.clientWidth;
  const height = svgCanvas.value.clientHeight;
  if (!width || !height) return;
  const imgRatio = width / height;
  const svgRatio = viewBox?.width && viewBox?.height ? viewBox.width / viewBox.height : NaN;
  const ratioMismatch = !Number.isFinite(svgRatio) || Math.abs(imgRatio - svgRatio) >= 0.01;
  if (ratioMismatch) {
    const newWidth = 1000;
    svg.setAttribute("viewBox", `0 0 ${newWidth} ${newWidth / imgRatio}`);
  }
};

watch(
  () => props.activeGroup,
  (group) => onPathContextMenu(undefined, group)
);

watch(
  () => [projectStore.project_image, floorsStore?.activeFloor?.floor_image, blocksStore?.activeBlock?.block_image],
  () => setTimeout(setSvgViewBox, 500),
  { deep: true }
);

watch(
  () => props.svg,
  () => {
    // When parent stops remounting Canvas (no :key), refresh listeners/ref on SVG content swap.
    removeListeners();
    nextTick(() => {
      if (!svgCanvas.value) return;
      emit("setSvgRef", svgCanvas.value);
      addListeners();
      setTimeout(setSvgViewBox, 50);
    });
  }
);

onMounted(() => {
  setTimeout(() => {
    emit("setSvgRef", svgCanvas.value);
    addListeners();
  }, 700);
});

onBeforeUnmount(() => {
  removeListeners();
});

defineExpose({
  zoomLevel,
  setSvgViewBox,
  resetZoom
});
</script>

<template>
  <div class="[&_svg]:h-full [&_svg]:w-full">
    <div v-if="!svg" ref="svgCanvas" class="svg-canvas-container">
      <svg></svg>
    </div>

    <div v-else v-html="svg" ref="svgCanvas" :key="projectStore.svg" class="svg-canvas-container"></div>
  </div>
</template>

<style>
.ire-pan-grab,
.ire-pan-grab * {
  cursor: grab !important;
}
.ire-pan-grabbing,
.ire-pan-grabbing * {
  cursor: grabbing !important;
}
</style>
