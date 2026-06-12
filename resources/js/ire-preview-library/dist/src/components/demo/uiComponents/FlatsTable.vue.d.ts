import { FlatItem } from '../../../types/DemoTypes';
type __VLS_Props = {
    flats: FlatItem[];
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    openFlat: (flatId: string) => any;
    sortColumn: (field: string, sortOrder: "" | "desc" | "asc") => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onOpenFlat?: ((flatId: string) => any) | undefined;
    onSortColumn?: ((field: string, sortOrder: "" | "desc" | "asc") => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
