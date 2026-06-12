export interface constants {
    CIRCLE_RADIUS: number;
    HOVER_CIRCLE_RADIUS: number;
    PATH_COLOR: string;
    SELECTED_PATH_COLOR: string;
    NON_SELECTED_PATH_COLOR: string;
    CIRCLE_COLOR: string;
    CIRCLE_HOVER_COLOR: string;
    PREVIEW_PATH_COLOR: string;
    PREVIEW_PATH_HOVER_COLOR: string;
    PREVIEW_RESERVED_COLOR: string;
    PREVIEW_SOLD_COLOR: string;
    PREVIEW_STROKE_COLOR: string;
    PREVIEW_STROKE_WIDTH: number;
}
interface Compat {
    item: string;
    meta: string;
}
interface Sizes {
    thumbnail: Thumbnail;
    medium: Thumbnail;
    large: Thumbnail;
    full: Thumbnail;
}
interface Thumbnail {
    height: number;
    width: number;
    url: string;
    orientation: string;
}
interface Nonces {
    update: string;
    delete: string;
    edit: string;
}
export interface imageInterface {
    id: number;
    title: string;
    filename: string;
    url: string;
    link: string;
    alt: string;
    author: string;
    description: string;
    caption: string;
    name: string;
    status: string;
    uploadedTo: number;
    date: string;
    modified: string;
    menuOrder: number;
    mime: string;
    type: string;
    subtype: string;
    icon: string;
    dateFormatted: string;
    nonces: Nonces;
    editLink: string;
    meta: boolean;
    authorName: string;
    authorLink: string;
    filesizeInBytes: number;
    filesizeHumanReadable: string;
    context: string;
    originalImageURL: string;
    originalImageName: string;
    height: number;
    width: number;
    orientation: string;
    sizes: Sizes;
    compat: Compat;
}
export interface ProjectInterface {
    id: string;
    title: string;
    svg: string;
    project_image: imageInterface[];
    slug: string;
    polygon_data: PolygonDataCollection[];
    ["360images"]: ImageInterface360[];
    created_at: string;
    updated_at: string;
}
export interface ImageInterface360 {
    img: string;
    polygon_data: PolygonDataCollection[];
    svg: string;
}
export interface FloorInterface {
    data: FloorItem[];
    page: number;
    per_page: number;
    total: number;
}
export interface FloorItem {
    id: string;
    title: string;
    floor_number: number;
    conf: "reserved" | "sold";
    floor_image: imageInterface[];
    svg: string;
    project_id: number;
    block_id: number;
    polygon_data: PolygonDataCollection[];
    img_contain: boolean;
    counts?: {
        available?: number;
        reserved?: number;
        sold?: number;
        minimum_price?: number;
    };
    flats?: FlatItem[];
    created_at: string;
    updated_at: string;
}
export interface BlockInterface {
    data: FloorItem[];
    page: number;
    per_page: number;
    total: number;
}
export interface BlockItem {
    id: string;
    title: string;
    conf: "reserved" | "sold";
    block_image: imageInterface[];
    svg: string;
    project_id: number;
    polygon_data: PolygonDataCollection[];
    img_contain: boolean;
    counts?: {
        available?: number;
        reserved?: number;
        sold?: number;
    };
    created_at: string;
    updated_at: string;
}
export interface PolygonDataCollection {
    id: string;
    key: string;
    type: "flat" | "floor" | "block" | "tooltip" | "";
}
export interface selectDataItem {
    title: string;
    value: string;
    isLinked?: boolean;
    type?: "" | "flat" | "floor" | "block" | "tooltip";
}
export interface FlatsInterface {
    data: FlatItem[];
    page: number;
    per_page: number;
    total: number;
}
export interface FlatItem {
    id: string;
    type_id: string | null;
    flat_number: string;
    project_id: string;
    conf: string | null;
    floor_id: string;
    request_price: string;
    price: string;
    offer_price: string;
    block_id?: string | null;
    type?: TypeItem;
    use_type?: boolean;
    files?: imageInterface[] | null;
    price_history: {
        price: string;
        date: string;
        timestamp: number;
    }[];
    created_at: string;
    updated_at: string;
}
export interface TypeInterface {
    data: TypeItem[];
    page: number;
    per_page: number;
    total: number;
}
export interface TypeItem {
    id: string;
    title: string;
    teaser: string;
    project_id: string;
    image_2d?: imageInterface[] | null;
    image_3d?: imageInterface[] | null;
    gallery?: imageInterface[] | null;
    area_m2: string;
    other: any;
    rooms_count: string;
    created_at: string;
    updated_at: string;
}
export interface ProjectMeta {
    id?: number;
    project_id: number;
    meta_key: string;
    meta_value: string | number;
}
export interface ShortcodeData {
    flats: FlatItem[];
    floors: FloorItem[];
    blocks: BlockItem[];
    project: ProjectInterface;
    types: TypeItem[];
    meta: ProjectMeta[];
    actions: ActionItem[];
    configs: {
        flatFieldQueryParameter: string;
        tableFields: TableFieldsType[];
        tableContactUrl: string;
        hasTableOneColumn: boolean;
        hasTableWholeRowClickable: boolean;
        tableActionSvgs: {
            contactSvg: string;
            downloadSvg: string;
            magnifySvg: string;
        };
    };
}
export interface TableFieldsType {
    field: string;
    header: string;
    sortable: boolean;
}
export interface ActionInterface {
    data: ActionItem[];
    page: number;
    per_page: number;
    total: number;
}
export interface ActionItem {
    id: string;
    title: string;
    data: ActionData;
    created_at: string;
    updated_at: string;
}
export interface ActionData {
    url: string;
    script: string;
    targetBlank: boolean;
    actionType: string;
    modalObject: ModalObject;
}
export interface ModalObject {
    title: string;
    description: string;
    modalImage: null | imageInterface[];
}
export {};
