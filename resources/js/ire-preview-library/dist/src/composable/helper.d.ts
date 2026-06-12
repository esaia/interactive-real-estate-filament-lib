export declare const tr: (key: string) => any;
export declare const currencySymbol: () => string;
export declare const getPrice: (price: number) => string;
export declare const getArea: (area: string) => string;
export declare const getRoomCount: (roomCount: string) => string;
export declare const getAreaUnitLabel: () => any;
export declare const getBlockById: (id: number) => import('../types/DemoTypes').BlockItem | undefined;
export declare const getFloorById: (id: number) => import('../types/DemoTypes').FloorItem | undefined;
export declare const setQuery: (key: string, value: string) => void;
export declare const getQuery: (key: string) => string | null;
export declare const copyToClipboard: (text: string) => Promise<boolean>;
export declare const getNested: (obj: any, path: string) => any;
export declare const getConfValue: (conf: string) => any;
export declare const getCustomTypeColor: (conf: string) => any;
export declare const transformOtherToKeyValue: (other: {
    key?: string;
    value?: unknown;
}[]) => Record<string, unknown>;
export declare const normalizeFilterOptionsMeta: (raw: unknown) => Record<string, unknown>;
export declare const normalizeRangeOption: (raw: unknown, fallback: {
    min: number;
    max: number;
    step: number;
}) => {
    min: number;
    max: number;
    step: number;
};
