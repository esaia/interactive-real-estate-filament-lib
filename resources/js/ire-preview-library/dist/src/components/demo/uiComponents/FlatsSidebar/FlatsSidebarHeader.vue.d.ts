type __VLS_Props = {
    hideFloorRange?: boolean;
};
type __VLS_PublicProps = {
    "filtersObject": {
        areaRange: [number, number];
        floorRange: [number, number];
        roomRange: [number, number];
        config: string;
    };
} & __VLS_Props;
declare const _default: import('vue').DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:filtersObject": (value: {
        areaRange: [number, number];
        floorRange: [number, number];
        roomRange: [number, number];
        config: string;
    }) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:filtersObject"?: ((value: {
        areaRange: [number, number];
        floorRange: [number, number];
        roomRange: [number, number];
        config: string;
    }) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
