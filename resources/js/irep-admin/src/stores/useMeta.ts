import { defineStore } from "pinia";
import { ref } from "vue";
import { ProjectMeta } from "../../types/components";
import ajaxAxios from "@/src/utils/axios";
import { useProjectStore } from "./useProject";
import { META } from "../composables/constants";

export const useMetaStore = defineStore("meta", () => {
  const {
    PREVIEW_PATH_COLOR,
    PREVIEW_PATH_HOVER_COLOR,
    PREVIEW_RESERVED_COLOR,
    PREVIEW_SOLD_COLOR,
    PREVIEW_STROKE_COLOR,
    PREVIEW_STROKE_WIDTH,
    PREVIEW_BORDER_RADIUS,
    PREVIEW_PRIMARY_COLOR
  } = META;

  const currencyData = [
    { title: "🇺🇸 USD", value: "usd", symbol: "$" }, // United States
    { title: "🇪🇺 EUR", value: "eur", symbol: "€", isDisabled: !irePlugin.is_premium }, // Eurozone (20+ countries)
    { title: "🇬🇧 GBP", value: "gbp", symbol: "£", isDisabled: !irePlugin.is_premium }, // United Kingdom
    { title: "🇬🇪 GEL", value: "gel", symbol: "₾", isDisabled: !irePlugin.is_premium }, // Georgia
    { title: "🇯🇵 JPY", value: "jpy", symbol: "¥", isDisabled: !irePlugin.is_premium }, // Japan
    { title: "🇨🇳 CNY", value: "cny", symbol: "¥", isDisabled: !irePlugin.is_premium }, // China
    { title: "🇮🇳 INR", value: "inr", symbol: "₹", isDisabled: !irePlugin.is_premium }, // India
    { title: "🇨🇦 CAD", value: "cad", symbol: "C$", isDisabled: !irePlugin.is_premium }, // Canada
    { title: "🇦🇺 AUD", value: "aud", symbol: "A$", isDisabled: !irePlugin.is_premium }, // Australia
    { title: "🇨🇭 CHF", value: "chf", symbol: "CHF", isDisabled: !irePlugin.is_premium }, // Switzerland
    { title: "🇸🇬 SGD", value: "sgd", symbol: "S$", isDisabled: !irePlugin.is_premium }, // Singapore
    { title: "🇭🇰 HKD", value: "hkd", symbol: "HK$", isDisabled: !irePlugin.is_premium }, // Hong Kong
    { title: "🇳🇿 NZD", value: "nzd", symbol: "NZ$", isDisabled: !irePlugin.is_premium }, // New Zealand
    { title: "🇰🇷 KRW", value: "krw", symbol: "₩", isDisabled: !irePlugin.is_premium }, // South Korea
    { title: "🇧🇷 BRL", value: "brl", symbol: "R$", isDisabled: !irePlugin.is_premium }, // Brazil
    { title: "🇷🇺 RUB", value: "rub", symbol: "₽", isDisabled: !irePlugin.is_premium }, // Russia
    { title: "🇿🇦 ZAR", value: "zar", symbol: "R", isDisabled: !irePlugin.is_premium }, // South Africa
    { title: "🇲🇽 MXN", value: "mxn", symbol: "Mex$", isDisabled: !irePlugin.is_premium }, // Mexico
    { title: "🇹🇷 TRY", value: "try", symbol: "₺", isDisabled: !irePlugin.is_premium }, // Turkey
    { title: "🇸🇪 SEK", value: "sek", symbol: "kr", isDisabled: !irePlugin.is_premium }, // Sweden
    { title: "🇳🇴 NOK", value: "nok", symbol: "kr", isDisabled: !irePlugin.is_premium }, // Norway
    { title: "🇩🇰 DKK", value: "dkk", symbol: "kr", isDisabled: !irePlugin.is_premium }, // Denmark
    { title: "🇵🇱 PLN", value: "pln", symbol: "zł", isDisabled: !irePlugin.is_premium }, // Poland
    { title: "🇹🇭 THB", value: "thb", symbol: "฿", isDisabled: !irePlugin.is_premium }, // Thailand
    { title: "🇮🇩 IDR", value: "idr", symbol: "Rp", isDisabled: !irePlugin.is_premium }, // Indonesia
    { title: "🇲🇾 MYR", value: "myr", symbol: "RM", isDisabled: !irePlugin.is_premium }, // Malaysia
    { title: "🇵🇭 PHP", value: "php", symbol: "₱", isDisabled: !irePlugin.is_premium }, // Philippines
    { title: "🇻🇳 VND", value: "vnd", symbol: "₫", isDisabled: !irePlugin.is_premium }, // Vietnam
    { title: "🇮🇱 ILS", value: "ils", symbol: "₪", isDisabled: !irePlugin.is_premium }, // Israel
    { title: "🇦🇪 AED", value: "aed", symbol: "د.إ", isDisabled: !irePlugin.is_premium }, // UAE
    { title: "🇸🇦 SAR", value: "sar", symbol: "﷼", isDisabled: !irePlugin.is_premium }, // Saudi Arabia
    { title: "🇶🇦 QAR", value: "qar", symbol: "﷼", isDisabled: !irePlugin.is_premium }, // Qatar
    { title: "🇰🇼 KWD", value: "kwd", symbol: "د.ك", isDisabled: !irePlugin.is_premium }, // Kuwait
    { title: "🇧 Bahraini BHD", value: "bhd", symbol: ".د.ب", isDisabled: !irePlugin.is_premium }, // Bahrain
    { title: "🇴🇲 OMR", value: "omr", symbol: "﷼", isDisabled: !irePlugin.is_premium }, // Oman
    { title: "🇪🇬 EGP", value: "egp", symbol: "E£", isDisabled: !irePlugin.is_premium }, // Egypt
    { title: "🇳🇬 NGN", value: "ngn", symbol: "₦", isDisabled: !irePlugin.is_premium }, // Nigeria
    { title: "🇰🇪 KES", value: "kes", symbol: "KSh", isDisabled: !irePlugin.is_premium }, // Kenya
    { title: "🇬🇭 GHS", value: "ghs", symbol: "GH₵", isDisabled: !irePlugin.is_premium }, // Ghana
    { title: "🇨🇱 CLP", value: "clp", symbol: "$", isDisabled: !irePlugin.is_premium }, // Chile
    { title: "🇨🇴 COP", value: "cop", symbol: "$", isDisabled: !irePlugin.is_premium }, // Colombia
    { title: "🇵🇪 PEN", value: "pen", symbol: "S/", isDisabled: !irePlugin.is_premium }, // Peru
    { title: "🇦🇷 ARS", value: "ars", symbol: "$", isDisabled: !irePlugin.is_premium }, // Argentina
    { title: "🇺🇦 UAH", value: "uah", symbol: "₴", isDisabled: !irePlugin.is_premium }, // Ukraine
    { title: "🇨🇿 CZK", value: "czk", symbol: "Kč", isDisabled: !irePlugin.is_premium }, // Czech Republic
    { title: "🇭🇺 HUF", value: "huf", symbol: "Ft", isDisabled: !irePlugin.is_premium }, // Hungary
    { title: "🇷🇴 RON", value: "ron", symbol: "lei", isDisabled: !irePlugin.is_premium }, // Romania
    { title: "🇧🇬 BGN", value: "bgn", symbol: "лв", isDisabled: !irePlugin.is_premium }, // Bulgaria
    { title: "🇮🇸 ISK", value: "isk", symbol: "kr", isDisabled: !irePlugin.is_premium }, // Iceland
    { title: "🇵🇰 PKR", value: "pkr", symbol: "₨", isDisabled: !irePlugin.is_premium }, // Pakistan
    { title: "🇧🇩 BDT", value: "bdt", symbol: "৳", isDisabled: !irePlugin.is_premium }, // Bangladesh
    { title: "🇱🇰 LKR", value: "lkr", symbol: "Rs", isDisabled: !irePlugin.is_premium }, // Sri Lanka
    { title: "🇸🇳 XOF", value: "xof", symbol: "CFA", isDisabled: !irePlugin.is_premium }, // West African CFA (Senegal, etc.)
    { title: "🇨🇲 XAF", value: "xaf", symbol: "FCFA", isDisabled: !irePlugin.is_premium } // Central African CFA (Cameroon, etc.)
  ];

  const areaSelectData = [
    { title: "m", value: "m" },
    { title: "ft", value: "ft" }
  ];

  const separatorData = [
    { title: "comma (,)", value: "comma" },
    { title: "dot (.)", value: "dot" }
  ];

  const projectStore = useProjectStore();

  const projectMeta = ref<ProjectMeta[]>([]);

  const getProjectMeta = async () => {
    const { data } = await ajaxAxios.post("", {
      action: "irep_get_meta",
      nonce: irePlugin.nonce,
      project_id: projectStore.id
    });
    if (data?.success && Array.isArray(data.data)) {
      projectMeta.value = data.data;
    }
    setColorsMeta();
  };

  const getMeta = (metaKey: string) => {
    return projectMeta.value.find((item) => item.meta_key === metaKey);
  };

  const setProjectMeta = async (metaArr: { key: string; value: any }[], projectId?: number) => {
    await ajaxAxios.post("", {
      action: "irep_create_or_update_meta",
      nonce: irePlugin.nonce,
      project_id: projectId || projectStore.id,
      meta_data: metaArr
    });

    await getProjectMeta();
  };

  /** Site-wide custom status types (shared across all projects). */
  const customStatusTypes = ref<
    Array<{ value: string; title: string; open_flat_modal?: boolean; type_color?: string }>
  >([]);

  const getCustomStatusTypes = async () => {
    const { data } = await ajaxAxios.post("", {
      action: "irep_get_custom_status_types",
      nonce: irePlugin.nonce
    });
    if (data?.success && Array.isArray(data.data)) {
      customStatusTypes.value = data.data;
    }
  };

  const setCustomStatusTypes = async (
    types: Array<{ value: string; title: string; open_flat_modal?: boolean; type_color?: string }>
  ) => {
    await ajaxAxios.post("", {
      action: "irep_update_custom_status_types",
      nonce: irePlugin.nonce,
      value: JSON.stringify(types)
    });
    await getCustomStatusTypes();
  };

  const setColorsMeta = () => {
    const path_color = getMeta("path_color")?.meta_value || PREVIEW_PATH_COLOR;
    const available_flat_color = getMeta("available_flat_color")?.meta_value || path_color;
    const path_hover_color = getMeta("path_hover_color")?.meta_value || PREVIEW_PATH_HOVER_COLOR;
    const reserved_color = getMeta("reserved_color")?.meta_value || PREVIEW_RESERVED_COLOR;
    const sold_color = getMeta("sold_color")?.meta_value || PREVIEW_SOLD_COLOR;
    const stroke_color = getMeta("stroke_color")?.meta_value || PREVIEW_STROKE_COLOR;
    const primary_color = getMeta("primary_color")?.meta_value || PREVIEW_PRIMARY_COLOR;
    const stroke_width = !irePlugin.is_premium ? 1 : getMeta("stroke_width")?.meta_value || PREVIEW_STROKE_WIDTH;
    const border_radius = !irePlugin.is_premium ? 1 : getMeta("border_radius")?.meta_value || PREVIEW_BORDER_RADIUS;

    const colors: any = {
      available_flat_color,
      path_color,
      path_hover_color,
      reserved_color,
      sold_color,
      stroke_color,
      primary_color,
      stroke_width,
      border_radius
    };

    Object.keys(colors).forEach((key) => {
      if (!getMeta(key)) {
        projectMeta.value.push({
          id: Math.floor(Math.random() * Date.now()),
          meta_key: key,
          meta_value: colors[key],
          project_id: projectStore.id
        });
      }
    });

    projectMeta.value = projectMeta.value.map((item) => {
      if (Object.keys(colors).includes(item.meta_key) && !item.meta_value) {
        return { ...item, meta_value: colors[item.meta_key] };
      } else {
        return item;
      }
    });
  };

  return {
    projectMeta,
    getProjectMeta,
    setProjectMeta,
    getMeta,
    customStatusTypes,
    getCustomStatusTypes,
    setCustomStatusTypes,
    currencyData,
    areaSelectData,
    separatorData
  };
});
