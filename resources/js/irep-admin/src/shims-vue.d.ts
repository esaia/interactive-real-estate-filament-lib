export {};

type IrePluginGlobal = {
  nonce: string;
  ajax_url: string;
  contact_admin_url: string;
  plugin_url: string;
  plugin_assets_path: string;
  is_premium: boolean;
  is_gold: boolean;
  translations: any[];
  price_history_addon?: boolean;
  building_360_addon?: boolean;
};

declare var irePlugin: IrePluginGlobal;

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    irePlugin: IrePluginGlobal;
  }
}
