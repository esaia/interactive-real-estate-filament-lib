import { ActionItem, BlockItem, FlatItem, FloorItem } from '../../../types/DemoTypes';
type __VLS_Props = {
    flats: FlatItem[];
    floors: FloorItem[];
    blocks: BlockItem[];
    actions: ActionItem[] | undefined;
    svgFlatFilterActive?: boolean;
    svgVisibleFlatIds?: ReadonlySet<string>;
    focusFlatId?: string | null;
    pathsVisible?: boolean;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    svgRef: HTMLDivElement;
    floorListRef: HTMLDivElement;
}, HTMLDivElement>;
export default _default;
