import { FlatItem, FloorItem } from '../../../types/DemoTypes';
type __VLS_Props = {
    flat: FlatItem | undefined;
    floors?: FloorItem[] | undefined;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    changeComponent: (flow: "" | "flat" | "floor" | "block" | "project", hoveredData: any) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChangeComponent?: ((flow: "" | "flat" | "floor" | "block" | "project", hoveredData: any) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
