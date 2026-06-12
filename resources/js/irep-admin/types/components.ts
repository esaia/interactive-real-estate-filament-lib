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
  created_at: string;
  updated_at: string;
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
  floor_number: string;
  conf: "reserved" | "sold";
  floor_image: imageInterface[];
  svg: string;
  project_id: number;
  block_id: number;
  polygon_data: PolygonDataCollection[];
  counts?: {
    available?: number;
    reserved?: number;
    sold?: number;
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
  is_active: boolean;
  title: string;
  conf: "reserved" | "sold";
  block_image: imageInterface[];
  svg: string;
  project_id: number;
  polygon_data: PolygonDataCollection[];
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
  isDisabled?: boolean;
  type?: "" | "flat" | "floor" | "block" | "tooltip";
  color?: string;
}

export interface FlatsInterface {
  data: FlatItem[];
  page: number;
  per_page: number;
  total: number;
}

export interface FlatItem {
  id: string;
  is_active: boolean;
  type_id: string | null;
  flat_number: string;
  project_id: string;
  conf: string | null;
  click_action: string;
  follow_link: string;
  floor_id: string;
  floor_number: string;
  request_price: boolean;
  price: string;
  offer_price: string;
  block_id?: string | null;
  type?: TypeItem;
  flat_type?: TypeItem;
  use_type?: boolean | string;
  files?: imageInterface[] | null;
  /** Present when ire-poland-compliance is active; `timestamp` is Unix seconds (newer rows). */
  price_history?: { date: string; price: string; timestamp?: number }[];
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
  rooms_count: string;
  other: { key: string; value: string }[];
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

export interface Field {
  id: string;
  key: string;
  type: "text" | "select";
  values?: string[];
  value?: "";
}

type SelectValue = { title: string; value: string };

export interface ProjectSettings {
  chosenTooltip: string;
  chooseFlatPreview: string;
  chooseFlatPreviewOneStyle: string;
  chosenCurrency: SelectValue;
  chosenArea: SelectValue;
  chosenPriceSeparator: SelectValue;
  chosenSeparator: SelectValue;
  isPriceRounded: boolean;
  requestCallback: boolean;
  redirectToCallbackUrl: boolean;
  receiveFormsOnEmail: boolean;
  shareableLink: boolean;
  removeWatermark: boolean;
  /** GOLD: SVG path fill only on hover (stored as meta `paths_hover_fill`). */
  pathsHoverFill: boolean;
}

export interface Image360Interface {
  img: string;
  svg: string;
  polygon_data: PolygonDataCollection[];
  svgRef: HTMLDivElement | null;
}
