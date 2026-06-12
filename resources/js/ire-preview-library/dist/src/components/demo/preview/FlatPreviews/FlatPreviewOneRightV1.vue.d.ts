import { FlatItem } from '../../../../types/DemoTypes';
type __VLS_Props = {
    flat: FlatItem | undefined;
    showForm: boolean;
    showCallbackButton: boolean;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    requestCallback: () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onRequestCallback?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
