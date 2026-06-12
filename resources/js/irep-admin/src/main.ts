import { createApp } from "vue";
import { createPinia } from "pinia";

import Responses from "./root/Responses.vue";
import App from "./root/App.vue";

import ToastPlugin from "vue-toast-notification";
import VueAwesomePaginate from "vue-awesome-paginate";

import "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";
import IrePreview from "ire-preview";
import { META } from "./composables/constants";

// @ts-ignore
import "vue-toast-notification/dist/theme-sugar.css";
// @ts-ignore
import "vue-awesome-paginate/dist/style.css";
// @ts-ignore
import "ire-preview/dist/styles.css";
// @ts-ignore
import "./style.css";
// @ts-ignore
import "highlight.js/styles/stackoverflow-light.css";
// @ts-ignore
import vClickOutside from "click-outside-vue3";

const pinia = createPinia();
const app = createApp(App);

app.use(vClickOutside);
app.use(pinia);
app.use(VueAwesomePaginate);
app.use(ToastPlugin);
app.use(hljsVuePlugin);
app.use(IrePreview);

// @ts-ignore
app.config.globalProperties.irePlugin = irePlugin;
// @ts-ignore
window.constants = META;

app.mount("#irep-vue-app");

// RESPONSES PAGE
const responsesApp = createApp(Responses);
// @ts-ignore
responsesApp.config.globalProperties.irePlugin = irePlugin;

responsesApp.mount("#irep-vue-app-responses");
