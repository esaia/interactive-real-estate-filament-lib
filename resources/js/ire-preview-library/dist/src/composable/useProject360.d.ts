import { ImageInterface360, PolygonDataCollection } from '../types/DemoTypes';
import { Ref } from 'vue';
export interface UseProject360Options {
    frames: Ref<ImageInterface360[]>;
    sensitivity: Ref<number>;
    snapDurationMs: Ref<number>;
    containerRef: Ref<HTMLDivElement | null>;
    canvasRef: Ref<HTMLCanvasElement | null>;
    svgRef: Ref<HTMLDivElement | null>;
    onPolygonClick?: (polygon: PolygonDataCollection, type: string) => void;
    /** When true, flat polygons not in `svgVisibleFlatIds` are hidden in the overlay SVG. */
    svgFlatFilterActive?: Ref<boolean>;
    svgVisibleFlatIds?: Ref<ReadonlySet<string>>;
}
export declare function useProject360(options: UseProject360Options): {
    total: import('vue').ComputedRef<number>;
    frame: Ref<number, number>;
    renderFrame: Ref<number, number>;
    settledFrame: Ref<number, number>;
    isDragging: Ref<boolean, boolean>;
    isAnimating: Ref<boolean, boolean>;
    hoveredData: Ref<any, any>;
    activePolygonType: Ref<"" | "flat" | "floor" | "block" | "tooltip", "" | "flat" | "floor" | "block" | "tooltip">;
    currentSvg: import('vue').ComputedRef<string>;
    onPointerDown: (e: PointerEvent) => void;
    snapToNearestWithPolygons: (direction: -1 | 0 | 1) => void;
    focusFlatOnViewer: (flatId: string) => void;
};
