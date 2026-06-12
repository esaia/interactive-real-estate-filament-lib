type __VLS_Props = {
    activeView?: "360" | "floors";
    floors360FloorId?: string | null;
    floors360BlockId?: string | null;
};
type __VLS_PublicProps = {
    "showOnlyFilteredOnSvg"?: boolean;
} & __VLS_Props;
declare const _default: import('vue').DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:filteredFlatIds": (ids: ReadonlySet<string>) => any;
    "update:showOnlyFilteredOnSvg": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:filteredFlatIds"?: ((ids: ReadonlySet<string>) => any) | undefined;
    "onUpdate:showOnlyFilteredOnSvg"?: ((value: boolean) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    scrollAreaRef: HTMLDivElement;
}, HTMLDivElement>;
export default _default;
