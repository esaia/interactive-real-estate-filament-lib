import { ActionItem, BlockItem, FlatItem, FloorItem } from '../../../types/DemoTypes';
type __VLS_Props = {
    flats: FlatItem[] | undefined;
    floor: FloorItem;
    floors: FloorItem[];
    blocks?: BlockItem[];
    actions: ActionItem[] | undefined;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    changeComponent: (flow: "" | "flat" | "floor" | "block" | "project", hoveredData: any) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChangeComponent?: ((flow: "" | "flat" | "floor" | "block" | "project", hoveredData: any) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    svgRef: HTMLDivElement;
}, HTMLDivElement>;
export default _default;
