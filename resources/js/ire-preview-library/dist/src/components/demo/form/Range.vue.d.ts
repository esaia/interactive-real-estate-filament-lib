interface Props {
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    label?: string;
    isPrice?: boolean;
}
type __VLS_Props = Props;
type __VLS_PublicProps = {
    modelValue?: [number, number];
} & __VLS_Props;
declare const _default: import('vue').DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: [number, number]) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: [number, number]) => any) | undefined;
}>, {
    label: string;
    step: number;
    min: number;
    max: number;
    unit: string;
    isPrice: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    trackRef: HTMLDivElement;
}, HTMLDivElement>;
export default _default;
