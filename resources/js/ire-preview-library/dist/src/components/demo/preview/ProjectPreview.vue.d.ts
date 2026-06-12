import { ActionItem, BlockItem, FlatItem, FloorItem, ProjectInterface, ProjectMeta } from '../../../types/DemoTypes';
type __VLS_Props = {
    project: ProjectInterface | undefined;
    floors: FloorItem[] | undefined;
    blocks: BlockItem[] | undefined;
    flats: FlatItem[] | undefined;
    actions: ActionItem[] | undefined;
    projectMeta: ProjectMeta[] | undefined;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    changeComponent: (flowComponent: "" | "flat" | "floor" | "block" | "tooltip", hoveredData: any) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChangeComponent?: ((flowComponent: "" | "flat" | "floor" | "block" | "tooltip", hoveredData: any) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    svgRef: HTMLDivElement;
}, HTMLDivElement>;
export default _default;
