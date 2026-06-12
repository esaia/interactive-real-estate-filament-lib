type __VLS_Props = {
    /** Exposed on the switch for screen readers */
    ariaLabel?: string;
    /** Native title tooltip */
    title?: string;
    disabled?: boolean;
};
type __VLS_PublicProps = {
    modelValue?: boolean;
} & __VLS_Props;
declare const _default: import('vue').DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, {
    disabled: boolean;
    ariaLabel: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
