export const META = {
  CIRCLE_RADIUS: 2.5,
  HOVER_CIRCLE_RADIUS: 4,
  PATH_COLOR: "#cb443579",
  SELECTED_PATH_COLOR: "#cb4435af",
  NON_SELECTED_PATH_COLOR: "#cb443529",
  CIRCLE_COLOR: "#ffff",
  CIRCLE_STROKE_COLOR: "black",
  CIRCLE_STROKE_WIDTH: 0.5,
  CIRCLE_HOVER_COLOR: "rgba(255, 255, 255, 0.70)",
  FIRST_CIRCLE_COLOR: "#e74c3c",
  FIRST_CIRCLE_HOVER_COLOR: "#FF9800",

  PREVIEW_PATH_COLOR: "rgba(255, 255, 255, 0.3)",
  PREVIEW_PATH_HOVER_COLOR: "rgba(250, 250, 250, 0.54)",
  PREVIEW_RESERVED_COLOR: "rgba(233, 191, 0, 0.32)",
  PREVIEW_SOLD_COLOR: "rgba(219, 64, 64, 0.45)",
  PREVIEW_STROKE_COLOR: "rgba(0, 0, 0,  1)",
  PREVIEW_PRIMARY_COLOR: "rgba(45, 45, 46,  1)",
  PREVIEW_STROKE_WIDTH: 1,
  PREVIEW_BORDER_RADIUS: 0,
  TOOLTIP: 0
};

export const DEFAULT_CONFIG = [
  { title: "Reserved", value: "reserved" },
  { title: "Sold", value: "sold" }
];

export const PLUGIN_ASSETS_PATH = "https://ireplugin.com/assets/plugin/";

export const PLEASE_UPGRADE_TO_GOLD = "Please upgrade plan to GOLD";

export const COMMON_FIELDS = [
  "id",
  "flat_number",
  "floor_title",
  "floor_number",
  "block_title",
  "price",
  "conf",
  "type.area_m2",
  "type.rooms_count",
  "type.title",
  "type.teaser",
  "type.other.*"
];
