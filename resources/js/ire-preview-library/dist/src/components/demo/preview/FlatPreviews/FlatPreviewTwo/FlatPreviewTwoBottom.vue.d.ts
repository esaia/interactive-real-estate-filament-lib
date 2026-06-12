import { FlatItem, FloorItem } from '../../../../../types/DemoTypes';
type __VLS_Props = {
    flat: FlatItem | undefined;
    floors?: FloorItem[] | undefined;
    showCallbackButton: boolean;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    showForm: () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onShowForm?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
