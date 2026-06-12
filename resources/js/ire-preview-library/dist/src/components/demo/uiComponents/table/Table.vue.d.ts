type __VLS_Props = {
    data: any;
    rowClickHandler?: (row: any) => void;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    sortColumn: (field: string, sortOrder: "" | "desc" | "asc") => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSortColumn?: ((field: string, sortOrder: "" | "desc" | "asc") => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
