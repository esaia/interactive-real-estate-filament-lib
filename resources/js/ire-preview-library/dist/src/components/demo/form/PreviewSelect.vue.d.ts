import { selectDataItem } from '../../../types/DemoTypes';
type __VLS_Props = {
    data: selectDataItem[];
    placeholder?: string;
    label?: string;
    clearable?: boolean;
    required?: boolean;
    disabled?: boolean;
};
type __VLS_PublicProps = {
    modelValue?: any;
} & __VLS_Props;
declare const _default: import('vue').DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: any) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: any) => any) | undefined;
}>, {
    label: string;
    placeholder: string;
    clearable: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
