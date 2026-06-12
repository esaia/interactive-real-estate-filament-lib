import { PolygonDataCollection, ProjectInterface } from '../../../types/DemoTypes';
type __VLS_Props = {
    project: ProjectInterface;
    sensitivity?: number;
    snapDurationMs?: number;
    /** When true, SVG polygon fills are transparent until the parent g is hovered. */
    pathsFillOnHoverOnly?: boolean;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    changeComponent: (type: "" | "flat" | "floor" | "block" | "tooltip", polygon: PolygonDataCollection | null) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChangeComponent?: ((type: "" | "flat" | "floor" | "block" | "tooltip", polygon: PolygonDataCollection | null) => any) | undefined;
}>, {
    sensitivity: number;
    snapDurationMs: number;
    pathsFillOnHoverOnly: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    uiToggleRef: HTMLDivElement;
    containerRef: HTMLDivElement;
    canvasRef: HTMLCanvasElement;
    svgRef: HTMLDivElement;
}, HTMLDivElement>;
export default _default;
