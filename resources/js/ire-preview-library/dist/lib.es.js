import { toRaw, computed, isRef, isReactive, toRef, effectScope, ref, markRaw, hasInjectionContext, inject, reactive, getCurrentScope, onScopeDispose, watch, nextTick as nextTick$1, toRefs, defineComponent, onMounted, onUnmounted, openBlock, createElementBlock, normalizeStyle, unref, renderSlot, createVNode, Transition, withCtx, createElementVNode, toDisplayString, createCommentVNode, Fragment, createTextVNode, createStaticVNode, normalizeClass, createBlock, useModel, withDirectives, renderList, vModelSelect, mergeModels, useId, withModifiers, onUpdated, provide, onBeforeUnmount, h as h$1, onBeforeUpdate, useSlots, vModelDynamic, vModelText, Teleport, pushScopeId, popScopeId, resolveComponent, withScopeId, resolveDynamicComponent, createSlots, onBeforeMount, withKeys, shallowRef, vShow } from "vue";
import { a as axios } from "./vendor-Bh5xoGS9.js";
/*!
 * pinia v3.0.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
let activePinia;
const setActivePinia = ($e) => activePinia = $e, piniaSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function isPlainObject($e) {
  return $e && typeof $e == "object" && Object.prototype.toString.call($e) === "[object Object]" && typeof $e.toJSON != "function";
}
var MutationType;
(function($e) {
  $e.direct = "direct", $e.patchObject = "patch object", $e.patchFunction = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const $e = effectScope(!0), _e = $e.run(() => ref({}));
  let ke = [], Be = [];
  const Ne = markRaw({
    install(Ve) {
      setActivePinia(Ne), Ne._a = Ve, Ve.provide(piniaSymbol, Ne), Ve.config.globalProperties.$pinia = Ne, Be.forEach((Le) => ke.push(Le)), Be = [];
    },
    use(Ve) {
      return this._a ? ke.push(Ve) : Be.push(Ve), this;
    },
    _p: ke,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: $e,
    _s: /* @__PURE__ */ new Map(),
    state: _e
  });
  return Ne;
}
const noop = () => {
};
function addSubscription($e, _e, ke, Be = noop) {
  $e.add(_e);
  const Ne = () => {
    $e.delete(_e) && Be();
  };
  return !ke && getCurrentScope() && onScopeDispose(Ne), Ne;
}
function triggerSubscriptions($e, ..._e) {
  $e.forEach((ke) => {
    ke(..._e);
  });
}
const fallbackRunWithContext = ($e) => $e(), ACTION_MARKER = Symbol(), ACTION_NAME = Symbol();
function mergeReactiveObjects($e, _e) {
  $e instanceof Map && _e instanceof Map ? _e.forEach((ke, Be) => $e.set(Be, ke)) : $e instanceof Set && _e instanceof Set && _e.forEach($e.add, $e);
  for (const ke in _e) {
    if (!_e.hasOwnProperty(ke))
      continue;
    const Be = _e[ke], Ne = $e[ke];
    isPlainObject(Ne) && isPlainObject(Be) && $e.hasOwnProperty(ke) && !isRef(Be) && !isReactive(Be) ? $e[ke] = mergeReactiveObjects(Ne, Be) : $e[ke] = Be;
  }
  return $e;
}
const skipHydrateSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function shouldHydrate($e) {
  return !isPlainObject($e) || !Object.prototype.hasOwnProperty.call($e, skipHydrateSymbol);
}
const { assign } = Object;
function isComputed($e) {
  return !!(isRef($e) && $e.effect);
}
function createOptionsStore($e, _e, ke, Be) {
  const { state: Ne, actions: Ve, getters: Le } = _e, De = ke.state.value[$e];
  let Ae;
  function Ie() {
    De || (ke.state.value[$e] = Ne ? Ne() : {});
    const Re = toRefs(ke.state.value[$e]);
    return assign(Re, Ve, Object.keys(Le || {}).reduce((ze, je) => (ze[je] = markRaw(computed(() => {
      setActivePinia(ke);
      const Fe = ke._s.get($e);
      return Le[je].call(Fe, Fe);
    })), ze), {}));
  }
  return Ae = createSetupStore($e, Ie, _e, ke, Be, !0), Ae;
}
function createSetupStore($e, _e, ke = {}, Be, Ne, Ve) {
  let Le;
  const De = assign({ actions: {} }, ke), Ae = { deep: !0 };
  let Ie, Re, ze = /* @__PURE__ */ new Set(), je = /* @__PURE__ */ new Set(), Fe;
  const He = Be.state.value[$e];
  !Ve && !He && (Be.state.value[$e] = {}), ref({});
  let Ge;
  function qe(ei) {
    let Ze;
    Ie = Re = !1, typeof ei == "function" ? (ei(Be.state.value[$e]), Ze = {
      type: MutationType.patchFunction,
      storeId: $e,
      events: Fe
    }) : (mergeReactiveObjects(Be.state.value[$e], ei), Ze = {
      type: MutationType.patchObject,
      payload: ei,
      storeId: $e,
      events: Fe
    });
    const Ue = Ge = Symbol();
    nextTick$1().then(() => {
      Ge === Ue && (Ie = !0);
    }), Re = !0, triggerSubscriptions(ze, Ze, Be.state.value[$e]);
  }
  const Xe = Ve ? function() {
    const { state: Ze } = ke, Ue = Ze ? Ze() : {};
    this.$patch((Ke) => {
      assign(Ke, Ue);
    });
  } : (
    /* istanbul ignore next */
    noop
  );
  function Ye() {
    Le.stop(), ze.clear(), je.clear(), Be._s.delete($e);
  }
  const We = (ei, Ze = "") => {
    if (ACTION_MARKER in ei)
      return ei[ACTION_NAME] = Ze, ei;
    const Ue = function() {
      setActivePinia(Be);
      const Ke = Array.from(arguments), ii = /* @__PURE__ */ new Set(), oi = /* @__PURE__ */ new Set();
      function ni(fi) {
        ii.add(fi);
      }
      function pi(fi) {
        oi.add(fi);
      }
      triggerSubscriptions(je, {
        args: Ke,
        name: Ue[ACTION_NAME],
        store: ri,
        after: ni,
        onError: pi
      });
      let ci;
      try {
        ci = ei.apply(this && this.$id === $e ? this : ri, Ke);
      } catch (fi) {
        throw triggerSubscriptions(oi, fi), fi;
      }
      return ci instanceof Promise ? ci.then((fi) => (triggerSubscriptions(ii, fi), fi)).catch((fi) => (triggerSubscriptions(oi, fi), Promise.reject(fi))) : (triggerSubscriptions(ii, ci), ci);
    };
    return Ue[ACTION_MARKER] = !0, Ue[ACTION_NAME] = Ze, Ue;
  }, Je = {
    _p: Be,
    // _s: scope,
    $id: $e,
    $onAction: addSubscription.bind(null, je),
    $patch: qe,
    $reset: Xe,
    $subscribe(ei, Ze = {}) {
      const Ue = addSubscription(ze, ei, Ze.detached, () => Ke()), Ke = Le.run(() => watch(() => Be.state.value[$e], (ii) => {
        (Ze.flush === "sync" ? Re : Ie) && ei({
          storeId: $e,
          type: MutationType.direct,
          events: Fe
        }, ii);
      }, assign({}, Ae, Ze)));
      return Ue;
    },
    $dispose: Ye
  }, ri = reactive(Je);
  Be._s.set($e, ri);
  const ti = (Be._a && Be._a.runWithContext || fallbackRunWithContext)(() => Be._e.run(() => (Le = effectScope()).run(() => _e({ action: We }))));
  for (const ei in ti) {
    const Ze = ti[ei];
    if (isRef(Ze) && !isComputed(Ze) || isReactive(Ze))
      Ve || (He && shouldHydrate(Ze) && (isRef(Ze) ? Ze.value = He[ei] : mergeReactiveObjects(Ze, He[ei])), Be.state.value[$e][ei] = Ze);
    else if (typeof Ze == "function") {
      const Ue = We(Ze, ei);
      ti[ei] = Ue, De.actions[ei] = Ze;
    }
  }
  return assign(ri, ti), assign(toRaw(ri), ti), Object.defineProperty(ri, "$state", {
    get: () => Be.state.value[$e],
    set: (ei) => {
      qe((Ze) => {
        assign(Ze, ei);
      });
    }
  }), Be._p.forEach((ei) => {
    assign(ri, Le.run(() => ei({
      store: ri,
      app: Be._a,
      pinia: Be,
      options: De
    })));
  }), He && Ve && ke.hydrate && ke.hydrate(ri.$state, He), Ie = !0, Re = !0, ri;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineStore($e, _e, ke) {
  let Be;
  const Ne = typeof _e == "function";
  Be = Ne ? ke : _e;
  function Ve(Le, De) {
    const Ae = hasInjectionContext();
    return Le = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    Le || (Ae ? inject(piniaSymbol, null) : null), Le && setActivePinia(Le), Le = activePinia, Le._s.has($e) || (Ne ? createSetupStore($e, _e, Be, Le) : createOptionsStore($e, Be, Le)), Le._s.get($e);
  }
  return Ve.$id = $e, Ve;
}
function storeToRefs($e) {
  const _e = toRaw($e), ke = {};
  for (const Be in _e) {
    const Ne = _e[Be];
    Ne.effect ? ke[Be] = // ...
    computed({
      get: () => $e[Be],
      set(Ve) {
        $e[Be] = Ve;
      }
    }) : (isRef(Ne) || isReactive(Ne)) && (ke[Be] = // ---
    toRef($e, Be));
  }
  return ke;
}
const useGlobalStore = /* @__PURE__ */ defineStore("global", () => {
  var Xe, Ye, We, Je, ri, Qe, ti, ei, Ze;
  const $e = ref(), _e = ref("1"), ke = ref(), Be = ref(), Ne = (Ue) => {
    var Ke, ii, oi;
    return ((oi = (ii = (Ke = ke.value) == null ? void 0 : Ke.meta) == null ? void 0 : ii.find((ni) => (ni == null ? void 0 : ni.meta_key) === Ue)) == null ? void 0 : oi.meta_value) || null;
  }, Ve = ref({
    AVAILABLE_FLAT_COLOR: Ne("available_flat_color") || "rgba(255, 255, 255, 0.3)",
    PREVIEW_PATH_COLOR: Ne("path_color") || "rgba(255, 255, 255, 0.3)",
    PREVIEW_PATH_HOVER_COLOR: Ne("path_hover_color") || "rgba(250, 250, 250, 0.54)",
    PREVIEW_RESERVED_COLOR: Ne("reserved_color") || "rgba(255, 247, 89, 0.53)",
    PREVIEW_SOLD_COLOR: Ne("sold_color") || "rgba(219, 64, 64, 0.45)",
    PREVIEW_STROKE_COLOR: Ne("stroke_color") || "rgba(0, 0, 0,  1)",
    PREVIEW_PRIMARY_COLOR: Ne("primary_color") || "rgba(45, 45, 46,  1)",
    PREVIEW_STROKE_WIDTH: +Ne("stroke_width") || 1,
    PREVIEW_BORDER_RADIUS: +Ne("border_radius") || 0
  }), Le = reactive({
    available_flat_color: (Xe = Ve.value) == null ? void 0 : Xe.AVAILABLE_FLAT_COLOR,
    path: (Ye = Ve.value) == null ? void 0 : Ye.PREVIEW_PATH_COLOR,
    path_hover: (We = Ve.value) == null ? void 0 : We.PREVIEW_PATH_HOVER_COLOR,
    reserved: (Je = Ve.value) == null ? void 0 : Je.PREVIEW_RESERVED_COLOR,
    sold: (ri = Ve.value) == null ? void 0 : ri.PREVIEW_SOLD_COLOR,
    stroke_color: (Qe = Ve.value) == null ? void 0 : Qe.PREVIEW_STROKE_COLOR,
    primary_color: (ti = Ve.value) == null ? void 0 : ti.PREVIEW_PRIMARY_COLOR,
    stroke_width: (ei = Ve.value) == null ? void 0 : ei.PREVIEW_STROKE_WIDTH,
    border_radius: (Ze = Ve.value) == null ? void 0 : Ze.PREVIEW_BORDER_RADIUS
  }), De = computed(() => {
    var Ue, Ke;
    return (Ke = (Ue = ke.value) == null ? void 0 : Ue.flats) == null ? void 0 : Ke.map((ii) => {
      var ni, pi;
      const oi = ii != null && ii.use_type || !(ii != null && ii.type) ? ((pi = (ni = ke.value) == null ? void 0 : ni.types) == null ? void 0 : pi.find((ci) => ci.id === (ii == null ? void 0 : ii.type_id))) ?? (ii == null ? void 0 : ii.type) : ii == null ? void 0 : ii.type;
      return { ...ii, type: oi };
    });
  }), Ae = computed(() => Ne("open_reserved_flat") === "true"), Ie = computed(() => Ne("open_sold_flat") === "true"), Re = computed(() => Ne("price_rounded") === "true"), ze = computed(() => {
    var Ue;
    return (Ue = Be.value) == null ? void 0 : Ue.translations;
  }), je = computed(() => {
    var Ue;
    return !!((Ue = Be.value) != null && Ue.price_history_addon);
  }), Fe = computed(() => ({
    "--available-flat-color": Le.available_flat_color,
    "--reserved-color": Le.reserved,
    "--sold-color": Le.sold,
    "--path-hover-color": Le.path_hover,
    "--path-color": Le.path,
    "--stroke-color": Le.stroke_color,
    "--primary-color": Le.primary_color,
    "--stroke-width": Le.stroke_width + "px",
    "--border-radius": Le.border_radius + "px"
  })), He = computed(() => {
    const Ue = Ne("custom_types");
    return (Array.isArray(Ue) ? Ue : typeof Ue == "string" ? (() => {
      try {
        return JSON.parse(Ue) ?? [];
      } catch {
        return [];
      }
    })() : []).map((ii) => {
      const oi = String(ii.value ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"'), ni = (ii == null ? void 0 : ii.type_color) || "var(--path-color)";
      return `.path-color g[conf="${oi}"] path { fill: ${ni}; }
.path-color.path-hover-fill-only svg g[conf="${oi}"]:hover path { fill: ${ni} !important; }`;
    }).join(`
`);
  }), Ge = (Ue) => {
    ke.value = Ue;
  }, qe = (Ue) => {
    Be.value = Ue;
  };
  return watch(
    () => {
      var Ue;
      return (Ue = ke.value) == null ? void 0 : Ue.meta;
    },
    () => {
      const Ue = Ne("available_flat_color"), Ke = Ne("path_color"), ii = Ne("path_hover_color"), oi = Ne("reserved_color"), ni = Ne("sold_color"), pi = Ne("stroke_color"), ci = Ne("primary_color"), fi = Ne("stroke_width"), hi = Ne("border_radius");
      Ue && (Le.available_flat_color = Ue.toString()), Ke && (Le.path = Ke.toString()), ii && (Le.path_hover = ii.toString()), oi && (Le.reserved = oi.toString()), ni && (Le.sold = ni.toString()), pi && (Le.stroke_color = pi.toString()), pi && (Le.stroke_color = pi.toString()), ci && (Le.primary_color = ci.toString()), Le.stroke_width = Number(fi) || 1, Le.border_radius = Number(hi) || 0;
    },
    { deep: !0 }
  ), {
    // State
    hoverdSvg: $e,
    tooltip: _e,
    shortcodeData: ke,
    irePlaginWp: Be,
    // Geters
    flats: De,
    getMetaValue: Ne,
    openReservedFlat: Ae,
    openSoldFlat: Ie,
    priceRounded: Re,
    translations: ze,
    cssVariables: Fe,
    customTypesPathCss: He,
    hasPriceHistoryAddon: je,
    // Mutation
    setData: Ge,
    setIrePlaginWp: qe
  };
}), _sfc_main$1h = /* @__PURE__ */ defineComponent({
  __name: "ShortcodeWrapper",
  setup($e) {
    const _e = useGlobalStore(), { cssVariables: ke, customTypesPathCss: Be } = storeToRefs(_e), Ne = ref(null), Ve = document.createElement("style");
    return watch(
      Be,
      (Le) => {
        Ve.textContent = Le ?? "";
      },
      { immediate: !0 }
    ), onMounted(() => {
      Ne.value && Ne.value.appendChild(Ve);
    }), onUnmounted(() => {
      Ve.remove();
    }), (Le, De) => (openBlock(), createElementBlock("div", {
      ref_key: "wrapperRef",
      ref: Ne,
      class: "irep-shortcode-wrapper",
      style: normalizeStyle(unref(ke))
    }, [
      renderSlot(Le.$slots, "default")
    ], 4));
  }
}), tr = ($e) => {
  var ke;
  const _e = useGlobalStore();
  return _e.translations && ((ke = _e.translations) == null ? void 0 : ke[$e]) || $e;
}, currencySymbol = () => {
  var Be, Ne, Ve, Le;
  const $e = [
    { title: "🇺🇸 USD", value: "usd", symbol: "$" },
    // United States
    { title: "🇪🇺 EUR", value: "eur", symbol: "€" },
    // European Union
    { title: "🇬🇧 GBP", value: "gbp", symbol: "£" },
    // United Kingdom
    { title: "🇯🇵 JPY", value: "jpy", symbol: "¥" },
    // Japan
    { title: "🇦🇺 AUD", value: "aud", symbol: "A$" },
    // Australia
    { title: "🇨🇦 CAD", value: "cad", symbol: "C$" },
    // Canada
    { title: "🇨🇭 CHF", value: "chf", symbol: "CHF" },
    // Switzerland
    { title: "🇨🇳 CNY", value: "cny", symbol: "¥" },
    // China
    { title: "🇮🇳 INR", value: "inr", symbol: "₹" },
    // India
    { title: "🇸🇬 SGD", value: "sgd", symbol: "S$" },
    // Singapore
    { title: "🇳🇿 NZD", value: "nzd", symbol: "NZ$" },
    // New Zealand
    { title: "🇰🇷 KRW", value: "krw", symbol: "₩" },
    // South Korea
    { title: "🇧🇷 BRL", value: "brl", symbol: "R$" },
    // Brazil
    { title: "🇷🇺 RUB", value: "rub", symbol: "₽" },
    // Russia
    { title: "🇿🇦 ZAR", value: "zar", symbol: "R" },
    // South Africa
    { title: "🇲🇽 MXN", value: "mxn", symbol: "Mex$" },
    // Mexico
    { title: "🇭🇰 HKD", value: "hkd", symbol: "HK$" },
    // Hong Kong
    { title: "🇹🇷 TRY", value: "try", symbol: "₺" },
    // Turkey
    { title: "🇸🇪 SEK", value: "sek", symbol: "kr" },
    // Sweden
    { title: "🇳🇴 NOK", value: "nok", symbol: "kr" },
    // Norway
    { title: "🇩🇰 DKK", value: "dkk", symbol: "kr" },
    // Denmark
    { title: "🇵🇱 PLN", value: "pln", symbol: "zł" },
    // Poland
    { title: "🇹🇭 THB", value: "thb", symbol: "฿" },
    // Thailand
    { title: "🇮🇩 IDR", value: "idr", symbol: "Rp" },
    // Indonesia
    { title: "🇲🇾 MYR", value: "myr", symbol: "RM" },
    // Malaysia
    { title: "🇵🇭 PHP", value: "php", symbol: "₱" },
    // Philippines
    { title: "🇦🇪 AED", value: "aed", symbol: "د.إ" },
    // United Arab Emirates
    { title: "🇸🇦 SAR", value: "sar", symbol: "﷼" },
    // Saudi Arabia
    { title: "🇶🇦 QAR", value: "qar", symbol: "﷼" },
    // Qatar
    { title: "🇰🇼 KWD", value: "kwd", symbol: "د.ك" },
    // Kuwait
    { title: "🇧🇭 BHD", value: "bhd", symbol: ".د.ب" },
    // Bahrain
    { title: "🇴🇲 OMR", value: "omr", symbol: "﷼" },
    // Oman
    { title: "🇬🇪 GEL", value: "gel", symbol: "₾" }
    // Georgia
  ], ke = ((Ve = (Ne = (Be = useGlobalStore().shortcodeData) == null ? void 0 : Be.meta) == null ? void 0 : Ne.find((De) => De.meta_key === "currency")) == null ? void 0 : Ve.meta_value.toString()) || "usd";
  return ((Le = $e == null ? void 0 : $e.find((De) => De.value === ke)) == null ? void 0 : Le.symbol) || "$";
}, getPrice = ($e) => {
  const _e = useGlobalStore(), { getMetaValue: ke, priceRounded: Be } = _e, Ne = ke("price_separator") === "comma", Ve = Be ? 0 : 2, Le = {
    minimumFractionDigits: Ve,
    maximumFractionDigits: Ve
  };
  let De = Ne ? Number($e).toLocaleString("en-US", Le) : Number($e).toLocaleString("de-DE", Le);
  return _e.getMetaValue("currency") === "chf" && (De = De.replaceAll(",", "'")), De;
}, getArea = ($e) => {
  const _e = useGlobalStore(), { getMetaValue: ke } = _e, Be = ke("separator") === "comma", Ne = parseFloat($e);
  if (isNaN(Ne)) return $e;
  const Ve = Number.isInteger(Ne) ? 0 : 2, Le = Ne.toFixed(Ve);
  return Be ? Le.replace(".", ",") : Le;
}, getRoomCount = ($e) => {
  const _e = useGlobalStore(), { getMetaValue: ke } = _e, Be = ke("separator") === "comma", Ne = parseFloat($e);
  if (isNaN(Ne)) return $e;
  const Ve = (+Ne.toFixed(1)).toString();
  return Be ? Ve.replace(".", ",") : Ve;
}, getAreaUnitLabel = () => useGlobalStore().getMetaValue("area_unit") ?? "m", getBlockById = ($e) => {
  var ke, Be;
  const _e = useGlobalStore();
  if ($e)
    return (Be = (ke = _e.shortcodeData) == null ? void 0 : ke.blocks) == null ? void 0 : Be.find(
      (Ne) => Ne.id === ($e == null ? void 0 : $e.toString())
    );
}, getFloorById = ($e) => {
  var ke, Be;
  const _e = useGlobalStore();
  if ($e)
    return (Be = (ke = _e.shortcodeData) == null ? void 0 : ke.floors) == null ? void 0 : Be.find(
      (Ne) => Ne.id === ($e == null ? void 0 : $e.toString())
    );
}, setQuery = ($e, _e) => {
  const ke = new URL(window.location);
  _e === "" ? ke.searchParams.delete($e) : ke.searchParams.set($e, _e), window.history.pushState({}, "", ke);
}, getQuery = ($e) => new URLSearchParams(window.location.search).get($e), copyToClipboard = async ($e) => {
  try {
    if (navigator.clipboard)
      return await navigator.clipboard.writeText($e), !0;
    const _e = document.createElement("textarea");
    _e.value = $e, _e.style.top = "0", _e.style.left = "0", _e.style.position = "fixed", document.body.appendChild(_e), _e.focus(), _e.select();
    const ke = document.execCommand("copy");
    return document.body.removeChild(_e), ke;
  } catch (_e) {
    return console.error("Failed to copy text:", _e), !1;
  }
}, getNested = ($e, _e) => {
  var ke;
  return (ke = _e == null ? void 0 : _e.split(".")) == null ? void 0 : ke.reduce((Be, Ne) => Be ? Be[Ne] : void 0, $e);
}, getConfValue = ($e) => {
  const ke = useGlobalStore().getMetaValue("custom_types"), Be = ke == null ? void 0 : ke.find((Ne) => Ne.title === $e);
  return Be ? Be.value : $e;
}, getCustomTypeColor = ($e) => {
  const ke = useGlobalStore().getMetaValue("custom_types");
  let Be = ke == null ? void 0 : ke.find((Ne) => Ne.title === $e);
  return Be || (Be = ke == null ? void 0 : ke.find((Ne) => Ne.value === $e)), (Be == null ? void 0 : Be.type_color) || null;
}, transformOtherToKeyValue = ($e) => {
  if (!Array.isArray($e)) return {};
  const _e = {};
  for (const ke of $e)
    _e[(ke == null ? void 0 : ke.key) ?? ""] = (ke == null ? void 0 : ke.value) ?? "";
  return _e;
}, normalizeFilterOptionsMeta = ($e) => {
  if ($e == null) return {};
  if (typeof $e == "object" && !Array.isArray($e))
    return $e;
  if (typeof $e == "string")
    try {
      const _e = JSON.parse($e);
      if (_e && typeof _e == "object" && !Array.isArray(_e))
        return _e;
    } catch {
    }
  return {};
}, normalizeRangeOption = ($e, _e) => {
  if ($e && typeof $e == "object" && !Array.isArray($e)) {
    const ke = Number($e.min), Be = Number($e.max), Ne = Number($e.step);
    return {
      min: Number.isFinite(ke) ? ke : _e.min,
      max: Number.isFinite(Be) ? Be : _e.max,
      step: Number.isFinite(Ne) && Ne > 0 ? Ne : _e.step
    };
  }
  return _e;
}, _hoisted_1$19 = {
  key: 0,
  class: "irep-tooltip-1 ire-pointer-events-none ire-absolute !ire-bottom-10 !ire-right-10 ire-w-fit ire-select-none ire-rounded-lg ire-border ire-bg-white ire-p-4 ire-text-black"
}, _hoisted_2$D = {
  key: 0,
  class: "irep-tooltip-1__floor ire-flex ire-items-center ire-gap-3"
}, _hoisted_3$t = { class: "irep-tooltip-1__floor-inner ire-flex ire-flex-col ire-items-center" }, _hoisted_4$p = { class: "irep-tooltip-1__floor-number !ire-text-2xl" }, _hoisted_5$m = { class: "irep-tooltip-1__floor-text !ire-text-sm ire-uppercase" }, _hoisted_6$j = {
  key: 0,
  class: "irep-tooltip-1__floor-details ire-rounded-lg ire-bg-gray-100 ire-p-6"
}, _hoisted_7$j = {
  key: 0,
  class: "irep-tooltip-1__floor-conf !ire-text-2xl"
}, _hoisted_8$h = { key: 1 }, _hoisted_9$f = {
  key: 0,
  class: "irep-tooltip-1__floor-status ire-flex ire-items-center ire-gap-2"
}, _hoisted_10$d = { class: "irep-tooltip-1__floor-status-value ire-min-w-3 !ire-text-2xl" }, _hoisted_11$a = { class: "irep-tooltip-1__floor-status-text !ire-text-sm ire-uppercase" }, _hoisted_12$8 = {
  key: 1,
  class: "irep-tooltip-1__floor-status ire-flex ire-items-center ire-gap-2"
}, _hoisted_13$6 = { class: "irep-tooltip-1__floor-status-value min-w-3 !ire-text-2xl" }, _hoisted_14$6 = { class: "irep-tooltip-1__floor-status-text !ire-text-sm ire-uppercase" }, _hoisted_15$5 = {
  key: 2,
  class: "irep-tooltip-1__floor-status ire-flex ire-items-center ire-gap-2"
}, _hoisted_16$5 = { class: "irep-tooltip-1__floor-status-value ire-min-w-3 !ire-text-2xl" }, _hoisted_17$5 = { class: "irep-tooltip-1__floor-status-text !ire-text-sm ire-uppercase" }, _hoisted_18$4 = {
  key: 1,
  class: "irep-tooltip-1__block ire-flex ire-items-center ire-gap-3"
}, _hoisted_19$4 = { class: "irep-tooltip-1__block-inner ire-flex ire-flex-col ire-items-center" }, _hoisted_20$4 = { class: "irep-tooltip-1__block-conf text-sm ire-text-gray-700" }, _hoisted_21$4 = { class: "irep-tooltip-1__block-title !text-2xl" }, _hoisted_22$4 = {
  key: 2,
  class: "irep-tooltip-1__flat ire-flex ire-w-full ire-flex-col ire-items-center ire-gap-3"
}, _hoisted_23$4 = { class: "irep-tooltip-1__flat-inner ire-flex ire-flex-col ire-items-center" }, _hoisted_24$4 = { class: "irep-tooltip-1__flat-number ire-max-w-60 ire-text-center !ire-text-2xl ire-capitalize" }, _hoisted_25$4 = { class: "irep-tooltip-1__flat-aptitle !ire-mt-2 !ire-text-sm ire-uppercase" }, _hoisted_26$4 = { class: "irep-tooltip-1__flat-details ire-flex ire-min-w-36 ire-flex-col ire-items-center ire-rounded-lg ire-bg-gray-100 ire-px-7 ire-py-3" }, _hoisted_27$4 = {
  key: 0,
  class: "irep-tooltip-1__flat-conf !ire-text-2xl ire-uppercase"
}, _hoisted_28$3 = { class: "irep-tooltip-1__flat-price !ire-text-sm ire-uppercase ire-text-gray-500" }, _hoisted_29$3 = { key: 0 }, _hoisted_30$3 = {
  key: 1,
  class: "irep-tooltip-1__flat-price-wrapper ire-flex ire-w-fit ire-flex-col ire-items-center ire-py-2"
}, _hoisted_31$3 = {
  key: 0,
  class: "irep-tooltip-1__flat-price-value ire-whitespace-nowrap !ire-text-2xl"
}, _hoisted_32$2 = {
  key: 1,
  class: "irep-tooltip-1__flat-available ire-uppercase"
}, _hoisted_33$2 = { key: 1 }, _hoisted_34$2 = { class: "irep-tooltip-1__flat-price-line-value ire-min-w-max !ire-text-sm ire-line-through ire-decoration-black/50" }, _hoisted_35$2 = { class: "irep-tooltip-1__flat-price-value ire-min-w-max ire-whitespace-nowrap !ire-text-2xl" }, _hoisted_36$2 = { class: "irep-tooltip-1__flat-area-frame ire-border ire-border-solid ire-border-gray-800 ire-p-2" }, _hoisted_37$2 = { class: "irep-tooltip-1__flat-area ire-translate-x-3 ire-bg-white" }, _sfc_main$1g = /* @__PURE__ */ defineComponent({
  __name: "Tooltip_1",
  props: {
    hoveredData: {},
    type: {}
  },
  setup($e) {
    const _e = $e, ke = computed(() => {
      var Be;
      return tr((Be = _e.hoveredData) == null ? void 0 : Be.conf);
    });
    return (Be, Ne) => (openBlock(), createElementBlock("div", null, [
      createVNode(Transition, { name: "ire-fade-in-out" }, {
        default: withCtx(() => {
          var Ve, Le, De, Ae, Ie, Re, ze, je, Fe, He, Ge, qe, Xe, Ye, We, Je, ri, Qe, ti, ei, Ze, Ue, Ke, ii, oi, ni;
          return [
            $e.type && $e.hoveredData && $e.type !== "tooltip" ? (openBlock(), createElementBlock("div", _hoisted_1$19, [
              $e.type === "floor" ? (openBlock(), createElementBlock("div", _hoisted_2$D, [
                createElementVNode("div", _hoisted_3$t, [
                  createElementVNode("div", _hoisted_4$p, toDisplayString((Ve = $e.hoveredData) == null ? void 0 : Ve.floor_number), 1),
                  createElementVNode("div", _hoisted_5$m, toDisplayString(unref(tr)("floor")), 1)
                ]),
                (Le = $e.hoveredData) != null && Le.conf || (Ae = (De = $e.hoveredData) == null ? void 0 : De.flats) != null && Ae.length ? (openBlock(), createElementBlock("div", _hoisted_6$j, [
                  ke.value ? (openBlock(), createElementBlock("div", _hoisted_7$j, toDisplayString(ke.value), 1)) : (openBlock(), createElementBlock("div", _hoisted_8$h, [
                    (Re = (Ie = $e.hoveredData) == null ? void 0 : Ie.counts) != null && Re.available ? (openBlock(), createElementBlock("div", _hoisted_9$f, [
                      createElementVNode("div", _hoisted_10$d, toDisplayString(((je = (ze = $e.hoveredData) == null ? void 0 : ze.counts) == null ? void 0 : je.available) || 0), 1),
                      createElementVNode("div", _hoisted_11$a, toDisplayString(unref(tr)("available")), 1)
                    ])) : createCommentVNode("", !0),
                    (He = (Fe = $e.hoveredData) == null ? void 0 : Fe.counts) != null && He.reserved ? (openBlock(), createElementBlock("div", _hoisted_12$8, [
                      createElementVNode("div", _hoisted_13$6, toDisplayString((qe = (Ge = $e.hoveredData) == null ? void 0 : Ge.counts) == null ? void 0 : qe.reserved), 1),
                      createElementVNode("div", _hoisted_14$6, toDisplayString(unref(tr)("reserved")), 1)
                    ])) : createCommentVNode("", !0),
                    (Ye = (Xe = $e.hoveredData) == null ? void 0 : Xe.counts) != null && Ye.sold ? (openBlock(), createElementBlock("div", _hoisted_15$5, [
                      createElementVNode("div", _hoisted_16$5, toDisplayString((Je = (We = $e.hoveredData) == null ? void 0 : We.counts) == null ? void 0 : Je.sold), 1),
                      createElementVNode("div", _hoisted_17$5, toDisplayString(unref(tr)("sold")), 1)
                    ])) : createCommentVNode("", !0)
                  ]))
                ])) : createCommentVNode("", !0)
              ])) : $e.type === "block" ? (openBlock(), createElementBlock("div", _hoisted_18$4, [
                createElementVNode("div", _hoisted_19$4, [
                  createElementVNode("span", _hoisted_20$4, toDisplayString(ke.value), 1),
                  createElementVNode("div", _hoisted_21$4, toDisplayString((ri = $e.hoveredData) == null ? void 0 : ri.title), 1)
                ])
              ])) : $e.type === "flat" ? (openBlock(), createElementBlock("div", _hoisted_22$4, [
                createElementVNode("div", _hoisted_23$4, [
                  createElementVNode("div", _hoisted_24$4, toDisplayString((Qe = $e.hoveredData) == null ? void 0 : Qe.flat_number), 1),
                  createElementVNode("div", _hoisted_25$4, toDisplayString(unref(tr)("apartment")), 1)
                ]),
                createElementVNode("div", _hoisted_26$4, [
                  ke.value ? (openBlock(), createElementBlock("div", _hoisted_27$4, toDisplayString(ke.value), 1)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                    createElementVNode("div", _hoisted_28$3, toDisplayString(unref(tr)("price")), 1),
                    (ti = $e.hoveredData) != null && ti.request_price ? (openBlock(), createElementBlock("div", _hoisted_29$3, toDisplayString(unref(tr)("Request Price")), 1)) : (ei = $e.hoveredData) != null && ei.price ? (openBlock(), createElementBlock("div", _hoisted_30$3, [
                      createElementVNode("div", null, [
                        (Ze = $e.hoveredData) != null && Ze.offer_price ? (openBlock(), createElementBlock("div", _hoisted_33$2, [
                          createElementVNode("div", _hoisted_34$2, [
                            createTextVNode(toDisplayString(unref(getPrice)((Ke = $e.hoveredData) == null ? void 0 : Ke.price)) + " ", 1),
                            createElementVNode("span", null, toDisplayString(unref(currencySymbol)()), 1)
                          ]),
                          createElementVNode("div", _hoisted_35$2, [
                            createTextVNode(toDisplayString(unref(getPrice)((ii = $e.hoveredData) == null ? void 0 : ii.offer_price)) + " ", 1),
                            createElementVNode("span", null, toDisplayString(unref(currencySymbol)()), 1)
                          ])
                        ])) : (openBlock(), createElementBlock("div", _hoisted_31$3, [
                          Number((Ue = $e.hoveredData) == null ? void 0 : Ue.price) > 0 ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                            createTextVNode(toDisplayString(unref(getPrice)($e.hoveredData.price)) + " ", 1),
                            createElementVNode("span", null, toDisplayString(unref(currencySymbol)()), 1)
                          ], 64)) : (openBlock(), createElementBlock("div", _hoisted_32$2, toDisplayString(unref(tr)("available")), 1))
                        ]))
                      ])
                    ])) : createCommentVNode("", !0)
                  ], 64))
                ]),
                createElementVNode("div", _hoisted_36$2, [
                  createElementVNode("div", _hoisted_37$2, toDisplayString(unref(getArea)(((ni = (oi = $e.hoveredData) == null ? void 0 : oi.type) == null ? void 0 : ni.area_m2) ?? "")) + " " + toDisplayString(unref(getAreaUnitLabel)()) + "² ", 1)
                ])
              ])) : createCommentVNode("", !0)
            ])) : createCommentVNode("", !0)
          ];
        }),
        _: 1
      })
    ]));
  }
}), _export_sfc = ($e, _e) => {
  const ke = $e.__vccOpts || $e;
  for (const [Be, Ne] of _e)
    ke[Be] = Ne;
  return ke;
}, _sfc_main$1f = {}, _hoisted_1$18 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "55",
  height: "55",
  viewBox: "0 0 55 55",
  fill: "none",
  webcrx: ""
};
function _sfc_render$s($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$18, [..._e[0] || (_e[0] = [
    createStaticVNode('<path d="M6 7V49H48" stroke="#263A45" stroke-width="2"></path><path d="M10.9149 19.9574L19.4043 11.4681" stroke="#263A45" stroke-width="2"></path><path d="M10.9149 28L27.4468 11.4681" stroke="#263A45" stroke-width="2"></path><path d="M10.9149 35.5957L35.0426 11.4681" stroke="#263A45" stroke-width="2"></path><path d="M18.9574 43.6383L43.0851 19.0638" stroke="#263A45" stroke-width="2"></path><path d="M26.5532 43.6383L43.0851 27.1064" stroke="#263A45" stroke-width="2"></path><path d="M34.1489 43.6383L43.0851 34.7021" stroke="#263A45" stroke-width="2"></path><path d="M43.0851 11.4681L10.9149 43.6383" stroke="#263A45" stroke-width="2"></path>', 8)
  ])]);
}
const Area = /* @__PURE__ */ _export_sfc(_sfc_main$1f, [["render", _sfc_render$s]]), _sfc_main$1e = {}, _hoisted_1$17 = {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  fill: "#000000",
  width: "800px",
  height: "800px",
  viewBox: "0 -11.47 122.88 122.88",
  version: "1.1",
  id: "Layer_1",
  style: { "enable-background": "new 0 0 122.88 99.94" },
  "xml:space": "preserve",
  webcrx: ""
};
function _sfc_render$r($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$17, [..._e[0] || (_e[0] = [
    createElementVNode("g", null, [
      createElementVNode("path", { d: "M4.22,67.36h114.31v-4.67c0-1.13-0.22-2.18-0.61-3.12c-0.42-1-1.04-1.89-1.81-2.66c-0.47-0.47-1-0.9-1.57-1.28 c-0.58-0.39-1.2-0.73-1.85-1.02c-1.75-0.38-3.49-0.74-5.22-1.08c-1.74-0.34-3.49-0.66-5.25-0.96c-0.08-0.01-0.14-0.02-0.22-0.04 c-0.89-0.15-1.74-0.29-2.55-0.42c-0.81-0.13-1.67-0.26-2.57-0.4l-0.02,0c-6.12-0.78-12.22-1.38-18.31-1.78 c-6.1-0.4-12.17-0.6-18.2-0.61c-3.58,0-7.15,0.06-10.72,0.2c-3.55,0.14-7.12,0.34-10.69,0.62l-0.02,0 c-3.34,0.31-6.67,0.7-10.01,1.15c-3.33,0.45-6.67,0.98-10.03,1.57l-0.37,0.09c-0.07,0.02-0.14,0.03-0.2,0.03 c-0.06,0.01-0.12,0.01-0.18,0.01c-1.57,0.28-3.18,0.59-4.84,0.92c-1.61,0.32-3.22,0.66-4.82,1.01c-0.4,0.22-0.78,0.47-1.14,0.73 c-0.36,0.27-0.71,0.56-1.02,0.87v0c-0.67,0.67-1.2,1.44-1.56,2.3c-0.34,0.81-0.53,1.71-0.53,2.69V67.36L4.22,67.36z M14.2,0h92.99 c1.21,0,2.37,0.24,3.43,0.68c1.1,0.46,2.09,1.13,2.92,1.95c0.83,0.83,1.5,1.82,1.95,2.92c0.44,1.06,0.68,2.22,0.68,3.43v42.69 c0.51,0.3,1.01,0.63,1.47,0.99c0.52,0.4,1.01,0.82,1.46,1.27c1.16,1.16,2.1,2.51,2.73,4.03c0.6,1.43,0.93,3.02,0.93,4.74v6.09 c0.03,0.1,0.06,0.2,0.08,0.3l0,0.02c0.02,0.13,0.03,0.25,0.03,0.37c0,0.13-0.01,0.26-0.04,0.39l0,0c-0.02,0.1-0.05,0.2-0.08,0.3 v27.66c0,0.58-0.24,1.11-0.62,1.49c-0.38,0.38-0.91,0.62-1.49,0.62h-4.35c-0.49,0-0.94-0.17-1.3-0.45 c-0.36-0.28-0.63-0.68-0.74-1.14c-0.8-2.3-1.61-4.12-2.48-5.54c-0.86-1.4-1.78-2.4-2.84-3.11c-1.07-0.71-2.35-1.16-3.9-1.43 c-1.58-0.28-3.42-0.37-5.61-0.36l-79.76,0.1l-0.04,0c-1.57-0.03-2.86,0.17-3.94,0.59c-1.07,0.42-1.94,1.05-2.66,1.86 c-0.81,0.9-1.49,2.05-2.11,3.39c-0.63,1.37-1.2,2.93-1.77,4.64l0,0c-0.14,0.44-0.42,0.79-0.77,1.04c-0.33,0.24-0.73,0.38-1.14,0.4 c-0.03,0.01-0.06,0.01-0.09,0.01H2.11c-0.58,0-1.11-0.24-1.49-0.62C0.24,98.94,0,98.41,0,97.83V61.52c0-1.57,0.3-3.01,0.84-4.31 c0.58-1.38,1.43-2.61,2.49-3.67c0.3-0.3,0.63-0.6,0.98-0.88c0.3-0.24,0.6-0.47,0.92-0.68V8.89c0-1.21,0.24-2.36,0.68-3.4 c0.46-1.09,1.13-2.07,1.96-2.89c0.83-0.82,1.82-1.47,2.91-1.92C11.84,0.24,12.99,0,14.2,0L14.2,0z M107.19,4.22H14.2 c-0.65,0-1.27,0.13-1.84,0.36c-0.59,0.24-1.11,0.59-1.55,1.02c-0.43,0.42-0.78,0.94-1.02,1.5C9.57,7.65,9.45,8.25,9.45,8.89v41.06 c0.3-0.1,0.6-0.18,0.91-0.26c0.49-0.13,0.98-0.24,1.47-0.32c0.68-0.12,1.42-0.25,2.22-0.39c0.6-0.1,1.24-0.21,1.9-0.31V38.19 c0-1.58,0.32-3.09,0.89-4.47c0.6-1.44,1.47-2.73,2.55-3.81c1.08-1.08,2.37-1.95,3.81-2.55c1.38-0.57,2.89-0.89,4.47-0.89h19.82 c1.58,0,3.09,0.32,4.47,0.89c1.44,0.6,2.73,1.47,3.81,2.55c1.08,1.08,1.95,2.37,2.55,3.81c0.57,1.38,0.89,2.89,0.89,4.47v6.69 c0.7-0.01,1.4-0.01,2.11-0.01v-6.68c0-1.58,0.32-3.09,0.89-4.47c0.6-1.44,1.47-2.73,2.55-3.81c1.08-1.08,2.37-1.95,3.81-2.55 c1.38-0.57,2.89-0.89,4.47-0.89h19.82c1.58,0,3.09,0.32,4.47,0.89c1.44,0.6,2.73,1.47,3.81,2.55c1.08,1.08,1.95,2.37,2.55,3.81 c0.57,1.38,0.89,2.89,0.89,4.47v10.34c0.75,0.11,1.55,0.24,2.41,0.38c0.95,0.15,1.86,0.3,2.74,0.45c0.45,0.08,0.91,0.17,1.37,0.28 c0.29,0.07,0.57,0.14,0.84,0.22V8.98c0-0.64-0.13-1.25-0.36-1.81c-0.24-0.58-0.6-1.1-1.04-1.55c-0.44-0.44-0.97-0.8-1.54-1.04 C108.44,4.35,107.83,4.22,107.19,4.22L107.19,4.22z M43.21,45.56c2.01-0.15,4.03-0.28,6.08-0.38c1.89-0.1,3.8-0.17,5.71-0.22v-6.77 c0-1.01-0.2-1.98-0.57-2.86c-0.38-0.92-0.94-1.74-1.64-2.44c-0.69-0.69-1.52-1.25-2.44-1.64c-0.88-0.37-1.85-0.57-2.86-0.57H27.67 c-1.01,0-1.98,0.2-2.86,0.57c-0.92,0.38-1.74,0.94-2.44,1.64c-0.69,0.69-1.25,1.52-1.64,2.44c-0.37,0.88-0.57,1.85-0.57,2.86V48 c1.62-0.24,3.26-0.46,4.94-0.68c1.81-0.23,3.61-0.44,5.39-0.64c0.69-0.08,1.43-0.17,2.2-0.25c0.72-0.08,1.47-0.15,2.27-0.23 c1.36-0.13,2.71-0.25,4.04-0.36C40.37,45.75,41.77,45.65,43.21,45.56L43.21,45.56z M65.54,44.9c1.21,0.02,2.42,0.05,3.63,0.09 c1.34,0.04,2.68,0.1,4.01,0.16l0.01,0c2.19,0.08,4.33,0.18,6.41,0.3c2.08,0.12,4.11,0.27,6.05,0.44c2.82,0.25,5.55,0.55,8.14,0.9 c2.32,0.32,4.52,0.68,6.58,1.08v-9.68c0-1.01-0.2-1.98-0.57-2.86c-0.38-0.92-0.94-1.74-1.64-2.44c-0.69-0.69-1.52-1.25-2.44-1.64 c-0.88-0.37-1.85-0.57-2.86-0.57H73.05c-1.01,0-1.98,0.2-2.86,0.57c-0.92,0.38-1.74,0.94-2.44,1.64c-0.69,0.69-1.25,1.52-1.64,2.44 c-0.37,0.88-0.57,1.85-0.57,2.86V44.9L65.54,44.9z M118.54,71.59H4.22v24.13h1.43c0.56-1.58,1.14-3.05,1.79-4.36 c0.7-1.4,1.49-2.64,2.45-3.71c1.14-1.28,2.48-2.27,4.09-2.93c1.61-0.65,3.49-0.98,5.75-0.93l79.69-0.1c2.57,0,4.77,0.12,6.69,0.49 c1.95,0.37,3.63,1,5.14,2c1.4,0.93,2.6,2.16,3.68,3.77c1.03,1.54,1.95,3.43,2.83,5.76h0.76V71.59L118.54,71.59z" })
    ], -1)
  ])]);
}
const Bed = /* @__PURE__ */ _export_sfc(_sfc_main$1e, [["render", _sfc_render$r]]), _sfc_main$1d = {}, _hoisted_1$16 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "800px",
  height: "800px",
  viewBox: "0 0 24 24",
  fill: "none",
  webcrx: ""
};
function _sfc_render$q($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$16, [..._e[0] || (_e[0] = [
    createElementVNode("path", {
      d: "M11.7255 17.1019C11.6265 16.8844 11.4215 16.7257 11.1734 16.6975C10.9633 16.6735 10.7576 16.6285 10.562 16.5636C10.4743 16.5341 10.392 16.5019 10.3158 16.4674L10.4424 16.1223C10.5318 16.1622 10.6239 16.1987 10.7182 16.2317L10.7221 16.2331L10.7261 16.2344C11.0287 16.3344 11.3265 16.3851 11.611 16.3851C11.8967 16.3851 12.1038 16.3468 12.2629 16.2647L12.2724 16.2598L12.2817 16.2544C12.5227 16.1161 12.661 15.8784 12.661 15.6021C12.661 15.2955 12.4956 15.041 12.2071 14.9035C12.062 14.8329 11.8559 14.7655 11.559 14.6917C11.2545 14.6147 10.9987 14.533 10.8003 14.4493C10.6553 14.3837 10.5295 14.279 10.4161 14.1293C10.3185 13.9957 10.2691 13.7948 10.2691 13.5319C10.2691 13.2147 10.3584 12.9529 10.5422 12.7315C10.7058 12.5375 10.9381 12.4057 11.2499 12.3318C11.4812 12.277 11.6616 12.1119 11.7427 11.8987C11.8344 12.1148 12.0295 12.2755 12.2723 12.3142C12.4751 12.3465 12.6613 12.398 12.8287 12.4677L12.7122 12.8059C12.3961 12.679 12.085 12.6149 11.7841 12.6149C10.7848 12.6149 10.7342 13.3043 10.7342 13.4425C10.7342 13.7421 10.896 13.9933 11.1781 14.1318L11.186 14.1357L11.194 14.1393C11.3365 14.2029 11.5387 14.2642 11.8305 14.3322C12.1322 14.4004 12.3838 14.4785 12.5815 14.5651L12.5856 14.5669L12.5897 14.5686C12.7365 14.6297 12.8624 14.7317 12.9746 14.8805L12.9764 14.8828L12.9782 14.8852C13.0763 15.012 13.1261 15.2081 13.1261 15.4681C13.1261 15.7682 13.0392 16.0222 12.8604 16.2447C12.7053 16.4377 12.4888 16.5713 12.1983 16.6531C11.974 16.7163 11.8 16.8878 11.7255 17.1019Z",
      fill: "#000000"
    }, null, -1),
    createElementVNode("path", {
      d: "M11.9785 18H11.497C11.3893 18 11.302 17.9105 11.302 17.8V17.3985C11.302 17.2929 11.2219 17.2061 11.1195 17.1944C10.8757 17.1667 10.6399 17.115 10.412 17.0394C10.1906 16.9648 9.99879 16.8764 9.83657 16.7739C9.76202 16.7268 9.7349 16.6312 9.76572 16.5472L10.096 15.6466C10.1405 15.5254 10.284 15.479 10.3945 15.5417C10.5437 15.6262 10.7041 15.6985 10.8755 15.7585C11.131 15.8429 11.3762 15.8851 11.611 15.8851C11.8129 15.8851 11.9572 15.8628 12.0437 15.8181C12.1302 15.7684 12.1735 15.6964 12.1735 15.6021C12.1735 15.4929 12.1158 15.411 12.0004 15.3564C11.8892 15.3018 11.7037 15.2422 11.4442 15.1777C11.1104 15.0933 10.8323 15.0039 10.6098 14.9096C10.3873 14.8103 10.1936 14.6514 10.0288 14.433C9.86396 14.2096 9.78156 13.9092 9.78156 13.5319C9.78156 13.095 9.91136 12.7202 10.1709 12.4074C10.4049 12.13 10.7279 11.9424 11.1401 11.8447C11.2329 11.8227 11.302 11.7401 11.302 11.6425V11.2C11.302 11.0895 11.3893 11 11.497 11H11.9785C12.0862 11 12.1735 11.0895 12.1735 11.2V11.6172C12.1735 11.7194 12.2487 11.8045 12.3471 11.8202C12.7082 11.8777 13.0255 11.9866 13.2989 12.1469C13.3765 12.1924 13.4073 12.2892 13.3775 12.3756L13.0684 13.2725C13.0275 13.3914 12.891 13.4417 12.7812 13.3849C12.433 13.2049 12.1007 13.1149 11.7841 13.1149C11.4091 13.1149 11.2216 13.2241 11.2216 13.4425C11.2216 13.5468 11.2773 13.6262 11.3885 13.6809C11.4998 13.7305 11.6831 13.7851 11.9386 13.8447C12.2682 13.9192 12.5464 14.006 12.773 14.1053C12.9996 14.1996 13.1953 14.356 13.3602 14.5745C13.5291 14.7929 13.6136 15.0908 13.6136 15.4681C13.6136 15.8851 13.4879 16.25 13.2365 16.5628C13.0176 16.8354 12.7145 17.0262 12.3274 17.1353C12.2384 17.1604 12.1735 17.2412 12.1735 17.3358V17.8C12.1735 17.9105 12.0862 18 11.9785 18Z",
      fill: "#000000"
    }, null, -1),
    createElementVNode("path", {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M9.59235 5H13.8141C14.8954 5 14.3016 6.664 13.8638 7.679L13.3656 8.843L13.2983 9C13.7702 8.97651 14.2369 9.11054 14.6282 9.382C16.0921 10.7558 17.2802 12.4098 18.1256 14.251C18.455 14.9318 18.5857 15.6958 18.5019 16.451C18.4013 18.3759 16.8956 19.9098 15.0182 20H8.38823C6.51033 19.9125 5.0024 18.3802 4.89968 16.455C4.81587 15.6998 4.94656 14.9358 5.27603 14.255C6.12242 12.412 7.31216 10.7565 8.77823 9.382C9.1696 9.11054 9.63622 8.97651 10.1081 9L10.0301 8.819L9.54263 7.679C9.1068 6.664 8.5101 5 9.59235 5Z",
      stroke: "#000000",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1),
    createElementVNode("path", {
      d: "M13.2983 9.75C13.7125 9.75 14.0483 9.41421 14.0483 9C14.0483 8.58579 13.7125 8.25 13.2983 8.25V9.75ZM10.1081 8.25C9.69391 8.25 9.35812 8.58579 9.35812 9C9.35812 9.41421 9.69391 9.75 10.1081 9.75V8.25ZM15.9776 8.64988C16.3365 8.44312 16.4599 7.98455 16.2531 7.62563C16.0463 7.26671 15.5878 7.14336 15.2289 7.35012L15.9776 8.64988ZM13.3656 8.843L13.5103 9.57891L13.5125 9.57848L13.3656 8.843ZM10.0301 8.819L10.1854 8.08521L10.1786 8.08383L10.0301 8.819ZM8.166 7.34357C7.80346 7.14322 7.34715 7.27469 7.1468 7.63722C6.94644 7.99976 7.07791 8.45607 7.44045 8.65643L8.166 7.34357ZM13.2983 8.25H10.1081V9.75H13.2983V8.25ZM15.2289 7.35012C14.6019 7.71128 13.9233 7.96683 13.2187 8.10752L13.5125 9.57848C14.3778 9.40568 15.2101 9.09203 15.9776 8.64988L15.2289 7.35012ZM13.2209 8.10709C12.2175 8.30441 11.1861 8.29699 10.1854 8.08525L9.87486 9.55275C11.0732 9.80631 12.3086 9.81521 13.5103 9.57891L13.2209 8.10709ZM10.1786 8.08383C9.47587 7.94196 8.79745 7.69255 8.166 7.34357L7.44045 8.65643C8.20526 9.0791 9.02818 9.38184 9.88169 9.55417L10.1786 8.08383Z",
      fill: "#000000"
    }, null, -1)
  ])]);
}
const MoneyBag = /* @__PURE__ */ _export_sfc(_sfc_main$1d, [["render", _sfc_render$q]]), _hoisted_1$15 = {
  key: 0,
  class: "irep-tooltip-2__floor ire-flex ire-flex-col ire-items-center !ire-text-sm"
}, _hoisted_2$C = { class: "irep-tooltip-2__floor-header ire-flex ire-w-full ire-items-center ire-justify-evenly ire-p-4" }, _hoisted_3$s = { class: "irep-tooltip-2__floor-number ire-text-3xl ire-capitalize" }, _hoisted_4$o = {
  key: 0,
  class: "irep-tooltip-2__floor-conf ire-text-2xl ire-uppercase"
}, _hoisted_5$l = { key: 1 }, _hoisted_6$i = { class: "irep-tooltip-2__floor-starting ire-text-sm ire-text-gray-400" }, _hoisted_7$i = { class: "irep-tooltip-2__floor-price" }, _hoisted_8$g = { class: "ire-right-[2px] ire-text-gray-200" }, _hoisted_9$e = { class: "irep-tooltip-2__floor-stats ire-flex ire-items-center ire-justify-between ire-gap-2 ire-bg-gray-800 ire-p-2" }, _hoisted_10$c = { class: "irep-tooltip-2__floor-status ire-flex ire-gap-1 ire-text-center ire-text-sm" }, _hoisted_11$9 = { class: "irep-tooltip-2__floor-status ire-flex ire-gap-1 ire-text-center ire-text-sm" }, _hoisted_12$7 = { class: "irep-tooltip-2__floor-status ire-flex ire-gap-1 ire-text-center ire-text-sm" }, _hoisted_13$5 = {
  key: 1,
  class: "irep-tooltip-2__block ire-flex ire-items-center ire-gap-3 ire-p-4 !ire-text-sm"
}, _hoisted_14$5 = { class: "irep-tooltip-2__block-inner ire-flex ire-w-max ire-flex-col ire-items-center" }, _hoisted_15$4 = { class: "irep-tooltip-2__block-title" }, _hoisted_16$4 = { class: "irep-tooltip-2__block-conf ire-text-gray-300 ire-opacity-80" }, _hoisted_17$4 = {
  key: 2,
  class: "irep-tooltip-2__flat ire-flex ire-w-full ire-max-w-[300px] ire-flex-col ire-items-center ire-gap-1"
}, _hoisted_18$3 = { class: "irep-tooltip-2__flat-inner ire-flex ire-flex-col ire-items-center ire-gap-4 ire-p-4" }, _hoisted_19$3 = { class: "irep-tooltip-2__flat-number ire-text-center ire-text-lg ire-capitalize" }, _hoisted_20$3 = { class: "irep-tooltip-2__flat-attrs ire-grid ire-grid-cols-2 ire-gap-x-8 ire-gap-y-2" }, _hoisted_21$3 = { class: "irep-tooltip-2__flat-attr-item ire-flex ire-items-center ire-gap-1" }, _hoisted_22$3 = { class: "irep-tooltip-2__flat-attr-icon ire-flex ire-items-center ire-justify-center" }, _hoisted_23$3 = {
  key: 0,
  class: "irep-tooltip-2__flat-conf ire-uppercase"
}, _hoisted_24$3 = {
  key: 1,
  class: "min-w-max"
}, _hoisted_25$3 = { key: 0 }, _hoisted_26$3 = { class: "irep-tooltip-2__flat-price-original ire-text-sm ire-line-through" }, _hoisted_27$3 = { class: "irep-tooltip-2__flat-price ire-flex ire-gap-1 ire-text-center" }, _hoisted_28$2 = { class: "ire-right-[2px]" }, _hoisted_29$2 = {
  key: 1,
  class: "irep-tooltip-2__flat-price ire-flex ire-items-center ire-gap-1"
}, _hoisted_30$2 = { class: "ire-right-[2px]" }, _hoisted_31$2 = {
  key: 2,
  class: "irep-tooltip-2__flat-available ire-uppercase"
}, _hoisted_32$1 = {
  key: 0,
  class: "ire-flex ire-items-center ire-gap-1"
}, _hoisted_33$1 = { class: "irep-tooltip-2__flat-attr-icon ire-flex ire-items-center ire-justify-center" }, _hoisted_34$1 = { class: "irep-tooltip-2__flat-area" }, _hoisted_35$1 = { class: "ire-right-[2px] ire-flex ire-items-center ire-gap-1" }, _hoisted_36$1 = {
  key: 1,
  class: "ire-flex ire-items-center ire-gap-2"
}, _hoisted_37$1 = { class: "irep-tooltip-2__flat-attr-icon ire-flex ire-items-center ire-justify-center" }, _hoisted_38$1 = {
  key: 0,
  class: "irep-tooltip-2__flat-room-count ire-min-w-max ire-capitalize"
}, _sfc_main$1c = /* @__PURE__ */ defineComponent({
  __name: "Tooltip_2",
  props: {
    hoveredData: {},
    type: {},
    mouseTrack: { type: Boolean }
  },
  setup($e) {
    const _e = $e, ke = inject("mouseX"), Be = inject("mouseY"), Ne = computed(() => {
      var Ve;
      return tr((Ve = _e.hoveredData) == null ? void 0 : Ve.conf);
    });
    return (Ve, Le) => {
      var De, Ae, Ie, Re, ze, je, Fe, He, Ge, qe, Xe, Ye, We, Je, ri, Qe, ti, ei, Ze, Ue, Ke, ii, oi, ni, pi, ci, fi, hi, ui, ai, di, gi;
      return $e.type && $e.hoveredData && $e.type !== "tooltip" ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(["irep-tooltip-2__wrapper ire-pointer-events-none ire-absolute ire-select-none", {
          "ire-left-0 ire-top-0": $e.mouseTrack,
          "ire-bottom-4 ire-right-4": !$e.mouseTrack
        }]),
        style: normalizeStyle(
          $e.mouseTrack ? {
            transform: `translateX(${unref(ke) || 0}px) translateY(${unref(Be) || 0}px)`
          } : {}
        )
      }, [
        createElementVNode("div", {
          class: normalizeClass(["irep-tooltip irep-tooltip-2 ire-flex ire-origin-top ire-items-center ire-justify-center ire-bg-black ire-text-white ire-transition-transform ire-duration-500 ire-ease-in-out", { "": $e.mouseTrack }])
        }, [
          $e.type === "floor" ? (openBlock(), createElementBlock("div", _hoisted_1$15, [
            createElementVNode("div", _hoisted_2$C, [
              createElementVNode("div", _hoisted_3$s, toDisplayString((De = $e.hoveredData) == null ? void 0 : De.floor_number), 1),
              Le[0] || (Le[0] = createElementVNode("span", null, "|", -1)),
              Ne.value ? (openBlock(), createElementBlock("div", _hoisted_4$o, toDisplayString(Ne.value), 1)) : (openBlock(), createElementBlock("div", _hoisted_5$l, [
                createElementVNode("div", _hoisted_6$i, toDisplayString(unref(tr)("starting from")) + ": ", 1),
                createElementVNode("div", _hoisted_7$i, [
                  createTextVNode(toDisplayString(unref(getPrice)(+((Ie = (Ae = $e.hoveredData) == null ? void 0 : Ae.counts) == null ? void 0 : Ie.minimum_price) || 0)) + " ", 1),
                  createElementVNode("span", _hoisted_8$g, toDisplayString(unref(currencySymbol)()), 1)
                ])
              ]))
            ]),
            createElementVNode("div", _hoisted_9$e, [
              createElementVNode("div", _hoisted_10$c, [
                createElementVNode("span", null, toDisplayString(Ne.value ? 0 : ((ze = (Re = $e.hoveredData) == null ? void 0 : Re.counts) == null ? void 0 : ze.available) || 0), 1),
                createTextVNode(" " + toDisplayString(unref(tr)("available")), 1)
              ]),
              Le[1] || (Le[1] = createElementVNode("span", null, "•", -1)),
              createElementVNode("div", _hoisted_11$9, [
                createElementVNode("span", null, toDisplayString(Ne.value === "sold" ? ((Fe = (je = $e.hoveredData) == null ? void 0 : je.flats) == null ? void 0 : Fe.length) || 0 : ((Ge = (He = $e.hoveredData) == null ? void 0 : He.counts) == null ? void 0 : Ge.sold) || 0), 1),
                createTextVNode(" " + toDisplayString(unref(tr)("sold")), 1)
              ]),
              Le[2] || (Le[2] = createElementVNode("span", null, "•", -1)),
              createElementVNode("div", _hoisted_12$7, [
                createElementVNode("span", null, toDisplayString(Ne.value === "reserved" ? ((Xe = (qe = $e.hoveredData) == null ? void 0 : qe.flats) == null ? void 0 : Xe.length) || 0 : ((We = (Ye = $e.hoveredData) == null ? void 0 : Ye.counts) == null ? void 0 : We.reserved) || 0), 1),
                createTextVNode(" " + toDisplayString(unref(tr)("reserved")), 1)
              ])
            ])
          ])) : $e.type === "block" ? (openBlock(), createElementBlock("div", _hoisted_13$5, [
            createElementVNode("div", _hoisted_14$5, [
              createElementVNode("div", _hoisted_15$4, toDisplayString((Je = $e.hoveredData) == null ? void 0 : Je.title), 1),
              createElementVNode("span", _hoisted_16$4, toDisplayString(Ne.value), 1)
            ])
          ])) : $e.type === "flat" ? (openBlock(), createElementBlock("div", _hoisted_17$4, [
            createElementVNode("div", _hoisted_18$3, [
              createElementVNode("div", _hoisted_19$3, toDisplayString((ri = $e.hoveredData) == null ? void 0 : ri.flat_number), 1),
              createElementVNode("div", _hoisted_20$3, [
                createElementVNode("div", _hoisted_21$3, [
                  createElementVNode("div", _hoisted_22$3, [
                    createVNode(MoneyBag, { class: "ire-size-5 [&_path]:ire-stroke-white" })
                  ]),
                  Ne.value ? (openBlock(), createElementBlock("div", _hoisted_23$3, toDisplayString(Ne.value), 1)) : (Qe = $e.hoveredData) != null && Qe.request_price ? (openBlock(), createElementBlock("div", _hoisted_24$3, toDisplayString(unref(tr)("Request Price")), 1)) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
                    (ti = $e.hoveredData) != null && ti.offer_price && Number((ei = $e.hoveredData) == null ? void 0 : ei.offer_price) > 0 ? (openBlock(), createElementBlock("div", _hoisted_25$3, [
                      createElementVNode("div", _hoisted_26$3, [
                        createTextVNode(toDisplayString(unref(getPrice)(+((Ze = $e.hoveredData) == null ? void 0 : Ze.price))) + " ", 1),
                        createElementVNode("span", null, toDisplayString(unref(currencySymbol)()), 1)
                      ]),
                      createElementVNode("div", _hoisted_27$3, [
                        createTextVNode(toDisplayString(unref(getPrice)(+((Ue = $e.hoveredData) == null ? void 0 : Ue.offer_price))) + " ", 1),
                        createElementVNode("span", _hoisted_28$2, toDisplayString(unref(currencySymbol)()), 1)
                      ])
                    ])) : Number((Ke = $e.hoveredData) == null ? void 0 : Ke.price) > 0 ? (openBlock(), createElementBlock("div", _hoisted_29$2, [
                      createTextVNode(toDisplayString(unref(getPrice)(+((ii = $e.hoveredData) == null ? void 0 : ii.price))) + " ", 1),
                      createElementVNode("span", _hoisted_30$2, toDisplayString(unref(currencySymbol)()), 1)
                    ])) : (openBlock(), createElementBlock("div", _hoisted_31$2, toDisplayString(unref(tr)("available")), 1))
                  ], 64))
                ]),
                (ni = (oi = $e.hoveredData) == null ? void 0 : oi.type) != null && ni.area_m2 ? (openBlock(), createElementBlock("div", _hoisted_32$1, [
                  createElementVNode("div", _hoisted_33$1, [
                    createVNode(Area, { class: "ire-size-5 [&_path]:ire-stroke-white" })
                  ]),
                  createElementVNode("div", _hoisted_34$1, [
                    createElementVNode("span", _hoisted_35$1, toDisplayString(unref(getArea)(((ci = (pi = $e.hoveredData) == null ? void 0 : pi.type) == null ? void 0 : ci.area_m2) ?? "")) + " " + toDisplayString(unref(getAreaUnitLabel)()) + "² ", 1)
                  ])
                ])) : createCommentVNode("", !0),
                (hi = (fi = $e.hoveredData) == null ? void 0 : fi.type) != null && hi.rooms_count ? (openBlock(), createElementBlock("div", _hoisted_36$1, [
                  createElementVNode("div", _hoisted_37$1, [
                    createVNode(Bed, { class: "ire-size-5 [&_path]:ire-fill-white" })
                  ]),
                  (ai = (ui = $e.hoveredData) == null ? void 0 : ui.type) != null && ai.rooms_count ? (openBlock(), createElementBlock("div", _hoisted_38$1, toDisplayString(unref(tr)("room")) + ": " + toDisplayString(unref(getRoomCount)(
                    ((gi = (di = $e.hoveredData) == null ? void 0 : di.type) == null ? void 0 : gi.rooms_count) ?? ""
                  )), 1)) : createCommentVNode("", !0)
                ])) : createCommentVNode("", !0)
              ])
            ])
          ])) : createCommentVNode("", !0)
        ], 2)
      ], 6)) : createCommentVNode("", !0);
    };
  }
}), _hoisted_1$14 = { class: "irep-tooltip irep-tooltip-3 ire-flex ire-w-fit ire-origin-top ire-items-center ire-justify-center ire-rounded-2xl ire-border ire-bg-white ire-p-4 ire-transition-transform ire-duration-500 ire-ease-in-out" }, _hoisted_2$B = {
  key: 0,
  class: "irep-tooltip-3__floor ire-flex ire-flex-col ire-items-center ire-gap-3"
}, _hoisted_3$r = { class: "irep-tooltip-3__floor-inner ire-flex ire-flex-col ire-items-center" }, _hoisted_4$n = { class: "irep-tooltip-3__floor-number !ire-text-2xl" }, _hoisted_5$k = { class: "irep-tooltip-3__floor-text !ire-text-sm ire-uppercase" }, _hoisted_6$h = {
  key: 1,
  class: "irep-tooltip-3__block ire-flex ire-items-center ire-gap-3"
}, _hoisted_7$h = { class: "irep-tooltip-3__block-inner ire-flex ire-w-max ire-flex-col ire-items-center" }, _hoisted_8$f = { class: "irep-tooltip-3__block-title !text-2xl" }, _hoisted_9$d = {
  key: 2,
  class: "irep-tooltip-3__flat ire-flex ire-w-full ire-flex-col ire-items-center ire-gap-3"
}, _hoisted_10$b = { class: "irep-tooltip-3__flat-inner ire-flex ire-flex-col ire-items-center" }, _hoisted_11$8 = { class: "irep-tooltip-3__flat-number ire-max-w-52 ire-text-center !ire-text-2xl ire-capitalize" }, _hoisted_12$6 = { class: "irep-tooltip-3__flat-text !ire-mt-2 ire-text-sm ire-uppercase" }, _sfc_main$1b = /* @__PURE__ */ defineComponent({
  __name: "Tooltip_3",
  props: {
    hoveredData: {},
    type: {}
  },
  setup($e) {
    const _e = inject("mouseX"), ke = inject("mouseY");
    return (Be, Ne) => {
      var Ve, Le, De;
      return $e.type && $e.hoveredData && $e.type !== "tooltip" ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: "irep-tooltip-3__wrapper ire-pointer-events-none ire-absolute ire-left-0 ire-top-0 ire-select-none",
        style: normalizeStyle({
          transform: `translateX(${unref(_e) || 0}px) translateY(${unref(ke) || 0}px)`
        })
      }, [
        createElementVNode("div", _hoisted_1$14, [
          $e.type === "floor" ? (openBlock(), createElementBlock("div", _hoisted_2$B, [
            createElementVNode("div", _hoisted_3$r, [
              createElementVNode("div", _hoisted_4$n, toDisplayString((Ve = $e.hoveredData) == null ? void 0 : Ve.floor_number), 1),
              createElementVNode("div", _hoisted_5$k, toDisplayString(unref(tr)("floor")), 1)
            ])
          ])) : $e.type === "block" ? (openBlock(), createElementBlock("div", _hoisted_6$h, [
            createElementVNode("div", _hoisted_7$h, [
              createElementVNode("div", _hoisted_8$f, toDisplayString((Le = $e.hoveredData) == null ? void 0 : Le.title), 1)
            ])
          ])) : $e.type === "flat" ? (openBlock(), createElementBlock("div", _hoisted_9$d, [
            createElementVNode("div", _hoisted_10$b, [
              createElementVNode("div", _hoisted_11$8, toDisplayString((De = $e.hoveredData) == null ? void 0 : De.flat_number), 1),
              createElementVNode("div", _hoisted_12$6, toDisplayString(unref(tr)("apartment")), 1)
            ])
          ])) : createCommentVNode("", !0)
        ])
      ], 4)) : createCommentVNode("", !0);
    };
  }
}), _sfc_main$1a = {}, _hoisted_1$13 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "800px",
  height: "800px",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "#000000",
  "stroke-width": "1",
  "stroke-linecap": "round",
  "stroke-linejoin": "miter",
  webcrx: ""
};
function _sfc_render$p($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$13, [..._e[0] || (_e[0] = [
    createElementVNode("polygon", {
      points: "3 7 12 2 21 7 12 12 3 7",
      fill: "#059cf7",
      opacity: "0.1",
      "stroke-width": "0"
    }, null, -1),
    createElementVNode("polygon", { points: "3 7 12 2 21 7 12 12 3 7" }, null, -1),
    createElementVNode("polyline", { points: "21 12 12 17 3 12" }, null, -1),
    createElementVNode("polyline", { points: "21 17 12 22 3 17" }, null, -1)
  ])]);
}
const Floor = /* @__PURE__ */ _export_sfc(_sfc_main$1a, [["render", _sfc_render$p]]), _sfc_main$19 = /* @__PURE__ */ defineComponent({
  __name: "Badge",
  props: {
    conf: {}
  },
  setup($e) {
    const _e = $e, ke = useGlobalStore(), Be = {
      reserved: "reserved",
      sold: "sold",
      available: "available"
    }, Ne = computed(() => _e.conf === "reserved" ? ke.getMetaValue("reserved_color") || "rgba(255, 247, 89, 0.53)" : _e.conf === "sold" ? ke.getMetaValue("sold_color") || "rgba(219, 64, 64, 0.45)" : getCustomTypeColor(_e.conf) || "rgba(0, 0, 0, 0.2)"), Ve = computed(() => tr(Be[_e.conf]) || tr(_e.conf)), Le = computed(() => {
      if (!Ne.value) return {};
      const De = Ne.value.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
      );
      if (De) {
        const [, Ae, Ie, Re, ze] = De;
        return {
          backgroundColor: `rgba(${Ae}, ${Ie}, ${Re}, 1)`,
          color: "#fff",
          boxShadow: "none"
        };
      }
      return {
        backgroundColor: Ne.value,
        color: Ne.value,
        boxShadow: "none"
      };
    });
    return (De, Ae) => Ve.value ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: "irep-badge ire-inline-flex ire-min-w-max ire-items-center ire-rounded-full ire-px-2 ire-py-1 ire-text-xs ire-uppercase",
      style: normalizeStyle(Le.value)
    }, toDisplayString(Ve.value), 5)) : createCommentVNode("", !0);
  }
}), _hoisted_1$12 = { class: "irep-tooltip irep-tooltip-4 ire-flex ire-min-w-[12.5rem] ire-max-w-[18rem] ire-origin-top ire-flex-col ire-overflow-hidden ire-rounded-lg ire-border ire-border-gray-200/90 ire-bg-white ire-text-gray-800 ire-shadow-lg ire-transition-transform ire-duration-500 ire-ease-in-out" }, _hoisted_2$A = { class: "irep-tooltip-4__floor-header ire-flex ire-flex-col ire-gap-1 ire-px-4 ire-pb-3 ire-pt-4" }, _hoisted_3$q = { class: "irep-tooltip-4__floor-title-row ire-flex ire-items-baseline ire-justify-between ire-gap-3" }, _hoisted_4$m = { class: "irep-tooltip-4__floor-number-col ire-flex ire-flex-col ire-gap-0.5" }, _hoisted_5$j = { class: "ire-text-xs ire-font-semibold ire-uppercase ire-tracking-wide ire-text-gray-500" }, _hoisted_6$g = { class: "ire-text-3xl ire-font-semibold ire-tabular-nums ire-leading-none ire-text-gray-900" }, _hoisted_7$g = {
  key: 0,
  class: "irep-tooltip-4__floor-conf ire-shrink-0 ire-rounded-md ire-bg-gray-100 ire-px-2.5 ire-py-1 ire-text-sm ire-font-semibold ire-uppercase ire-tracking-wide ire-text-gray-800"
}, _hoisted_8$e = {
  key: 1,
  class: "irep-tooltip-4__floor-price-section ire-min-w-0 ire-text-right"
}, _hoisted_9$c = { class: "irep-tooltip-4__floor-starting-label ire-text-xs ire-font-medium ire-text-gray-500" }, _hoisted_10$a = { class: "irep-tooltip-4__floor-price ire-text-lg ire-font-semibold ire-tabular-nums ire-text-gray-900" }, _hoisted_11$7 = { class: "ire-text-sm ire-font-medium ire-text-gray-500" }, _hoisted_12$5 = { class: "irep-tooltip-4__floor-stats ire-flex ire-items-center ire-justify-between ire-gap-2 ire-border-t ire-border-gray-100 ire-bg-gray-50 ire-px-4 ire-py-2.5 ire-text-sm ire-text-gray-700" }, _hoisted_13$4 = { class: "irep-tooltip-4__floor-stat-item ire-flex ire-flex-1 ire-flex-col ire-items-center ire-gap-0.5" }, _hoisted_14$4 = { class: "ire-text-lg ire-font-semibold ire-tabular-nums ire-text-gray-900" }, _hoisted_15$3 = { class: "ire-text-xs ire-font-medium ire-text-gray-500" }, _hoisted_16$3 = { class: "irep-tooltip-4__floor-stat-item ire-flex ire-flex-1 ire-flex-col ire-items-center ire-gap-0.5" }, _hoisted_17$3 = { class: "ire-text-lg ire-font-semibold ire-tabular-nums ire-text-gray-900" }, _hoisted_18$2 = { class: "ire-text-xs ire-font-medium ire-text-gray-500" }, _hoisted_19$2 = { class: "irep-tooltip-4__floor-stat-item ire-flex ire-flex-1 ire-flex-col ire-items-center ire-gap-0.5" }, _hoisted_20$2 = { class: "ire-text-lg ire-font-semibold ire-tabular-nums ire-text-gray-900" }, _hoisted_21$2 = { class: "ire-text-xs ire-font-medium ire-text-gray-500" }, _hoisted_22$2 = {
  key: 1,
  class: "irep-tooltip-4__block-body ire-px-4 ire-py-3.5"
}, _hoisted_23$2 = { class: "irep-tooltip-4__block-label ire-text-xs ire-font-semibold ire-uppercase ire-tracking-wide ire-text-gray-500" }, _hoisted_24$2 = { class: "irep-tooltip-4__block-title ire-mt-1 ire-text-lg ire-font-semibold ire-leading-snug ire-text-gray-900" }, _hoisted_25$2 = {
  key: 0,
  class: "irep-tooltip-4__block-conf ire-mt-2 ire-inline-flex ire-rounded-md ire-bg-gray-100 ire-px-2.5 ire-py-1 ire-text-sm ire-font-semibold ire-uppercase ire-text-gray-700"
}, _hoisted_26$2 = { class: "irep-tooltip-4__flat-header ire-flex ire-items-start ire-justify-between ire-gap-4 ire-px-3 ire-pt-3" }, _hoisted_27$2 = {
  key: 0,
  class: "ire-text-base ire-font-bold ire-tracking-tight ire-text-gray-900"
}, _hoisted_28$1 = {
  key: 2,
  class: "ire-shrink-0 ire-rounded-full ire-bg-emerald-50 ire-px-2.5 ire-py-0.5 ire-text-xs ire-uppercase ire-tracking-wide ire-text-black"
}, _hoisted_29$1 = { class: "irep-tooltip-4__flat-price-section ire-px-3 ire-pb-3 ire-pt-1" }, _hoisted_30$1 = {
  key: 0,
  class: "irep-tooltip-4__flat-request-price ire-text-sm ire-font-medium ire-text-gray-500"
}, _hoisted_31$1 = {
  key: 0,
  class: "irep-tooltip-4__flat-offer-price ire-flex ire-items-baseline ire-gap-1.5"
}, _hoisted_32 = { class: "irep-tooltip-4__flat-price ire-text-xl ire-font-bold ire-tabular-nums ire-text-gray-900" }, _hoisted_33 = { class: "ire-text-sm ire-font-medium ire-text-gray-500" }, _hoisted_34 = { class: "ire-text-xs ire-tabular-nums ire-text-gray-400 ire-line-through" }, _hoisted_35 = {
  key: 1,
  class: "irep-tooltip-4__flat-price ire-text-xl ire-font-bold ire-tabular-nums ire-text-gray-900"
}, _hoisted_36 = { class: "ire-text-sm ire-font-medium ire-text-gray-500" }, _hoisted_37 = {
  key: 0,
  class: "irep-tooltip-4__flat-stats ire-flex ire-items-stretch ire-border-t ire-border-gray-100"
}, _hoisted_38 = {
  key: 0,
  class: "irep-tooltip-4__flat-stat-item ire-flex ire-flex-1 ire-flex-col ire-gap-1 ire-px-4 ire-py-3 [&:not(:last-child)]:ire-border-r [&:not(:last-child)]:ire-border-gray-100"
}, _hoisted_39 = { class: "ire-text-xs ire-font-medium ire-uppercase ire-tracking-wide ire-text-gray-400" }, _hoisted_40 = { class: "irep-tooltip-4__flat-stat-value ire-flex ire-items-center ire-gap-1.5" }, _hoisted_41 = { class: "ire-min-w-max ire-text-sm ire-font-semibold ire-tabular-nums ire-text-gray-900" }, _hoisted_42 = { class: "ire-text-xs ire-font-normal ire-text-gray-500" }, _hoisted_43 = {
  key: 1,
  class: "irep-tooltip-4__flat-stat-item ire-flex ire-flex-1 ire-flex-col ire-gap-1 ire-px-4 ire-py-3 [&:not(:last-child)]:ire-border-r [&:not(:last-child)]:ire-border-gray-100"
}, _hoisted_44 = { class: "ire-text-xs ire-font-medium ire-uppercase ire-tracking-wide ire-text-gray-400" }, _hoisted_45 = { class: "irep-tooltip-4__flat-stat-value ire-flex ire-items-center ire-gap-1.5" }, _hoisted_46 = { class: "ire-min-w-max ire-text-sm ire-font-semibold ire-tabular-nums ire-text-gray-900" }, _hoisted_47 = {
  key: 2,
  class: "irep-tooltip-4__flat-stat-item ire-flex ire-flex-1 ire-flex-col ire-gap-1 ire-px-4 ire-py-3 [&:not(:last-child)]:ire-border-r [&:not(:last-child)]:ire-border-gray-100"
}, _hoisted_48 = { class: "ire-text-xs ire-font-medium ire-uppercase ire-tracking-wide ire-text-gray-400" }, _hoisted_49 = { class: "irep-tooltip-4__flat-stat-value ire-flex ire-items-center ire-gap-1.5" }, _hoisted_50 = { class: "ire-min-w-max ire-text-sm ire-font-semibold ire-tabular-nums ire-text-gray-900" }, _sfc_main$18 = /* @__PURE__ */ defineComponent({
  __name: "Tooltip_4",
  props: {
    hoveredData: {},
    type: {}
  },
  setup($e) {
    const _e = $e;
    computed(() => {
      var De, Ae, Ie, Re;
      if (_e.type !== "flat" || !_e.hoveredData) return "";
      const Le = _e.hoveredData.type;
      return ((Ae = (De = Le == null ? void 0 : Le.image_2d) == null ? void 0 : De[0]) == null ? void 0 : Ae.url) || ((Re = (Ie = Le == null ? void 0 : Le.image_3d) == null ? void 0 : Ie[0]) == null ? void 0 : Re.url) || "";
    });
    const ke = computed(
      () => _e.type === "floor" ? _e.hoveredData : null
    ), Be = computed(
      () => {
        var Le;
        return tr(((Le = _e.hoveredData) == null ? void 0 : Le.conf) || "");
      }
    ), Ne = inject("mouseX"), Ve = inject("mouseY");
    return (Le, De) => {
      var Ae, Ie, Re, ze, je, Fe, He, Ge, qe, Xe, Ye, We, Je, ri, Qe, ti, ei, Ze, Ue, Ke, ii, oi, ni, pi, ci, fi, hi, ui, ai, di, gi, si, mi, ki, Si;
      return $e.type && $e.hoveredData && $e.type !== "tooltip" ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: "irep-tooltip-4__wrapper ire-pointer-events-none ire-absolute ire-left-0 ire-top-0 ire-select-none",
        style: normalizeStyle({
          transform: `translateX(${unref(Ne) || 0}px) translateY(${unref(Ve) || 0}px)`
        })
      }, [
        createElementVNode("div", _hoisted_1$12, [
          $e.type === "floor" && ke.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createElementVNode("div", _hoisted_2$A, [
              createElementVNode("div", _hoisted_3$q, [
                createElementVNode("div", _hoisted_4$m, [
                  createElementVNode("span", _hoisted_5$j, toDisplayString(unref(tr)("floor")), 1),
                  createElementVNode("span", _hoisted_6$g, toDisplayString(ke.value.floor_number), 1)
                ]),
                Be.value ? (openBlock(), createElementBlock("div", _hoisted_7$g, toDisplayString(Be.value), 1)) : (openBlock(), createElementBlock("div", _hoisted_8$e, [
                  createElementVNode("div", _hoisted_9$c, toDisplayString(unref(tr)("starting from")), 1),
                  createElementVNode("div", _hoisted_10$a, [
                    createTextVNode(toDisplayString(unref(getPrice)(+(((Ae = ke.value.counts) == null ? void 0 : Ae.minimum_price) || 0))) + " ", 1),
                    createElementVNode("span", _hoisted_11$7, toDisplayString(unref(currencySymbol)()), 1)
                  ])
                ]))
              ])
            ]),
            createElementVNode("div", _hoisted_12$5, [
              createElementVNode("div", _hoisted_13$4, [
                createElementVNode("span", _hoisted_14$4, toDisplayString(Be.value ? 0 : ((Ie = ke.value.counts) == null ? void 0 : Ie.available) ?? 0), 1),
                createElementVNode("span", _hoisted_15$3, toDisplayString(unref(tr)("available")), 1)
              ]),
              De[0] || (De[0] = createElementVNode("span", {
                class: "ire-text-gray-300",
                "aria-hidden": "true"
              }, "·", -1)),
              createElementVNode("div", _hoisted_16$3, [
                createElementVNode("span", _hoisted_17$3, toDisplayString(Be.value === "sold" ? ((Re = ke.value.flats) == null ? void 0 : Re.length) || 0 : ((ze = ke.value.counts) == null ? void 0 : ze.sold) ?? 0), 1),
                createElementVNode("span", _hoisted_18$2, toDisplayString(unref(tr)("sold")), 1)
              ]),
              De[1] || (De[1] = createElementVNode("span", {
                class: "ire-text-gray-300",
                "aria-hidden": "true"
              }, "·", -1)),
              createElementVNode("div", _hoisted_19$2, [
                createElementVNode("span", _hoisted_20$2, toDisplayString(Be.value === "reserved" ? ((je = ke.value.flats) == null ? void 0 : je.length) || 0 : ((Fe = ke.value.counts) == null ? void 0 : Fe.reserved) ?? 0), 1),
                createElementVNode("span", _hoisted_21$2, toDisplayString(unref(tr)("reserved")), 1)
              ])
            ])
          ], 64)) : $e.type === "block" ? (openBlock(), createElementBlock("div", _hoisted_22$2, [
            createElementVNode("div", _hoisted_23$2, toDisplayString(unref(tr)("block")), 1),
            createElementVNode("div", _hoisted_24$2, toDisplayString((He = $e.hoveredData) == null ? void 0 : He.title), 1),
            Be.value ? (openBlock(), createElementBlock("div", _hoisted_25$2, toDisplayString(Be.value), 1)) : createCommentVNode("", !0)
          ])) : $e.type === "flat" ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
            createElementVNode("div", _hoisted_26$2, [
              (Ge = $e.hoveredData) != null && Ge.flat_number ? (openBlock(), createElementBlock("span", _hoisted_27$2, toDisplayString($e.hoveredData.flat_number), 1)) : createCommentVNode("", !0),
              (qe = $e.hoveredData) != null && qe.conf ? (openBlock(), createBlock(_sfc_main$19, {
                key: 1,
                conf: $e.hoveredData.conf || ""
              }, null, 8, ["conf"])) : !((Xe = $e.hoveredData) != null && Xe.conf) && !((Ye = $e.hoveredData) != null && Ye.request_price) ? (openBlock(), createElementBlock("span", _hoisted_28$1, toDisplayString(unref(tr)("available")), 1)) : createCommentVNode("", !0)
            ]),
            createElementVNode("div", _hoisted_29$1, [
              (We = $e.hoveredData) != null && We.request_price ? (openBlock(), createElementBlock("div", _hoisted_30$1, toDisplayString(unref(tr)("Request Price")), 1)) : (Je = $e.hoveredData) != null && Je.conf ? createCommentVNode("", !0) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                (ri = $e.hoveredData) != null && ri.offer_price && Number((Qe = $e.hoveredData) == null ? void 0 : Qe.offer_price) > 0 ? (openBlock(), createElementBlock("div", _hoisted_31$1, [
                  createElementVNode("span", _hoisted_32, [
                    createTextVNode(toDisplayString(unref(getPrice)(+((ti = $e.hoveredData) == null ? void 0 : ti.offer_price) || 0)) + " ", 1),
                    createElementVNode("span", _hoisted_33, toDisplayString(unref(currencySymbol)()), 1)
                  ]),
                  createElementVNode("span", _hoisted_34, toDisplayString(unref(getPrice)(+((ei = $e.hoveredData) == null ? void 0 : ei.price) || 0)) + " " + toDisplayString(unref(currencySymbol)()), 1)
                ])) : Number((Ze = $e.hoveredData) == null ? void 0 : Ze.price) > 0 ? (openBlock(), createElementBlock("div", _hoisted_35, [
                  createTextVNode(toDisplayString(unref(getPrice)(+((Ue = $e.hoveredData) == null ? void 0 : Ue.price) || 0)) + " ", 1),
                  createElementVNode("span", _hoisted_36, toDisplayString(unref(currencySymbol)()), 1)
                ])) : createCommentVNode("", !0)
              ], 64))
            ]),
            (ii = (Ke = $e.hoveredData) == null ? void 0 : Ke.type) != null && ii.area_m2 || (ni = (oi = $e.hoveredData) == null ? void 0 : oi.type) != null && ni.rooms_count || (pi = $e.hoveredData) != null && pi.floor_id ? (openBlock(), createElementBlock("div", _hoisted_37, [
              (fi = (ci = $e.hoveredData) == null ? void 0 : ci.type) != null && fi.area_m2 ? (openBlock(), createElementBlock("div", _hoisted_38, [
                createElementVNode("span", _hoisted_39, toDisplayString(unref(tr)("area")), 1),
                createElementVNode("div", _hoisted_40, [
                  createVNode(Area, { class: "ire-size-3.5 ire-shrink-0 ire-text-gray-400" }),
                  createElementVNode("span", _hoisted_41, [
                    createTextVNode(toDisplayString(unref(getArea)(((ui = (hi = $e.hoveredData) == null ? void 0 : hi.type) == null ? void 0 : ui.area_m2) ?? "")) + " ", 1),
                    createElementVNode("span", _hoisted_42, toDisplayString(unref(getAreaUnitLabel)()) + "²", 1)
                  ])
                ])
              ])) : createCommentVNode("", !0),
              (di = (ai = $e.hoveredData) == null ? void 0 : ai.type) != null && di.rooms_count ? (openBlock(), createElementBlock("div", _hoisted_43, [
                createElementVNode("span", _hoisted_44, toDisplayString(unref(tr)("rooms")), 1),
                createElementVNode("div", _hoisted_45, [
                  createVNode(Bed, { class: "ire-size-3.5 ire-shrink-0 ire-text-gray-400" }),
                  createElementVNode("span", _hoisted_46, toDisplayString(unref(getRoomCount)(
                    ((si = (gi = $e.hoveredData) == null ? void 0 : gi.type) == null ? void 0 : si.rooms_count) ?? ""
                  )), 1)
                ])
              ])) : createCommentVNode("", !0),
              (mi = $e.hoveredData) != null && mi.floor_id ? (openBlock(), createElementBlock("div", _hoisted_47, [
                createElementVNode("span", _hoisted_48, toDisplayString(unref(tr)("floor")), 1),
                createElementVNode("div", _hoisted_49, [
                  createVNode(Floor, { class: "ire-size-3.5 ire-shrink-0 ire-text-gray-400" }),
                  createElementVNode("span", _hoisted_50, toDisplayString(((Si = (ki = unref(getFloorById)(
                    +$e.hoveredData.floor_id
                  )) == null ? void 0 : ki.floor_number) == null ? void 0 : Si.toString()) || ""), 1)
                ])
              ])) : createCommentVNode("", !0)
            ])) : createCommentVNode("", !0)
          ], 64)) : createCommentVNode("", !0)
        ])
      ], 4)) : createCommentVNode("", !0);
    };
  }
}), _hoisted_1$11 = {
  ref: "canvasRef",
  class: "irep-preview-layout ire-group ire-relative"
}, _hoisted_2$z = {
  key: 0,
  class: "irep-preview-layout__header py-2 ire-mb-3 ire-flex ire-h-fit ire-items-center ire-justify-between ire-gap-2 ire-px-4"
}, _sfc_main$17 = /* @__PURE__ */ defineComponent({
  __name: "PreviewLayout",
  props: {
    hoverdData: {},
    type: {}
  },
  setup($e) {
    const _e = useGlobalStore(), { getMetaValue: ke } = _e, Be = inject("showFlatModal"), Ne = ref(!0), Ve = computed(() => ke("tooltip") || "1");
    return watch(
      () => Be == null ? void 0 : Be.value,
      () => {
        Be != null && Be.value ? Ne.value = !1 : setTimeout(() => {
          Ne.value = !0;
        }, 400);
      }
    ), (Le, De) => (openBlock(), createElementBlock("div", _hoisted_1$11, [
      Le.$slots.header ? (openBlock(), createElementBlock("div", _hoisted_2$z, [
        renderSlot(Le.$slots, "header")
      ])) : createCommentVNode("", !0),
      renderSlot(Le.$slots, "default"),
      createVNode(Transition, { name: "ire-fade-in-out" }, {
        default: withCtx(() => [
          Ne.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            Ve.value === "1" ? (openBlock(), createBlock(_sfc_main$1g, {
              key: 0,
              "hovered-data": $e.hoverdData,
              type: $e.type || "",
              class: "ire-hidden lg:ire-block"
            }, null, 8, ["hovered-data", "type"])) : Ve.value === "2" ? (openBlock(), createBlock(_sfc_main$1c, {
              key: 1,
              "hovered-data": $e.hoverdData,
              type: $e.type || "",
              "mouse-track": !0,
              class: "ire-z-20 ire-hidden lg:ire-flex [&_.irep-tooltip]:group-active:!ire-scale-110"
            }, null, 8, ["hovered-data", "type"])) : Ve.value === "3" ? (openBlock(), createBlock(_sfc_main$1c, {
              key: 2,
              "hovered-data": $e.hoverdData,
              type: $e.type || "",
              class: "ire-z-20 ire-hidden lg:ire-flex"
            }, null, 8, ["hovered-data", "type"])) : Ve.value === "4" ? (openBlock(), createBlock(_sfc_main$1b, {
              key: 3,
              "hovered-data": $e.hoverdData,
              type: $e.type || "",
              class: "ire-z-20 ire-hidden lg:ire-flex [&_.irep-tooltip]:group-active:!ire-scale-110"
            }, null, 8, ["hovered-data", "type"])) : Ve.value === "5" ? (openBlock(), createBlock(_sfc_main$18, {
              key: 4,
              "hovered-data": $e.hoverdData,
              type: $e.type || "",
              class: "ire-z-20 ire-hidden lg:ire-flex [&_.irep-tooltip]:group-active:!ire-scale-110"
            }, null, 8, ["hovered-data", "type"])) : createCommentVNode("", !0)
          ], 64)) : createCommentVNode("", !0)
        ]),
        _: 1
      })
    ], 512));
  }
}), _hoisted_1$10 = { class: "irep-project-preview__canvas ire-relative ire-w-full ire-select-none ire-overflow-hidden" }, _hoisted_2$y = ["src", "alt", "width", "height"], _hoisted_3$p = ["innerHTML"], _sfc_main$16 = /* @__PURE__ */ defineComponent({
  __name: "ProjectPreview",
  props: {
    project: {},
    floors: {},
    blocks: {},
    flats: {},
    actions: {},
    projectMeta: {}
  },
  emits: ["changeComponent"],
  setup($e, { emit: _e }) {
    const ke = _e, Be = $e, Ne = inject("showFlatModal"), Ve = useGlobalStore(), { openReservedFlat: Le, openSoldFlat: De } = storeToRefs(Ve), Ae = ref(), Ie = ref(null), Re = ref(), ze = ref(null), je = computed(() => {
      if (Be.project)
        return Be.project.svg;
    }), Fe = computed(
      () => {
        var Ye, We;
        return ((We = (Ye = Be.project) == null ? void 0 : Ye.project_image) == null ? void 0 : We[0]) ?? null;
      }
    ), He = computed(() => {
      const Ye = Fe.value;
      if (!Ye) return null;
      const We = Number(Ye.width), Je = Number(Ye.height);
      return !Number.isFinite(We) || !Number.isFinite(Je) || We <= 0 || Je <= 0 ? null : { width: Math.round(We), height: Math.round(Je) };
    }), Ge = (Ye) => {
      const We = Ye == null ? void 0 : Ye.target;
      We && (Ie.value = We);
    }, qe = () => {
      var We;
      if (!Ae.value) return;
      ((We = Ae.value) == null ? void 0 : We.querySelectorAll("g")).forEach((Je) => {
        var Ze, Ue, Ke, ii, oi;
        const ri = Je == null ? void 0 : Je.getAttribute("id"), Qe = (Ue = (Ze = Be.project) == null ? void 0 : Ze.polygon_data) == null ? void 0 : Ue.find(
          (ni) => (ni == null ? void 0 : ni.key) === ri
        ), ti = Qe == null ? void 0 : Qe.id;
        let ei = "";
        switch (Qe == null ? void 0 : Qe.type) {
          case "block": {
            const ni = (Ke = Be.blocks) == null ? void 0 : Ke.find((pi) => pi.id === ti);
            ei = getConfValue((ni == null ? void 0 : ni.conf) || "");
            break;
          }
          case "floor": {
            const ni = (ii = Be.floors) == null ? void 0 : ii.find((pi) => pi.id === ti);
            ei = getConfValue((ni == null ? void 0 : ni.conf) || "");
            break;
          }
          case "flat": {
            const ni = (oi = Be.flats) == null ? void 0 : oi.find((pi) => pi.id === ti);
            ei = getConfValue((ni == null ? void 0 : ni.conf) || "");
            break;
          }
        }
        Je.setAttribute("conf", ei || ""), Qe != null && Qe.type && Je.setAttribute("polygon-type", Qe == null ? void 0 : Qe.type);
      });
    }, Xe = (Ye) => {
      var Je, ri, Qe;
      const We = Ye.target;
      (We == null ? void 0 : We.nodeName) === "path" && (((Je = Re.value) == null ? void 0 : Je.conf) === "reserved" && !Le.value || ((ri = Re.value) == null ? void 0 : ri.conf) === "sold" && !De.value || ke("changeComponent", ((Qe = ze.value) == null ? void 0 : Qe.type) || "", Re == null ? void 0 : Re.value));
    };
    return watch(
      () => Ne == null ? void 0 : Ne.value,
      () => {
        Ne != null && Ne.value || (Ie.value = null, ze.value = null);
      }
    ), watch(
      () => Ie.value,
      (Ye) => {
        var Je, ri, Qe, ti, ei, Ze, Ue, Ke;
        if (!Ye) return;
        Ve.hoverdSvg = Ye;
        const We = Ye.parentElement;
        if (We && (We == null ? void 0 : We.nodeName) === "g") {
          const ii = We == null ? void 0 : We.getAttribute("id");
          if (!ii || (ze.value = ((ri = (Je = Be.project) == null ? void 0 : Je.polygon_data) == null ? void 0 : ri.find((ni) => (ni == null ? void 0 : ni.key) === ii)) || null, !ze.value)) return;
          const oi = (Qe = ze.value) == null ? void 0 : Qe.id;
          switch ((ti = ze.value) == null ? void 0 : ti.type) {
            case "floor":
              const ni = (ei = Be.floors) == null ? void 0 : ei.find(
                (hi) => hi.id === oi
              );
              Re.value = ni;
              break;
            case "block":
              const pi = (Ze = Be.blocks) == null ? void 0 : Ze.find(
                (hi) => (hi == null ? void 0 : hi.id) === oi
              );
              Re.value = pi;
              break;
            case "flat":
              const ci = (Ue = Be.flats) == null ? void 0 : Ue.find(
                (hi) => (hi == null ? void 0 : hi.id) === oi
              );
              Re.value = ci;
              break;
            case "tooltip":
              const fi = (Ke = Be.actions) == null ? void 0 : Ke.find(
                (hi) => (hi == null ? void 0 : hi.id) === oi
              );
              Re.value = fi;
              break;
            default:
              Re.value = null;
              break;
          }
        } else
          ze.value = null, Re.value = null;
      }
    ), onMounted(() => {
      document.addEventListener("mousemove", Ge), qe();
    }), onUnmounted(() => {
      document.removeEventListener("mousemove", Ge);
    }), (Ye, We) => {
      var Je;
      return openBlock(), createBlock(_sfc_main$17, {
        hoverdData: Re.value,
        type: (Je = ze.value) == null ? void 0 : Je.type
      }, {
        default: withCtx(() => {
          var ri, Qe, ti;
          return [
            createElementVNode("div", _hoisted_1$10, [
              (ri = Fe.value) != null && ri.url ? (openBlock(), createElementBlock("img", {
                key: 0,
                src: Fe.value.url,
                alt: Fe.value.alt || "",
                width: (Qe = He.value) == null ? void 0 : Qe.width,
                height: (ti = He.value) == null ? void 0 : ti.height,
                class: "ire-block ire-h-auto ire-w-full ire-max-w-full",
                decoding: "async"
              }, null, 8, _hoisted_2$y)) : createCommentVNode("", !0),
              (openBlock(), createElementBlock("div", {
                innerHTML: je.value,
                key: je.value,
                ref_key: "svgRef",
                ref: Ae,
                class: "irep-project-preview__svg-overlay canvas path-color ire-absolute ire-left-0 ire-top-0 ire-h-full ire-w-full",
                onClick: Xe
              }, null, 8, _hoisted_3$p))
            ])
          ];
        }),
        _: 1
      }, 8, ["hoverdData", "type"]);
    };
  }
}), _hoisted_1$$ = { class: "irep-select ire-w-full md:ire-max-w-[200px]" }, _hoisted_2$x = { class: "irep-select__select-wrapper ire-relative" }, _hoisted_3$o = ["aria-label"], _hoisted_4$l = ["value", "disabled"], _sfc_main$15 = /* @__PURE__ */ defineComponent({
  __name: "PreviewSelect",
  props: /* @__PURE__ */ mergeModels({
    data: {},
    placeholder: { default: "Choose" },
    label: { default: "" },
    clearable: { type: Boolean, default: !1 },
    required: { type: Boolean },
    disabled: { type: Boolean }
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup($e) {
    const _e = useGlobalStore(), { openReservedFlat: ke, openSoldFlat: Be } = storeToRefs(_e), Ne = useModel($e, "modelValue"), Ve = `irep-select-${Math.random().toString(36).substring(2, 9)}`;
    return (Le, De) => (openBlock(), createElementBlock("div", _hoisted_1$$, [
      $e.label ? (openBlock(), createElementBlock("label", {
        key: 0,
        for: Ve,
        class: "label ire-mb-1 ire-block"
      }, toDisplayString($e.label), 1)) : createCommentVNode("", !0),
      createElementVNode("div", _hoisted_2$x, [
        withDirectives(createElementVNode("select", {
          id: Ve,
          "onUpdate:modelValue": De[0] || (De[0] = (Ae) => Ne.value = Ae),
          "aria-label": $e.label || $e.placeholder,
          class: "no-spinner ire-w-full ire-cursor-pointer ire-appearance-none ire-rounded-md !ire-border-none ire-px-4 ire-py-2 !ire-outline-none !ire-ring-[1px] !ire-ring-gray-200 ire-transition-all focus:!ire-ring-2 focus:!ire-ring-black"
        }, [
          (openBlock(!0), createElementBlock(Fragment, null, renderList($e.data, (Ae) => {
            var Ie, Re;
            return openBlock(), createElementBlock("option", {
              key: Ae.value,
              value: Ae.value,
              disabled: ((Ie = Ae == null ? void 0 : Ae.title) == null ? void 0 : Ie.includes("reserved")) && !unref(ke) || ((Re = Ae == null ? void 0 : Ae.title) == null ? void 0 : Re.includes("sold")) && !unref(Be) || $e.disabled,
              class: "ire-text-base"
            }, toDisplayString(Ae.title), 9, _hoisted_4$l);
          }), 128))
        ], 8, _hoisted_3$o), [
          [vModelSelect, Ne.value]
        ])
      ])
    ]));
  }
}), _sfc_main$14 = {}, _hoisted_1$_ = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "32",
  height: "32",
  viewBox: "0 0 32 32",
  fill: "none"
};
function _sfc_render$o($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$_, [..._e[0] || (_e[0] = [
    createElementVNode("path", {
      d: "M22.7074 16.7076L12.7074 26.7076C12.6145 26.8005 12.5042 26.8742 12.3828 26.9245C12.2614 26.9747 12.1313 27.0006 11.9999 27.0006C11.8686 27.0006 11.7384 26.9747 11.617 26.9245C11.4957 26.8742 11.3854 26.8005 11.2924 26.7076C11.1995 26.6147 11.1258 26.5044 11.0756 26.383C11.0253 26.2616 10.9994 26.1315 10.9994 26.0001C10.9994 25.8687 11.0253 25.7386 11.0756 25.6172C11.1258 25.4958 11.1995 25.3855 11.2924 25.2926L20.5862 16.0001L11.2924 6.70757C11.1048 6.51993 10.9994 6.26543 10.9994 6.00007C10.9994 5.7347 11.1048 5.48021 11.2924 5.29257C11.4801 5.10493 11.7346 4.99951 11.9999 4.99951C12.2653 4.99951 12.5198 5.10493 12.7074 5.29257L22.7074 15.2926C22.8004 15.3854 22.8742 15.4957 22.9245 15.6171C22.9748 15.7385 23.0007 15.8687 23.0007 16.0001C23.0007 16.1315 22.9748 16.2616 22.9245 16.383C22.8742 16.5044 22.8004 16.6147 22.7074 16.7076Z",
      fill: "#44546F"
    }, null, -1)
  ])]);
}
const ArrowRight = /* @__PURE__ */ _export_sfc(_sfc_main$14, [["render", _sfc_render$o]]), _hoisted_1$Z = { class: "irep-back-button ire-group/button ire-flex ire-w-fit ire-cursor-pointer ire-items-center ire-gap-1 ire-rounded-lg ire-border ire-bg-gray-50 ire-px-4 ire-py-1 ire-shadow-sm ire-transition-all hover:ire-bg-black" }, _hoisted_2$w = { class: "irep-back-button__text !ire-text-base ire-text-black group-hover/button:!ire-text-white" }, _sfc_main$13 = /* @__PURE__ */ defineComponent({
  __name: "BackButton",
  setup($e) {
    return (_e, ke) => (openBlock(), createElementBlock("div", _hoisted_1$Z, [
      createVNode(ArrowRight, { class: "ire-w-6 ire-rotate-180 group-hover/button:[&_path]:ire-fill-white" }),
      createElementVNode("div", _hoisted_2$w, toDisplayString(unref(tr)("back")), 1)
    ]));
  }
}), _hoisted_1$Y = { class: "irep-floor-preview__select-wrapper ire-w-fit ire-bg-white" }, _hoisted_2$v = { class: "irep-floor-preview__canvas ire-relative ire-w-full ire-select-none ire-overflow-hidden" }, _hoisted_3$n = ["src", "alt", "width", "height"], _hoisted_4$k = ["innerHTML"], _sfc_main$12 = /* @__PURE__ */ defineComponent({
  __name: "FloorPreview",
  props: {
    flats: {},
    floor: {},
    floors: {},
    blocks: {},
    actions: {}
  },
  emits: ["changeComponent"],
  setup($e, { emit: _e }) {
    const ke = _e, Be = $e, Ne = inject("showFlatModal"), Ve = useGlobalStore(), { openReservedFlat: Le, openSoldFlat: De } = storeToRefs(Ve), Ae = ref(), Ie = ref(null), Re = ref(), ze = ref(null), je = ref(), Fe = ref(), He = computed(() => {
      var Qe;
      if ((Qe = Be.floor) != null && Qe.svg)
        return Be.floor.svg;
    }), Ge = computed(() => {
      var Qe, ti;
      return ((ti = (Qe = Be.floor) == null ? void 0 : Qe.floor_image) == null ? void 0 : ti[0]) ?? null;
    }), qe = computed(() => {
      const Qe = Ge.value;
      if (!Qe) return null;
      const ti = Number(Qe.width), ei = Number(Qe.height);
      return !Number.isFinite(ti) || !Number.isFinite(ei) || ti <= 0 || ei <= 0 ? null : { width: Math.round(ti), height: Math.round(ei) };
    }), Xe = computed(() => Be.floors.filter(
      (Qe) => {
        var ti, ei;
        return (
          // floorItem.conf !== "reserved" &&
          // floorItem.conf !== "sold" &&
          (ti = Be.floor) != null && ti.block_id ? (Qe == null ? void 0 : Qe.block_id) === ((ei = Be.floor) == null ? void 0 : ei.block_id) : !(Qe != null && Qe.block_id)
        );
      }
    ).sort((Qe, ti) => Qe.floor_number - ti.floor_number).map((Qe) => {
      var ei, Ze;
      const ti = (ei = Be.blocks) == null ? void 0 : ei.find(
        (Ue) => {
          var Ke;
          return (Ue == null ? void 0 : Ue.id) === ((Ke = Qe == null ? void 0 : Qe.block_id) == null ? void 0 : Ke.toString());
        }
      );
      return {
        title: ((Ze = Qe == null ? void 0 : Qe.floor_number) == null ? void 0 : Ze.toString()) + ` ${tr("floor")} ` + (ti != null && ti.id ? ` - ${ti == null ? void 0 : ti.title}` : "") + (Qe != null && Qe.conf ? " " + Qe.conf : ""),
        value: Qe == null ? void 0 : Qe.id
      };
    }) || []), Ye = (Qe) => {
      const ti = Qe.target;
      ti && (Ie.value = ti);
    }, We = (Qe) => {
      var ei, Ze, Ue;
      const ti = Qe.target;
      (ti == null ? void 0 : ti.nodeName) === "path" && (ze.value && "conf" in ze.value && (((ei = ze.value) == null ? void 0 : ei.conf) === "reserved" && !Le.value || ((Ze = ze.value) == null ? void 0 : Ze.conf) === "sold" && !De.value) || ke("changeComponent", ((Ue = Re.value) == null ? void 0 : Ue.type) || "", ze.value));
    }, Je = () => {
      var Qe;
      Ae.value && ((Qe = Ae.value) == null ? void 0 : Qe.querySelectorAll("g")).forEach((ei) => {
        var ii, oi, ni, pi, ci;
        const Ze = ei == null ? void 0 : ei.getAttribute("id"), Ue = (oi = (ii = Be.floor) == null ? void 0 : ii.polygon_data) == null ? void 0 : oi.find(
          (fi) => (fi == null ? void 0 : fi.key) === Ze
        );
        if (!Be.flats) return;
        let Ke = "";
        if ((ni = Be.floor) != null && ni.conf)
          Ke = getConfValue(((pi = Be.floor) == null ? void 0 : pi.conf) || ""), ei.setAttribute("conf", Ke || "");
        else {
          const fi = (ci = Be.flats) == null ? void 0 : ci.find(
            (hi) => (hi == null ? void 0 : hi.id) === (Ue == null ? void 0 : Ue.id)
          );
          Ke = getConfValue((fi == null ? void 0 : fi.conf) || ""), ei == null || ei.setAttribute("conf", Ke || "");
        }
        Ue != null && Ue.type && ei.setAttribute("polygon-type", Ue == null ? void 0 : Ue.type);
      });
    }, ri = () => {
      var Qe;
      (Qe = Be.floor) != null && Qe.block_id ? ke("changeComponent", "block", Fe.value) : ke("changeComponent", "project", null);
    };
    return watch(
      () => Ie.value,
      (Qe) => {
        var ei, Ze, Ue, Ke, ii, oi, ni;
        if (!Qe) return;
        Ve.hoverdSvg = Qe;
        const ti = Qe == null ? void 0 : Qe.parentElement;
        if (ti && (ti == null ? void 0 : ti.nodeName) === "g") {
          const pi = ti.getAttribute("id");
          if (!pi || (Re.value = ((Ze = (ei = Be.floor) == null ? void 0 : ei.polygon_data) == null ? void 0 : Ze.find((ci) => (ci == null ? void 0 : ci.key) === pi)) || null, !Re.value)) return;
          if (((Ue = Re.value) == null ? void 0 : Ue.type) === "flat") {
            const ci = (Ke = Be.flats) == null ? void 0 : Ke.find(
              (hi) => {
                var ui;
                return (hi == null ? void 0 : hi.id) === ((ui = Re.value) == null ? void 0 : ui.id);
              }
            ), fi = ci ? {
              ...ci,
              conf: ci.conf || ((ii = Be.floor) == null ? void 0 : ii.conf) || ""
            } : null;
            ze.value = fi;
          } else if (((oi = Re.value) == null ? void 0 : oi.type) === "tooltip") {
            const ci = (ni = Be.actions) == null ? void 0 : ni.find(
              (fi) => {
                var hi;
                return (fi == null ? void 0 : fi.id) === ((hi = Re.value) == null ? void 0 : hi.id);
              }
            );
            ze.value = ci ?? null;
          } else
            ze.value = null;
        } else
          Re.value = null;
      }
    ), watch(
      () => Ne == null ? void 0 : Ne.value,
      () => {
        Ne != null && Ne.value || (Ie.value = null, Re.value = null);
      }
    ), watch(
      () => je.value,
      () => {
        var ti;
        const Qe = (ti = Be.floors) == null ? void 0 : ti.find(
          (ei) => (ei == null ? void 0 : ei.id) === (je == null ? void 0 : je.value)
        );
        Qe && ke("changeComponent", "floor", Qe), setTimeout(() => {
          Je();
        }, 0);
      }
    ), onMounted(() => {
      var Qe, ti, ei;
      Fe.value = (Qe = Be.blocks) == null ? void 0 : Qe.find(
        (Ze) => {
          var Ue, Ke;
          return (Ze == null ? void 0 : Ze.id) === ((Ke = (Ue = Be.floor) == null ? void 0 : Ue.block_id) == null ? void 0 : Ke.toString());
        }
      ), je.value = (ei = (ti = Xe.value) == null ? void 0 : ti.find(
        (Ze) => {
          var Ue;
          return (Ze == null ? void 0 : Ze.value) == ((Ue = Be.floor) == null ? void 0 : Ue.id);
        }
      )) == null ? void 0 : ei.value, Je(), document.addEventListener("mousemove", Ye);
    }), onUnmounted(() => {
      document.removeEventListener("mousemove", Ye);
    }), (Qe, ti) => {
      var ei;
      return openBlock(), createBlock(_sfc_main$17, {
        hoverdData: ze.value,
        type: (ei = Re.value) == null ? void 0 : ei.type
      }, {
        header: withCtx(() => [
          createVNode(_sfc_main$13, { onClick: ri }),
          createElementVNode("div", _hoisted_1$Y, [
            createVNode(_sfc_main$15, {
              modelValue: je.value,
              "onUpdate:modelValue": ti[0] || (ti[0] = (Ze) => je.value = Ze),
              data: Xe.value
            }, null, 8, ["modelValue", "data"])
          ])
        ]),
        default: withCtx(() => {
          var Ze, Ue, Ke;
          return [
            createElementVNode("div", _hoisted_2$v, [
              (Ze = Ge.value) != null && Ze.url ? (openBlock(), createElementBlock("img", {
                key: 0,
                src: Ge.value.url,
                alt: Ge.value.alt || "",
                width: (Ue = qe.value) == null ? void 0 : Ue.width,
                height: (Ke = qe.value) == null ? void 0 : Ke.height,
                class: "ire-block ire-h-auto ire-w-full ire-max-w-full",
                decoding: "async"
              }, null, 8, _hoisted_3$n)) : createCommentVNode("", !0),
              (openBlock(), createElementBlock("div", {
                ref_key: "svgRef",
                ref: Ae,
                innerHTML: He.value,
                key: He.value,
                class: "irep-floor-preview__svg-overlay canvas path-color ire-absolute ire-left-0 ire-top-0 ire-h-full ire-w-full",
                onClick: We
              }, null, 8, _hoisted_4$k))
            ])
          ];
        }),
        _: 1
      }, 8, ["hoverdData", "type"]);
    };
  }
}), _sfc_main$11 = {}, _hoisted_1$X = { class: "irep-icon-button ire-flex ire-cursor-pointer ire-items-center ire-justify-center ire-rounded-full ire-bg-white ire-p-2 ire-transition-all hover:ire-bg-gray-200 [&_svg]:ire-size-5" };
function _sfc_render$n($e, _e) {
  return openBlock(), createElementBlock("div", _hoisted_1$X, [
    renderSlot($e.$slots, "default")
  ]);
}
const IconButton = /* @__PURE__ */ _export_sfc(_sfc_main$11, [["render", _sfc_render$n]]), _sfc_main$10 = {}, _hoisted_1$W = {
  width: "16",
  height: "16",
  viewBox: "0 0 21 21",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function _sfc_render$m($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$W, [..._e[0] || (_e[0] = [
    createElementVNode("path", {
      d: "M17.0394 6.0293L8.03936 15.0293L3.68359 10.6736",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ])]);
}
const Correct = /* @__PURE__ */ _export_sfc(_sfc_main$10, [["render", _sfc_render$m]]), _sfc_main$$ = {}, _hoisted_1$V = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "800px",
  height: "800px",
  viewBox: "0 0 24 24",
  fill: "none",
  webcrx: ""
};
function _sfc_render$l($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$V, [..._e[0] || (_e[0] = [
    createElementVNode("path", {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M23 5.5C23 7.98528 20.9853 10 18.5 10C17.0993 10 15.8481 9.36007 15.0228 8.35663L9.87308 10.9315C9.95603 11.2731 10 11.63 10 11.9971C10 12.3661 9.9556 12.7247 9.87184 13.0678L15.0228 15.6433C15.8482 14.6399 17.0993 14 18.5 14C20.9853 14 23 16.0147 23 18.5C23 20.9853 20.9853 23 18.5 23C16.0147 23 14 20.9853 14 18.5C14 18.1319 14.0442 17.7742 14.1276 17.4318L8.97554 14.8558C8.1502 15.8581 6.89973 16.4971 5.5 16.4971C3.01472 16.4971 1 14.4824 1 11.9971C1 9.51185 3.01472 7.49713 5.5 7.49713C6.90161 7.49713 8.15356 8.13793 8.97886 9.14254L14.1275 6.5682C14.0442 6.2258 14 5.86806 14 5.5C14 3.01472 16.0147 1 18.5 1C20.9853 1 23 3.01472 23 5.5ZM16.0029 5.5C16.0029 6.87913 17.1209 7.99713 18.5 7.99713C19.8791 7.99713 20.9971 6.87913 20.9971 5.5C20.9971 4.12087 19.8791 3.00287 18.5 3.00287C17.1209 3.00287 16.0029 4.12087 16.0029 5.5ZM16.0029 18.5C16.0029 19.8791 17.1209 20.9971 18.5 20.9971C19.8791 20.9971 20.9971 19.8791 20.9971 18.5C20.9971 17.1209 19.8791 16.0029 18.5 16.0029C17.1209 16.0029 16.0029 17.1209 16.0029 18.5ZM5.5 14.4943C4.12087 14.4943 3.00287 13.3763 3.00287 11.9971C3.00287 10.618 4.12087 9.5 5.5 9.5C6.87913 9.5 7.99713 10.618 7.99713 11.9971C7.99713 13.3763 6.87913 14.4943 5.5 14.4943Z",
      fill: "#00000099"
    }, null, -1)
  ])]);
}
const Share = /* @__PURE__ */ _export_sfc(_sfc_main$$, [["render", _sfc_render$l]]), _sfc_main$_ = /* @__PURE__ */ defineComponent({
  __name: "ShareFlat",
  setup($e) {
    const _e = useGlobalStore(), { getMetaValue: ke } = _e, { irePlaginWp: Be } = storeToRefs(_e), Ne = ref(!1), Ve = inject("fromListView"), Le = computed(() => {
      var Ae;
      return ke("shareable_link") === "true" && ((Ae = Be.value) == null ? void 0 : Ae.is_gold) && !Ve;
    }), De = async () => {
      Ne.value || !Le.value || (await copyToClipboard(window.location.href), Ne.value = !0, setTimeout(() => {
        Ne.value = !1;
      }, 2e3));
    };
    return (Ae, Ie) => Le.value ? (openBlock(), createBlock(IconButton, {
      key: 0,
      onClick: De
    }, {
      default: withCtx(() => [
        createVNode(Transition, {
          name: "ire-scale",
          mode: "out-in"
        }, {
          default: withCtx(() => [
            Ne.value ? (openBlock(), createBlock(Correct, { key: 0 })) : (openBlock(), createBlock(Share, { key: 1 }))
          ]),
          _: 1
        })
      ]),
      _: 1
    })) : createCommentVNode("", !0);
  }
}), _sfc_main$Z = {}, _hoisted_1$U = {
  xmlns: "http://www.w3.org/2000/svg",
  x: "0px",
  y: "0px",
  width: "20",
  height: "20",
  viewBox: "0 0 50 50"
};
function _sfc_render$k($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$U, [..._e[0] || (_e[0] = [
    createElementVNode("path", { d: "M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" }, null, -1)
  ])]);
}
const Close = /* @__PURE__ */ _export_sfc(_sfc_main$Z, [["render", _sfc_render$k]]), _sfc_main$Y = {}, _hoisted_1$T = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "ire-size-[1em]"
};
function _sfc_render$j($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$T, [..._e[0] || (_e[0] = [
    createElementVNode("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }, null, -1),
    createElementVNode("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }, null, -1)
  ])]);
}
const EyeIcon = /* @__PURE__ */ _export_sfc(_sfc_main$Y, [["render", _sfc_render$j]]), _sfc_main$X = {}, _hoisted_1$S = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "ire-size-[1em]"
};
function _sfc_render$i($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$S, [..._e[0] || (_e[0] = [
    createElementVNode("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }, null, -1),
    createElementVNode("line", {
      x1: "1",
      y1: "1",
      x2: "23",
      y2: "23"
    }, null, -1)
  ])]);
}
const EyeOffIcon = /* @__PURE__ */ _export_sfc(_sfc_main$X, [["render", _sfc_render$i]]), _sfc_main$W = {}, _hoisted_1$R = {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  width: "800px",
  height: "800px",
  viewBox: "0 0 24 24",
  version: "1.1",
  webcrx: ""
};
function _sfc_render$h($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$R, [..._e[0] || (_e[0] = [
    createElementVNode("g", {
      id: "🔍-Product-Icons",
      stroke: "none",
      "stroke-width": "1",
      fill: "none",
      "fill-rule": "evenodd"
    }, [
      createElementVNode("g", {
        id: "ic_fluent_history_24_regular",
        fill: "#212121",
        "fill-rule": "nonzero"
      }, [
        createElementVNode("path", {
          d: "M12,3 C16.9705627,3 21,7.02943725 21,12 C21,16.9705627 16.9705627,21 12,21 C10.2903875,21 8.64944804,20.5217936 7.23080614,19.6337823 C6.65294072,19.2720624 6.11769706,18.8456754 5.63566512,18.3635872 C5.15289898,17.8807646 4.72601217,17.3445768 4.36400875,16.7656632 C3.47740079,15.3478054 3,13.7081751 3,12 C3,11.725846 3.01227986,11.4530822 3.03669655,11.1822711 C3.07389172,10.769731 3.43847425,10.4654537 3.85101443,10.5026489 C4.2635546,10.5398441 4.56783184,10.9044266 4.53063667,11.3169668 C4.51025648,11.5430081 4.5,11.7708281 4.5,12 C4.5,13.4248663 4.89726709,14.7892778 5.63582603,15.9703766 C5.93763522,16.4530279 6.2936779,16.9002326 6.69638725,17.3029889 C7.09848441,17.7051331 7.54490219,18.0607594 8.02668093,18.362333 C9.20843557,19.1020627 10.5739361,19.5 12,19.5 C16.1421356,19.5 19.5,16.1421356 19.5,12 C19.5,7.85786438 16.1421356,4.5 12,4.5 C9.60270786,4.5 7.39952516,5.63281093 5.99774512,7.50196302 L8.75418677,7.50209339 C9.16840034,7.50209339 9.50418677,7.83787982 9.50418677,8.25209339 C9.50418677,8.63178915 9.22203289,8.94558435 8.85595733,8.99524677 L8.75418677,9.00209339 L4.25,9.00209339 C3.87030423,9.00209339 3.55650904,8.71993951 3.50684662,8.35386394 L3.5,8.25209339 L3.5,3.75209339 C3.5,3.33787982 3.83578644,3.00209339 4.25,3.00209339 C4.62969577,3.00209339 4.94349096,3.28424727 4.99315338,3.65032283 L5,3.75209339 L4.99900166,6.34348083 C6.68586937,4.25603382 9.23627771,3 12,3 Z M11.25,7 C11.6295,7 11.9434583,7.28233333 11.9931493,7.64827431 L12,7.75 L12,12 L14.25,12 C14.664,12 15,12.336 15,12.75 C15,13.1295 14.7176667,13.4434583 14.3517257,13.4931493 L14.25,13.5 L11.25,13.5 C10.8705,13.5 10.5565417,13.2176667 10.5068507,12.8517257 L10.5,12.75 L10.5,7.75 C10.5,7.336 10.836,7 11.25,7 Z",
          id: "🎨-Color"
        })
      ])
    ], -1)
  ])]);
}
const LineChartIcon = /* @__PURE__ */ _export_sfc(_sfc_main$W, [["render", _sfc_render$h]]), _hoisted_1$Q = { class: "irep-price-history-modal__close-wrapper ire-absolute ire-right-2 ire-top-2 ire-z-[999] ire-flex ire-w-fit" }, _hoisted_2$u = ["aria-label"], _hoisted_3$m = { class: "irep-price-history-modal__header ire-shrink-0 ire-px-5 ire-pt-4" }, _hoisted_4$j = { class: "irep-price-history-modal__header-inner ire-mb-4" }, _hoisted_5$i = { class: "irep-price-history-modal__title ire-text-lg ire-font-bold ire-capitalize ire-text-gray-900" }, _hoisted_6$f = {
  class: "irep-price-history-modal__subtitle ire-mt-1 ire-flex ire-items-center ire-gap-1.5 ire-text-sm ire-font-medium ire-capitalize",
  style: { color: "#336b73" }
}, _hoisted_7$f = {
  key: 0,
  class: "irep-price-history-modal__chart ire-relative ire-mb-5 ire-rounded-xl ire-bg-white/60 ire-px-2 ire-pb-1 ire-pt-3"
}, _hoisted_8$d = ["aria-pressed", "aria-label", "title"], _hoisted_9$b = ["viewBox"], _hoisted_10$9 = ["d", "stroke"], _hoisted_11$6 = { key: 1 }, _hoisted_12$4 = ["cx", "cy", "r", "fill"], _hoisted_13$3 = ["x", "y"], _hoisted_14$3 = {
  key: 2,
  "pointer-events": "none"
}, _hoisted_15$2 = ["x", "y", "width", "height"], _hoisted_16$2 = ["x", "y"], _hoisted_17$2 = ["x", "y"], _hoisted_18$1 = { class: "irep-price-history-modal__list ire-min-h-0 ire-flex-1 ire-overflow-y-auto ire-px-5 ire-py-2" }, _hoisted_19$1 = { class: "irep-price-history-modal__list-inner ire-flex ire-flex-col ire-gap-3 ire-pb-1" }, _hoisted_20$1 = { class: "irep-price-history-modal__item-info" }, _hoisted_21$1 = { class: "irep-price-history-modal__item-date ire-flex ire-flex-wrap ire-items-center ire-gap-2 ire-text-xs ire-font-medium ire-uppercase ire-text-gray-500" }, _hoisted_22$1 = {
  key: 0,
  class: "ire-bg-[var(--primary-color)]/12 ire-rounded-full ire-py-0.5 ire-text-[10px] ire-font-bold ire-tracking-wide ire-text-[var(--primary-color)]"
}, _hoisted_23$1 = { class: "ire-text-lg ire-font-semibold" }, _hoisted_24$1 = {
  key: 0,
  class: "irep-price-history-modal__item-change irep-price-history-modal__item-change--entry ire-shrink-0 ire-rounded-full ire-bg-gray-200 ire-px-2.5 ire-py-1 ire-text-xs ire-font-semibold ire-text-gray-700"
}, _hoisted_25$1 = { key: 0 }, _hoisted_26$1 = { key: 1 }, _hoisted_27$1 = {
  key: 2,
  class: "irep-price-history-modal__item-change irep-price-history-modal__item-change--neutral ire-shrink-0 ire-rounded-full ire-bg-gray-200 ire-px-2.5 ire-py-1 ire-text-xs ire-font-medium ire-text-gray-700"
}, MIN_AXIS_LABEL_GAP_PX = 52, _sfc_main$V = /* @__PURE__ */ defineComponent({
  __name: "FlatPriceHistoryModal",
  props: {
    priceHistory: {}
  },
  emits: ["close"],
  setup($e) {
    const _e = `ire-ph-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`, ke = $e, Be = useGlobalStore(), { cssVariables: Ne } = storeToRefs(Be), Ve = ref(0);
    let Le = 0, De = null, Ae = null;
    function Ie(Ue) {
      const Ke = new Date(Ue);
      return Number.isNaN(Ke.getTime()) ? /* @__PURE__ */ new Date(0) : Ke;
    }
    function Re(Ue) {
      const Ke = Ue.timestamp;
      return typeof Ke == "number" && Number.isFinite(Ke) ? Ke : Ie(Ue.date).getTime();
    }
    const ze = computed(() => [...ke.priceHistory].sort((Ke, ii) => {
      const oi = Re(Ke), ni = Re(ii);
      return oi !== ni ? oi - ni : Number(Ke.price) - Number(ii.price);
    }).filter((Ke) => Number.isFinite(Number(Ke.price)))), je = computed(() => [...ze.value].reverse()), Fe = computed(() => {
      const Ue = je.value;
      return Ue.map((Ke, ii) => {
        if (ii >= Ue.length - 1) return null;
        const oi = Number(Ue[ii].price), ni = Number(Ue[ii + 1].price);
        if (!Number.isFinite(oi) || !Number.isFinite(ni) || ni <= 0)
          return null;
        const pi = (oi - ni) / ni * 100;
        return Number.isFinite(pi) ? pi : null;
      });
    });
    function He(Ue) {
      return `${Ue > 0 ? "+" : ""}${Ue.toFixed(1)}%`;
    }
    function Ge(Ue) {
      const Ke = Ie(Ue);
      if (Ke.getTime() === 0 && Ue) return Ue;
      const ii = Ke.getDate(), oi = Ke.toLocaleDateString("en-US", { month: "short" }).toUpperCase(), ni = Ke.getFullYear();
      return `${ii} ${oi} ${ni}`;
    }
    function qe(Ue) {
      const Ke = Ie(Ue);
      return Ke.getTime() === 0 && Ue ? Ue.slice(0, 3).toUpperCase() : Ke.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    }
    function Xe(Ue, Ke) {
      const ii = Ie(Ue);
      if (ii.getTime() === 0 && Ue) return Ue.slice(0, 8);
      const oi = (ci) => `${ci.getFullYear()}-${ci.getMonth()}`, ni = oi(ii);
      return Ke.filter(
        (ci) => oi(Ie(ci.date)) === ni
      ).length > 1 ? ii.toLocaleDateString("en-GB", { day: "numeric", month: "short" }).toUpperCase().replace(/\s+/g, " ") : qe(Ue);
    }
    function Ye(Ue, Ke, ii) {
      const oi = [...Ue].sort((pi, ci) => pi.x - ci.x), ni = [];
      for (const pi of oi) {
        if (ni.length === 0) {
          ni.push(pi);
          continue;
        }
        const ci = ni[ni.length - 1];
        if (pi.x - ci.x >= Ke) {
          ni.push(pi);
          continue;
        }
        if (pi.index === ii)
          for (ni[ni.length - 1] = pi; ni.length >= 2 && ni[ni.length - 1].x - ni[ni.length - 2].x < Ke; ) {
            const fi = ni[ni.length - 2];
            if (ni[ni.length - 1].index === ii && fi.index !== 0)
              ni.splice(ni.length - 2, 1);
            else if (fi.index === 0) {
              ni.splice(ni.length - 1, 1);
              break;
            } else
              ni.splice(ni.length - 2, 1);
          }
      }
      return ni;
    }
    const We = computed(() => {
      const Ue = ze.value;
      if (Ue.length < 2) return null;
      const Ke = Ue.map(($i) => Number($i.price)), ii = Math.min(...Ke), oi = Math.max(...Ke), ni = 14, pi = 16, ci = 32, fi = 360, hi = 128, ui = fi - pi * 2, ai = hi - ni - ci, di = oi - ii, gi = di > 0 ? Math.max(di * 0.06, 1) : 1, si = ii - gi, ki = oi + gi - si || 1, Si = ($i) => ni + ai - ($i - si) / ki * ai, Ci = ($i) => pi + (Ue.length === 1 ? ui / 2 : $i / (Ue.length - 1) * ui), Mi = Ue.map(($i, Ii) => ({
        x: Ci(Ii),
        y: Si(Number($i.price))
      })), yi = 8, Oi = Ue.length <= yi ? Ue.map(($i, Ii) => Ii) : Array.from(
        { length: yi },
        ($i, Ii) => Math.round(Ii * (Ue.length - 1) / (yi - 1))
      ), Ri = [...new Set(Oi)].sort(($i, Ii) => $i - Ii).map(($i) => ({ index: $i, x: Mi[$i].x, row: Ue[$i] })), Di = Ue.length > yi ? Ye(
        Ri,
        MIN_AXIS_LABEL_GAP_PX,
        Ue.length - 1
      ) : Ri;
      let zi = "";
      if (Mi.length >= 2) {
        zi = `M ${Mi[0].x} ${Mi[0].y}`;
        for (let $i = 0; $i < Mi.length - 1; $i++) {
          const Ii = Mi[$i === 0 ? $i : $i - 1], xi = Mi[$i], wi = Mi[$i + 1], Ni = Mi[$i + 2] ?? wi, ji = xi.x + (wi.x - Ii.x) / 6, Hi = xi.y + (wi.y - Ii.y) / 6, Ui = wi.x - (Ni.x - xi.x) / 6, Gi = wi.y - (Ni.y - xi.y) / 6;
          zi += ` C ${ji} ${Hi}, ${Ui} ${Gi}, ${wi.x} ${wi.y}`;
        }
      }
      return {
        w: fi,
        h: hi,
        pathD: zi,
        pts: Mi,
        rows: Ue,
        axisLabelTicks: Di,
        padX: pi,
        bottomLabel: ci,
        axisLabelForRow: Xe
      };
    }), Je = ref(!1), ri = ref(null), Qe = computed(() => {
      if (!Je.value) return null;
      const Ue = We.value, Ke = ri.value;
      if (Ue == null || Ke === null || Ke < 0 || Ke >= Ue.rows.length) return null;
      const ii = Ue.pts[Ke], oi = Ue.rows[Ke], ni = `${getPrice(Number(oi.price))} ${currencySymbol()}`, pi = Ge(oi.date), ci = 118, fi = 40, hi = Math.min(Math.max(ii.x, ci / 2 + 4), Ue.w - ci / 2 - 4), ui = hi - ci / 2, ai = Math.max(4, ii.y - fi - 10);
      return {
        boxX: ui,
        boxY: ai,
        boxW: ci,
        boxH: fi,
        cx: hi,
        textY1: ai + 16,
        textY2: ai + 30,
        priceLine: ni,
        dateLine: pi
      };
    });
    function ti() {
      Je.value = !Je.value, Je.value || (ri.value = null);
    }
    function ei(Ue) {
      if (!Je.value) return;
      const Ke = Ue.currentTarget, ii = We.value;
      if (!ii) return;
      const oi = Ke.createSVGPoint();
      oi.x = Ue.clientX, oi.y = Ue.clientY;
      const ni = Ke.getScreenCTM();
      if (!ni) return;
      const pi = oi.matrixTransform(ni.inverse());
      let ci = 0, fi = 1 / 0;
      for (let hi = 0; hi < ii.pts.length; hi++) {
        const ui = Math.abs(ii.pts[hi].x - pi.x);
        ui < fi && (fi = ui, ci = hi);
      }
      ri.value = ci;
    }
    function Ze() {
      Je.value && (ri.value = null);
    }
    return onMounted(() => {
      Le = window.scrollY;
      const { body: Ue, documentElement: Ke } = document, ii = window.innerWidth - Ke.clientWidth, ni = (parseFloat(getComputedStyle(Ue).paddingRight || "0") || 0) + ii;
      De = Ue.getAttribute("style"), Ae = Ke.getAttribute("style"), Ue.setAttribute(
        "style",
        `overflow: hidden; padding-right: ${ni}px;`
      ), Ke.setAttribute("style", "overflow: hidden;"), setTimeout(() => {
        Ve.value++;
      }, 50);
    }), onUnmounted(() => {
      setTimeout(() => {
        const { body: Ue, documentElement: Ke } = document;
        De !== null ? Ue.setAttribute("style", De) : Ue.removeAttribute("style"), Ae !== null ? Ke.setAttribute("style", Ae) : Ke.removeAttribute("style"), window.scrollTo(0, Le);
      }, 250);
    }), (Ue, Ke) => (openBlock(), createElementBlock("div", {
      style: normalizeStyle(unref(Ne)),
      class: "irep-modal ire-fixed ire-left-0 ire-top-0 ire-z-[99999] ire-flex ire-h-full ire-w-full ire-cursor-pointer ire-items-center ire-justify-center ire-p-4 lg:ire-px-10 lg:ire-py-16"
    }, [
      createVNode(Transition, {
        name: "ire-fade-in-out",
        mode: "out-in"
      }, {
        default: withCtx(() => [
          Ve.value ? (openBlock(), createElementBlock("div", {
            key: Ve.value,
            class: "irep-price-history-modal__backdrop ire-absolute ire-left-0 ire-top-0 ire-h-full ire-w-full ire-bg-black/40 ire-backdrop-blur-sm ire-transition-all",
            onClick: Ke[0] || (Ke[0] = (ii) => Ue.$emit("close"))
          })) : createCommentVNode("", !0)
        ]),
        _: 1
      }),
      createElementVNode("div", {
        class: "irep-price-history-modal ire-relative ire-flex ire-max-h-[min(92svh,720px)] ire-w-full ire-max-w-[420px] ire-cursor-default ire-flex-col ire-rounded-2xl ire-bg-[#F3F4F6] ire-shadow-lg",
        onClick: Ke[2] || (Ke[2] = withModifiers(() => {
        }, ["stop"]))
      }, [
        createElementVNode("div", _hoisted_1$Q, [
          createElementVNode("div", {
            type: "button",
            class: "irep-price-history-modal__close ire-flex ire-aspect-square ire-w-9 ire-cursor-pointer ire-items-center ire-justify-center ire-rounded-full ire-bg-white/90 ire-p-2 ire-text-center ire-shadow-sm ire-transition-all hover:ire-bg-gray-200 [&_path]:ire-fill-gray-500 [&_svg]:ire-size-4",
            "aria-label": unref(tr)("close"),
            onClick: Ke[1] || (Ke[1] = (ii) => Ue.$emit("close"))
          }, [
            createVNode(Close)
          ], 8, _hoisted_2$u)
        ]),
        createElementVNode("div", _hoisted_3$m, [
          createElementVNode("div", _hoisted_4$j, [
            createElementVNode("div", _hoisted_5$i, toDisplayString(unref(tr)("price history")), 1),
            createElementVNode("div", _hoisted_6$f, [
              createVNode(LineChartIcon, { class: "[] ire-size-4 ire-shrink-0" }),
              createElementVNode("span", null, toDisplayString(unref(tr)("last 6 months")), 1)
            ])
          ]),
          We.value ? (openBlock(), createElementBlock("div", _hoisted_7$f, [
            createElementVNode("div", {
              type: "button",
              class: "irep-price-history-modal__chart-toggle ire-absolute ire-left-2 ire-top-2 ire-z-10 ire-flex ire-size-8 ire-cursor-pointer ire-items-center ire-justify-center ire-rounded-full ire-border ire-border-gray-200 ire-bg-white/95 ire-text-gray-600 ire-shadow-sm ire-transition-colors hover:ire-bg-gray-50 hover:ire-text-gray-900",
              "aria-pressed": Je.value,
              "aria-label": Je.value ? unref(tr)("Disable chart details") : unref(tr)("Enable chart details"),
              title: Je.value ? unref(tr)("Disable chart details") : unref(tr)("Enable chart details"),
              onClick: withModifiers(ti, ["stop"])
            }, [
              Je.value ? (openBlock(), createBlock(EyeIcon, {
                key: 0,
                class: "ire-size-4"
              })) : (openBlock(), createBlock(EyeOffIcon, {
                key: 1,
                class: "ire-size-4"
              }))
            ], 8, _hoisted_8$d),
            (openBlock(), createElementBlock("svg", {
              viewBox: `0 0 ${We.value.w} ${We.value.h}`,
              class: normalizeClass([
                "ire-block ire-h-auto ire-w-full",
                Je.value ? "ire-cursor-crosshair" : "ire-cursor-default"
              ]),
              preserveAspectRatio: "xMidYMid meet",
              onPointermove: ei,
              onPointerleave: Ze
            }, [
              createElementVNode("defs", null, [
                createElementVNode("linearGradient", {
                  id: _e,
                  x1: "0%",
                  y1: "0%",
                  x2: "100%",
                  y2: "0%"
                }, [...Ke[3] || (Ke[3] = [
                  createElementVNode("stop", {
                    offset: "0%",
                    "stop-color": "#7eb8c8"
                  }, null, -1),
                  createElementVNode("stop", {
                    offset: "100%",
                    "stop-color": "#336b73"
                  }, null, -1)
                ])])
              ]),
              We.value.pathD ? (openBlock(), createElementBlock("path", {
                key: 0,
                d: We.value.pathD,
                fill: "none",
                stroke: `url(#${_e})`,
                "stroke-width": "2.5",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, null, 8, _hoisted_10$9)) : createCommentVNode("", !0),
              Je.value ? (openBlock(), createElementBlock("g", _hoisted_11$6, [
                (openBlock(!0), createElementBlock(Fragment, null, renderList(We.value.pts, (ii, oi) => (openBlock(), createElementBlock("circle", {
                  key: oi,
                  cx: ii.x,
                  cy: ii.y,
                  r: ri.value === oi ? 6.5 : oi === We.value.pts.length - 1 ? 5 : 3.5,
                  fill: oi === We.value.pts.length - 1 ? "#336b73" : "#5a9aaa",
                  stroke: "#fff",
                  "stroke-width": "1.5"
                }, null, 8, _hoisted_12$4))), 128))
              ])) : createCommentVNode("", !0),
              (openBlock(!0), createElementBlock(Fragment, null, renderList(We.value.axisLabelTicks, (ii) => (openBlock(), createElementBlock("text", {
                key: "lbl-" + ii.index,
                x: ii.x,
                y: We.value.h - 4,
                "text-anchor": "middle",
                class: "ire-fill-gray-600",
                style: { "font-size": "9px", "font-weight": "600" }
              }, toDisplayString(We.value.axisLabelForRow(ii.row.date, We.value.rows)), 9, _hoisted_13$3))), 128)),
              Qe.value ? (openBlock(), createElementBlock("g", _hoisted_14$3, [
                createElementVNode("rect", {
                  x: Qe.value.boxX,
                  y: Qe.value.boxY,
                  width: Qe.value.boxW,
                  height: Qe.value.boxH,
                  rx: "6",
                  fill: "#111827",
                  opacity: "0.92"
                }, null, 8, _hoisted_15$2),
                createElementVNode("text", {
                  x: Qe.value.cx,
                  y: Qe.value.textY1,
                  fill: "#ffffff",
                  "font-size": "11",
                  "font-weight": "600",
                  "text-anchor": "middle",
                  style: { "font-family": "system-ui, sans-serif" }
                }, toDisplayString(Qe.value.priceLine), 9, _hoisted_16$2),
                createElementVNode("text", {
                  x: Qe.value.cx,
                  y: Qe.value.textY2,
                  fill: "#d1d5db",
                  "font-size": "9",
                  "text-anchor": "middle",
                  style: { "font-family": "system-ui, sans-serif" }
                }, toDisplayString(Qe.value.dateLine), 9, _hoisted_17$2)
              ])) : createCommentVNode("", !0)
            ], 42, _hoisted_9$b))
          ])) : createCommentVNode("", !0)
        ]),
        createElementVNode("div", _hoisted_18$1, [
          createElementVNode("div", _hoisted_19$1, [
            (openBlock(!0), createElementBlock(Fragment, null, renderList(je.value, (ii, oi) => (openBlock(), createElementBlock("div", {
              key: `${oi}-${ii.date}-${ii.price}`,
              class: normalizeClass([
                "irep-price-history-modal__item ire-flex ire-items-center ire-justify-between ire-gap-3 ire-rounded-xl ire-px-4 ire-py-3",
                oi === 0 ? "ire-ring-[var(--primary-color)]/45 ire-bg-white ire-shadow-md ire-ring-2 ire-ring-offset-2 ire-ring-offset-[#F3F4F6]" : "ire-bg-white ire-shadow-sm"
              ])
            }, [
              createElementVNode("div", _hoisted_20$1, [
                createElementVNode("div", _hoisted_21$1, [
                  createElementVNode("span", null, toDisplayString(Ge(ii.date)), 1),
                  oi === 0 ? (openBlock(), createElementBlock("span", _hoisted_22$1, toDisplayString(unref(tr)("current")), 1)) : createCommentVNode("", !0)
                ]),
                createElementVNode("div", {
                  class: normalizeClass(["irep-price-history-modal__item-price ire-flex ire-gap-1 ire-text-lg ire-font-semibold ire-text-gray-900 sm:ire-text-xl", oi === 0 ? "ire-text-[var(--primary-color)]" : ""])
                }, [
                  createTextVNode(toDisplayString(unref(getPrice)(Number(ii.price))) + " ", 1),
                  createElementVNode("span", _hoisted_23$1, toDisplayString(unref(currencySymbol)()), 1)
                ], 2)
              ]),
              oi === je.value.length - 1 ? (openBlock(), createElementBlock("div", _hoisted_24$1, " — " + toDisplayString(unref(tr)("Entry")), 1)) : Fe.value[oi] !== null ? (openBlock(), createElementBlock("div", {
                key: 1,
                class: normalizeClass([
                  "irep-price-history-modal__item-change ire-shrink-0 ire-rounded-full ire-px-2.5 ire-py-1 ire-text-xs ire-font-medium",
                  (Fe.value[oi] ?? 0) >= 0 ? "ire-bg-red-100 ire-text-red-800" : "ire-bg-emerald-100 ire-text-emerald-800"
                ])
              }, [
                (Fe.value[oi] ?? 0) >= 0 ? (openBlock(), createElementBlock("span", _hoisted_25$1, "↑")) : (openBlock(), createElementBlock("span", _hoisted_26$1, "↓")),
                createTextVNode(" " + toDisplayString(He(Fe.value[oi])), 1)
              ], 2)) : (openBlock(), createElementBlock("div", _hoisted_27$1, " — "))
            ], 2))), 128))
          ])
        ])
      ])
    ], 4));
  }
}), _hoisted_1$P = { class: "irep-price flex ire-min-w-0 ire-max-w-full ire-flex-col ire-items-center ire-justify-center" }, _hoisted_2$t = { class: "irep-price__wrapper ire-flex ire-max-w-full ire-items-center ire-justify-center ire-gap-2" }, _hoisted_3$l = {
  key: 0,
  class: "irep-price__conf ire-uppercase"
}, _hoisted_4$i = {
  key: 1,
  class: "irep-price__request ire-uppercase"
}, _hoisted_5$h = {
  key: 2,
  class: "irep-price__offer"
}, _hoisted_6$e = { class: "irep-price__original ire-text-left ire-text-base ire-line-through ire-decoration-white" }, _hoisted_7$e = { class: "irep-price__value" }, _hoisted_8$c = {
  key: 3,
  class: "irep-price__value"
}, _hoisted_9$a = {
  key: 4,
  class: "irep-price__available ire-uppercase"
}, _hoisted_10$8 = {
  key: 0,
  class: "irep-price__per-m2 ire-pt-2 ire-text-base ire-text-gray-700"
}, _sfc_main$U = /* @__PURE__ */ defineComponent({
  __name: "Price",
  props: {
    flat: {}
  },
  setup($e) {
    const _e = useGlobalStore(), { hasPriceHistoryAddon: ke } = storeToRefs(_e), Be = $e, Ne = ref(!1), Ve = computed(() => {
      var ze, je;
      const Re = ((je = (ze = _e.getMetaValue("custom_types")) == null ? void 0 : ze.find((Fe) => {
        var He;
        return (Fe == null ? void 0 : Fe.title) === ((He = Be.flat) == null ? void 0 : He.conf);
      })) == null ? void 0 : je.type_color) || "";
      return Re ? Le(Re) : "";
    });
    function Le(Re) {
      return Re.startsWith("rgba") ? Re.replace(
        /rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
        "rgba($1,$2,$3, 1)"
      ) : Re.startsWith("hsla") ? Re.replace(
        /hsla\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
        "hsla($1,$2,$3, 1)"
      ) : Re;
    }
    const De = computed(() => {
      var Re, ze;
      if (((Re = Be.flat) == null ? void 0 : Re.conf) === "reserved") {
        const je = _e.getMetaValue("reserved_color") || "rgba(255, 247, 89, 0.53)";
        return Le(je);
      }
      if (((ze = Be.flat) == null ? void 0 : ze.conf) === "sold") {
        const je = _e.getMetaValue("sold_color") || "rgba(219, 64, 64, 0.45)";
        return Le(je);
      }
      return Ve.value;
    }), Ae = computed(() => {
      var Re, ze;
      return (((ze = (Re = Be.flat) == null ? void 0 : Re.price_history) == null ? void 0 : ze.length) ?? 0) >= 2 && ke.value;
    }), Ie = computed(() => {
      var je, Fe, He, Ge;
      const Re = Number((Fe = (je = Be.flat) == null ? void 0 : je.type) == null ? void 0 : Fe.area_m2), ze = Number(((He = Be.flat) == null ? void 0 : He.offer_price) || ((Ge = Be.flat) == null ? void 0 : Ge.price));
      return !Number.isFinite(Re) || Re <= 0 || !Number.isFinite(ze) || ze <= 0 ? 0 : ze / Re;
    });
    return (Re, ze) => {
      var je, Fe, He, Ge, qe, Xe, Ye, We, Je, ri;
      return openBlock(), createElementBlock("div", _hoisted_1$P, [
        createElementVNode("div", _hoisted_2$t, [
          createElementVNode("div", {
            class: normalizeClass(["irep-flat-modal-price-container ire-w-fit ire-min-w-0 ire-max-w-full ire-rounded-sm ire-bg-[var(--primary-color)] ire-p-2 ire-text-4xl", [
              `irep-flat-modal--${((Fe = (je = $e.flat) == null ? void 0 : je.conf) == null ? void 0 : Fe.replace(/ /g, "-")) || "price"}`,
              "ire-text-white"
            ]]),
            style: normalizeStyle({ backgroundColor: De.value })
          }, [
            (He = $e.flat) != null && He.conf ? (openBlock(), createElementBlock("div", _hoisted_3$l, toDisplayString(unref(tr)($e.flat.conf)), 1)) : (Ge = $e.flat) != null && Ge.request_price ? (openBlock(), createElementBlock("div", _hoisted_4$i, toDisplayString(unref(tr)("Request Price")), 1)) : (qe = $e.flat) != null && qe.offer_price && Number((Xe = $e.flat) == null ? void 0 : Xe.offer_price) > 0 ? (openBlock(), createElementBlock("div", _hoisted_5$h, [
              createElementVNode("div", _hoisted_6$e, [
                createTextVNode(toDisplayString(unref(getPrice)(Number((Ye = $e.flat) == null ? void 0 : Ye.price))) + " ", 1),
                createElementVNode("span", null, toDisplayString(unref(currencySymbol)()), 1)
              ]),
              createElementVNode("div", _hoisted_7$e, [
                createTextVNode(toDisplayString(unref(getPrice)(Number((We = $e.flat) == null ? void 0 : We.offer_price))) + " ", 1),
                createElementVNode("span", null, toDisplayString(unref(currencySymbol)()), 1)
              ])
            ])) : Number((Je = $e.flat) == null ? void 0 : Je.price) > 0 ? (openBlock(), createElementBlock("div", _hoisted_8$c, [
              createTextVNode(toDisplayString(unref(getPrice)(Number((ri = $e.flat) == null ? void 0 : ri.price))) + " ", 1),
              createElementVNode("span", null, toDisplayString(unref(currencySymbol)()), 1)
            ])) : (openBlock(), createElementBlock("div", _hoisted_9$a, toDisplayString(unref(tr)("available")), 1))
          ], 6),
          Ae.value && $e.flat ? (openBlock(), createBlock(IconButton, {
            key: 0,
            class: "price-history-button",
            onClick: ze[0] || (ze[0] = (Qe) => Ne.value = !0)
          }, {
            default: withCtx(() => [
              createVNode(LineChartIcon)
            ]),
            _: 1
          })) : createCommentVNode("", !0)
        ]),
        Ie.value > 0 && !$e.flat.request_price && !$e.flat.conf ? (openBlock(), createElementBlock("div", _hoisted_10$8, toDisplayString(unref(getPrice)(Ie.value)) + " " + toDisplayString(unref(currencySymbol)()) + " / " + toDisplayString(unref(getAreaUnitLabel)()) + "² ", 1)) : createCommentVNode("", !0),
        createVNode(Transition, {
          name: "ire-fade-in-out",
          mode: "out-in"
        }, {
          default: withCtx(() => [
            Ne.value && $e.flat && Ae.value ? (openBlock(), createBlock(_sfc_main$V, {
              key: 0,
              "price-history": $e.flat.price_history,
              onClose: ze[1] || (ze[1] = (Qe) => Ne.value = !1)
            }, null, 8, ["price-history"])) : createCommentVNode("", !0)
          ]),
          _: 1
        })
      ]);
    };
  }
});
function isObject$2($e) {
  return $e !== null && typeof $e == "object" && "constructor" in $e && $e.constructor === Object;
}
function extend$2($e, _e) {
  $e === void 0 && ($e = {}), _e === void 0 && (_e = {});
  const ke = ["__proto__", "constructor", "prototype"];
  Object.keys(_e).filter((Be) => ke.indexOf(Be) < 0).forEach((Be) => {
    typeof $e[Be] > "u" ? $e[Be] = _e[Be] : isObject$2(_e[Be]) && isObject$2($e[Be]) && Object.keys(_e[Be]).length > 0 && extend$2($e[Be], _e[Be]);
  });
}
const ssrDocument = {
  body: {},
  addEventListener() {
  },
  removeEventListener() {
  },
  activeElement: {
    blur() {
    },
    nodeName: ""
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
  getElementById() {
    return null;
  },
  createEvent() {
    return {
      initEvent() {
      }
    };
  },
  createElement() {
    return {
      children: [],
      childNodes: [],
      style: {},
      setAttribute() {
      },
      getElementsByTagName() {
        return [];
      }
    };
  },
  createElementNS() {
    return {};
  },
  importNode() {
    return null;
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  }
};
function getDocument() {
  const $e = typeof document < "u" ? document : {};
  return extend$2($e, ssrDocument), $e;
}
const ssrWindow = {
  document: ssrDocument,
  navigator: {
    userAgent: ""
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  },
  history: {
    replaceState() {
    },
    pushState() {
    },
    go() {
    },
    back() {
    }
  },
  CustomEvent: function() {
    return this;
  },
  addEventListener() {
  },
  removeEventListener() {
  },
  getComputedStyle() {
    return {
      getPropertyValue() {
        return "";
      }
    };
  },
  Image() {
  },
  Date() {
  },
  screen: {},
  setTimeout() {
  },
  clearTimeout() {
  },
  matchMedia() {
    return {};
  },
  requestAnimationFrame($e) {
    return typeof setTimeout > "u" ? ($e(), null) : setTimeout($e, 0);
  },
  cancelAnimationFrame($e) {
    typeof setTimeout > "u" || clearTimeout($e);
  }
};
function getWindow() {
  const $e = typeof window < "u" ? window : {};
  return extend$2($e, ssrWindow), $e;
}
function classesToTokens($e) {
  return $e === void 0 && ($e = ""), $e.trim().split(" ").filter((_e) => !!_e.trim());
}
function deleteProps($e) {
  const _e = $e;
  Object.keys(_e).forEach((ke) => {
    try {
      _e[ke] = null;
    } catch {
    }
    try {
      delete _e[ke];
    } catch {
    }
  });
}
function nextTick($e, _e) {
  return _e === void 0 && (_e = 0), setTimeout($e, _e);
}
function now() {
  return Date.now();
}
function getComputedStyle$1($e) {
  const _e = getWindow();
  let ke;
  return _e.getComputedStyle && (ke = _e.getComputedStyle($e, null)), !ke && $e.currentStyle && (ke = $e.currentStyle), ke || (ke = $e.style), ke;
}
function getTranslate($e, _e) {
  _e === void 0 && (_e = "x");
  const ke = getWindow();
  let Be, Ne, Ve;
  const Le = getComputedStyle$1($e);
  return ke.WebKitCSSMatrix ? (Ne = Le.transform || Le.webkitTransform, Ne.split(",").length > 6 && (Ne = Ne.split(", ").map((De) => De.replace(",", ".")).join(", ")), Ve = new ke.WebKitCSSMatrix(Ne === "none" ? "" : Ne)) : (Ve = Le.MozTransform || Le.OTransform || Le.MsTransform || Le.msTransform || Le.transform || Le.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), Be = Ve.toString().split(",")), _e === "x" && (ke.WebKitCSSMatrix ? Ne = Ve.m41 : Be.length === 16 ? Ne = parseFloat(Be[12]) : Ne = parseFloat(Be[4])), _e === "y" && (ke.WebKitCSSMatrix ? Ne = Ve.m42 : Be.length === 16 ? Ne = parseFloat(Be[13]) : Ne = parseFloat(Be[5])), Ne || 0;
}
function isObject$1($e) {
  return typeof $e == "object" && $e !== null && $e.constructor && Object.prototype.toString.call($e).slice(8, -1) === "Object";
}
function isNode($e) {
  return typeof window < "u" && typeof window.HTMLElement < "u" ? $e instanceof HTMLElement : $e && ($e.nodeType === 1 || $e.nodeType === 11);
}
function extend$1() {
  const $e = Object(arguments.length <= 0 ? void 0 : arguments[0]), _e = ["__proto__", "constructor", "prototype"];
  for (let ke = 1; ke < arguments.length; ke += 1) {
    const Be = ke < 0 || arguments.length <= ke ? void 0 : arguments[ke];
    if (Be != null && !isNode(Be)) {
      const Ne = Object.keys(Object(Be)).filter((Ve) => _e.indexOf(Ve) < 0);
      for (let Ve = 0, Le = Ne.length; Ve < Le; Ve += 1) {
        const De = Ne[Ve], Ae = Object.getOwnPropertyDescriptor(Be, De);
        Ae !== void 0 && Ae.enumerable && (isObject$1($e[De]) && isObject$1(Be[De]) ? Be[De].__swiper__ ? $e[De] = Be[De] : extend$1($e[De], Be[De]) : !isObject$1($e[De]) && isObject$1(Be[De]) ? ($e[De] = {}, Be[De].__swiper__ ? $e[De] = Be[De] : extend$1($e[De], Be[De])) : $e[De] = Be[De]);
      }
    }
  }
  return $e;
}
function setCSSProperty($e, _e, ke) {
  $e.style.setProperty(_e, ke);
}
function animateCSSModeScroll($e) {
  let {
    swiper: _e,
    targetPosition: ke,
    side: Be
  } = $e;
  const Ne = getWindow(), Ve = -_e.translate;
  let Le = null, De;
  const Ae = _e.params.speed;
  _e.wrapperEl.style.scrollSnapType = "none", Ne.cancelAnimationFrame(_e.cssModeFrameID);
  const Ie = ke > Ve ? "next" : "prev", Re = (je, Fe) => Ie === "next" && je >= Fe || Ie === "prev" && je <= Fe, ze = () => {
    De = (/* @__PURE__ */ new Date()).getTime(), Le === null && (Le = De);
    const je = Math.max(Math.min((De - Le) / Ae, 1), 0), Fe = 0.5 - Math.cos(je * Math.PI) / 2;
    let He = Ve + Fe * (ke - Ve);
    if (Re(He, ke) && (He = ke), _e.wrapperEl.scrollTo({
      [Be]: He
    }), Re(He, ke)) {
      _e.wrapperEl.style.overflow = "hidden", _e.wrapperEl.style.scrollSnapType = "", setTimeout(() => {
        _e.wrapperEl.style.overflow = "", _e.wrapperEl.scrollTo({
          [Be]: He
        });
      }), Ne.cancelAnimationFrame(_e.cssModeFrameID);
      return;
    }
    _e.cssModeFrameID = Ne.requestAnimationFrame(ze);
  };
  ze();
}
function elementChildren($e, _e) {
  _e === void 0 && (_e = "");
  const ke = getWindow(), Be = [...$e.children];
  return ke.HTMLSlotElement && $e instanceof HTMLSlotElement && Be.push(...$e.assignedElements()), _e ? Be.filter((Ne) => Ne.matches(_e)) : Be;
}
function elementIsChildOfSlot($e, _e) {
  const ke = [_e];
  for (; ke.length > 0; ) {
    const Be = ke.shift();
    if ($e === Be)
      return !0;
    ke.push(...Be.children, ...Be.shadowRoot ? Be.shadowRoot.children : [], ...Be.assignedElements ? Be.assignedElements() : []);
  }
}
function elementIsChildOf($e, _e) {
  const ke = getWindow();
  let Be = _e.contains($e);
  return !Be && ke.HTMLSlotElement && _e instanceof HTMLSlotElement && (Be = [..._e.assignedElements()].includes($e), Be || (Be = elementIsChildOfSlot($e, _e))), Be;
}
function showWarning($e) {
  try {
    console.warn($e);
    return;
  } catch {
  }
}
function createElement($e, _e) {
  _e === void 0 && (_e = []);
  const ke = document.createElement($e);
  return ke.classList.add(...Array.isArray(_e) ? _e : classesToTokens(_e)), ke;
}
function elementPrevAll($e, _e) {
  const ke = [];
  for (; $e.previousElementSibling; ) {
    const Be = $e.previousElementSibling;
    _e ? Be.matches(_e) && ke.push(Be) : ke.push(Be), $e = Be;
  }
  return ke;
}
function elementNextAll($e, _e) {
  const ke = [];
  for (; $e.nextElementSibling; ) {
    const Be = $e.nextElementSibling;
    _e ? Be.matches(_e) && ke.push(Be) : ke.push(Be), $e = Be;
  }
  return ke;
}
function elementStyle($e, _e) {
  return getWindow().getComputedStyle($e, null).getPropertyValue(_e);
}
function elementIndex($e) {
  let _e = $e, ke;
  if (_e) {
    for (ke = 0; (_e = _e.previousSibling) !== null; )
      _e.nodeType === 1 && (ke += 1);
    return ke;
  }
}
function elementParents($e, _e) {
  const ke = [];
  let Be = $e.parentElement;
  for (; Be; )
    ke.push(Be), Be = Be.parentElement;
  return ke;
}
function elementOuterSize($e, _e, ke) {
  const Be = getWindow();
  return $e[_e === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(Be.getComputedStyle($e, null).getPropertyValue(_e === "width" ? "margin-right" : "margin-top")) + parseFloat(Be.getComputedStyle($e, null).getPropertyValue(_e === "width" ? "margin-left" : "margin-bottom"));
}
function setInnerHTML($e, _e) {
  _e === void 0 && (_e = ""), typeof trustedTypes < "u" ? $e.innerHTML = trustedTypes.createPolicy("html", {
    createHTML: (ke) => ke
  }).createHTML(_e) : $e.innerHTML = _e;
}
let support;
function calcSupport() {
  const $e = getWindow(), _e = getDocument();
  return {
    smoothScroll: _e.documentElement && _e.documentElement.style && "scrollBehavior" in _e.documentElement.style,
    touch: !!("ontouchstart" in $e || $e.DocumentTouch && _e instanceof $e.DocumentTouch)
  };
}
function getSupport() {
  return support || (support = calcSupport()), support;
}
let deviceCached;
function calcDevice($e) {
  let {
    userAgent: _e
  } = $e === void 0 ? {} : $e;
  const ke = getSupport(), Be = getWindow(), Ne = Be.navigator.platform, Ve = _e || Be.navigator.userAgent, Le = {
    ios: !1,
    android: !1
  }, De = Be.screen.width, Ae = Be.screen.height, Ie = Ve.match(/(Android);?[\s\/]+([\d.]+)?/);
  let Re = Ve.match(/(iPad).*OS\s([\d_]+)/);
  const ze = Ve.match(/(iPod)(.*OS\s([\d_]+))?/), je = !Re && Ve.match(/(iPhone\sOS|iOS)\s([\d_]+)/), Fe = Ne === "Win32";
  let He = Ne === "MacIntel";
  const Ge = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
  return !Re && He && ke.touch && Ge.indexOf(`${De}x${Ae}`) >= 0 && (Re = Ve.match(/(Version)\/([\d.]+)/), Re || (Re = [0, 1, "13_0_0"]), He = !1), Ie && !Fe && (Le.os = "android", Le.android = !0), (Re || je || ze) && (Le.os = "ios", Le.ios = !0), Le;
}
function getDevice($e) {
  return $e === void 0 && ($e = {}), deviceCached || (deviceCached = calcDevice($e)), deviceCached;
}
let browser;
function calcBrowser() {
  const $e = getWindow(), _e = getDevice();
  let ke = !1;
  function Be() {
    const De = $e.navigator.userAgent.toLowerCase();
    return De.indexOf("safari") >= 0 && De.indexOf("chrome") < 0 && De.indexOf("android") < 0;
  }
  if (Be()) {
    const De = String($e.navigator.userAgent);
    if (De.includes("Version/")) {
      const [Ae, Ie] = De.split("Version/")[1].split(" ")[0].split(".").map((Re) => Number(Re));
      ke = Ae < 16 || Ae === 16 && Ie < 2;
    }
  }
  const Ne = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test($e.navigator.userAgent), Ve = Be(), Le = Ve || Ne && _e.ios;
  return {
    isSafari: ke || Ve,
    needPerspectiveFix: ke,
    need3dFix: Le,
    isWebView: Ne
  };
}
function getBrowser() {
  return browser || (browser = calcBrowser()), browser;
}
function Resize($e) {
  let {
    swiper: _e,
    on: ke,
    emit: Be
  } = $e;
  const Ne = getWindow();
  let Ve = null, Le = null;
  const De = () => {
    !_e || _e.destroyed || !_e.initialized || (Be("beforeResize"), Be("resize"));
  }, Ae = () => {
    !_e || _e.destroyed || !_e.initialized || (Ve = new ResizeObserver((ze) => {
      Le = Ne.requestAnimationFrame(() => {
        const {
          width: je,
          height: Fe
        } = _e;
        let He = je, Ge = Fe;
        ze.forEach((qe) => {
          let {
            contentBoxSize: Xe,
            contentRect: Ye,
            target: We
          } = qe;
          We && We !== _e.el || (He = Ye ? Ye.width : (Xe[0] || Xe).inlineSize, Ge = Ye ? Ye.height : (Xe[0] || Xe).blockSize);
        }), (He !== je || Ge !== Fe) && De();
      });
    }), Ve.observe(_e.el));
  }, Ie = () => {
    Le && Ne.cancelAnimationFrame(Le), Ve && Ve.unobserve && _e.el && (Ve.unobserve(_e.el), Ve = null);
  }, Re = () => {
    !_e || _e.destroyed || !_e.initialized || Be("orientationchange");
  };
  ke("init", () => {
    if (_e.params.resizeObserver && typeof Ne.ResizeObserver < "u") {
      Ae();
      return;
    }
    Ne.addEventListener("resize", De), Ne.addEventListener("orientationchange", Re);
  }), ke("destroy", () => {
    Ie(), Ne.removeEventListener("resize", De), Ne.removeEventListener("orientationchange", Re);
  });
}
function Observer($e) {
  let {
    swiper: _e,
    extendParams: ke,
    on: Be,
    emit: Ne
  } = $e;
  const Ve = [], Le = getWindow(), De = function(Re, ze) {
    ze === void 0 && (ze = {});
    const je = Le.MutationObserver || Le.WebkitMutationObserver, Fe = new je((He) => {
      if (_e.__preventObserver__) return;
      if (He.length === 1) {
        Ne("observerUpdate", He[0]);
        return;
      }
      const Ge = function() {
        Ne("observerUpdate", He[0]);
      };
      Le.requestAnimationFrame ? Le.requestAnimationFrame(Ge) : Le.setTimeout(Ge, 0);
    });
    Fe.observe(Re, {
      attributes: typeof ze.attributes > "u" ? !0 : ze.attributes,
      childList: _e.isElement || (typeof ze.childList > "u" ? !0 : ze).childList,
      characterData: typeof ze.characterData > "u" ? !0 : ze.characterData
    }), Ve.push(Fe);
  }, Ae = () => {
    if (_e.params.observer) {
      if (_e.params.observeParents) {
        const Re = elementParents(_e.hostEl);
        for (let ze = 0; ze < Re.length; ze += 1)
          De(Re[ze]);
      }
      De(_e.hostEl, {
        childList: _e.params.observeSlideChildren
      }), De(_e.wrapperEl, {
        attributes: !1
      });
    }
  }, Ie = () => {
    Ve.forEach((Re) => {
      Re.disconnect();
    }), Ve.splice(0, Ve.length);
  };
  ke({
    observer: !1,
    observeParents: !1,
    observeSlideChildren: !1
  }), Be("init", Ae), Be("destroy", Ie);
}
var eventsEmitter = {
  on($e, _e, ke) {
    const Be = this;
    if (!Be.eventsListeners || Be.destroyed || typeof _e != "function") return Be;
    const Ne = ke ? "unshift" : "push";
    return $e.split(" ").forEach((Ve) => {
      Be.eventsListeners[Ve] || (Be.eventsListeners[Ve] = []), Be.eventsListeners[Ve][Ne](_e);
    }), Be;
  },
  once($e, _e, ke) {
    const Be = this;
    if (!Be.eventsListeners || Be.destroyed || typeof _e != "function") return Be;
    function Ne() {
      Be.off($e, Ne), Ne.__emitterProxy && delete Ne.__emitterProxy;
      for (var Ve = arguments.length, Le = new Array(Ve), De = 0; De < Ve; De++)
        Le[De] = arguments[De];
      _e.apply(Be, Le);
    }
    return Ne.__emitterProxy = _e, Be.on($e, Ne, ke);
  },
  onAny($e, _e) {
    const ke = this;
    if (!ke.eventsListeners || ke.destroyed || typeof $e != "function") return ke;
    const Be = _e ? "unshift" : "push";
    return ke.eventsAnyListeners.indexOf($e) < 0 && ke.eventsAnyListeners[Be]($e), ke;
  },
  offAny($e) {
    const _e = this;
    if (!_e.eventsListeners || _e.destroyed || !_e.eventsAnyListeners) return _e;
    const ke = _e.eventsAnyListeners.indexOf($e);
    return ke >= 0 && _e.eventsAnyListeners.splice(ke, 1), _e;
  },
  off($e, _e) {
    const ke = this;
    return !ke.eventsListeners || ke.destroyed || !ke.eventsListeners || $e.split(" ").forEach((Be) => {
      typeof _e > "u" ? ke.eventsListeners[Be] = [] : ke.eventsListeners[Be] && ke.eventsListeners[Be].forEach((Ne, Ve) => {
        (Ne === _e || Ne.__emitterProxy && Ne.__emitterProxy === _e) && ke.eventsListeners[Be].splice(Ve, 1);
      });
    }), ke;
  },
  emit() {
    const $e = this;
    if (!$e.eventsListeners || $e.destroyed || !$e.eventsListeners) return $e;
    let _e, ke, Be;
    for (var Ne = arguments.length, Ve = new Array(Ne), Le = 0; Le < Ne; Le++)
      Ve[Le] = arguments[Le];
    return typeof Ve[0] == "string" || Array.isArray(Ve[0]) ? (_e = Ve[0], ke = Ve.slice(1, Ve.length), Be = $e) : (_e = Ve[0].events, ke = Ve[0].data, Be = Ve[0].context || $e), ke.unshift(Be), (Array.isArray(_e) ? _e : _e.split(" ")).forEach((Ae) => {
      $e.eventsAnyListeners && $e.eventsAnyListeners.length && $e.eventsAnyListeners.forEach((Ie) => {
        Ie.apply(Be, [Ae, ...ke]);
      }), $e.eventsListeners && $e.eventsListeners[Ae] && $e.eventsListeners[Ae].forEach((Ie) => {
        Ie.apply(Be, ke);
      });
    }), $e;
  }
};
function updateSize() {
  const $e = this;
  let _e, ke;
  const Be = $e.el;
  typeof $e.params.width < "u" && $e.params.width !== null ? _e = $e.params.width : _e = Be.clientWidth, typeof $e.params.height < "u" && $e.params.height !== null ? ke = $e.params.height : ke = Be.clientHeight, !(_e === 0 && $e.isHorizontal() || ke === 0 && $e.isVertical()) && (_e = _e - parseInt(elementStyle(Be, "padding-left") || 0, 10) - parseInt(elementStyle(Be, "padding-right") || 0, 10), ke = ke - parseInt(elementStyle(Be, "padding-top") || 0, 10) - parseInt(elementStyle(Be, "padding-bottom") || 0, 10), Number.isNaN(_e) && (_e = 0), Number.isNaN(ke) && (ke = 0), Object.assign($e, {
    width: _e,
    height: ke,
    size: $e.isHorizontal() ? _e : ke
  }));
}
function updateSlides() {
  const $e = this;
  function _e(Ue, Ke) {
    return parseFloat(Ue.getPropertyValue($e.getDirectionLabel(Ke)) || 0);
  }
  const ke = $e.params, {
    wrapperEl: Be,
    slidesEl: Ne,
    size: Ve,
    rtlTranslate: Le,
    wrongRTL: De
  } = $e, Ae = $e.virtual && ke.virtual.enabled, Ie = Ae ? $e.virtual.slides.length : $e.slides.length, Re = elementChildren(Ne, `.${$e.params.slideClass}, swiper-slide`), ze = Ae ? $e.virtual.slides.length : Re.length;
  let je = [];
  const Fe = [], He = [];
  let Ge = ke.slidesOffsetBefore;
  typeof Ge == "function" && (Ge = ke.slidesOffsetBefore.call($e));
  let qe = ke.slidesOffsetAfter;
  typeof qe == "function" && (qe = ke.slidesOffsetAfter.call($e));
  const Xe = $e.snapGrid.length, Ye = $e.slidesGrid.length;
  let We = ke.spaceBetween, Je = -Ge, ri = 0, Qe = 0;
  if (typeof Ve > "u")
    return;
  typeof We == "string" && We.indexOf("%") >= 0 ? We = parseFloat(We.replace("%", "")) / 100 * Ve : typeof We == "string" && (We = parseFloat(We)), $e.virtualSize = -We, Re.forEach((Ue) => {
    Le ? Ue.style.marginLeft = "" : Ue.style.marginRight = "", Ue.style.marginBottom = "", Ue.style.marginTop = "";
  }), ke.centeredSlides && ke.cssMode && (setCSSProperty(Be, "--swiper-centered-offset-before", ""), setCSSProperty(Be, "--swiper-centered-offset-after", ""));
  const ti = ke.grid && ke.grid.rows > 1 && $e.grid;
  ti ? $e.grid.initSlides(Re) : $e.grid && $e.grid.unsetSlides();
  let ei;
  const Ze = ke.slidesPerView === "auto" && ke.breakpoints && Object.keys(ke.breakpoints).filter((Ue) => typeof ke.breakpoints[Ue].slidesPerView < "u").length > 0;
  for (let Ue = 0; Ue < ze; Ue += 1) {
    ei = 0;
    let Ke;
    if (Re[Ue] && (Ke = Re[Ue]), ti && $e.grid.updateSlide(Ue, Ke, Re), !(Re[Ue] && elementStyle(Ke, "display") === "none")) {
      if (ke.slidesPerView === "auto") {
        Ze && (Re[Ue].style[$e.getDirectionLabel("width")] = "");
        const ii = getComputedStyle(Ke), oi = Ke.style.transform, ni = Ke.style.webkitTransform;
        if (oi && (Ke.style.transform = "none"), ni && (Ke.style.webkitTransform = "none"), ke.roundLengths)
          ei = $e.isHorizontal() ? elementOuterSize(Ke, "width") : elementOuterSize(Ke, "height");
        else {
          const pi = _e(ii, "width"), ci = _e(ii, "padding-left"), fi = _e(ii, "padding-right"), hi = _e(ii, "margin-left"), ui = _e(ii, "margin-right"), ai = ii.getPropertyValue("box-sizing");
          if (ai && ai === "border-box")
            ei = pi + hi + ui;
          else {
            const {
              clientWidth: di,
              offsetWidth: gi
            } = Ke;
            ei = pi + ci + fi + hi + ui + (gi - di);
          }
        }
        oi && (Ke.style.transform = oi), ni && (Ke.style.webkitTransform = ni), ke.roundLengths && (ei = Math.floor(ei));
      } else
        ei = (Ve - (ke.slidesPerView - 1) * We) / ke.slidesPerView, ke.roundLengths && (ei = Math.floor(ei)), Re[Ue] && (Re[Ue].style[$e.getDirectionLabel("width")] = `${ei}px`);
      Re[Ue] && (Re[Ue].swiperSlideSize = ei), He.push(ei), ke.centeredSlides ? (Je = Je + ei / 2 + ri / 2 + We, ri === 0 && Ue !== 0 && (Je = Je - Ve / 2 - We), Ue === 0 && (Je = Je - Ve / 2 - We), Math.abs(Je) < 1 / 1e3 && (Je = 0), ke.roundLengths && (Je = Math.floor(Je)), Qe % ke.slidesPerGroup === 0 && je.push(Je), Fe.push(Je)) : (ke.roundLengths && (Je = Math.floor(Je)), (Qe - Math.min($e.params.slidesPerGroupSkip, Qe)) % $e.params.slidesPerGroup === 0 && je.push(Je), Fe.push(Je), Je = Je + ei + We), $e.virtualSize += ei + We, ri = ei, Qe += 1;
    }
  }
  if ($e.virtualSize = Math.max($e.virtualSize, Ve) + qe, Le && De && (ke.effect === "slide" || ke.effect === "coverflow") && (Be.style.width = `${$e.virtualSize + We}px`), ke.setWrapperSize && (Be.style[$e.getDirectionLabel("width")] = `${$e.virtualSize + We}px`), ti && $e.grid.updateWrapperSize(ei, je), !ke.centeredSlides) {
    const Ue = [];
    for (let Ke = 0; Ke < je.length; Ke += 1) {
      let ii = je[Ke];
      ke.roundLengths && (ii = Math.floor(ii)), je[Ke] <= $e.virtualSize - Ve && Ue.push(ii);
    }
    je = Ue, Math.floor($e.virtualSize - Ve) - Math.floor(je[je.length - 1]) > 1 && je.push($e.virtualSize - Ve);
  }
  if (Ae && ke.loop) {
    const Ue = He[0] + We;
    if (ke.slidesPerGroup > 1) {
      const Ke = Math.ceil(($e.virtual.slidesBefore + $e.virtual.slidesAfter) / ke.slidesPerGroup), ii = Ue * ke.slidesPerGroup;
      for (let oi = 0; oi < Ke; oi += 1)
        je.push(je[je.length - 1] + ii);
    }
    for (let Ke = 0; Ke < $e.virtual.slidesBefore + $e.virtual.slidesAfter; Ke += 1)
      ke.slidesPerGroup === 1 && je.push(je[je.length - 1] + Ue), Fe.push(Fe[Fe.length - 1] + Ue), $e.virtualSize += Ue;
  }
  if (je.length === 0 && (je = [0]), We !== 0) {
    const Ue = $e.isHorizontal() && Le ? "marginLeft" : $e.getDirectionLabel("marginRight");
    Re.filter((Ke, ii) => !ke.cssMode || ke.loop ? !0 : ii !== Re.length - 1).forEach((Ke) => {
      Ke.style[Ue] = `${We}px`;
    });
  }
  if (ke.centeredSlides && ke.centeredSlidesBounds) {
    let Ue = 0;
    He.forEach((ii) => {
      Ue += ii + (We || 0);
    }), Ue -= We;
    const Ke = Ue > Ve ? Ue - Ve : 0;
    je = je.map((ii) => ii <= 0 ? -Ge : ii > Ke ? Ke + qe : ii);
  }
  if (ke.centerInsufficientSlides) {
    let Ue = 0;
    He.forEach((ii) => {
      Ue += ii + (We || 0);
    }), Ue -= We;
    const Ke = (ke.slidesOffsetBefore || 0) + (ke.slidesOffsetAfter || 0);
    if (Ue + Ke < Ve) {
      const ii = (Ve - Ue - Ke) / 2;
      je.forEach((oi, ni) => {
        je[ni] = oi - ii;
      }), Fe.forEach((oi, ni) => {
        Fe[ni] = oi + ii;
      });
    }
  }
  if (Object.assign($e, {
    slides: Re,
    snapGrid: je,
    slidesGrid: Fe,
    slidesSizesGrid: He
  }), ke.centeredSlides && ke.cssMode && !ke.centeredSlidesBounds) {
    setCSSProperty(Be, "--swiper-centered-offset-before", `${-je[0]}px`), setCSSProperty(Be, "--swiper-centered-offset-after", `${$e.size / 2 - He[He.length - 1] / 2}px`);
    const Ue = -$e.snapGrid[0], Ke = -$e.slidesGrid[0];
    $e.snapGrid = $e.snapGrid.map((ii) => ii + Ue), $e.slidesGrid = $e.slidesGrid.map((ii) => ii + Ke);
  }
  if (ze !== Ie && $e.emit("slidesLengthChange"), je.length !== Xe && ($e.params.watchOverflow && $e.checkOverflow(), $e.emit("snapGridLengthChange")), Fe.length !== Ye && $e.emit("slidesGridLengthChange"), ke.watchSlidesProgress && $e.updateSlidesOffset(), $e.emit("slidesUpdated"), !Ae && !ke.cssMode && (ke.effect === "slide" || ke.effect === "fade")) {
    const Ue = `${ke.containerModifierClass}backface-hidden`, Ke = $e.el.classList.contains(Ue);
    ze <= ke.maxBackfaceHiddenSlides ? Ke || $e.el.classList.add(Ue) : Ke && $e.el.classList.remove(Ue);
  }
}
function updateAutoHeight($e) {
  const _e = this, ke = [], Be = _e.virtual && _e.params.virtual.enabled;
  let Ne = 0, Ve;
  typeof $e == "number" ? _e.setTransition($e) : $e === !0 && _e.setTransition(_e.params.speed);
  const Le = (De) => Be ? _e.slides[_e.getSlideIndexByData(De)] : _e.slides[De];
  if (_e.params.slidesPerView !== "auto" && _e.params.slidesPerView > 1)
    if (_e.params.centeredSlides)
      (_e.visibleSlides || []).forEach((De) => {
        ke.push(De);
      });
    else
      for (Ve = 0; Ve < Math.ceil(_e.params.slidesPerView); Ve += 1) {
        const De = _e.activeIndex + Ve;
        if (De > _e.slides.length && !Be) break;
        ke.push(Le(De));
      }
  else
    ke.push(Le(_e.activeIndex));
  for (Ve = 0; Ve < ke.length; Ve += 1)
    if (typeof ke[Ve] < "u") {
      const De = ke[Ve].offsetHeight;
      Ne = De > Ne ? De : Ne;
    }
  (Ne || Ne === 0) && (_e.wrapperEl.style.height = `${Ne}px`);
}
function updateSlidesOffset() {
  const $e = this, _e = $e.slides, ke = $e.isElement ? $e.isHorizontal() ? $e.wrapperEl.offsetLeft : $e.wrapperEl.offsetTop : 0;
  for (let Be = 0; Be < _e.length; Be += 1)
    _e[Be].swiperSlideOffset = ($e.isHorizontal() ? _e[Be].offsetLeft : _e[Be].offsetTop) - ke - $e.cssOverflowAdjustment();
}
const toggleSlideClasses$1 = ($e, _e, ke) => {
  _e && !$e.classList.contains(ke) ? $e.classList.add(ke) : !_e && $e.classList.contains(ke) && $e.classList.remove(ke);
};
function updateSlidesProgress($e) {
  $e === void 0 && ($e = this && this.translate || 0);
  const _e = this, ke = _e.params, {
    slides: Be,
    rtlTranslate: Ne,
    snapGrid: Ve
  } = _e;
  if (Be.length === 0) return;
  typeof Be[0].swiperSlideOffset > "u" && _e.updateSlidesOffset();
  let Le = -$e;
  Ne && (Le = $e), _e.visibleSlidesIndexes = [], _e.visibleSlides = [];
  let De = ke.spaceBetween;
  typeof De == "string" && De.indexOf("%") >= 0 ? De = parseFloat(De.replace("%", "")) / 100 * _e.size : typeof De == "string" && (De = parseFloat(De));
  for (let Ae = 0; Ae < Be.length; Ae += 1) {
    const Ie = Be[Ae];
    let Re = Ie.swiperSlideOffset;
    ke.cssMode && ke.centeredSlides && (Re -= Be[0].swiperSlideOffset);
    const ze = (Le + (ke.centeredSlides ? _e.minTranslate() : 0) - Re) / (Ie.swiperSlideSize + De), je = (Le - Ve[0] + (ke.centeredSlides ? _e.minTranslate() : 0) - Re) / (Ie.swiperSlideSize + De), Fe = -(Le - Re), He = Fe + _e.slidesSizesGrid[Ae], Ge = Fe >= 0 && Fe <= _e.size - _e.slidesSizesGrid[Ae], qe = Fe >= 0 && Fe < _e.size - 1 || He > 1 && He <= _e.size || Fe <= 0 && He >= _e.size;
    qe && (_e.visibleSlides.push(Ie), _e.visibleSlidesIndexes.push(Ae)), toggleSlideClasses$1(Ie, qe, ke.slideVisibleClass), toggleSlideClasses$1(Ie, Ge, ke.slideFullyVisibleClass), Ie.progress = Ne ? -ze : ze, Ie.originalProgress = Ne ? -je : je;
  }
}
function updateProgress($e) {
  const _e = this;
  if (typeof $e > "u") {
    const Re = _e.rtlTranslate ? -1 : 1;
    $e = _e && _e.translate && _e.translate * Re || 0;
  }
  const ke = _e.params, Be = _e.maxTranslate() - _e.minTranslate();
  let {
    progress: Ne,
    isBeginning: Ve,
    isEnd: Le,
    progressLoop: De
  } = _e;
  const Ae = Ve, Ie = Le;
  if (Be === 0)
    Ne = 0, Ve = !0, Le = !0;
  else {
    Ne = ($e - _e.minTranslate()) / Be;
    const Re = Math.abs($e - _e.minTranslate()) < 1, ze = Math.abs($e - _e.maxTranslate()) < 1;
    Ve = Re || Ne <= 0, Le = ze || Ne >= 1, Re && (Ne = 0), ze && (Ne = 1);
  }
  if (ke.loop) {
    const Re = _e.getSlideIndexByData(0), ze = _e.getSlideIndexByData(_e.slides.length - 1), je = _e.slidesGrid[Re], Fe = _e.slidesGrid[ze], He = _e.slidesGrid[_e.slidesGrid.length - 1], Ge = Math.abs($e);
    Ge >= je ? De = (Ge - je) / He : De = (Ge + He - Fe) / He, De > 1 && (De -= 1);
  }
  Object.assign(_e, {
    progress: Ne,
    progressLoop: De,
    isBeginning: Ve,
    isEnd: Le
  }), (ke.watchSlidesProgress || ke.centeredSlides && ke.autoHeight) && _e.updateSlidesProgress($e), Ve && !Ae && _e.emit("reachBeginning toEdge"), Le && !Ie && _e.emit("reachEnd toEdge"), (Ae && !Ve || Ie && !Le) && _e.emit("fromEdge"), _e.emit("progress", Ne);
}
const toggleSlideClasses = ($e, _e, ke) => {
  _e && !$e.classList.contains(ke) ? $e.classList.add(ke) : !_e && $e.classList.contains(ke) && $e.classList.remove(ke);
};
function updateSlidesClasses() {
  const $e = this, {
    slides: _e,
    params: ke,
    slidesEl: Be,
    activeIndex: Ne
  } = $e, Ve = $e.virtual && ke.virtual.enabled, Le = $e.grid && ke.grid && ke.grid.rows > 1, De = (ze) => elementChildren(Be, `.${ke.slideClass}${ze}, swiper-slide${ze}`)[0];
  let Ae, Ie, Re;
  if (Ve)
    if (ke.loop) {
      let ze = Ne - $e.virtual.slidesBefore;
      ze < 0 && (ze = $e.virtual.slides.length + ze), ze >= $e.virtual.slides.length && (ze -= $e.virtual.slides.length), Ae = De(`[data-swiper-slide-index="${ze}"]`);
    } else
      Ae = De(`[data-swiper-slide-index="${Ne}"]`);
  else
    Le ? (Ae = _e.find((ze) => ze.column === Ne), Re = _e.find((ze) => ze.column === Ne + 1), Ie = _e.find((ze) => ze.column === Ne - 1)) : Ae = _e[Ne];
  Ae && (Le || (Re = elementNextAll(Ae, `.${ke.slideClass}, swiper-slide`)[0], ke.loop && !Re && (Re = _e[0]), Ie = elementPrevAll(Ae, `.${ke.slideClass}, swiper-slide`)[0], ke.loop && !Ie === 0 && (Ie = _e[_e.length - 1]))), _e.forEach((ze) => {
    toggleSlideClasses(ze, ze === Ae, ke.slideActiveClass), toggleSlideClasses(ze, ze === Re, ke.slideNextClass), toggleSlideClasses(ze, ze === Ie, ke.slidePrevClass);
  }), $e.emitSlidesClasses();
}
const processLazyPreloader = ($e, _e) => {
  if (!$e || $e.destroyed || !$e.params) return;
  const ke = () => $e.isElement ? "swiper-slide" : `.${$e.params.slideClass}`, Be = _e.closest(ke());
  if (Be) {
    let Ne = Be.querySelector(`.${$e.params.lazyPreloaderClass}`);
    !Ne && $e.isElement && (Be.shadowRoot ? Ne = Be.shadowRoot.querySelector(`.${$e.params.lazyPreloaderClass}`) : requestAnimationFrame(() => {
      Be.shadowRoot && (Ne = Be.shadowRoot.querySelector(`.${$e.params.lazyPreloaderClass}`), Ne && Ne.remove());
    })), Ne && Ne.remove();
  }
}, unlazy = ($e, _e) => {
  if (!$e.slides[_e]) return;
  const ke = $e.slides[_e].querySelector('[loading="lazy"]');
  ke && ke.removeAttribute("loading");
}, preload = ($e) => {
  if (!$e || $e.destroyed || !$e.params) return;
  let _e = $e.params.lazyPreloadPrevNext;
  const ke = $e.slides.length;
  if (!ke || !_e || _e < 0) return;
  _e = Math.min(_e, ke);
  const Be = $e.params.slidesPerView === "auto" ? $e.slidesPerViewDynamic() : Math.ceil($e.params.slidesPerView), Ne = $e.activeIndex;
  if ($e.params.grid && $e.params.grid.rows > 1) {
    const Le = Ne, De = [Le - _e];
    De.push(...Array.from({
      length: _e
    }).map((Ae, Ie) => Le + Be + Ie)), $e.slides.forEach((Ae, Ie) => {
      De.includes(Ae.column) && unlazy($e, Ie);
    });
    return;
  }
  const Ve = Ne + Be - 1;
  if ($e.params.rewind || $e.params.loop)
    for (let Le = Ne - _e; Le <= Ve + _e; Le += 1) {
      const De = (Le % ke + ke) % ke;
      (De < Ne || De > Ve) && unlazy($e, De);
    }
  else
    for (let Le = Math.max(Ne - _e, 0); Le <= Math.min(Ve + _e, ke - 1); Le += 1)
      Le !== Ne && (Le > Ve || Le < Ne) && unlazy($e, Le);
};
function getActiveIndexByTranslate($e) {
  const {
    slidesGrid: _e,
    params: ke
  } = $e, Be = $e.rtlTranslate ? $e.translate : -$e.translate;
  let Ne;
  for (let Ve = 0; Ve < _e.length; Ve += 1)
    typeof _e[Ve + 1] < "u" ? Be >= _e[Ve] && Be < _e[Ve + 1] - (_e[Ve + 1] - _e[Ve]) / 2 ? Ne = Ve : Be >= _e[Ve] && Be < _e[Ve + 1] && (Ne = Ve + 1) : Be >= _e[Ve] && (Ne = Ve);
  return ke.normalizeSlideIndex && (Ne < 0 || typeof Ne > "u") && (Ne = 0), Ne;
}
function updateActiveIndex($e) {
  const _e = this, ke = _e.rtlTranslate ? _e.translate : -_e.translate, {
    snapGrid: Be,
    params: Ne,
    activeIndex: Ve,
    realIndex: Le,
    snapIndex: De
  } = _e;
  let Ae = $e, Ie;
  const Re = (Fe) => {
    let He = Fe - _e.virtual.slidesBefore;
    return He < 0 && (He = _e.virtual.slides.length + He), He >= _e.virtual.slides.length && (He -= _e.virtual.slides.length), He;
  };
  if (typeof Ae > "u" && (Ae = getActiveIndexByTranslate(_e)), Be.indexOf(ke) >= 0)
    Ie = Be.indexOf(ke);
  else {
    const Fe = Math.min(Ne.slidesPerGroupSkip, Ae);
    Ie = Fe + Math.floor((Ae - Fe) / Ne.slidesPerGroup);
  }
  if (Ie >= Be.length && (Ie = Be.length - 1), Ae === Ve && !_e.params.loop) {
    Ie !== De && (_e.snapIndex = Ie, _e.emit("snapIndexChange"));
    return;
  }
  if (Ae === Ve && _e.params.loop && _e.virtual && _e.params.virtual.enabled) {
    _e.realIndex = Re(Ae);
    return;
  }
  const ze = _e.grid && Ne.grid && Ne.grid.rows > 1;
  let je;
  if (_e.virtual && Ne.virtual.enabled && Ne.loop)
    je = Re(Ae);
  else if (ze) {
    const Fe = _e.slides.find((Ge) => Ge.column === Ae);
    let He = parseInt(Fe.getAttribute("data-swiper-slide-index"), 10);
    Number.isNaN(He) && (He = Math.max(_e.slides.indexOf(Fe), 0)), je = Math.floor(He / Ne.grid.rows);
  } else if (_e.slides[Ae]) {
    const Fe = _e.slides[Ae].getAttribute("data-swiper-slide-index");
    Fe ? je = parseInt(Fe, 10) : je = Ae;
  } else
    je = Ae;
  Object.assign(_e, {
    previousSnapIndex: De,
    snapIndex: Ie,
    previousRealIndex: Le,
    realIndex: je,
    previousIndex: Ve,
    activeIndex: Ae
  }), _e.initialized && preload(_e), _e.emit("activeIndexChange"), _e.emit("snapIndexChange"), (_e.initialized || _e.params.runCallbacksOnInit) && (Le !== je && _e.emit("realIndexChange"), _e.emit("slideChange"));
}
function updateClickedSlide($e, _e) {
  const ke = this, Be = ke.params;
  let Ne = $e.closest(`.${Be.slideClass}, swiper-slide`);
  !Ne && ke.isElement && _e && _e.length > 1 && _e.includes($e) && [..._e.slice(_e.indexOf($e) + 1, _e.length)].forEach((De) => {
    !Ne && De.matches && De.matches(`.${Be.slideClass}, swiper-slide`) && (Ne = De);
  });
  let Ve = !1, Le;
  if (Ne) {
    for (let De = 0; De < ke.slides.length; De += 1)
      if (ke.slides[De] === Ne) {
        Ve = !0, Le = De;
        break;
      }
  }
  if (Ne && Ve)
    ke.clickedSlide = Ne, ke.virtual && ke.params.virtual.enabled ? ke.clickedIndex = parseInt(Ne.getAttribute("data-swiper-slide-index"), 10) : ke.clickedIndex = Le;
  else {
    ke.clickedSlide = void 0, ke.clickedIndex = void 0;
    return;
  }
  Be.slideToClickedSlide && ke.clickedIndex !== void 0 && ke.clickedIndex !== ke.activeIndex && ke.slideToClickedSlide();
}
var update = {
  updateSize,
  updateSlides,
  updateAutoHeight,
  updateSlidesOffset,
  updateSlidesProgress,
  updateProgress,
  updateSlidesClasses,
  updateActiveIndex,
  updateClickedSlide
};
function getSwiperTranslate($e) {
  $e === void 0 && ($e = this.isHorizontal() ? "x" : "y");
  const _e = this, {
    params: ke,
    rtlTranslate: Be,
    translate: Ne,
    wrapperEl: Ve
  } = _e;
  if (ke.virtualTranslate)
    return Be ? -Ne : Ne;
  if (ke.cssMode)
    return Ne;
  let Le = getTranslate(Ve, $e);
  return Le += _e.cssOverflowAdjustment(), Be && (Le = -Le), Le || 0;
}
function setTranslate($e, _e) {
  const ke = this, {
    rtlTranslate: Be,
    params: Ne,
    wrapperEl: Ve,
    progress: Le
  } = ke;
  let De = 0, Ae = 0;
  const Ie = 0;
  ke.isHorizontal() ? De = Be ? -$e : $e : Ae = $e, Ne.roundLengths && (De = Math.floor(De), Ae = Math.floor(Ae)), ke.previousTranslate = ke.translate, ke.translate = ke.isHorizontal() ? De : Ae, Ne.cssMode ? Ve[ke.isHorizontal() ? "scrollLeft" : "scrollTop"] = ke.isHorizontal() ? -De : -Ae : Ne.virtualTranslate || (ke.isHorizontal() ? De -= ke.cssOverflowAdjustment() : Ae -= ke.cssOverflowAdjustment(), Ve.style.transform = `translate3d(${De}px, ${Ae}px, ${Ie}px)`);
  let Re;
  const ze = ke.maxTranslate() - ke.minTranslate();
  ze === 0 ? Re = 0 : Re = ($e - ke.minTranslate()) / ze, Re !== Le && ke.updateProgress($e), ke.emit("setTranslate", ke.translate, _e);
}
function minTranslate() {
  return -this.snapGrid[0];
}
function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}
function translateTo($e, _e, ke, Be, Ne) {
  $e === void 0 && ($e = 0), _e === void 0 && (_e = this.params.speed), ke === void 0 && (ke = !0), Be === void 0 && (Be = !0);
  const Ve = this, {
    params: Le,
    wrapperEl: De
  } = Ve;
  if (Ve.animating && Le.preventInteractionOnTransition)
    return !1;
  const Ae = Ve.minTranslate(), Ie = Ve.maxTranslate();
  let Re;
  if (Be && $e > Ae ? Re = Ae : Be && $e < Ie ? Re = Ie : Re = $e, Ve.updateProgress(Re), Le.cssMode) {
    const ze = Ve.isHorizontal();
    if (_e === 0)
      De[ze ? "scrollLeft" : "scrollTop"] = -Re;
    else {
      if (!Ve.support.smoothScroll)
        return animateCSSModeScroll({
          swiper: Ve,
          targetPosition: -Re,
          side: ze ? "left" : "top"
        }), !0;
      De.scrollTo({
        [ze ? "left" : "top"]: -Re,
        behavior: "smooth"
      });
    }
    return !0;
  }
  return _e === 0 ? (Ve.setTransition(0), Ve.setTranslate(Re), ke && (Ve.emit("beforeTransitionStart", _e, Ne), Ve.emit("transitionEnd"))) : (Ve.setTransition(_e), Ve.setTranslate(Re), ke && (Ve.emit("beforeTransitionStart", _e, Ne), Ve.emit("transitionStart")), Ve.animating || (Ve.animating = !0, Ve.onTranslateToWrapperTransitionEnd || (Ve.onTranslateToWrapperTransitionEnd = function(je) {
    !Ve || Ve.destroyed || je.target === this && (Ve.wrapperEl.removeEventListener("transitionend", Ve.onTranslateToWrapperTransitionEnd), Ve.onTranslateToWrapperTransitionEnd = null, delete Ve.onTranslateToWrapperTransitionEnd, Ve.animating = !1, ke && Ve.emit("transitionEnd"));
  }), Ve.wrapperEl.addEventListener("transitionend", Ve.onTranslateToWrapperTransitionEnd))), !0;
}
var translate = {
  getTranslate: getSwiperTranslate,
  setTranslate,
  minTranslate,
  maxTranslate,
  translateTo
};
function setTransition($e, _e) {
  const ke = this;
  ke.params.cssMode || (ke.wrapperEl.style.transitionDuration = `${$e}ms`, ke.wrapperEl.style.transitionDelay = $e === 0 ? "0ms" : ""), ke.emit("setTransition", $e, _e);
}
function transitionEmit($e) {
  let {
    swiper: _e,
    runCallbacks: ke,
    direction: Be,
    step: Ne
  } = $e;
  const {
    activeIndex: Ve,
    previousIndex: Le
  } = _e;
  let De = Be;
  De || (Ve > Le ? De = "next" : Ve < Le ? De = "prev" : De = "reset"), _e.emit(`transition${Ne}`), ke && De === "reset" ? _e.emit(`slideResetTransition${Ne}`) : ke && Ve !== Le && (_e.emit(`slideChangeTransition${Ne}`), De === "next" ? _e.emit(`slideNextTransition${Ne}`) : _e.emit(`slidePrevTransition${Ne}`));
}
function transitionStart($e, _e) {
  $e === void 0 && ($e = !0);
  const ke = this, {
    params: Be
  } = ke;
  Be.cssMode || (Be.autoHeight && ke.updateAutoHeight(), transitionEmit({
    swiper: ke,
    runCallbacks: $e,
    direction: _e,
    step: "Start"
  }));
}
function transitionEnd($e, _e) {
  $e === void 0 && ($e = !0);
  const ke = this, {
    params: Be
  } = ke;
  ke.animating = !1, !Be.cssMode && (ke.setTransition(0), transitionEmit({
    swiper: ke,
    runCallbacks: $e,
    direction: _e,
    step: "End"
  }));
}
var transition = {
  setTransition,
  transitionStart,
  transitionEnd
};
function slideTo($e, _e, ke, Be, Ne) {
  $e === void 0 && ($e = 0), ke === void 0 && (ke = !0), typeof $e == "string" && ($e = parseInt($e, 10));
  const Ve = this;
  let Le = $e;
  Le < 0 && (Le = 0);
  const {
    params: De,
    snapGrid: Ae,
    slidesGrid: Ie,
    previousIndex: Re,
    activeIndex: ze,
    rtlTranslate: je,
    wrapperEl: Fe,
    enabled: He
  } = Ve;
  if (!He && !Be && !Ne || Ve.destroyed || Ve.animating && De.preventInteractionOnTransition)
    return !1;
  typeof _e > "u" && (_e = Ve.params.speed);
  const Ge = Math.min(Ve.params.slidesPerGroupSkip, Le);
  let qe = Ge + Math.floor((Le - Ge) / Ve.params.slidesPerGroup);
  qe >= Ae.length && (qe = Ae.length - 1);
  const Xe = -Ae[qe];
  if (De.normalizeSlideIndex)
    for (let ti = 0; ti < Ie.length; ti += 1) {
      const ei = -Math.floor(Xe * 100), Ze = Math.floor(Ie[ti] * 100), Ue = Math.floor(Ie[ti + 1] * 100);
      typeof Ie[ti + 1] < "u" ? ei >= Ze && ei < Ue - (Ue - Ze) / 2 ? Le = ti : ei >= Ze && ei < Ue && (Le = ti + 1) : ei >= Ze && (Le = ti);
    }
  if (Ve.initialized && Le !== ze && (!Ve.allowSlideNext && (je ? Xe > Ve.translate && Xe > Ve.minTranslate() : Xe < Ve.translate && Xe < Ve.minTranslate()) || !Ve.allowSlidePrev && Xe > Ve.translate && Xe > Ve.maxTranslate() && (ze || 0) !== Le))
    return !1;
  Le !== (Re || 0) && ke && Ve.emit("beforeSlideChangeStart"), Ve.updateProgress(Xe);
  let Ye;
  Le > ze ? Ye = "next" : Le < ze ? Ye = "prev" : Ye = "reset";
  const We = Ve.virtual && Ve.params.virtual.enabled;
  if (!(We && Ne) && (je && -Xe === Ve.translate || !je && Xe === Ve.translate))
    return Ve.updateActiveIndex(Le), De.autoHeight && Ve.updateAutoHeight(), Ve.updateSlidesClasses(), De.effect !== "slide" && Ve.setTranslate(Xe), Ye !== "reset" && (Ve.transitionStart(ke, Ye), Ve.transitionEnd(ke, Ye)), !1;
  if (De.cssMode) {
    const ti = Ve.isHorizontal(), ei = je ? Xe : -Xe;
    if (_e === 0)
      We && (Ve.wrapperEl.style.scrollSnapType = "none", Ve._immediateVirtual = !0), We && !Ve._cssModeVirtualInitialSet && Ve.params.initialSlide > 0 ? (Ve._cssModeVirtualInitialSet = !0, requestAnimationFrame(() => {
        Fe[ti ? "scrollLeft" : "scrollTop"] = ei;
      })) : Fe[ti ? "scrollLeft" : "scrollTop"] = ei, We && requestAnimationFrame(() => {
        Ve.wrapperEl.style.scrollSnapType = "", Ve._immediateVirtual = !1;
      });
    else {
      if (!Ve.support.smoothScroll)
        return animateCSSModeScroll({
          swiper: Ve,
          targetPosition: ei,
          side: ti ? "left" : "top"
        }), !0;
      Fe.scrollTo({
        [ti ? "left" : "top"]: ei,
        behavior: "smooth"
      });
    }
    return !0;
  }
  const Qe = getBrowser().isSafari;
  return We && !Ne && Qe && Ve.isElement && Ve.virtual.update(!1, !1, Le), Ve.setTransition(_e), Ve.setTranslate(Xe), Ve.updateActiveIndex(Le), Ve.updateSlidesClasses(), Ve.emit("beforeTransitionStart", _e, Be), Ve.transitionStart(ke, Ye), _e === 0 ? Ve.transitionEnd(ke, Ye) : Ve.animating || (Ve.animating = !0, Ve.onSlideToWrapperTransitionEnd || (Ve.onSlideToWrapperTransitionEnd = function(ei) {
    !Ve || Ve.destroyed || ei.target === this && (Ve.wrapperEl.removeEventListener("transitionend", Ve.onSlideToWrapperTransitionEnd), Ve.onSlideToWrapperTransitionEnd = null, delete Ve.onSlideToWrapperTransitionEnd, Ve.transitionEnd(ke, Ye));
  }), Ve.wrapperEl.addEventListener("transitionend", Ve.onSlideToWrapperTransitionEnd)), !0;
}
function slideToLoop($e, _e, ke, Be) {
  $e === void 0 && ($e = 0), ke === void 0 && (ke = !0), typeof $e == "string" && ($e = parseInt($e, 10));
  const Ne = this;
  if (Ne.destroyed) return;
  typeof _e > "u" && (_e = Ne.params.speed);
  const Ve = Ne.grid && Ne.params.grid && Ne.params.grid.rows > 1;
  let Le = $e;
  if (Ne.params.loop)
    if (Ne.virtual && Ne.params.virtual.enabled)
      Le = Le + Ne.virtual.slidesBefore;
    else {
      let De;
      if (Ve) {
        const je = Le * Ne.params.grid.rows;
        De = Ne.slides.find((Fe) => Fe.getAttribute("data-swiper-slide-index") * 1 === je).column;
      } else
        De = Ne.getSlideIndexByData(Le);
      const Ae = Ve ? Math.ceil(Ne.slides.length / Ne.params.grid.rows) : Ne.slides.length, {
        centeredSlides: Ie
      } = Ne.params;
      let Re = Ne.params.slidesPerView;
      Re === "auto" ? Re = Ne.slidesPerViewDynamic() : (Re = Math.ceil(parseFloat(Ne.params.slidesPerView, 10)), Ie && Re % 2 === 0 && (Re = Re + 1));
      let ze = Ae - De < Re;
      if (Ie && (ze = ze || De < Math.ceil(Re / 2)), Be && Ie && Ne.params.slidesPerView !== "auto" && !Ve && (ze = !1), ze) {
        const je = Ie ? De < Ne.activeIndex ? "prev" : "next" : De - Ne.activeIndex - 1 < Ne.params.slidesPerView ? "next" : "prev";
        Ne.loopFix({
          direction: je,
          slideTo: !0,
          activeSlideIndex: je === "next" ? De + 1 : De - Ae + 1,
          slideRealIndex: je === "next" ? Ne.realIndex : void 0
        });
      }
      if (Ve) {
        const je = Le * Ne.params.grid.rows;
        Le = Ne.slides.find((Fe) => Fe.getAttribute("data-swiper-slide-index") * 1 === je).column;
      } else
        Le = Ne.getSlideIndexByData(Le);
    }
  return requestAnimationFrame(() => {
    Ne.slideTo(Le, _e, ke, Be);
  }), Ne;
}
function slideNext($e, _e, ke) {
  _e === void 0 && (_e = !0);
  const Be = this, {
    enabled: Ne,
    params: Ve,
    animating: Le
  } = Be;
  if (!Ne || Be.destroyed) return Be;
  typeof $e > "u" && ($e = Be.params.speed);
  let De = Ve.slidesPerGroup;
  Ve.slidesPerView === "auto" && Ve.slidesPerGroup === 1 && Ve.slidesPerGroupAuto && (De = Math.max(Be.slidesPerViewDynamic("current", !0), 1));
  const Ae = Be.activeIndex < Ve.slidesPerGroupSkip ? 1 : De, Ie = Be.virtual && Ve.virtual.enabled;
  if (Ve.loop) {
    if (Le && !Ie && Ve.loopPreventsSliding) return !1;
    if (Be.loopFix({
      direction: "next"
    }), Be._clientLeft = Be.wrapperEl.clientLeft, Be.activeIndex === Be.slides.length - 1 && Ve.cssMode)
      return requestAnimationFrame(() => {
        Be.slideTo(Be.activeIndex + Ae, $e, _e, ke);
      }), !0;
  }
  return Ve.rewind && Be.isEnd ? Be.slideTo(0, $e, _e, ke) : Be.slideTo(Be.activeIndex + Ae, $e, _e, ke);
}
function slidePrev($e, _e, ke) {
  _e === void 0 && (_e = !0);
  const Be = this, {
    params: Ne,
    snapGrid: Ve,
    slidesGrid: Le,
    rtlTranslate: De,
    enabled: Ae,
    animating: Ie
  } = Be;
  if (!Ae || Be.destroyed) return Be;
  typeof $e > "u" && ($e = Be.params.speed);
  const Re = Be.virtual && Ne.virtual.enabled;
  if (Ne.loop) {
    if (Ie && !Re && Ne.loopPreventsSliding) return !1;
    Be.loopFix({
      direction: "prev"
    }), Be._clientLeft = Be.wrapperEl.clientLeft;
  }
  const ze = De ? Be.translate : -Be.translate;
  function je(Ye) {
    return Ye < 0 ? -Math.floor(Math.abs(Ye)) : Math.floor(Ye);
  }
  const Fe = je(ze), He = Ve.map((Ye) => je(Ye)), Ge = Ne.freeMode && Ne.freeMode.enabled;
  let qe = Ve[He.indexOf(Fe) - 1];
  if (typeof qe > "u" && (Ne.cssMode || Ge)) {
    let Ye;
    Ve.forEach((We, Je) => {
      Fe >= We && (Ye = Je);
    }), typeof Ye < "u" && (qe = Ge ? Ve[Ye] : Ve[Ye > 0 ? Ye - 1 : Ye]);
  }
  let Xe = 0;
  if (typeof qe < "u" && (Xe = Le.indexOf(qe), Xe < 0 && (Xe = Be.activeIndex - 1), Ne.slidesPerView === "auto" && Ne.slidesPerGroup === 1 && Ne.slidesPerGroupAuto && (Xe = Xe - Be.slidesPerViewDynamic("previous", !0) + 1, Xe = Math.max(Xe, 0))), Ne.rewind && Be.isBeginning) {
    const Ye = Be.params.virtual && Be.params.virtual.enabled && Be.virtual ? Be.virtual.slides.length - 1 : Be.slides.length - 1;
    return Be.slideTo(Ye, $e, _e, ke);
  } else if (Ne.loop && Be.activeIndex === 0 && Ne.cssMode)
    return requestAnimationFrame(() => {
      Be.slideTo(Xe, $e, _e, ke);
    }), !0;
  return Be.slideTo(Xe, $e, _e, ke);
}
function slideReset($e, _e, ke) {
  _e === void 0 && (_e = !0);
  const Be = this;
  if (!Be.destroyed)
    return typeof $e > "u" && ($e = Be.params.speed), Be.slideTo(Be.activeIndex, $e, _e, ke);
}
function slideToClosest($e, _e, ke, Be) {
  _e === void 0 && (_e = !0), Be === void 0 && (Be = 0.5);
  const Ne = this;
  if (Ne.destroyed) return;
  typeof $e > "u" && ($e = Ne.params.speed);
  let Ve = Ne.activeIndex;
  const Le = Math.min(Ne.params.slidesPerGroupSkip, Ve), De = Le + Math.floor((Ve - Le) / Ne.params.slidesPerGroup), Ae = Ne.rtlTranslate ? Ne.translate : -Ne.translate;
  if (Ae >= Ne.snapGrid[De]) {
    const Ie = Ne.snapGrid[De], Re = Ne.snapGrid[De + 1];
    Ae - Ie > (Re - Ie) * Be && (Ve += Ne.params.slidesPerGroup);
  } else {
    const Ie = Ne.snapGrid[De - 1], Re = Ne.snapGrid[De];
    Ae - Ie <= (Re - Ie) * Be && (Ve -= Ne.params.slidesPerGroup);
  }
  return Ve = Math.max(Ve, 0), Ve = Math.min(Ve, Ne.slidesGrid.length - 1), Ne.slideTo(Ve, $e, _e, ke);
}
function slideToClickedSlide() {
  const $e = this;
  if ($e.destroyed) return;
  const {
    params: _e,
    slidesEl: ke
  } = $e, Be = _e.slidesPerView === "auto" ? $e.slidesPerViewDynamic() : _e.slidesPerView;
  let Ne = $e.getSlideIndexWhenGrid($e.clickedIndex), Ve;
  const Le = $e.isElement ? "swiper-slide" : `.${_e.slideClass}`, De = $e.grid && $e.params.grid && $e.params.grid.rows > 1;
  if (_e.loop) {
    if ($e.animating) return;
    Ve = parseInt($e.clickedSlide.getAttribute("data-swiper-slide-index"), 10), _e.centeredSlides ? $e.slideToLoop(Ve) : Ne > (De ? ($e.slides.length - Be) / 2 - ($e.params.grid.rows - 1) : $e.slides.length - Be) ? ($e.loopFix(), Ne = $e.getSlideIndex(elementChildren(ke, `${Le}[data-swiper-slide-index="${Ve}"]`)[0]), nextTick(() => {
      $e.slideTo(Ne);
    })) : $e.slideTo(Ne);
  } else
    $e.slideTo(Ne);
}
var slide = {
  slideTo,
  slideToLoop,
  slideNext,
  slidePrev,
  slideReset,
  slideToClosest,
  slideToClickedSlide
};
function loopCreate($e, _e) {
  const ke = this, {
    params: Be,
    slidesEl: Ne
  } = ke;
  if (!Be.loop || ke.virtual && ke.params.virtual.enabled) return;
  const Ve = () => {
    elementChildren(Ne, `.${Be.slideClass}, swiper-slide`).forEach((Fe, He) => {
      Fe.setAttribute("data-swiper-slide-index", He);
    });
  }, Le = () => {
    const je = elementChildren(Ne, `.${Be.slideBlankClass}`);
    je.forEach((Fe) => {
      Fe.remove();
    }), je.length > 0 && (ke.recalcSlides(), ke.updateSlides());
  }, De = ke.grid && Be.grid && Be.grid.rows > 1;
  Be.loopAddBlankSlides && (Be.slidesPerGroup > 1 || De) && Le();
  const Ae = Be.slidesPerGroup * (De ? Be.grid.rows : 1), Ie = ke.slides.length % Ae !== 0, Re = De && ke.slides.length % Be.grid.rows !== 0, ze = (je) => {
    for (let Fe = 0; Fe < je; Fe += 1) {
      const He = ke.isElement ? createElement("swiper-slide", [Be.slideBlankClass]) : createElement("div", [Be.slideClass, Be.slideBlankClass]);
      ke.slidesEl.append(He);
    }
  };
  if (Ie) {
    if (Be.loopAddBlankSlides) {
      const je = Ae - ke.slides.length % Ae;
      ze(je), ke.recalcSlides(), ke.updateSlides();
    } else
      showWarning("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
    Ve();
  } else if (Re) {
    if (Be.loopAddBlankSlides) {
      const je = Be.grid.rows - ke.slides.length % Be.grid.rows;
      ze(je), ke.recalcSlides(), ke.updateSlides();
    } else
      showWarning("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
    Ve();
  } else
    Ve();
  ke.loopFix({
    slideRealIndex: $e,
    direction: Be.centeredSlides ? void 0 : "next",
    initial: _e
  });
}
function loopFix($e) {
  let {
    slideRealIndex: _e,
    slideTo: ke = !0,
    direction: Be,
    setTranslate: Ne,
    activeSlideIndex: Ve,
    initial: Le,
    byController: De,
    byMousewheel: Ae
  } = $e === void 0 ? {} : $e;
  const Ie = this;
  if (!Ie.params.loop) return;
  Ie.emit("beforeLoopFix");
  const {
    slides: Re,
    allowSlidePrev: ze,
    allowSlideNext: je,
    slidesEl: Fe,
    params: He
  } = Ie, {
    centeredSlides: Ge,
    initialSlide: qe
  } = He;
  if (Ie.allowSlidePrev = !0, Ie.allowSlideNext = !0, Ie.virtual && He.virtual.enabled) {
    ke && (!He.centeredSlides && Ie.snapIndex === 0 ? Ie.slideTo(Ie.virtual.slides.length, 0, !1, !0) : He.centeredSlides && Ie.snapIndex < He.slidesPerView ? Ie.slideTo(Ie.virtual.slides.length + Ie.snapIndex, 0, !1, !0) : Ie.snapIndex === Ie.snapGrid.length - 1 && Ie.slideTo(Ie.virtual.slidesBefore, 0, !1, !0)), Ie.allowSlidePrev = ze, Ie.allowSlideNext = je, Ie.emit("loopFix");
    return;
  }
  let Xe = He.slidesPerView;
  Xe === "auto" ? Xe = Ie.slidesPerViewDynamic() : (Xe = Math.ceil(parseFloat(He.slidesPerView, 10)), Ge && Xe % 2 === 0 && (Xe = Xe + 1));
  const Ye = He.slidesPerGroupAuto ? Xe : He.slidesPerGroup;
  let We = Ge ? Math.max(Ye, Math.ceil(Xe / 2)) : Ye;
  We % Ye !== 0 && (We += Ye - We % Ye), We += He.loopAdditionalSlides, Ie.loopedSlides = We;
  const Je = Ie.grid && He.grid && He.grid.rows > 1;
  Re.length < Xe + We || Ie.params.effect === "cards" && Re.length < Xe + We * 2 ? showWarning("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters") : Je && He.grid.fill === "row" && showWarning("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
  const ri = [], Qe = [], ti = Je ? Math.ceil(Re.length / He.grid.rows) : Re.length, ei = Le && ti - qe < Xe && !Ge;
  let Ze = ei ? qe : Ie.activeIndex;
  typeof Ve > "u" ? Ve = Ie.getSlideIndex(Re.find((ci) => ci.classList.contains(He.slideActiveClass))) : Ze = Ve;
  const Ue = Be === "next" || !Be, Ke = Be === "prev" || !Be;
  let ii = 0, oi = 0;
  const pi = (Je ? Re[Ve].column : Ve) + (Ge && typeof Ne > "u" ? -Xe / 2 + 0.5 : 0);
  if (pi < We) {
    ii = Math.max(We - pi, Ye);
    for (let ci = 0; ci < We - pi; ci += 1) {
      const fi = ci - Math.floor(ci / ti) * ti;
      if (Je) {
        const hi = ti - fi - 1;
        for (let ui = Re.length - 1; ui >= 0; ui -= 1)
          Re[ui].column === hi && ri.push(ui);
      } else
        ri.push(ti - fi - 1);
    }
  } else if (pi + Xe > ti - We) {
    oi = Math.max(pi - (ti - We * 2), Ye), ei && (oi = Math.max(oi, Xe - ti + qe + 1));
    for (let ci = 0; ci < oi; ci += 1) {
      const fi = ci - Math.floor(ci / ti) * ti;
      Je ? Re.forEach((hi, ui) => {
        hi.column === fi && Qe.push(ui);
      }) : Qe.push(fi);
    }
  }
  if (Ie.__preventObserver__ = !0, requestAnimationFrame(() => {
    Ie.__preventObserver__ = !1;
  }), Ie.params.effect === "cards" && Re.length < Xe + We * 2 && (Qe.includes(Ve) && Qe.splice(Qe.indexOf(Ve), 1), ri.includes(Ve) && ri.splice(ri.indexOf(Ve), 1)), Ke && ri.forEach((ci) => {
    Re[ci].swiperLoopMoveDOM = !0, Fe.prepend(Re[ci]), Re[ci].swiperLoopMoveDOM = !1;
  }), Ue && Qe.forEach((ci) => {
    Re[ci].swiperLoopMoveDOM = !0, Fe.append(Re[ci]), Re[ci].swiperLoopMoveDOM = !1;
  }), Ie.recalcSlides(), He.slidesPerView === "auto" ? Ie.updateSlides() : Je && (ri.length > 0 && Ke || Qe.length > 0 && Ue) && Ie.slides.forEach((ci, fi) => {
    Ie.grid.updateSlide(fi, ci, Ie.slides);
  }), He.watchSlidesProgress && Ie.updateSlidesOffset(), ke) {
    if (ri.length > 0 && Ke) {
      if (typeof _e > "u") {
        const ci = Ie.slidesGrid[Ze], hi = Ie.slidesGrid[Ze + ii] - ci;
        Ae ? Ie.setTranslate(Ie.translate - hi) : (Ie.slideTo(Ze + Math.ceil(ii), 0, !1, !0), Ne && (Ie.touchEventsData.startTranslate = Ie.touchEventsData.startTranslate - hi, Ie.touchEventsData.currentTranslate = Ie.touchEventsData.currentTranslate - hi));
      } else if (Ne) {
        const ci = Je ? ri.length / He.grid.rows : ri.length;
        Ie.slideTo(Ie.activeIndex + ci, 0, !1, !0), Ie.touchEventsData.currentTranslate = Ie.translate;
      }
    } else if (Qe.length > 0 && Ue)
      if (typeof _e > "u") {
        const ci = Ie.slidesGrid[Ze], hi = Ie.slidesGrid[Ze - oi] - ci;
        Ae ? Ie.setTranslate(Ie.translate - hi) : (Ie.slideTo(Ze - oi, 0, !1, !0), Ne && (Ie.touchEventsData.startTranslate = Ie.touchEventsData.startTranslate - hi, Ie.touchEventsData.currentTranslate = Ie.touchEventsData.currentTranslate - hi));
      } else {
        const ci = Je ? Qe.length / He.grid.rows : Qe.length;
        Ie.slideTo(Ie.activeIndex - ci, 0, !1, !0);
      }
  }
  if (Ie.allowSlidePrev = ze, Ie.allowSlideNext = je, Ie.controller && Ie.controller.control && !De) {
    const ci = {
      slideRealIndex: _e,
      direction: Be,
      setTranslate: Ne,
      activeSlideIndex: Ve,
      byController: !0
    };
    Array.isArray(Ie.controller.control) ? Ie.controller.control.forEach((fi) => {
      !fi.destroyed && fi.params.loop && fi.loopFix({
        ...ci,
        slideTo: fi.params.slidesPerView === He.slidesPerView ? ke : !1
      });
    }) : Ie.controller.control instanceof Ie.constructor && Ie.controller.control.params.loop && Ie.controller.control.loopFix({
      ...ci,
      slideTo: Ie.controller.control.params.slidesPerView === He.slidesPerView ? ke : !1
    });
  }
  Ie.emit("loopFix");
}
function loopDestroy() {
  const $e = this, {
    params: _e,
    slidesEl: ke
  } = $e;
  if (!_e.loop || !ke || $e.virtual && $e.params.virtual.enabled) return;
  $e.recalcSlides();
  const Be = [];
  $e.slides.forEach((Ne) => {
    const Ve = typeof Ne.swiperSlideIndex > "u" ? Ne.getAttribute("data-swiper-slide-index") * 1 : Ne.swiperSlideIndex;
    Be[Ve] = Ne;
  }), $e.slides.forEach((Ne) => {
    Ne.removeAttribute("data-swiper-slide-index");
  }), Be.forEach((Ne) => {
    ke.append(Ne);
  }), $e.recalcSlides(), $e.slideTo($e.realIndex, 0);
}
var loop = {
  loopCreate,
  loopFix,
  loopDestroy
};
function setGrabCursor($e) {
  const _e = this;
  if (!_e.params.simulateTouch || _e.params.watchOverflow && _e.isLocked || _e.params.cssMode) return;
  const ke = _e.params.touchEventsTarget === "container" ? _e.el : _e.wrapperEl;
  _e.isElement && (_e.__preventObserver__ = !0), ke.style.cursor = "move", ke.style.cursor = $e ? "grabbing" : "grab", _e.isElement && requestAnimationFrame(() => {
    _e.__preventObserver__ = !1;
  });
}
function unsetGrabCursor() {
  const $e = this;
  $e.params.watchOverflow && $e.isLocked || $e.params.cssMode || ($e.isElement && ($e.__preventObserver__ = !0), $e[$e.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "", $e.isElement && requestAnimationFrame(() => {
    $e.__preventObserver__ = !1;
  }));
}
var grabCursor = {
  setGrabCursor,
  unsetGrabCursor
};
function closestElement($e, _e) {
  _e === void 0 && (_e = this);
  function ke(Be) {
    if (!Be || Be === getDocument() || Be === getWindow()) return null;
    Be.assignedSlot && (Be = Be.assignedSlot);
    const Ne = Be.closest($e);
    return !Ne && !Be.getRootNode ? null : Ne || ke(Be.getRootNode().host);
  }
  return ke(_e);
}
function preventEdgeSwipe($e, _e, ke) {
  const Be = getWindow(), {
    params: Ne
  } = $e, Ve = Ne.edgeSwipeDetection, Le = Ne.edgeSwipeThreshold;
  return Ve && (ke <= Le || ke >= Be.innerWidth - Le) ? Ve === "prevent" ? (_e.preventDefault(), !0) : !1 : !0;
}
function onTouchStart($e) {
  const _e = this, ke = getDocument();
  let Be = $e;
  Be.originalEvent && (Be = Be.originalEvent);
  const Ne = _e.touchEventsData;
  if (Be.type === "pointerdown") {
    if (Ne.pointerId !== null && Ne.pointerId !== Be.pointerId)
      return;
    Ne.pointerId = Be.pointerId;
  } else Be.type === "touchstart" && Be.targetTouches.length === 1 && (Ne.touchId = Be.targetTouches[0].identifier);
  if (Be.type === "touchstart") {
    preventEdgeSwipe(_e, Be, Be.targetTouches[0].pageX);
    return;
  }
  const {
    params: Ve,
    touches: Le,
    enabled: De
  } = _e;
  if (!De || !Ve.simulateTouch && Be.pointerType === "mouse" || _e.animating && Ve.preventInteractionOnTransition)
    return;
  !_e.animating && Ve.cssMode && Ve.loop && _e.loopFix();
  let Ae = Be.target;
  if (Ve.touchEventsTarget === "wrapper" && !elementIsChildOf(Ae, _e.wrapperEl) || "which" in Be && Be.which === 3 || "button" in Be && Be.button > 0 || Ne.isTouched && Ne.isMoved) return;
  const Ie = !!Ve.noSwipingClass && Ve.noSwipingClass !== "", Re = Be.composedPath ? Be.composedPath() : Be.path;
  Ie && Be.target && Be.target.shadowRoot && Re && (Ae = Re[0]);
  const ze = Ve.noSwipingSelector ? Ve.noSwipingSelector : `.${Ve.noSwipingClass}`, je = !!(Be.target && Be.target.shadowRoot);
  if (Ve.noSwiping && (je ? closestElement(ze, Ae) : Ae.closest(ze))) {
    _e.allowClick = !0;
    return;
  }
  if (Ve.swipeHandler && !Ae.closest(Ve.swipeHandler))
    return;
  Le.currentX = Be.pageX, Le.currentY = Be.pageY;
  const Fe = Le.currentX, He = Le.currentY;
  if (!preventEdgeSwipe(_e, Be, Fe))
    return;
  Object.assign(Ne, {
    isTouched: !0,
    isMoved: !1,
    allowTouchCallbacks: !0,
    isScrolling: void 0,
    startMoving: void 0
  }), Le.startX = Fe, Le.startY = He, Ne.touchStartTime = now(), _e.allowClick = !0, _e.updateSize(), _e.swipeDirection = void 0, Ve.threshold > 0 && (Ne.allowThresholdMove = !1);
  let Ge = !0;
  Ae.matches(Ne.focusableElements) && (Ge = !1, Ae.nodeName === "SELECT" && (Ne.isTouched = !1)), ke.activeElement && ke.activeElement.matches(Ne.focusableElements) && ke.activeElement !== Ae && (Be.pointerType === "mouse" || Be.pointerType !== "mouse" && !Ae.matches(Ne.focusableElements)) && ke.activeElement.blur();
  const qe = Ge && _e.allowTouchMove && Ve.touchStartPreventDefault;
  (Ve.touchStartForcePreventDefault || qe) && !Ae.isContentEditable && Be.preventDefault(), Ve.freeMode && Ve.freeMode.enabled && _e.freeMode && _e.animating && !Ve.cssMode && _e.freeMode.onTouchStart(), _e.emit("touchStart", Be);
}
function onTouchMove($e) {
  const _e = getDocument(), ke = this, Be = ke.touchEventsData, {
    params: Ne,
    touches: Ve,
    rtlTranslate: Le,
    enabled: De
  } = ke;
  if (!De || !Ne.simulateTouch && $e.pointerType === "mouse") return;
  let Ae = $e;
  if (Ae.originalEvent && (Ae = Ae.originalEvent), Ae.type === "pointermove" && (Be.touchId !== null || Ae.pointerId !== Be.pointerId))
    return;
  let Ie;
  if (Ae.type === "touchmove") {
    if (Ie = [...Ae.changedTouches].find((ri) => ri.identifier === Be.touchId), !Ie || Ie.identifier !== Be.touchId) return;
  } else
    Ie = Ae;
  if (!Be.isTouched) {
    Be.startMoving && Be.isScrolling && ke.emit("touchMoveOpposite", Ae);
    return;
  }
  const Re = Ie.pageX, ze = Ie.pageY;
  if (Ae.preventedByNestedSwiper) {
    Ve.startX = Re, Ve.startY = ze;
    return;
  }
  if (!ke.allowTouchMove) {
    Ae.target.matches(Be.focusableElements) || (ke.allowClick = !1), Be.isTouched && (Object.assign(Ve, {
      startX: Re,
      startY: ze,
      currentX: Re,
      currentY: ze
    }), Be.touchStartTime = now());
    return;
  }
  if (Ne.touchReleaseOnEdges && !Ne.loop)
    if (ke.isVertical()) {
      if (ze < Ve.startY && ke.translate <= ke.maxTranslate() || ze > Ve.startY && ke.translate >= ke.minTranslate()) {
        Be.isTouched = !1, Be.isMoved = !1;
        return;
      }
    } else {
      if (Le && (Re > Ve.startX && -ke.translate <= ke.maxTranslate() || Re < Ve.startX && -ke.translate >= ke.minTranslate()))
        return;
      if (!Le && (Re < Ve.startX && ke.translate <= ke.maxTranslate() || Re > Ve.startX && ke.translate >= ke.minTranslate()))
        return;
    }
  if (_e.activeElement && _e.activeElement.matches(Be.focusableElements) && _e.activeElement !== Ae.target && Ae.pointerType !== "mouse" && _e.activeElement.blur(), _e.activeElement && Ae.target === _e.activeElement && Ae.target.matches(Be.focusableElements)) {
    Be.isMoved = !0, ke.allowClick = !1;
    return;
  }
  Be.allowTouchCallbacks && ke.emit("touchMove", Ae), Ve.previousX = Ve.currentX, Ve.previousY = Ve.currentY, Ve.currentX = Re, Ve.currentY = ze;
  const je = Ve.currentX - Ve.startX, Fe = Ve.currentY - Ve.startY;
  if (ke.params.threshold && Math.sqrt(je ** 2 + Fe ** 2) < ke.params.threshold) return;
  if (typeof Be.isScrolling > "u") {
    let ri;
    ke.isHorizontal() && Ve.currentY === Ve.startY || ke.isVertical() && Ve.currentX === Ve.startX ? Be.isScrolling = !1 : je * je + Fe * Fe >= 25 && (ri = Math.atan2(Math.abs(Fe), Math.abs(je)) * 180 / Math.PI, Be.isScrolling = ke.isHorizontal() ? ri > Ne.touchAngle : 90 - ri > Ne.touchAngle);
  }
  if (Be.isScrolling && ke.emit("touchMoveOpposite", Ae), typeof Be.startMoving > "u" && (Ve.currentX !== Ve.startX || Ve.currentY !== Ve.startY) && (Be.startMoving = !0), Be.isScrolling || Ae.type === "touchmove" && Be.preventTouchMoveFromPointerMove) {
    Be.isTouched = !1;
    return;
  }
  if (!Be.startMoving)
    return;
  ke.allowClick = !1, !Ne.cssMode && Ae.cancelable && Ae.preventDefault(), Ne.touchMoveStopPropagation && !Ne.nested && Ae.stopPropagation();
  let He = ke.isHorizontal() ? je : Fe, Ge = ke.isHorizontal() ? Ve.currentX - Ve.previousX : Ve.currentY - Ve.previousY;
  Ne.oneWayMovement && (He = Math.abs(He) * (Le ? 1 : -1), Ge = Math.abs(Ge) * (Le ? 1 : -1)), Ve.diff = He, He *= Ne.touchRatio, Le && (He = -He, Ge = -Ge);
  const qe = ke.touchesDirection;
  ke.swipeDirection = He > 0 ? "prev" : "next", ke.touchesDirection = Ge > 0 ? "prev" : "next";
  const Xe = ke.params.loop && !Ne.cssMode, Ye = ke.touchesDirection === "next" && ke.allowSlideNext || ke.touchesDirection === "prev" && ke.allowSlidePrev;
  if (!Be.isMoved) {
    if (Xe && Ye && ke.loopFix({
      direction: ke.swipeDirection
    }), Be.startTranslate = ke.getTranslate(), ke.setTransition(0), ke.animating) {
      const ri = new window.CustomEvent("transitionend", {
        bubbles: !0,
        cancelable: !0,
        detail: {
          bySwiperTouchMove: !0
        }
      });
      ke.wrapperEl.dispatchEvent(ri);
    }
    Be.allowMomentumBounce = !1, Ne.grabCursor && (ke.allowSlideNext === !0 || ke.allowSlidePrev === !0) && ke.setGrabCursor(!0), ke.emit("sliderFirstMove", Ae);
  }
  if ((/* @__PURE__ */ new Date()).getTime(), Ne._loopSwapReset !== !1 && Be.isMoved && Be.allowThresholdMove && qe !== ke.touchesDirection && Xe && Ye && Math.abs(He) >= 1) {
    Object.assign(Ve, {
      startX: Re,
      startY: ze,
      currentX: Re,
      currentY: ze,
      startTranslate: Be.currentTranslate
    }), Be.loopSwapReset = !0, Be.startTranslate = Be.currentTranslate;
    return;
  }
  ke.emit("sliderMove", Ae), Be.isMoved = !0, Be.currentTranslate = He + Be.startTranslate;
  let We = !0, Je = Ne.resistanceRatio;
  if (Ne.touchReleaseOnEdges && (Je = 0), He > 0 ? (Xe && Ye && Be.allowThresholdMove && Be.currentTranslate > (Ne.centeredSlides ? ke.minTranslate() - ke.slidesSizesGrid[ke.activeIndex + 1] - (Ne.slidesPerView !== "auto" && ke.slides.length - Ne.slidesPerView >= 2 ? ke.slidesSizesGrid[ke.activeIndex + 1] + ke.params.spaceBetween : 0) - ke.params.spaceBetween : ke.minTranslate()) && ke.loopFix({
    direction: "prev",
    setTranslate: !0,
    activeSlideIndex: 0
  }), Be.currentTranslate > ke.minTranslate() && (We = !1, Ne.resistance && (Be.currentTranslate = ke.minTranslate() - 1 + (-ke.minTranslate() + Be.startTranslate + He) ** Je))) : He < 0 && (Xe && Ye && Be.allowThresholdMove && Be.currentTranslate < (Ne.centeredSlides ? ke.maxTranslate() + ke.slidesSizesGrid[ke.slidesSizesGrid.length - 1] + ke.params.spaceBetween + (Ne.slidesPerView !== "auto" && ke.slides.length - Ne.slidesPerView >= 2 ? ke.slidesSizesGrid[ke.slidesSizesGrid.length - 1] + ke.params.spaceBetween : 0) : ke.maxTranslate()) && ke.loopFix({
    direction: "next",
    setTranslate: !0,
    activeSlideIndex: ke.slides.length - (Ne.slidesPerView === "auto" ? ke.slidesPerViewDynamic() : Math.ceil(parseFloat(Ne.slidesPerView, 10)))
  }), Be.currentTranslate < ke.maxTranslate() && (We = !1, Ne.resistance && (Be.currentTranslate = ke.maxTranslate() + 1 - (ke.maxTranslate() - Be.startTranslate - He) ** Je))), We && (Ae.preventedByNestedSwiper = !0), !ke.allowSlideNext && ke.swipeDirection === "next" && Be.currentTranslate < Be.startTranslate && (Be.currentTranslate = Be.startTranslate), !ke.allowSlidePrev && ke.swipeDirection === "prev" && Be.currentTranslate > Be.startTranslate && (Be.currentTranslate = Be.startTranslate), !ke.allowSlidePrev && !ke.allowSlideNext && (Be.currentTranslate = Be.startTranslate), Ne.threshold > 0)
    if (Math.abs(He) > Ne.threshold || Be.allowThresholdMove) {
      if (!Be.allowThresholdMove) {
        Be.allowThresholdMove = !0, Ve.startX = Ve.currentX, Ve.startY = Ve.currentY, Be.currentTranslate = Be.startTranslate, Ve.diff = ke.isHorizontal() ? Ve.currentX - Ve.startX : Ve.currentY - Ve.startY;
        return;
      }
    } else {
      Be.currentTranslate = Be.startTranslate;
      return;
    }
  !Ne.followFinger || Ne.cssMode || ((Ne.freeMode && Ne.freeMode.enabled && ke.freeMode || Ne.watchSlidesProgress) && (ke.updateActiveIndex(), ke.updateSlidesClasses()), Ne.freeMode && Ne.freeMode.enabled && ke.freeMode && ke.freeMode.onTouchMove(), ke.updateProgress(Be.currentTranslate), ke.setTranslate(Be.currentTranslate));
}
function onTouchEnd($e) {
  const _e = this, ke = _e.touchEventsData;
  let Be = $e;
  Be.originalEvent && (Be = Be.originalEvent);
  let Ne;
  if (Be.type === "touchend" || Be.type === "touchcancel") {
    if (Ne = [...Be.changedTouches].find((ri) => ri.identifier === ke.touchId), !Ne || Ne.identifier !== ke.touchId) return;
  } else {
    if (ke.touchId !== null || Be.pointerId !== ke.pointerId) return;
    Ne = Be;
  }
  if (["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(Be.type) && !(["pointercancel", "contextmenu"].includes(Be.type) && (_e.browser.isSafari || _e.browser.isWebView)))
    return;
  ke.pointerId = null, ke.touchId = null;
  const {
    params: Le,
    touches: De,
    rtlTranslate: Ae,
    slidesGrid: Ie,
    enabled: Re
  } = _e;
  if (!Re || !Le.simulateTouch && Be.pointerType === "mouse") return;
  if (ke.allowTouchCallbacks && _e.emit("touchEnd", Be), ke.allowTouchCallbacks = !1, !ke.isTouched) {
    ke.isMoved && Le.grabCursor && _e.setGrabCursor(!1), ke.isMoved = !1, ke.startMoving = !1;
    return;
  }
  Le.grabCursor && ke.isMoved && ke.isTouched && (_e.allowSlideNext === !0 || _e.allowSlidePrev === !0) && _e.setGrabCursor(!1);
  const ze = now(), je = ze - ke.touchStartTime;
  if (_e.allowClick) {
    const ri = Be.path || Be.composedPath && Be.composedPath();
    _e.updateClickedSlide(ri && ri[0] || Be.target, ri), _e.emit("tap click", Be), je < 300 && ze - ke.lastClickTime < 300 && _e.emit("doubleTap doubleClick", Be);
  }
  if (ke.lastClickTime = now(), nextTick(() => {
    _e.destroyed || (_e.allowClick = !0);
  }), !ke.isTouched || !ke.isMoved || !_e.swipeDirection || De.diff === 0 && !ke.loopSwapReset || ke.currentTranslate === ke.startTranslate && !ke.loopSwapReset) {
    ke.isTouched = !1, ke.isMoved = !1, ke.startMoving = !1;
    return;
  }
  ke.isTouched = !1, ke.isMoved = !1, ke.startMoving = !1;
  let Fe;
  if (Le.followFinger ? Fe = Ae ? _e.translate : -_e.translate : Fe = -ke.currentTranslate, Le.cssMode)
    return;
  if (Le.freeMode && Le.freeMode.enabled) {
    _e.freeMode.onTouchEnd({
      currentPos: Fe
    });
    return;
  }
  const He = Fe >= -_e.maxTranslate() && !_e.params.loop;
  let Ge = 0, qe = _e.slidesSizesGrid[0];
  for (let ri = 0; ri < Ie.length; ri += ri < Le.slidesPerGroupSkip ? 1 : Le.slidesPerGroup) {
    const Qe = ri < Le.slidesPerGroupSkip - 1 ? 1 : Le.slidesPerGroup;
    typeof Ie[ri + Qe] < "u" ? (He || Fe >= Ie[ri] && Fe < Ie[ri + Qe]) && (Ge = ri, qe = Ie[ri + Qe] - Ie[ri]) : (He || Fe >= Ie[ri]) && (Ge = ri, qe = Ie[Ie.length - 1] - Ie[Ie.length - 2]);
  }
  let Xe = null, Ye = null;
  Le.rewind && (_e.isBeginning ? Ye = Le.virtual && Le.virtual.enabled && _e.virtual ? _e.virtual.slides.length - 1 : _e.slides.length - 1 : _e.isEnd && (Xe = 0));
  const We = (Fe - Ie[Ge]) / qe, Je = Ge < Le.slidesPerGroupSkip - 1 ? 1 : Le.slidesPerGroup;
  if (je > Le.longSwipesMs) {
    if (!Le.longSwipes) {
      _e.slideTo(_e.activeIndex);
      return;
    }
    _e.swipeDirection === "next" && (We >= Le.longSwipesRatio ? _e.slideTo(Le.rewind && _e.isEnd ? Xe : Ge + Je) : _e.slideTo(Ge)), _e.swipeDirection === "prev" && (We > 1 - Le.longSwipesRatio ? _e.slideTo(Ge + Je) : Ye !== null && We < 0 && Math.abs(We) > Le.longSwipesRatio ? _e.slideTo(Ye) : _e.slideTo(Ge));
  } else {
    if (!Le.shortSwipes) {
      _e.slideTo(_e.activeIndex);
      return;
    }
    _e.navigation && (Be.target === _e.navigation.nextEl || Be.target === _e.navigation.prevEl) ? Be.target === _e.navigation.nextEl ? _e.slideTo(Ge + Je) : _e.slideTo(Ge) : (_e.swipeDirection === "next" && _e.slideTo(Xe !== null ? Xe : Ge + Je), _e.swipeDirection === "prev" && _e.slideTo(Ye !== null ? Ye : Ge));
  }
}
function onResize() {
  const $e = this, {
    params: _e,
    el: ke
  } = $e;
  if (ke && ke.offsetWidth === 0) return;
  _e.breakpoints && $e.setBreakpoint();
  const {
    allowSlideNext: Be,
    allowSlidePrev: Ne,
    snapGrid: Ve
  } = $e, Le = $e.virtual && $e.params.virtual.enabled;
  $e.allowSlideNext = !0, $e.allowSlidePrev = !0, $e.updateSize(), $e.updateSlides(), $e.updateSlidesClasses();
  const De = Le && _e.loop;
  (_e.slidesPerView === "auto" || _e.slidesPerView > 1) && $e.isEnd && !$e.isBeginning && !$e.params.centeredSlides && !De ? $e.slideTo($e.slides.length - 1, 0, !1, !0) : $e.params.loop && !Le ? $e.slideToLoop($e.realIndex, 0, !1, !0) : $e.slideTo($e.activeIndex, 0, !1, !0), $e.autoplay && $e.autoplay.running && $e.autoplay.paused && (clearTimeout($e.autoplay.resizeTimeout), $e.autoplay.resizeTimeout = setTimeout(() => {
    $e.autoplay && $e.autoplay.running && $e.autoplay.paused && $e.autoplay.resume();
  }, 500)), $e.allowSlidePrev = Ne, $e.allowSlideNext = Be, $e.params.watchOverflow && Ve !== $e.snapGrid && $e.checkOverflow();
}
function onClick($e) {
  const _e = this;
  _e.enabled && (_e.allowClick || (_e.params.preventClicks && $e.preventDefault(), _e.params.preventClicksPropagation && _e.animating && ($e.stopPropagation(), $e.stopImmediatePropagation())));
}
function onScroll() {
  const $e = this, {
    wrapperEl: _e,
    rtlTranslate: ke,
    enabled: Be
  } = $e;
  if (!Be) return;
  $e.previousTranslate = $e.translate, $e.isHorizontal() ? $e.translate = -_e.scrollLeft : $e.translate = -_e.scrollTop, $e.translate === 0 && ($e.translate = 0), $e.updateActiveIndex(), $e.updateSlidesClasses();
  let Ne;
  const Ve = $e.maxTranslate() - $e.minTranslate();
  Ve === 0 ? Ne = 0 : Ne = ($e.translate - $e.minTranslate()) / Ve, Ne !== $e.progress && $e.updateProgress(ke ? -$e.translate : $e.translate), $e.emit("setTranslate", $e.translate, !1);
}
function onLoad($e) {
  const _e = this;
  processLazyPreloader(_e, $e.target), !(_e.params.cssMode || _e.params.slidesPerView !== "auto" && !_e.params.autoHeight) && _e.update();
}
function onDocumentTouchStart() {
  const $e = this;
  $e.documentTouchHandlerProceeded || ($e.documentTouchHandlerProceeded = !0, $e.params.touchReleaseOnEdges && ($e.el.style.touchAction = "auto"));
}
const events = ($e, _e) => {
  const ke = getDocument(), {
    params: Be,
    el: Ne,
    wrapperEl: Ve,
    device: Le
  } = $e, De = !!Be.nested, Ae = _e === "on" ? "addEventListener" : "removeEventListener", Ie = _e;
  !Ne || typeof Ne == "string" || (ke[Ae]("touchstart", $e.onDocumentTouchStart, {
    passive: !1,
    capture: De
  }), Ne[Ae]("touchstart", $e.onTouchStart, {
    passive: !1
  }), Ne[Ae]("pointerdown", $e.onTouchStart, {
    passive: !1
  }), ke[Ae]("touchmove", $e.onTouchMove, {
    passive: !1,
    capture: De
  }), ke[Ae]("pointermove", $e.onTouchMove, {
    passive: !1,
    capture: De
  }), ke[Ae]("touchend", $e.onTouchEnd, {
    passive: !0
  }), ke[Ae]("pointerup", $e.onTouchEnd, {
    passive: !0
  }), ke[Ae]("pointercancel", $e.onTouchEnd, {
    passive: !0
  }), ke[Ae]("touchcancel", $e.onTouchEnd, {
    passive: !0
  }), ke[Ae]("pointerout", $e.onTouchEnd, {
    passive: !0
  }), ke[Ae]("pointerleave", $e.onTouchEnd, {
    passive: !0
  }), ke[Ae]("contextmenu", $e.onTouchEnd, {
    passive: !0
  }), (Be.preventClicks || Be.preventClicksPropagation) && Ne[Ae]("click", $e.onClick, !0), Be.cssMode && Ve[Ae]("scroll", $e.onScroll), Be.updateOnWindowResize ? $e[Ie](Le.ios || Le.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, !0) : $e[Ie]("observerUpdate", onResize, !0), Ne[Ae]("load", $e.onLoad, {
    capture: !0
  }));
};
function attachEvents() {
  const $e = this, {
    params: _e
  } = $e;
  $e.onTouchStart = onTouchStart.bind($e), $e.onTouchMove = onTouchMove.bind($e), $e.onTouchEnd = onTouchEnd.bind($e), $e.onDocumentTouchStart = onDocumentTouchStart.bind($e), _e.cssMode && ($e.onScroll = onScroll.bind($e)), $e.onClick = onClick.bind($e), $e.onLoad = onLoad.bind($e), events($e, "on");
}
function detachEvents() {
  events(this, "off");
}
var events$1 = {
  attachEvents,
  detachEvents
};
const isGridEnabled = ($e, _e) => $e.grid && _e.grid && _e.grid.rows > 1;
function setBreakpoint() {
  const $e = this, {
    realIndex: _e,
    initialized: ke,
    params: Be,
    el: Ne
  } = $e, Ve = Be.breakpoints;
  if (!Ve || Ve && Object.keys(Ve).length === 0) return;
  const Le = getDocument(), De = Be.breakpointsBase === "window" || !Be.breakpointsBase ? Be.breakpointsBase : "container", Ae = ["window", "container"].includes(Be.breakpointsBase) || !Be.breakpointsBase ? $e.el : Le.querySelector(Be.breakpointsBase), Ie = $e.getBreakpoint(Ve, De, Ae);
  if (!Ie || $e.currentBreakpoint === Ie) return;
  const ze = (Ie in Ve ? Ve[Ie] : void 0) || $e.originalParams, je = isGridEnabled($e, Be), Fe = isGridEnabled($e, ze), He = $e.params.grabCursor, Ge = ze.grabCursor, qe = Be.enabled;
  je && !Fe ? (Ne.classList.remove(`${Be.containerModifierClass}grid`, `${Be.containerModifierClass}grid-column`), $e.emitContainerClasses()) : !je && Fe && (Ne.classList.add(`${Be.containerModifierClass}grid`), (ze.grid.fill && ze.grid.fill === "column" || !ze.grid.fill && Be.grid.fill === "column") && Ne.classList.add(`${Be.containerModifierClass}grid-column`), $e.emitContainerClasses()), He && !Ge ? $e.unsetGrabCursor() : !He && Ge && $e.setGrabCursor(), ["navigation", "pagination", "scrollbar"].forEach((Qe) => {
    if (typeof ze[Qe] > "u") return;
    const ti = Be[Qe] && Be[Qe].enabled, ei = ze[Qe] && ze[Qe].enabled;
    ti && !ei && $e[Qe].disable(), !ti && ei && $e[Qe].enable();
  });
  const Xe = ze.direction && ze.direction !== Be.direction, Ye = Be.loop && (ze.slidesPerView !== Be.slidesPerView || Xe), We = Be.loop;
  Xe && ke && $e.changeDirection(), extend$1($e.params, ze);
  const Je = $e.params.enabled, ri = $e.params.loop;
  Object.assign($e, {
    allowTouchMove: $e.params.allowTouchMove,
    allowSlideNext: $e.params.allowSlideNext,
    allowSlidePrev: $e.params.allowSlidePrev
  }), qe && !Je ? $e.disable() : !qe && Je && $e.enable(), $e.currentBreakpoint = Ie, $e.emit("_beforeBreakpoint", ze), ke && (Ye ? ($e.loopDestroy(), $e.loopCreate(_e), $e.updateSlides()) : !We && ri ? ($e.loopCreate(_e), $e.updateSlides()) : We && !ri && $e.loopDestroy()), $e.emit("breakpoint", ze);
}
function getBreakpoint($e, _e, ke) {
  if (_e === void 0 && (_e = "window"), !$e || _e === "container" && !ke) return;
  let Be = !1;
  const Ne = getWindow(), Ve = _e === "window" ? Ne.innerHeight : ke.clientHeight, Le = Object.keys($e).map((De) => {
    if (typeof De == "string" && De.indexOf("@") === 0) {
      const Ae = parseFloat(De.substr(1));
      return {
        value: Ve * Ae,
        point: De
      };
    }
    return {
      value: De,
      point: De
    };
  });
  Le.sort((De, Ae) => parseInt(De.value, 10) - parseInt(Ae.value, 10));
  for (let De = 0; De < Le.length; De += 1) {
    const {
      point: Ae,
      value: Ie
    } = Le[De];
    _e === "window" ? Ne.matchMedia(`(min-width: ${Ie}px)`).matches && (Be = Ae) : Ie <= ke.clientWidth && (Be = Ae);
  }
  return Be || "max";
}
var breakpoints = {
  setBreakpoint,
  getBreakpoint
};
function prepareClasses($e, _e) {
  const ke = [];
  return $e.forEach((Be) => {
    typeof Be == "object" ? Object.keys(Be).forEach((Ne) => {
      Be[Ne] && ke.push(_e + Ne);
    }) : typeof Be == "string" && ke.push(_e + Be);
  }), ke;
}
function addClasses() {
  const $e = this, {
    classNames: _e,
    params: ke,
    rtl: Be,
    el: Ne,
    device: Ve
  } = $e, Le = prepareClasses(["initialized", ke.direction, {
    "free-mode": $e.params.freeMode && ke.freeMode.enabled
  }, {
    autoheight: ke.autoHeight
  }, {
    rtl: Be
  }, {
    grid: ke.grid && ke.grid.rows > 1
  }, {
    "grid-column": ke.grid && ke.grid.rows > 1 && ke.grid.fill === "column"
  }, {
    android: Ve.android
  }, {
    ios: Ve.ios
  }, {
    "css-mode": ke.cssMode
  }, {
    centered: ke.cssMode && ke.centeredSlides
  }, {
    "watch-progress": ke.watchSlidesProgress
  }], ke.containerModifierClass);
  _e.push(...Le), Ne.classList.add(..._e), $e.emitContainerClasses();
}
function removeClasses() {
  const $e = this, {
    el: _e,
    classNames: ke
  } = $e;
  !_e || typeof _e == "string" || (_e.classList.remove(...ke), $e.emitContainerClasses());
}
var classes = {
  addClasses,
  removeClasses
};
function checkOverflow() {
  const $e = this, {
    isLocked: _e,
    params: ke
  } = $e, {
    slidesOffsetBefore: Be
  } = ke;
  if (Be) {
    const Ne = $e.slides.length - 1, Ve = $e.slidesGrid[Ne] + $e.slidesSizesGrid[Ne] + Be * 2;
    $e.isLocked = $e.size > Ve;
  } else
    $e.isLocked = $e.snapGrid.length === 1;
  ke.allowSlideNext === !0 && ($e.allowSlideNext = !$e.isLocked), ke.allowSlidePrev === !0 && ($e.allowSlidePrev = !$e.isLocked), _e && _e !== $e.isLocked && ($e.isEnd = !1), _e !== $e.isLocked && $e.emit($e.isLocked ? "lock" : "unlock");
}
var checkOverflow$1 = {
  checkOverflow
}, defaults = {
  init: !0,
  direction: "horizontal",
  oneWayMovement: !1,
  swiperElementNodeName: "SWIPER-CONTAINER",
  touchEventsTarget: "wrapper",
  initialSlide: 0,
  speed: 300,
  cssMode: !1,
  updateOnWindowResize: !0,
  resizeObserver: !0,
  nested: !1,
  createElements: !1,
  eventsPrefix: "swiper",
  enabled: !0,
  focusableElements: "input, select, option, textarea, button, video, label",
  // Overrides
  width: null,
  height: null,
  //
  preventInteractionOnTransition: !1,
  // ssr
  userAgent: null,
  url: null,
  // To support iOS's swipe-to-go-back gesture (when being used in-app).
  edgeSwipeDetection: !1,
  edgeSwipeThreshold: 20,
  // Autoheight
  autoHeight: !1,
  // Set wrapper width
  setWrapperSize: !1,
  // Virtual Translate
  virtualTranslate: !1,
  // Effects
  effect: "slide",
  // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
  // Breakpoints
  breakpoints: void 0,
  breakpointsBase: "window",
  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: !1,
  centeredSlides: !1,
  centeredSlidesBounds: !1,
  slidesOffsetBefore: 0,
  // in px
  slidesOffsetAfter: 0,
  // in px
  normalizeSlideIndex: !0,
  centerInsufficientSlides: !1,
  // Disable swiper and hide navigation when container not overflow
  watchOverflow: !0,
  // Round length
  roundLengths: !1,
  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: !0,
  shortSwipes: !0,
  longSwipes: !0,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: !0,
  allowTouchMove: !0,
  threshold: 5,
  touchMoveStopPropagation: !1,
  touchStartPreventDefault: !0,
  touchStartForcePreventDefault: !1,
  touchReleaseOnEdges: !1,
  // Unique Navigation Elements
  uniqueNavElements: !0,
  // Resistance
  resistance: !0,
  resistanceRatio: 0.85,
  // Progress
  watchSlidesProgress: !1,
  // Cursor
  grabCursor: !1,
  // Clicks
  preventClicks: !0,
  preventClicksPropagation: !0,
  slideToClickedSlide: !1,
  // loop
  loop: !1,
  loopAddBlankSlides: !0,
  loopAdditionalSlides: 0,
  loopPreventsSliding: !0,
  // rewind
  rewind: !1,
  // Swiping/no swiping
  allowSlidePrev: !0,
  allowSlideNext: !0,
  swipeHandler: null,
  // '.swipe-handler',
  noSwiping: !0,
  noSwipingClass: "swiper-no-swiping",
  noSwipingSelector: null,
  // Passive Listeners
  passiveListeners: !0,
  maxBackfaceHiddenSlides: 10,
  // NS
  containerModifierClass: "swiper-",
  // NEW
  slideClass: "swiper-slide",
  slideBlankClass: "swiper-slide-blank",
  slideActiveClass: "swiper-slide-active",
  slideVisibleClass: "swiper-slide-visible",
  slideFullyVisibleClass: "swiper-slide-fully-visible",
  slideNextClass: "swiper-slide-next",
  slidePrevClass: "swiper-slide-prev",
  wrapperClass: "swiper-wrapper",
  lazyPreloaderClass: "swiper-lazy-preloader",
  lazyPreloadPrevNext: 0,
  // Callbacks
  runCallbacksOnInit: !0,
  // Internals
  _emitClasses: !1
};
function moduleExtendParams($e, _e) {
  return function(Be) {
    Be === void 0 && (Be = {});
    const Ne = Object.keys(Be)[0], Ve = Be[Ne];
    if (typeof Ve != "object" || Ve === null) {
      extend$1(_e, Be);
      return;
    }
    if ($e[Ne] === !0 && ($e[Ne] = {
      enabled: !0
    }), Ne === "navigation" && $e[Ne] && $e[Ne].enabled && !$e[Ne].prevEl && !$e[Ne].nextEl && ($e[Ne].auto = !0), ["pagination", "scrollbar"].indexOf(Ne) >= 0 && $e[Ne] && $e[Ne].enabled && !$e[Ne].el && ($e[Ne].auto = !0), !(Ne in $e && "enabled" in Ve)) {
      extend$1(_e, Be);
      return;
    }
    typeof $e[Ne] == "object" && !("enabled" in $e[Ne]) && ($e[Ne].enabled = !0), $e[Ne] || ($e[Ne] = {
      enabled: !1
    }), extend$1(_e, Be);
  };
}
const prototypes = {
  eventsEmitter,
  update,
  translate,
  transition,
  slide,
  loop,
  grabCursor,
  events: events$1,
  breakpoints,
  checkOverflow: checkOverflow$1,
  classes
}, extendedDefaults = {};
let Swiper$1 = class Zi {
  constructor() {
    let _e, ke;
    for (var Be = arguments.length, Ne = new Array(Be), Ve = 0; Ve < Be; Ve++)
      Ne[Ve] = arguments[Ve];
    Ne.length === 1 && Ne[0].constructor && Object.prototype.toString.call(Ne[0]).slice(8, -1) === "Object" ? ke = Ne[0] : [_e, ke] = Ne, ke || (ke = {}), ke = extend$1({}, ke), _e && !ke.el && (ke.el = _e);
    const Le = getDocument();
    if (ke.el && typeof ke.el == "string" && Le.querySelectorAll(ke.el).length > 1) {
      const Re = [];
      return Le.querySelectorAll(ke.el).forEach((ze) => {
        const je = extend$1({}, ke, {
          el: ze
        });
        Re.push(new Zi(je));
      }), Re;
    }
    const De = this;
    De.__swiper__ = !0, De.support = getSupport(), De.device = getDevice({
      userAgent: ke.userAgent
    }), De.browser = getBrowser(), De.eventsListeners = {}, De.eventsAnyListeners = [], De.modules = [...De.__modules__], ke.modules && Array.isArray(ke.modules) && De.modules.push(...ke.modules);
    const Ae = {};
    De.modules.forEach((Re) => {
      Re({
        params: ke,
        swiper: De,
        extendParams: moduleExtendParams(ke, Ae),
        on: De.on.bind(De),
        once: De.once.bind(De),
        off: De.off.bind(De),
        emit: De.emit.bind(De)
      });
    });
    const Ie = extend$1({}, defaults, Ae);
    return De.params = extend$1({}, Ie, extendedDefaults, ke), De.originalParams = extend$1({}, De.params), De.passedParams = extend$1({}, ke), De.params && De.params.on && Object.keys(De.params.on).forEach((Re) => {
      De.on(Re, De.params.on[Re]);
    }), De.params && De.params.onAny && De.onAny(De.params.onAny), Object.assign(De, {
      enabled: De.params.enabled,
      el: _e,
      // Classes
      classNames: [],
      // Slides
      slides: [],
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],
      // isDirection
      isHorizontal() {
        return De.params.direction === "horizontal";
      },
      isVertical() {
        return De.params.direction === "vertical";
      },
      // Indexes
      activeIndex: 0,
      realIndex: 0,
      //
      isBeginning: !0,
      isEnd: !1,
      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: !1,
      cssOverflowAdjustment() {
        return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
      },
      // Locks
      allowSlideNext: De.params.allowSlideNext,
      allowSlidePrev: De.params.allowSlidePrev,
      // Touch Events
      touchEventsData: {
        isTouched: void 0,
        isMoved: void 0,
        allowTouchCallbacks: void 0,
        touchStartTime: void 0,
        isScrolling: void 0,
        currentTranslate: void 0,
        startTranslate: void 0,
        allowThresholdMove: void 0,
        // Form elements to match
        focusableElements: De.params.focusableElements,
        // Last click time
        lastClickTime: 0,
        clickTimeout: void 0,
        // Velocities
        velocities: [],
        allowMomentumBounce: void 0,
        startMoving: void 0,
        pointerId: null,
        touchId: null
      },
      // Clicks
      allowClick: !0,
      // Touches
      allowTouchMove: De.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },
      // Images
      imagesToLoad: [],
      imagesLoaded: 0
    }), De.emit("_swiper"), De.params.init && De.init(), De;
  }
  getDirectionLabel(_e) {
    return this.isHorizontal() ? _e : {
      width: "height",
      "margin-top": "margin-left",
      "margin-bottom ": "margin-right",
      "margin-left": "margin-top",
      "margin-right": "margin-bottom",
      "padding-left": "padding-top",
      "padding-right": "padding-bottom",
      marginRight: "marginBottom"
    }[_e];
  }
  getSlideIndex(_e) {
    const {
      slidesEl: ke,
      params: Be
    } = this, Ne = elementChildren(ke, `.${Be.slideClass}, swiper-slide`), Ve = elementIndex(Ne[0]);
    return elementIndex(_e) - Ve;
  }
  getSlideIndexByData(_e) {
    return this.getSlideIndex(this.slides.find((ke) => ke.getAttribute("data-swiper-slide-index") * 1 === _e));
  }
  getSlideIndexWhenGrid(_e) {
    return this.grid && this.params.grid && this.params.grid.rows > 1 && (this.params.grid.fill === "column" ? _e = Math.floor(_e / this.params.grid.rows) : this.params.grid.fill === "row" && (_e = _e % Math.ceil(this.slides.length / this.params.grid.rows))), _e;
  }
  recalcSlides() {
    const _e = this, {
      slidesEl: ke,
      params: Be
    } = _e;
    _e.slides = elementChildren(ke, `.${Be.slideClass}, swiper-slide`);
  }
  enable() {
    const _e = this;
    _e.enabled || (_e.enabled = !0, _e.params.grabCursor && _e.setGrabCursor(), _e.emit("enable"));
  }
  disable() {
    const _e = this;
    _e.enabled && (_e.enabled = !1, _e.params.grabCursor && _e.unsetGrabCursor(), _e.emit("disable"));
  }
  setProgress(_e, ke) {
    const Be = this;
    _e = Math.min(Math.max(_e, 0), 1);
    const Ne = Be.minTranslate(), Le = (Be.maxTranslate() - Ne) * _e + Ne;
    Be.translateTo(Le, typeof ke > "u" ? 0 : ke), Be.updateActiveIndex(), Be.updateSlidesClasses();
  }
  emitContainerClasses() {
    const _e = this;
    if (!_e.params._emitClasses || !_e.el) return;
    const ke = _e.el.className.split(" ").filter((Be) => Be.indexOf("swiper") === 0 || Be.indexOf(_e.params.containerModifierClass) === 0);
    _e.emit("_containerClasses", ke.join(" "));
  }
  getSlideClasses(_e) {
    const ke = this;
    return ke.destroyed ? "" : _e.className.split(" ").filter((Be) => Be.indexOf("swiper-slide") === 0 || Be.indexOf(ke.params.slideClass) === 0).join(" ");
  }
  emitSlidesClasses() {
    const _e = this;
    if (!_e.params._emitClasses || !_e.el) return;
    const ke = [];
    _e.slides.forEach((Be) => {
      const Ne = _e.getSlideClasses(Be);
      ke.push({
        slideEl: Be,
        classNames: Ne
      }), _e.emit("_slideClass", Be, Ne);
    }), _e.emit("_slideClasses", ke);
  }
  slidesPerViewDynamic(_e, ke) {
    _e === void 0 && (_e = "current"), ke === void 0 && (ke = !1);
    const Be = this, {
      params: Ne,
      slides: Ve,
      slidesGrid: Le,
      slidesSizesGrid: De,
      size: Ae,
      activeIndex: Ie
    } = Be;
    let Re = 1;
    if (typeof Ne.slidesPerView == "number") return Ne.slidesPerView;
    if (Ne.centeredSlides) {
      let ze = Ve[Ie] ? Math.ceil(Ve[Ie].swiperSlideSize) : 0, je;
      for (let Fe = Ie + 1; Fe < Ve.length; Fe += 1)
        Ve[Fe] && !je && (ze += Math.ceil(Ve[Fe].swiperSlideSize), Re += 1, ze > Ae && (je = !0));
      for (let Fe = Ie - 1; Fe >= 0; Fe -= 1)
        Ve[Fe] && !je && (ze += Ve[Fe].swiperSlideSize, Re += 1, ze > Ae && (je = !0));
    } else if (_e === "current")
      for (let ze = Ie + 1; ze < Ve.length; ze += 1)
        (ke ? Le[ze] + De[ze] - Le[Ie] < Ae : Le[ze] - Le[Ie] < Ae) && (Re += 1);
    else
      for (let ze = Ie - 1; ze >= 0; ze -= 1)
        Le[Ie] - Le[ze] < Ae && (Re += 1);
    return Re;
  }
  update() {
    const _e = this;
    if (!_e || _e.destroyed) return;
    const {
      snapGrid: ke,
      params: Be
    } = _e;
    Be.breakpoints && _e.setBreakpoint(), [..._e.el.querySelectorAll('[loading="lazy"]')].forEach((Le) => {
      Le.complete && processLazyPreloader(_e, Le);
    }), _e.updateSize(), _e.updateSlides(), _e.updateProgress(), _e.updateSlidesClasses();
    function Ne() {
      const Le = _e.rtlTranslate ? _e.translate * -1 : _e.translate, De = Math.min(Math.max(Le, _e.maxTranslate()), _e.minTranslate());
      _e.setTranslate(De), _e.updateActiveIndex(), _e.updateSlidesClasses();
    }
    let Ve;
    if (Be.freeMode && Be.freeMode.enabled && !Be.cssMode)
      Ne(), Be.autoHeight && _e.updateAutoHeight();
    else {
      if ((Be.slidesPerView === "auto" || Be.slidesPerView > 1) && _e.isEnd && !Be.centeredSlides) {
        const Le = _e.virtual && Be.virtual.enabled ? _e.virtual.slides : _e.slides;
        Ve = _e.slideTo(Le.length - 1, 0, !1, !0);
      } else
        Ve = _e.slideTo(_e.activeIndex, 0, !1, !0);
      Ve || Ne();
    }
    Be.watchOverflow && ke !== _e.snapGrid && _e.checkOverflow(), _e.emit("update");
  }
  changeDirection(_e, ke) {
    ke === void 0 && (ke = !0);
    const Be = this, Ne = Be.params.direction;
    return _e || (_e = Ne === "horizontal" ? "vertical" : "horizontal"), _e === Ne || _e !== "horizontal" && _e !== "vertical" || (Be.el.classList.remove(`${Be.params.containerModifierClass}${Ne}`), Be.el.classList.add(`${Be.params.containerModifierClass}${_e}`), Be.emitContainerClasses(), Be.params.direction = _e, Be.slides.forEach((Ve) => {
      _e === "vertical" ? Ve.style.width = "" : Ve.style.height = "";
    }), Be.emit("changeDirection"), ke && Be.update()), Be;
  }
  changeLanguageDirection(_e) {
    const ke = this;
    ke.rtl && _e === "rtl" || !ke.rtl && _e === "ltr" || (ke.rtl = _e === "rtl", ke.rtlTranslate = ke.params.direction === "horizontal" && ke.rtl, ke.rtl ? (ke.el.classList.add(`${ke.params.containerModifierClass}rtl`), ke.el.dir = "rtl") : (ke.el.classList.remove(`${ke.params.containerModifierClass}rtl`), ke.el.dir = "ltr"), ke.update());
  }
  mount(_e) {
    const ke = this;
    if (ke.mounted) return !0;
    let Be = _e || ke.params.el;
    if (typeof Be == "string" && (Be = document.querySelector(Be)), !Be)
      return !1;
    Be.swiper = ke, Be.parentNode && Be.parentNode.host && Be.parentNode.host.nodeName === ke.params.swiperElementNodeName.toUpperCase() && (ke.isElement = !0);
    const Ne = () => `.${(ke.params.wrapperClass || "").trim().split(" ").join(".")}`;
    let Le = Be && Be.shadowRoot && Be.shadowRoot.querySelector ? Be.shadowRoot.querySelector(Ne()) : elementChildren(Be, Ne())[0];
    return !Le && ke.params.createElements && (Le = createElement("div", ke.params.wrapperClass), Be.append(Le), elementChildren(Be, `.${ke.params.slideClass}`).forEach((De) => {
      Le.append(De);
    })), Object.assign(ke, {
      el: Be,
      wrapperEl: Le,
      slidesEl: ke.isElement && !Be.parentNode.host.slideSlots ? Be.parentNode.host : Le,
      hostEl: ke.isElement ? Be.parentNode.host : Be,
      mounted: !0,
      // RTL
      rtl: Be.dir.toLowerCase() === "rtl" || elementStyle(Be, "direction") === "rtl",
      rtlTranslate: ke.params.direction === "horizontal" && (Be.dir.toLowerCase() === "rtl" || elementStyle(Be, "direction") === "rtl"),
      wrongRTL: elementStyle(Le, "display") === "-webkit-box"
    }), !0;
  }
  init(_e) {
    const ke = this;
    if (ke.initialized || ke.mount(_e) === !1) return ke;
    ke.emit("beforeInit"), ke.params.breakpoints && ke.setBreakpoint(), ke.addClasses(), ke.updateSize(), ke.updateSlides(), ke.params.watchOverflow && ke.checkOverflow(), ke.params.grabCursor && ke.enabled && ke.setGrabCursor(), ke.params.loop && ke.virtual && ke.params.virtual.enabled ? ke.slideTo(ke.params.initialSlide + ke.virtual.slidesBefore, 0, ke.params.runCallbacksOnInit, !1, !0) : ke.slideTo(ke.params.initialSlide, 0, ke.params.runCallbacksOnInit, !1, !0), ke.params.loop && ke.loopCreate(void 0, !0), ke.attachEvents();
    const Ne = [...ke.el.querySelectorAll('[loading="lazy"]')];
    return ke.isElement && Ne.push(...ke.hostEl.querySelectorAll('[loading="lazy"]')), Ne.forEach((Ve) => {
      Ve.complete ? processLazyPreloader(ke, Ve) : Ve.addEventListener("load", (Le) => {
        processLazyPreloader(ke, Le.target);
      });
    }), preload(ke), ke.initialized = !0, preload(ke), ke.emit("init"), ke.emit("afterInit"), ke;
  }
  destroy(_e, ke) {
    _e === void 0 && (_e = !0), ke === void 0 && (ke = !0);
    const Be = this, {
      params: Ne,
      el: Ve,
      wrapperEl: Le,
      slides: De
    } = Be;
    return typeof Be.params > "u" || Be.destroyed || (Be.emit("beforeDestroy"), Be.initialized = !1, Be.detachEvents(), Ne.loop && Be.loopDestroy(), ke && (Be.removeClasses(), Ve && typeof Ve != "string" && Ve.removeAttribute("style"), Le && Le.removeAttribute("style"), De && De.length && De.forEach((Ae) => {
      Ae.classList.remove(Ne.slideVisibleClass, Ne.slideFullyVisibleClass, Ne.slideActiveClass, Ne.slideNextClass, Ne.slidePrevClass), Ae.removeAttribute("style"), Ae.removeAttribute("data-swiper-slide-index");
    })), Be.emit("destroy"), Object.keys(Be.eventsListeners).forEach((Ae) => {
      Be.off(Ae);
    }), _e !== !1 && (Be.el && typeof Be.el != "string" && (Be.el.swiper = null), deleteProps(Be)), Be.destroyed = !0), null;
  }
  static extendDefaults(_e) {
    extend$1(extendedDefaults, _e);
  }
  static get extendedDefaults() {
    return extendedDefaults;
  }
  static get defaults() {
    return defaults;
  }
  static installModule(_e) {
    Zi.prototype.__modules__ || (Zi.prototype.__modules__ = []);
    const ke = Zi.prototype.__modules__;
    typeof _e == "function" && ke.indexOf(_e) < 0 && ke.push(_e);
  }
  static use(_e) {
    return Array.isArray(_e) ? (_e.forEach((ke) => Zi.installModule(ke)), Zi) : (Zi.installModule(_e), Zi);
  }
};
Object.keys(prototypes).forEach(($e) => {
  Object.keys(prototypes[$e]).forEach((_e) => {
    Swiper$1.prototype[_e] = prototypes[$e][_e];
  });
});
Swiper$1.use([Resize, Observer]);
const paramsList = [
  "eventsPrefix",
  "injectStyles",
  "injectStylesUrls",
  "modules",
  "init",
  "_direction",
  "oneWayMovement",
  "swiperElementNodeName",
  "touchEventsTarget",
  "initialSlide",
  "_speed",
  "cssMode",
  "updateOnWindowResize",
  "resizeObserver",
  "nested",
  "focusableElements",
  "_enabled",
  "_width",
  "_height",
  "preventInteractionOnTransition",
  "userAgent",
  "url",
  "_edgeSwipeDetection",
  "_edgeSwipeThreshold",
  "_freeMode",
  "_autoHeight",
  "setWrapperSize",
  "virtualTranslate",
  "_effect",
  "breakpoints",
  "breakpointsBase",
  "_spaceBetween",
  "_slidesPerView",
  "maxBackfaceHiddenSlides",
  "_grid",
  "_slidesPerGroup",
  "_slidesPerGroupSkip",
  "_slidesPerGroupAuto",
  "_centeredSlides",
  "_centeredSlidesBounds",
  "_slidesOffsetBefore",
  "_slidesOffsetAfter",
  "normalizeSlideIndex",
  "_centerInsufficientSlides",
  "_watchOverflow",
  "roundLengths",
  "touchRatio",
  "touchAngle",
  "simulateTouch",
  "_shortSwipes",
  "_longSwipes",
  "longSwipesRatio",
  "longSwipesMs",
  "_followFinger",
  "allowTouchMove",
  "_threshold",
  "touchMoveStopPropagation",
  "touchStartPreventDefault",
  "touchStartForcePreventDefault",
  "touchReleaseOnEdges",
  "uniqueNavElements",
  "_resistance",
  "_resistanceRatio",
  "_watchSlidesProgress",
  "_grabCursor",
  "preventClicks",
  "preventClicksPropagation",
  "_slideToClickedSlide",
  "_loop",
  "loopAdditionalSlides",
  "loopAddBlankSlides",
  "loopPreventsSliding",
  "_rewind",
  "_allowSlidePrev",
  "_allowSlideNext",
  "_swipeHandler",
  "_noSwiping",
  "noSwipingClass",
  "noSwipingSelector",
  "passiveListeners",
  "containerModifierClass",
  "slideClass",
  "slideActiveClass",
  "slideVisibleClass",
  "slideFullyVisibleClass",
  "slideNextClass",
  "slidePrevClass",
  "slideBlankClass",
  "wrapperClass",
  "lazyPreloaderClass",
  "lazyPreloadPrevNext",
  "runCallbacksOnInit",
  "observer",
  "observeParents",
  "observeSlideChildren",
  // modules
  "a11y",
  "_autoplay",
  "_controller",
  "coverflowEffect",
  "cubeEffect",
  "fadeEffect",
  "flipEffect",
  "creativeEffect",
  "cardsEffect",
  "hashNavigation",
  "history",
  "keyboard",
  "mousewheel",
  "_navigation",
  "_pagination",
  "parallax",
  "_scrollbar",
  "_thumbs",
  "virtual",
  "zoom",
  "control"
];
function isObject($e) {
  return typeof $e == "object" && $e !== null && $e.constructor && Object.prototype.toString.call($e).slice(8, -1) === "Object" && !$e.__swiper__;
}
function extend($e, _e) {
  const ke = ["__proto__", "constructor", "prototype"];
  Object.keys(_e).filter((Be) => ke.indexOf(Be) < 0).forEach((Be) => {
    typeof $e[Be] > "u" ? $e[Be] = _e[Be] : isObject(_e[Be]) && isObject($e[Be]) && Object.keys(_e[Be]).length > 0 ? _e[Be].__swiper__ ? $e[Be] = _e[Be] : extend($e[Be], _e[Be]) : $e[Be] = _e[Be];
  });
}
function needsNavigation($e) {
  return $e === void 0 && ($e = {}), $e.navigation && typeof $e.navigation.nextEl > "u" && typeof $e.navigation.prevEl > "u";
}
function needsPagination($e) {
  return $e === void 0 && ($e = {}), $e.pagination && typeof $e.pagination.el > "u";
}
function needsScrollbar($e) {
  return $e === void 0 && ($e = {}), $e.scrollbar && typeof $e.scrollbar.el > "u";
}
function uniqueClasses($e) {
  $e === void 0 && ($e = "");
  const _e = $e.split(" ").map((Be) => Be.trim()).filter((Be) => !!Be), ke = [];
  return _e.forEach((Be) => {
    ke.indexOf(Be) < 0 && ke.push(Be);
  }), ke.join(" ");
}
function wrapperClass($e) {
  return $e === void 0 && ($e = ""), $e ? $e.includes("swiper-wrapper") ? $e : `swiper-wrapper ${$e}` : "swiper-wrapper";
}
function updateSwiper($e) {
  let {
    swiper: _e,
    slides: ke,
    passedParams: Be,
    changedParams: Ne,
    nextEl: Ve,
    prevEl: Le,
    scrollbarEl: De,
    paginationEl: Ae
  } = $e;
  const Ie = Ne.filter((Ze) => Ze !== "children" && Ze !== "direction" && Ze !== "wrapperClass"), {
    params: Re,
    pagination: ze,
    navigation: je,
    scrollbar: Fe,
    virtual: He,
    thumbs: Ge
  } = _e;
  let qe, Xe, Ye, We, Je, ri, Qe, ti;
  Ne.includes("thumbs") && Be.thumbs && Be.thumbs.swiper && !Be.thumbs.swiper.destroyed && Re.thumbs && (!Re.thumbs.swiper || Re.thumbs.swiper.destroyed) && (qe = !0), Ne.includes("controller") && Be.controller && Be.controller.control && Re.controller && !Re.controller.control && (Xe = !0), Ne.includes("pagination") && Be.pagination && (Be.pagination.el || Ae) && (Re.pagination || Re.pagination === !1) && ze && !ze.el && (Ye = !0), Ne.includes("scrollbar") && Be.scrollbar && (Be.scrollbar.el || De) && (Re.scrollbar || Re.scrollbar === !1) && Fe && !Fe.el && (We = !0), Ne.includes("navigation") && Be.navigation && (Be.navigation.prevEl || Le) && (Be.navigation.nextEl || Ve) && (Re.navigation || Re.navigation === !1) && je && !je.prevEl && !je.nextEl && (Je = !0);
  const ei = (Ze) => {
    _e[Ze] && (_e[Ze].destroy(), Ze === "navigation" ? (_e.isElement && (_e[Ze].prevEl.remove(), _e[Ze].nextEl.remove()), Re[Ze].prevEl = void 0, Re[Ze].nextEl = void 0, _e[Ze].prevEl = void 0, _e[Ze].nextEl = void 0) : (_e.isElement && _e[Ze].el.remove(), Re[Ze].el = void 0, _e[Ze].el = void 0));
  };
  Ne.includes("loop") && _e.isElement && (Re.loop && !Be.loop ? ri = !0 : !Re.loop && Be.loop ? Qe = !0 : ti = !0), Ie.forEach((Ze) => {
    if (isObject(Re[Ze]) && isObject(Be[Ze]))
      Object.assign(Re[Ze], Be[Ze]), (Ze === "navigation" || Ze === "pagination" || Ze === "scrollbar") && "enabled" in Be[Ze] && !Be[Ze].enabled && ei(Ze);
    else {
      const Ue = Be[Ze];
      (Ue === !0 || Ue === !1) && (Ze === "navigation" || Ze === "pagination" || Ze === "scrollbar") ? Ue === !1 && ei(Ze) : Re[Ze] = Be[Ze];
    }
  }), Ie.includes("controller") && !Xe && _e.controller && _e.controller.control && Re.controller && Re.controller.control && (_e.controller.control = Re.controller.control), Ne.includes("children") && ke && He && Re.virtual.enabled ? (He.slides = ke, He.update(!0)) : Ne.includes("virtual") && He && Re.virtual.enabled && (ke && (He.slides = ke), He.update(!0)), Ne.includes("children") && ke && Re.loop && (ti = !0), qe && Ge.init() && Ge.update(!0), Xe && (_e.controller.control = Re.controller.control), Ye && (_e.isElement && (!Ae || typeof Ae == "string") && (Ae = document.createElement("div"), Ae.classList.add("swiper-pagination"), Ae.part.add("pagination"), _e.el.appendChild(Ae)), Ae && (Re.pagination.el = Ae), ze.init(), ze.render(), ze.update()), We && (_e.isElement && (!De || typeof De == "string") && (De = document.createElement("div"), De.classList.add("swiper-scrollbar"), De.part.add("scrollbar"), _e.el.appendChild(De)), De && (Re.scrollbar.el = De), Fe.init(), Fe.updateSize(), Fe.setTranslate()), Je && (_e.isElement && ((!Ve || typeof Ve == "string") && (Ve = document.createElement("div"), Ve.classList.add("swiper-button-next"), setInnerHTML(Ve, _e.hostEl.constructor.nextButtonSvg), Ve.part.add("button-next"), _e.el.appendChild(Ve)), (!Le || typeof Le == "string") && (Le = document.createElement("div"), Le.classList.add("swiper-button-prev"), setInnerHTML(Le, _e.hostEl.constructor.prevButtonSvg), Le.part.add("button-prev"), _e.el.appendChild(Le))), Ve && (Re.navigation.nextEl = Ve), Le && (Re.navigation.prevEl = Le), je.init(), je.update()), Ne.includes("allowSlideNext") && (_e.allowSlideNext = Be.allowSlideNext), Ne.includes("allowSlidePrev") && (_e.allowSlidePrev = Be.allowSlidePrev), Ne.includes("direction") && _e.changeDirection(Be.direction, !1), (ri || ti) && _e.loopDestroy(), (Qe || ti) && _e.loopCreate(), _e.update();
}
function getParams($e, _e) {
  $e === void 0 && ($e = {});
  const ke = {
    on: {}
  }, Be = {}, Ne = {};
  extend(ke, defaults), ke._emitClasses = !0, ke.init = !1;
  const Ve = {}, Le = paramsList.map((Ae) => Ae.replace(/_/, "")), De = Object.assign({}, $e);
  return Object.keys(De).forEach((Ae) => {
    typeof $e[Ae] > "u" || (Le.indexOf(Ae) >= 0 ? isObject($e[Ae]) ? (ke[Ae] = {}, Ne[Ae] = {}, extend(ke[Ae], $e[Ae]), extend(Ne[Ae], $e[Ae])) : (ke[Ae] = $e[Ae], Ne[Ae] = $e[Ae]) : Ae.search(/on[A-Z]/) === 0 && typeof $e[Ae] == "function" ? ke.on[`${Ae[2].toLowerCase()}${Ae.substr(3)}`] = $e[Ae] : Ve[Ae] = $e[Ae]);
  }), ["navigation", "pagination", "scrollbar"].forEach((Ae) => {
    ke[Ae] === !0 && (ke[Ae] = {}), ke[Ae] === !1 && delete ke[Ae];
  }), {
    params: ke,
    passedParams: Ne,
    rest: Ve,
    events: Be
  };
}
function mountSwiper($e, _e) {
  let {
    el: ke,
    nextEl: Be,
    prevEl: Ne,
    paginationEl: Ve,
    scrollbarEl: Le,
    swiper: De
  } = $e;
  needsNavigation(_e) && Be && Ne && (De.params.navigation.nextEl = Be, De.originalParams.navigation.nextEl = Be, De.params.navigation.prevEl = Ne, De.originalParams.navigation.prevEl = Ne), needsPagination(_e) && Ve && (De.params.pagination.el = Ve, De.originalParams.pagination.el = Ve), needsScrollbar(_e) && Le && (De.params.scrollbar.el = Le, De.originalParams.scrollbar.el = Le), De.init(ke);
}
function getChangedParams($e, _e, ke, Be, Ne) {
  const Ve = [];
  if (!_e) return Ve;
  const Le = (Ae) => {
    Ve.indexOf(Ae) < 0 && Ve.push(Ae);
  };
  if (ke && Be) {
    const Ae = Be.map(Ne), Ie = ke.map(Ne);
    Ae.join("") !== Ie.join("") && Le("children"), Be.length !== ke.length && Le("children");
  }
  return paramsList.filter((Ae) => Ae[0] === "_").map((Ae) => Ae.replace(/_/, "")).forEach((Ae) => {
    if (Ae in $e && Ae in _e)
      if (isObject($e[Ae]) && isObject(_e[Ae])) {
        const Ie = Object.keys($e[Ae]), Re = Object.keys(_e[Ae]);
        Ie.length !== Re.length ? Le(Ae) : (Ie.forEach((ze) => {
          $e[Ae][ze] !== _e[Ae][ze] && Le(Ae);
        }), Re.forEach((ze) => {
          $e[Ae][ze] !== _e[Ae][ze] && Le(Ae);
        }));
      } else $e[Ae] !== _e[Ae] && Le(Ae);
  }), Ve;
}
const updateOnVirtualData = ($e) => {
  !$e || $e.destroyed || !$e.params.virtual || $e.params.virtual && !$e.params.virtual.enabled || ($e.updateSlides(), $e.updateProgress(), $e.updateSlidesClasses(), $e.emit("_virtualUpdated"), $e.parallax && $e.params.parallax && $e.params.parallax.enabled && $e.parallax.setTranslate());
};
function getChildren($e, _e, ke) {
  $e === void 0 && ($e = {});
  const Be = [], Ne = {
    "container-start": [],
    "container-end": [],
    "wrapper-start": [],
    "wrapper-end": []
  }, Ve = (Le, De) => {
    Array.isArray(Le) && Le.forEach((Ae) => {
      const Ie = typeof Ae.type == "symbol";
      De === "default" && (De = "container-end"), Ie && Ae.children ? Ve(Ae.children, De) : Ae.type && (Ae.type.name === "SwiperSlide" || Ae.type.name === "AsyncComponentWrapper") || Ae.componentOptions && Ae.componentOptions.tag === "SwiperSlide" ? Be.push(Ae) : Ne[De] && Ne[De].push(Ae);
    });
  };
  return Object.keys($e).forEach((Le) => {
    if (typeof $e[Le] != "function") return;
    const De = $e[Le]();
    Ve(De, Le);
  }), ke.value = _e.value, _e.value = Be, {
    slides: Be,
    slots: Ne
  };
}
function renderVirtual($e, _e, ke) {
  if (!ke) return null;
  const Be = (Re) => {
    let ze = Re;
    return Re < 0 ? ze = _e.length + Re : ze >= _e.length && (ze = ze - _e.length), ze;
  }, Ne = $e.value.isHorizontal() ? {
    [$e.value.rtlTranslate ? "right" : "left"]: `${ke.offset}px`
  } : {
    top: `${ke.offset}px`
  }, {
    from: Ve,
    to: Le
  } = ke, De = $e.value.params.loop ? -_e.length : 0, Ae = $e.value.params.loop ? _e.length * 2 : _e.length, Ie = [];
  for (let Re = De; Re < Ae; Re += 1)
    Re >= Ve && Re <= Le && Ie.length < _e.length && Ie.push(_e[Be(Re)]);
  return Ie.map((Re) => {
    if (Re.props || (Re.props = {}), Re.props.style || (Re.props.style = {}), Re.props.swiperRef = $e, Re.props.style = Ne, Re.type)
      return h$1(Re.type, {
        ...Re.props
      }, Re.children);
    if (Re.componentOptions)
      return h$1(Re.componentOptions.Ctor, {
        ...Re.props
      }, Re.componentOptions.children);
  });
}
const Swiper = {
  name: "Swiper",
  props: {
    tag: {
      type: String,
      default: "div"
    },
    wrapperTag: {
      type: String,
      default: "div"
    },
    modules: {
      type: Array,
      default: void 0
    },
    init: {
      type: Boolean,
      default: void 0
    },
    direction: {
      type: String,
      default: void 0
    },
    oneWayMovement: {
      type: Boolean,
      default: void 0
    },
    swiperElementNodeName: {
      type: String,
      default: "SWIPER-CONTAINER"
    },
    touchEventsTarget: {
      type: String,
      default: void 0
    },
    initialSlide: {
      type: Number,
      default: void 0
    },
    speed: {
      type: Number,
      default: void 0
    },
    cssMode: {
      type: Boolean,
      default: void 0
    },
    updateOnWindowResize: {
      type: Boolean,
      default: void 0
    },
    resizeObserver: {
      type: Boolean,
      default: void 0
    },
    nested: {
      type: Boolean,
      default: void 0
    },
    focusableElements: {
      type: String,
      default: void 0
    },
    width: {
      type: Number,
      default: void 0
    },
    height: {
      type: Number,
      default: void 0
    },
    preventInteractionOnTransition: {
      type: Boolean,
      default: void 0
    },
    userAgent: {
      type: String,
      default: void 0
    },
    url: {
      type: String,
      default: void 0
    },
    edgeSwipeDetection: {
      type: [Boolean, String],
      default: void 0
    },
    edgeSwipeThreshold: {
      type: Number,
      default: void 0
    },
    autoHeight: {
      type: Boolean,
      default: void 0
    },
    setWrapperSize: {
      type: Boolean,
      default: void 0
    },
    virtualTranslate: {
      type: Boolean,
      default: void 0
    },
    effect: {
      type: String,
      default: void 0
    },
    breakpoints: {
      type: Object,
      default: void 0
    },
    breakpointsBase: {
      type: String,
      default: void 0
    },
    spaceBetween: {
      type: [Number, String],
      default: void 0
    },
    slidesPerView: {
      type: [Number, String],
      default: void 0
    },
    maxBackfaceHiddenSlides: {
      type: Number,
      default: void 0
    },
    slidesPerGroup: {
      type: Number,
      default: void 0
    },
    slidesPerGroupSkip: {
      type: Number,
      default: void 0
    },
    slidesPerGroupAuto: {
      type: Boolean,
      default: void 0
    },
    centeredSlides: {
      type: Boolean,
      default: void 0
    },
    centeredSlidesBounds: {
      type: Boolean,
      default: void 0
    },
    slidesOffsetBefore: {
      type: Number,
      default: void 0
    },
    slidesOffsetAfter: {
      type: Number,
      default: void 0
    },
    normalizeSlideIndex: {
      type: Boolean,
      default: void 0
    },
    centerInsufficientSlides: {
      type: Boolean,
      default: void 0
    },
    watchOverflow: {
      type: Boolean,
      default: void 0
    },
    roundLengths: {
      type: Boolean,
      default: void 0
    },
    touchRatio: {
      type: Number,
      default: void 0
    },
    touchAngle: {
      type: Number,
      default: void 0
    },
    simulateTouch: {
      type: Boolean,
      default: void 0
    },
    shortSwipes: {
      type: Boolean,
      default: void 0
    },
    longSwipes: {
      type: Boolean,
      default: void 0
    },
    longSwipesRatio: {
      type: Number,
      default: void 0
    },
    longSwipesMs: {
      type: Number,
      default: void 0
    },
    followFinger: {
      type: Boolean,
      default: void 0
    },
    allowTouchMove: {
      type: Boolean,
      default: void 0
    },
    threshold: {
      type: Number,
      default: void 0
    },
    touchMoveStopPropagation: {
      type: Boolean,
      default: void 0
    },
    touchStartPreventDefault: {
      type: Boolean,
      default: void 0
    },
    touchStartForcePreventDefault: {
      type: Boolean,
      default: void 0
    },
    touchReleaseOnEdges: {
      type: Boolean,
      default: void 0
    },
    uniqueNavElements: {
      type: Boolean,
      default: void 0
    },
    resistance: {
      type: Boolean,
      default: void 0
    },
    resistanceRatio: {
      type: Number,
      default: void 0
    },
    watchSlidesProgress: {
      type: Boolean,
      default: void 0
    },
    grabCursor: {
      type: Boolean,
      default: void 0
    },
    preventClicks: {
      type: Boolean,
      default: void 0
    },
    preventClicksPropagation: {
      type: Boolean,
      default: void 0
    },
    slideToClickedSlide: {
      type: Boolean,
      default: void 0
    },
    loop: {
      type: Boolean,
      default: void 0
    },
    loopedSlides: {
      type: Number,
      default: void 0
    },
    loopPreventsSliding: {
      type: Boolean,
      default: void 0
    },
    loopAdditionalSlides: {
      type: Number,
      default: void 0
    },
    loopAddBlankSlides: {
      type: Boolean,
      default: void 0
    },
    rewind: {
      type: Boolean,
      default: void 0
    },
    allowSlidePrev: {
      type: Boolean,
      default: void 0
    },
    allowSlideNext: {
      type: Boolean,
      default: void 0
    },
    swipeHandler: {
      type: Boolean,
      default: void 0
    },
    noSwiping: {
      type: Boolean,
      default: void 0
    },
    noSwipingClass: {
      type: String,
      default: void 0
    },
    noSwipingSelector: {
      type: String,
      default: void 0
    },
    passiveListeners: {
      type: Boolean,
      default: void 0
    },
    containerModifierClass: {
      type: String,
      default: void 0
    },
    slideClass: {
      type: String,
      default: void 0
    },
    slideActiveClass: {
      type: String,
      default: void 0
    },
    slideVisibleClass: {
      type: String,
      default: void 0
    },
    slideFullyVisibleClass: {
      type: String,
      default: void 0
    },
    slideBlankClass: {
      type: String,
      default: void 0
    },
    slideNextClass: {
      type: String,
      default: void 0
    },
    slidePrevClass: {
      type: String,
      default: void 0
    },
    wrapperClass: {
      type: String,
      default: void 0
    },
    lazyPreloaderClass: {
      type: String,
      default: void 0
    },
    lazyPreloadPrevNext: {
      type: Number,
      default: void 0
    },
    runCallbacksOnInit: {
      type: Boolean,
      default: void 0
    },
    observer: {
      type: Boolean,
      default: void 0
    },
    observeParents: {
      type: Boolean,
      default: void 0
    },
    observeSlideChildren: {
      type: Boolean,
      default: void 0
    },
    a11y: {
      type: [Boolean, Object],
      default: void 0
    },
    autoplay: {
      type: [Boolean, Object],
      default: void 0
    },
    controller: {
      type: Object,
      default: void 0
    },
    coverflowEffect: {
      type: Object,
      default: void 0
    },
    cubeEffect: {
      type: Object,
      default: void 0
    },
    fadeEffect: {
      type: Object,
      default: void 0
    },
    flipEffect: {
      type: Object,
      default: void 0
    },
    creativeEffect: {
      type: Object,
      default: void 0
    },
    cardsEffect: {
      type: Object,
      default: void 0
    },
    hashNavigation: {
      type: [Boolean, Object],
      default: void 0
    },
    history: {
      type: [Boolean, Object],
      default: void 0
    },
    keyboard: {
      type: [Boolean, Object],
      default: void 0
    },
    mousewheel: {
      type: [Boolean, Object],
      default: void 0
    },
    navigation: {
      type: [Boolean, Object],
      default: void 0
    },
    pagination: {
      type: [Boolean, Object],
      default: void 0
    },
    parallax: {
      type: [Boolean, Object],
      default: void 0
    },
    scrollbar: {
      type: [Boolean, Object],
      default: void 0
    },
    thumbs: {
      type: Object,
      default: void 0
    },
    virtual: {
      type: [Boolean, Object],
      default: void 0
    },
    zoom: {
      type: [Boolean, Object],
      default: void 0
    },
    grid: {
      type: [Object],
      default: void 0
    },
    freeMode: {
      type: [Boolean, Object],
      default: void 0
    },
    enabled: {
      type: Boolean,
      default: void 0
    }
  },
  emits: ["_beforeBreakpoint", "_containerClasses", "_slideClass", "_slideClasses", "_swiper", "_freeModeNoMomentumRelease", "_virtualUpdated", "activeIndexChange", "afterInit", "autoplay", "autoplayStart", "autoplayStop", "autoplayPause", "autoplayResume", "autoplayTimeLeft", "beforeDestroy", "beforeInit", "beforeLoopFix", "beforeResize", "beforeSlideChangeStart", "beforeTransitionStart", "breakpoint", "changeDirection", "click", "disable", "doubleTap", "doubleClick", "destroy", "enable", "fromEdge", "hashChange", "hashSet", "init", "keyPress", "lock", "loopFix", "momentumBounce", "navigationHide", "navigationShow", "navigationPrev", "navigationNext", "observerUpdate", "orientationchange", "paginationHide", "paginationRender", "paginationShow", "paginationUpdate", "progress", "reachBeginning", "reachEnd", "realIndexChange", "resize", "scroll", "scrollbarDragEnd", "scrollbarDragMove", "scrollbarDragStart", "setTransition", "setTranslate", "slidesUpdated", "slideChange", "slideChangeTransitionEnd", "slideChangeTransitionStart", "slideNextTransitionEnd", "slideNextTransitionStart", "slidePrevTransitionEnd", "slidePrevTransitionStart", "slideResetTransitionStart", "slideResetTransitionEnd", "sliderMove", "sliderFirstMove", "slidesLengthChange", "slidesGridLengthChange", "snapGridLengthChange", "snapIndexChange", "swiper", "tap", "toEdge", "touchEnd", "touchMove", "touchMoveOpposite", "touchStart", "transitionEnd", "transitionStart", "unlock", "update", "virtualUpdate", "zoomChange"],
  setup($e, _e) {
    let {
      slots: ke,
      emit: Be
    } = _e;
    const {
      tag: Ne,
      wrapperTag: Ve
    } = $e, Le = ref("swiper"), De = ref(null), Ae = ref(!1), Ie = ref(!1), Re = ref(null), ze = ref(null), je = ref(null), Fe = {
      value: []
    }, He = {
      value: []
    }, Ge = ref(null), qe = ref(null), Xe = ref(null), Ye = ref(null), {
      params: We,
      passedParams: Je
    } = getParams($e);
    getChildren(ke, Fe, He), je.value = Je, He.value = Fe.value;
    const ri = () => {
      getChildren(ke, Fe, He), Ae.value = !0;
    };
    We.onAny = function(ei) {
      for (var Ze = arguments.length, Ue = new Array(Ze > 1 ? Ze - 1 : 0), Ke = 1; Ke < Ze; Ke++)
        Ue[Ke - 1] = arguments[Ke];
      Be(ei, ...Ue);
    }, Object.assign(We.on, {
      _beforeBreakpoint: ri,
      _containerClasses(ei, Ze) {
        Le.value = Ze;
      }
    });
    const Qe = {
      ...We
    };
    if (delete Qe.wrapperClass, ze.value = new Swiper$1(Qe), ze.value.virtual && ze.value.params.virtual.enabled) {
      ze.value.virtual.slides = Fe.value;
      const ei = {
        cache: !1,
        slides: Fe.value,
        renderExternal: (Ze) => {
          De.value = Ze;
        },
        renderExternalUpdate: !1
      };
      extend(ze.value.params.virtual, ei), extend(ze.value.originalParams.virtual, ei);
    }
    onUpdated(() => {
      !Ie.value && ze.value && (ze.value.emitSlidesClasses(), Ie.value = !0);
      const {
        passedParams: ei
      } = getParams($e), Ze = getChangedParams(ei, je.value, Fe.value, He.value, (Ue) => Ue.props && Ue.props.key);
      je.value = ei, (Ze.length || Ae.value) && ze.value && !ze.value.destroyed && updateSwiper({
        swiper: ze.value,
        slides: Fe.value,
        passedParams: ei,
        changedParams: Ze,
        nextEl: Ge.value,
        prevEl: qe.value,
        scrollbarEl: Ye.value,
        paginationEl: Xe.value
      }), Ae.value = !1;
    }), provide("swiper", ze), watch(De, () => {
      nextTick$1(() => {
        updateOnVirtualData(ze.value);
      });
    }), onMounted(() => {
      Re.value && (mountSwiper({
        el: Re.value,
        nextEl: Ge.value,
        prevEl: qe.value,
        paginationEl: Xe.value,
        scrollbarEl: Ye.value,
        swiper: ze.value
      }, We), Be("swiper", ze.value));
    }), onBeforeUnmount(() => {
      ze.value && !ze.value.destroyed && ze.value.destroy(!0, !1);
    });
    function ti(ei) {
      return We.virtual ? renderVirtual(ze, ei, De.value) : (ei.forEach((Ze, Ue) => {
        Ze.props || (Ze.props = {}), Ze.props.swiperRef = ze, Ze.props.swiperSlideIndex = Ue;
      }), ei);
    }
    return () => {
      const {
        slides: ei,
        slots: Ze
      } = getChildren(ke, Fe, He);
      return h$1(Ne, {
        ref: Re,
        class: uniqueClasses(Le.value)
      }, [Ze["container-start"], h$1(Ve, {
        class: wrapperClass(We.wrapperClass)
      }, [Ze["wrapper-start"], ti(ei), Ze["wrapper-end"]]), needsNavigation($e) && [h$1("div", {
        ref: qe,
        class: "swiper-button-prev"
      }), h$1("div", {
        ref: Ge,
        class: "swiper-button-next"
      })], needsScrollbar($e) && h$1("div", {
        ref: Ye,
        class: "swiper-scrollbar"
      }), needsPagination($e) && h$1("div", {
        ref: Xe,
        class: "swiper-pagination"
      }), Ze["container-end"]]);
    };
  }
}, SwiperSlide = {
  name: "SwiperSlide",
  props: {
    tag: {
      type: String,
      default: "div"
    },
    swiperRef: {
      type: Object,
      required: !1
    },
    swiperSlideIndex: {
      type: Number,
      default: void 0,
      required: !1
    },
    zoom: {
      type: Boolean,
      default: void 0,
      required: !1
    },
    lazy: {
      type: Boolean,
      default: !1,
      required: !1
    },
    virtualIndex: {
      type: [String, Number],
      default: void 0
    }
  },
  setup($e, _e) {
    let {
      slots: ke
    } = _e, Be = !1;
    const {
      swiperRef: Ne
    } = $e, Ve = ref(null), Le = ref("swiper-slide"), De = ref(!1);
    function Ae(ze, je, Fe) {
      je === Ve.value && (Le.value = Fe);
    }
    onMounted(() => {
      !Ne || !Ne.value || (Ne.value.on("_slideClass", Ae), Be = !0);
    }), onBeforeUpdate(() => {
      Be || !Ne || !Ne.value || (Ne.value.on("_slideClass", Ae), Be = !0);
    }), onUpdated(() => {
      !Ve.value || !Ne || !Ne.value || (typeof $e.swiperSlideIndex < "u" && (Ve.value.swiperSlideIndex = $e.swiperSlideIndex), Ne.value.destroyed && Le.value !== "swiper-slide" && (Le.value = "swiper-slide"));
    }), onBeforeUnmount(() => {
      !Ne || !Ne.value || Ne.value.off("_slideClass", Ae);
    });
    const Ie = computed(() => ({
      isActive: Le.value.indexOf("swiper-slide-active") >= 0,
      isVisible: Le.value.indexOf("swiper-slide-visible") >= 0,
      isPrev: Le.value.indexOf("swiper-slide-prev") >= 0,
      isNext: Le.value.indexOf("swiper-slide-next") >= 0
    }));
    provide("swiperSlide", Ie);
    const Re = () => {
      De.value = !0;
    };
    return () => h$1($e.tag, {
      class: uniqueClasses(`${Le.value}`),
      ref: Ve,
      "data-swiper-slide-index": typeof $e.virtualIndex > "u" && Ne && Ne.value && Ne.value.params.loop ? $e.swiperSlideIndex : $e.virtualIndex,
      onLoadCapture: Re
    }, $e.zoom ? h$1("div", {
      class: "swiper-zoom-container",
      "data-swiper-zoom": typeof $e.zoom == "number" ? $e.zoom : void 0
    }, [ke.default && ke.default(Ie.value), $e.lazy && !De.value && h$1("div", {
      class: "swiper-lazy-preloader"
    })]) : [ke.default && ke.default(Ie.value), $e.lazy && !De.value && h$1("div", {
      class: "swiper-lazy-preloader"
    })]);
  }
}, _hoisted_1$O = ["aria-label"], _hoisted_2$s = ["aria-label", "aria-current", "onClick"], _sfc_main$T = /* @__PURE__ */ defineComponent({
  __name: "SwiperPagination",
  props: {
    imagesUrls: {},
    activeSlideIndex: {},
    goToSlide: { type: Function }
  },
  setup($e) {
    const _e = $e, ke = (Be) => {
      _e.goToSlide(Be);
    };
    return (Be, Ne) => (openBlock(), createElementBlock("div", {
      class: "irep-swiper-pagination ire-pointer-events-auto ire-flex ire-items-center ire-gap-1.5 ire-rounded-full ire-border ire-border-black/[0.06] ire-bg-white/95 ire-px-3 ire-py-1.5 ire-shadow-sm",
      role: "tablist",
      "aria-label": unref(tr)("Images")
    }, [
      (openBlock(!0), createElementBlock(Fragment, null, renderList($e.imagesUrls, (Ve, Le) => (openBlock(), createElementBlock("div", {
        key: `dot-${Le}`,
        type: "button",
        class: normalizeClass([
          "irep-swiper-pagination__dot ire-box-border ire-size-2 ire-min-w-0 ire-shrink-0 ire-cursor-pointer ire-rounded-full ire-border-0 ire-p-1 ire-transition-all ire-duration-200 [line-height:0] focus-visible:ire-outline focus-visible:ire-outline-2 focus-visible:ire-outline-offset-2 focus-visible:ire-outline-[var(--primary-color)]",
          Le === $e.activeSlideIndex ? "ire-scale-125 ire-bg-[var(--primary-color)]" : "ire-bg-gray-300"
        ]),
        "aria-label": `${unref(tr)("Slide")} ${Le + 1}`,
        "aria-current": Le === $e.activeSlideIndex ? "true" : void 0,
        onClick: (De) => ke(Le)
      }, null, 10, _hoisted_2$s))), 128))
    ], 8, _hoisted_1$O));
  }
}), _sfc_main$S = {}, _hoisted_1$N = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "40px",
  height: "40px",
  viewBox: "0 0 24 24",
  fill: "none",
  webcrx: ""
};
function _sfc_render$g($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$N, [..._e[0] || (_e[0] = [
    createElementVNode("path", {
      d: "M4 7.5L11.6078 3.22062C11.7509 3.14014 11.8224 3.09991 11.8982 3.08414C11.9654 3.07019 12.0346 3.07019 12.1018 3.08414C12.1776 3.09991 12.2491 3.14014 12.3922 3.22062L20 7.5M4 7.5V16.0321C4 16.2025 4 16.2876 4.02499 16.3637C4.04711 16.431 4.08326 16.4928 4.13106 16.545C4.1851 16.6041 4.25933 16.6459 4.40779 16.7294L12 21M4 7.5L12 11.5M12 21L19.5922 16.7294C19.7407 16.6459 19.8149 16.6041 19.8689 16.545C19.9167 16.4928 19.9529 16.431 19.975 16.3637C20 16.2876 20 16.2025 20 16.0321V7.5M12 21V11.5M20 7.5L12 11.5",
      stroke: "#000000",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ])]);
}
const Cube3d = /* @__PURE__ */ _export_sfc(_sfc_main$S, [["render", _sfc_render$g]]), _sfc_main$R = {}, _hoisted_1$M = {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function _sfc_render$f($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$M, [..._e[0] || (_e[0] = [
    createStaticVNode('<path d="M5.25 20.25H4.5C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V18.75" stroke="white" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.5 8.25H8.25" stroke="white" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.5 20.25H9" stroke="white" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.75 15.75V13.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.75 15V13.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.25 20.25H15C15.1989 20.25 15.3897 20.171 15.5303 20.0303C15.671 19.8897 15.75 19.6989 15.75 19.5V18.75" stroke="white" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.25 8.25H15C15.1989 8.25 15.3897 8.32902 15.5303 8.46967C15.671 8.61032 15.75 8.80109 15.75 9V9.75" stroke="white" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.25 8.25H4.5C4.30109 8.25 4.11032 8.32902 3.96967 8.46967C3.82902 8.61032 3.75 8.80109 3.75 9V9.75" stroke="white" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.75 15.75H19.5C19.6989 15.75 19.8897 15.671 20.0303 15.5303C20.171 15.3897 20.25 15.1989 20.25 15V4.5C20.25 4.30109 20.171 4.11032 20.0303 3.96967C19.8897 3.82902 19.6989 3.75 19.5 3.75H9C8.80109 3.75 8.61032 3.82902 8.46967 3.96967C8.32902 4.11032 8.25 4.30109 8.25 4.5V8.25" stroke="white" stroke-linecap="round" stroke-linejoin="round"></path>', 9)
  ])]);
}
const FlatIcon = /* @__PURE__ */ _export_sfc(_sfc_main$R, [["render", _sfc_render$f]]), t = ($e, _e = 1e4) => ($e = parseFloat($e + "") || 0, Math.round(($e + Number.EPSILON) * _e) / _e), e = function($e) {
  if (!($e && $e instanceof Element && $e.offsetParent)) return !1;
  const _e = $e.scrollHeight > $e.clientHeight, ke = window.getComputedStyle($e).overflowY, Be = ke.indexOf("hidden") !== -1, Ne = ke.indexOf("visible") !== -1;
  return _e && !Be && !Ne;
}, i = function($e, _e = void 0) {
  return !(!$e || $e === document.body || _e && $e === _e) && (e($e) ? $e : i($e.parentElement, _e));
}, n = function($e) {
  var _e = new DOMParser().parseFromString($e, "text/html").body;
  if (_e.childElementCount > 1) {
    for (var ke = document.createElement("div"); _e.firstChild; ) ke.appendChild(_e.firstChild);
    return ke;
  }
  return _e.firstChild;
}, s = ($e) => `${$e || ""}`.split(" ").filter((_e) => !!_e), o = ($e, _e, ke) => {
  $e && s(_e).forEach((Be) => {
    $e.classList.toggle(Be, ke || !1);
  });
};
class a {
  constructor(_e) {
    Object.defineProperty(this, "pageX", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), Object.defineProperty(this, "pageY", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), Object.defineProperty(this, "clientX", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), Object.defineProperty(this, "clientY", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), Object.defineProperty(this, "id", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), Object.defineProperty(this, "time", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), Object.defineProperty(this, "nativePointer", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), this.nativePointer = _e, this.pageX = _e.pageX, this.pageY = _e.pageY, this.clientX = _e.clientX, this.clientY = _e.clientY, this.id = self.Touch && _e instanceof Touch ? _e.identifier : -1, this.time = Date.now();
  }
}
const r = { passive: !1 };
class l {
  constructor(_e, { start: ke = () => !0, move: Be = () => {
  }, end: Ne = () => {
  } }) {
    Object.defineProperty(this, "element", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), Object.defineProperty(this, "startCallback", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), Object.defineProperty(this, "moveCallback", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), Object.defineProperty(this, "endCallback", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), Object.defineProperty(this, "currentPointers", { enumerable: !0, configurable: !0, writable: !0, value: [] }), Object.defineProperty(this, "startPointers", { enumerable: !0, configurable: !0, writable: !0, value: [] }), this.element = _e, this.startCallback = ke, this.moveCallback = Be, this.endCallback = Ne;
    for (const Ve of ["onPointerStart", "onTouchStart", "onMove", "onTouchEnd", "onPointerEnd", "onWindowBlur"]) this[Ve] = this[Ve].bind(this);
    this.element.addEventListener("mousedown", this.onPointerStart, r), this.element.addEventListener("touchstart", this.onTouchStart, r), this.element.addEventListener("touchmove", this.onMove, r), this.element.addEventListener("touchend", this.onTouchEnd), this.element.addEventListener("touchcancel", this.onTouchEnd);
  }
  onPointerStart(_e) {
    if (!_e.buttons || _e.button !== 0) return;
    const ke = new a(_e);
    this.currentPointers.some((Be) => Be.id === ke.id) || this.triggerPointerStart(ke, _e) && (window.addEventListener("mousemove", this.onMove), window.addEventListener("mouseup", this.onPointerEnd), window.addEventListener("blur", this.onWindowBlur));
  }
  onTouchStart(_e) {
    for (const ke of Array.from(_e.changedTouches || [])) this.triggerPointerStart(new a(ke), _e);
    window.addEventListener("blur", this.onWindowBlur);
  }
  onMove(_e) {
    const ke = this.currentPointers.slice(), Be = "changedTouches" in _e ? Array.from(_e.changedTouches || []).map((Ve) => new a(Ve)) : [new a(_e)], Ne = [];
    for (const Ve of Be) {
      const Le = this.currentPointers.findIndex((De) => De.id === Ve.id);
      Le < 0 || (Ne.push(Ve), this.currentPointers[Le] = Ve);
    }
    Ne.length && this.moveCallback(_e, this.currentPointers.slice(), ke);
  }
  onPointerEnd(_e) {
    _e.buttons > 0 && _e.button !== 0 || (this.triggerPointerEnd(_e, new a(_e)), window.removeEventListener("mousemove", this.onMove), window.removeEventListener("mouseup", this.onPointerEnd), window.removeEventListener("blur", this.onWindowBlur));
  }
  onTouchEnd(_e) {
    for (const ke of Array.from(_e.changedTouches || [])) this.triggerPointerEnd(_e, new a(ke));
  }
  triggerPointerStart(_e, ke) {
    return !!this.startCallback(ke, _e, this.currentPointers.slice()) && (this.currentPointers.push(_e), this.startPointers.push(_e), !0);
  }
  triggerPointerEnd(_e, ke) {
    const Be = this.currentPointers.findIndex((Ne) => Ne.id === ke.id);
    Be < 0 || (this.currentPointers.splice(Be, 1), this.startPointers.splice(Be, 1), this.endCallback(_e, ke, this.currentPointers.slice()));
  }
  onWindowBlur() {
    this.clear();
  }
  clear() {
    for (; this.currentPointers.length; ) {
      const _e = this.currentPointers[this.currentPointers.length - 1];
      this.currentPointers.splice(this.currentPointers.length - 1, 1), this.startPointers.splice(this.currentPointers.length - 1, 1), this.endCallback(new Event("touchend", { bubbles: !0, cancelable: !0, clientX: _e.clientX, clientY: _e.clientY }), _e, this.currentPointers.slice());
    }
  }
  stop() {
    this.element.removeEventListener("mousedown", this.onPointerStart, r), this.element.removeEventListener("touchstart", this.onTouchStart, r), this.element.removeEventListener("touchmove", this.onMove, r), this.element.removeEventListener("touchend", this.onTouchEnd), this.element.removeEventListener("touchcancel", this.onTouchEnd), window.removeEventListener("mousemove", this.onMove), window.removeEventListener("mouseup", this.onPointerEnd), window.removeEventListener("blur", this.onWindowBlur);
  }
}
function c($e, _e) {
  return _e ? Math.sqrt(Math.pow(_e.clientX - $e.clientX, 2) + Math.pow(_e.clientY - $e.clientY, 2)) : 0;
}
function h($e, _e) {
  return _e ? { clientX: ($e.clientX + _e.clientX) / 2, clientY: ($e.clientY + _e.clientY) / 2 } : $e;
}
const d = ($e) => typeof $e == "object" && $e !== null && $e.constructor === Object && Object.prototype.toString.call($e) === "[object Object]", u = ($e, ..._e) => {
  const ke = _e.length;
  for (let Be = 0; Be < ke; Be++) {
    const Ne = _e[Be] || {};
    Object.entries(Ne).forEach(([Ve, Le]) => {
      const De = Array.isArray(Le) ? [] : {};
      $e[Ve] || Object.assign($e, { [Ve]: De }), d(Le) ? Object.assign($e[Ve], u(De, Le)) : Array.isArray(Le) ? Object.assign($e, { [Ve]: [...Le] }) : Object.assign($e, { [Ve]: Le });
    });
  }
  return $e;
}, p = function($e, _e) {
  return $e.split(".").reduce((ke, Be) => typeof ke == "object" ? ke[Be] : void 0, _e);
};
class f {
  constructor(_e = {}) {
    Object.defineProperty(this, "options", { enumerable: !0, configurable: !0, writable: !0, value: _e }), Object.defineProperty(this, "events", { enumerable: !0, configurable: !0, writable: !0, value: /* @__PURE__ */ new Map() }), this.setOptions(_e);
    for (const ke of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) ke.startsWith("on") && typeof this[ke] == "function" && (this[ke] = this[ke].bind(this));
  }
  setOptions(_e) {
    this.options = _e ? u({}, this.constructor.defaults, _e) : {};
    for (const [ke, Be] of Object.entries(this.option("on") || {})) this.on(ke, Be);
  }
  option(_e, ...ke) {
    let Be = p(_e, this.options);
    return Be && typeof Be == "function" && (Be = Be.call(this, this, ...ke)), Be;
  }
  optionFor(_e, ke, Be, ...Ne) {
    let Ve = p(ke, _e);
    var Le;
    typeof (Le = Ve) != "string" || isNaN(Le) || isNaN(parseFloat(Le)) || (Ve = parseFloat(Ve)), Ve === "true" && (Ve = !0), Ve === "false" && (Ve = !1), Ve && typeof Ve == "function" && (Ve = Ve.call(this, this, _e, ...Ne));
    let De = p(ke, this.options);
    return De && typeof De == "function" ? Ve = De.call(this, this, _e, ...Ne, Ve) : Ve === void 0 && (Ve = De), Ve === void 0 ? Be : Ve;
  }
  cn(_e) {
    const ke = this.options.classes;
    return ke && ke[_e] || "";
  }
  localize(_e, ke = []) {
    _e = String(_e).replace(/\{\{(\w+).?(\w+)?\}\}/g, (Be, Ne, Ve) => {
      let Le = "";
      return Ve ? Le = this.option(`${Ne[0] + Ne.toLowerCase().substring(1)}.l10n.${Ve}`) : Ne && (Le = this.option(`l10n.${Ne}`)), Le || (Le = Be), Le;
    });
    for (let Be = 0; Be < ke.length; Be++) _e = _e.split(ke[Be][0]).join(ke[Be][1]);
    return _e = _e.replace(/\{\{(.*?)\}\}/g, (Be, Ne) => Ne);
  }
  on(_e, ke) {
    let Be = [];
    typeof _e == "string" ? Be = _e.split(" ") : Array.isArray(_e) && (Be = _e), this.events || (this.events = /* @__PURE__ */ new Map()), Be.forEach((Ne) => {
      let Ve = this.events.get(Ne);
      Ve || (this.events.set(Ne, []), Ve = []), Ve.includes(ke) || Ve.push(ke), this.events.set(Ne, Ve);
    });
  }
  off(_e, ke) {
    let Be = [];
    typeof _e == "string" ? Be = _e.split(" ") : Array.isArray(_e) && (Be = _e), Be.forEach((Ne) => {
      const Ve = this.events.get(Ne);
      if (Array.isArray(Ve)) {
        const Le = Ve.indexOf(ke);
        Le > -1 && Ve.splice(Le, 1);
      }
    });
  }
  emit(_e, ...ke) {
    [...this.events.get(_e) || []].forEach((Be) => Be(this, ...ke)), _e !== "*" && this.emit("*", _e, ...ke);
  }
}
Object.defineProperty(f, "version", { enumerable: !0, configurable: !0, writable: !0, value: "5.0.36" }), Object.defineProperty(f, "defaults", { enumerable: !0, configurable: !0, writable: !0, value: {} });
class g extends f {
  constructor(_e = {}) {
    super(_e), Object.defineProperty(this, "plugins", { enumerable: !0, configurable: !0, writable: !0, value: {} });
  }
  attachPlugins(_e = {}) {
    const ke = /* @__PURE__ */ new Map();
    for (const [Be, Ne] of Object.entries(_e)) {
      const Ve = this.option(Be), Le = this.plugins[Be];
      Le || Ve === !1 ? Le && Ve === !1 && (Le.detach(), delete this.plugins[Be]) : ke.set(Be, new Ne(this, Ve || {}));
    }
    for (const [Be, Ne] of ke) this.plugins[Be] = Ne, Ne.attach();
  }
  detachPlugins(_e) {
    _e = _e || Object.keys(this.plugins);
    for (const ke of _e) {
      const Be = this.plugins[ke];
      Be && Be.detach(), delete this.plugins[ke];
    }
    return this.emit("detachPlugins"), this;
  }
}
var m;
(function($e) {
  $e[$e.Init = 0] = "Init", $e[$e.Error = 1] = "Error", $e[$e.Ready = 2] = "Ready", $e[$e.Panning = 3] = "Panning", $e[$e.Mousemove = 4] = "Mousemove", $e[$e.Destroy = 5] = "Destroy";
})(m || (m = {}));
const v = ["a", "b", "c", "d", "e", "f"], b = { PANUP: "Move up", PANDOWN: "Move down", PANLEFT: "Move left", PANRIGHT: "Move right", ZOOMIN: "Zoom in", ZOOMOUT: "Zoom out", TOGGLEZOOM: "Toggle zoom level", TOGGLE1TO1: "Toggle zoom level", ITERATEZOOM: "Toggle zoom level", ROTATECCW: "Rotate counterclockwise", ROTATECW: "Rotate clockwise", FLIPX: "Flip horizontally", FLIPY: "Flip vertically", FITX: "Fit horizontally", FITY: "Fit vertically", RESET: "Reset", TOGGLEFS: "Toggle fullscreen" }, y = { content: null, width: "auto", height: "auto", panMode: "drag", touch: !0, dragMinThreshold: 3, lockAxis: !1, mouseMoveFactor: 1, mouseMoveFriction: 0.12, zoom: !0, pinchToZoom: !0, panOnlyZoomed: "auto", minScale: 1, maxScale: 2, friction: 0.25, dragFriction: 0.35, decelFriction: 0.05, click: "toggleZoom", dblClick: !1, wheel: "zoom", wheelLimit: 7, spinner: !0, bounds: "auto", infinite: !1, rubberband: !0, bounce: !0, maxVelocity: 75, transformParent: !1, classes: { content: "f-panzoom__content", isLoading: "is-loading", canZoomIn: "can-zoom_in", canZoomOut: "can-zoom_out", isDraggable: "is-draggable", isDragging: "is-dragging", inFullscreen: "in-fullscreen", htmlHasFullscreen: "with-panzoom-in-fullscreen" }, l10n: b }, w = '<circle cx="25" cy="25" r="20"></circle>', x = '<div class="f-spinner"><svg viewBox="0 0 50 50">' + w + w + "</svg></div>", E = ($e) => $e && $e !== null && $e instanceof Element && "nodeType" in $e, S = ($e, _e) => {
  $e && s(_e).forEach((ke) => {
    $e.classList.remove(ke);
  });
}, P = ($e, _e) => {
  $e && s(_e).forEach((ke) => {
    $e.classList.add(ke);
  });
}, C = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, T = 1e5, M = 1e4, O = "mousemove", A = "drag", L = "content", z = "auto";
let R = null, k = null;
class I extends g {
  get fits() {
    return this.contentRect.width - this.contentRect.fitWidth < 1 && this.contentRect.height - this.contentRect.fitHeight < 1;
  }
  get isTouchDevice() {
    return k === null && (k = window.matchMedia("(hover: none)").matches), k;
  }
  get isMobile() {
    return R === null && (R = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)), R;
  }
  get panMode() {
    return this.options.panMode !== O || this.isTouchDevice ? A : O;
  }
  get panOnlyZoomed() {
    const _e = this.options.panOnlyZoomed;
    return _e === z ? this.isTouchDevice : _e;
  }
  get isInfinite() {
    return this.option("infinite");
  }
  get angle() {
    return 180 * Math.atan2(this.current.b, this.current.a) / Math.PI || 0;
  }
  get targetAngle() {
    return 180 * Math.atan2(this.target.b, this.target.a) / Math.PI || 0;
  }
  get scale() {
    const { a: _e, b: ke } = this.current;
    return Math.sqrt(_e * _e + ke * ke) || 1;
  }
  get targetScale() {
    const { a: _e, b: ke } = this.target;
    return Math.sqrt(_e * _e + ke * ke) || 1;
  }
  get minScale() {
    return this.option("minScale") || 1;
  }
  get fullScale() {
    const { contentRect: _e } = this;
    return _e.fullWidth / _e.fitWidth || 1;
  }
  get maxScale() {
    return this.fullScale * (this.option("maxScale") || 1) || 1;
  }
  get coverScale() {
    const { containerRect: _e, contentRect: ke } = this, Be = Math.max(_e.height / ke.fitHeight, _e.width / ke.fitWidth) || 1;
    return Math.min(this.fullScale, Be);
  }
  get isScaling() {
    return Math.abs(this.targetScale - this.scale) > 1e-5 && !this.isResting;
  }
  get isContentLoading() {
    const _e = this.content;
    return !!(_e && _e instanceof HTMLImageElement) && !_e.complete;
  }
  get isResting() {
    if (this.isBouncingX || this.isBouncingY) return !1;
    for (const _e of v) {
      const ke = _e == "e" || _e === "f" ? 1e-4 : 1e-5;
      if (Math.abs(this.target[_e] - this.current[_e]) > ke) return !1;
    }
    return !(!this.ignoreBounds && !this.checkBounds().inBounds);
  }
  constructor(_e, ke = {}, Be = {}) {
    var Ne;
    if (super(ke), Object.defineProperty(this, "pointerTracker", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "resizeObserver", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "updateTimer", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "clickTimer", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "rAF", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "isTicking", { enumerable: !0, configurable: !0, writable: !0, value: !1 }), Object.defineProperty(this, "ignoreBounds", { enumerable: !0, configurable: !0, writable: !0, value: !1 }), Object.defineProperty(this, "isBouncingX", { enumerable: !0, configurable: !0, writable: !0, value: !1 }), Object.defineProperty(this, "isBouncingY", { enumerable: !0, configurable: !0, writable: !0, value: !1 }), Object.defineProperty(this, "clicks", { enumerable: !0, configurable: !0, writable: !0, value: 0 }), Object.defineProperty(this, "trackingPoints", { enumerable: !0, configurable: !0, writable: !0, value: [] }), Object.defineProperty(this, "pwt", { enumerable: !0, configurable: !0, writable: !0, value: 0 }), Object.defineProperty(this, "cwd", { enumerable: !0, configurable: !0, writable: !0, value: 0 }), Object.defineProperty(this, "pmme", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), Object.defineProperty(this, "friction", { enumerable: !0, configurable: !0, writable: !0, value: 0 }), Object.defineProperty(this, "state", { enumerable: !0, configurable: !0, writable: !0, value: m.Init }), Object.defineProperty(this, "isDragging", { enumerable: !0, configurable: !0, writable: !0, value: !1 }), Object.defineProperty(this, "container", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), Object.defineProperty(this, "content", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), Object.defineProperty(this, "spinner", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "containerRect", { enumerable: !0, configurable: !0, writable: !0, value: { width: 0, height: 0, innerWidth: 0, innerHeight: 0 } }), Object.defineProperty(this, "contentRect", { enumerable: !0, configurable: !0, writable: !0, value: { top: 0, right: 0, bottom: 0, left: 0, fullWidth: 0, fullHeight: 0, fitWidth: 0, fitHeight: 0, width: 0, height: 0 } }), Object.defineProperty(this, "dragStart", { enumerable: !0, configurable: !0, writable: !0, value: { x: 0, y: 0, top: 0, left: 0, time: 0 } }), Object.defineProperty(this, "dragOffset", { enumerable: !0, configurable: !0, writable: !0, value: { x: 0, y: 0, time: 0 } }), Object.defineProperty(this, "current", { enumerable: !0, configurable: !0, writable: !0, value: Object.assign({}, C) }), Object.defineProperty(this, "target", { enumerable: !0, configurable: !0, writable: !0, value: Object.assign({}, C) }), Object.defineProperty(this, "velocity", { enumerable: !0, configurable: !0, writable: !0, value: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 } }), Object.defineProperty(this, "lockedAxis", { enumerable: !0, configurable: !0, writable: !0, value: !1 }), !_e) throw new Error("Container Element Not Found");
    this.container = _e, this.initContent(), this.attachPlugins(Object.assign(Object.assign({}, I.Plugins), Be)), this.emit("attachPlugins"), this.emit("init");
    const Ve = this.content;
    if (Ve.addEventListener("load", this.onLoad), Ve.addEventListener("error", this.onError), this.isContentLoading) {
      if (this.option("spinner")) {
        _e.classList.add(this.cn("isLoading"));
        const Le = n(x);
        !_e.contains(Ve) || Ve.parentElement instanceof HTMLPictureElement ? this.spinner = _e.appendChild(Le) : this.spinner = ((Ne = Ve.parentElement) === null || Ne === void 0 ? void 0 : Ne.insertBefore(Le, Ve)) || null;
      }
      this.emit("beforeLoad");
    } else queueMicrotask(() => {
      this.enable();
    });
  }
  initContent() {
    const { container: _e } = this, ke = this.cn(L);
    let Be = this.option(L) || _e.querySelector(`.${ke}`);
    if (Be || (Be = _e.querySelector("img,picture") || _e.firstElementChild, Be && P(Be, ke)), Be instanceof HTMLPictureElement && (Be = Be.querySelector("img")), !Be) throw new Error("No content found");
    this.content = Be;
  }
  onLoad() {
    const { spinner: _e, container: ke, state: Be } = this;
    _e && (_e.remove(), this.spinner = null), this.option("spinner") && ke.classList.remove(this.cn("isLoading")), this.emit("afterLoad"), Be === m.Init ? this.enable() : this.updateMetrics();
  }
  onError() {
    this.state !== m.Destroy && (this.spinner && (this.spinner.remove(), this.spinner = null), this.stop(), this.detachEvents(), this.state = m.Error, this.emit("error"));
  }
  getNextScale(_e) {
    const { fullScale: ke, targetScale: Be, coverScale: Ne, maxScale: Ve, minScale: Le } = this;
    let De = Le;
    switch (_e) {
      case "toggleMax":
        De = Be - Le < 0.5 * (Ve - Le) ? Ve : Le;
        break;
      case "toggleCover":
        De = Be - Le < 0.5 * (Ne - Le) ? Ne : Le;
        break;
      case "toggleZoom":
        De = Be - Le < 0.5 * (ke - Le) ? ke : Le;
        break;
      case "iterateZoom":
        let Ae = [1, ke, Ve].sort((Re, ze) => Re - ze), Ie = Ae.findIndex((Re) => Re > Be + 1e-5);
        De = Ae[Ie] || 1;
    }
    return De;
  }
  attachObserver() {
    var _e;
    const ke = () => {
      const { container: Be, containerRect: Ne } = this;
      return Math.abs(Ne.width - Be.getBoundingClientRect().width) > 0.1 || Math.abs(Ne.height - Be.getBoundingClientRect().height) > 0.1;
    };
    this.resizeObserver || window.ResizeObserver === void 0 || (this.resizeObserver = new ResizeObserver(() => {
      this.updateTimer || (ke() ? (this.onResize(), this.isMobile && (this.updateTimer = setTimeout(() => {
        ke() && this.onResize(), this.updateTimer = null;
      }, 500))) : this.updateTimer && (clearTimeout(this.updateTimer), this.updateTimer = null));
    })), (_e = this.resizeObserver) === null || _e === void 0 || _e.observe(this.container);
  }
  detachObserver() {
    var _e;
    (_e = this.resizeObserver) === null || _e === void 0 || _e.disconnect();
  }
  attachEvents() {
    const { container: _e } = this;
    _e.addEventListener("click", this.onClick, { passive: !1, capture: !1 }), _e.addEventListener("wheel", this.onWheel, { passive: !1 }), this.pointerTracker = new l(_e, { start: this.onPointerDown, move: this.onPointerMove, end: this.onPointerUp }), document.addEventListener(O, this.onMouseMove);
  }
  detachEvents() {
    var _e;
    const { container: ke } = this;
    ke.removeEventListener("click", this.onClick, { passive: !1, capture: !1 }), ke.removeEventListener("wheel", this.onWheel, { passive: !1 }), (_e = this.pointerTracker) === null || _e === void 0 || _e.stop(), this.pointerTracker = null, document.removeEventListener(O, this.onMouseMove), document.removeEventListener("keydown", this.onKeydown, !0), this.clickTimer && (clearTimeout(this.clickTimer), this.clickTimer = null), this.updateTimer && (clearTimeout(this.updateTimer), this.updateTimer = null);
  }
  animate() {
    this.setTargetForce();
    const _e = this.friction, ke = this.option("maxVelocity");
    for (const Be of v) _e ? (this.velocity[Be] *= 1 - _e, ke && !this.isScaling && (this.velocity[Be] = Math.max(Math.min(this.velocity[Be], ke), -1 * ke)), this.current[Be] += this.velocity[Be]) : this.current[Be] = this.target[Be];
    this.setTransform(), this.setEdgeForce(), !this.isResting || this.isDragging ? this.rAF = requestAnimationFrame(() => this.animate()) : this.stop("current");
  }
  setTargetForce() {
    for (const _e of v) _e === "e" && this.isBouncingX || _e === "f" && this.isBouncingY || (this.velocity[_e] = (1 / (1 - this.friction) - 1) * (this.target[_e] - this.current[_e]));
  }
  checkBounds(_e = 0, ke = 0) {
    const { current: Be } = this, Ne = Be.e + _e, Ve = Be.f + ke, Le = this.getBounds(), { x: De, y: Ae } = Le, Ie = De.min, Re = De.max, ze = Ae.min, je = Ae.max;
    let Fe = 0, He = 0;
    return Ie !== 1 / 0 && Ne < Ie ? Fe = Ie - Ne : Re !== 1 / 0 && Ne > Re && (Fe = Re - Ne), ze !== 1 / 0 && Ve < ze ? He = ze - Ve : je !== 1 / 0 && Ve > je && (He = je - Ve), Math.abs(Fe) < 1e-4 && (Fe = 0), Math.abs(He) < 1e-4 && (He = 0), Object.assign(Object.assign({}, Le), { xDiff: Fe, yDiff: He, inBounds: !Fe && !He });
  }
  clampTargetBounds() {
    const { target: _e } = this, { x: ke, y: Be } = this.getBounds();
    ke.min !== 1 / 0 && (_e.e = Math.max(_e.e, ke.min)), ke.max !== 1 / 0 && (_e.e = Math.min(_e.e, ke.max)), Be.min !== 1 / 0 && (_e.f = Math.max(_e.f, Be.min)), Be.max !== 1 / 0 && (_e.f = Math.min(_e.f, Be.max));
  }
  calculateContentDim(_e = this.current) {
    const { content: ke, contentRect: Be } = this, { fitWidth: Ne, fitHeight: Ve, fullWidth: Le, fullHeight: De } = Be;
    let Ae = Le, Ie = De;
    if (this.option("zoom") || this.angle !== 0) {
      const Re = !(ke instanceof HTMLImageElement) && (window.getComputedStyle(ke).maxWidth === "none" || window.getComputedStyle(ke).maxHeight === "none"), ze = Re ? Le : Ne, je = Re ? De : Ve, Fe = this.getMatrix(_e), He = new DOMPoint(0, 0).matrixTransform(Fe), Ge = new DOMPoint(0 + ze, 0).matrixTransform(Fe), qe = new DOMPoint(0 + ze, 0 + je).matrixTransform(Fe), Xe = new DOMPoint(0, 0 + je).matrixTransform(Fe), Ye = Math.abs(qe.x - He.x), We = Math.abs(qe.y - He.y), Je = Math.abs(Xe.x - Ge.x), ri = Math.abs(Xe.y - Ge.y);
      Ae = Math.max(Ye, Je), Ie = Math.max(We, ri);
    }
    return { contentWidth: Ae, contentHeight: Ie };
  }
  setEdgeForce() {
    if (this.ignoreBounds || this.isDragging || this.panMode === O || this.targetScale < this.scale) return this.isBouncingX = !1, void (this.isBouncingY = !1);
    const { target: _e } = this, { x: ke, y: Be, xDiff: Ne, yDiff: Ve } = this.checkBounds(), Le = this.option("maxVelocity");
    let De = this.velocity.e, Ae = this.velocity.f;
    Ne !== 0 ? (this.isBouncingX = !0, Ne * De <= 0 ? De += 0.14 * Ne : (De = 0.14 * Ne, ke.min !== 1 / 0 && (this.target.e = Math.max(_e.e, ke.min)), ke.max !== 1 / 0 && (this.target.e = Math.min(_e.e, ke.max))), Le && (De = Math.max(Math.min(De, Le), -1 * Le))) : this.isBouncingX = !1, Ve !== 0 ? (this.isBouncingY = !0, Ve * Ae <= 0 ? Ae += 0.14 * Ve : (Ae = 0.14 * Ve, Be.min !== 1 / 0 && (this.target.f = Math.max(_e.f, Be.min)), Be.max !== 1 / 0 && (this.target.f = Math.min(_e.f, Be.max))), Le && (Ae = Math.max(Math.min(Ae, Le), -1 * Le))) : this.isBouncingY = !1, this.isBouncingX && (this.velocity.e = De), this.isBouncingY && (this.velocity.f = Ae);
  }
  enable() {
    const { content: _e } = this, ke = new DOMMatrixReadOnly(window.getComputedStyle(_e).transform);
    for (const Be of v) this.current[Be] = this.target[Be] = ke[Be];
    this.updateMetrics(), this.attachObserver(), this.attachEvents(), this.state = m.Ready, this.emit("ready");
  }
  onClick(_e) {
    var ke;
    _e.type === "click" && _e.detail === 0 && (this.dragOffset.x = 0, this.dragOffset.y = 0), this.isDragging && ((ke = this.pointerTracker) === null || ke === void 0 || ke.clear(), this.trackingPoints = [], this.startDecelAnim());
    const Be = _e.target;
    if (!Be || _e.defaultPrevented) return;
    if (Be.hasAttribute("disabled")) return _e.preventDefault(), void _e.stopPropagation();
    if ((() => {
      const Fe = window.getSelection();
      return Fe && Fe.type === "Range";
    })() && !Be.closest("button")) return;
    const Ne = Be.closest("[data-panzoom-action]"), Ve = Be.closest("[data-panzoom-change]"), Le = Ne || Ve, De = Le && E(Le) ? Le.dataset : null;
    if (De) {
      const Fe = De.panzoomChange, He = De.panzoomAction;
      if ((Fe || He) && _e.preventDefault(), Fe) {
        let Ge = {};
        try {
          Ge = JSON.parse(Fe);
        } catch {
          console && console.warn("The given data was not valid JSON");
        }
        return void this.applyChange(Ge);
      }
      if (He) return void (this[He] && this[He]());
    }
    if (Math.abs(this.dragOffset.x) > 3 || Math.abs(this.dragOffset.y) > 3) return _e.preventDefault(), void _e.stopPropagation();
    if (Be.closest("[data-fancybox]")) return;
    const Ae = this.content.getBoundingClientRect(), Ie = this.dragStart;
    if (Ie.time && !this.canZoomOut() && (Math.abs(Ae.x - Ie.x) > 2 || Math.abs(Ae.y - Ie.y) > 2)) return;
    this.dragStart.time = 0;
    const Re = (Fe) => {
      this.option("zoom", _e) && Fe && typeof Fe == "string" && /(iterateZoom)|(toggle(Zoom|Full|Cover|Max)|(zoomTo(Fit|Cover|Max)))/.test(Fe) && typeof this[Fe] == "function" && (_e.preventDefault(), this[Fe]({ event: _e }));
    }, ze = this.option("click", _e), je = this.option("dblClick", _e);
    je ? (this.clicks++, this.clicks == 1 && (this.clickTimer = setTimeout(() => {
      this.clicks === 1 ? (this.emit("click", _e), !_e.defaultPrevented && ze && Re(ze)) : (this.emit("dblClick", _e), _e.defaultPrevented || Re(je)), this.clicks = 0, this.clickTimer = null;
    }, 350))) : (this.emit("click", _e), !_e.defaultPrevented && ze && Re(ze));
  }
  addTrackingPoint(_e) {
    const ke = this.trackingPoints.filter((Be) => Be.time > Date.now() - 100);
    ke.push(_e), this.trackingPoints = ke;
  }
  onPointerDown(_e, ke, Be) {
    var Ne;
    if (this.option("touch", _e) === !1) return !1;
    this.pwt = 0, this.dragOffset = { x: 0, y: 0, time: 0 }, this.trackingPoints = [];
    const Ve = this.content.getBoundingClientRect();
    if (this.dragStart = { x: Ve.x, y: Ve.y, top: Ve.top, left: Ve.left, time: Date.now() }, this.clickTimer) return !1;
    if (this.panMode === O && this.targetScale > 1) return _e.preventDefault(), _e.stopPropagation(), !1;
    const Le = _e.composedPath()[0];
    if (!Be.length) {
      if (["TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO", "IFRAME"].includes(Le.nodeName) || Le.closest("[contenteditable],[data-selectable],[data-draggable],[data-clickable],[data-panzoom-change],[data-panzoom-action]")) return !1;
      (Ne = window.getSelection()) === null || Ne === void 0 || Ne.removeAllRanges();
    }
    if (_e.type === "mousedown") ["A", "BUTTON"].includes(Le.nodeName) || _e.preventDefault();
    else if (Math.abs(this.velocity.a) > 0.3) return !1;
    return this.target.e = this.current.e, this.target.f = this.current.f, this.stop(), this.isDragging || (this.isDragging = !0, this.addTrackingPoint(ke), this.emit("touchStart", _e)), !0;
  }
  onPointerMove(_e, ke, Be) {
    if (this.option("touch", _e) === !1 || !this.isDragging || ke.length < 2 && this.panOnlyZoomed && t(this.targetScale) <= t(this.minScale) || (this.emit("touchMove", _e), _e.defaultPrevented)) return;
    this.addTrackingPoint(ke[0]);
    const { content: Ne } = this, Ve = h(Be[0], Be[1]), Le = h(ke[0], ke[1]);
    let De = 0, Ae = 0;
    if (ke.length > 1) {
      const We = Ne.getBoundingClientRect();
      De = Ve.clientX - We.left - 0.5 * We.width, Ae = Ve.clientY - We.top - 0.5 * We.height;
    }
    const Ie = c(Be[0], Be[1]), Re = c(ke[0], ke[1]);
    let ze = Ie ? Re / Ie : 1, je = Le.clientX - Ve.clientX, Fe = Le.clientY - Ve.clientY;
    this.dragOffset.x += je, this.dragOffset.y += Fe, this.dragOffset.time = Date.now() - this.dragStart.time;
    let He = t(this.targetScale) === t(this.minScale) && this.option("lockAxis");
    if (He && !this.lockedAxis) if (He === "xy" || He === "y" || _e.type === "touchmove") {
      if (Math.abs(this.dragOffset.x) < 6 && Math.abs(this.dragOffset.y) < 6) return void _e.preventDefault();
      const We = Math.abs(180 * Math.atan2(this.dragOffset.y, this.dragOffset.x) / Math.PI);
      this.lockedAxis = We > 45 && We < 135 ? "y" : "x", this.dragOffset.x = 0, this.dragOffset.y = 0, je = 0, Fe = 0;
    } else this.lockedAxis = He;
    if (i(_e.target, this.content) && (He = "x", this.dragOffset.y = 0), He && He !== "xy" && this.lockedAxis !== He && t(this.targetScale) === t(this.minScale)) return;
    _e.cancelable && _e.preventDefault(), this.container.classList.add(this.cn("isDragging"));
    const Ge = this.checkBounds(je, Fe);
    this.option("rubberband") ? (this.isInfinite !== "x" && (Ge.xDiff > 0 && je < 0 || Ge.xDiff < 0 && je > 0) && (je *= Math.max(0, 0.5 - Math.abs(0.75 / this.contentRect.fitWidth * Ge.xDiff))), this.isInfinite !== "y" && (Ge.yDiff > 0 && Fe < 0 || Ge.yDiff < 0 && Fe > 0) && (Fe *= Math.max(0, 0.5 - Math.abs(0.75 / this.contentRect.fitHeight * Ge.yDiff)))) : (Ge.xDiff && (je = 0), Ge.yDiff && (Fe = 0));
    const qe = this.targetScale, Xe = this.minScale, Ye = this.maxScale;
    qe < 0.5 * Xe && (ze = Math.max(ze, Xe)), qe > 1.5 * Ye && (ze = Math.min(ze, Ye)), this.lockedAxis === "y" && t(qe) === t(Xe) && (je = 0), this.lockedAxis === "x" && t(qe) === t(Xe) && (Fe = 0), this.applyChange({ originX: De, originY: Ae, panX: je, panY: Fe, scale: ze, friction: this.option("dragFriction"), ignoreBounds: !0 });
  }
  onPointerUp(_e, ke, Be) {
    if (Be.length) return this.dragOffset.x = 0, this.dragOffset.y = 0, void (this.trackingPoints = []);
    this.container.classList.remove(this.cn("isDragging")), this.isDragging && (this.addTrackingPoint(ke), this.panOnlyZoomed && this.contentRect.width - this.contentRect.fitWidth < 1 && this.contentRect.height - this.contentRect.fitHeight < 1 && (this.trackingPoints = []), i(_e.target, this.content) && this.lockedAxis === "y" && (this.trackingPoints = []), this.emit("touchEnd", _e), this.isDragging = !1, this.lockedAxis = !1, this.state !== m.Destroy && (_e.defaultPrevented || this.startDecelAnim()));
  }
  startDecelAnim() {
    var _e;
    const ke = this.isScaling;
    this.rAF && (cancelAnimationFrame(this.rAF), this.rAF = null), this.isBouncingX = !1, this.isBouncingY = !1;
    for (const We of v) this.velocity[We] = 0;
    this.target.e = this.current.e, this.target.f = this.current.f, S(this.container, "is-scaling"), S(this.container, "is-animating"), this.isTicking = !1;
    const { trackingPoints: Be } = this, Ne = Be[0], Ve = Be[Be.length - 1];
    let Le = 0, De = 0, Ae = 0;
    Ve && Ne && (Le = Ve.clientX - Ne.clientX, De = Ve.clientY - Ne.clientY, Ae = Ve.time - Ne.time);
    const Ie = ((_e = window.visualViewport) === null || _e === void 0 ? void 0 : _e.scale) || 1;
    Ie !== 1 && (Le *= Ie, De *= Ie);
    let Re = 0, ze = 0, je = 0, Fe = 0, He = this.option("decelFriction");
    const Ge = this.targetScale;
    if (Ae > 0) {
      je = Math.abs(Le) > 3 ? Le / (Ae / 30) : 0, Fe = Math.abs(De) > 3 ? De / (Ae / 30) : 0;
      const We = this.option("maxVelocity");
      We && (je = Math.max(Math.min(je, We), -1 * We), Fe = Math.max(Math.min(Fe, We), -1 * We));
    }
    je && (Re = je / (1 / (1 - He) - 1)), Fe && (ze = Fe / (1 / (1 - He) - 1)), (this.option("lockAxis") === "y" || this.option("lockAxis") === "xy" && this.lockedAxis === "y" && t(Ge) === this.minScale) && (Re = je = 0), (this.option("lockAxis") === "x" || this.option("lockAxis") === "xy" && this.lockedAxis === "x" && t(Ge) === this.minScale) && (ze = Fe = 0);
    const qe = this.dragOffset.x, Xe = this.dragOffset.y, Ye = this.option("dragMinThreshold") || 0;
    Math.abs(qe) < Ye && Math.abs(Xe) < Ye && (Re = ze = 0, je = Fe = 0), (this.option("zoom") && (Ge < this.minScale - 1e-5 || Ge > this.maxScale + 1e-5) || ke && !Re && !ze) && (He = 0.35), this.applyChange({ panX: Re, panY: ze, friction: He }), this.emit("decel", je, Fe, qe, Xe);
  }
  onWheel(_e) {
    var ke = [-_e.deltaX || 0, -_e.deltaY || 0, -_e.detail || 0].reduce(function(Ve, Le) {
      return Math.abs(Le) > Math.abs(Ve) ? Le : Ve;
    });
    const Be = Math.max(-1, Math.min(1, ke));
    if (this.emit("wheel", _e, Be), this.panMode === O || _e.defaultPrevented) return;
    const Ne = this.option("wheel");
    Ne === "pan" ? (_e.preventDefault(), this.panOnlyZoomed && !this.canZoomOut() || this.applyChange({ panX: 2 * -_e.deltaX, panY: 2 * -_e.deltaY, bounce: !1 })) : Ne === "zoom" && this.option("zoom") !== !1 && this.zoomWithWheel(_e);
  }
  onMouseMove(_e) {
    this.panWithMouse(_e);
  }
  onKeydown(_e) {
    _e.key === "Escape" && this.toggleFS();
  }
  onResize() {
    this.updateMetrics(), this.checkBounds().inBounds || this.requestTick();
  }
  setTransform() {
    this.emit("beforeTransform");
    const { current: _e, target: ke, content: Be, contentRect: Ne } = this, Ve = Object.assign({}, C);
    for (const qe of v) {
      const Xe = qe == "e" || qe === "f" ? M : T;
      Ve[qe] = t(_e[qe], Xe), Math.abs(ke[qe] - _e[qe]) < (qe == "e" || qe === "f" ? 0.51 : 1e-3) && (_e[qe] = ke[qe]);
    }
    let { a: Le, b: De, c: Ae, d: Ie, e: Re, f: ze } = Ve, je = `matrix(${Le}, ${De}, ${Ae}, ${Ie}, ${Re}, ${ze})`, Fe = Be.parentElement instanceof HTMLPictureElement ? Be.parentElement : Be;
    if (this.option("transformParent") && (Fe = Fe.parentElement || Fe), Fe.style.transform === je) return;
    Fe.style.transform = je;
    const { contentWidth: He, contentHeight: Ge } = this.calculateContentDim();
    Ne.width = He, Ne.height = Ge, this.emit("afterTransform");
  }
  updateMetrics(_e = !1) {
    var ke;
    if (!this || this.state === m.Destroy || this.isContentLoading) return;
    const Be = Math.max(1, ((ke = window.visualViewport) === null || ke === void 0 ? void 0 : ke.scale) || 1), { container: Ne, content: Ve } = this, Le = Ve instanceof HTMLImageElement, De = Ne.getBoundingClientRect(), Ae = getComputedStyle(this.container);
    let Ie = De.width * Be, Re = De.height * Be;
    const ze = parseFloat(Ae.paddingTop) + parseFloat(Ae.paddingBottom), je = Ie - (parseFloat(Ae.paddingLeft) + parseFloat(Ae.paddingRight)), Fe = Re - ze;
    this.containerRect = { width: Ie, height: Re, innerWidth: je, innerHeight: Fe };
    const He = parseFloat(Ve.dataset.width || "") || ((oi) => {
      let ni = 0;
      return ni = oi instanceof HTMLImageElement ? oi.naturalWidth : oi instanceof SVGElement ? oi.width.baseVal.value : Math.max(oi.offsetWidth, oi.scrollWidth), ni || 0;
    })(Ve), Ge = parseFloat(Ve.dataset.height || "") || ((oi) => {
      let ni = 0;
      return ni = oi instanceof HTMLImageElement ? oi.naturalHeight : oi instanceof SVGElement ? oi.height.baseVal.value : Math.max(oi.offsetHeight, oi.scrollHeight), ni || 0;
    })(Ve);
    let qe = this.option("width", He) || z, Xe = this.option("height", Ge) || z;
    const Ye = qe === z, We = Xe === z;
    typeof qe != "number" && (qe = He), typeof Xe != "number" && (Xe = Ge), Ye && (qe = He * (Xe / Ge)), We && (Xe = Ge / (He / qe));
    let Je = Ve.parentElement instanceof HTMLPictureElement ? Ve.parentElement : Ve;
    this.option("transformParent") && (Je = Je.parentElement || Je);
    const ri = Je.getAttribute("style") || "";
    Je.style.setProperty("transform", "none", "important"), Le && (Je.style.width = "", Je.style.height = ""), Je.offsetHeight;
    const Qe = Ve.getBoundingClientRect();
    let ti = Qe.width * Be, ei = Qe.height * Be, Ze = ti, Ue = ei;
    ti = Math.min(ti, qe), ei = Math.min(ei, Xe), Le ? { width: ti, height: ei } = ((oi, ni, pi, ci) => {
      const fi = pi / oi, hi = ci / ni, ui = Math.min(fi, hi);
      return { width: oi *= ui, height: ni *= ui };
    })(qe, Xe, ti, ei) : (ti = Math.min(ti, qe), ei = Math.min(ei, Xe));
    let Ke = 0.5 * (Ue - ei), ii = 0.5 * (Ze - ti);
    this.contentRect = Object.assign(Object.assign({}, this.contentRect), { top: Qe.top - De.top + Ke, bottom: De.bottom - Qe.bottom + Ke, left: Qe.left - De.left + ii, right: De.right - Qe.right + ii, fitWidth: ti, fitHeight: ei, width: ti, height: ei, fullWidth: qe, fullHeight: Xe }), Je.style.cssText = ri, Le && (Je.style.width = `${ti}px`, Je.style.height = `${ei}px`), this.setTransform(), _e !== !0 && this.emit("refresh"), this.ignoreBounds || (t(this.targetScale) < t(this.minScale) ? this.zoomTo(this.minScale, { friction: 0 }) : this.targetScale > this.maxScale ? this.zoomTo(this.maxScale, { friction: 0 }) : this.state === m.Init || this.checkBounds().inBounds || this.requestTick()), this.updateControls();
  }
  calculateBounds() {
    const { contentWidth: _e, contentHeight: ke } = this.calculateContentDim(this.target), { targetScale: Be, lockedAxis: Ne } = this, { fitWidth: Ve, fitHeight: Le } = this.contentRect;
    let De = 0, Ae = 0, Ie = 0, Re = 0;
    const ze = this.option("infinite");
    if (ze === !0 || Ne && ze === Ne) De = -1 / 0, Ie = 1 / 0, Ae = -1 / 0, Re = 1 / 0;
    else {
      let { containerRect: je, contentRect: Fe } = this, He = t(Ve * Be, M), Ge = t(Le * Be, M), { innerWidth: qe, innerHeight: Xe } = je;
      if (je.width === He && (qe = je.width), je.width === Ge && (Xe = je.height), _e > qe) {
        Ie = 0.5 * (_e - qe), De = -1 * Ie;
        let Ye = 0.5 * (Fe.right - Fe.left);
        De += Ye, Ie += Ye;
      }
      if (Ve > qe && _e < qe && (De -= 0.5 * (Ve - qe), Ie -= 0.5 * (Ve - qe)), ke > Xe) {
        Re = 0.5 * (ke - Xe), Ae = -1 * Re;
        let Ye = 0.5 * (Fe.bottom - Fe.top);
        Ae += Ye, Re += Ye;
      }
      Le > Xe && ke < Xe && (De -= 0.5 * (Le - Xe), Ie -= 0.5 * (Le - Xe));
    }
    return { x: { min: De, max: Ie }, y: { min: Ae, max: Re } };
  }
  getBounds() {
    const _e = this.option("bounds");
    return _e !== z ? _e : this.calculateBounds();
  }
  updateControls() {
    const _e = this, ke = _e.container, { panMode: Be, contentRect: Ne, targetScale: Ve, minScale: Le } = _e;
    let De = Le, Ae = _e.option("click") || !1;
    Ae && (De = _e.getNextScale(Ae));
    let Ie = _e.canZoomIn(), Re = _e.canZoomOut(), ze = Be === A && !!this.option("touch"), je = Re && ze;
    if (ze && (t(Ve) < t(Le) && !this.panOnlyZoomed && (je = !0), (t(Ne.width, 1) > t(Ne.fitWidth, 1) || t(Ne.height, 1) > t(Ne.fitHeight, 1)) && (je = !0)), t(Ne.width * Ve, 1) < t(Ne.fitWidth, 1) && (je = !1), Be === O && (je = !1), o(ke, this.cn("isDraggable"), je), !this.option("zoom")) return;
    let Fe = Ie && t(De) > t(Ve), He = !Fe && !je && Re && t(De) < t(Ve);
    o(ke, this.cn("canZoomIn"), Fe), o(ke, this.cn("canZoomOut"), He);
    for (const Ge of ke.querySelectorAll("[data-panzoom-action]")) {
      let qe = !1, Xe = !1;
      switch (Ge.dataset.panzoomAction) {
        case "zoomIn":
          Ie ? qe = !0 : Xe = !0;
          break;
        case "zoomOut":
          Re ? qe = !0 : Xe = !0;
          break;
        case "toggleZoom":
        case "iterateZoom":
          Ie || Re ? qe = !0 : Xe = !0;
          const Ye = Ge.querySelector("g");
          Ye && (Ye.style.display = Ie ? "" : "none");
      }
      qe ? (Ge.removeAttribute("disabled"), Ge.removeAttribute("tabindex")) : Xe && (Ge.setAttribute("disabled", ""), Ge.setAttribute("tabindex", "-1"));
    }
  }
  panTo({ x: _e = this.target.e, y: ke = this.target.f, scale: Be = this.targetScale, friction: Ne = this.option("friction"), angle: Ve = 0, originX: Le = 0, originY: De = 0, flipX: Ae = !1, flipY: Ie = !1, ignoreBounds: Re = !1 }) {
    this.state !== m.Destroy && this.applyChange({ panX: _e - this.target.e, panY: ke - this.target.f, scale: Be / this.targetScale, angle: Ve, originX: Le, originY: De, friction: Ne, flipX: Ae, flipY: Ie, ignoreBounds: Re });
  }
  applyChange({ panX: _e = 0, panY: ke = 0, scale: Be = 1, angle: Ne = 0, originX: Ve = -this.current.e, originY: Le = -this.current.f, friction: De = this.option("friction"), flipX: Ae = !1, flipY: Ie = !1, ignoreBounds: Re = !1, bounce: ze = this.option("bounce") }) {
    const je = this.state;
    if (je === m.Destroy) return;
    this.rAF && (cancelAnimationFrame(this.rAF), this.rAF = null), this.friction = De || 0, this.ignoreBounds = Re;
    const { current: Fe } = this, He = Fe.e, Ge = Fe.f, qe = this.getMatrix(this.target);
    let Xe = new DOMMatrix().translate(He, Ge).translate(Ve, Le).translate(_e, ke);
    if (this.option("zoom")) {
      if (!Re) {
        const Ye = this.targetScale, We = this.minScale, Je = this.maxScale;
        Ye * Be < We && (Be = We / Ye), Ye * Be > Je && (Be = Je / Ye);
      }
      Xe = Xe.scale(Be);
    }
    Xe = Xe.translate(-Ve, -Le).translate(-He, -Ge).multiply(qe), Ne && (Xe = Xe.rotate(Ne)), Ae && (Xe = Xe.scale(-1, 1)), Ie && (Xe = Xe.scale(1, -1));
    for (const Ye of v) Ye !== "e" && Ye !== "f" && (Xe[Ye] > this.minScale + 1e-5 || Xe[Ye] < this.minScale - 1e-5) ? this.target[Ye] = Xe[Ye] : this.target[Ye] = t(Xe[Ye], M);
    (this.targetScale < this.scale || Math.abs(Be - 1) > 0.1 || this.panMode === O || ze === !1) && !Re && this.clampTargetBounds(), je === m.Init ? this.animate() : this.isResting || (this.state = m.Panning, this.requestTick());
  }
  stop(_e = !1) {
    if (this.state === m.Init || this.state === m.Destroy) return;
    const ke = this.isTicking;
    this.rAF && (cancelAnimationFrame(this.rAF), this.rAF = null), this.isBouncingX = !1, this.isBouncingY = !1;
    for (const Be of v) this.velocity[Be] = 0, _e === "current" ? this.current[Be] = this.target[Be] : _e === "target" && (this.target[Be] = this.current[Be]);
    this.setTransform(), S(this.container, "is-scaling"), S(this.container, "is-animating"), this.isTicking = !1, this.state = m.Ready, ke && (this.emit("endAnimation"), this.updateControls());
  }
  requestTick() {
    this.isTicking || (this.emit("startAnimation"), this.updateControls(), P(this.container, "is-animating"), this.isScaling && P(this.container, "is-scaling")), this.isTicking = !0, this.rAF || (this.rAF = requestAnimationFrame(() => this.animate()));
  }
  panWithMouse(_e, ke = this.option("mouseMoveFriction")) {
    if (this.pmme = _e, this.panMode !== O || !_e || t(this.targetScale) <= t(this.minScale)) return;
    this.emit("mouseMove", _e);
    const { container: Be, containerRect: Ne, contentRect: Ve } = this, Le = Ne.width, De = Ne.height, Ae = Be.getBoundingClientRect(), Ie = (_e.clientX || 0) - Ae.left, Re = (_e.clientY || 0) - Ae.top;
    let { contentWidth: ze, contentHeight: je } = this.calculateContentDim(this.target);
    const Fe = this.option("mouseMoveFactor");
    Fe > 1 && (ze !== Le && (ze *= Fe), je !== De && (je *= Fe));
    let He = 0.5 * (ze - Le) - Ie / Le * 100 / 100 * (ze - Le);
    He += 0.5 * (Ve.right - Ve.left);
    let Ge = 0.5 * (je - De) - Re / De * 100 / 100 * (je - De);
    Ge += 0.5 * (Ve.bottom - Ve.top), this.applyChange({ panX: He - this.target.e, panY: Ge - this.target.f, friction: ke });
  }
  zoomWithWheel(_e) {
    if (this.state === m.Destroy || this.state === m.Init) return;
    const ke = Date.now();
    if (ke - this.pwt < 45) return void _e.preventDefault();
    this.pwt = ke;
    var Be = [-_e.deltaX || 0, -_e.deltaY || 0, -_e.detail || 0].reduce(function(Ie, Re) {
      return Math.abs(Re) > Math.abs(Ie) ? Re : Ie;
    });
    const Ne = Math.max(-1, Math.min(1, Be)), { targetScale: Ve, maxScale: Le, minScale: De } = this;
    let Ae = Ve * (100 + 45 * Ne) / 100;
    t(Ae) < t(De) && t(Ve) <= t(De) ? (this.cwd += Math.abs(Ne), Ae = De) : t(Ae) > t(Le) && t(Ve) >= t(Le) ? (this.cwd += Math.abs(Ne), Ae = Le) : (this.cwd = 0, Ae = Math.max(Math.min(Ae, Le), De)), this.cwd > this.option("wheelLimit") || (_e.preventDefault(), t(Ae) !== t(Ve) && this.zoomTo(Ae, { event: _e }));
  }
  canZoomIn() {
    return this.option("zoom") && (t(this.contentRect.width, 1) < t(this.contentRect.fitWidth, 1) || t(this.targetScale) < t(this.maxScale));
  }
  canZoomOut() {
    return this.option("zoom") && t(this.targetScale) > t(this.minScale);
  }
  zoomIn(_e = 1.25, ke) {
    this.zoomTo(this.targetScale * _e, ke);
  }
  zoomOut(_e = 0.8, ke) {
    this.zoomTo(this.targetScale * _e, ke);
  }
  zoomToFit(_e) {
    this.zoomTo("fit", _e);
  }
  zoomToCover(_e) {
    this.zoomTo("cover", _e);
  }
  zoomToFull(_e) {
    this.zoomTo("full", _e);
  }
  zoomToMax(_e) {
    this.zoomTo("max", _e);
  }
  toggleZoom(_e) {
    this.zoomTo(this.getNextScale("toggleZoom"), _e);
  }
  toggleMax(_e) {
    this.zoomTo(this.getNextScale("toggleMax"), _e);
  }
  toggleCover(_e) {
    this.zoomTo(this.getNextScale("toggleCover"), _e);
  }
  iterateZoom(_e) {
    this.zoomTo("next", _e);
  }
  zoomTo(_e = 1, { friction: ke = z, originX: Be = z, originY: Ne = z, event: Ve } = {}) {
    if (this.isContentLoading || this.state === m.Destroy) return;
    const { targetScale: Le, fullScale: De, maxScale: Ae, coverScale: Ie } = this;
    if (this.stop(), this.panMode === O && (Ve = this.pmme || Ve), Ve || Be === z || Ne === z) {
      const ze = this.content.getBoundingClientRect(), je = this.container.getBoundingClientRect(), Fe = Ve ? Ve.clientX : je.left + 0.5 * je.width, He = Ve ? Ve.clientY : je.top + 0.5 * je.height;
      Be = Fe - ze.left - 0.5 * ze.width, Ne = He - ze.top - 0.5 * ze.height;
    }
    let Re = 1;
    typeof _e == "number" ? Re = _e : _e === "full" ? Re = De : _e === "cover" ? Re = Ie : _e === "max" ? Re = Ae : _e === "fit" ? Re = 1 : _e === "next" && (Re = this.getNextScale("iterateZoom")), Re = Re / Le || 1, ke = ke === z ? Re > 1 ? 0.15 : 0.25 : ke, this.applyChange({ scale: Re, originX: Be, originY: Ne, friction: ke }), Ve && this.panMode === O && this.panWithMouse(Ve, ke);
  }
  rotateCCW() {
    this.applyChange({ angle: -90 });
  }
  rotateCW() {
    this.applyChange({ angle: 90 });
  }
  flipX() {
    this.applyChange({ flipX: !0 });
  }
  flipY() {
    this.applyChange({ flipY: !0 });
  }
  fitX() {
    this.stop("target");
    const { containerRect: _e, contentRect: ke, target: Be } = this;
    this.applyChange({ panX: 0.5 * _e.width - (ke.left + 0.5 * ke.fitWidth) - Be.e, panY: 0.5 * _e.height - (ke.top + 0.5 * ke.fitHeight) - Be.f, scale: _e.width / ke.fitWidth / this.targetScale, originX: 0, originY: 0, ignoreBounds: !0 });
  }
  fitY() {
    this.stop("target");
    const { containerRect: _e, contentRect: ke, target: Be } = this;
    this.applyChange({ panX: 0.5 * _e.width - (ke.left + 0.5 * ke.fitWidth) - Be.e, panY: 0.5 * _e.innerHeight - (ke.top + 0.5 * ke.fitHeight) - Be.f, scale: _e.height / ke.fitHeight / this.targetScale, originX: 0, originY: 0, ignoreBounds: !0 });
  }
  toggleFS() {
    const { container: _e } = this, ke = this.cn("inFullscreen"), Be = this.cn("htmlHasFullscreen");
    _e.classList.toggle(ke);
    const Ne = _e.classList.contains(ke);
    Ne ? (document.documentElement.classList.add(Be), document.addEventListener("keydown", this.onKeydown, !0)) : (document.documentElement.classList.remove(Be), document.removeEventListener("keydown", this.onKeydown, !0)), this.updateMetrics(), this.emit(Ne ? "enterFS" : "exitFS");
  }
  getMatrix(_e = this.current) {
    const { a: ke, b: Be, c: Ne, d: Ve, e: Le, f: De } = _e;
    return new DOMMatrix([ke, Be, Ne, Ve, Le, De]);
  }
  reset(_e) {
    if (this.state !== m.Init && this.state !== m.Destroy) {
      this.stop("current");
      for (const ke of v) this.target[ke] = C[ke];
      this.target.a = this.minScale, this.target.d = this.minScale, this.clampTargetBounds(), this.isResting || (this.friction = _e === void 0 ? this.option("friction") : _e, this.state = m.Panning, this.requestTick());
    }
  }
  destroy() {
    this.stop(), this.state = m.Destroy, this.detachEvents(), this.detachObserver();
    const { container: _e, content: ke } = this, Be = this.option("classes") || {};
    for (const Ne of Object.values(Be)) _e.classList.remove(Ne + "");
    ke && (ke.removeEventListener("load", this.onLoad), ke.removeEventListener("error", this.onError)), this.detachPlugins();
  }
}
Object.defineProperty(I, "defaults", { enumerable: !0, configurable: !0, writable: !0, value: y }), Object.defineProperty(I, "Plugins", { enumerable: !0, configurable: !0, writable: !0, value: {} });
const D = function($e, _e) {
  let ke = !0;
  return (...Be) => {
    ke && (ke = !1, $e(...Be), setTimeout(() => {
      ke = !0;
    }, _e));
  };
}, F = ($e, _e) => {
  let ke = [];
  return $e.childNodes.forEach((Be) => {
    Be.nodeType !== Node.ELEMENT_NODE || _e && !Be.matches(_e) || ke.push(Be);
  }), ke;
}, j = { viewport: null, track: null, enabled: !0, slides: [], axis: "x", transition: "fade", preload: 1, slidesPerPage: "auto", initialPage: 0, friction: 0.12, Panzoom: { decelFriction: 0.12 }, center: !0, infinite: !0, fill: !0, dragFree: !1, adaptiveHeight: !1, direction: "ltr", classes: { container: "f-carousel", viewport: "f-carousel__viewport", track: "f-carousel__track", slide: "f-carousel__slide", isLTR: "is-ltr", isRTL: "is-rtl", isHorizontal: "is-horizontal", isVertical: "is-vertical", inTransition: "in-transition", isSelected: "is-selected" }, l10n: { NEXT: "Next slide", PREV: "Previous slide", GOTO: "Go to slide #%d" } };
var B;
(function($e) {
  $e[$e.Init = 0] = "Init", $e[$e.Ready = 1] = "Ready", $e[$e.Destroy = 2] = "Destroy";
})(B || (B = {}));
const H = ($e) => {
  if (typeof $e == "string" || $e instanceof HTMLElement) $e = { html: $e };
  else {
    const _e = $e.thumb;
    _e !== void 0 && (typeof _e == "string" && ($e.thumbSrc = _e), _e instanceof HTMLImageElement && ($e.thumbEl = _e, $e.thumbElSrc = _e.src, $e.thumbSrc = _e.src), delete $e.thumb);
  }
  return Object.assign({ html: "", el: null, isDom: !1, class: "", customClass: "", index: -1, dim: 0, gap: 0, pos: 0, transition: !1 }, $e);
}, N = ($e = {}) => Object.assign({ index: -1, slides: [], dim: 0, pos: -1 }, $e);
class _ extends f {
  constructor(_e, ke) {
    super(ke), Object.defineProperty(this, "instance", { enumerable: !0, configurable: !0, writable: !0, value: _e });
  }
  attach() {
  }
  detach() {
  }
}
const $ = { classes: { list: "f-carousel__dots", isDynamic: "is-dynamic", hasDots: "has-dots", dot: "f-carousel__dot", isBeforePrev: "is-before-prev", isPrev: "is-prev", isCurrent: "is-current", isNext: "is-next", isAfterNext: "is-after-next" }, dotTpl: '<button type="button" data-carousel-page="%i" aria-label="{{GOTO}}"><span class="f-carousel__dot" aria-hidden="true"></span></button>', dynamicFrom: 11, maxCount: 1 / 0, minCount: 2 };
class W extends _ {
  constructor() {
    super(...arguments), Object.defineProperty(this, "isDynamic", { enumerable: !0, configurable: !0, writable: !0, value: !1 }), Object.defineProperty(this, "list", { enumerable: !0, configurable: !0, writable: !0, value: null });
  }
  onRefresh() {
    this.refresh();
  }
  build() {
    let _e = this.list;
    if (!_e) {
      _e = document.createElement("ul"), P(_e, this.cn("list")), _e.setAttribute("role", "tablist");
      const ke = this.instance.container;
      ke.appendChild(_e), P(ke, this.cn("hasDots")), this.list = _e;
    }
    return _e;
  }
  refresh() {
    var _e;
    const ke = this.instance.pages.length, Be = Math.min(2, this.option("minCount")), Ne = Math.max(2e3, this.option("maxCount")), Ve = this.option("dynamicFrom");
    if (ke < Be || ke > Ne) return void this.cleanup();
    const Le = typeof Ve == "number" && ke > 5 && ke >= Ve, De = !this.list || this.isDynamic !== Le || this.list.children.length !== ke;
    De && this.cleanup();
    const Ae = this.build();
    if (o(Ae, this.cn("isDynamic"), !!Le), De) for (let ze = 0; ze < ke; ze++) Ae.append(this.createItem(ze));
    let Ie, Re = 0;
    for (const ze of [...Ae.children]) {
      const je = Re === this.instance.page;
      je && (Ie = ze), o(ze, this.cn("isCurrent"), je), (_e = ze.children[0]) === null || _e === void 0 || _e.setAttribute("aria-selected", je ? "true" : "false");
      for (const Fe of ["isBeforePrev", "isPrev", "isNext", "isAfterNext"]) S(ze, this.cn(Fe));
      Re++;
    }
    if (Ie = Ie || Ae.firstChild, Le && Ie) {
      const ze = Ie.previousElementSibling, je = ze && ze.previousElementSibling;
      P(ze, this.cn("isPrev")), P(je, this.cn("isBeforePrev"));
      const Fe = Ie.nextElementSibling, He = Fe && Fe.nextElementSibling;
      P(Fe, this.cn("isNext")), P(He, this.cn("isAfterNext"));
    }
    this.isDynamic = Le;
  }
  createItem(_e = 0) {
    var ke;
    const Be = document.createElement("li");
    Be.setAttribute("role", "presentation");
    const Ne = n(this.instance.localize(this.option("dotTpl"), [["%d", _e + 1]]).replace(/\%i/g, _e + ""));
    return Be.appendChild(Ne), (ke = Be.children[0]) === null || ke === void 0 || ke.setAttribute("role", "tab"), Be;
  }
  cleanup() {
    this.list && (this.list.remove(), this.list = null), this.isDynamic = !1, S(this.instance.container, this.cn("hasDots"));
  }
  attach() {
    this.instance.on(["refresh", "change"], this.onRefresh);
  }
  detach() {
    this.instance.off(["refresh", "change"], this.onRefresh), this.cleanup();
  }
}
Object.defineProperty(W, "defaults", { enumerable: !0, configurable: !0, writable: !0, value: $ });
const X = "disabled", q = "next", Y = "prev";
class V extends _ {
  constructor() {
    super(...arguments), Object.defineProperty(this, "container", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "prev", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "next", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "isDom", { enumerable: !0, configurable: !0, writable: !0, value: !1 });
  }
  onRefresh() {
    const _e = this.instance, ke = _e.pages.length, Be = _e.page;
    if (ke < 2) return void this.cleanup();
    this.build();
    let Ne = this.prev, Ve = this.next;
    Ne && Ve && (Ne.removeAttribute(X), Ve.removeAttribute(X), _e.isInfinite || (Be <= 0 && Ne.setAttribute(X, ""), Be >= ke - 1 && Ve.setAttribute(X, "")));
  }
  addBtn(_e) {
    var ke;
    const Be = this.instance, Ne = document.createElement("button");
    Ne.setAttribute("tabindex", "0"), Ne.setAttribute("title", Be.localize(`{{${_e.toUpperCase()}}}`)), P(Ne, this.cn("button") + " " + this.cn(_e === q ? "isNext" : "isPrev"));
    const Ve = Be.isRTL ? _e === q ? Y : q : _e;
    var Le;
    return Ne.innerHTML = Be.localize(this.option(`${Ve}Tpl`)), Ne.dataset[`carousel${Le = _e, Le ? Le.match("^[a-z]") ? Le.charAt(0).toUpperCase() + Le.substring(1) : Le : ""}`] = "true", (ke = this.container) === null || ke === void 0 || ke.appendChild(Ne), Ne;
  }
  build() {
    const _e = this.instance.container, ke = this.cn("container");
    let { container: Be, prev: Ne, next: Ve } = this;
    Be || (Be = _e.querySelector("." + ke), this.isDom = !!Be), Be || (Be = document.createElement("div"), P(Be, ke), _e.appendChild(Be)), this.container = Be, Ve || (Ve = Be.querySelector("[data-carousel-next]")), Ve || (Ve = this.addBtn(q)), this.next = Ve, Ne || (Ne = Be.querySelector("[data-carousel-prev]")), Ne || (Ne = this.addBtn(Y)), this.prev = Ne;
  }
  cleanup() {
    this.isDom || (this.prev && this.prev.remove(), this.next && this.next.remove(), this.container && this.container.remove()), this.prev = null, this.next = null, this.container = null, this.isDom = !1;
  }
  attach() {
    this.instance.on(["refresh", "change"], this.onRefresh);
  }
  detach() {
    this.instance.off(["refresh", "change"], this.onRefresh), this.cleanup();
  }
}
Object.defineProperty(V, "defaults", { enumerable: !0, configurable: !0, writable: !0, value: { classes: { container: "f-carousel__nav", button: "f-button", isNext: "is-next", isPrev: "is-prev" }, nextTpl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M9 3l9 9-9 9"/></svg>', prevTpl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M15 3l-9 9 9 9"/></svg>' } });
class Z extends _ {
  constructor() {
    super(...arguments), Object.defineProperty(this, "selectedIndex", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "target", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "nav", { enumerable: !0, configurable: !0, writable: !0, value: null });
  }
  addAsTargetFor(_e) {
    this.target = this.instance, this.nav = _e, this.attachEvents();
  }
  addAsNavFor(_e) {
    this.nav = this.instance, this.target = _e, this.attachEvents();
  }
  attachEvents() {
    const { nav: _e, target: ke } = this;
    _e && ke && (_e.options.initialSlide = ke.options.initialPage, _e.state === B.Ready ? this.onNavReady(_e) : _e.on("ready", this.onNavReady), ke.state === B.Ready ? this.onTargetReady(ke) : ke.on("ready", this.onTargetReady));
  }
  onNavReady(_e) {
    _e.on("createSlide", this.onNavCreateSlide), _e.on("Panzoom.click", this.onNavClick), _e.on("Panzoom.touchEnd", this.onNavTouch), this.onTargetChange();
  }
  onTargetReady(_e) {
    _e.on("change", this.onTargetChange), _e.on("Panzoom.refresh", this.onTargetChange), this.onTargetChange();
  }
  onNavClick(_e, ke, Be) {
    this.onNavTouch(_e, _e.panzoom, Be);
  }
  onNavTouch(_e, ke, Be) {
    var Ne, Ve;
    if (Math.abs(ke.dragOffset.x) > 3 || Math.abs(ke.dragOffset.y) > 3) return;
    const Le = Be.target, { nav: De, target: Ae } = this;
    if (!De || !Ae || !Le) return;
    const Ie = Le.closest("[data-index]");
    if (Be.stopPropagation(), Be.preventDefault(), !Ie) return;
    const Re = parseInt(Ie.dataset.index || "", 10) || 0, ze = Ae.getPageForSlide(Re), je = De.getPageForSlide(Re);
    De.slideTo(je), Ae.slideTo(ze, { friction: ((Ve = (Ne = this.nav) === null || Ne === void 0 ? void 0 : Ne.plugins) === null || Ve === void 0 ? void 0 : Ve.Sync.option("friction")) || 0 }), this.markSelectedSlide(Re);
  }
  onNavCreateSlide(_e, ke) {
    ke.index === this.selectedIndex && this.markSelectedSlide(ke.index);
  }
  onTargetChange() {
    var _e, ke;
    const { target: Be, nav: Ne } = this;
    if (!Be || !Ne || Ne.state !== B.Ready || Be.state !== B.Ready) return;
    const Ve = (ke = (_e = Be.pages[Be.page]) === null || _e === void 0 ? void 0 : _e.slides[0]) === null || ke === void 0 ? void 0 : ke.index, Le = Ne.getPageForSlide(Ve);
    this.markSelectedSlide(Ve), Ne.slideTo(Le, Ne.prevPage === null && Be.prevPage === null ? { friction: 0 } : void 0);
  }
  markSelectedSlide(_e) {
    const ke = this.nav;
    ke && ke.state === B.Ready && (this.selectedIndex = _e, [...ke.slides].map((Be) => {
      Be.el && Be.el.classList[Be.index === _e ? "add" : "remove"]("is-nav-selected");
    }));
  }
  attach() {
    const _e = this;
    let ke = _e.options.target, Be = _e.options.nav;
    ke ? _e.addAsNavFor(ke) : Be && _e.addAsTargetFor(Be);
  }
  detach() {
    const _e = this, ke = _e.nav, Be = _e.target;
    ke && (ke.off("ready", _e.onNavReady), ke.off("createSlide", _e.onNavCreateSlide), ke.off("Panzoom.click", _e.onNavClick), ke.off("Panzoom.touchEnd", _e.onNavTouch)), _e.nav = null, Be && (Be.off("ready", _e.onTargetReady), Be.off("refresh", _e.onTargetChange), Be.off("change", _e.onTargetChange)), _e.target = null;
  }
}
Object.defineProperty(Z, "defaults", { enumerable: !0, configurable: !0, writable: !0, value: { friction: 0.35 } });
const U = { Navigation: V, Dots: W, Sync: Z }, G = "animationend", K = "isSelected", J = "slide";
class Q extends g {
  get axis() {
    return this.isHorizontal ? "e" : "f";
  }
  get isEnabled() {
    return this.state === B.Ready;
  }
  get isInfinite() {
    let _e = !1;
    const { contentDim: ke, viewportDim: Be, pages: Ne, slides: Ve } = this, Le = Ve[0];
    return Ne.length >= 2 && Le && ke + Le.dim >= Be && (_e = this.option("infinite")), _e;
  }
  get isRTL() {
    return this.option("direction") === "rtl";
  }
  get isHorizontal() {
    return this.option("axis") === "x";
  }
  constructor(_e, ke = {}, Be = {}) {
    if (super(), Object.defineProperty(this, "bp", { enumerable: !0, configurable: !0, writable: !0, value: "" }), Object.defineProperty(this, "lp", { enumerable: !0, configurable: !0, writable: !0, value: 0 }), Object.defineProperty(this, "userOptions", { enumerable: !0, configurable: !0, writable: !0, value: {} }), Object.defineProperty(this, "userPlugins", { enumerable: !0, configurable: !0, writable: !0, value: {} }), Object.defineProperty(this, "state", { enumerable: !0, configurable: !0, writable: !0, value: B.Init }), Object.defineProperty(this, "page", { enumerable: !0, configurable: !0, writable: !0, value: 0 }), Object.defineProperty(this, "prevPage", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "container", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), Object.defineProperty(this, "viewport", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "track", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "slides", { enumerable: !0, configurable: !0, writable: !0, value: [] }), Object.defineProperty(this, "pages", { enumerable: !0, configurable: !0, writable: !0, value: [] }), Object.defineProperty(this, "panzoom", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "inTransition", { enumerable: !0, configurable: !0, writable: !0, value: /* @__PURE__ */ new Set() }), Object.defineProperty(this, "contentDim", { enumerable: !0, configurable: !0, writable: !0, value: 0 }), Object.defineProperty(this, "viewportDim", { enumerable: !0, configurable: !0, writable: !0, value: 0 }), typeof _e == "string" && (_e = document.querySelector(_e)), !_e || !E(_e)) throw new Error("No Element found");
    this.container = _e, this.slideNext = D(this.slideNext.bind(this), 150), this.slidePrev = D(this.slidePrev.bind(this), 150), this.userOptions = ke, this.userPlugins = Be, queueMicrotask(() => {
      this.processOptions();
    });
  }
  processOptions() {
    var _e, ke;
    const Be = u({}, Q.defaults, this.userOptions);
    let Ne = "";
    const Ve = Be.breakpoints;
    if (Ve && d(Ve)) for (const [Le, De] of Object.entries(Ve)) window.matchMedia(Le).matches && d(De) && (Ne += Le, u(Be, De));
    Ne === this.bp && this.state !== B.Init || (this.bp = Ne, this.state === B.Ready && (Be.initialSlide = ((ke = (_e = this.pages[this.page]) === null || _e === void 0 ? void 0 : _e.slides[0]) === null || ke === void 0 ? void 0 : ke.index) || 0), this.state !== B.Init && this.destroy(), super.setOptions(Be), this.option("enabled") === !1 ? this.attachEvents() : setTimeout(() => {
      this.init();
    }, 0));
  }
  init() {
    this.state = B.Init, this.emit("init"), this.attachPlugins(Object.assign(Object.assign({}, Q.Plugins), this.userPlugins)), this.emit("attachPlugins"), this.initLayout(), this.initSlides(), this.updateMetrics(), this.setInitialPosition(), this.initPanzoom(), this.attachEvents(), this.state = B.Ready, this.emit("ready");
  }
  initLayout() {
    const { container: _e } = this, ke = this.option("classes");
    P(_e, this.cn("container")), o(_e, ke.isLTR, !this.isRTL), o(_e, ke.isRTL, this.isRTL), o(_e, ke.isVertical, !this.isHorizontal), o(_e, ke.isHorizontal, this.isHorizontal);
    let Be = this.option("viewport") || _e.querySelector(`.${ke.viewport}`);
    Be || (Be = document.createElement("div"), P(Be, ke.viewport), Be.append(...F(_e, `.${ke.slide}`)), _e.prepend(Be)), Be.addEventListener("scroll", this.onScroll);
    let Ne = this.option("track") || _e.querySelector(`.${ke.track}`);
    Ne || (Ne = document.createElement("div"), P(Ne, ke.track), Ne.append(...Array.from(Be.childNodes))), Ne.setAttribute("aria-live", "polite"), Be.contains(Ne) || Be.prepend(Ne), this.viewport = Be, this.track = Ne, this.emit("initLayout");
  }
  initSlides() {
    const { track: _e } = this;
    if (!_e) return;
    const ke = [...this.slides], Be = [];
    [...F(_e, `.${this.cn(J)}`)].forEach((Ne) => {
      if (E(Ne)) {
        const Ve = H({ el: Ne, isDom: !0, index: this.slides.length });
        Be.push(Ve);
      }
    });
    for (let Ne of [...this.option("slides", []) || [], ...ke]) Be.push(H(Ne));
    this.slides = Be;
    for (let Ne = 0; Ne < this.slides.length; Ne++) this.slides[Ne].index = Ne;
    for (const Ne of Be) this.emit("beforeInitSlide", Ne, Ne.index), this.emit("initSlide", Ne, Ne.index);
    this.emit("initSlides");
  }
  setInitialPage() {
    const _e = this.option("initialSlide");
    this.page = typeof _e == "number" ? this.getPageForSlide(_e) : parseInt(this.option("initialPage", 0) + "", 10) || 0;
  }
  setInitialPosition() {
    const { track: _e, pages: ke, isHorizontal: Be } = this;
    if (!_e || !ke.length) return;
    let Ne = this.page;
    ke[Ne] || (this.page = Ne = 0);
    const Ve = (ke[Ne].pos || 0) * (this.isRTL && Be ? 1 : -1), Le = Be ? `${Ve}px` : "0", De = Be ? "0" : `${Ve}px`;
    _e.style.transform = `translate3d(${Le}, ${De}, 0) scale(1)`, this.option("adaptiveHeight") && this.setViewportHeight();
  }
  initPanzoom() {
    this.panzoom && (this.panzoom.destroy(), this.panzoom = null);
    const _e = this.option("Panzoom") || {};
    this.panzoom = new I(this.viewport, u({}, { content: this.track, zoom: !1, panOnlyZoomed: !1, lockAxis: this.isHorizontal ? "x" : "y", infinite: this.isInfinite, click: !1, dblClick: !1, touch: (ke) => !(this.pages.length < 2 && !ke.options.infinite), bounds: () => this.getBounds(), maxVelocity: (ke) => Math.abs(ke.target[this.axis] - ke.current[this.axis]) < 2 * this.viewportDim ? 100 : 0 }, _e)), this.panzoom.on("*", (ke, Be, ...Ne) => {
      this.emit(`Panzoom.${Be}`, ke, ...Ne);
    }), this.panzoom.on("decel", this.onDecel), this.panzoom.on("refresh", this.onRefresh), this.panzoom.on("beforeTransform", this.onBeforeTransform), this.panzoom.on("endAnimation", this.onEndAnimation);
  }
  attachEvents() {
    const _e = this.container;
    _e && (_e.addEventListener("click", this.onClick, { passive: !1, capture: !1 }), _e.addEventListener("slideTo", this.onSlideTo)), window.addEventListener("resize", this.onResize);
  }
  createPages() {
    let _e = [];
    const { contentDim: ke, viewportDim: Be } = this;
    let Ne = this.option("slidesPerPage");
    Ne = (Ne === "auto" || ke <= Be) && this.option("fill") !== !1 ? 1 / 0 : parseFloat(Ne + "");
    let Ve = 0, Le = 0, De = 0;
    for (const Ae of this.slides) (!_e.length || Le + Ae.dim - Be > 0.05 || De >= Ne) && (_e.push(N()), Ve = _e.length - 1, Le = 0, De = 0), _e[Ve].slides.push(Ae), Le += Ae.dim + Ae.gap, De++;
    return _e;
  }
  processPages() {
    const _e = this.pages, { contentDim: ke, viewportDim: Be, isInfinite: Ne } = this, Ve = this.option("center"), Le = this.option("fill"), De = Le && Ve && ke > Be && !Ne;
    if (_e.forEach((Re, ze) => {
      var je;
      Re.index = ze, Re.pos = ((je = Re.slides[0]) === null || je === void 0 ? void 0 : je.pos) || 0, Re.dim = 0;
      for (const [Fe, He] of Re.slides.entries()) Re.dim += He.dim, Fe < Re.slides.length - 1 && (Re.dim += He.gap);
      De && Re.pos + 0.5 * Re.dim < 0.5 * Be ? Re.pos = 0 : De && Re.pos + 0.5 * Re.dim >= ke - 0.5 * Be ? Re.pos = ke - Be : Ve && (Re.pos += -0.5 * (Be - Re.dim));
    }), _e.forEach((Re) => {
      Le && !Ne && ke > Be && (Re.pos = Math.max(Re.pos, 0), Re.pos = Math.min(Re.pos, ke - Be)), Re.pos = t(Re.pos, 1e3), Re.dim = t(Re.dim, 1e3), Math.abs(Re.pos) <= 0.1 && (Re.pos = 0);
    }), Ne) return _e;
    const Ae = [];
    let Ie;
    return _e.forEach((Re) => {
      const ze = Object.assign({}, Re);
      Ie && ze.pos === Ie.pos ? (Ie.dim += ze.dim, Ie.slides = [...Ie.slides, ...ze.slides]) : (ze.index = Ae.length, Ie = ze, Ae.push(ze));
    }), Ae;
  }
  getPageFromIndex(_e = 0) {
    const ke = this.pages.length;
    let Be;
    return _e = parseInt((_e || 0).toString()) || 0, Be = this.isInfinite ? (_e % ke + ke) % ke : Math.max(Math.min(_e, ke - 1), 0), Be;
  }
  getSlideMetrics(_e) {
    var ke, Be;
    const Ne = this.isHorizontal ? "width" : "height";
    let Ve = 0, Le = 0, De = _e.el;
    const Ae = !(!De || De.parentNode);
    if (De ? Ve = parseFloat(De.dataset[Ne] || "") || 0 : (De = document.createElement("div"), De.style.visibility = "hidden", (this.track || document.body).prepend(De)), P(De, this.cn(J) + " " + _e.class + " " + _e.customClass), Ve) De.style[Ne] = `${Ve}px`, De.style[Ne === "width" ? "height" : "width"] = "";
    else {
      Ae && (this.track || document.body).prepend(De), Ve = De.getBoundingClientRect()[Ne] * Math.max(1, ((ke = window.visualViewport) === null || ke === void 0 ? void 0 : ke.scale) || 1);
      let Re = De[this.isHorizontal ? "offsetWidth" : "offsetHeight"];
      Re - 1 > Ve && (Ve = Re);
    }
    const Ie = getComputedStyle(De);
    return Ie.boxSizing === "content-box" && (this.isHorizontal ? (Ve += parseFloat(Ie.paddingLeft) || 0, Ve += parseFloat(Ie.paddingRight) || 0) : (Ve += parseFloat(Ie.paddingTop) || 0, Ve += parseFloat(Ie.paddingBottom) || 0)), Le = parseFloat(Ie[this.isHorizontal ? "marginRight" : "marginBottom"]) || 0, Ae ? (Be = De.parentElement) === null || Be === void 0 || Be.removeChild(De) : _e.el || De.remove(), { dim: t(Ve, 1e3), gap: t(Le, 1e3) };
  }
  getBounds() {
    const { isInfinite: _e, isRTL: ke, isHorizontal: Be, pages: Ne } = this;
    let Ve = { min: 0, max: 0 };
    if (_e) Ve = { min: -1 / 0, max: 1 / 0 };
    else if (Ne.length) {
      const Le = Ne[0].pos, De = Ne[Ne.length - 1].pos;
      Ve = ke && Be ? { min: Le, max: De } : { min: -1 * De, max: -1 * Le };
    }
    return { x: Be ? Ve : { min: 0, max: 0 }, y: Be ? { min: 0, max: 0 } : Ve };
  }
  repositionSlides() {
    let _e, { isHorizontal: ke, isRTL: Be, isInfinite: Ne, viewport: Ve, viewportDim: Le, contentDim: De, page: Ae, pages: Ie, slides: Re, panzoom: ze } = this, je = 0, Fe = 0, He = 0, Ge = 0;
    ze ? Ge = -1 * ze.current[this.axis] : Ie[Ae] && (Ge = Ie[Ae].pos || 0), _e = ke ? Be ? "right" : "left" : "top", Be && ke && (Ge *= -1);
    for (const We of Re) {
      const Je = We.el;
      Je ? (_e === "top" ? (Je.style.right = "", Je.style.left = "") : Je.style.top = "", We.index !== je ? Je.style[_e] = Fe === 0 ? "" : `${t(Fe, 1e3)}px` : Je.style[_e] = "", He += We.dim + We.gap, je++) : Fe += We.dim + We.gap;
    }
    if (Ne && He && Ve) {
      let We = getComputedStyle(Ve), Je = "padding", ri = ke ? "Right" : "Bottom", Qe = parseFloat(We[Je + (ke ? "Left" : "Top")]);
      Ge -= Qe, Le += Qe, Le += parseFloat(We[Je + ri]);
      for (const ti of Re) ti.el && (t(ti.pos) < t(Le) && t(ti.pos + ti.dim + ti.gap) < t(Ge) && t(Ge) > t(De - Le) && (ti.el.style[_e] = `${t(Fe + He, 1e3)}px`), t(ti.pos + ti.gap) >= t(De - Le) && t(ti.pos) > t(Ge + Le) && t(Ge) < t(Le) && (ti.el.style[_e] = `-${t(He, 1e3)}px`));
    }
    let qe, Xe, Ye = [...this.inTransition];
    if (Ye.length > 1 && (qe = Ie[Ye[0]], Xe = Ie[Ye[1]]), qe && Xe) {
      let We = 0;
      for (const Je of Re) Je.el ? this.inTransition.has(Je.index) && qe.slides.indexOf(Je) < 0 && (Je.el.style[_e] = `${t(We + (qe.pos - Xe.pos), 1e3)}px`) : We += Je.dim + Je.gap;
    }
  }
  createSlideEl(_e) {
    const { track: ke, slides: Be } = this;
    if (!ke || !_e || _e.el && _e.el.parentNode) return;
    const Ne = _e.el || document.createElement("div");
    P(Ne, this.cn(J)), P(Ne, _e.class), P(Ne, _e.customClass);
    const Ve = _e.html;
    Ve && (Ve instanceof HTMLElement ? Ne.appendChild(Ve) : Ne.innerHTML = _e.html + "");
    const Le = [];
    Be.forEach((Re, ze) => {
      Re.el && Le.push(ze);
    });
    const De = _e.index;
    let Ae = null;
    Le.length && (Ae = Be[Le.reduce((Re, ze) => Math.abs(ze - De) < Math.abs(Re - De) ? ze : Re)]);
    const Ie = Ae && Ae.el && Ae.el.parentNode ? Ae.index < _e.index ? Ae.el.nextSibling : Ae.el : null;
    ke.insertBefore(Ne, ke.contains(Ie) ? Ie : null), _e.el = Ne, this.emit("createSlide", _e);
  }
  removeSlideEl(_e, ke = !1) {
    const Be = _e == null ? void 0 : _e.el;
    if (!Be || !Be.parentNode) return;
    const Ne = this.cn(K);
    if (Be.classList.contains(Ne) && (S(Be, Ne), this.emit("unselectSlide", _e)), _e.isDom && !ke) return Be.removeAttribute("aria-hidden"), Be.removeAttribute("data-index"), void (Be.style.left = "");
    this.emit("removeSlide", _e);
    const Ve = new CustomEvent(G);
    Be.dispatchEvent(Ve), _e.el && (_e.el.remove(), _e.el = null);
  }
  transitionTo(_e = 0, ke = this.option("transition")) {
    var Be, Ne, Ve, Le;
    if (!ke) return !1;
    const De = this.page, { pages: Ae, panzoom: Ie } = this;
    _e = parseInt((_e || 0).toString()) || 0;
    const Re = this.getPageFromIndex(_e);
    if (!Ie || !Ae[Re] || Ae.length < 2 || Math.abs((((Ne = (Be = Ae[De]) === null || Be === void 0 ? void 0 : Be.slides[0]) === null || Ne === void 0 ? void 0 : Ne.dim) || 0) - this.viewportDim) > 1) return !1;
    let ze = _e > De ? 1 : -1;
    this.isInfinite && (De === 0 && _e === Ae.length - 1 && (ze = -1), De === Ae.length - 1 && _e === 0 && (ze = 1));
    const je = Ae[Re].pos * (this.isRTL ? 1 : -1);
    if (De === Re && Math.abs(je - Ie.target[this.axis]) < 1) return !1;
    this.clearTransitions();
    const Fe = Ie.isResting;
    P(this.container, this.cn("inTransition"));
    const He = ((Ve = Ae[De]) === null || Ve === void 0 ? void 0 : Ve.slides[0]) || null, Ge = ((Le = Ae[Re]) === null || Le === void 0 ? void 0 : Le.slides[0]) || null;
    this.inTransition.add(Ge.index), this.createSlideEl(Ge);
    let qe = He.el, Xe = Ge.el;
    Fe || ke === J || (ke = "fadeFast", qe = null);
    const Ye = this.isRTL ? "next" : "prev", We = this.isRTL ? "prev" : "next";
    return qe && (this.inTransition.add(He.index), He.transition = ke, qe.addEventListener(G, this.onAnimationEnd), qe.classList.add(`f-${ke}Out`, `to-${ze > 0 ? We : Ye}`)), Xe && (Ge.transition = ke, Xe.addEventListener(G, this.onAnimationEnd), Xe.classList.add(`f-${ke}In`, `from-${ze > 0 ? Ye : We}`)), Ie.current[this.axis] = je, Ie.target[this.axis] = je, Ie.requestTick(), this.onChange(Re), !0;
  }
  manageSlideVisiblity() {
    const _e = /* @__PURE__ */ new Set(), ke = /* @__PURE__ */ new Set(), Be = this.getVisibleSlides(parseFloat(this.option("preload", 0) + "") || 0);
    for (const Ne of this.slides) Be.has(Ne) ? _e.add(Ne) : ke.add(Ne);
    for (const Ne of this.inTransition) _e.add(this.slides[Ne]);
    for (const Ne of _e) this.createSlideEl(Ne), this.lazyLoadSlide(Ne);
    for (const Ne of ke) _e.has(Ne) || this.removeSlideEl(Ne);
    this.markSelectedSlides(), this.repositionSlides();
  }
  markSelectedSlides() {
    if (!this.pages[this.page] || !this.pages[this.page].slides) return;
    const _e = "aria-hidden";
    let ke = this.cn(K);
    if (ke) for (const Be of this.slides) {
      const Ne = Be.el;
      Ne && (Ne.dataset.index = `${Be.index}`, Ne.classList.contains("f-thumbs__slide") ? this.getVisibleSlides(0).has(Be) ? Ne.removeAttribute(_e) : Ne.setAttribute(_e, "true") : this.pages[this.page].slides.includes(Be) ? (Ne.classList.contains(ke) || (P(Ne, ke), this.emit("selectSlide", Be)), Ne.removeAttribute(_e)) : (Ne.classList.contains(ke) && (S(Ne, ke), this.emit("unselectSlide", Be)), Ne.setAttribute(_e, "true")));
    }
  }
  flipInfiniteTrack() {
    const { axis: _e, isHorizontal: ke, isInfinite: Be, isRTL: Ne, viewportDim: Ve, contentDim: Le } = this, De = this.panzoom;
    if (!De || !Be) return;
    let Ae = De.current[_e], Ie = De.target[_e] - Ae, Re = 0, ze = 0.5 * Ve;
    Ne && ke ? (Ae < -ze && (Re = -1, Ae += Le), Ae > Le - ze && (Re = 1, Ae -= Le)) : (Ae > ze && (Re = 1, Ae -= Le), Ae < -Le + ze && (Re = -1, Ae += Le)), Re && (De.current[_e] = Ae, De.target[_e] = Ae + Ie);
  }
  lazyLoadImg(_e, ke) {
    const Be = this, Ne = "f-fadeIn", Ve = "is-preloading";
    let Le = !1, De = null;
    const Ae = () => {
      Le || (Le = !0, De && (De.remove(), De = null), S(ke, Ve), ke.complete && (P(ke, Ne), setTimeout(() => {
        S(ke, Ne);
      }, 350)), this.option("adaptiveHeight") && _e.el && this.pages[this.page].slides.indexOf(_e) > -1 && (Be.updateMetrics(), Be.setViewportHeight()), this.emit("load", _e));
    };
    P(ke, Ve), ke.src = ke.dataset.lazySrcset || ke.dataset.lazySrc || "", delete ke.dataset.lazySrc, delete ke.dataset.lazySrcset, ke.addEventListener("error", () => {
      Ae();
    }), ke.addEventListener("load", () => {
      Ae();
    }), setTimeout(() => {
      const Ie = ke.parentNode;
      Ie && _e.el && (ke.complete ? Ae() : Le || (De = n(x), Ie.insertBefore(De, ke)));
    }, 300);
  }
  lazyLoadSlide(_e) {
    const ke = _e && _e.el;
    if (!ke) return;
    const Be = /* @__PURE__ */ new Set();
    let Ne = Array.from(ke.querySelectorAll("[data-lazy-src],[data-lazy-srcset]"));
    ke.dataset.lazySrc && Ne.push(ke), Ne.map((Ve) => {
      Ve instanceof HTMLImageElement ? Be.add(Ve) : Ve instanceof HTMLElement && Ve.dataset.lazySrc && (Ve.style.backgroundImage = `url('${Ve.dataset.lazySrc}')`, delete Ve.dataset.lazySrc);
    });
    for (const Ve of Be) this.lazyLoadImg(_e, Ve);
  }
  onAnimationEnd(_e) {
    var ke;
    const Be = _e.target, Ne = Be ? parseInt(Be.dataset.index || "", 10) || 0 : -1, Ve = this.slides[Ne], Le = _e.animationName;
    if (!Be || !Ve || !Le) return;
    const De = !!this.inTransition.has(Ne) && Ve.transition;
    De && Le.substring(0, De.length + 2) === `f-${De}` && this.inTransition.delete(Ne), this.inTransition.size || this.clearTransitions(), Ne === this.page && (!((ke = this.panzoom) === null || ke === void 0) && ke.isResting) && this.emit("settle");
  }
  onDecel(_e, ke = 0, Be = 0, Ne = 0, Ve = 0) {
    if (this.option("dragFree")) return void this.setPageFromPosition();
    const { isRTL: Le, isHorizontal: De, axis: Ae, pages: Ie } = this, Re = Ie.length, ze = Math.abs(Math.atan2(Be, ke) / (Math.PI / 180));
    let je = 0;
    if (je = ze > 45 && ze < 135 ? De ? 0 : Be : De ? ke : 0, !Re) return;
    let Fe = this.page, He = Le && De ? 1 : -1;
    const Ge = _e.current[Ae] * He;
    let { pageIndex: qe } = this.getPageFromPosition(Ge);
    Math.abs(je) > 5 ? (Ie[Fe].dim < document.documentElement["client" + (this.isHorizontal ? "Width" : "Height")] - 1 && (Fe = qe), Fe = Le && De ? je < 0 ? Fe - 1 : Fe + 1 : je < 0 ? Fe + 1 : Fe - 1) : Fe = Ne === 0 && Ve === 0 ? Fe : qe, this.slideTo(Fe, { transition: !1, friction: _e.option("decelFriction") });
  }
  onClick(_e) {
    const ke = _e.target, Be = ke && E(ke) ? ke.dataset : null;
    let Ne, Ve;
    Be && (Be.carouselPage !== void 0 ? (Ve = "slideTo", Ne = Be.carouselPage) : Be.carouselNext !== void 0 ? Ve = "slideNext" : Be.carouselPrev !== void 0 && (Ve = "slidePrev")), Ve ? (_e.preventDefault(), _e.stopPropagation(), ke && !ke.hasAttribute("disabled") && this[Ve](Ne)) : this.emit("click", _e);
  }
  onSlideTo(_e) {
    const ke = _e.detail || 0;
    this.slideTo(this.getPageForSlide(ke), { friction: 0 });
  }
  onChange(_e, ke = 0) {
    const Be = this.page;
    this.prevPage = Be, this.page = _e, this.option("adaptiveHeight") && this.setViewportHeight(), _e !== Be && (this.markSelectedSlides(), this.emit("change", _e, Be, ke));
  }
  onRefresh() {
    let _e = this.contentDim, ke = this.viewportDim;
    this.updateMetrics(), this.contentDim === _e && this.viewportDim === ke || this.slideTo(this.page, { friction: 0, transition: !1 });
  }
  onScroll() {
    var _e;
    (_e = this.viewport) === null || _e === void 0 || _e.scroll(0, 0);
  }
  onResize() {
    this.option("breakpoints") && this.processOptions();
  }
  onBeforeTransform(_e) {
    this.lp !== _e.current[this.axis] && (this.flipInfiniteTrack(), this.manageSlideVisiblity()), this.lp = _e.current.e;
  }
  onEndAnimation() {
    this.inTransition.size || this.emit("settle");
  }
  reInit(_e = null, ke = null) {
    this.destroy(), this.state = B.Init, this.prevPage = null, this.userOptions = _e || this.userOptions, this.userPlugins = ke || this.userPlugins, this.processOptions();
  }
  slideTo(_e = 0, { friction: ke = this.option("friction"), transition: Be = this.option("transition") } = {}) {
    if (this.state === B.Destroy) return;
    _e = parseInt((_e || 0).toString()) || 0;
    const Ne = this.getPageFromIndex(_e), { axis: Ve, isHorizontal: Le, isRTL: De, pages: Ae, panzoom: Ie } = this, Re = Ae.length, ze = De && Le ? 1 : -1;
    if (!Ie || !Re) return;
    if (this.page !== Ne) {
      const Fe = new Event("beforeChange", { bubbles: !0, cancelable: !0 });
      if (this.emit("beforeChange", Fe, _e), Fe.defaultPrevented) return;
    }
    if (this.transitionTo(_e, Be)) return;
    let je = Ae[Ne].pos;
    if (this.isInfinite) {
      const Fe = this.contentDim, He = Ie.target[Ve] * ze;
      Re === 2 ? je += Fe * Math.floor(parseFloat(_e + "") / 2) : je = [je, je - Fe, je + Fe].reduce(function(Ge, qe) {
        return Math.abs(qe - He) < Math.abs(Ge - He) ? qe : Ge;
      });
    }
    je *= ze, Math.abs(Ie.target[Ve] - je) < 1 || (Ie.panTo({ x: Le ? je : 0, y: Le ? 0 : je, friction: ke }), this.onChange(Ne));
  }
  slideToClosest(_e) {
    if (this.panzoom) {
      const { pageIndex: ke } = this.getPageFromPosition();
      this.slideTo(ke, _e);
    }
  }
  slideNext() {
    this.slideTo(this.page + 1);
  }
  slidePrev() {
    this.slideTo(this.page - 1);
  }
  clearTransitions() {
    this.inTransition.clear(), S(this.container, this.cn("inTransition"));
    const _e = ["to-prev", "to-next", "from-prev", "from-next"];
    for (const ke of this.slides) {
      const Be = ke.el;
      if (Be) {
        Be.removeEventListener(G, this.onAnimationEnd), Be.classList.remove(..._e);
        const Ne = ke.transition;
        Ne && Be.classList.remove(`f-${Ne}Out`, `f-${Ne}In`);
      }
    }
    this.manageSlideVisiblity();
  }
  addSlide(_e, ke) {
    var Be, Ne, Ve, Le;
    const De = this.panzoom, Ae = ((Be = this.pages[this.page]) === null || Be === void 0 ? void 0 : Be.pos) || 0, Ie = ((Ne = this.pages[this.page]) === null || Ne === void 0 ? void 0 : Ne.dim) || 0, Re = this.contentDim < this.viewportDim;
    let ze = Array.isArray(ke) ? ke : [ke];
    const je = [];
    for (const Fe of ze) je.push(H(Fe));
    this.slides.splice(_e, 0, ...je);
    for (let Fe = 0; Fe < this.slides.length; Fe++) this.slides[Fe].index = Fe;
    for (const Fe of je) this.emit("beforeInitSlide", Fe, Fe.index);
    if (this.page >= _e && (this.page += je.length), this.updateMetrics(), De) {
      const Fe = ((Ve = this.pages[this.page]) === null || Ve === void 0 ? void 0 : Ve.pos) || 0, He = ((Le = this.pages[this.page]) === null || Le === void 0 ? void 0 : Le.dim) || 0, Ge = this.pages.length || 1, qe = this.isRTL ? Ie - He : He - Ie, Xe = this.isRTL ? Ae - Fe : Fe - Ae;
      Re && Ge === 1 ? (_e <= this.page && (De.current[this.axis] -= qe, De.target[this.axis] -= qe), De.panTo({ [this.isHorizontal ? "x" : "y"]: -1 * Fe })) : Xe && _e <= this.page && (De.target[this.axis] -= Xe, De.current[this.axis] -= Xe, De.requestTick());
    }
    for (const Fe of je) this.emit("initSlide", Fe, Fe.index);
  }
  prependSlide(_e) {
    this.addSlide(0, _e);
  }
  appendSlide(_e) {
    this.addSlide(this.slides.length, _e);
  }
  removeSlide(_e) {
    const ke = this.slides.length;
    _e = (_e % ke + ke) % ke;
    const Be = this.slides[_e];
    if (Be) {
      this.removeSlideEl(Be, !0), this.slides.splice(_e, 1);
      for (let Ne = 0; Ne < this.slides.length; Ne++) this.slides[Ne].index = Ne;
      this.updateMetrics(), this.slideTo(this.page, { friction: 0, transition: !1 }), this.emit("destroySlide", Be);
    }
  }
  updateMetrics() {
    const { panzoom: _e, viewport: ke, track: Be, slides: Ne, isHorizontal: Ve, isInfinite: Le } = this;
    if (!Be) return;
    const De = Ve ? "width" : "height", Ae = Ve ? "offsetWidth" : "offsetHeight";
    if (ke) {
      let ze = Math.max(ke[Ae], t(ke.getBoundingClientRect()[De], 1e3)), je = getComputedStyle(ke), Fe = "padding", He = Ve ? "Right" : "Bottom";
      ze -= parseFloat(je[Fe + (Ve ? "Left" : "Top")]) + parseFloat(je[Fe + He]), this.viewportDim = ze;
    }
    let Ie, Re = 0;
    for (const [ze, je] of Ne.entries()) {
      let Fe = 0, He = 0;
      !je.el && Ie ? (Fe = Ie.dim, He = Ie.gap) : ({ dim: Fe, gap: He } = this.getSlideMetrics(je), Ie = je), Fe = t(Fe, 1e3), He = t(He, 1e3), je.dim = Fe, je.gap = He, je.pos = Re, Re += Fe, (Le || ze < Ne.length - 1) && (Re += He);
    }
    Re = t(Re, 1e3), this.contentDim = Re, _e && (_e.contentRect[De] = Re, _e.contentRect[Ve ? "fullWidth" : "fullHeight"] = Re), this.pages = this.createPages(), this.pages = this.processPages(), this.state === B.Init && this.setInitialPage(), this.page = Math.max(0, Math.min(this.page, this.pages.length - 1)), this.manageSlideVisiblity(), this.emit("refresh");
  }
  getProgress(_e, ke = !1, Be = !1) {
    _e === void 0 && (_e = this.page);
    const Ne = this, Ve = Ne.panzoom, Le = Ne.contentDim, De = Ne.pages[_e] || 0;
    if (!De || !Ve) return _e > this.page ? -1 : 1;
    let Ae = -1 * Ve.current.e, Ie = t((Ae - De.pos) / (1 * De.dim), 1e3), Re = Ie, ze = Ie;
    this.isInfinite && Be !== !0 && (Re = t((Ae - De.pos + Le) / (1 * De.dim), 1e3), ze = t((Ae - De.pos - Le) / (1 * De.dim), 1e3));
    let je = [Ie, Re, ze].reduce(function(Fe, He) {
      return Math.abs(He) < Math.abs(Fe) ? He : Fe;
    });
    return ke ? je : je > 1 ? 1 : je < -1 ? -1 : je;
  }
  setViewportHeight() {
    const { page: _e, pages: ke, viewport: Be, isHorizontal: Ne } = this;
    if (!Be || !ke[_e]) return;
    let Ve = 0;
    Ne && this.track && (this.track.style.height = "auto", ke[_e].slides.forEach((Le) => {
      Le.el && (Ve = Math.max(Ve, Le.el.offsetHeight));
    })), Be.style.height = Ve ? `${Ve}px` : "";
  }
  getPageForSlide(_e) {
    for (const ke of this.pages) for (const Be of ke.slides) if (Be.index === _e) return ke.index;
    return -1;
  }
  getVisibleSlides(_e = 0) {
    var ke;
    const Be = /* @__PURE__ */ new Set();
    let { panzoom: Ne, contentDim: Ve, viewportDim: Le, pages: De, page: Ae } = this;
    if (Le) {
      Ve = Ve + ((ke = this.slides[this.slides.length - 1]) === null || ke === void 0 ? void 0 : ke.gap) || 0;
      let Ie = 0;
      Ie = Ne && Ne.state !== m.Init && Ne.state !== m.Destroy ? -1 * Ne.current[this.axis] : De[Ae] && De[Ae].pos || 0, this.isInfinite && (Ie -= Math.floor(Ie / Ve) * Ve), this.isRTL && this.isHorizontal && (Ie *= -1);
      const Re = Ie - Le * _e, ze = Ie + Le * (_e + 1), je = this.isInfinite ? [-1, 0, 1] : [0];
      for (const Fe of this.slides) for (const He of je) {
        const Ge = Fe.pos + He * Ve, qe = Ge + Fe.dim + Fe.gap;
        Ge < ze && qe > Re && Be.add(Fe);
      }
    }
    return Be;
  }
  getPageFromPosition(_e) {
    const { viewportDim: ke, contentDim: Be, slides: Ne, pages: Ve, panzoom: Le } = this, De = Ve.length, Ae = Ne.length, Ie = Ne[0], Re = Ne[Ae - 1], ze = this.option("center");
    let je = 0, Fe = 0, He = 0, Ge = _e === void 0 ? -1 * ((Le == null ? void 0 : Le.target[this.axis]) || 0) : _e;
    ze && (Ge += 0.5 * ke), this.isInfinite ? (Ge < Ie.pos - 0.5 * Re.gap && (Ge -= Be, He = -1), Ge > Re.pos + Re.dim + 0.5 * Re.gap && (Ge -= Be, He = 1)) : Ge = Math.max(Ie.pos || 0, Math.min(Ge, Re.pos));
    let qe = Re, Xe = Ne.find((Ye) => {
      const We = Ye.pos - 0.5 * qe.gap, Je = Ye.pos + Ye.dim + 0.5 * Ye.gap;
      return qe = Ye, Ge >= We && Ge < Je;
    });
    return Xe || (Xe = Re), Fe = this.getPageForSlide(Xe.index), je = Fe + He * De, { page: je, pageIndex: Fe };
  }
  setPageFromPosition() {
    const { pageIndex: _e } = this.getPageFromPosition();
    this.onChange(_e);
  }
  destroy() {
    if ([B.Destroy].includes(this.state)) return;
    this.state = B.Destroy;
    const { container: _e, viewport: ke, track: Be, slides: Ne, panzoom: Ve } = this, Le = this.option("classes");
    _e.removeEventListener("click", this.onClick, { passive: !1, capture: !1 }), _e.removeEventListener("slideTo", this.onSlideTo), window.removeEventListener("resize", this.onResize), Ve && (Ve.destroy(), this.panzoom = null), Ne && Ne.forEach((Ae) => {
      this.removeSlideEl(Ae);
    }), this.detachPlugins(), ke && (ke.removeEventListener("scroll", this.onScroll), ke.offsetParent && Be && Be.offsetParent && ke.replaceWith(...Be.childNodes));
    for (const [Ae, Ie] of Object.entries(Le)) Ae !== "container" && Ie && _e.classList.remove(Ie);
    this.track = null, this.viewport = null, this.page = 0, this.slides = [];
    const De = this.events.get("ready");
    this.events = /* @__PURE__ */ new Map(), De && this.events.set("ready", De);
  }
}
Object.defineProperty(Q, "Panzoom", { enumerable: !0, configurable: !0, writable: !0, value: I }), Object.defineProperty(Q, "defaults", { enumerable: !0, configurable: !0, writable: !0, value: j }), Object.defineProperty(Q, "Plugins", { enumerable: !0, configurable: !0, writable: !0, value: U });
const tt = function($e) {
  if (!E($e)) return 0;
  const _e = window.scrollY, ke = window.innerHeight, Be = _e + ke, Ne = $e.getBoundingClientRect(), Ve = Ne.y + _e, Le = Ne.height, De = Ve + Le;
  if (_e > De || Be < Ve) return 0;
  if (_e < Ve && Be > De || Ve < _e && De > Be) return 100;
  let Ae = Le;
  Ve < _e && (Ae -= _e - Ve), De > Be && (Ae -= De - Be);
  const Ie = Ae / ke * 100;
  return Math.round(Ie);
}, et = !(typeof window > "u" || !window.document || !window.document.createElement);
let it;
const nt = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden]):not(.fancybox-focus-guard)", "iframe", "object", "embed", "video", "audio", "[contenteditable]", '[tabindex]:not([tabindex^="-"]):not([disabled]):not([aria-hidden])'].join(","), st = ($e) => {
  if ($e && et) {
    it === void 0 && document.createElement("div").focus({ get preventScroll() {
      return it = !0, !1;
    } });
    try {
      if (it) $e.focus({ preventScroll: !0 });
      else {
        const _e = window.scrollY || document.body.scrollTop, ke = window.scrollX || document.body.scrollLeft;
        $e.focus(), document.body.scrollTo({ top: _e, left: ke, behavior: "auto" });
      }
    } catch {
    }
  }
}, ot = () => {
  const $e = document;
  let _e, ke = "", Be = "", Ne = "";
  return $e.fullscreenEnabled ? (ke = "requestFullscreen", Be = "exitFullscreen", Ne = "fullscreenElement") : $e.webkitFullscreenEnabled && (ke = "webkitRequestFullscreen", Be = "webkitExitFullscreen", Ne = "webkitFullscreenElement"), ke && (_e = { request: function(Ve = $e.documentElement) {
    return ke === "webkitRequestFullscreen" ? Ve[ke](Element.ALLOW_KEYBOARD_INPUT) : Ve[ke]();
  }, exit: function() {
    return $e[Ne] && $e[Be]();
  }, isFullscreen: function() {
    return $e[Ne];
  } }), _e;
}, at = { animated: !0, autoFocus: !0, backdropClick: "close", Carousel: { classes: { container: "fancybox__carousel", viewport: "fancybox__viewport", track: "fancybox__track", slide: "fancybox__slide" } }, closeButton: "auto", closeExisting: !1, commonCaption: !1, compact: () => window.matchMedia("(max-width: 578px), (max-height: 578px)").matches, contentClick: "toggleZoom", contentDblClick: !1, defaultType: "image", defaultDisplay: "flex", dragToClose: !0, Fullscreen: { autoStart: !1 }, groupAll: !1, groupAttr: "data-fancybox", hideClass: "f-fadeOut", hideScrollbar: !0, idle: 3500, keyboard: { Escape: "close", Delete: "close", Backspace: "close", PageUp: "next", PageDown: "prev", ArrowUp: "prev", ArrowDown: "next", ArrowRight: "next", ArrowLeft: "prev" }, l10n: Object.assign(Object.assign({}, b), { CLOSE: "Close", NEXT: "Next", PREV: "Previous", MODAL: "You can close this modal content with the ESC key", ERROR: "Something Went Wrong, Please Try Again Later", IMAGE_ERROR: "Image Not Found", ELEMENT_NOT_FOUND: "HTML Element Not Found", AJAX_NOT_FOUND: "Error Loading AJAX : Not Found", AJAX_FORBIDDEN: "Error Loading AJAX : Forbidden", IFRAME_ERROR: "Error Loading Page", TOGGLE_ZOOM: "Toggle zoom level", TOGGLE_THUMBS: "Toggle thumbnails", TOGGLE_SLIDESHOW: "Toggle slideshow", TOGGLE_FULLSCREEN: "Toggle full-screen mode", DOWNLOAD: "Download" }), parentEl: null, placeFocusBack: !0, showClass: "f-zoomInUp", startIndex: 0, tpl: { closeButton: '<button data-fancybox-close class="f-button is-close-btn" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"/></svg></button>', main: `<div class="fancybox__container" role="dialog" aria-modal="true" aria-label="{{MODAL}}" tabindex="-1">
    <div class="fancybox__backdrop"></div>
    <div class="fancybox__carousel"></div>
    <div class="fancybox__footer"></div>
  </div>` }, trapFocus: !0, wheel: "zoom" };
var rt, lt;
(function($e) {
  $e[$e.Init = 0] = "Init", $e[$e.Ready = 1] = "Ready", $e[$e.Closing = 2] = "Closing", $e[$e.CustomClosing = 3] = "CustomClosing", $e[$e.Destroy = 4] = "Destroy";
})(rt || (rt = {})), function($e) {
  $e[$e.Loading = 0] = "Loading", $e[$e.Opening = 1] = "Opening", $e[$e.Ready = 2] = "Ready", $e[$e.Closing = 3] = "Closing";
}(lt || (lt = {}));
let ct = "", ht = !1, dt = !1, ut = null;
const pt = () => {
  let $e = "", _e = "";
  const ke = Oe.getInstance();
  if (ke) {
    const Be = ke.carousel, Ne = ke.getSlide();
    if (Be && Ne) {
      let Ve = Ne.slug || void 0, Le = Ne.triggerEl || void 0;
      _e = Ve || ke.option("slug") || "", !_e && Le && Le.dataset && (_e = Le.dataset.fancybox || ""), _e && _e !== "true" && ($e = "#" + _e + (!Ve && Be.slides.length > 1 ? "-" + (Ne.index + 1) : ""));
    }
  }
  return { hash: $e, slug: _e, index: 1 };
}, ft = () => {
  const $e = new URL(document.URL).hash, _e = $e.slice(1).split("-"), ke = _e[_e.length - 1], Be = ke && /^\+?\d+$/.test(ke) && parseInt(_e.pop() || "1", 10) || 1;
  return { hash: $e, slug: _e.join("-"), index: Be };
}, gt = () => {
  const { slug: $e, index: _e } = ft();
  if (!$e) return;
  let ke = document.querySelector(`[data-slug="${$e}"]`);
  if (ke && ke.dispatchEvent(new CustomEvent("click", { bubbles: !0, cancelable: !0 })), Oe.getInstance()) return;
  const Be = document.querySelectorAll(`[data-fancybox="${$e}"]`);
  Be.length && (ke = Be[_e - 1], ke && ke.dispatchEvent(new CustomEvent("click", { bubbles: !0, cancelable: !0 })));
}, mt = () => {
  if (Oe.defaults.Hash === !1) return;
  const $e = Oe.getInstance();
  if (($e == null ? void 0 : $e.options.Hash) === !1) return;
  const { slug: _e, index: ke } = ft(), { slug: Be } = pt();
  $e && (_e === Be ? $e.jumpTo(ke - 1) : (ht = !0, $e.close())), gt();
}, vt = () => {
  ut && clearTimeout(ut), queueMicrotask(() => {
    mt();
  });
}, bt = () => {
  window.addEventListener("hashchange", vt, !1), setTimeout(() => {
    mt();
  }, 500);
};
et && (/complete|interactive|loaded/.test(document.readyState) ? bt() : document.addEventListener("DOMContentLoaded", bt));
const yt = "is-zooming-in";
class wt extends _ {
  onCreateSlide(_e, ke, Be) {
    const Ne = this.instance.optionFor(Be, "src") || "";
    Be.el && Be.type === "image" && typeof Ne == "string" && this.setImage(Be, Ne);
  }
  onRemoveSlide(_e, ke, Be) {
    Be.panzoom && Be.panzoom.destroy(), Be.panzoom = void 0, Be.imageEl = void 0;
  }
  onChange(_e, ke, Be, Ne) {
    S(this.instance.container, yt);
    for (const Ve of ke.slides) {
      const Le = Ve.panzoom;
      Le && Ve.index !== Be && Le.reset(0.35);
    }
  }
  onClose() {
    var _e;
    const ke = this.instance, Be = ke.container, Ne = ke.getSlide();
    if (!Be || !Be.parentElement || !Ne) return;
    const { el: Ve, contentEl: Le, panzoom: De, thumbElSrc: Ae } = Ne;
    if (!Ve || !Ae || !Le || !De || De.isContentLoading || De.state === m.Init || De.state === m.Destroy) return;
    De.updateMetrics();
    let Ie = this.getZoomInfo(Ne);
    if (!Ie) return;
    this.instance.state = rt.CustomClosing, Be.classList.remove(yt), Be.classList.add("is-zooming-out"), Le.style.backgroundImage = `url('${Ae}')`;
    const Re = Be.getBoundingClientRect();
    (((_e = window.visualViewport) === null || _e === void 0 ? void 0 : _e.scale) || 1) === 1 && Object.assign(Be.style, { position: "absolute", top: `${Be.offsetTop + window.scrollY}px`, left: `${Be.offsetLeft + window.scrollX}px`, bottom: "auto", right: "auto", width: `${Re.width}px`, height: `${Re.height}px`, overflow: "hidden" });
    const { x: ze, y: je, scale: Fe, opacity: He } = Ie;
    if (He) {
      const Ge = ((qe, Xe, Ye, We) => {
        const Je = Xe - qe, ri = We - Ye;
        return (Qe) => Ye + ((Qe - qe) / Je * ri || 0);
      })(De.scale, Fe, 1, 0);
      De.on("afterTransform", () => {
        Le.style.opacity = Ge(De.scale) + "";
      });
    }
    De.on("endAnimation", () => {
      ke.destroy();
    }), De.target.a = Fe, De.target.b = 0, De.target.c = 0, De.target.d = Fe, De.panTo({ x: ze, y: je, scale: Fe, friction: He ? 0.2 : 0.33, ignoreBounds: !0 }), De.isResting && ke.destroy();
  }
  setImage(_e, ke) {
    const Be = this.instance;
    _e.src = ke, this.process(_e, ke).then((Ne) => {
      const { contentEl: Ve, imageEl: Le, thumbElSrc: De, el: Ae } = _e;
      if (Be.isClosing() || !Ve || !Le) return;
      Ve.offsetHeight;
      const Ie = !!Be.isOpeningSlide(_e) && this.getZoomInfo(_e);
      if (this.option("protected") && Ae) {
        Ae.addEventListener("contextmenu", (je) => {
          je.preventDefault();
        });
        const ze = document.createElement("div");
        P(ze, "fancybox-protected"), Ve.appendChild(ze);
      }
      if (De && Ie) {
        const ze = Ne.contentRect, je = Math.max(ze.fullWidth, ze.fullHeight);
        let Fe = null;
        !Ie.opacity && je > 1200 && (Fe = document.createElement("img"), P(Fe, "fancybox-ghost"), Fe.src = De, Ve.appendChild(Fe));
        const He = () => {
          Fe && (P(Fe, "f-fadeFastOut"), setTimeout(() => {
            Fe && (Fe.remove(), Fe = null);
          }, 200));
        };
        (Re = De, new Promise((Ge, qe) => {
          const Xe = new Image();
          Xe.onload = Ge, Xe.onerror = qe, Xe.src = Re;
        })).then(() => {
          Be.hideLoading(_e), _e.state = lt.Opening, this.instance.emit("reveal", _e), this.zoomIn(_e).then(() => {
            He(), this.instance.done(_e);
          }, () => {
          }), Fe && setTimeout(() => {
            He();
          }, je > 2500 ? 800 : 200);
        }, () => {
          Be.hideLoading(_e), Be.revealContent(_e);
        });
      } else {
        const ze = this.optionFor(_e, "initialSize"), je = this.optionFor(_e, "zoom"), Fe = { event: Be.prevMouseMoveEvent || Be.options.event, friction: je ? 0.12 : 0 };
        let He = Be.optionFor(_e, "showClass") || void 0, Ge = !0;
        Be.isOpeningSlide(_e) && (ze === "full" ? Ne.zoomToFull(Fe) : ze === "cover" ? Ne.zoomToCover(Fe) : ze === "max" ? Ne.zoomToMax(Fe) : Ge = !1, Ne.stop("current")), Ge && He && (He = Ne.isDragging ? "f-fadeIn" : ""), Be.hideLoading(_e), Be.revealContent(_e, He);
      }
      var Re;
    }, () => {
      Be.setError(_e, "{{IMAGE_ERROR}}");
    });
  }
  process(_e, ke) {
    return new Promise((Be, Ne) => {
      var Ve;
      const Le = this.instance, De = _e.el;
      Le.clearContent(_e), Le.showLoading(_e);
      let Ae = this.optionFor(_e, "content");
      if (typeof Ae == "string" && (Ae = n(Ae)), !Ae || !E(Ae)) {
        if (Ae = document.createElement("img"), Ae instanceof HTMLImageElement) {
          let Ie = "", Re = _e.caption;
          Ie = typeof Re == "string" && Re ? Re.replace(/<[^>]+>/gi, "").substring(0, 1e3) : `Image ${_e.index + 1} of ${((Ve = Le.carousel) === null || Ve === void 0 ? void 0 : Ve.pages.length) || 1}`, Ae.src = ke || "", Ae.alt = Ie, Ae.draggable = !1, _e.srcset && Ae.setAttribute("srcset", _e.srcset), this.instance.isOpeningSlide(_e) && (Ae.fetchPriority = "high");
        }
        _e.sizes && Ae.setAttribute("sizes", _e.sizes);
      }
      P(Ae, "fancybox-image"), _e.imageEl = Ae, Le.setContent(_e, Ae, !1), _e.panzoom = new I(De, u({ transformParent: !0 }, this.option("Panzoom") || {}, { content: Ae, width: (Ie, Re) => Le.optionFor(_e, "width", "auto", Re) || "auto", height: (Ie, Re) => Le.optionFor(_e, "height", "auto", Re) || "auto", wheel: () => {
        const Ie = Le.option("wheel");
        return (Ie === "zoom" || Ie == "pan") && Ie;
      }, click: (Ie, Re) => {
        var ze, je;
        if (Le.isCompact || Le.isClosing() || _e.index !== ((ze = Le.getSlide()) === null || ze === void 0 ? void 0 : ze.index)) return !1;
        if (Re) {
          const He = Re.composedPath()[0];
          if (["A", "BUTTON", "TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO"].includes(He.nodeName)) return !1;
        }
        let Fe = !Re || Re.target && ((je = _e.contentEl) === null || je === void 0 ? void 0 : je.contains(Re.target));
        return Le.option(Fe ? "contentClick" : "backdropClick") || !1;
      }, dblClick: () => Le.isCompact ? "toggleZoom" : Le.option("contentDblClick") || !1, spinner: !1, panOnlyZoomed: !0, wheelLimit: 1 / 0, on: { ready: (Ie) => {
        Be(Ie);
      }, error: () => {
        Ne();
      }, destroy: () => {
        Ne();
      } } }));
    });
  }
  zoomIn(_e) {
    return new Promise((ke, Be) => {
      const Ne = this.instance, Ve = Ne.container, { panzoom: Le, contentEl: De, el: Ae } = _e;
      Le && Le.updateMetrics();
      const Ie = this.getZoomInfo(_e);
      if (!(Ie && Ae && De && Le && Ve)) return void Be();
      const { x: Re, y: ze, scale: je, opacity: Fe } = Ie, He = () => {
        _e.state !== lt.Closing && (Fe && (De.style.opacity = Math.max(Math.min(1, 1 - (1 - Le.scale) / (1 - je)), 0) + ""), Le.scale >= 1 && Le.scale > Le.targetScale - 0.1 && ke(Le));
      }, Ge = (Ye) => {
        (Ye.scale < 0.99 || Ye.scale > 1.01) && !Ye.isDragging || (S(Ve, yt), De.style.opacity = "", Ye.off("endAnimation", Ge), Ye.off("touchStart", Ge), Ye.off("afterTransform", He), ke(Ye));
      };
      Le.on("endAnimation", Ge), Le.on("touchStart", Ge), Le.on("afterTransform", He), Le.on(["error", "destroy"], () => {
        Be();
      }), Le.panTo({ x: Re, y: ze, scale: je, friction: 0, ignoreBounds: !0 }), Le.stop("current");
      const qe = { event: Le.panMode === "mousemove" ? Ne.prevMouseMoveEvent || Ne.options.event : void 0 }, Xe = this.optionFor(_e, "initialSize");
      P(Ve, yt), Ne.hideLoading(_e), Xe === "full" ? Le.zoomToFull(qe) : Xe === "cover" ? Le.zoomToCover(qe) : Xe === "max" ? Le.zoomToMax(qe) : Le.reset(0.172);
    });
  }
  getZoomInfo(_e) {
    const { el: ke, imageEl: Be, thumbEl: Ne, panzoom: Ve } = _e, Le = this.instance, De = Le.container;
    if (!ke || !Be || !Ne || !Ve || tt(Ne) < 3 || !this.optionFor(_e, "zoom") || !De || Le.state === rt.Destroy || getComputedStyle(De).getPropertyValue("--f-images-zoom") === "0") return !1;
    const Ae = window.visualViewport || null;
    if ((Ae ? Ae.scale : 1) !== 1) return !1;
    let { top: Ie, left: Re, width: ze, height: je } = Ne.getBoundingClientRect(), { top: Fe, left: He, fitWidth: Ge, fitHeight: qe } = Ve.contentRect;
    if (!(ze && je && Ge && qe)) return !1;
    const Xe = Ve.container.getBoundingClientRect();
    He += Xe.left, Fe += Xe.top;
    const Ye = -1 * (He + 0.5 * Ge - (Re + 0.5 * ze)), We = -1 * (Fe + 0.5 * qe - (Ie + 0.5 * je)), Je = ze / Ge;
    let ri = this.option("zoomOpacity") || !1;
    return ri === "auto" && (ri = Math.abs(ze / je - Ge / qe) > 0.1), { x: Ye, y: We, scale: Je, opacity: ri };
  }
  attach() {
    const _e = this, ke = _e.instance;
    ke.on("Carousel.change", _e.onChange), ke.on("Carousel.createSlide", _e.onCreateSlide), ke.on("Carousel.removeSlide", _e.onRemoveSlide), ke.on("close", _e.onClose);
  }
  detach() {
    const _e = this, ke = _e.instance;
    ke.off("Carousel.change", _e.onChange), ke.off("Carousel.createSlide", _e.onCreateSlide), ke.off("Carousel.removeSlide", _e.onRemoveSlide), ke.off("close", _e.onClose);
  }
}
Object.defineProperty(wt, "defaults", { enumerable: !0, configurable: !0, writable: !0, value: { initialSize: "fit", Panzoom: { maxScale: 1 }, protected: !1, zoom: !0, zoomOpacity: "auto" } }), typeof SuppressedError == "function" && SuppressedError;
const xt = "html", Et = "image", St = "map", Pt = "youtube", Ct = "vimeo", Tt = "html5video", Mt = ($e, _e = {}) => {
  const ke = new URL($e), Be = new URLSearchParams(ke.search), Ne = new URLSearchParams();
  for (const [De, Ae] of [...Be, ...Object.entries(_e)]) {
    let Ie = Ae + "";
    if (De === "t") {
      let Re = Ie.match(/((\d*)m)?(\d*)s?/);
      Re && Ne.set("start", 60 * parseInt(Re[2] || "0") + parseInt(Re[3] || "0") + "");
    } else Ne.set(De, Ie);
  }
  let Ve = Ne + "", Le = $e.match(/#t=((.*)?\d+s)/);
  return Le && (Ve += `#t=${Le[1]}`), Ve;
}, Ot = { ajax: null, autoSize: !0, iframeAttr: { allow: "autoplay; fullscreen", scrolling: "auto" }, preload: !0, videoAutoplay: !0, videoRatio: 16 / 9, videoTpl: `<video class="fancybox__html5video" playsinline controls controlsList="nodownload" poster="{{poster}}">
  <source src="{{src}}" type="{{format}}" />Sorry, your browser doesn't support embedded videos.</video>`, videoFormat: "", vimeo: { byline: 1, color: "00adef", controls: 1, dnt: 1, muted: 0 }, youtube: { controls: 1, enablejsapi: 1, nocookie: 1, rel: 0, fs: 1 } }, At = ["image", "html", "ajax", "inline", "clone", "iframe", "map", "pdf", "html5video", "youtube", "vimeo"];
class Lt extends _ {
  onBeforeInitSlide(_e, ke, Be) {
    this.processType(Be);
  }
  onCreateSlide(_e, ke, Be) {
    this.setContent(Be);
  }
  onClearContent(_e, ke) {
    ke.xhr && (ke.xhr.abort(), ke.xhr = null);
    const Be = ke.iframeEl;
    Be && (Be.onload = Be.onerror = null, Be.src = "//about:blank", ke.iframeEl = null);
    const Ne = ke.contentEl, Ve = ke.placeholderEl;
    if (ke.type === "inline" && Ne && Ve) Ne.classList.remove("fancybox__content"), getComputedStyle(Ne).getPropertyValue("display") !== "none" && (Ne.style.display = "none"), setTimeout(() => {
      Ve && (Ne && Ve.parentNode && Ve.parentNode.insertBefore(Ne, Ve), Ve.remove());
    }, 0), ke.contentEl = void 0, ke.placeholderEl = void 0;
    else for (; ke.el && ke.el.firstChild; ) ke.el.removeChild(ke.el.firstChild);
  }
  onSelectSlide(_e, ke, Be) {
    Be.state === lt.Ready && this.playVideo();
  }
  onUnselectSlide(_e, ke, Be) {
    var Ne, Ve;
    if (Be.type === Tt) {
      try {
        (Ve = (Ne = Be.el) === null || Ne === void 0 ? void 0 : Ne.querySelector("video")) === null || Ve === void 0 || Ve.pause();
      } catch {
      }
      return;
    }
    let Le;
    Be.type === Ct ? Le = { method: "pause", value: "true" } : Be.type === Pt && (Le = { event: "command", func: "pauseVideo" }), Le && Be.iframeEl && Be.iframeEl.contentWindow && Be.iframeEl.contentWindow.postMessage(JSON.stringify(Le), "*"), Be.poller && clearTimeout(Be.poller);
  }
  onDone(_e, ke) {
    _e.isCurrentSlide(ke) && !_e.isClosing() && this.playVideo();
  }
  onRefresh(_e, ke) {
    ke.slides.forEach((Be) => {
      Be.el && (this.resizeIframe(Be), this.setAspectRatio(Be));
    });
  }
  onMessage(_e) {
    try {
      let ke = JSON.parse(_e.data);
      if (_e.origin === "https://player.vimeo.com") {
        if (ke.event === "ready") for (let Be of Array.from(document.getElementsByClassName("fancybox__iframe"))) Be instanceof HTMLIFrameElement && Be.contentWindow === _e.source && (Be.dataset.ready = "true");
      } else if (_e.origin.match(/^https:\/\/(www.)?youtube(-nocookie)?.com$/) && ke.event === "onReady") {
        const Be = document.getElementById(ke.id);
        Be && (Be.dataset.ready = "true");
      }
    } catch {
    }
  }
  loadAjaxContent(_e) {
    const ke = this.instance.optionFor(_e, "src") || "";
    this.instance.showLoading(_e);
    const Be = this.instance, Ne = new XMLHttpRequest();
    Be.showLoading(_e), Ne.onreadystatechange = function() {
      Ne.readyState === XMLHttpRequest.DONE && Be.state === rt.Ready && (Be.hideLoading(_e), Ne.status === 200 ? Be.setContent(_e, Ne.responseText) : Be.setError(_e, Ne.status === 404 ? "{{AJAX_NOT_FOUND}}" : "{{AJAX_FORBIDDEN}}"));
    };
    const Ve = _e.ajax || null;
    Ne.open(Ve ? "POST" : "GET", ke + ""), Ne.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), Ne.setRequestHeader("X-Requested-With", "XMLHttpRequest"), Ne.send(Ve), _e.xhr = Ne;
  }
  setInlineContent(_e) {
    let ke = null;
    if (E(_e.src)) ke = _e.src;
    else if (typeof _e.src == "string") {
      const Be = _e.src.split("#", 2).pop();
      ke = Be ? document.getElementById(Be) : null;
    }
    if (ke) {
      if (_e.type === "clone" || ke.closest(".fancybox__slide")) {
        ke = ke.cloneNode(!0);
        const Be = ke.dataset.animationName;
        Be && (ke.classList.remove(Be), delete ke.dataset.animationName);
        let Ne = ke.getAttribute("id");
        Ne = Ne ? `${Ne}--clone` : `clone-${this.instance.id}-${_e.index}`, ke.setAttribute("id", Ne);
      } else if (ke.parentNode) {
        const Be = document.createElement("div");
        Be.classList.add("fancybox-placeholder"), ke.parentNode.insertBefore(Be, ke), _e.placeholderEl = Be;
      }
      this.instance.setContent(_e, ke);
    } else this.instance.setError(_e, "{{ELEMENT_NOT_FOUND}}");
  }
  setIframeContent(_e) {
    const { src: ke, el: Be } = _e;
    if (!ke || typeof ke != "string" || !Be) return;
    Be.classList.add("is-loading");
    const Ne = this.instance, Ve = document.createElement("iframe");
    Ve.className = "fancybox__iframe", Ve.setAttribute("id", `fancybox__iframe_${Ne.id}_${_e.index}`);
    for (const [De, Ae] of Object.entries(this.optionFor(_e, "iframeAttr") || {})) Ve.setAttribute(De, Ae);
    Ve.onerror = () => {
      Ne.setError(_e, "{{IFRAME_ERROR}}");
    }, _e.iframeEl = Ve;
    const Le = this.optionFor(_e, "preload");
    if (_e.type !== "iframe" || Le === !1) return Ve.setAttribute("src", _e.src + ""), Ne.setContent(_e, Ve, !1), this.resizeIframe(_e), void Ne.revealContent(_e);
    Ne.showLoading(_e), Ve.onload = () => {
      if (!Ve.src.length) return;
      const De = Ve.dataset.ready !== "true";
      Ve.dataset.ready = "true", this.resizeIframe(_e), De ? Ne.revealContent(_e) : Ne.hideLoading(_e);
    }, Ve.setAttribute("src", ke), Ne.setContent(_e, Ve, !1);
  }
  resizeIframe(_e) {
    const { type: ke, iframeEl: Be } = _e;
    if (ke === Pt || ke === Ct) return;
    const Ne = Be == null ? void 0 : Be.parentElement;
    if (!Be || !Ne) return;
    let Ve = _e.autoSize;
    Ve === void 0 && (Ve = this.optionFor(_e, "autoSize"));
    let Le = _e.width || 0, De = _e.height || 0;
    Le && De && (Ve = !1);
    const Ae = Ne && Ne.style;
    if (_e.preload !== !1 && Ve !== !1 && Ae) try {
      const Ie = window.getComputedStyle(Ne), Re = parseFloat(Ie.paddingLeft) + parseFloat(Ie.paddingRight), ze = parseFloat(Ie.paddingTop) + parseFloat(Ie.paddingBottom), je = Be.contentWindow;
      if (je) {
        const Fe = je.document, He = Fe.getElementsByTagName(xt)[0], Ge = Fe.body;
        Ae.width = "", Ge.style.overflow = "hidden", Le = Le || He.scrollWidth + Re, Ae.width = `${Le}px`, Ge.style.overflow = "", Ae.flex = "0 0 auto", Ae.height = `${Ge.scrollHeight}px`, De = He.scrollHeight + ze;
      }
    } catch {
    }
    if (Le || De) {
      const Ie = { flex: "0 1 auto", width: "", height: "" };
      Le && Le !== "auto" && (Ie.width = `${Le}px`), De && De !== "auto" && (Ie.height = `${De}px`), Object.assign(Ae, Ie);
    }
  }
  playVideo() {
    const _e = this.instance.getSlide();
    if (!_e) return;
    const { el: ke } = _e;
    if (!ke || !ke.offsetParent || !this.optionFor(_e, "videoAutoplay")) return;
    if (_e.type === Tt) try {
      const Ne = ke.querySelector("video");
      if (Ne) {
        const Ve = Ne.play();
        Ve !== void 0 && Ve.then(() => {
        }).catch((Le) => {
          Ne.muted = !0, Ne.play();
        });
      }
    } catch {
    }
    if (_e.type !== Pt && _e.type !== Ct) return;
    const Be = () => {
      if (_e.iframeEl && _e.iframeEl.contentWindow) {
        let Ne;
        if (_e.iframeEl.dataset.ready === "true") return Ne = _e.type === Pt ? { event: "command", func: "playVideo" } : { method: "play", value: "true" }, Ne && _e.iframeEl.contentWindow.postMessage(JSON.stringify(Ne), "*"), void (_e.poller = void 0);
        _e.type === Pt && (Ne = { event: "listening", id: _e.iframeEl.getAttribute("id") }, _e.iframeEl.contentWindow.postMessage(JSON.stringify(Ne), "*"));
      }
      _e.poller = setTimeout(Be, 250);
    };
    Be();
  }
  processType(_e) {
    if (_e.html) return _e.type = xt, _e.src = _e.html, void (_e.html = "");
    const ke = this.instance.optionFor(_e, "src", "");
    if (!ke || typeof ke != "string") return;
    let Be = _e.type, Ne = null;
    if (Ne = ke.match(/(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(?:watch\?(?:.*&)?v=|v\/|u\/|shorts\/|embed\/?)?(videoseries\?list=(?:.*)|[\w-]{11}|\?listType=(?:.*)&list=(?:.*))(?:.*)/i)) {
      const Ve = this.optionFor(_e, Pt), { nocookie: Le } = Ve, De = function(ze, je) {
        var Fe = {};
        for (var He in ze) Object.prototype.hasOwnProperty.call(ze, He) && je.indexOf(He) < 0 && (Fe[He] = ze[He]);
        if (ze != null && typeof Object.getOwnPropertySymbols == "function") {
          var Ge = 0;
          for (He = Object.getOwnPropertySymbols(ze); Ge < He.length; Ge++) je.indexOf(He[Ge]) < 0 && Object.prototype.propertyIsEnumerable.call(ze, He[Ge]) && (Fe[He[Ge]] = ze[He[Ge]]);
        }
        return Fe;
      }(Ve, ["nocookie"]), Ae = `www.youtube${Le ? "-nocookie" : ""}.com`, Ie = Mt(ke, De), Re = encodeURIComponent(Ne[2]);
      _e.videoId = Re, _e.src = `https://${Ae}/embed/${Re}?${Ie}`, _e.thumbSrc = _e.thumbSrc || `https://i.ytimg.com/vi/${Re}/mqdefault.jpg`, Be = Pt;
    } else if (Ne = ke.match(/^.+vimeo.com\/(?:\/)?([\d]+)((\/|\?h=)([a-z0-9]+))?(.*)?/)) {
      const Ve = Mt(ke, this.optionFor(_e, Ct)), Le = encodeURIComponent(Ne[1]), De = Ne[4] || "";
      _e.videoId = Le, _e.src = `https://player.vimeo.com/video/${Le}?${De ? `h=${De}${Ve ? "&" : ""}` : ""}${Ve}`, Be = Ct;
    }
    if (!Be && _e.triggerEl) {
      const Ve = _e.triggerEl.dataset.type;
      At.includes(Ve) && (Be = Ve);
    }
    Be || typeof ke == "string" && (ke.charAt(0) === "#" ? Be = "inline" : (Ne = ke.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i)) ? (Be = Tt, _e.videoFormat = _e.videoFormat || "video/" + (Ne[1] === "ogv" ? "ogg" : Ne[1])) : ke.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i) ? Be = Et : ke.match(/\.(pdf)((\?|#).*)?$/i) && (Be = "pdf")), (Ne = ke.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:(?:(?:maps\/(?:place\/(?:.*)\/)?\@(.*),(\d+.?\d+?)z))|(?:\?ll=))(.*)?/i)) ? (_e.src = `https://maps.google.${Ne[1]}/?ll=${(Ne[2] ? Ne[2] + "&z=" + Math.floor(parseFloat(Ne[3])) + (Ne[4] ? Ne[4].replace(/^\//, "&") : "") : Ne[4] + "").replace(/\?/, "&")}&output=${Ne[4] && Ne[4].indexOf("layer=c") > 0 ? "svembed" : "embed"}`, Be = St) : (Ne = ke.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:maps\/search\/)(.*)/i)) && (_e.src = `https://maps.google.${Ne[1]}/maps?q=${Ne[2].replace("query=", "q=").replace("api=1", "")}&output=embed`, Be = St), Be = Be || this.instance.option("defaultType"), _e.type = Be, Be === Et && (_e.thumbSrc = _e.thumbSrc || _e.src);
  }
  setContent(_e) {
    const ke = this.instance.optionFor(_e, "src") || "";
    if (_e && _e.type && ke) {
      switch (_e.type) {
        case xt:
          this.instance.setContent(_e, ke);
          break;
        case Tt:
          const Be = this.option("videoTpl");
          Be && this.instance.setContent(_e, Be.replace(/\{\{src\}\}/gi, ke + "").replace(/\{\{format\}\}/gi, this.optionFor(_e, "videoFormat") || "").replace(/\{\{poster\}\}/gi, _e.poster || _e.thumbSrc || ""));
          break;
        case "inline":
        case "clone":
          this.setInlineContent(_e);
          break;
        case "ajax":
          this.loadAjaxContent(_e);
          break;
        case "pdf":
        case St:
        case Pt:
        case Ct:
          _e.preload = !1;
        case "iframe":
          this.setIframeContent(_e);
      }
      this.setAspectRatio(_e);
    }
  }
  setAspectRatio(_e) {
    const ke = _e.contentEl;
    if (!(_e.el && ke && _e.type && [Pt, Ct, Tt].includes(_e.type))) return;
    let Be, Ne = _e.width || "auto", Ve = _e.height || "auto";
    if (Ne === "auto" || Ve === "auto") {
      Be = this.optionFor(_e, "videoRatio");
      const Ie = (Be + "").match(/(\d+)\s*\/\s?(\d+)/);
      Be = Ie && Ie.length > 2 ? parseFloat(Ie[1]) / parseFloat(Ie[2]) : parseFloat(Be + "");
    } else Ne && Ve && (Be = Ne / Ve);
    if (!Be) return;
    ke.style.aspectRatio = "", ke.style.width = "", ke.style.height = "", ke.offsetHeight;
    const Le = ke.getBoundingClientRect(), De = Le.width || 1, Ae = Le.height || 1;
    ke.style.aspectRatio = Be + "", Be < De / Ae ? (Ve = Ve === "auto" ? Ae : Math.min(Ae, Ve), ke.style.width = "auto", ke.style.height = `${Ve}px`) : (Ne = Ne === "auto" ? De : Math.min(De, Ne), ke.style.width = `${Ne}px`, ke.style.height = "auto");
  }
  attach() {
    const _e = this, ke = _e.instance;
    ke.on("Carousel.beforeInitSlide", _e.onBeforeInitSlide), ke.on("Carousel.createSlide", _e.onCreateSlide), ke.on("Carousel.selectSlide", _e.onSelectSlide), ke.on("Carousel.unselectSlide", _e.onUnselectSlide), ke.on("Carousel.Panzoom.refresh", _e.onRefresh), ke.on("done", _e.onDone), ke.on("clearContent", _e.onClearContent), window.addEventListener("message", _e.onMessage);
  }
  detach() {
    const _e = this, ke = _e.instance;
    ke.off("Carousel.beforeInitSlide", _e.onBeforeInitSlide), ke.off("Carousel.createSlide", _e.onCreateSlide), ke.off("Carousel.selectSlide", _e.onSelectSlide), ke.off("Carousel.unselectSlide", _e.onUnselectSlide), ke.off("Carousel.Panzoom.refresh", _e.onRefresh), ke.off("done", _e.onDone), ke.off("clearContent", _e.onClearContent), window.removeEventListener("message", _e.onMessage);
  }
}
Object.defineProperty(Lt, "defaults", { enumerable: !0, configurable: !0, writable: !0, value: Ot });
const zt = "play", Rt = "pause", kt = "ready";
class It extends _ {
  constructor() {
    super(...arguments), Object.defineProperty(this, "state", { enumerable: !0, configurable: !0, writable: !0, value: kt }), Object.defineProperty(this, "inHover", { enumerable: !0, configurable: !0, writable: !0, value: !1 }), Object.defineProperty(this, "timer", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "progressBar", { enumerable: !0, configurable: !0, writable: !0, value: null });
  }
  get isActive() {
    return this.state !== kt;
  }
  onReady(_e) {
    this.option("autoStart") && (_e.isInfinite || _e.page < _e.pages.length - 1) && this.start();
  }
  onChange() {
    this.removeProgressBar(), this.pause();
  }
  onSettle() {
    this.resume();
  }
  onVisibilityChange() {
    document.visibilityState === "visible" ? this.resume() : this.pause();
  }
  onMouseEnter() {
    this.inHover = !0, this.pause();
  }
  onMouseLeave() {
    var _e;
    this.inHover = !1, !((_e = this.instance.panzoom) === null || _e === void 0) && _e.isResting && this.resume();
  }
  onTimerEnd() {
    const _e = this.instance;
    this.state === "play" && (_e.isInfinite || _e.page !== _e.pages.length - 1 ? _e.slideNext() : _e.slideTo(0));
  }
  removeProgressBar() {
    this.progressBar && (this.progressBar.remove(), this.progressBar = null);
  }
  createProgressBar() {
    var _e;
    if (!this.option("showProgress")) return null;
    this.removeProgressBar();
    const ke = this.instance, Be = ((_e = ke.pages[ke.page]) === null || _e === void 0 ? void 0 : _e.slides) || [];
    let Ne = this.option("progressParentEl");
    if (Ne || (Ne = (Be.length === 1 ? Be[0].el : null) || ke.viewport), !Ne) return null;
    const Ve = document.createElement("div");
    return P(Ve, "f-progress"), Ne.prepend(Ve), this.progressBar = Ve, Ve.offsetHeight, Ve;
  }
  set() {
    const _e = this, ke = _e.instance;
    if (ke.pages.length < 2 || _e.timer) return;
    const Be = _e.option("timeout");
    _e.state = zt, P(ke.container, "has-autoplay");
    let Ne = _e.createProgressBar();
    Ne && (Ne.style.transitionDuration = `${Be}ms`, Ne.style.transform = "scaleX(1)"), _e.timer = setTimeout(() => {
      _e.timer = null, _e.inHover || _e.onTimerEnd();
    }, Be), _e.emit("set");
  }
  clear() {
    const _e = this;
    _e.timer && (clearTimeout(_e.timer), _e.timer = null), _e.removeProgressBar();
  }
  start() {
    const _e = this;
    if (_e.set(), _e.state !== kt) {
      if (_e.option("pauseOnHover")) {
        const ke = _e.instance.container;
        ke.addEventListener("mouseenter", _e.onMouseEnter, !1), ke.addEventListener("mouseleave", _e.onMouseLeave, !1);
      }
      document.addEventListener("visibilitychange", _e.onVisibilityChange, !1), _e.emit("start");
    }
  }
  stop() {
    const _e = this, ke = _e.state, Be = _e.instance.container;
    _e.clear(), _e.state = kt, Be.removeEventListener("mouseenter", _e.onMouseEnter, !1), Be.removeEventListener("mouseleave", _e.onMouseLeave, !1), document.removeEventListener("visibilitychange", _e.onVisibilityChange, !1), S(Be, "has-autoplay"), ke !== kt && _e.emit("stop");
  }
  pause() {
    const _e = this;
    _e.state === zt && (_e.state = Rt, _e.clear(), _e.emit(Rt));
  }
  resume() {
    const _e = this, ke = _e.instance;
    if (ke.isInfinite || ke.page !== ke.pages.length - 1) if (_e.state !== zt) {
      if (_e.state === Rt && !_e.inHover) {
        const Be = new Event("resume", { bubbles: !0, cancelable: !0 });
        _e.emit("resume", Be), Be.defaultPrevented || _e.set();
      }
    } else _e.set();
    else _e.stop();
  }
  toggle() {
    this.state === zt || this.state === Rt ? this.stop() : this.start();
  }
  attach() {
    const _e = this, ke = _e.instance;
    ke.on("ready", _e.onReady), ke.on("Panzoom.startAnimation", _e.onChange), ke.on("Panzoom.endAnimation", _e.onSettle), ke.on("Panzoom.touchMove", _e.onChange);
  }
  detach() {
    const _e = this, ke = _e.instance;
    ke.off("ready", _e.onReady), ke.off("Panzoom.startAnimation", _e.onChange), ke.off("Panzoom.endAnimation", _e.onSettle), ke.off("Panzoom.touchMove", _e.onChange), _e.stop();
  }
}
Object.defineProperty(It, "defaults", { enumerable: !0, configurable: !0, writable: !0, value: { autoStart: !0, pauseOnHover: !0, progressParentEl: null, showProgress: !0, timeout: 3e3 } });
class Dt extends _ {
  constructor() {
    super(...arguments), Object.defineProperty(this, "ref", { enumerable: !0, configurable: !0, writable: !0, value: null });
  }
  onPrepare(_e) {
    const ke = _e.carousel;
    if (!ke) return;
    const Be = _e.container;
    Be && (ke.options.Autoplay = u({ autoStart: !1 }, this.option("Autoplay") || {}, { pauseOnHover: !1, timeout: this.option("timeout"), progressParentEl: () => this.option("progressParentEl") || null, on: { start: () => {
      _e.emit("startSlideshow");
    }, set: (Ne) => {
      var Ve;
      Be.classList.add("has-slideshow"), ((Ve = _e.getSlide()) === null || Ve === void 0 ? void 0 : Ve.state) !== lt.Ready && Ne.pause();
    }, stop: () => {
      Be.classList.remove("has-slideshow"), _e.isCompact || _e.endIdle(), _e.emit("endSlideshow");
    }, resume: (Ne, Ve) => {
      var Le, De, Ae;
      !Ve || !Ve.cancelable || ((Le = _e.getSlide()) === null || Le === void 0 ? void 0 : Le.state) === lt.Ready && (!((Ae = (De = _e.carousel) === null || De === void 0 ? void 0 : De.panzoom) === null || Ae === void 0) && Ae.isResting) || Ve.preventDefault();
    } } }), ke.attachPlugins({ Autoplay: It }), this.ref = ke.plugins.Autoplay);
  }
  onReady(_e) {
    const ke = _e.carousel, Be = this.ref;
    Be && ke && this.option("playOnStart") && (ke.isInfinite || ke.page < ke.pages.length - 1) && Be.start();
  }
  onDone(_e, ke) {
    const Be = this.ref, Ne = _e.carousel;
    if (!Be || !Ne) return;
    const Ve = ke.panzoom;
    Ve && Ve.on("startAnimation", () => {
      _e.isCurrentSlide(ke) && Be.stop();
    }), _e.isCurrentSlide(ke) && Be.resume();
  }
  onKeydown(_e, ke) {
    var Be;
    const Ne = this.ref;
    Ne && ke === this.option("key") && ((Be = document.activeElement) === null || Be === void 0 ? void 0 : Be.nodeName) !== "BUTTON" && Ne.toggle();
  }
  attach() {
    const _e = this, ke = _e.instance;
    ke.on("Carousel.init", _e.onPrepare), ke.on("Carousel.ready", _e.onReady), ke.on("done", _e.onDone), ke.on("keydown", _e.onKeydown);
  }
  detach() {
    const _e = this, ke = _e.instance;
    ke.off("Carousel.init", _e.onPrepare), ke.off("Carousel.ready", _e.onReady), ke.off("done", _e.onDone), ke.off("keydown", _e.onKeydown);
  }
}
Object.defineProperty(Dt, "defaults", { enumerable: !0, configurable: !0, writable: !0, value: { key: " ", playOnStart: !1, progressParentEl: ($e) => {
  var _e;
  return ((_e = $e.instance.container) === null || _e === void 0 ? void 0 : _e.querySelector(".fancybox__toolbar [data-fancybox-toggle-slideshow]")) || $e.instance.container;
}, timeout: 3e3 } });
const Ft = { classes: { container: "f-thumbs f-carousel__thumbs", viewport: "f-thumbs__viewport", track: "f-thumbs__track", slide: "f-thumbs__slide", isResting: "is-resting", isSelected: "is-selected", isLoading: "is-loading", hasThumbs: "has-thumbs" }, minCount: 2, parentEl: null, thumbTpl: '<button class="f-thumbs__slide__button" tabindex="0" type="button" aria-label="{{GOTO}}" data-carousel-index="%i"><img class="f-thumbs__slide__img" data-lazy-src="{{%s}}" alt="" /></button>', type: "modern" };
var jt;
(function($e) {
  $e[$e.Init = 0] = "Init", $e[$e.Ready = 1] = "Ready", $e[$e.Hidden = 2] = "Hidden";
})(jt || (jt = {}));
const Bt = "isResting", Ht = "thumbWidth", Nt = "thumbHeight", _t = "thumbClipWidth";
let $t = class extends _ {
  constructor() {
    super(...arguments), Object.defineProperty(this, "type", { enumerable: !0, configurable: !0, writable: !0, value: "modern" }), Object.defineProperty(this, "container", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "track", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "carousel", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "thumbWidth", { enumerable: !0, configurable: !0, writable: !0, value: 0 }), Object.defineProperty(this, "thumbClipWidth", { enumerable: !0, configurable: !0, writable: !0, value: 0 }), Object.defineProperty(this, "thumbHeight", { enumerable: !0, configurable: !0, writable: !0, value: 0 }), Object.defineProperty(this, "thumbGap", { enumerable: !0, configurable: !0, writable: !0, value: 0 }), Object.defineProperty(this, "thumbExtraGap", { enumerable: !0, configurable: !0, writable: !0, value: 0 }), Object.defineProperty(this, "state", { enumerable: !0, configurable: !0, writable: !0, value: jt.Init });
  }
  get isModern() {
    return this.type === "modern";
  }
  onInitSlide($e, _e) {
    const ke = _e.el ? _e.el.dataset : void 0;
    ke && (_e.thumbSrc = ke.thumbSrc || _e.thumbSrc || "", _e[_t] = parseFloat(ke[_t] || "") || _e[_t] || 0, _e[Nt] = parseFloat(ke.thumbHeight || "") || _e[Nt] || 0), this.addSlide(_e);
  }
  onInitSlides() {
    this.build();
  }
  onChange() {
    var $e;
    if (!this.isModern) return;
    const _e = this.container, ke = this.instance, Be = ke.panzoom, Ne = this.carousel, Ve = Ne ? Ne.panzoom : null, Le = ke.page;
    if (Be && Ne && Ve) {
      if (Be.isDragging) {
        S(_e, this.cn(Bt));
        let De = (($e = Ne.pages[Le]) === null || $e === void 0 ? void 0 : $e.pos) || 0;
        De += ke.getProgress(Le) * (this[_t] + this.thumbGap);
        let Ae = Ve.getBounds();
        -1 * De > Ae.x.min && -1 * De < Ae.x.max && Ve.panTo({ x: -1 * De, friction: 0.12 });
      } else o(_e, this.cn(Bt), Be.isResting);
      this.shiftModern();
    }
  }
  onRefresh() {
    this.updateProps();
    for (const $e of this.instance.slides || []) this.resizeModernSlide($e);
    this.shiftModern();
  }
  isDisabled() {
    const $e = this.option("minCount") || 0;
    if ($e) {
      const ke = this.instance;
      let Be = 0;
      for (const Ne of ke.slides || []) Ne.thumbSrc && Be++;
      if (Be < $e) return !0;
    }
    const _e = this.option("type");
    return ["modern", "classic"].indexOf(_e) < 0;
  }
  getThumb($e) {
    const _e = this.option("thumbTpl") || "";
    return { html: this.instance.localize(_e, [["%i", $e.index], ["%d", $e.index + 1], ["%s", $e.thumbSrc || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"]]) };
  }
  addSlide($e) {
    const _e = this.carousel;
    _e && _e.addSlide($e.index, this.getThumb($e));
  }
  getSlides() {
    const $e = [];
    for (const _e of this.instance.slides || []) $e.push(this.getThumb(_e));
    return $e;
  }
  resizeModernSlide($e) {
    this.isModern && ($e[Ht] = $e[_t] && $e[Nt] ? Math.round(this[Nt] * ($e[_t] / $e[Nt])) : this[Ht]);
  }
  updateProps() {
    const $e = this.container;
    if (!$e) return;
    const _e = (ke) => parseFloat(getComputedStyle($e).getPropertyValue("--f-thumb-" + ke)) || 0;
    this.thumbGap = _e("gap"), this.thumbExtraGap = _e("extra-gap"), this[Ht] = _e("width") || 40, this[_t] = _e("clip-width") || 40, this[Nt] = _e("height") || 40;
  }
  build() {
    const $e = this;
    if ($e.state !== jt.Init) return;
    if ($e.isDisabled()) return void $e.emit("disabled");
    const _e = $e.instance, ke = _e.container, Be = $e.getSlides(), Ne = $e.option("type");
    $e.type = Ne;
    const Ve = $e.option("parentEl"), Le = $e.cn("container"), De = $e.cn("track");
    let Ae = Ve == null ? void 0 : Ve.querySelector("." + Le);
    Ae || (Ae = document.createElement("div"), P(Ae, Le), Ve ? Ve.appendChild(Ae) : ke.after(Ae)), P(Ae, `is-${Ne}`), P(ke, $e.cn("hasThumbs")), $e.container = Ae, $e.updateProps();
    let Ie = Ae.querySelector("." + De);
    Ie || (Ie = document.createElement("div"), P(Ie, $e.cn("track")), Ae.appendChild(Ie)), $e.track = Ie;
    const Re = u({}, { track: Ie, infinite: !1, center: !0, fill: Ne === "classic", dragFree: !0, slidesPerPage: 1, transition: !1, preload: 0.25, friction: 0.12, Panzoom: { maxVelocity: 0 }, Dots: !1, Navigation: !1, classes: { container: "f-thumbs", viewport: "f-thumbs__viewport", track: "f-thumbs__track", slide: "f-thumbs__slide" } }, $e.option("Carousel") || {}, { Sync: { target: _e }, slides: Be }), ze = new _e.constructor(Ae, Re);
    ze.on("createSlide", (je, Fe) => {
      $e.setProps(Fe.index), $e.emit("createSlide", Fe, Fe.el);
    }), ze.on("ready", () => {
      $e.shiftModern(), $e.emit("ready");
    }), ze.on("refresh", () => {
      $e.shiftModern();
    }), ze.on("Panzoom.click", (je, Fe, He) => {
      $e.onClick(He);
    }), $e.carousel = ze, $e.state = jt.Ready;
  }
  onClick($e) {
    $e.preventDefault(), $e.stopPropagation();
    const _e = this.instance, { pages: ke, page: Be } = _e, Ne = (Ge) => {
      if (Ge) {
        const qe = Ge.closest("[data-carousel-index]");
        if (qe) return [parseInt(qe.dataset.carouselIndex || "", 10) || 0, qe];
      }
      return [-1, void 0];
    }, Ve = (Ge, qe) => {
      const Xe = document.elementFromPoint(Ge, qe);
      return Xe ? Ne(Xe) : [-1, void 0];
    };
    let [Le, De] = Ne($e.target);
    if (Le > -1) return;
    const Ae = this[_t], Ie = $e.clientX, Re = $e.clientY;
    let [ze, je] = Ve(Ie - Ae, Re), [Fe, He] = Ve(Ie + Ae, Re);
    je && He ? (Le = Math.abs(Ie - je.getBoundingClientRect().right) < Math.abs(Ie - He.getBoundingClientRect().left) ? ze : Fe, Le === Be && (Le = Le === ze ? Fe : ze)) : je ? Le = ze : He && (Le = Fe), Le > -1 && ke[Le] && _e.slideTo(Le);
  }
  getShift($e) {
    var _e;
    const ke = this, { instance: Be } = ke, Ne = ke.carousel;
    if (!Be || !Ne) return 0;
    const Ve = ke[Ht], Le = ke[_t], De = ke.thumbGap, Ae = ke.thumbExtraGap;
    if (!(!((_e = Ne.slides[$e]) === null || _e === void 0) && _e.el)) return 0;
    const Ie = 0.5 * (Ve - Le), Re = Be.pages.length - 1;
    let ze = Be.getProgress(0), je = Be.getProgress(Re), Fe = Be.getProgress($e, !1, !0), He = 0, Ge = Ie + Ae + De;
    const qe = ze < 0 && ze > -1, Xe = je > 0 && je < 1;
    return $e === 0 ? (He = Ge * Math.abs(ze), Xe && ze === 1 && (He -= Ge * Math.abs(je))) : $e === Re ? (He = Ge * Math.abs(je) * -1, qe && je === -1 && (He += Ge * Math.abs(ze))) : qe || Xe ? (He = -1 * Ge, He += Ge * Math.abs(ze), He += Ge * (1 - Math.abs(je))) : He = Ge * Fe, He;
  }
  setProps($e) {
    var _e;
    const ke = this;
    if (!ke.isModern) return;
    const { instance: Be } = ke, Ne = ke.carousel;
    if (Be && Ne) {
      const Ve = (_e = Ne.slides[$e]) === null || _e === void 0 ? void 0 : _e.el;
      if (Ve && Ve.childNodes.length) {
        let Le = t(1 - Math.abs(Be.getProgress($e))), De = t(ke.getShift($e));
        Ve.style.setProperty("--progress", Le ? Le + "" : ""), Ve.style.setProperty("--shift", De + "");
      }
    }
  }
  shiftModern() {
    const $e = this;
    if (!$e.isModern) return;
    const { instance: _e, track: ke } = $e, Be = _e.panzoom, Ne = $e.carousel;
    if (!(_e && ke && Be && Ne) || Be.state === m.Init || Be.state === m.Destroy) return;
    for (const Le of _e.slides) $e.setProps(Le.index);
    let Ve = ($e[_t] + $e.thumbGap) * (Ne.slides.length || 0);
    ke.style.setProperty("--width", Ve + "");
  }
  cleanup() {
    const $e = this;
    $e.carousel && $e.carousel.destroy(), $e.carousel = null, $e.container && $e.container.remove(), $e.container = null, $e.track && $e.track.remove(), $e.track = null, $e.state = jt.Init, S($e.instance.container, $e.cn("hasThumbs"));
  }
  attach() {
    const $e = this, _e = $e.instance;
    _e.on("initSlide", $e.onInitSlide), _e.state === B.Init ? _e.on("initSlides", $e.onInitSlides) : $e.onInitSlides(), _e.on(["change", "Panzoom.afterTransform"], $e.onChange), _e.on("Panzoom.refresh", $e.onRefresh);
  }
  detach() {
    const $e = this, _e = $e.instance;
    _e.off("initSlide", $e.onInitSlide), _e.off("initSlides", $e.onInitSlides), _e.off(["change", "Panzoom.afterTransform"], $e.onChange), _e.off("Panzoom.refresh", $e.onRefresh), $e.cleanup();
  }
};
Object.defineProperty($t, "defaults", { enumerable: !0, configurable: !0, writable: !0, value: Ft });
const Wt = Object.assign(Object.assign({}, Ft), { key: "t", showOnStart: !0, parentEl: null }), Xt = "is-masked", qt = "aria-hidden";
class Yt extends _ {
  constructor() {
    super(...arguments), Object.defineProperty(this, "ref", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "hidden", { enumerable: !0, configurable: !0, writable: !0, value: !1 });
  }
  get isEnabled() {
    const _e = this.ref;
    return _e && !_e.isDisabled();
  }
  get isHidden() {
    return this.hidden;
  }
  onClick(_e, ke) {
    ke.stopPropagation();
  }
  onCreateSlide(_e, ke) {
    var Be, Ne, Ve;
    const Le = ((Ve = (Ne = (Be = this.instance) === null || Be === void 0 ? void 0 : Be.carousel) === null || Ne === void 0 ? void 0 : Ne.slides[ke.index]) === null || Ve === void 0 ? void 0 : Ve.type) || "", De = ke.el;
    if (De && Le) {
      let Ae = `for-${Le}`;
      ["video", "youtube", "vimeo", "html5video"].includes(Le) && (Ae += " for-video"), P(De, Ae);
    }
  }
  onInit() {
    var _e;
    const ke = this, Be = ke.instance, Ne = Be.carousel;
    if (ke.ref || !Ne) return;
    const Ve = ke.option("parentEl") || Be.footer || Be.container;
    if (!Ve) return;
    const Le = u({}, ke.options, { parentEl: Ve, classes: { container: "f-thumbs fancybox__thumbs" }, Carousel: { Sync: { friction: Be.option("Carousel.friction") || 0 } }, on: { ready: (De) => {
      const Ae = De.container;
      Ae && this.hidden && (ke.refresh(), Ae.style.transition = "none", ke.hide(), Ae.offsetHeight, queueMicrotask(() => {
        Ae.style.transition = "", ke.show();
      }));
    } } });
    Le.Carousel = Le.Carousel || {}, Le.Carousel.on = u(((_e = ke.options.Carousel) === null || _e === void 0 ? void 0 : _e.on) || {}, { click: this.onClick, createSlide: this.onCreateSlide }), Ne.options.Thumbs = Le, Ne.attachPlugins({ Thumbs: $t }), ke.ref = Ne.plugins.Thumbs, ke.option("showOnStart") || (ke.ref.state = jt.Hidden, ke.hidden = !0);
  }
  onResize() {
    var _e;
    const ke = (_e = this.ref) === null || _e === void 0 ? void 0 : _e.container;
    ke && (ke.style.maxHeight = "");
  }
  onKeydown(_e, ke) {
    const Be = this.option("key");
    Be && Be === ke && this.toggle();
  }
  toggle() {
    const _e = this.ref;
    if (_e && !_e.isDisabled()) return _e.state === jt.Hidden ? (_e.state = jt.Init, void _e.build()) : void (this.hidden ? this.show() : this.hide());
  }
  show() {
    const _e = this.ref;
    if (!_e || _e.isDisabled()) return;
    const ke = _e.container;
    ke && (this.refresh(), ke.offsetHeight, ke.removeAttribute(qt), ke.classList.remove(Xt), this.hidden = !1);
  }
  hide() {
    const _e = this.ref, ke = _e && _e.container;
    ke && (this.refresh(), ke.offsetHeight, ke.classList.add(Xt), ke.setAttribute(qt, "true")), this.hidden = !0;
  }
  refresh() {
    const _e = this.ref;
    if (!_e || !_e.state) return;
    const ke = _e.container, Be = (ke == null ? void 0 : ke.firstChild) || null;
    ke && Be && Be.childNodes.length && (ke.style.maxHeight = `${Be.getBoundingClientRect().height}px`);
  }
  attach() {
    const _e = this, ke = _e.instance;
    ke.state === rt.Init ? ke.on("Carousel.init", _e.onInit) : _e.onInit(), ke.on("resize", _e.onResize), ke.on("keydown", _e.onKeydown);
  }
  detach() {
    var _e;
    const ke = this, Be = ke.instance;
    Be.off("Carousel.init", ke.onInit), Be.off("resize", ke.onResize), Be.off("keydown", ke.onKeydown), (_e = Be.carousel) === null || _e === void 0 || _e.detachPlugins(["Thumbs"]), ke.ref = null;
  }
}
Object.defineProperty(Yt, "defaults", { enumerable: !0, configurable: !0, writable: !0, value: Wt });
const Vt = { panLeft: { icon: '<svg><path d="M5 12h14M5 12l6 6M5 12l6-6"/></svg>', change: { panX: -100 } }, panRight: { icon: '<svg><path d="M5 12h14M13 18l6-6M13 6l6 6"/></svg>', change: { panX: 100 } }, panUp: { icon: '<svg><path d="M12 5v14M18 11l-6-6M6 11l6-6"/></svg>', change: { panY: -100 } }, panDown: { icon: '<svg><path d="M12 5v14M18 13l-6 6M6 13l6 6"/></svg>', change: { panY: 100 } }, zoomIn: { icon: '<svg><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>', action: "zoomIn" }, zoomOut: { icon: '<svg><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>', action: "zoomOut" }, toggle1to1: { icon: '<svg><path d="M3.51 3.07c5.74.02 11.48-.02 17.22.02 1.37.1 2.34 1.64 2.18 3.13 0 4.08.02 8.16 0 12.23-.1 1.54-1.47 2.64-2.79 2.46-5.61-.01-11.24.02-16.86-.01-1.36-.12-2.33-1.65-2.17-3.14 0-4.07-.02-8.16 0-12.23.1-1.36 1.22-2.48 2.42-2.46Z"/><path d="M5.65 8.54h1.49v6.92m8.94-6.92h1.49v6.92M11.5 9.4v.02m0 5.18v0"/></svg>', action: "toggleZoom" }, toggleZoom: { icon: '<svg><g><line x1="11" y1="8" x2="11" y2="14"></line></g><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>', action: "toggleZoom" }, iterateZoom: { icon: '<svg><g><line x1="11" y1="8" x2="11" y2="14"></line></g><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>', action: "iterateZoom" }, rotateCCW: { icon: '<svg><path d="M15 4.55a8 8 0 0 0-6 14.9M9 15v5H4M18.37 7.16v.01M13 19.94v.01M16.84 18.37v.01M19.37 15.1v.01M19.94 11v.01"/></svg>', action: "rotateCCW" }, rotateCW: { icon: '<svg><path d="M9 4.55a8 8 0 0 1 6 14.9M15 15v5h5M5.63 7.16v.01M4.06 11v.01M4.63 15.1v.01M7.16 18.37v.01M11 19.94v.01"/></svg>', action: "rotateCW" }, flipX: { icon: '<svg style="stroke-width: 1.3"><path d="M12 3v18M16 7v10h5L16 7M8 7v10H3L8 7"/></svg>', action: "flipX" }, flipY: { icon: '<svg style="stroke-width: 1.3"><path d="M3 12h18M7 16h10L7 21v-5M7 8h10L7 3v5"/></svg>', action: "flipY" }, fitX: { icon: '<svg><path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M10 18H3M21 18h-7M6 15l-3 3 3 3M18 15l3 3-3 3"/></svg>', action: "fitX" }, fitY: { icon: '<svg><path d="M12 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6M18 14v7M18 3v7M15 18l3 3 3-3M15 6l3-3 3 3"/></svg>', action: "fitY" }, reset: { icon: '<svg><path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/></svg>', action: "reset" }, toggleFS: { icon: '<svg><g><path d="M14.5 9.5 21 3m0 0h-6m6 0v6M3 21l6.5-6.5M3 21v-6m0 6h6"/></g><g><path d="m14 10 7-7m-7 7h6m-6 0V4M3 21l7-7m0 0v6m0-6H4"/></g></svg>', action: "toggleFS" } };
var Zt;
(function($e) {
  $e[$e.Init = 0] = "Init", $e[$e.Ready = 1] = "Ready", $e[$e.Disabled = 2] = "Disabled";
})(Zt || (Zt = {}));
const Ut = { absolute: "auto", display: { left: ["infobar"], middle: [], right: ["iterateZoom", "slideshow", "fullscreen", "thumbs", "close"] }, enabled: "auto", items: { infobar: { tpl: '<div class="fancybox__infobar" tabindex="-1"><span data-fancybox-current-index></span>/<span data-fancybox-count></span></div>' }, download: { tpl: '<a class="f-button" title="{{DOWNLOAD}}" data-fancybox-download href="javasript:;"><svg><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12"/></svg></a>' }, prev: { tpl: '<button class="f-button" title="{{PREV}}" data-fancybox-prev><svg><path d="m15 6-6 6 6 6"/></svg></button>' }, next: { tpl: '<button class="f-button" title="{{NEXT}}" data-fancybox-next><svg><path d="m9 6 6 6-6 6"/></svg></button>' }, slideshow: { tpl: '<button class="f-button" title="{{TOGGLE_SLIDESHOW}}" data-fancybox-toggle-slideshow><svg><g><path d="M8 4v16l13 -8z"></path></g><g><path d="M8 4v15M17 4v15"/></g></svg></button>' }, fullscreen: { tpl: '<button class="f-button" title="{{TOGGLE_FULLSCREEN}}" data-fancybox-toggle-fullscreen><svg><g><path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v2M16 20h2a2 2 0 0 0 2-2v-2"/></g><g><path d="M15 19v-2a2 2 0 0 1 2-2h2M15 5v2a2 2 0 0 0 2 2h2M5 15h2a2 2 0 0 1 2 2v2M5 9h2a2 2 0 0 0 2-2V5"/></g></svg></button>' }, thumbs: { tpl: '<button class="f-button" title="{{TOGGLE_THUMBS}}" data-fancybox-toggle-thumbs><svg><circle cx="5.5" cy="5.5" r="1"/><circle cx="12" cy="5.5" r="1"/><circle cx="18.5" cy="5.5" r="1"/><circle cx="5.5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18.5" cy="12" r="1"/><circle cx="5.5" cy="18.5" r="1"/><circle cx="12" cy="18.5" r="1"/><circle cx="18.5" cy="18.5" r="1"/></svg></button>' }, close: { tpl: '<button class="f-button" title="{{CLOSE}}" data-fancybox-close><svg><path d="m19.5 4.5-15 15M4.5 4.5l15 15"/></svg></button>' } }, parentEl: null }, Gt = { tabindex: "-1", width: "24", height: "24", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg" }, Kt = "has-toolbar", Jt = "fancybox__toolbar";
class Qt extends _ {
  constructor() {
    super(...arguments), Object.defineProperty(this, "state", { enumerable: !0, configurable: !0, writable: !0, value: Zt.Init }), Object.defineProperty(this, "container", { enumerable: !0, configurable: !0, writable: !0, value: null });
  }
  onReady(_e) {
    var ke;
    if (!_e.carousel) return;
    let Be = this.option("display"), Ne = this.option("absolute"), Ve = this.option("enabled");
    if (Ve === "auto") {
      const Ie = this.instance.carousel;
      let Re = 0;
      if (Ie) for (const ze of Ie.slides) (ze.panzoom || ze.type === "image") && Re++;
      Re || (Ve = !1);
    }
    Ve || (Be = void 0);
    let Le = 0;
    const De = { left: [], middle: [], right: [] };
    if (Be) for (const Ie of ["left", "middle", "right"]) for (const Re of Be[Ie]) {
      const ze = this.createEl(Re);
      ze && ((ke = De[Ie]) === null || ke === void 0 || ke.push(ze), Le++);
    }
    let Ae = null;
    if (Le && (Ae = this.createContainer()), Ae) {
      for (const [Ie, Re] of Object.entries(De)) {
        const ze = document.createElement("div");
        P(ze, Jt + "__column is-" + Ie);
        for (const je of Re) ze.appendChild(je);
        Ne !== "auto" || Ie !== "middle" || Re.length || (Ne = !0), Ae.appendChild(ze);
      }
      Ne === !0 && P(Ae, "is-absolute"), this.state = Zt.Ready, this.onRefresh();
    } else this.state = Zt.Disabled;
  }
  onClick(_e) {
    var ke, Be;
    const Ne = this.instance, Ve = Ne.getSlide(), Le = Ve == null ? void 0 : Ve.panzoom, De = _e.target, Ae = De && E(De) ? De.dataset : null;
    if (!Ae) return;
    if (Ae.fancyboxToggleThumbs !== void 0) return _e.preventDefault(), _e.stopPropagation(), void ((ke = Ne.plugins.Thumbs) === null || ke === void 0 || ke.toggle());
    if (Ae.fancyboxToggleFullscreen !== void 0) return _e.preventDefault(), _e.stopPropagation(), void this.instance.toggleFullscreen();
    if (Ae.fancyboxToggleSlideshow !== void 0) {
      _e.preventDefault(), _e.stopPropagation();
      const ze = (Be = Ne.carousel) === null || Be === void 0 ? void 0 : Be.plugins.Autoplay;
      let je = ze.isActive;
      return Le && Le.panMode === "mousemove" && !je && Le.reset(), void (je ? ze.stop() : ze.start());
    }
    const Ie = Ae.panzoomAction, Re = Ae.panzoomChange;
    if ((Re || Ie) && (_e.preventDefault(), _e.stopPropagation()), Re) {
      let ze = {};
      try {
        ze = JSON.parse(Re);
      } catch {
      }
      Le && Le.applyChange(ze);
    } else Ie && Le && Le[Ie] && Le[Ie]();
  }
  onChange() {
    this.onRefresh();
  }
  onRefresh() {
    if (this.instance.isClosing()) return;
    const _e = this.container;
    if (!_e) return;
    const ke = this.instance.getSlide();
    if (!ke || ke.state !== lt.Ready) return;
    const Be = ke && !ke.error && ke.panzoom;
    for (const Le of _e.querySelectorAll("[data-panzoom-action]")) Be ? (Le.removeAttribute("disabled"), Le.removeAttribute("tabindex")) : (Le.setAttribute("disabled", ""), Le.setAttribute("tabindex", "-1"));
    let Ne = Be && Be.canZoomIn(), Ve = Be && Be.canZoomOut();
    for (const Le of _e.querySelectorAll('[data-panzoom-action="zoomIn"]')) Ne ? (Le.removeAttribute("disabled"), Le.removeAttribute("tabindex")) : (Le.setAttribute("disabled", ""), Le.setAttribute("tabindex", "-1"));
    for (const Le of _e.querySelectorAll('[data-panzoom-action="zoomOut"]')) Ve ? (Le.removeAttribute("disabled"), Le.removeAttribute("tabindex")) : (Le.setAttribute("disabled", ""), Le.setAttribute("tabindex", "-1"));
    for (const Le of _e.querySelectorAll('[data-panzoom-action="toggleZoom"],[data-panzoom-action="iterateZoom"]')) {
      Ve || Ne ? (Le.removeAttribute("disabled"), Le.removeAttribute("tabindex")) : (Le.setAttribute("disabled", ""), Le.setAttribute("tabindex", "-1"));
      const De = Le.querySelector("g");
      De && (De.style.display = Ne ? "" : "none");
    }
  }
  onDone(_e, ke) {
    var Be;
    (Be = ke.panzoom) === null || Be === void 0 || Be.on("afterTransform", () => {
      this.instance.isCurrentSlide(ke) && this.onRefresh();
    }), this.instance.isCurrentSlide(ke) && this.onRefresh();
  }
  createContainer() {
    const _e = this.instance.container;
    if (!_e) return null;
    const ke = this.option("parentEl") || _e;
    let Be = ke.querySelector("." + Jt);
    return Be || (Be = document.createElement("div"), P(Be, Jt), ke.prepend(Be)), Be.addEventListener("click", this.onClick, { passive: !1, capture: !0 }), _e && P(_e, Kt), this.container = Be, Be;
  }
  createEl(_e) {
    const ke = this.instance, Be = ke.carousel;
    if (!Be || _e === "toggleFS" || _e === "fullscreen" && !ot()) return null;
    let Ne = null;
    const Ve = Be.slides.length || 0;
    let Le = 0, De = 0;
    for (const Ie of Be.slides) (Ie.panzoom || Ie.type === "image") && Le++, (Ie.type === "image" || Ie.downloadSrc) && De++;
    if (Ve < 2 && ["infobar", "prev", "next"].includes(_e)) return Ne;
    if (Vt[_e] !== void 0 && !Le || _e === "download" && !De) return null;
    if (_e === "thumbs") {
      const Ie = ke.plugins.Thumbs;
      if (!Ie || !Ie.isEnabled) return null;
    }
    if (_e === "slideshow" && (!Be.plugins.Autoplay || Ve < 2))
      return null;
    if (Vt[_e] !== void 0) {
      const Ie = Vt[_e];
      Ne = document.createElement("button"), Ne.setAttribute("title", this.instance.localize(`{{${_e.toUpperCase()}}}`)), P(Ne, "f-button"), Ie.action && (Ne.dataset.panzoomAction = Ie.action), Ie.change && (Ne.dataset.panzoomChange = JSON.stringify(Ie.change)), Ne.appendChild(n(this.instance.localize(Ie.icon)));
    } else {
      const Ie = (this.option("items") || [])[_e];
      Ie && (Ne = n(this.instance.localize(Ie.tpl)), typeof Ie.click == "function" && Ne.addEventListener("click", (Re) => {
        Re.preventDefault(), Re.stopPropagation(), typeof Ie.click == "function" && Ie.click.call(this, this, Re);
      }));
    }
    const Ae = Ne == null ? void 0 : Ne.querySelector("svg");
    if (Ae) for (const [Ie, Re] of Object.entries(Gt)) Ae.getAttribute(Ie) || Ae.setAttribute(Ie, String(Re));
    return Ne;
  }
  removeContainer() {
    const _e = this.container;
    _e && _e.remove(), this.container = null, this.state = Zt.Disabled;
    const ke = this.instance.container;
    ke && S(ke, Kt);
  }
  attach() {
    const _e = this, ke = _e.instance;
    ke.on("Carousel.initSlides", _e.onReady), ke.on("done", _e.onDone), ke.on(["reveal", "Carousel.change"], _e.onChange), _e.onReady(_e.instance);
  }
  detach() {
    const _e = this, ke = _e.instance;
    ke.off("Carousel.initSlides", _e.onReady), ke.off("done", _e.onDone), ke.off(["reveal", "Carousel.change"], _e.onChange), _e.removeContainer();
  }
}
Object.defineProperty(Qt, "defaults", { enumerable: !0, configurable: !0, writable: !0, value: Ut });
const te = { Hash: class extends _ {
  onReady() {
    ht = !1;
  }
  onChange($e) {
    ut && clearTimeout(ut);
    const { hash: _e } = pt(), { hash: ke } = ft(), Be = $e.isOpeningSlide($e.getSlide());
    Be && (ct = ke === _e ? "" : ke), _e && _e !== ke && (ut = setTimeout(() => {
      try {
        if ($e.state === rt.Ready) {
          let Ne = "replaceState";
          Be && !dt && (Ne = "pushState", dt = !0), window.history[Ne]({}, document.title, window.location.pathname + window.location.search + _e);
        }
      } catch {
      }
    }, 300));
  }
  onClose($e) {
    if (ut && clearTimeout(ut), !ht && dt) return dt = !1, ht = !1, void window.history.back();
    if (!ht) try {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search + (ct || ""));
    } catch {
    }
  }
  attach() {
    const $e = this.instance;
    $e.on("ready", this.onReady), $e.on(["Carousel.ready", "Carousel.change"], this.onChange), $e.on("close", this.onClose);
  }
  detach() {
    const $e = this.instance;
    $e.off("ready", this.onReady), $e.off(["Carousel.ready", "Carousel.change"], this.onChange), $e.off("close", this.onClose);
  }
  static parseURL() {
    return ft();
  }
  static startFromUrl() {
    gt();
  }
  static destroy() {
    window.removeEventListener("hashchange", vt, !1);
  }
}, Html: Lt, Images: wt, Slideshow: Dt, Thumbs: Yt, Toolbar: Qt }, ee = "with-fancybox", ie = "hide-scrollbar", ne = "--fancybox-scrollbar-compensate", se = "--fancybox-body-margin", oe = "aria-hidden", ae = "is-using-tab", re = "is-animated", le = "is-compact", ce = "is-loading", he = "is-opening", de = "has-caption", ue = "disabled", pe = "tabindex", fe = "download", ge = "href", me = "src", ve = ($e) => typeof $e == "string", be = function() {
  var $e = window.getSelection();
  return !!$e && $e.type === "Range";
};
let ye, we = null, xe = null, Ee = 0, Se = 0, Pe = 0, Ce = 0;
const Te = /* @__PURE__ */ new Map();
let Me = 0;
class Oe extends g {
  get isIdle() {
    return this.idle;
  }
  get isCompact() {
    return this.option("compact");
  }
  constructor(_e = [], ke = {}, Be = {}) {
    super(ke), Object.defineProperty(this, "userSlides", { enumerable: !0, configurable: !0, writable: !0, value: [] }), Object.defineProperty(this, "userPlugins", { enumerable: !0, configurable: !0, writable: !0, value: {} }), Object.defineProperty(this, "idle", { enumerable: !0, configurable: !0, writable: !0, value: !1 }), Object.defineProperty(this, "idleTimer", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "clickTimer", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "pwt", { enumerable: !0, configurable: !0, writable: !0, value: 0 }), Object.defineProperty(this, "ignoreFocusChange", { enumerable: !0, configurable: !0, writable: !0, value: !1 }), Object.defineProperty(this, "startedFs", { enumerable: !0, configurable: !0, writable: !0, value: !1 }), Object.defineProperty(this, "state", { enumerable: !0, configurable: !0, writable: !0, value: rt.Init }), Object.defineProperty(this, "id", { enumerable: !0, configurable: !0, writable: !0, value: 0 }), Object.defineProperty(this, "container", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "caption", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "footer", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "carousel", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "lastFocus", { enumerable: !0, configurable: !0, writable: !0, value: null }), Object.defineProperty(this, "prevMouseMoveEvent", { enumerable: !0, configurable: !0, writable: !0, value: void 0 }), ye || (ye = ot()), this.id = ke.id || ++Me, Te.set(this.id, this), this.userSlides = _e, this.userPlugins = Be, queueMicrotask(() => {
      this.init();
    });
  }
  init() {
    if (this.state === rt.Destroy) return;
    this.state = rt.Init, this.attachPlugins(Object.assign(Object.assign({}, Oe.Plugins), this.userPlugins)), this.emit("init"), this.emit("attachPlugins"), this.option("hideScrollbar") === !0 && (() => {
      if (!et) return;
      const ke = document, Be = ke.body, Ne = ke.documentElement;
      if (Be.classList.contains(ie)) return;
      let Ve = window.innerWidth - Ne.getBoundingClientRect().width;
      const Le = parseFloat(window.getComputedStyle(Be).marginRight);
      Ve < 0 && (Ve = 0), Ne.style.setProperty(ne, `${Ve}px`), Le && Be.style.setProperty(se, `${Le}px`), Be.classList.add(ie);
    })(), this.initLayout(), this.scale();
    const _e = () => {
      this.initCarousel(this.userSlides), this.state = rt.Ready, this.attachEvents(), this.emit("ready"), setTimeout(() => {
        this.container && this.container.setAttribute(oe, "false");
      }, 16);
    };
    this.option("Fullscreen.autoStart") && ye && !ye.isFullscreen() ? ye.request().then(() => {
      this.startedFs = !0, _e();
    }).catch(() => _e()) : _e();
  }
  initLayout() {
    var _e, ke;
    const Be = this.option("parentEl") || document.body, Ne = n(this.localize(this.option("tpl.main") || ""));
    if (Ne) {
      if (Ne.setAttribute("id", `fancybox-${this.id}`), Ne.setAttribute("aria-label", this.localize("{{MODAL}}")), Ne.classList.toggle(le, this.isCompact), P(Ne, this.option("mainClass") || ""), P(Ne, he), this.container = Ne, this.footer = Ne.querySelector(".fancybox__footer"), Be.appendChild(Ne), P(document.documentElement, ee), we && xe || (we = document.createElement("span"), P(we, "fancybox-focus-guard"), we.setAttribute(pe, "0"), we.setAttribute(oe, "true"), we.setAttribute("aria-label", "Focus guard"), xe = we.cloneNode(), (_e = Ne.parentElement) === null || _e === void 0 || _e.insertBefore(we, Ne), (ke = Ne.parentElement) === null || ke === void 0 || ke.append(xe)), Ne.addEventListener("mousedown", (Ve) => {
        Ee = Ve.pageX, Se = Ve.pageY, S(Ne, ae);
      }), this.option("closeExisting")) for (const Ve of Te.values()) Ve.id !== this.id && Ve.close();
      else this.option("animated") && (P(Ne, re), setTimeout(() => {
        this.isClosing() || S(Ne, re);
      }, 350));
      this.emit("initLayout");
    }
  }
  initCarousel(_e) {
    const ke = this.container;
    if (!ke) return;
    const Be = ke.querySelector(".fancybox__carousel");
    if (!Be) return;
    const Ne = this.carousel = new Q(Be, u({}, { slides: _e, transition: "fade", Panzoom: { lockAxis: this.option("dragToClose") ? "xy" : "x", infinite: !!this.option("dragToClose") && "y" }, Dots: !1, Navigation: { classes: { container: "fancybox__nav", button: "f-button", isNext: "is-next", isPrev: "is-prev" } }, initialPage: this.option("startIndex"), l10n: this.option("l10n") }, this.option("Carousel") || {}));
    Ne.on("*", (Ve, Le, ...De) => {
      this.emit(`Carousel.${Le}`, Ve, ...De);
    }), Ne.on(["ready", "change"], () => {
      this.manageCaption();
    }), this.on("Carousel.removeSlide", (Ve, Le, De) => {
      this.clearContent(De), De.state = void 0;
    }), Ne.on("Panzoom.touchStart", () => {
      var Ve, Le;
      this.isCompact || this.endIdle(), !((Ve = document.activeElement) === null || Ve === void 0) && Ve.closest(".f-thumbs") && ((Le = this.container) === null || Le === void 0 || Le.focus());
    }), Ne.on("settle", () => {
      this.idleTimer || this.isCompact || !this.option("idle") || this.setIdle(), this.option("autoFocus") && !this.isClosing && this.checkFocus();
    }), this.option("dragToClose") && (Ne.on("Panzoom.afterTransform", (Ve, Le) => {
      const De = this.getSlide();
      if (De && e(De.el)) return;
      const Ae = this.container;
      if (Ae) {
        const Ie = Math.abs(Le.current.f), Re = Ie < 1 ? "" : Math.max(0.5, Math.min(1, 1 - Ie / Le.contentRect.fitHeight * 1.5));
        Ae.style.setProperty("--fancybox-ts", Re ? "0s" : ""), Ae.style.setProperty("--fancybox-opacity", Re + "");
      }
    }), Ne.on("Panzoom.touchEnd", (Ve, Le, De) => {
      var Ae;
      const Ie = this.getSlide();
      if (Ie && e(Ie.el) || Le.isMobile && document.activeElement && ["TEXTAREA", "INPUT"].indexOf((Ae = document.activeElement) === null || Ae === void 0 ? void 0 : Ae.nodeName) !== -1) return;
      const Re = Math.abs(Le.dragOffset.y);
      Le.lockedAxis === "y" && (Re >= 200 || Re >= 50 && Le.dragOffset.time < 300) && (De && De.cancelable && De.preventDefault(), this.close(De, "f-throwOut" + (Le.current.f < 0 ? "Up" : "Down")));
    })), Ne.on("change", (Ve) => {
      var Le;
      let De = (Le = this.getSlide()) === null || Le === void 0 ? void 0 : Le.triggerEl;
      if (De) {
        const Ae = new CustomEvent("slideTo", { bubbles: !0, cancelable: !0, detail: Ve.page });
        De.dispatchEvent(Ae);
      }
    }), Ne.on(["refresh", "change"], (Ve) => {
      const Le = this.container;
      if (!Le) return;
      for (const Ie of Le.querySelectorAll("[data-fancybox-current-index]")) Ie.innerHTML = Ve.page + 1;
      for (const Ie of Le.querySelectorAll("[data-fancybox-count]")) Ie.innerHTML = Ve.pages.length;
      if (!Ve.isInfinite) {
        for (const Ie of Le.querySelectorAll("[data-fancybox-next]")) Ve.page < Ve.pages.length - 1 ? (Ie.removeAttribute(ue), Ie.removeAttribute(pe)) : (Ie.setAttribute(ue, ""), Ie.setAttribute(pe, "-1"));
        for (const Ie of Le.querySelectorAll("[data-fancybox-prev]")) Ve.page > 0 ? (Ie.removeAttribute(ue), Ie.removeAttribute(pe)) : (Ie.setAttribute(ue, ""), Ie.setAttribute(pe, "-1"));
      }
      const De = this.getSlide();
      if (!De) return;
      let Ae = De.downloadSrc || "";
      Ae || De.type !== "image" || De.error || !ve(De[me]) || (Ae = De[me]);
      for (const Ie of Le.querySelectorAll("[data-fancybox-download]")) {
        const Re = De.downloadFilename;
        Ae ? (Ie.removeAttribute(ue), Ie.removeAttribute(pe), Ie.setAttribute(ge, Ae), Ie.setAttribute(fe, Re || Ae), Ie.setAttribute("target", "_blank")) : (Ie.setAttribute(ue, ""), Ie.setAttribute(pe, "-1"), Ie.removeAttribute(ge), Ie.removeAttribute(fe));
      }
    }), this.emit("initCarousel");
  }
  attachEvents() {
    const _e = this, ke = _e.container;
    if (!ke) return;
    ke.addEventListener("click", _e.onClick, { passive: !1, capture: !1 }), ke.addEventListener("wheel", _e.onWheel, { passive: !1, capture: !1 }), document.addEventListener("keydown", _e.onKeydown, { passive: !1, capture: !0 }), document.addEventListener("visibilitychange", _e.onVisibilityChange, !1), document.addEventListener("mousemove", _e.onMousemove), _e.option("trapFocus") && document.addEventListener("focus", _e.onFocus, !0), window.addEventListener("resize", _e.onResize);
    const Be = window.visualViewport;
    Be && (Be.addEventListener("scroll", _e.onResize), Be.addEventListener("resize", _e.onResize));
  }
  detachEvents() {
    const _e = this, ke = _e.container;
    if (!ke) return;
    document.removeEventListener("keydown", _e.onKeydown, { passive: !1, capture: !0 }), ke.removeEventListener("wheel", _e.onWheel, { passive: !1, capture: !1 }), ke.removeEventListener("click", _e.onClick, { passive: !1, capture: !1 }), document.removeEventListener("mousemove", _e.onMousemove), window.removeEventListener("resize", _e.onResize);
    const Be = window.visualViewport;
    Be && (Be.removeEventListener("resize", _e.onResize), Be.removeEventListener("scroll", _e.onResize)), document.removeEventListener("visibilitychange", _e.onVisibilityChange, !1), document.removeEventListener("focus", _e.onFocus, !0);
  }
  scale() {
    const _e = this.container;
    if (!_e) return;
    const ke = window.visualViewport, Be = Math.max(1, (ke == null ? void 0 : ke.scale) || 1);
    let Ne = "", Ve = "", Le = "";
    if (ke && Be > 1) {
      let De = `${ke.offsetLeft}px`, Ae = `${ke.offsetTop}px`;
      Ne = ke.width * Be + "px", Ve = ke.height * Be + "px", Le = `translate3d(${De}, ${Ae}, 0) scale(${1 / Be})`;
    }
    _e.style.transform = Le, _e.style.width = Ne, _e.style.height = Ve;
  }
  onClick(_e) {
    var ke;
    const { container: Be, isCompact: Ne } = this;
    if (!Be || this.isClosing()) return;
    !Ne && this.option("idle") && this.resetIdle();
    const Ve = _e.composedPath()[0];
    if (Ve.closest(".fancybox-spinner") || Ve.closest("[data-fancybox-close]")) return _e.preventDefault(), void this.close(_e);
    if (Ve.closest("[data-fancybox-prev]")) return _e.preventDefault(), void this.prev();
    if (Ve.closest("[data-fancybox-next]")) return _e.preventDefault(), void this.next();
    if (_e.type === "click" && _e.detail === 0 || Math.abs(_e.pageX - Ee) > 30 || Math.abs(_e.pageY - Se) > 30) return;
    const Le = document.activeElement;
    if (be() && Le && Be.contains(Le)) return;
    if (Ne && ((ke = this.getSlide()) === null || ke === void 0 ? void 0 : ke.type) === "image") return void (this.clickTimer ? (clearTimeout(this.clickTimer), this.clickTimer = null) : this.clickTimer = setTimeout(() => {
      this.toggleIdle(), this.clickTimer = null;
    }, 350));
    if (this.emit("click", _e), _e.defaultPrevented) return;
    let De = !1;
    if (Ve.closest(".fancybox__content")) {
      if (Le) {
        if (Le.closest("[contenteditable]")) return;
        Ve.matches(nt) || Le.blur();
      }
      if (be()) return;
      De = this.option("contentClick");
    } else Ve.closest(".fancybox__carousel") && !Ve.matches(nt) && (De = this.option("backdropClick"));
    De === "close" ? (_e.preventDefault(), this.close(_e)) : De === "next" ? (_e.preventDefault(), this.next()) : De === "prev" && (_e.preventDefault(), this.prev());
  }
  onWheel(_e) {
    const ke = _e.target;
    let Be = this.option("wheel", _e);
    ke.closest(".fancybox__thumbs") && (Be = "slide");
    const Ne = Be === "slide", Ve = [-_e.deltaX || 0, -_e.deltaY || 0, -_e.detail || 0].reduce(function(Ae, Ie) {
      return Math.abs(Ie) > Math.abs(Ae) ? Ie : Ae;
    }), Le = Math.max(-1, Math.min(1, Ve)), De = Date.now();
    this.pwt && De - this.pwt < 300 ? Ne && _e.preventDefault() : (this.pwt = De, this.emit("wheel", _e, Le), _e.defaultPrevented || (Be === "close" ? (_e.preventDefault(), this.close(_e)) : Be === "slide" && (i(ke) || (_e.preventDefault(), this[Le > 0 ? "prev" : "next"]()))));
  }
  onScroll() {
    window.scrollTo(Pe, Ce);
  }
  onKeydown(_e) {
    if (!this.isTopmost()) return;
    this.isCompact || !this.option("idle") || this.isClosing() || this.resetIdle();
    const ke = _e.key, Be = this.option("keyboard");
    if (!Be) return;
    const Ne = _e.composedPath()[0], Ve = document.activeElement && document.activeElement.classList, Le = Ve && Ve.contains("f-button") || Ne.dataset.carouselPage || Ne.dataset.carouselIndex;
    if (ke !== "Escape" && !Le && E(Ne) && (Ne.isContentEditable || ["TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO"].indexOf(Ne.nodeName) !== -1) || (_e.key === "Tab" ? P(this.container, ae) : S(this.container, ae), _e.ctrlKey || _e.altKey || _e.shiftKey)) return;
    this.emit("keydown", ke, _e);
    const De = Be[ke];
    De && typeof this[De] == "function" && (_e.preventDefault(), this[De]());
  }
  onResize() {
    const _e = this.container;
    if (!_e) return;
    const ke = this.isCompact;
    _e.classList.toggle(le, ke), this.manageCaption(this.getSlide()), this.isCompact ? this.clearIdle() : this.endIdle(), this.scale(), this.emit("resize");
  }
  onFocus(_e) {
    this.isTopmost() && this.checkFocus(_e);
  }
  onMousemove(_e) {
    this.prevMouseMoveEvent = _e, !this.isCompact && this.option("idle") && this.resetIdle();
  }
  onVisibilityChange() {
    document.visibilityState === "visible" ? this.checkFocus() : this.endIdle();
  }
  manageCloseBtn(_e) {
    const ke = this.optionFor(_e, "closeButton") || !1;
    if (ke === "auto") {
      const Ne = this.plugins.Toolbar;
      if (Ne && Ne.state === Zt.Ready) return;
    }
    if (!ke || !_e.contentEl || _e.closeBtnEl) return;
    const Be = this.option("tpl.closeButton");
    if (Be) {
      const Ne = n(this.localize(Be));
      _e.closeBtnEl = _e.contentEl.appendChild(Ne), _e.el && P(_e.el, "has-close-btn");
    }
  }
  manageCaption(_e = void 0) {
    var ke, Be;
    const Ne = "fancybox__caption", Ve = this.container;
    if (!Ve) return;
    S(Ve, de);
    const Le = this.isCompact || this.option("commonCaption"), De = !Le;
    if (this.caption && this.stop(this.caption), De && this.caption && (this.caption.remove(), this.caption = null), Le && !this.caption) for (const ze of ((ke = this.carousel) === null || ke === void 0 ? void 0 : ke.slides) || []) ze.captionEl && (ze.captionEl.remove(), ze.captionEl = void 0, S(ze.el, de), (Be = ze.el) === null || Be === void 0 || Be.removeAttribute("aria-labelledby"));
    if (_e || (_e = this.getSlide()), !_e || Le && !this.isCurrentSlide(_e)) return;
    const Ae = _e.el;
    let Ie = this.optionFor(_e, "caption", "");
    if (!Ie) return void (Le && this.caption && this.animate(this.caption, "f-fadeOut", () => {
      this.caption && (this.caption.innerHTML = "");
    }));
    let Re = null;
    if (De) {
      if (Re = _e.captionEl || null, Ae && !Re) {
        const ze = Ne + `_${this.id}_${_e.index}`;
        Re = document.createElement("div"), P(Re, Ne), Re.setAttribute("id", ze), _e.captionEl = Ae.appendChild(Re), P(Ae, de), Ae.setAttribute("aria-labelledby", ze);
      }
    } else
      Re = this.caption, Re || (Re = Ve.querySelector("." + Ne)), !Re && (Re = document.createElement("div"), Re.dataset.fancyboxCaption = "", P(Re, Ne), (this.footer || Ve).prepend(Re)), P(Ve, de), this.caption = Re;
    Re && (Re.innerHTML = "", ve(Ie) || typeof Ie == "number" ? Re.innerHTML = Ie + "" : Ie instanceof HTMLElement && Re.appendChild(Ie));
  }
  checkFocus(_e) {
    this.focus(_e);
  }
  focus(_e) {
    var ke;
    if (this.ignoreFocusChange) return;
    const Be = document.activeElement || null, Ne = (_e == null ? void 0 : _e.target) || null, Ve = this.container, Le = (ke = this.carousel) === null || ke === void 0 ? void 0 : ke.viewport;
    if (!Ve || !Le || !_e && Be && Ve.contains(Be)) return;
    const De = this.getSlide(), Ae = De && De.state === lt.Ready ? De.el : null;
    if (!Ae || Ae.contains(Be) || Ve === Be) return;
    _e && _e.cancelable && _e.preventDefault(), this.ignoreFocusChange = !0;
    const Ie = Array.from(Ve.querySelectorAll(nt));
    let Re = [], ze = null;
    for (let Fe of Ie) {
      const He = !Fe.offsetParent || !!Fe.closest('[aria-hidden="true"]'), Ge = Ae && Ae.contains(Fe), qe = !Le.contains(Fe);
      if (Fe === Ve || (Ge || qe) && !He) {
        Re.push(Fe);
        const Xe = Fe.dataset.origTabindex;
        Xe !== void 0 && Xe && (Fe.tabIndex = parseFloat(Xe)), Fe.removeAttribute("data-orig-tabindex"), !Fe.hasAttribute("autoFocus") && ze || (ze = Fe);
      } else {
        const Xe = Fe.dataset.origTabindex === void 0 ? Fe.getAttribute("tabindex") || "" : Fe.dataset.origTabindex;
        Xe && (Fe.dataset.origTabindex = Xe), Fe.tabIndex = -1;
      }
    }
    let je = null;
    _e ? (!Ne || Re.indexOf(Ne) < 0) && (je = ze || Ve, Re.length && (Be === xe ? je = Re[0] : this.lastFocus !== Ve && Be !== we || (je = Re[Re.length - 1]))) : je = De && De.type === "image" ? Ve : ze || Ve, je && st(je), this.lastFocus = document.activeElement, this.ignoreFocusChange = !1;
  }
  next() {
    const _e = this.carousel;
    _e && _e.pages.length > 1 && _e.slideNext();
  }
  prev() {
    const _e = this.carousel;
    _e && _e.pages.length > 1 && _e.slidePrev();
  }
  jumpTo(..._e) {
    this.carousel && this.carousel.slideTo(..._e);
  }
  isTopmost() {
    var _e;
    return ((_e = Oe.getInstance()) === null || _e === void 0 ? void 0 : _e.id) == this.id;
  }
  animate(_e = null, ke = "", Be) {
    if (!_e || !ke) return void (Be && Be());
    this.stop(_e);
    const Ne = (Ve) => {
      Ve.target === _e && _e.dataset.animationName && (_e.removeEventListener("animationend", Ne), delete _e.dataset.animationName, Be && Be(), S(_e, ke));
    };
    _e.dataset.animationName = ke, _e.addEventListener("animationend", Ne), P(_e, ke);
  }
  stop(_e) {
    _e && _e.dispatchEvent(new CustomEvent("animationend", { bubbles: !1, cancelable: !0, currentTarget: _e }));
  }
  setContent(_e, ke = "", Be = !0) {
    if (this.isClosing()) return;
    const Ne = _e.el;
    if (!Ne) return;
    let Ve = null;
    if (E(ke) ? Ve = ke : (Ve = n(ke + ""), E(Ve) || (Ve = document.createElement("div"), Ve.innerHTML = ke + "")), ["img", "picture", "iframe", "video", "audio"].includes(Ve.nodeName.toLowerCase())) {
      const Le = document.createElement("div");
      Le.appendChild(Ve), Ve = Le;
    }
    E(Ve) && _e.filter && !_e.error && (Ve = Ve.querySelector(_e.filter)), Ve && E(Ve) ? (P(Ve, "fancybox__content"), _e.id && Ve.setAttribute("id", _e.id), Ne.classList.add(`has-${_e.error ? "error" : _e.type || "unknown"}`), Ne.prepend(Ve), Ve.style.display === "none" && (Ve.style.display = ""), getComputedStyle(Ve).getPropertyValue("display") === "none" && (Ve.style.display = _e.display || this.option("defaultDisplay") || "flex"), _e.contentEl = Ve, Be && this.revealContent(_e), this.manageCloseBtn(_e), this.manageCaption(_e)) : this.setError(_e, "{{ELEMENT_NOT_FOUND}}");
  }
  revealContent(_e, ke) {
    const Be = _e.el, Ne = _e.contentEl;
    Be && Ne && (this.emit("reveal", _e), this.hideLoading(_e), _e.state = lt.Opening, (ke = this.isOpeningSlide(_e) ? ke === void 0 ? this.optionFor(_e, "showClass") : ke : "f-fadeIn") ? this.animate(Ne, ke, () => {
      this.done(_e);
    }) : this.done(_e));
  }
  done(_e) {
    this.isClosing() || (_e.state = lt.Ready, this.emit("done", _e), P(_e.el, "is-done"), this.isCurrentSlide(_e) && this.option("autoFocus") && queueMicrotask(() => {
      var ke;
      (ke = _e.panzoom) === null || ke === void 0 || ke.updateControls(), this.option("autoFocus") && this.focus();
    }), this.isOpeningSlide(_e) && (S(this.container, he), !this.isCompact && this.option("idle") && this.setIdle()));
  }
  isCurrentSlide(_e) {
    const ke = this.getSlide();
    return !(!_e || !ke) && ke.index === _e.index;
  }
  isOpeningSlide(_e) {
    var ke, Be;
    return ((ke = this.carousel) === null || ke === void 0 ? void 0 : ke.prevPage) === null && _e && _e.index === ((Be = this.getSlide()) === null || Be === void 0 ? void 0 : Be.index);
  }
  showLoading(_e) {
    _e.state = lt.Loading;
    const ke = _e.el;
    ke && (P(ke, ce), this.emit("loading", _e), _e.spinnerEl || setTimeout(() => {
      if (!this.isClosing() && !_e.spinnerEl && _e.state === lt.Loading) {
        let Be = n(x);
        P(Be, "fancybox-spinner"), _e.spinnerEl = Be, ke.prepend(Be), this.animate(Be, "f-fadeIn");
      }
    }, 250));
  }
  hideLoading(_e) {
    const ke = _e.el;
    if (!ke) return;
    const Be = _e.spinnerEl;
    this.isClosing() ? Be == null || Be.remove() : (S(ke, ce), Be && this.animate(Be, "f-fadeOut", () => {
      Be.remove();
    }), _e.state === lt.Loading && (this.emit("loaded", _e), _e.state = lt.Ready));
  }
  setError(_e, ke) {
    if (this.isClosing()) return;
    const Be = new Event("error", { bubbles: !0, cancelable: !0 });
    if (this.emit("error", Be, _e), Be.defaultPrevented) return;
    _e.error = ke, this.hideLoading(_e), this.clearContent(_e);
    const Ne = document.createElement("div");
    Ne.classList.add("fancybox-error"), Ne.innerHTML = this.localize(ke || "<p>{{ERROR}}</p>"), this.setContent(_e, Ne);
  }
  clearContent(_e) {
    if (_e.state === void 0) return;
    this.emit("clearContent", _e), _e.contentEl && (_e.contentEl.remove(), _e.contentEl = void 0);
    const ke = _e.el;
    ke && (S(ke, "has-error"), S(ke, "has-unknown"), S(ke, `has-${_e.type || "unknown"}`)), _e.closeBtnEl && _e.closeBtnEl.remove(), _e.closeBtnEl = void 0, _e.captionEl && _e.captionEl.remove(), _e.captionEl = void 0, _e.spinnerEl && _e.spinnerEl.remove(), _e.spinnerEl = void 0;
  }
  getSlide() {
    var _e;
    const ke = this.carousel;
    return ((_e = ke == null ? void 0 : ke.pages[ke == null ? void 0 : ke.page]) === null || _e === void 0 ? void 0 : _e.slides[0]) || void 0;
  }
  close(_e, ke) {
    if (this.isClosing()) return;
    const Be = new Event("shouldClose", { bubbles: !0, cancelable: !0 });
    if (this.emit("shouldClose", Be, _e), Be.defaultPrevented) return;
    _e && _e.cancelable && (_e.preventDefault(), _e.stopPropagation());
    const Ne = () => {
      this.proceedClose(_e, ke);
    };
    this.startedFs && ye && ye.isFullscreen() ? Promise.resolve(ye.exit()).then(() => Ne()) : Ne();
  }
  clearIdle() {
    this.idleTimer && clearTimeout(this.idleTimer), this.idleTimer = null;
  }
  setIdle(_e = !1) {
    const ke = () => {
      this.clearIdle(), this.idle = !0, P(this.container, "is-idle"), this.emit("setIdle");
    };
    if (this.clearIdle(), !this.isClosing()) if (_e) ke();
    else {
      const Be = this.option("idle");
      Be && (this.idleTimer = setTimeout(ke, Be));
    }
  }
  endIdle() {
    this.clearIdle(), this.idle && !this.isClosing() && (this.idle = !1, S(this.container, "is-idle"), this.emit("endIdle"));
  }
  resetIdle() {
    this.endIdle(), this.setIdle();
  }
  toggleIdle() {
    this.idle ? this.endIdle() : this.setIdle(!0);
  }
  toggleFullscreen() {
    ye && (ye.isFullscreen() ? ye.exit() : ye.request().then(() => {
      this.startedFs = !0;
    }));
  }
  isClosing() {
    return [rt.Closing, rt.CustomClosing, rt.Destroy].includes(this.state);
  }
  proceedClose(_e, ke) {
    var Be, Ne;
    this.state = rt.Closing, this.clearIdle(), this.detachEvents();
    const Ve = this.container, Le = this.carousel, De = this.getSlide(), Ae = De && this.option("placeFocusBack") ? De.triggerEl || this.option("triggerEl") : null;
    if (Ae && (tt(Ae) ? st(Ae) : Ae.focus()), Ve && (S(Ve, he), P(Ve, "is-closing"), Ve.setAttribute(oe, "true"), this.option("animated") && P(Ve, re), Ve.style.pointerEvents = "none"), Le) {
      Le.clearTransitions(), (Be = Le.panzoom) === null || Be === void 0 || Be.destroy(), (Ne = Le.plugins.Navigation) === null || Ne === void 0 || Ne.detach();
      for (const Ie of Le.slides) {
        Ie.state = lt.Closing, this.hideLoading(Ie);
        const Re = Ie.contentEl;
        Re && this.stop(Re);
        const ze = Ie == null ? void 0 : Ie.panzoom;
        ze && (ze.stop(), ze.detachEvents(), ze.detachObserver()), this.isCurrentSlide(Ie) || Le.emit("removeSlide", Ie);
      }
    }
    Pe = window.scrollX, Ce = window.scrollY, window.addEventListener("scroll", this.onScroll), this.emit("close", _e), this.state !== rt.CustomClosing ? (ke === void 0 && De && (ke = this.optionFor(De, "hideClass")), ke && De ? (this.animate(De.contentEl, ke, () => {
      Le && Le.emit("removeSlide", De);
    }), setTimeout(() => {
      this.destroy();
    }, 500)) : this.destroy()) : setTimeout(() => {
      this.destroy();
    }, 500);
  }
  destroy() {
    var _e;
    if (this.state === rt.Destroy) return;
    window.removeEventListener("scroll", this.onScroll), this.state = rt.Destroy, (_e = this.carousel) === null || _e === void 0 || _e.destroy();
    const ke = this.container;
    ke && ke.remove(), Te.delete(this.id);
    const Be = Oe.getInstance();
    Be ? Be.focus() : (we && (we.remove(), we = null), xe && (xe.remove(), xe = null), S(document.documentElement, ee), (() => {
      if (!et) return;
      const Ne = document, Ve = Ne.body;
      Ve.classList.remove(ie), Ve.style.setProperty(se, ""), Ne.documentElement.style.setProperty(ne, "");
    })(), this.emit("destroy"));
  }
  static bind(_e, ke, Be) {
    if (!et) return;
    let Ne, Ve = "", Le = {};
    if (_e === void 0 ? Ne = document.body : ve(_e) ? (Ne = document.body, Ve = _e, typeof ke == "object" && (Le = ke || {})) : (Ne = _e, ve(ke) && (Ve = ke), typeof Be == "object" && (Le = Be || {})), !Ne || !E(Ne)) return;
    Ve = Ve || "[data-fancybox]";
    const De = Oe.openers.get(Ne) || /* @__PURE__ */ new Map();
    De.set(Ve, Le), Oe.openers.set(Ne, De), De.size === 1 && Ne.addEventListener("click", Oe.fromEvent);
  }
  static unbind(_e, ke) {
    let Be, Ne = "";
    if (ve(_e) ? (Be = document.body, Ne = _e) : (Be = _e, ve(ke) && (Ne = ke)), !Be) return;
    const Ve = Oe.openers.get(Be);
    Ve && Ne && Ve.delete(Ne), Ne && Ve || (Oe.openers.delete(Be), Be.removeEventListener("click", Oe.fromEvent));
  }
  static destroy() {
    let _e;
    for (; _e = Oe.getInstance(); ) _e.destroy();
    for (const ke of Oe.openers.keys()) ke.removeEventListener("click", Oe.fromEvent);
    Oe.openers = /* @__PURE__ */ new Map();
  }
  static fromEvent(_e) {
    if (_e.defaultPrevented || _e.button && _e.button !== 0 || _e.ctrlKey || _e.metaKey || _e.shiftKey) return;
    let ke = _e.composedPath()[0];
    const Be = ke.closest("[data-fancybox-trigger]");
    if (Be) {
      const He = Be.dataset.fancyboxTrigger || "", Ge = document.querySelectorAll(`[data-fancybox="${He}"]`), qe = parseInt(Be.dataset.fancyboxIndex || "", 10) || 0;
      ke = Ge[qe] || ke;
    }
    if (!(ke && ke instanceof Element)) return;
    let Ne, Ve, Le, De;
    if ([...Oe.openers].reverse().find(([He, Ge]) => !(!He.contains(ke) || ![...Ge].reverse().find(([qe, Xe]) => {
      let Ye = ke.closest(qe);
      return !!Ye && (Ne = He, Ve = qe, Le = Ye, De = Xe, !0);
    }))), !Ne || !Ve || !Le) return;
    De = De || {}, _e.preventDefault(), ke = Le;
    let Ae = [], Ie = u({}, at, De);
    Ie.event = _e, Ie.triggerEl = ke, Ie.delegate = Be;
    const Re = Ie.groupAll, ze = Ie.groupAttr, je = ze && ke ? ke.getAttribute(`${ze}`) : "";
    if ((!ke || je || Re) && (Ae = [].slice.call(Ne.querySelectorAll(Ve))), ke && !Re && (Ae = je ? Ae.filter((He) => He.getAttribute(`${ze}`) === je) : [ke]), !Ae.length) return;
    const Fe = Oe.getInstance();
    return Fe && Fe.options.triggerEl && Ae.indexOf(Fe.options.triggerEl) > -1 ? void 0 : (ke && (Ie.startIndex = Ae.indexOf(ke)), Oe.fromNodes(Ae, Ie));
  }
  static fromSelector(_e, ke, Be) {
    let Ne = null, Ve = "", Le = {};
    if (ve(_e) ? (Ne = document.body, Ve = _e, typeof ke == "object" && (Le = ke || {})) : _e instanceof HTMLElement && ve(ke) && (Ne = _e, Ve = ke, typeof Be == "object" && (Le = Be || {})), !Ne || !Ve) return !1;
    const De = Oe.openers.get(Ne);
    return !!De && (Le = u({}, De.get(Ve) || {}, Le), !!Le && Oe.fromNodes(Array.from(Ne.querySelectorAll(Ve)), Le));
  }
  static fromNodes(_e, ke) {
    ke = u({}, at, ke || {});
    const Be = [];
    for (const Ne of _e) {
      const Ve = Ne.dataset || {}, Le = Ve[me] || Ne.getAttribute(ge) || Ne.getAttribute("currentSrc") || Ne.getAttribute(me) || void 0;
      let De;
      const Ae = ke.delegate;
      let Ie;
      Ae && Be.length === ke.startIndex && (De = Ae instanceof HTMLImageElement ? Ae : Ae.querySelector("img:not([aria-hidden])")), De || (De = Ne instanceof HTMLImageElement ? Ne : Ne.querySelector("img:not([aria-hidden])")), De && (Ie = De.currentSrc || De[me] || void 0, !Ie && De.dataset && (Ie = De.dataset.lazySrc || De.dataset[me] || void 0));
      const Re = { src: Le, triggerEl: Ne, thumbEl: De, thumbElSrc: Ie, thumbSrc: Ie };
      for (const ze in Ve) {
        let je = Ve[ze] + "";
        je = je !== "false" && (je === "true" || je), Re[ze] = je;
      }
      Be.push(Re);
    }
    return new Oe(Be, ke);
  }
  static getInstance(_e) {
    return _e ? Te.get(_e) : Array.from(Te.values()).reverse().find((ke) => !ke.isClosing() && ke) || null;
  }
  static getSlide() {
    var _e;
    return ((_e = Oe.getInstance()) === null || _e === void 0 ? void 0 : _e.getSlide()) || null;
  }
  static show(_e = [], ke = {}) {
    return new Oe(_e, ke);
  }
  static next() {
    const _e = Oe.getInstance();
    _e && _e.next();
  }
  static prev() {
    const _e = Oe.getInstance();
    _e && _e.prev();
  }
  static close(_e = !0, ...ke) {
    if (_e) for (const Be of Te.values()) Be.close(...ke);
    else {
      const Be = Oe.getInstance();
      Be && Be.close(...ke);
    }
  }
}
Object.defineProperty(Oe, "version", { enumerable: !0, configurable: !0, writable: !0, value: "5.0.36" }), Object.defineProperty(Oe, "defaults", { enumerable: !0, configurable: !0, writable: !0, value: at }), Object.defineProperty(Oe, "Plugins", { enumerable: !0, configurable: !0, writable: !0, value: te }), Object.defineProperty(Oe, "openers", { enumerable: !0, configurable: !0, writable: !0, value: /* @__PURE__ */ new Map() });
const _sfc_main$Q = {
  props: {
    options: Object
  },
  mounted() {
    Oe.bind(this.$refs.container, "[data-fancybox]", {
      Hash: !1,
      Images: {
        zoom: !1,
        Panzoom: {
          maxScale: 2
        }
      },
      ...this.options || {}
    });
  },
  updated() {
    Oe.unbind(this.$refs.container), Oe.close(), Oe.bind(this.$refs.container, "[data-fancybox]", {
      Hash: !1,
      Images: {
        zoom: !1,
        Panzoom: {
          maxScale: 2
        }
      },
      ...this.options || {}
    });
  },
  unmounted() {
    Oe.destroy();
  }
}, _hoisted_1$L = {
  ref: "container",
  class: "irep-fancybox"
};
function _sfc_render$e($e, _e, ke, Be, Ne, Ve) {
  return openBlock(), createElementBlock("div", _hoisted_1$L, [
    renderSlot($e.$slots, "default")
  ], 512);
}
const FancyBoxComp = /* @__PURE__ */ _export_sfc(_sfc_main$Q, [["render", _sfc_render$e]]), _hoisted_1$K = {
  key: 0,
  class: "irep-flat-swiper-two ire-relative ire-mx-6 ire-my-2 ire-min-h-[200px] ire-overflow-hidden ire-rounded-xl ire-bg-gray-50 ire-pt-[70%]"
}, _hoisted_2$r = ["data-fancybox", "href"], _hoisted_3$k = ["src"], _hoisted_4$h = {
  key: 1,
  class: "irep-flat-swiper-two__view-toggle-wrapper ire-pointer-events-none ire-absolute ire-bottom-3 ire-left-1/2 ire-z-20 ire-w-[min(100%,16rem)] -ire-translate-x-1/2 ire-px-2"
}, _hoisted_5$g = ["aria-label"], _hoisted_6$d = ["aria-selected"], _hoisted_7$d = { class: "ire-whitespace-nowrap" }, _hoisted_8$b = ["aria-selected"], _hoisted_9$9 = { class: "ire-whitespace-nowrap" }, _sfc_main$P = /* @__PURE__ */ defineComponent({
  __name: "FlatSwiperTwo",
  props: {
    flat: {},
    floors: {}
  },
  setup($e) {
    const _e = $e, ke = ref(), Be = ref(0), Ne = ref(!0), Ve = ref(0), Le = computed(() => {
      var je, Fe, He, Ge, qe, Xe;
      return ((He = (Fe = (je = _e.flat) == null ? void 0 : je.type) == null ? void 0 : Fe.image_3d) == null ? void 0 : He.length) || ((Xe = (qe = (Ge = _e.flat) == null ? void 0 : Ge.type) == null ? void 0 : qe.image_2d) == null ? void 0 : Xe.length);
    }), De = computed(() => {
      var je, Fe, He, Ge;
      return _e.flat ? !!((Fe = (je = _e.flat.type) == null ? void 0 : je.image_2d) != null && Fe.length && ((Ge = (He = _e.flat.type) == null ? void 0 : He.image_3d) != null && Ge.length)) : !1;
    }), Ae = computed(() => {
      var Fe, He, Ge, qe;
      return _e.flat ? (Ne.value && ((He = (Fe = _e.flat.type) == null ? void 0 : Fe.image_2d) != null && He.length) ? _e.flat.type.image_2d : !Ne.value && ((qe = (Ge = _e.flat.type) == null ? void 0 : Ge.image_3d) != null && qe.length) ? _e.flat.type.image_3d : []).slice(0, 6) : [];
    }), Ie = (je) => {
      var Fe;
      ke.value = je, Be.value = je.activeIndex ?? 0, (Fe = je.on) == null || Fe.call(je, "slideChange", () => {
        Be.value = je.activeIndex ?? 0;
      });
    }, Re = (je) => {
      var Fe, He;
      (He = (Fe = ke.value) == null ? void 0 : Fe.slideTo) == null || He.call(Fe, je);
    }, ze = () => {
      var Fe;
      const je = _e.flat;
      je && (Object.keys(((Fe = je.type) == null ? void 0 : Fe.image_2d) || {}).length ? Ne.value = !0 : Ne.value = !1);
    };
    return watch(
      () => Ne.value,
      () => {
        Ve.value++, setTimeout(() => {
          var je, Fe, He;
          (Fe = (je = ke.value) == null ? void 0 : je.update) == null || Fe.call(je), Be.value = ((He = ke.value) == null ? void 0 : He.activeIndex) ?? 0;
        }, 400);
      }
    ), watch(
      () => _e.flat,
      () => {
        ze();
      },
      { immediate: !0 }
    ), (je, Fe) => (openBlock(), createBlock(FancyBoxComp, { options: {} }, {
      default: withCtx(() => {
        var He, Ge, qe, Xe, Ye, We, Je, ri, Qe;
        return [
          $e.flat && Le.value ? (openBlock(), createElementBlock("div", _hoisted_1$K, [
            createVNode(Transition, {
              name: "ire-scale",
              mode: "out-in"
            }, {
              default: withCtx(() => {
                var ti, ei;
                return [
                  (openBlock(), createBlock(unref(Swiper), {
                    key: (ei = (ti = Ae.value) == null ? void 0 : ti[0]) == null ? void 0 : ei.url,
                    "slides-per-view": 1,
                    "space-between": 0,
                    class: "ire-absolute ire-left-0 ire-top-0 ire-h-full ire-w-full ire-max-w-full ire-overflow-hidden",
                    onSwiper: Ie
                  }, {
                    default: withCtx(() => [
                      (openBlock(!0), createElementBlock(Fragment, null, renderList(Ae.value, (Ze, Ue) => (openBlock(), createBlock(unref(SwiperSlide), {
                        key: `${(Ze == null ? void 0 : Ze.url) ?? ""}-${Ue}`,
                        class: "ire-group ire-flex !ire-w-full ire-justify-center ire-bg-gray-50 ire-text-center"
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createElementBlock("a", {
                            key: (Ze == null ? void 0 : Ze.url) + Ue,
                            "data-fancybox": Ne.value ? "gallery-2d" : "gallery-3d",
                            href: Ze == null ? void 0 : Ze.url,
                            class: "irep-flat-preview__left-3d ire-flex ire-w-fit ire-items-center ire-justify-center"
                          }, [
                            createElementVNode("img", {
                              src: Ze == null ? void 0 : Ze.url,
                              alt: "",
                              class: "ire-h-full ire-w-full ire-rounded-xl ire-object-cover ire-object-center ire-transition-all ire-duration-1000 ire-ease-[cubic-bezier(0.25,1,0.5,1)]"
                            }, null, 8, _hoisted_3$k)
                          ], 8, _hoisted_2$r))
                        ]),
                        _: 2
                      }, 1024))), 128))
                    ]),
                    _: 1
                  }))
                ];
              }),
              _: 1
            }),
            Ae.value.length > 1 ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: normalizeClass(["irep-flat-swiper-two__pagination ire-pointer-events-none ire-absolute ire-left-1/2 ire-z-20 -ire-translate-x-1/2", {
                "ire-bottom-14": De.value,
                "ire-bottom-4": !De.value
              }])
            }, [
              ((He = Ae.value) == null ? void 0 : He.length) > 1 ? (openBlock(), createBlock(_sfc_main$T, {
                key: 0,
                imagesUrls: Ae.value,
                activeSlideIndex: Be.value,
                goToSlide: Re
              }, null, 8, ["imagesUrls", "activeSlideIndex"])) : createCommentVNode("", !0)
            ], 2)) : createCommentVNode("", !0),
            De.value ? (openBlock(), createElementBlock("div", _hoisted_4$h, [
              createElementVNode("div", {
                class: "irep-flat-swiper-two__view-toggle ire-pointer-events-auto ire-inline-flex ire-min-h-[2.25rem] ire-w-full ire-items-stretch ire-gap-1 ire-rounded-full ire-bg-gray-200/[0.8] ire-p-1 ire-backdrop-blur-sm",
                role: "tablist",
                "aria-label": unref(tr)("plan view")
              }, [
                (Ye = (Xe = (qe = (Ge = $e.flat) == null ? void 0 : Ge.type) == null ? void 0 : qe.image_2d) == null ? void 0 : Xe[0]) != null && Ye.url ? (openBlock(), createElementBlock("div", {
                  key: 0,
                  role: "tab",
                  "aria-selected": Ne.value,
                  class: normalizeClass([
                    "irep-flat-swiper-two__view-tab ire-group ire-flex ire-min-w-0 ire-flex-1 ire-cursor-pointer ire-items-center ire-justify-center ire-gap-1.5 ire-rounded-full ire-fill-transparent ire-text-xs ire-transition-all ire-duration-300 hover:ire-bg-gray-100 hover:ire-text-black focus-visible:ire-outline focus-visible:ire-outline-2 focus-visible:ire-outline-offset-2 focus-visible:ire-outline-[var(--primary-color)] sm:ire-text-sm",
                    Ne.value ? "ire-bg-white ire-text-gray-900 ire-shadow-sm" : "ire-bg-transparent ire-text-black"
                  ]),
                  onClick: Fe[0] || (Fe[0] = (ti) => Ne.value = !0)
                }, [
                  createVNode(FlatIcon, {
                    class: normalizeClass(["ire-size-3.5 ire-shrink-0 sm:ire-size-4 [&_path]:ire-stroke-current", Ne.value ? "ire-text-gray-900" : "ire-text-black"])
                  }, null, 8, ["class"]),
                  createElementVNode("span", _hoisted_7$d, toDisplayString(unref(tr)("2d plan")), 1)
                ], 10, _hoisted_6$d)) : createCommentVNode("", !0),
                (Qe = (ri = (Je = (We = $e.flat) == null ? void 0 : We.type) == null ? void 0 : Je.image_3d) == null ? void 0 : ri[0]) != null && Qe.url ? (openBlock(), createElementBlock("div", {
                  key: 1,
                  role: "tab",
                  "aria-selected": !Ne.value,
                  class: normalizeClass([
                    "irep-flat-swiper-two__view-tab ire-group ire-flex ire-min-w-0 ire-flex-1 ire-cursor-pointer ire-items-center ire-justify-center ire-gap-1.5 ire-rounded-full ire-text-xs ire-transition-all ire-duration-300 hover:ire-bg-gray-100 hover:ire-text-black focus-visible:ire-outline focus-visible:ire-outline-2 focus-visible:ire-outline-offset-2 focus-visible:ire-outline-[var(--primary-color)] sm:ire-text-sm",
                    Ne.value ? "ire-bg-transparent ire-text-black" : "ire-bg-white ire-text-gray-900 ire-shadow-sm"
                  ]),
                  onClick: Fe[1] || (Fe[1] = (ti) => Ne.value = !1)
                }, [
                  createVNode(Cube3d, {
                    class: normalizeClass(["ire-size-3.5 ire-shrink-0 ire-fill-transparent sm:ire-size-4 [&_path]:ire-stroke-current", Ne.value ? "ire-text-black" : "ire-text-gray-900"])
                  }, null, 8, ["class"]),
                  createElementVNode("span", _hoisted_9$9, toDisplayString(unref(tr)("3d plan")), 1)
                ], 10, _hoisted_8$b)) : createCommentVNode("", !0)
              ], 8, _hoisted_5$g)
            ])) : createCommentVNode("", !0)
          ])) : createCommentVNode("", !0)
        ];
      }),
      _: 1
    }));
  }
}), _hoisted_1$J = ["type", "disable"], _hoisted_2$q = {
  key: 0,
  class: "irep-button__icon ire-flex ire-items-center ire-justify-center group-active:[&_path]:ire-stroke-white"
}, _sfc_main$O = /* @__PURE__ */ defineComponent({
  __name: "Button",
  props: {
    title: {},
    type: {},
    disable: { type: Boolean },
    variant: { default: "default" }
  },
  setup($e) {
    const _e = useSlots();
    return (ke, Be) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(["irep-button ire-group ire-flex ire-w-fit ire-cursor-pointer ire-items-center ire-justify-center ire-gap-2 ire-rounded-full ire-px-4 ire-py-2 ire-text-center ire-outline-none !ire-transition-all ire-duration-500 focus:!ire-shadow-none active:ire-scale-95 active:ire-bg-[color-mix(in_srgb,var(--primary-color),white_0.2%)] active:!ire-shadow-none active:!ire-outline-none", {
        "ire-border-none ire-bg-[var(--primary-color)] hover:ire-bg-[color-mix(in_srgb,var(--primary-color),white_20%)]": $e.variant === "default",
        "ire-bg-transparent ire-ring-1 ire-ring-black hover:ire-bg-[var(--primary-color)] hover:ire-ring-transparent": $e.variant === "outline",
        "ire-pointer-events-none ire-bg-gray-500": $e.disable
      }]),
      type: $e.type || "button",
      disable: $e.disable
    }, [
      unref(_e).icon ? (openBlock(), createElementBlock("div", _hoisted_2$q, [
        renderSlot(ke.$slots, "icon")
      ])) : createCommentVNode("", !0),
      createElementVNode("div", {
        class: normalizeClass(["irep-button__text ire-w-fit ire-text-center ire-text-base ire-transition-all group-hover:ire-text-white group-active:ire-text-white", {
          "ire-text-white": $e.variant === "default",
          "ire-text-black group-hover:ire-text-white": $e.variant === "outline"
        }])
      }, toDisplayString(unref(tr)($e.title)), 3)
    ], 10, _hoisted_1$J));
  }
}), _sfc_main$N = {}, _hoisted_1$I = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "800px",
  height: "800px",
  viewBox: "0 0 24 24",
  fill: "none",
  webcrx: ""
};
function _sfc_render$d($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$I, [..._e[0] || (_e[0] = [
    createElementVNode("path", {
      d: "M16.5562 12.9062L16.1007 13.359C16.1007 13.359 15.0181 14.4355 12.0631 11.4972C9.10812 8.55901 10.1907 7.48257 10.1907 7.48257L10.4775 7.19738C11.1841 6.49484 11.2507 5.36691 10.6342 4.54348L9.37326 2.85908C8.61028 1.83992 7.13596 1.70529 6.26145 2.57483L4.69185 4.13552C4.25823 4.56668 3.96765 5.12559 4.00289 5.74561C4.09304 7.33182 4.81071 10.7447 8.81536 14.7266C13.0621 18.9492 17.0468 19.117 18.6763 18.9651C19.1917 18.9171 19.6399 18.6546 20.0011 18.2954L21.4217 16.883C22.3806 15.9295 22.1102 14.2949 20.8833 13.628L18.9728 12.5894C18.1672 12.1515 17.1858 12.2801 16.5562 12.9062Z",
      fill: "#1C274C"
    }, null, -1)
  ])]);
}
const PhoneIcon = /* @__PURE__ */ _export_sfc(_sfc_main$N, [["render", _sfc_render$d]]), _sfc_main$M = {}, _hoisted_1$H = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "800px",
  height: "800px",
  viewBox: "0 0 24 24",
  fill: "none",
  webcrx: "",
  class: "ire-stroke-[2px]"
};
function _sfc_render$c($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$H, [..._e[0] || (_e[0] = [
    createElementVNode("path", {
      d: "M12 12V19M12 19L9.75 16.6667M12 19L14.25 16.6667M6.6 17.8333C4.61178 17.8333 3 16.1917 3 14.1667C3 12.498 4.09438 11.0897 5.59198 10.6457C5.65562 10.6268 5.7 10.5675 5.7 10.5C5.7 7.46243 8.11766 5 11.1 5C14.0823 5 16.5 7.46243 16.5 10.5C16.5 10.5582 16.5536 10.6014 16.6094 10.5887C16.8638 10.5306 17.1284 10.5 17.4 10.5C19.3882 10.5 21 12.1416 21 14.1667C21 16.1917 19.3882 17.8333 17.4 17.8333",
      stroke: "#464455",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ])]);
}
const DownloadIcon = /* @__PURE__ */ _export_sfc(_sfc_main$M, [["render", _sfc_render$c]]), _hoisted_1$G = {
  key: 0,
  class: "irep-flat-preview-two-bottom ire-left-0 ire-right-0 ire-z-20 ire-flex ire-flex-col ire-justify-center ire-gap-4 ire-bg-white ire-p-4 ire-shadow-lg sm:ire-flex-row"
}, _hoisted_2$p = ["href"], _sfc_main$L = /* @__PURE__ */ defineComponent({
  __name: "FlatPreviewTwoBottom",
  props: {
    flat: {},
    floors: {},
    showCallbackButton: { type: Boolean }
  },
  emits: ["showForm"],
  setup($e, { emit: _e }) {
    const ke = _e;
    return (Be, Ne) => {
      var Ve, Le, De, Ae, Ie, Re, ze, je, Fe;
      return (De = (Le = (Ve = $e.flat) == null ? void 0 : Ve.files) == null ? void 0 : Le[0]) != null && De.url || $e.showCallbackButton ? (openBlock(), createElementBlock("div", _hoisted_1$G, [
        (Re = (Ie = (Ae = $e.flat) == null ? void 0 : Ae.files) == null ? void 0 : Ie[0]) != null && Re.url ? (openBlock(), createElementBlock("a", {
          key: 0,
          href: (Fe = (je = (ze = $e.flat) == null ? void 0 : ze.files) == null ? void 0 : je[0]) == null ? void 0 : Fe.url,
          target: "_blank",
          class: "irep-flat-moda-action-buttons__download-file ire-w-full !ire-no-underline hover:!ire-no-underline"
        }, [
          createVNode(_sfc_main$O, {
            title: unref(tr)("download file"),
            variant: "outline",
            class: "ire-w-full"
          }, {
            icon: withCtx(() => [
              createVNode(DownloadIcon, { class: "ire-size-4 group-hover:[&_path]:ire-stroke-white" })
            ]),
            _: 1
          }, 8, ["title"])
        ], 8, _hoisted_2$p)) : createCommentVNode("", !0),
        $e.showCallbackButton ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: "irep-flat-moda-action-buttons__request-callback ire-w-full !ire-no-underline hover:!ire-no-underline",
          onClick: Ne[0] || (Ne[0] = (He) => ke("showForm"))
        }, [
          createVNode(_sfc_main$O, {
            title: unref(tr)("Request callback"),
            active: "",
            class: "!ire-w-full"
          }, {
            icon: withCtx(() => [
              createVNode(PhoneIcon, { class: "ire-size-4 [&_path]:ire-fill-white" })
            ]),
            _: 1
          }, 8, ["title"])
        ])) : createCommentVNode("", !0)
      ])) : createCommentVNode("", !0);
    };
  }
}), _hoisted_1$F = { class: "irep-preview-kv ire-flex ire-h-fit ire-min-w-0 ire-max-w-full ire-flex-col" }, _hoisted_2$o = { class: "irep-preview-kv__key ire-text-sm ire-uppercase ire-text-gray-700" }, _hoisted_3$j = { class: "irep-preview-kv__value ire-flex ire-min-w-0 ire-items-center ire-gap-1 ire-break-words ire-text-lg ire-font-semibold" }, _sfc_main$K = /* @__PURE__ */ defineComponent({
  __name: "PreviewTwoKeyValue",
  props: {
    keyName: {},
    value: {}
  },
  setup($e) {
    return (_e, ke) => (openBlock(), createElementBlock("div", _hoisted_1$F, [
      createElementVNode("div", _hoisted_2$o, toDisplayString($e.keyName), 1),
      createElementVNode("div", _hoisted_3$j, [
        createTextVNode(toDisplayString($e.value) + " ", 1),
        renderSlot(_e.$slots, "sufix")
      ])
    ]));
  }
}), _hoisted_1$E = { class: "irep-input ire-flex ire-w-full ire-flex-col ire-items-start ire-text-black" }, _hoisted_2$n = { class: "irep-input__field-wrapper ire-relative ire-w-full" }, _hoisted_3$i = ["type", "required"], _hoisted_4$g = { class: "irep-input__right-icon ire-absolute ire-right-3 ire-top-1/2 -ire-translate-y-1/2" }, _hoisted_5$f = {
  key: 0,
  class: "irep-input__error ire-mt-1 ire-text-xs ire-text-red-600"
}, _sfc_main$J = /* @__PURE__ */ defineComponent({
  __name: "Input",
  props: /* @__PURE__ */ mergeModels({
    label: {},
    type: {},
    required: { type: Boolean },
    error: {}
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup($e) {
    const _e = useModel($e, "modelValue"), ke = ref(!1), Be = computed(() => ke.value || !!_e.value);
    return (Ne, Ve) => (openBlock(), createElementBlock("label", _hoisted_1$E, [
      createElementVNode("div", _hoisted_2$n, [
        withDirectives(createElementVNode("input", {
          "onUpdate:modelValue": Ve[0] || (Ve[0] = (Le) => _e.value = Le),
          type: $e.type || "text",
          required: $e.required,
          onFocus: Ve[1] || (Ve[1] = (Le) => ke.value = !0),
          onBlur: Ve[2] || (Ve[2] = (Le) => ke.value = !1),
          class: normalizeClass([
            "no-spinner ire-w-full ire-rounded-md !ire-border-none ire-px-3 ire-pb-2 ire-pt-5 ire-text-base !ire-outline-none ire-ring-[1px] ire-transition-all",
            $e.error ? "ire-ring-red-400 focus:ire-ring-red-500" : "ire-ring-gray-200 focus:ire-ring-black"
          ])
        }, null, 42, _hoisted_3$i), [
          [vModelDynamic, _e.value]
        ]),
        createElementVNode("span", {
          class: normalizeClass([
            "ire-pointer-events-none ire-absolute ire-left-3 ire-text-gray-600 ire-transition-all ire-duration-200",
            Be.value ? "ire-top-1.5 ire-text-xs" : "ire-top-1/2 -ire-translate-y-1/2 ire-text-base"
          ])
        }, toDisplayString(unref(tr)($e.label)), 3),
        createElementVNode("div", _hoisted_4$g, [
          renderSlot(Ne.$slots, "right-icon", {}, void 0, !0)
        ])
      ]),
      createVNode(Transition, { name: "ire-error-slide" }, {
        default: withCtx(() => [
          $e.error ? (openBlock(), createElementBlock("div", _hoisted_5$f, toDisplayString($e.error), 1)) : createCommentVNode("", !0)
        ]),
        _: 1
      })
    ]));
  }
}), Input = /* @__PURE__ */ _export_sfc(_sfc_main$J, [["__scopeId", "data-v-48798e6a"]]), createAxios = () => {
  var ke;
  const $e = useGlobalStore();
  return axios.create({
    baseURL: (ke = $e.irePlaginWp) == null ? void 0 : ke.ajax_url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      // Set content type
    },
    withCredentials: !0
  });
}, _hoisted_1$D = {
  key: 0,
  class: "irep-reservation-form__success ire-text-black"
}, _hoisted_2$m = {
  key: 1,
  class: "irep-callback-form ire-flex ire-flex-col ire-gap-4"
}, _hoisted_3$h = { class: "irep-callback-form__title ire-mb-4 ire-text-center ire-text-xl ire-font-semibold ire-text-black" }, _hoisted_4$f = { class: "irep-reservation-form__comment ire-relative ire-w-full ire-text-black" }, _hoisted_5$e = {
  key: 0,
  class: "irep-callback-form__buttons ire-mt-4 ire-flex ire-flex-wrap ire-gap-3"
}, _sfc_main$I = /* @__PURE__ */ defineComponent({
  __name: "ReservationForm",
  props: {
    flat: {}
  },
  emits: ["hideForm"],
  setup($e, { emit: _e }) {
    var He, Ge;
    const ke = _e, Be = $e, Ne = useGlobalStore(), Ve = ref({
      project_id: (He = Be.flat) == null ? void 0 : He.project_id,
      flat_id: (Ge = Be.flat) == null ? void 0 : Ge.id,
      name: "",
      phone: "",
      email: "",
      comment: ""
    }), Le = ref(!1), De = ref(!1), Ae = ref(!1), Ie = ref({ name: "", phone: "", email: "" }), Re = ref(!1), ze = {
      name: (qe) => qe.trim() ? qe.trim().length < 2 ? tr("Name must be at least 2 characters") : "" : tr("Name is required"),
      phone: (qe) => qe.trim() ? /^[+\d][\d\s\-(). ]{5,20}$/.test(qe.trim()) ? "" : tr("Enter a valid phone number") : tr("Phone is required"),
      email: (qe) => qe.trim() ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(qe.trim()) ? "" : tr("Enter a valid email address") : tr("Email is required")
    };
    watch(
      () => Ve.value.name,
      (qe) => {
        Re.value && (Ie.value.name = ze.name(qe));
      }
    ), watch(
      () => Ve.value.phone,
      (qe) => {
        Re.value && (Ie.value.phone = ze.phone(qe));
      }
    ), watch(
      () => Ve.value.email,
      (qe) => {
        Re.value && (Ie.value.email = ze.email(qe));
      }
    );
    const je = () => (Ie.value.name = ze.name(Ve.value.name), Ie.value.phone = ze.phone(Ve.value.phone), Ie.value.email = ze.email(Ve.value.email), !Ie.value.name && !Ie.value.phone && !Ie.value.email), Fe = async () => {
      var Xe;
      if (Re.value = !0, !je() || Le.value) return;
      Le.value = !0;
      const { data: qe } = await createAxios().post("", {
        action: "irep_create_reservation",
        nonce: (Xe = Ne.irePlaginWp) == null ? void 0 : Xe.nonce,
        ...Ve.value
      });
      qe != null && qe.success ? (setTimeout(() => {
        Le.value = !1, De.value = !0, Ve.value = {
          ...Ve.value,
          name: "",
          phone: "",
          email: "",
          comment: ""
        };
      }, 700), setTimeout(() => {
        De.value = !1, Re.value = !1, Ie.value = { name: "", phone: "", email: "" };
      }, 4e3)) : (Le.value = !1, console.error("Something went wrong!"));
    };
    return (qe, Xe) => (openBlock(), createElementBlock("form", {
      onSubmit: withModifiers(Fe, ["prevent"]),
      class: "irep-reservation-form ire-w-full ire-p-2"
    }, [
      createVNode(Transition, {
        name: "ire-fade-in-out",
        mode: "out-in"
      }, {
        default: withCtx(() => [
          De.value ? (openBlock(), createElementBlock("div", _hoisted_1$D, [
            createElementVNode("div", null, toDisplayString(unref(tr)("Thank you! Your request has been received.")), 1)
          ])) : (openBlock(), createElementBlock("div", _hoisted_2$m, [
            createElementVNode("div", _hoisted_3$h, toDisplayString(unref(tr)("Request callback")), 1),
            createVNode(Input, {
              modelValue: Ve.value.name,
              "onUpdate:modelValue": Xe[0] || (Xe[0] = (Ye) => Ve.value.name = Ye),
              label: "Name",
              error: Ie.value.name
            }, null, 8, ["modelValue", "error"]),
            createVNode(Input, {
              modelValue: Ve.value.phone,
              "onUpdate:modelValue": Xe[1] || (Xe[1] = (Ye) => Ve.value.phone = Ye),
              label: "Phone",
              error: Ie.value.phone
            }, null, 8, ["modelValue", "error"]),
            createVNode(Input, {
              modelValue: Ve.value.email,
              "onUpdate:modelValue": Xe[2] || (Xe[2] = (Ye) => Ve.value.email = Ye),
              type: "email",
              label: "Email",
              error: Ie.value.email
            }, null, 8, ["modelValue", "error"]),
            createElementVNode("div", _hoisted_4$f, [
              withDirectives(createElementVNode("textarea", {
                "onUpdate:modelValue": Xe[3] || (Xe[3] = (Ye) => Ve.value.comment = Ye),
                rows: "3",
                onFocus: Xe[4] || (Xe[4] = (Ye) => Ae.value = !0),
                onBlur: Xe[5] || (Xe[5] = (Ye) => Ae.value = !1),
                class: "ire-w-full ire-rounded-md ire-border-none ire-px-3 ire-pb-2 ire-pt-5 ire-text-base ire-outline-none ire-ring-[1px] ire-ring-gray-200 ire-transition-all focus:ire-ring-black"
              }, null, 544), [
                [vModelText, Ve.value.comment]
              ]),
              createElementVNode("span", {
                class: normalizeClass([
                  "ire-pointer-events-none ire-absolute ire-left-3 ire-text-gray-600 ire-transition-all ire-duration-200",
                  Ae.value || Ve.value.comment ? "ire-top-1.5 ire-text-xs" : "ire-top-3 ire-text-base"
                ])
              }, toDisplayString(unref(tr)("Comment")), 3)
            ])
          ]))
        ]),
        _: 1
      }),
      createVNode(Transition, {
        name: "ire-fade-in-out",
        mode: "out-in"
      }, {
        default: withCtx(() => [
          De.value ? createCommentVNode("", !0) : (openBlock(), createElementBlock("div", _hoisted_5$e, [
            createVNode(_sfc_main$O, {
              type: "button",
              title: "back",
              class: "ire-flex-1",
              variant: "outline",
              onClick: Xe[6] || (Xe[6] = (Ye) => ke("hideForm"))
            }),
            createVNode(_sfc_main$O, {
              title: "Submit",
              class: "ire-flex-1",
              disable: Le.value || De.value,
              onClick: Fe
            }, null, 8, ["disable"])
          ]))
        ]),
        _: 1
      })
    ], 32));
  }
}), _hoisted_1$C = {
  key: 0,
  class: "irep-flat-preview-two__form-panel ire-m-4 ire-max-h-[calc(100dvh-5rem)] ire-overflow-y-auto"
}, _hoisted_2$l = {
  key: 1,
  class: "irep-flat-preview-two ire-relative"
}, _hoisted_3$g = { class: "irep-flat-preview-two__header ire-z-10 ire-flex ire-w-full ire-items-center ire-gap-2 ire-bg-white ire-px-4 ire-py-1" }, _hoisted_4$e = { class: "irep-flat-preview-two__body ire-max-h-[calc(100dvh-16rem)] ire-min-h-0 ire-overflow-y-auto sm:ire-max-h-[min(700px,calc(100dvh-14rem))]" }, _hoisted_5$d = { class: "irep-flat-preview-two__info flex ire-m-6 ire-mb-4 ire-flex-col ire-justify-center ire-gap-4 ire-text-center sm:ire-flex-row sm:ire-justify-between lg:ire-gap-14" }, _hoisted_6$c = { class: "irep-flat-preview-two__title-section" }, _hoisted_7$c = { class: "irep-flat-preview-two__flat-number ire-text-left ire-text-2xl ire-font-semibold" }, _hoisted_8$a = {
  key: 0,
  class: "irep-flat-preview-two__teaser ire-mt-2 ire-text-left ire-text-sm ire-text-gray-700"
}, _hoisted_9$8 = { class: "irep-flat-preview-two__price-section ire-min-w-max" }, _hoisted_10$7 = { class: "irep-flat-preview-two__attributes ire-grid ire-grid-cols-2 ire-gap-x-4 ire-gap-y-6 ire-bg-gray-50 ire-p-6 md:ire-grid-cols-3" }, _sfc_main$H = /* @__PURE__ */ defineComponent({
  __name: "FlatPreviewTwo",
  props: {
    flat: {},
    floors: {}
  },
  setup($e) {
    const _e = $e, ke = ref(!1), Be = useGlobalStore(), { getMetaValue: Ne } = Be, { irePlaginWp: Ve, shortcodeData: Le } = storeToRefs(Be), De = computed(() => {
      var Re;
      return !!(Ne("request_callback") === "true" && ((Re = Ve.value) != null && Re.is_gold));
    }), Ae = computed(() => {
      var Re;
      return (Re = Le.value) == null ? void 0 : Re.configs.tableContactUrl;
    }), Ie = () => {
      var Re, ze, je;
      if (De.value && Ne("redirect_to_callback_url") === "true") {
        const Fe = _e.flat, He = Fe ? {
          ...Fe,
          type: Fe.type ? {
            ...Fe.type,
            other: transformOtherToKeyValue(((Re = Fe.type) == null ? void 0 : Re.other) ?? [])
          } : Fe.type
        } : null;
        window.open(
          `${Ae.value}${getNested(He, ((je = (ze = Le.value) == null ? void 0 : ze.configs) == null ? void 0 : je.flatFieldQueryParameter) || "") || (Fe == null ? void 0 : Fe.id)}`,
          "_blank"
        );
      } else
        ke.value = !0;
    };
    return (Re, ze) => (openBlock(), createBlock(Transition, {
      name: "ire-fade-in-out",
      mode: "out-in"
    }, {
      default: withCtx(() => {
        var je, Fe, He, Ge, qe, Xe, Ye, We, Je, ri, Qe, ti, ei, Ze, Ue, Ke, ii, oi, ni, pi, ci;
        return [
          ke.value ? (openBlock(), createElementBlock("div", _hoisted_1$C, [
            createVNode(_sfc_main$I, {
              flat: $e.flat,
              onHideForm: ze[0] || (ze[0] = (fi) => ke.value = !1)
            }, null, 8, ["flat"])
          ])) : (openBlock(), createElementBlock("div", _hoisted_2$l, [
            createElementVNode("div", _hoisted_3$g, [
              createVNode(_sfc_main$_)
            ]),
            createElementVNode("div", _hoisted_4$e, [
              createVNode(_sfc_main$P, {
                flat: $e.flat,
                floors: $e.floors
              }, null, 8, ["flat", "floors"]),
              createElementVNode("div", _hoisted_5$d, [
                createElementVNode("div", _hoisted_6$c, [
                  createElementVNode("div", _hoisted_7$c, toDisplayString((je = $e.flat) == null ? void 0 : je.flat_number), 1),
                  (He = (Fe = $e.flat) == null ? void 0 : Fe.type) != null && He.teaser ? (openBlock(), createElementBlock("div", _hoisted_8$a, toDisplayString((qe = (Ge = $e.flat) == null ? void 0 : Ge.type) == null ? void 0 : qe.teaser), 1)) : createCommentVNode("", !0)
                ]),
                createElementVNode("div", _hoisted_9$8, [
                  $e.flat ? (openBlock(), createBlock(_sfc_main$U, {
                    key: 0,
                    flat: $e.flat,
                    class: "!ire-items-end sm:!ire-items-center"
                  }, null, 8, ["flat"])) : createCommentVNode("", !0)
                ])
              ]),
              createElementVNode("div", _hoisted_10$7, [
                (Xe = $e.flat) != null && Xe.block_id ? (openBlock(), createBlock(_sfc_main$K, {
                  key: 0,
                  keyName: unref(tr)("block"),
                  value: ((Je = (We = unref(getBlockById)(+((Ye = $e.flat) == null ? void 0 : Ye.block_id))) == null ? void 0 : We.title) == null ? void 0 : Je.toString()) || ""
                }, null, 8, ["keyName", "value"])) : createCommentVNode("", !0),
                (ri = $e.flat) != null && ri.floor_id ? (openBlock(), createBlock(_sfc_main$K, {
                  key: 1,
                  keyName: unref(tr)("floor"),
                  value: ((ei = (ti = unref(getFloorById)(+((Qe = $e.flat) == null ? void 0 : Qe.floor_id))) == null ? void 0 : ti.floor_number) == null ? void 0 : ei.toString()) || ""
                }, null, 8, ["keyName", "value"])) : createCommentVNode("", !0),
                (Ue = (Ze = $e.flat) == null ? void 0 : Ze.type) != null && Ue.area_m2 ? (openBlock(), createBlock(_sfc_main$K, {
                  key: 2,
                  keyName: unref(tr)("area"),
                  value: unref(getArea)((Ke = $e.flat) == null ? void 0 : Ke.type.area_m2)
                }, {
                  sufix: withCtx(() => [
                    createElementVNode("span", null, toDisplayString(unref(getAreaUnitLabel)()) + "² ", 1)
                  ]),
                  _: 1
                }, 8, ["keyName", "value"])) : createCommentVNode("", !0),
                (oi = (ii = $e.flat) == null ? void 0 : ii.type) != null && oi.rooms_count ? (openBlock(), createBlock(_sfc_main$K, {
                  key: 3,
                  keyName: unref(tr)("room"),
                  value: unref(getRoomCount)($e.flat.type.rooms_count)
                }, null, 8, ["keyName", "value"])) : createCommentVNode("", !0),
                (ci = (pi = (ni = $e.flat) == null ? void 0 : ni.type) == null ? void 0 : pi.other) != null && ci.length ? (openBlock(!0), createElementBlock(Fragment, { key: 4 }, renderList($e.flat.type.other.filter((fi) => fi == null ? void 0 : fi.value), (fi) => (openBlock(), createBlock(_sfc_main$K, {
                  key: fi.key,
                  keyName: fi.key,
                  value: fi.value
                }, null, 8, ["keyName", "value"]))), 128)) : createCommentVNode("", !0)
              ])
            ]),
            createVNode(_sfc_main$L, {
              flat: $e.flat,
              floors: $e.floors,
              showCallbackButton: De.value,
              onShowForm: Ie
            }, null, 8, ["flat", "floors", "showCallbackButton"])
          ]))
        ];
      }),
      _: 1
    }));
  }
}), _sfc_main$G = {}, _hoisted_1$B = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 256 256"
};
function _sfc_render$b($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$B, [..._e[0] || (_e[0] = [
    createStaticVNode('<g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><rect class="cls-1" width="256" height="256" rx="128"></rect><path class="cls-2" d="M138.26,42.2C116.44,52.3,113,54,112.25,55.27s-.8,3.9-.8,69.36c0,60.7-.08,68.19-.62,68.65-1,.8-7.54-.62-8.38-1.84-.55-.75-.63-8.63-.63-58.81,0-52.1-.08-58-.67-58.93a4.29,4.29,0,0,0-4.56-1.51c-3.06.92-29,13.53-29.87,14.54l-.92,1v41c0,40.59,0,41-.84,41.47a1.67,1.67,0,0,1-1.59,0c-1.21-.63-7.62-7.5-11.06-11.81s-4.27-4.82-6.53-4.19c-.71.21-4.9,3.14-9.3,6.53s-8.34,6.08-8.71,6c-2.31-.21-3.44.67-3.44,2.68,0,1.68.38,2.27,1.68,2.73a2.76,2.76,0,0,0,3.81-2.06c.46-1.42,1.42-2.34,8.25-7.53a96.6,96.6,0,0,1,8.42-6.08c.92-.25,1.13,0,4.15,3.81,3.93,5,11.18,12.23,12.56,12.49a4.82,4.82,0,0,0,2.39-.3c2.68-1.13,2.51,1.93,2.72-43.35l.21-41.3L83,81.16c7.92-3.77,14.66-6.83,15-6.83a2.05,2.05,0,0,1,1.13.67c.58.59.67,6.49.67,58.6,0,41.59.12,58.26.46,59,.58,1.34,1.46,1.76,5.78,2.81,3.93,1,5.36.84,6.78-.67l1-1.09.12-68.36c.09-64.42.13-68.44.84-69,.55-.5,25.93-12.6,28.48-13.61a1.67,1.67,0,0,1,1.34.5c.84.76.84,1.76.84,75.06,0,82-.21,75.77,2.6,76.74,1.3.46,4.19,0,5.82-.84,2.14-1.13,2,.42,2-47.16,0-24.38.17-44.53.34-44.78.38-.54,28-9.8,29.28-9.8a1.83,1.83,0,0,1,1.38.8c.29.54.42,13.52.42,39.12v38.28l1,1.09a4,4,0,0,0,4.61.92c1.55-.63,7.25-6.53,11.69-12.06,1.8-2.22,3.52-4.07,3.85-4.07,1,0,17.34,12.61,17.34,13.41,0,2.39,3.56,3.6,5.11,1.71a2.85,2.85,0,0,0-2.43-4.77c-1.46,0-2.39-.5-9.8-6.12-4.52-3.39-8.71-6.32-9.34-6.49-1.84-.46-3.43.63-6.41,4.36-4.1,5.19-8.46,9.88-10.34,11.18L191,170.83l-.79-1c-.76-.92-.8-2.39-.8-39.29V92.26L188.15,91a3.78,3.78,0,0,0-2.39-1.21c-1.09,0-26.47,8.12-29.61,9.5-3,1.3-2.81-1.8-2.81,47.42s.21,45.36-2.76,45.95c-1.14.21-1.68.08-2.18-.42-.67-.63-.71-6.37-.8-74.93-.08-58.77-.21-74.44-.63-75.23A5.74,5.74,0,0,0,143.41,40C143.25,40,140.9,41,138.26,42.2Z"></path><path class="cls-2" d="M127.62,71.48a3,3,0,0,0,.17,3.9c.84.75.84,1.29.84,59.35s0,58.64-.84,59.68c-1.72,2.22-.59,4.74,2.09,4.74s3.82-2.52,2.1-4.74c-.84-1-.84-1.67-.84-59.56s0-58.51.84-59.56a4,4,0,0,0,.84-2.05C132.82,70.81,129,69.51,127.62,71.48Z"></path><path class="cls-2" d="M83,99.75c-2.13.8-2.85,3.52-1.25,5,.83.75.83,1.29.83,40.5s0,39.71-.83,40.54a3.38,3.38,0,0,0-.84,2.1,2.8,2.8,0,0,0,5,1.84c1.09-1.42,1.13-2.68,0-3.85-.83-.88-.83-1.47-.83-40.55s0-39.62.83-40.67a4,4,0,0,0,.84-2C86.74,100.84,84.56,99.17,83,99.75Z"></path><path class="cls-2" d="M169.13,121.16a3.21,3.21,0,0,0,.13,4.14c.83.72.83,1.26.83,26.94s0,26.22-.83,26.93c-1.6,1.38-.8,4.81,1.17,4.94,2.34.17,3.27-.38,3.64-2.22a2.61,2.61,0,0,0-.58-2.47c-.88-1.17-.88-1.42-.88-27.23,0-25.38,0-26,.84-27,1-1.39,1-2.27,0-3.65A2.9,2.9,0,0,0,169.13,121.16Z"></path></g></g>', 1)
  ])]);
}
const Logo = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["render", _sfc_render$b]]), _hoisted_1$A = { class: "irep-flat-modal-image ire-flex ire-h-full ire-w-full ire-flex-col ire-justify-between ire-overflow-hidden" }, _hoisted_2$k = { class: "irep-flat-modal-image__slides ire-relative ire-grid ire-overflow-visible ire-px-4" }, _hoisted_3$f = ["data-fancybox", "href"], _hoisted_4$d = ["src", "alt", "width", "height"], _hoisted_5$c = {
  key: 0,
  class: "irep-flat-modal-image__pagination ire-pointer-events-none ire-absolute ire-bottom-3 ire-left-1/2 ire-z-20 -ire-translate-x-1/2"
}, _hoisted_6$b = { class: "irep-flat-modal-image__actions flex ire-flex-col ire-flex-wrap ire-items-center ire-justify-center ire-gap-4 ire-p-4 sm:ire-flex-row lg:ire-gap-3" }, _hoisted_7$b = {
  key: 0,
  class: "irep-flat-modal-image__view-toggle-wrapper ire-w-auto"
}, _hoisted_8$9 = ["aria-label"], _hoisted_9$7 = ["aria-selected"], _hoisted_10$6 = { class: "ire-whitespace-nowrap" }, _hoisted_11$5 = ["aria-selected"], _hoisted_12$3 = { class: "ire-whitespace-nowrap" }, _hoisted_13$2 = {
  key: 0,
  class: "irep-flat-modal-image__watermark ire-absolute ire-right-12 ire-top-4 ire-z-20 ire-aspect-square ire-cursor-pointer md:ire-bottom-4 md:ire-left-4 md:ire-right-[unset] md:ire-top-[unset]"
}, _hoisted_14$2 = {
  href: "https://www.ireplugin.com/",
  target: "_blank"
}, _sfc_main$F = /* @__PURE__ */ defineComponent({
  __name: "FlatModalImage",
  props: {
    flat: {}
  },
  setup($e) {
    const _e = $e, ke = useGlobalStore(), { getMetaValue: Be } = ke, { irePlaginWp: Ne } = storeToRefs(ke), Ve = ref(), Le = ref(0), De = ref(!0), Ae = ref(0), Ie = ref(0), Re = computed(() => {
      var He, Ge, qe, Xe, Ye, We;
      return !!((qe = (Ge = (He = _e.flat) == null ? void 0 : He.type) == null ? void 0 : Ge.image_2d) != null && qe.length && ((We = (Ye = (Xe = _e.flat) == null ? void 0 : Xe.type) == null ? void 0 : Ye.image_3d) != null && We.length));
    }), ze = computed(() => {
      var Ge, qe, Xe, Ye, We, Je;
      return (De.value && ((qe = (Ge = _e.flat.type) == null ? void 0 : Ge.image_2d) != null && qe.length) ? (Xe = _e.flat.type) == null ? void 0 : Xe.image_2d : !De.value && ((We = (Ye = _e.flat.type) == null ? void 0 : Ye.image_3d) != null && We.length) ? (Je = _e.flat.type) == null ? void 0 : Je.image_3d : []).slice(0, 6);
    }), je = (He) => {
      var Ge;
      Ve.value = He, Le.value = He.activeIndex ?? 0, (Ge = He.on) == null || Ge.call(He, "slideChange", () => {
        Le.value = He.activeIndex ?? 0;
      });
    }, Fe = (He) => {
      var Ge, qe;
      (qe = (Ge = Ve.value) == null ? void 0 : Ge.slideTo) == null || qe.call(Ge, He);
    };
    return watch(
      () => De.value,
      () => {
        Ae.value = 0, Ie.value++, setTimeout(() => {
          var He, Ge, qe;
          (Ge = (He = Ve.value) == null ? void 0 : He.update) == null || Ge.call(He), Le.value = ((qe = Ve.value) == null ? void 0 : qe.activeIndex) ?? 0;
        }, 400);
      }
    ), onMounted(() => {
      var He, Ge, qe;
      (qe = Object.keys(((Ge = (He = _e.flat) == null ? void 0 : He.type) == null ? void 0 : Ge.image_2d) || {})) != null && qe.length ? De.value = !0 : De.value = !1;
    }), (He, Ge) => (openBlock(), createBlock(FancyBoxComp, { options: {} }, {
      default: withCtx(() => {
        var qe, Xe, Ye, We, Je, ri, Qe, ti, ei, Ze, Ue;
        return [
          createElementVNode("div", _hoisted_1$A, [
            Ge[3] || (Ge[3] = createElementVNode("div", { class: "irep-flat-modal-image__header ire-absolute ire-h-8 lg:ire-static" }, null, -1)),
            createElementVNode("div", _hoisted_2$k, [
              (openBlock(), createBlock(unref(Swiper), {
                key: (qe = ze.value[0]) == null ? void 0 : qe.url,
                "slides-per-view": 1,
                "space-between": 50,
                class: "ire-w-full !ire-overflow-visible ire-rounded-md",
                onSwiper: je
              }, {
                default: withCtx(() => [
                  (openBlock(!0), createElementBlock(Fragment, null, renderList(ze.value, (Ke, ii) => (openBlock(), createBlock(unref(SwiperSlide), {
                    key: (Ke == null ? void 0 : Ke.url) + ii,
                    class: "ire-flex !ire-w-full ire-justify-center ire-bg-gray-50 ire-text-center"
                  }, {
                    default: withCtx(() => [
                      (openBlock(), createElementBlock("a", {
                        key: (Ke == null ? void 0 : Ke.url) + ii,
                        "data-fancybox": De.value ? "gallery-2d" : "gallery-3d",
                        href: Ke == null ? void 0 : Ke.url,
                        class: "irep-flat-preview__left-3d ire-relative ire-block ire-w-full"
                      }, [
                        Ge[2] || (Ge[2] = createElementVNode("div", {
                          class: "irep-flat-modal-image__image-spacer ire-w-full ire-pt-[75%]",
                          "aria-hidden": "true"
                        }, null, -1)),
                        (openBlock(), createElementBlock("img", {
                          key: (Ke == null ? void 0 : Ke.url) + ii,
                          src: Ke == null ? void 0 : Ke.url,
                          alt: (Ke == null ? void 0 : Ke.alt) || "",
                          width: Ke != null && Ke.width && Number(Ke.width) > 0 ? Math.round(Number(Ke.width)) : void 0,
                          height: Ke != null && Ke.height && Number(Ke.height) > 0 ? Math.round(Number(Ke.height)) : void 0,
                          class: "ire-absolute ire-left-0 ire-top-0 ire-h-full ire-w-full ire-object-contain ire-object-center"
                        }, null, 8, _hoisted_4$d))
                      ], 8, _hoisted_3$f))
                    ]),
                    _: 2
                  }, 1024))), 128))
                ]),
                _: 1
              })),
              ze.value.length > 1 ? (openBlock(), createElementBlock("div", _hoisted_5$c, [
                ((Xe = ze.value) == null ? void 0 : Xe.length) > 1 ? (openBlock(), createBlock(_sfc_main$T, {
                  key: 0,
                  imagesUrls: ze.value,
                  activeSlideIndex: Le.value,
                  goToSlide: Fe
                }, null, 8, ["imagesUrls", "activeSlideIndex"])) : createCommentVNode("", !0)
              ])) : createCommentVNode("", !0)
            ]),
            createElementVNode("div", _hoisted_6$b, [
              Re.value ? (openBlock(), createElementBlock("div", _hoisted_7$b, [
                createElementVNode("div", {
                  class: "irep-flat-modal-image__view-toggle ire-inline-flex ire-min-h-[2.75rem] ire-w-full ire-max-w-md ire-items-stretch ire-gap-1 ire-rounded-full ire-bg-[#e5e7eb33] ire-p-1 sm:ire-w-auto sm:ire-min-w-[min(100%,20rem)]",
                  role: "tablist",
                  "aria-label": unref(tr)("plan view")
                }, [
                  (ri = (Je = (We = (Ye = $e.flat) == null ? void 0 : Ye.type) == null ? void 0 : We.image_2d) == null ? void 0 : Je[0]) != null && ri.url ? (openBlock(), createElementBlock("div", {
                    key: 0,
                    role: "tab",
                    "aria-selected": De.value,
                    class: normalizeClass([
                      "irep-flat-modal-image__view-tab ire-group ire-flex ire-min-w-0 ire-flex-1 ire-cursor-pointer ire-items-center ire-justify-center ire-gap-2 ire-rounded-full ire-fill-transparent ire-px-2 ire-py-1 ire-text-sm ire-transition-all ire-duration-500 hover:ire-text-black",
                      De.value ? "ire-bg-white ire-text-gray-900 ire-shadow-sm" : "ire-bg-transparent hover:ire-bg-white"
                    ]),
                    onClick: Ge[0] || (Ge[0] = (Ke) => De.value = !0)
                  }, [
                    createVNode(FlatIcon, { class: "ire-size-4 ire-shrink-0 ire-transition-all ire-duration-500 [&_path]:ire-stroke-current group-hover:[&_path]:ire-stroke-black" }),
                    createElementVNode("span", _hoisted_10$6, toDisplayString(unref(tr)("2d plan")), 1)
                  ], 10, _hoisted_9$7)) : createCommentVNode("", !0),
                  (Ze = (ei = (ti = (Qe = $e.flat) == null ? void 0 : Qe.type) == null ? void 0 : ti.image_3d) == null ? void 0 : ei[0]) != null && Ze.url ? (openBlock(), createElementBlock("div", {
                    key: 1,
                    role: "tab",
                    "aria-selected": !De.value,
                    class: normalizeClass([
                      "irep-flat-modal-image__view-tab ire-group ire-flex ire-min-w-0 ire-flex-1 ire-cursor-pointer ire-items-center ire-justify-center ire-gap-2 ire-rounded-full ire-px-2 ire-py-1 ire-text-sm ire-transition-all ire-duration-500 hover:ire-text-black",
                      De.value ? "ire-bg-transparent hover:ire-bg-white" : "ire-bg-white ire-text-gray-900 ire-shadow-sm"
                    ]),
                    onClick: Ge[1] || (Ge[1] = (Ke) => De.value = !1)
                  }, [
                    createVNode(Cube3d, { class: "ire-size-4 ire-shrink-0 ire-fill-transparent ire-transition-all ire-duration-500 [&_path]:ire-stroke-current group-hover:[&_path]:ire-stroke-black" }),
                    createElementVNode("span", _hoisted_12$3, toDisplayString(unref(tr)("3d plan")), 1)
                  ], 10, _hoisted_11$5)) : createCommentVNode("", !0)
                ], 8, _hoisted_8$9)
              ])) : createCommentVNode("", !0)
            ])
          ]),
          unref(Be)("remove_watermark") !== "true" || !((Ue = unref(Ne)) != null && Ue.is_premium) ? (openBlock(), createElementBlock("div", _hoisted_13$2, [
            createElementVNode("a", _hoisted_14$2, [
              createVNode(Logo, { class: "ire-size-12" })
            ])
          ])) : createCommentVNode("", !0)
        ];
      }),
      _: 1
    }));
  }
}), _hoisted_1$z = {
  key: 0,
  class: "irep-flat-kv ire-flex ire-h-fit ire-w-fit ire-flex-col ire-items-center"
}, _sfc_main$E = /* @__PURE__ */ defineComponent({
  __name: "FlatPreviewKeyValue",
  props: {
    keyName: {},
    value: {},
    keyClass: {},
    valueClass: {}
  },
  setup($e) {
    return (_e, ke) => $e.value ? (openBlock(), createElementBlock("div", _hoisted_1$z, [
      renderSlot(_e.$slots, "top"),
      createElementVNode("div", {
        class: normalizeClass(["irep-flat-kv__value ire-text-center ire-text-2xl !ire-font-normal ire-text-black", $e.keyClass])
      }, [
        createTextVNode(toDisplayString($e.value) + " ", 1),
        renderSlot(_e.$slots, "sufix")
      ], 2),
      createElementVNode("div", {
        class: normalizeClass(["irep-flat-kv__key ire-pt-2 ire-text-sm ire-uppercase ire-text-gray-500", $e.valueClass])
      }, toDisplayString($e.keyName), 3)
    ])) : createCommentVNode("", !0);
  }
}), _hoisted_1$y = { class: "irep-flat-preview__details ire-flex ire-w-full ire-flex-col ire-items-center ire-justify-center ire-gap-4" }, _hoisted_2$j = {
  key: 1,
  class: "irep-flat-preview__type ire-text-center"
}, _hoisted_3$e = { class: "irep-flat-preview__type-title ire-text-lg ire-font-medium ire-text-black" }, _hoisted_4$c = {
  key: 0,
  class: "irep-flat-preview__type-teaser ire-pt-2 ire-text-sm ire-uppercase ire-text-gray-500"
}, _hoisted_5$b = { class: "irep-flat-preview__attributes ire-mt-4 ire-flex ire-w-full ire-flex-wrap ire-items-center ire-justify-center ire-gap-9 ire-overflow-y-auto lg:ire-max-h-[350px]" }, _hoisted_6$a = { class: "irep-flat-moda-action-buttons ire-flex ire-flex-col ire-gap-4 ire-text-center sm:ire-flex-row" }, _hoisted_7$a = ["href"], _hoisted_8$8 = {
  key: 1,
  class: "irep-flat-moda-action-buttons__request-callback ire-w-full !ire-no-underline hover:!ire-no-underline"
}, _sfc_main$D = /* @__PURE__ */ defineComponent({
  __name: "FlatPreviewOneRightV1",
  props: {
    flat: {},
    showForm: { type: Boolean },
    showCallbackButton: { type: Boolean }
  },
  emits: ["requestCallback"],
  setup($e, { emit: _e }) {
    const ke = _e;
    return (Be, Ne) => {
      var Ve, Le, De, Ae, Ie, Re, ze, je, Fe, He, Ge, qe, Xe, Ye, We, Je, ri, Qe, ti, ei, Ze, Ue, Ke, ii, oi, ni, pi, ci, fi, hi, ui, ai, di, gi, si, mi, ki;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["irep-flat-preview__right ease-in-out-quint ire-flex ire-h-full ire-w-full ire-flex-[1_0_auto] ire-origin-left ire-flex-col ire-justify-between ire-gap-4 ire-px-6 ire-py-4 ire-transition-transform ire-duration-300", {
          "!ire-h-0 -ire-translate-x-full ire-scale-0 md:!ire-h-auto": $e.showForm
        }])
      }, [
        createElementVNode("div", _hoisted_1$y, [
          (Ve = $e.flat) != null && Ve.flat_number ? (openBlock(), createBlock(_sfc_main$E, {
            key: 0,
            keyName: unref(tr)("apartment"),
            value: $e.flat.flat_number,
            keyClass: "flat_type",
            valueClass: "flat_type_value",
            class: "[&_.flat-preview-value]:ire-min-w-fit [&_.flat-preview-value]:ire-font-semibold"
          }, null, 8, ["keyName", "value"])) : createCommentVNode("", !0),
          (De = (Le = $e.flat) == null ? void 0 : Le.type) != null && De.title || (Ie = (Ae = $e.flat) == null ? void 0 : Ae.type) != null && Ie.teaser ? (openBlock(), createElementBlock("div", _hoisted_2$j, [
            createElementVNode("div", _hoisted_3$e, toDisplayString((ze = (Re = $e.flat) == null ? void 0 : Re.type) == null ? void 0 : ze.title), 1),
            (Fe = (je = $e.flat) == null ? void 0 : je.type) != null && Fe.teaser ? (openBlock(), createElementBlock("div", _hoisted_4$c, toDisplayString((Ge = (He = $e.flat) == null ? void 0 : He.type) == null ? void 0 : Ge.teaser), 1)) : createCommentVNode("", !0)
          ])) : createCommentVNode("", !0),
          createElementVNode("div", _hoisted_5$b, [
            (qe = $e.flat) != null && qe.block_id ? (openBlock(), createBlock(_sfc_main$E, {
              key: 0,
              keyName: unref(tr)("block"),
              value: ((We = (Ye = unref(getBlockById)(+((Xe = $e.flat) == null ? void 0 : Xe.block_id))) == null ? void 0 : Ye.title) == null ? void 0 : We.toString()) || "",
              keyClass: "flat_block_key flat_date_key",
              valueClass: "flat_block_value flat_date_value",
              class: "irep-flat-preview__right-floor-block"
            }, null, 8, ["keyName", "value"])) : createCommentVNode("", !0),
            (Je = $e.flat) != null && Je.floor_id ? (openBlock(), createBlock(_sfc_main$E, {
              key: 1,
              keyName: unref(tr)("floor"),
              value: ((ti = (Qe = unref(getFloorById)(+((ri = $e.flat) == null ? void 0 : ri.floor_id))) == null ? void 0 : Qe.floor_number) == null ? void 0 : ti.toString()) || "",
              keyClass: "flat_floor_name_key flat_date_key",
              valueClass: "flat_floor_name_value flat_date_value",
              class: "irep-flat-preview__right-floor-number"
            }, null, 8, ["keyName", "value"])) : createCommentVNode("", !0),
            (ei = $e.flat) != null && ei.floor_id ? (openBlock(), createBlock(_sfc_main$E, {
              key: 2,
              keyName: unref(tr)("floor title"),
              value: ((Ke = (Ue = unref(getFloorById)(+((Ze = $e.flat) == null ? void 0 : Ze.floor_id))) == null ? void 0 : Ue.title) == null ? void 0 : Ke.toString()) || "",
              keyClass: "flat_floor_key flat_date_key",
              valueClass: "flat_floor_value flat_date_value",
              class: "irep-flat-preview__right-floor-title"
            }, null, 8, ["keyName", "value"])) : createCommentVNode("", !0),
            (oi = (ii = $e.flat) == null ? void 0 : ii.type) != null && oi.area_m2 ? (openBlock(), createBlock(_sfc_main$E, {
              key: 3,
              keyName: unref(tr)("area"),
              value: unref(getArea)((ni = $e.flat) == null ? void 0 : ni.type.area_m2),
              keyClass: "flat_area_key flat_date_key",
              valueClass: "flat_area_value flat_date_value",
              class: "irep-flat-preview__right-floor-area"
            }, {
              sufix: withCtx(() => [
                createElementVNode("span", null, toDisplayString(unref(getAreaUnitLabel)()) + "² ", 1)
              ]),
              _: 1
            }, 8, ["keyName", "value"])) : createCommentVNode("", !0),
            (ci = (pi = $e.flat) == null ? void 0 : pi.type) != null && ci.rooms_count ? (openBlock(), createBlock(_sfc_main$E, {
              key: 4,
              keyName: unref(tr)("room"),
              value: unref(getRoomCount)($e.flat.type.rooms_count),
              keyClass: "flat_rooms_key flat_date_key",
              valueClass: "flat_rooms_value flat_date_value",
              class: "irep-flat-preview__right-floor-room"
            }, null, 8, ["keyName", "value"])) : createCommentVNode("", !0),
            (ui = (hi = (fi = $e.flat) == null ? void 0 : fi.type) == null ? void 0 : hi.other) != null && ui.length ? (openBlock(!0), createElementBlock(Fragment, { key: 5 }, renderList($e.flat.type.other, (Si) => (openBlock(), createBlock(_sfc_main$E, {
              key: Si.key,
              keyName: Si.key,
              value: Si.value,
              keyClass: "flat_date_key",
              valueClass: "flat_date_value"
            }, null, 8, ["keyName", "value"]))), 128)) : createCommentVNode("", !0)
          ])
        ]),
        $e.flat ? (openBlock(), createBlock(_sfc_main$U, {
          key: 0,
          flat: $e.flat
        }, null, 8, ["flat"])) : createCommentVNode("", !0),
        createElementVNode("div", _hoisted_6$a, [
          (gi = (di = (ai = $e.flat) == null ? void 0 : ai.files) == null ? void 0 : di[0]) != null && gi.url ? (openBlock(), createElementBlock("a", {
            key: 0,
            href: (ki = (mi = (si = $e.flat) == null ? void 0 : si.files) == null ? void 0 : mi[0]) == null ? void 0 : ki.url,
            target: "_blank",
            class: "irep-flat-moda-action-buttons__download-file ire-w-full !ire-no-underline hover:!ire-no-underline"
          }, [
            createVNode(_sfc_main$O, {
              title: unref(tr)("download file"),
              variant: "outline",
              class: "ire-w-full"
            }, {
              icon: withCtx(() => [
                createVNode(DownloadIcon, { class: "ire-size-4 group-hover:[&_path]:ire-stroke-white" })
              ]),
              _: 1
            }, 8, ["title"])
          ], 8, _hoisted_7$a)) : createCommentVNode("", !0),
          $e.showCallbackButton ? (openBlock(), createElementBlock("div", _hoisted_8$8, [
            createVNode(_sfc_main$O, {
              title: unref(tr)("Request callback"),
              active: "",
              class: "!ire-w-full",
              onClick: Ne[0] || (Ne[0] = (Si) => ke("requestCallback"))
            }, {
              icon: withCtx(() => [
                createVNode(PhoneIcon, { class: "ire-size-4 [&_path]:ire-fill-white" })
              ]),
              _: 1
            }, 8, ["title"])
          ])) : createCommentVNode("", !0)
        ])
      ], 2);
    };
  }
}), _hoisted_1$x = {
  key: 0,
  class: "irep-flat-preview__attr-row ire-flex ire-items-center ire-justify-between ire-border-b ire-border-gray-100 ire-py-2.5"
}, _hoisted_2$i = { class: "ire-text-sm ire-text-gray-400" }, _hoisted_3$d = { class: "ire-text-sm ire-font-medium ire-text-gray-900" }, _sfc_main$C = /* @__PURE__ */ defineComponent({
  __name: "FlatPreviewOneAttrRow",
  props: {
    label: {},
    value: {}
  },
  setup($e) {
    return (_e, ke) => $e.value ? (openBlock(), createElementBlock("div", _hoisted_1$x, [
      createElementVNode("span", _hoisted_2$i, toDisplayString($e.label), 1),
      createElementVNode("span", _hoisted_3$d, [
        renderSlot(_e.$slots, "default", {}, () => [
          createTextVNode(toDisplayString($e.value), 1)
        ])
      ])
    ])) : createCommentVNode("", !0);
  }
}), _hoisted_1$w = { class: "irep-flat-preview__details-v2 ire-flex ire-w-full ire-flex-col ire-gap-4" }, _hoisted_2$h = { class: "ire-flex ire-flex-col ire-gap-1" }, _hoisted_3$c = { class: "ire-flex ire-items-center ire-gap-2" }, _hoisted_4$b = {
  key: 0,
  class: "irep-flat-kv__number-badge ire-inline-flex ire-items-center ire-rounded-md ire-bg-gray-100 ire-px-2.5 ire-py-1 ire-text-xs ire-font-semibold ire-uppercase ire-tracking-wide ire-text-gray-700"
}, _hoisted_5$a = {
  key: 0,
  class: "irep-flat-preview__type-title ire-text-xl ire-font-semibold ire-text-gray-900"
}, _hoisted_6$9 = {
  key: 1,
  class: "irep-flat-preview__type-teaser ire-text-sm ire-text-gray-400"
}, _hoisted_7$9 = { class: "irep-flat-preview__attr-list ire-flex ire-w-full ire-flex-col ire-overflow-y-auto ire-pr-2 lg:ire-max-h-[300px]" }, _hoisted_8$7 = { class: "ire-flex ire-flex-col ire-gap-4" }, _hoisted_9$6 = { class: "irep-flat-moda-action-buttons ire-flex ire-flex-col ire-gap-3 sm:ire-flex-row" }, _hoisted_10$5 = ["href"], _hoisted_11$4 = {
  key: 1,
  class: "irep-flat-moda-action-buttons__request-callback ire-w-full !ire-no-underline hover:!ire-no-underline"
}, _sfc_main$B = /* @__PURE__ */ defineComponent({
  __name: "FlatPreviewOneRightV2",
  props: {
    flat: {},
    showForm: { type: Boolean },
    showCallbackButton: { type: Boolean }
  },
  emits: ["requestCallback"],
  setup($e, { emit: _e }) {
    const ke = _e;
    return (Be, Ne) => {
      var Ve, Le, De, Ae, Ie, Re, ze, je, Fe, He, Ge, qe, Xe, Ye, We, Je, ri, Qe, ti, ei, Ze, Ue, Ke;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["irep-flat-preview__right irep-flat-preview__right--v2 ease-in-out-quint ire-flex ire-h-full ire-w-full ire-flex-[1_0_auto] ire-origin-left ire-flex-col ire-justify-between ire-gap-4 ire-px-6 ire-py-5 ire-transition-transform ire-duration-300", {
          "!ire-h-0 -ire-translate-x-full ire-scale-0 md:!ire-h-auto": $e.showForm
        }])
      }, [
        createElementVNode("div", _hoisted_1$w, [
          createElementVNode("div", _hoisted_2$h, [
            createElementVNode("div", _hoisted_3$c, [
              (Ve = $e.flat) != null && Ve.flat_number ? (openBlock(), createElementBlock("span", _hoisted_4$b, toDisplayString(unref(tr)("apartment")) + " " + toDisplayString($e.flat.flat_number), 1)) : createCommentVNode("", !0)
            ]),
            (De = (Le = $e.flat) == null ? void 0 : Le.type) != null && De.title ? (openBlock(), createElementBlock("div", _hoisted_5$a, toDisplayString($e.flat.type.title), 1)) : createCommentVNode("", !0),
            (Ie = (Ae = $e.flat) == null ? void 0 : Ae.type) != null && Ie.teaser ? (openBlock(), createElementBlock("div", _hoisted_6$9, toDisplayString($e.flat.type.teaser), 1)) : createCommentVNode("", !0)
          ]),
          createElementVNode("div", _hoisted_7$9, [
            (Re = $e.flat) != null && Re.block_id ? (openBlock(), createBlock(_sfc_main$C, {
              key: 0,
              label: unref(tr)("block"),
              value: (ze = unref(getBlockById)(+$e.flat.block_id)) == null ? void 0 : ze.title
            }, null, 8, ["label", "value"])) : createCommentVNode("", !0),
            (je = $e.flat) != null && je.floor_id ? (openBlock(), createBlock(_sfc_main$C, {
              key: 1,
              label: unref(tr)("floor"),
              value: (Fe = unref(getFloorById)(+$e.flat.floor_id)) == null ? void 0 : Fe.floor_number
            }, null, 8, ["label", "value"])) : createCommentVNode("", !0),
            (He = $e.flat) != null && He.floor_id ? (openBlock(), createBlock(_sfc_main$C, {
              key: 2,
              label: unref(tr)("floor title"),
              value: (Ge = unref(getFloorById)(+$e.flat.floor_id)) == null ? void 0 : Ge.title
            }, null, 8, ["label", "value"])) : createCommentVNode("", !0),
            (Xe = (qe = $e.flat) == null ? void 0 : qe.type) != null && Xe.area_m2 ? (openBlock(), createBlock(_sfc_main$C, {
              key: 3,
              label: unref(tr)("area"),
              value: unref(getArea)($e.flat.type.area_m2)
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(unref(getArea)($e.flat.type.area_m2)) + " " + toDisplayString(unref(getAreaUnitLabel)()) + "² ", 1)
              ]),
              _: 1
            }, 8, ["label", "value"])) : createCommentVNode("", !0),
            (We = (Ye = $e.flat) == null ? void 0 : Ye.type) != null && We.rooms_count ? (openBlock(), createBlock(_sfc_main$C, {
              key: 4,
              label: unref(tr)("room"),
              value: unref(getRoomCount)($e.flat.type.rooms_count)
            }, null, 8, ["label", "value"])) : createCommentVNode("", !0),
            (openBlock(!0), createElementBlock(Fragment, null, renderList((ri = (Je = $e.flat) == null ? void 0 : Je.type) == null ? void 0 : ri.other, (ii) => (openBlock(), createBlock(_sfc_main$C, {
              key: ii.key,
              label: ii.key,
              value: ii.value
            }, null, 8, ["label", "value"]))), 128))
          ])
        ]),
        createElementVNode("div", _hoisted_8$7, [
          $e.flat ? (openBlock(), createBlock(_sfc_main$U, {
            key: 0,
            flat: $e.flat,
            class: "[&_.irep-price]:ire-text-left [&_.irep-price]:ire-justify-start"
          }, null, 8, ["flat"])) : createCommentVNode("", !0),
          createElementVNode("div", _hoisted_9$6, [
            (ei = (ti = (Qe = $e.flat) == null ? void 0 : Qe.files) == null ? void 0 : ti[0]) != null && ei.url ? (openBlock(), createElementBlock("a", {
              key: 0,
              href: (Ke = (Ue = (Ze = $e.flat) == null ? void 0 : Ze.files) == null ? void 0 : Ue[0]) == null ? void 0 : Ke.url,
              target: "_blank",
              class: "irep-flat-moda-action-buttons__download-file ire-w-full !ire-no-underline hover:!ire-no-underline"
            }, [
              createVNode(_sfc_main$O, {
                title: unref(tr)("download file"),
                variant: "outline",
                class: "ire-w-full"
              }, {
                icon: withCtx(() => [
                  createVNode(DownloadIcon, { class: "ire-size-4 group-hover:[&_path]:ire-stroke-white" })
                ]),
                _: 1
              }, 8, ["title"])
            ], 8, _hoisted_10$5)) : createCommentVNode("", !0),
            $e.showCallbackButton ? (openBlock(), createElementBlock("div", _hoisted_11$4, [
              createVNode(_sfc_main$O, {
                title: unref(tr)("Request callback"),
                active: "",
                class: "!ire-w-full",
                onClick: Ne[0] || (Ne[0] = (ii) => ke("requestCallback"))
              }, {
                icon: withCtx(() => [
                  createVNode(PhoneIcon, { class: "ire-size-4 [&_path]:ire-fill-white" })
                ]),
                _: 1
              }, 8, ["title"])
            ])) : createCommentVNode("", !0)
          ])
        ])
      ], 2);
    };
  }
}), _hoisted_1$v = { class: "irep-flat-preview__share ire-absolute ire-left-0 ire-top-0 ire-z-20 ire-w-fit ire-p-4" }, _hoisted_2$g = { class: "irep-flat-preview__info-col flex ire-relative ire-overflow-hidden lg:ire-w-full" }, _sfc_main$A = /* @__PURE__ */ defineComponent({
  __name: "FlatPreviewOne",
  props: {
    flat: {},
    floors: {}
  },
  setup($e) {
    const _e = $e, ke = useGlobalStore(), { getMetaValue: Be } = ke, { irePlaginWp: Ne, shortcodeData: Ve } = storeToRefs(ke), Le = ref(!1), De = computed(() => Be("flat_preview_one_style") || "1"), Ae = computed(() => {
      var je, Fe, He, Ge, qe, Xe;
      return ((He = (Fe = (je = _e.flat) == null ? void 0 : je.type) == null ? void 0 : Fe.image_3d) == null ? void 0 : He.length) || ((Xe = (qe = (Ge = _e.flat) == null ? void 0 : Ge.type) == null ? void 0 : qe.image_2d) == null ? void 0 : Xe.length);
    }), Ie = computed(() => {
      var je;
      return !!(Be("request_callback") === "true" && ((je = Ne.value) != null && je.is_gold));
    }), Re = computed(() => {
      var je;
      return (je = Ve.value) == null ? void 0 : je.configs.tableContactUrl;
    }), ze = () => {
      var je, Fe, He;
      if (Ie.value && Be("redirect_to_callback_url") === "true") {
        const Ge = _e.flat, qe = Ge ? {
          ...Ge,
          type: Ge.type ? {
            ...Ge.type,
            other: transformOtherToKeyValue(((je = Ge.type) == null ? void 0 : je.other) ?? [])
          } : Ge.type
        } : null;
        window.open(
          `${Re.value}${getNested(qe, ((He = (Fe = Ve.value) == null ? void 0 : Fe.configs) == null ? void 0 : He.flatFieldQueryParameter) || "") || (Ge == null ? void 0 : Ge.id)}`,
          "_blank"
        );
      } else
        Le.value = !0;
    };
    return (je, Fe) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(["irep-flat-preview ire-relative ire-grid", {
        "lg:ire-grid-cols-[1.4fr,1fr] xl:ire-min-h-[500px] xl:ire-min-w-[1120px]": Ae.value
      }])
    }, [
      createElementVNode("div", _hoisted_1$v, [
        createVNode(_sfc_main$_)
      ]),
      Ae.value && $e.flat ? (openBlock(), createBlock(_sfc_main$F, {
        key: 0,
        flat: $e.flat,
        class: "ire-relative ire-bg-gray-50"
      }, null, 8, ["flat"])) : createCommentVNode("", !0),
      createElementVNode("div", _hoisted_2$g, [
        De.value === "2" ? (openBlock(), createBlock(_sfc_main$B, {
          key: 0,
          flat: $e.flat,
          "show-form": Le.value,
          "show-callback-button": Ie.value,
          onRequestCallback: ze
        }, null, 8, ["flat", "show-form", "show-callback-button"])) : (openBlock(), createBlock(_sfc_main$D, {
          key: 1,
          flat: $e.flat,
          "show-form": Le.value,
          "show-callback-button": Ie.value,
          onRequestCallback: ze
        }, null, 8, ["flat", "show-form", "show-callback-button"])),
        Ie.value ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: normalizeClass(["irep-flat-preview__form-panel ease-in-out-quint ire-mt-4 ire-h-full ire-w-full ire-flex-[1_0_auto] ire-origin-right ire-px-6 ire-py-4 ire-transition-transform ire-duration-300", {
            "!ire-h-0 ire-translate-x-full ire-scale-0": !Le.value,
            "-ire-translate-x-full": Le.value
          }])
        }, [
          createVNode(_sfc_main$I, {
            flat: $e.flat,
            onHideForm: Fe[0] || (Fe[0] = (He) => Le.value = !1)
          }, null, 8, ["flat"])
        ], 2)) : createCommentVNode("", !0)
      ])
    ], 2));
  }
}), _hoisted_1$u = { class: "irep-flat-preview-wrapper" }, _sfc_main$z = /* @__PURE__ */ defineComponent({
  __name: "FlatPreview",
  props: {
    flat: {},
    floors: {}
  },
  emits: ["changeComponent"],
  setup($e) {
    const _e = $e, ke = useGlobalStore(), { getMetaValue: Be } = ke, { irePlaginWp: Ne, shortcodeData: Ve } = storeToRefs(ke), Le = inject("fromListView"), De = computed(() => {
      var Re;
      return Be("shareable_link") === "true" && ((Re = Ne.value) == null ? void 0 : Re.is_gold);
    }), Ae = computed(() => Be("flat_preview")), Ie = () => {
      var je, Fe, He, Ge, qe;
      if (!De.value || Le) return;
      const Re = (Fe = (je = Ve.value) == null ? void 0 : je.floors) == null ? void 0 : Fe.find(
        (Xe) => {
          var Ye, We, Je;
          return ((Ye = Xe.id) == null ? void 0 : Ye.toString()) === ((Je = (We = _e.flat) == null ? void 0 : We.floor_id) == null ? void 0 : Je.toString());
        }
      ), ze = {
        flatId: (He = _e.flat) == null ? void 0 : He.id,
        floorId: Re == null ? void 0 : Re.id,
        projectId: (qe = (Ge = Ve.value) == null ? void 0 : Ge.project) == null ? void 0 : qe.id
      };
      Object.entries(ze).forEach(([Xe, Ye]) => {
        Xe && Ye && setQuery(Xe, Ye);
      });
    };
    return onMounted(() => {
      Ie();
    }), onUnmounted(() => {
      ["flatId", "floorId", "projectId"].forEach((ze) => {
        setQuery(ze, "");
      });
    }), (Re, ze) => (openBlock(), createElementBlock("div", _hoisted_1$u, [
      Ae.value === "2" ? (openBlock(), createBlock(_sfc_main$H, {
        key: 0,
        flat: $e.flat,
        floors: $e.floors
      }, null, 8, ["flat", "floors"])) : (openBlock(), createBlock(_sfc_main$A, {
        key: 1,
        flat: $e.flat,
        floors: $e.floors
      }, null, 8, ["flat", "floors"]))
    ]));
  }
}), _hoisted_1$t = { class: "irep-preview-modal__close-wrapper ire-absolute ire-right-0 ire-top-0 ire-flex ire-w-fit ire-flex-row-reverse ire-p-2" }, _sfc_main$y = /* @__PURE__ */ defineComponent({
  __name: "PreviewModal",
  emits: ["close"],
  setup($e) {
    const _e = useGlobalStore(), { getMetaValue: ke } = _e, { cssVariables: Be } = storeToRefs(_e);
    let Ne = 0, Ve = null, Le = null;
    const De = computed(() => ke("flat_preview"));
    return onMounted(() => {
      Ne = window.scrollY;
      const { body: Ae, documentElement: Ie } = document, Re = window.innerWidth - Ie.clientWidth, je = (parseFloat(getComputedStyle(Ae).paddingRight || "0") || 0) + Re;
      Ve = Ae.getAttribute("style"), Le = Ie.getAttribute("style"), Ae.setAttribute(
        "style",
        `overflow: hidden; padding-right: ${je}px;`
      ), Ie.setAttribute("style", "overflow: hidden;");
    }), onUnmounted(() => {
      setTimeout(() => {
        const { body: Ae, documentElement: Ie } = document;
        Ve !== null ? Ae.setAttribute("style", Ve) : Ae.removeAttribute("style"), Le !== null ? Ie.setAttribute("style", Le) : Ie.removeAttribute("style"), window.scrollTo(0, Ne);
      }, 250);
    }), (Ae, Ie) => (openBlock(), createElementBlock("div", {
      style: normalizeStyle(unref(Be)),
      class: "irep-modal ire-fixed ire-left-0 ire-top-0 ire-z-[99999] ire-flex ire-h-full ire-w-full ire-cursor-pointer ire-items-center ire-justify-center ire-p-4 lg:ire-px-10 lg:ire-py-32"
    }, [
      createElementVNode("div", {
        class: "irep-preview-modal__backdrop ire-absolute ire-left-0 ire-top-0 ire-h-full ire-w-full ire-bg-black/40 ire-transition-all",
        onClick: Ie[0] || (Ie[0] = (Re) => Ae.$emit("close"))
      }),
      createElementVNode("div", {
        class: normalizeClass(["irep-preview-modal__container ire-relative ire-w-full ire-min-w-0 ire-max-w-full ire-cursor-default ire-overflow-hidden ire-bg-white", {
          "ire-rounded-2xl lg:ire-min-w-[200px] lg:ire-max-w-[700px]": De.value === "2",
          "ire-rounded-lg lg:ire-min-w-[500px] xl:ire-max-w-[1200px]": De.value !== "2"
        }])
      }, [
        createElementVNode("div", _hoisted_1$t, [
          createElementVNode("div", {
            class: "irep-preview-modal__close ire-z-[999] ire-flex ire-aspect-[1/1] ire-w-fit ire-cursor-pointer ire-justify-center ire-rounded-full ire-bg-gray-100 ire-p-2 ire-text-center ire-transition-all hover:ire-bg-gray-600 [&_path]:ire-fill-gray-400 [&_path]:hover:ire-fill-white [&_svg]:ire-size-4",
            onClick: Ie[1] || (Ie[1] = (Re) => Ae.$emit("close"))
          }, [
            createVNode(Close)
          ])
        ]),
        createElementVNode("div", {
          class: normalizeClass(["irep-preview-modal__content ire-h-fit ire-max-h-[95svh] ire-min-w-0 ire-max-w-full ire-overflow-x-hidden", {
            "ire-overflow-y-auto": De.value !== "2"
          }])
        }, [
          renderSlot(Ae.$slots, "default")
        ], 2)
      ], 2)
    ], 4));
  }
}), _hoisted_1$s = ["innerHTML"], _sfc_main$x = /* @__PURE__ */ defineComponent({
  __name: "BaseEditor",
  props: {
    editor: {}
  },
  setup($e) {
    return (_e, ke) => (openBlock(), createElementBlock("div", {
      class: "irep-base-editor [&_ul]:ire-columns-1 [&_a]:ire-cursor-pointer [&_a]:ire-text-[#2980b9] [&_a]:ire-underline [&_ul]:ire-flex [&_ul]:ire-flex-col [&_ul]:ire-gap-2 [&_ul_li]:ire-relative [&_ul_li]:ire-pl-[20px] [&_ul_li]:after:ire-absolute [&_ul_li]:after:ire-left-2 [&_ul_li]:after:ire-top-[10px] [&_ul_li]:after:ire-h-[4px] [&_ul_li]:after:ire-w-[4px] [&_ul_li]:after:ire-rounded-[50%] [&_ul_li]:after:ire-bg-black",
      innerHTML: $e.editor
    }, null, 8, _hoisted_1$s));
  }
}), _hoisted_1$r = { class: "irep-action-modal ire-p-5" }, _hoisted_2$f = { class: "ire-mb-3 !ire-text-3xl ire-font-bold" }, _hoisted_3$b = ["src"], _sfc_main$w = /* @__PURE__ */ defineComponent({
  __name: "ActionModal",
  props: {
    modalData: {}
  },
  setup($e) {
    return (_e, ke) => {
      var Be, Ne, Ve, Le, De, Ae, Ie, Re, ze, je, Fe, He;
      return openBlock(), createElementBlock("div", _hoisted_1$r, [
        createElementVNode("p", _hoisted_2$f, toDisplayString((Ne = (Be = $e.modalData) == null ? void 0 : Be.modalObject) == null ? void 0 : Ne.title), 1),
        createVNode(_sfc_main$x, {
          editor: (Le = (Ve = $e.modalData) == null ? void 0 : Ve.modalObject) == null ? void 0 : Le.description
        }, null, 8, ["editor"]),
        (Re = (Ie = (Ae = (De = $e.modalData) == null ? void 0 : De.modalObject) == null ? void 0 : Ae.modalImage) == null ? void 0 : Ie[0]) != null && Re.url ? (openBlock(), createElementBlock("img", {
          key: 0,
          src: (He = (Fe = (je = (ze = $e.modalData) == null ? void 0 : ze.modalObject) == null ? void 0 : je.modalImage) == null ? void 0 : Fe[0]) == null ? void 0 : He.url,
          alt: "",
          class: "ire-mt-5 ire-h-[400px] ire-w-full ire-object-contain"
        }, null, 8, _hoisted_3$b)) : createCommentVNode("", !0)
      ]);
    };
  }
}), _hoisted_1$q = { class: "irep-block-preview__title block-title lg:!ire-text-xl" }, _hoisted_2$e = { class: "irep-block-preview__canvas ire-relative ire-w-full ire-select-none ire-overflow-hidden" }, _hoisted_3$a = ["src", "alt", "width", "height"], _hoisted_4$a = ["innerHTML"], _sfc_main$v = /* @__PURE__ */ defineComponent({
  __name: "BlockPreview",
  props: {
    block: {},
    flats: {},
    floors: {},
    actions: {}
  },
  emits: ["changeComponent"],
  setup($e, { emit: _e }) {
    const ke = _e, Be = $e, Ne = inject("showFlatModal"), Ve = useGlobalStore(), { openReservedFlat: Le, openSoldFlat: De } = storeToRefs(Ve), Ae = ref(), Ie = ref(null), Re = ref(), ze = ref(), je = computed(() => {
      var Ye, We;
      if ((Ye = Be.block) != null && Ye.svg)
        return (We = Be.block) == null ? void 0 : We.svg;
    }), Fe = computed(() => {
      var Ye, We;
      return ((We = (Ye = Be.block) == null ? void 0 : Ye.block_image) == null ? void 0 : We[0]) ?? null;
    }), He = computed(() => {
      const Ye = Fe.value;
      if (!Ye) return null;
      const We = Number(Ye.width), Je = Number(Ye.height);
      return !Number.isFinite(We) || !Number.isFinite(Je) || We <= 0 || Je <= 0 ? null : { width: Math.round(We), height: Math.round(Je) };
    }), Ge = (Ye) => {
      const We = Ye.target;
      We && (Ie.value = We);
    }, qe = (Ye) => {
      var Je, ri, Qe;
      const We = Ye.target;
      (We == null ? void 0 : We.nodeName) === "path" && (((Je = ze.value) == null ? void 0 : Je.conf) === "reserved" && !Le.value || ((ri = ze.value) == null ? void 0 : ri.conf) === "sold" && !De.value || ke(
        "changeComponent",
        ((Qe = Re.value) == null ? void 0 : Qe.type) || "",
        ze.value
      ));
    }, Xe = () => {
      var We;
      if (!Ae.value) return;
      ((We = Ae.value) == null ? void 0 : We.querySelectorAll("g")).forEach((Je) => {
        var Ze, Ue, Ke, ii;
        const ri = Je == null ? void 0 : Je.getAttribute("id"), Qe = (Ue = (Ze = Be.block) == null ? void 0 : Ze.polygon_data) == null ? void 0 : Ue.find(
          (oi) => (oi == null ? void 0 : oi.key) === ri
        ), ti = Qe == null ? void 0 : Qe.id;
        let ei = "";
        switch (Qe == null ? void 0 : Qe.type) {
          case "floor": {
            const oi = (Ke = Be.floors) == null ? void 0 : Ke.find((ni) => ni.id === ti);
            ei = getConfValue((oi == null ? void 0 : oi.conf) || "");
            break;
          }
          case "flat": {
            const oi = (ii = Be.flats) == null ? void 0 : ii.find((ni) => ni.id === ti);
            ei = getConfValue((oi == null ? void 0 : oi.conf) || "");
            break;
          }
        }
        Je.setAttribute("conf", ei || ""), Qe != null && Qe.type && Je.setAttribute("polygon-type", Qe == null ? void 0 : Qe.type);
      });
    };
    return watch(
      () => Ne == null ? void 0 : Ne.value,
      () => {
        Ne != null && Ne.value || (Ie.value = null, Re.value = null);
      }
    ), watch(
      () => Ie.value,
      (Ye) => {
        var Je, ri, Qe, ti, ei, Ze, Ue, Ke;
        if (!Ye) return;
        Ve.hoverdSvg = Ye;
        const We = Ye == null ? void 0 : Ye.parentElement;
        if (We && (We == null ? void 0 : We.nodeName) === "g") {
          const ii = We == null ? void 0 : We.getAttribute("id");
          if (!ii || (Re.value = ((ri = (Je = Be.block) == null ? void 0 : Je.polygon_data) == null ? void 0 : ri.find((oi) => (oi == null ? void 0 : oi.key) === ii)) || null, !Re.value)) return;
          if (((Qe = Re.value) == null ? void 0 : Qe.type) === "floor") {
            const oi = (ti = Be.floors) == null ? void 0 : ti.find(
              (ni) => {
                var pi;
                return (ni == null ? void 0 : ni.id) === ((pi = Re.value) == null ? void 0 : pi.id);
              }
            );
            ze.value = oi;
          } else if (((ei = Re.value) == null ? void 0 : ei.type) === "flat") {
            const oi = (Ze = Be.flats) == null ? void 0 : Ze.find(
              (ni) => {
                var pi;
                return (ni == null ? void 0 : ni.id) === ((pi = Re.value) == null ? void 0 : pi.id);
              }
            );
            ze.value = oi;
          } else if (((Ue = Re.value) == null ? void 0 : Ue.type) === "tooltip") {
            const oi = (Ke = Be.actions) == null ? void 0 : Ke.find(
              (ni) => {
                var pi;
                return (ni == null ? void 0 : ni.id) === ((pi = Re.value) == null ? void 0 : pi.id);
              }
            );
            ze.value = oi;
          } else
            ze.value = null;
        } else
          Re.value = null, ze.value = null;
      }
    ), onMounted(() => {
      Xe(), document.addEventListener("mousemove", Ge);
    }), onUnmounted(() => {
      document.removeEventListener("mousemove", Ge);
    }), (Ye, We) => {
      var Je;
      return openBlock(), createBlock(_sfc_main$17, {
        hoverdData: ze.value,
        type: (Je = Re.value) == null ? void 0 : Je.type
      }, {
        header: withCtx(() => {
          var ri;
          return [
            createVNode(_sfc_main$13, {
              onClick: We[0] || (We[0] = (Qe) => Ye.$emit("changeComponent", "project", null))
            }),
            createElementVNode("div", _hoisted_1$q, toDisplayString((ri = $e.block) == null ? void 0 : ri.title), 1)
          ];
        }),
        default: withCtx(() => {
          var ri, Qe, ti;
          return [
            createElementVNode("div", _hoisted_2$e, [
              (ri = Fe.value) != null && ri.url ? (openBlock(), createElementBlock("img", {
                key: 0,
                src: Fe.value.url,
                alt: Fe.value.alt || "",
                width: (Qe = He.value) == null ? void 0 : Qe.width,
                height: (ti = He.value) == null ? void 0 : ti.height,
                class: "ire-block ire-h-auto ire-w-full ire-max-w-full",
                decoding: "async"
              }, null, 8, _hoisted_3$a)) : createCommentVNode("", !0),
              (openBlock(), createElementBlock("div", {
                ref_key: "svgRef",
                ref: Ae,
                innerHTML: je.value,
                key: je.value,
                class: "irep-block-preview__svg-overlay canvas path-color ire-absolute ire-left-0 ire-top-0 ire-h-full ire-w-full",
                onClick: qe
              }, null, 8, _hoisted_4$a))
            ])
          ];
        }),
        _: 1
      }, 8, ["hoverdData", "type"]);
    };
  }
}), _sfc_main$u = /* @__PURE__ */ defineComponent({
  __name: "MouseTracker",
  setup($e) {
    const _e = useGlobalStore(), ke = ref(!0), Be = ref(-400), Ne = ref(-400), Ve = ref(null);
    let Le = null, De = 0, Ae = 0;
    const Ie = (je, Fe, He) => je * (1 - He) + Fe * He, Re = () => {
      if (Le) return;
      const je = () => {
        Be.value = Ie(Be.value, De, 0.06), Ne.value = Ie(Ne.value, Ae, 0.06), Math.abs(Be.value - De) > 0.06 || Math.abs(Ne.value - Ae) > 0.06 ? Le = requestAnimationFrame(je) : Le = null;
      };
      Le = requestAnimationFrame(je);
    }, ze = (je) => {
      var ri;
      const Fe = document.querySelector(".irep-tooltip"), He = ((ri = _e.hoverdSvg) == null ? void 0 : ri.nodeName) === "path" ? _e.hoverdSvg : null;
      if (!Ve.value || !Fe || !He)
        return;
      const Ge = Ve.value.getBoundingClientRect(), qe = He.getBoundingClientRect(), Xe = Fe.getBoundingClientRect(), Ye = Ge.left + Ge.width / 2, We = qe.left > Ye, Je = je.clientY - Ge.top > Ge.height / 2;
      De = je.clientX - Ge.left - (We ? Xe.width : -20), Ae = je.clientY - Ge.top - (Je ? Xe.height : -20), De = Math.max(0, Math.min(Ge.width - Xe.width, De)), Ae = Math.max(0, Math.min(Ge.height - Xe.height, Ae)), ke.value && (Be.value = De, Ne.value = Ae), Re(), ke.value = !1;
    };
    return onMounted(() => {
      document.addEventListener("mousemove", ze);
    }), onUnmounted(() => {
      document.removeEventListener("mousemove", ze), Le && cancelAnimationFrame(Le);
    }), provide("mouseX", Be), provide("mouseY", Ne), (je, Fe) => (openBlock(), createElementBlock("div", {
      ref_key: "canvasRef",
      ref: Ve,
      class: "irep-mouse-tracker"
    }, [
      renderSlot(je.$slots, "default")
    ], 512));
  }
}), _sfc_main$t = /* @__PURE__ */ defineComponent({
  __name: "Preview",
  setup(__props) {
    const globalStore = useGlobalStore(), { getMetaValue } = globalStore, { irePlaginWp, shortcodeData } = storeToRefs(globalStore), flow = ref(
      "projectFlow"
    ), hoveredData = ref(), showModal = ref(!1), activeBlock = ref(), activeFloor = ref(), showFlatModal = ref(), project = computed(() => {
      var $e;
      if (shortcodeData.value)
        return ($e = shortcodeData.value) == null ? void 0 : $e.project;
    }), floors = computed(() => {
      var $e, _e;
      if (shortcodeData.value)
        return ($e = shortcodeData.value.floors) == null || $e.forEach((ke) => {
          var Ve, Le;
          const Be = (Le = (Ve = shortcodeData.value) == null ? void 0 : Ve.flats) == null ? void 0 : Le.filter((De) => {
            var Ae;
            return (De == null ? void 0 : De.floor_id) !== ((Ae = ke == null ? void 0 : ke.id) == null ? void 0 : Ae.toString()) ? !1 : ke != null && ke.polygon_data ? Object == null ? void 0 : Object.values(ke == null ? void 0 : ke.polygon_data).some(
              (Re) => {
                var ze;
                return Re != null && Re.type && (Re == null ? void 0 : Re.type) === "flat" && (Re == null ? void 0 : Re.id) === (De == null ? void 0 : De.id) ? ke != null && ke.block_id ? (De == null ? void 0 : De.block_id) === ((ze = ke == null ? void 0 : ke.block_id) == null ? void 0 : ze.toString()) : !(De != null && De.block_id) : !1;
              }
            ) : !1;
          });
          ke.flats = Be;
          const { conf: Ne } = ke || {};
          if (Be != null && Be.length && !Ne) {
            const De = Be == null ? void 0 : Be.every((Ie) => (Ie == null ? void 0 : Ie.conf) === "reserved"), Ae = Be == null ? void 0 : Be.every((Ie) => (Ie == null ? void 0 : Ie.conf) === "sold");
            De ? ke.conf = "reserved" : Ae && (ke.conf = "sold");
          }
        }), (_e = shortcodeData.value) == null ? void 0 : _e.floors;
    }), blocks = computed(() => {
      if (shortcodeData.value)
        return shortcodeData.value.blocks;
    }), types = computed(() => {
      if (shortcodeData.value)
        return shortcodeData.value.types;
    }), flats = computed(() => {
      var $e, _e;
      if (shortcodeData.value)
        return (_e = ($e = shortcodeData.value) == null ? void 0 : $e.flats) == null ? void 0 : _e.map((ke) => {
          var Ve;
          if (ke != null && ke.use_type || !(ke != null && ke.type)) {
            const Le = (Ve = types.value) == null ? void 0 : Ve.find((De) => (De == null ? void 0 : De.id) === (ke == null ? void 0 : ke.type_id));
            Le && (ke.type = Le);
          }
          const Be = getMetaValue("custom_types"), Ne = Be == null ? void 0 : Be.find((Le) => Le.value === ke.conf);
          return ke.conf = Ne ? Ne.title : ke.conf, ke;
        });
    }), actions = computed(() => {
      var $e;
      if (shortcodeData.value)
        return ($e = shortcodeData.value) == null ? void 0 : $e.actions;
    }), projectMeta = computed(() => {
      var $e;
      if (shortcodeData.value)
        return ($e = shortcodeData.value) == null ? void 0 : $e.meta;
    }), isGoldAndSharable = computed(() => {
      var $e;
      return getMetaValue("shareable_link") === "true" && (($e = irePlaginWp.value) == null ? void 0 : $e.is_gold);
    }), openNewTab = ($e, _e = !0) => {
      window.open($e, _e ? "_blank" : "_self");
    }, changeRoute = (flowType, polygonItem) => {
      switch (flowType) {
        case "project":
          flow.value = "projectFlow";
          break;
        case "floor":
          flow.value = "floorFlow", hoveredData.value = polygonItem, activeFloor.value = polygonItem;
          break;
        case "block":
          flow.value = "blockFlow", hoveredData.value = polygonItem, activeBlock.value = polygonItem;
          break;
        case "flat":
          if ((polygonItem == null ? void 0 : polygonItem.click_action) === "follow_link") {
            const { link: $e, target: _e } = polygonItem == null ? void 0 : polygonItem.follow_link;
            openNewTab($e, _e);
          } else {
            const $e = getMetaValue("custom_types"), _e = $e == null ? void 0 : $e.find(
              (ke) => ke.title === (polygonItem == null ? void 0 : polygonItem.conf)
            );
            if (_e && !(_e != null && _e.open_flat_modal)) return;
            polygonItem && (hoveredData.value = polygonItem, showFlatModal.value = !0);
          }
          break;
        case "tooltip":
          const actionData = polygonItem == null ? void 0 : polygonItem.data;
          if (hoveredData.value = actionData, (actionData == null ? void 0 : actionData.actionType) === "url")
            openNewTab(actionData == null ? void 0 : actionData.url);
          else if ((actionData == null ? void 0 : actionData.actionType) === "modal")
            showModal.value = !0;
          else if ((actionData == null ? void 0 : actionData.actionType) === "script")
            try {
              eval(actionData == null ? void 0 : actionData.script);
            } catch ($e) {
              console.error("Error executing script:", $e);
            }
          break;
      }
    }, actionFromQuery = () => {
      var De, Ae, Ie, Re;
      if (!isGoldAndSharable.value) return;
      const $e = getQuery("floorId"), _e = getQuery("flatId"), ke = getQuery("projectId"), Be = document.querySelector(
        `[data-project-id="${ke}"]`
      ), Ne = (Ae = (De = shortcodeData.value) == null ? void 0 : De.floors) == null ? void 0 : Ae.find((ze) => ze.id === $e), Ve = (Re = (Ie = shortcodeData.value) == null ? void 0 : Ie.flats) == null ? void 0 : Re.find((ze) => ze.id === _e), Le = () => Be == null ? void 0 : Be.scrollIntoView();
      Ve ? (Ne && changeRoute("floor", Ne), setTimeout(() => {
        Le(), changeRoute("flat", Ve);
      }, 400)) : Ne && (changeRoute("floor", Ne), Le());
    };
    return onMounted(() => {
      actionFromQuery();
    }), provide("showFlatModal", showFlatModal), ($e, _e) => (openBlock(), createBlock(_sfc_main$u, { class: "irep-preview interactive-real-estate ire-text-base" }, {
      default: withCtx(() => [
        createVNode(Transition, {
          name: "ire-fade-in-out",
          mode: "out-in"
        }, {
          default: withCtx(() => [
            unref(shortcodeData) ? (openBlock(), createElementBlock("div", { key: flow.value }, [
              flow.value === "projectFlow" ? (openBlock(), createBlock(_sfc_main$16, {
                key: 0,
                project: project.value,
                floors: floors.value,
                flats: flats.value,
                projectMeta: projectMeta.value,
                blocks: blocks.value,
                actions: actions.value,
                onChangeComponent: _e[0] || (_e[0] = (ke, Be) => changeRoute(ke, Be))
              }, null, 8, ["project", "floors", "flats", "projectMeta", "blocks", "actions"])) : flow.value === "blockFlow" && flats.value && floors.value && blocks.value && activeBlock.value ? (openBlock(), createBlock(_sfc_main$v, {
                key: 1,
                block: activeBlock.value,
                flats: flats.value,
                floors: floors.value,
                actions: actions.value,
                onChangeComponent: _e[1] || (_e[1] = (ke, Be) => changeRoute(ke, Be))
              }, null, 8, ["block", "flats", "floors", "actions"])) : flow.value === "floorFlow" && floors.value && activeFloor.value ? (openBlock(), createBlock(_sfc_main$12, {
                key: 2,
                flats: flats.value,
                floor: activeFloor.value,
                floors: floors.value,
                blocks: blocks.value,
                actions: actions.value,
                onChangeComponent: _e[2] || (_e[2] = (ke, Be) => changeRoute(ke, Be))
              }, null, 8, ["flats", "floor", "floors", "blocks", "actions"])) : createCommentVNode("", !0)
            ])) : createCommentVNode("", !0)
          ]),
          _: 1
        }),
        (openBlock(), createBlock(Teleport, { to: "body" }, [
          createVNode(Transition, {
            name: "ire-fade-in-out",
            appear: ""
          }, {
            default: withCtx(() => [
              showFlatModal.value ? (openBlock(), createBlock(_sfc_main$y, {
                key: 0,
                onClose: _e[4] || (_e[4] = (ke) => showFlatModal.value = !1)
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$z, {
                    flat: hoveredData.value,
                    floors: floors.value,
                    onChangeComponent: _e[3] || (_e[3] = (ke, Be) => changeRoute(ke, Be))
                  }, null, 8, ["flat", "floors"])
                ]),
                _: 1
              })) : createCommentVNode("", !0)
            ]),
            _: 1
          })
        ])),
        (openBlock(), createBlock(Teleport, { to: "body" }, [
          createVNode(Transition, {
            name: "ire-fade-in-out",
            appear: ""
          }, {
            default: withCtx(() => [
              showModal.value ? (openBlock(), createBlock(_sfc_main$y, {
                key: 0,
                onClose: _e[5] || (_e[5] = (ke) => showModal.value = !1)
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$w, { modalData: hoveredData.value }, null, 8, ["modalData"])
                ]),
                _: 1
              })) : createCommentVNode("", !0)
            ]),
            _: 1
          })
        ]))
      ]),
      _: 1
    }));
  }
}), _sfc_main$s = /* @__PURE__ */ defineComponent({
  __name: "Project",
  props: {
    data: {},
    irePlugin: {}
  },
  setup($e) {
    const _e = $e, ke = useGlobalStore();
    return ke.setData(_e.data), ke.setIrePlaginWp(_e.irePlugin), provide("fromListView", !1), (Be, Ne) => (openBlock(), createBlock(_sfc_main$1h, null, {
      default: withCtx(() => [
        createVNode(_sfc_main$t)
      ]),
      _: 1
    }));
  }
});
function useScroll() {
  return { scrollToWithOffset: (_e, ke = 0) => {
    if (_e) {
      const Ne = _e.getBoundingClientRect().top + window.pageYOffset - ke;
      window.scrollTo({
        top: Ne,
        behavior: "smooth"
      });
    }
  } };
}
const _sfc_main$r = {}, _hoisted_1$p = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "800px",
  height: "800px",
  viewBox: "0 0 120 120",
  fill: "none",
  webcrx: ""
};
function _sfc_render$a($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$p, [..._e[0] || (_e[0] = [
    createElementVNode("rect", {
      width: "120",
      height: "120",
      fill: "#EFF1F3"
    }, null, -1),
    createElementVNode("path", {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M33.2503 38.4816C33.2603 37.0472 34.4199 35.8864 35.8543 35.875H83.1463C84.5848 35.875 85.7503 37.0431 85.7503 38.4816V80.5184C85.7403 81.9528 84.5807 83.1136 83.1463 83.125H35.8543C34.4158 83.1236 33.2503 81.957 33.2503 80.5184V38.4816ZM80.5006 41.1251H38.5006V77.8751L62.8921 53.4783C63.9172 52.4536 65.5788 52.4536 66.6039 53.4783L80.5006 67.4013V41.1251ZM43.75 51.6249C43.75 54.5244 46.1005 56.8749 49 56.8749C51.8995 56.8749 54.25 54.5244 54.25 51.6249C54.25 48.7254 51.8995 46.3749 49 46.3749C46.1005 46.3749 43.75 48.7254 43.75 51.6249Z",
      fill: "#687787"
    }, null, -1)
  ])]);
}
const Placeholder = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$a]]), _hoisted_1$o = { class: "irep-flat-card__image-wrapper ire-group ire-relative ire-pt-[70%]" }, _hoisted_2$d = ["src"], _hoisted_3$9 = {
  key: 1,
  class: "irep-flat-card__placeholder"
}, _hoisted_4$9 = { class: "irep-flat-card__info ire-mt-4 ire-flex ire-flex-col ire-gap-1 md:ire-gap-2" }, _hoisted_5$9 = { class: "irep-flat-card__title-row flex ire-flex-col ire-justify-between ire-gap-1 ire-text-center sm:ire-flex-row md:ire-gap-2" }, _hoisted_6$8 = { class: "irep-flat-card__title ire-line-clamp-2 ire-text-left ire-text-lg ire-font-semibold" }, _hoisted_7$8 = { class: "irep-flat-card__price-row flex ire-min-w-max ire-items-center ire-gap-1 ire-text-xl ire-text-[var(--primary-color)] md:ire-gap-2" }, _hoisted_8$6 = {
  key: 0,
  class: "irep-flat-card__request-price ire-font-semibold ire-capitalize"
}, _hoisted_9$5 = {
  key: 2,
  class: "irep-flat-card__offer-price ire-font-semibold"
}, _hoisted_10$4 = { class: "irep-flat-card__original-price ire-text-xs ire-text-gray-500 ire-line-through" }, _hoisted_11$3 = { class: "irep-flat-card__price" }, _hoisted_12$2 = {
  key: 3,
  class: "irep-flat-card__price ire-font-semibold"
}, _hoisted_13$1 = { class: "irep-flat-card__meta flex ire-items-center ire-gap-4" }, _hoisted_14$1 = {
  key: 0,
  class: "irep-flat-card__area flex ire-items-center ire-gap-1"
}, _hoisted_15$1 = { class: "ire-right-[2px] ire-text-base" }, _hoisted_16$1 = {
  key: 1,
  class: "irep-flat-card__rooms flex ire-items-center ire-gap-1"
}, _hoisted_17$1 = { class: "ire-right-[2px] ire-text-base" }, _sfc_main$q = /* @__PURE__ */ defineComponent({
  __name: "FlatCard",
  props: {
    flat: {}
  },
  emits: ["openFlat"],
  setup($e, { emit: _e }) {
    const ke = _e, Be = $e, Ne = useGlobalStore(), { hasPriceHistoryAddon: Ve } = storeToRefs(Ne), Le = ref(!1), De = computed(() => {
      var Ie, Re;
      return [
        ...((Ie = Be.flat.type) == null ? void 0 : Ie.image_3d) || [],
        ...((Re = Be.flat.type) == null ? void 0 : Re.image_2d) || []
      ].map((ze) => ze.url);
    }), Ae = computed(
      () => {
        var Ie, Re;
        return (((Re = (Ie = Be.flat) == null ? void 0 : Ie.price_history) == null ? void 0 : Re.length) ?? 0) >= 2 && Ve.value;
      }
    );
    return (Ie, Re) => {
      var ze, je, Fe, He, Ge;
      return openBlock(), createElementBlock("div", {
        class: "irep-flat-card ire-cursor-pointer ire-rounded-sm ire-text-black ire-transition-all ire-duration-300",
        onClick: Re[2] || (Re[2] = (qe) => ke("openFlat", $e.flat.id))
      }, [
        createElementVNode("div", _hoisted_1$o, [
          De.value[0] ? (openBlock(), createElementBlock("img", {
            key: 0,
            src: De.value[0],
            alt: "",
            class: "ire-absolute ire-left-0 ire-top-0 ire-h-full ire-w-full ire-rounded-lg ire-object-cover ire-transition-all ire-duration-700 ire-ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:ire-scale-95"
          }, null, 8, _hoisted_2$d)) : (openBlock(), createElementBlock("div", _hoisted_3$9, [
            createVNode(Placeholder, { class: "ire-absolute ire-left-0 ire-top-0 ire-h-full ire-w-full ire-bg-gray-100 ire-transition-all ire-duration-700 ire-ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:ire-scale-95 [&_rect]:ire-fill-gray-100" })
          ]))
        ]),
        createElementVNode("div", _hoisted_4$9, [
          createElementVNode("div", _hoisted_5$9, [
            createElementVNode("div", _hoisted_6$8, toDisplayString($e.flat.flat_number), 1),
            createElementVNode("div", _hoisted_7$8, [
              $e.flat.request_price ? (openBlock(), createElementBlock("div", _hoisted_8$6, toDisplayString(unref(tr)("request price")), 1)) : $e.flat.conf ? (openBlock(), createBlock(_sfc_main$19, {
                key: 1,
                conf: $e.flat.conf
              }, null, 8, ["conf"])) : $e.flat.offer_price ? (openBlock(), createElementBlock("div", _hoisted_9$5, [
                createElementVNode("div", _hoisted_10$4, toDisplayString(unref(getPrice)(+$e.flat.price_n)) + " " + toDisplayString(unref(currencySymbol)()), 1),
                createElementVNode("div", _hoisted_11$3, toDisplayString(unref(getPrice)(+$e.flat.offer_price)) + " " + toDisplayString(unref(currencySymbol)()), 1)
              ])) : Number((ze = $e.flat) == null ? void 0 : ze.price_n) > 0 ? (openBlock(), createElementBlock("div", _hoisted_12$2, toDisplayString(unref(getPrice)(+$e.flat.price_n)) + " " + toDisplayString(unref(currencySymbol)()), 1)) : createCommentVNode("", !0),
              Ae.value && $e.flat ? (openBlock(), createBlock(IconButton, {
                key: 4,
                class: "price-history-button ire-w-fit",
                onClick: Re[0] || (Re[0] = withModifiers((qe) => Le.value = !0, ["stop", "prevent"]))
              }, {
                default: withCtx(() => [
                  createVNode(LineChartIcon)
                ]),
                _: 1
              })) : createCommentVNode("", !0)
            ])
          ]),
          createElementVNode("div", _hoisted_13$1, [
            (je = $e.flat.type) != null && je.area_m2 ? (openBlock(), createElementBlock("div", _hoisted_14$1, [
              createVNode(Area, { class: "ire-size-6" }),
              createElementVNode("span", _hoisted_15$1, [
                createTextVNode(toDisplayString(unref(getArea)((Fe = $e.flat.type) == null ? void 0 : Fe.area_m2_n)) + " " + toDisplayString(unref(getAreaUnitLabel)()) + " ", 1),
                Re[3] || (Re[3] = createElementVNode("sup", { class: "ire-bg-transparent ire-text-sm" }, " 2 ", -1))
              ])
            ])) : createCommentVNode("", !0),
            (He = $e.flat.type) != null && He.rooms_count ? (openBlock(), createElementBlock("div", _hoisted_16$1, [
              createVNode(Bed, { class: "ire-size-4 [&_path]:ire-fill-gray-500" }),
              createElementVNode("span", _hoisted_17$1, toDisplayString(unref(getRoomCount)((Ge = $e.flat.type) == null ? void 0 : Ge.rooms_count)) + " " + toDisplayString(unref(tr)("room")), 1)
            ])) : createCommentVNode("", !0)
          ])
        ]),
        (openBlock(), createBlock(Teleport, { to: "body" }, [
          createVNode(Transition, {
            name: "ire-fade-in-out",
            mode: "out-in"
          }, {
            default: withCtx(() => {
              var qe;
              return [
                Le.value && $e.flat && Ae.value ? (openBlock(), createBlock(_sfc_main$V, {
                  key: 0,
                  "price-history": (qe = $e.flat) == null ? void 0 : qe.price_history,
                  onClose: Re[1] || (Re[1] = (Xe) => Le.value = !1)
                }, null, 8, ["price-history"])) : createCommentVNode("", !0)
              ];
            }),
            _: 1
          })
        ]))
      ]);
    };
  }
}), _hoisted_1$n = {
  viewBox: "0 0 8 2",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, _hoisted_2$c = /* @__PURE__ */ createVNode(
  "path",
  {
    d: "M2.24 1c0 .556-.445 1-1 1-.556 0-1-.444-1-1s.444-1 1-1c.555 0 1 .444 1 1zm5.333 0c0 .556-.444 1-1 1-.555 0-1-.444-1-1s.445-1 1-1c.556 0 1 .444 1 1z",
    fill: "#BBB"
  },
  null,
  -1
  /* HOISTED */
);
function render($e, _e) {
  return openBlock(), createBlock("svg", _hoisted_1$n, [
    _hoisted_2$c
  ]);
}
var script = defineComponent({
  name: "VPage",
  components: { IconPaginationDots: render },
  props: {
    page: {
      type: Number,
      default: null
    },
    current: {
      type: Number,
      default: 0
    },
    activeColor: {
      type: String,
      default: "#DCEDFF"
    }
  },
  emits: ["update"],
  setup($e, { emit: _e }) {
    const ke = computed(() => $e.page === $e.current);
    function Be() {
      _e("update", $e.page);
    }
    return { isActive: ke, clickHandler: Be };
  }
});
const _withId = /* @__PURE__ */ withScopeId("data-v-060ca318");
pushScopeId("data-v-060ca318");
const _hoisted_1$1$1 = {
  key: 0,
  class: "DotsHolder"
};
popScopeId();
const render$1 = /* @__PURE__ */ _withId(($e, _e, ke, Be, Ne, Ve) => {
  const Le = resolveComponent("icon-pagination-dots");
  return openBlock(), createBlock("li", null, [
    $e.page === null ? (openBlock(), createBlock("span", _hoisted_1$1$1, [
      createVNode(Le, { class: "Dots" })
    ])) : (openBlock(), createBlock("button", {
      key: 1,
      class: ["Page", { "Page-active": $e.isActive }],
      type: "button",
      "aria-label": `Go to page ${$e.page}`,
      style: `background-color: ${$e.isActive ? $e.activeColor : "transparent"};`,
      onClick: _e[1] || (_e[1] = (...De) => $e.clickHandler && $e.clickHandler(...De))
    }, toDisplayString($e.page), 15, ["aria-label"]))
  ]);
});
script.render = render$1;
script.__scopeId = "data-v-060ca318";
script.__file = "src/components/atoms/VPage.vue";
const _hoisted_1$2$1 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, _hoisted_2$1$1 = /* @__PURE__ */ createVNode(
  "path",
  { d: "M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6 1.41-1.41M6 6h2v12H6V6z" },
  null,
  -1
  /* HOISTED */
);
function render$2($e, _e) {
  return openBlock(), createBlock("svg", _hoisted_1$2$1, [
    _hoisted_2$1$1
  ]);
}
const _hoisted_1$3$1 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, _hoisted_2$2$1 = /* @__PURE__ */ createVNode(
  "path",
  { d: "M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6-1.41 1.41M16 6h2v12h-2V6z" },
  null,
  -1
  /* HOISTED */
);
function render$3($e, _e) {
  return openBlock(), createBlock("svg", _hoisted_1$3$1, [
    _hoisted_2$2$1
  ]);
}
const _hoisted_1$4$1 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, _hoisted_2$3$1 = /* @__PURE__ */ createVNode(
  "path",
  { d: "M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.42z" },
  null,
  -1
  /* HOISTED */
);
function render$4($e, _e) {
  return openBlock(), createBlock("svg", _hoisted_1$4$1, [
    _hoisted_2$3$1
  ]);
}
const _hoisted_1$5$1 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, _hoisted_2$4$1 = /* @__PURE__ */ createVNode(
  "path",
  { d: "M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z" },
  null,
  -1
  /* HOISTED */
);
function render$5($e, _e) {
  return openBlock(), createBlock("svg", _hoisted_1$5$1, [
    _hoisted_2$4$1
  ]);
}
var script$1 = defineComponent({
  name: "VPagination",
  components: { IconPageFirst: render$2, IconChevronLeft: render$4, IconChevronRight: render$5, IconPageLast: render$3, VPage: script },
  props: {
    pages: {
      type: Number,
      default: 0
    },
    rangeSize: {
      type: Number,
      default: 1
    },
    modelValue: {
      type: Number,
      default: 0
    },
    activeColor: {
      type: String,
      default: "#DCEDFF"
    },
    hideFirstButton: {
      type: Boolean,
      default: !1
    },
    hideLastButton: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["update:modelValue"],
  setup($e, { emit: _e }) {
    const ke = computed(() => {
      const Re = [], ze = 5 + $e.rangeSize * 2;
      let je = $e.pages <= ze ? 1 : $e.modelValue - $e.rangeSize, Fe = $e.pages <= ze ? $e.pages : $e.modelValue + $e.rangeSize;
      if (Fe = Fe > $e.pages ? $e.pages : Fe, je = je < 1 ? 1 : je, $e.pages > ze) {
        const He = je - 1 < 3, Ge = $e.pages - Fe < 3;
        if (He) {
          Fe = ze - 2;
          for (let qe = 1; qe < je; qe++)
            Re.push(qe);
        } else
          Re.push(1), Re.push(null);
        if (Ge) {
          je = $e.pages - (ze - 3);
          for (let qe = je; qe <= $e.pages; qe++)
            Re.push(qe);
        } else {
          for (let qe = je; qe <= Fe; qe++)
            Re.push(qe);
          Re.push(null), Re.push($e.pages);
        }
      } else
        for (let He = je; He <= Fe; He++)
          Re.push(He);
      return Re;
    });
    function Be(Re) {
      _e("update:modelValue", Re);
    }
    const Ne = computed(() => $e.modelValue > 1), Ve = computed(() => $e.modelValue < $e.pages);
    function Le() {
      Ne.value && _e("update:modelValue", 1);
    }
    function De() {
      Ne.value && _e("update:modelValue", $e.modelValue - 1);
    }
    function Ae() {
      Ve.value && _e("update:modelValue", $e.pages);
    }
    function Ie() {
      Ve.value && _e("update:modelValue", $e.modelValue + 1);
    }
    return {
      pagination: ke,
      updatePageHandler: Be,
      isPrevControlsActive: Ne,
      isNextControlsActive: Ve,
      goToFirst: Le,
      goToLast: Ae,
      goToPrev: De,
      goToNext: Ie
    };
  }
});
const _withId$1 = /* @__PURE__ */ withScopeId("data-v-2a30deb0");
pushScopeId("data-v-2a30deb0");
const _hoisted_1$6$1 = { class: "Pagination" }, _hoisted_2$5$1 = {
  key: 0,
  class: "PaginationControl"
}, _hoisted_3$8 = { class: "PaginationControl" }, _hoisted_4$8 = { class: "PaginationControl" }, _hoisted_5$8 = {
  key: 1,
  class: "PaginationControl"
};
popScopeId();
const render$6 = /* @__PURE__ */ _withId$1(($e, _e, ke, Be, Ne, Ve) => {
  const Le = resolveComponent("icon-page-first"), De = resolveComponent("icon-chevron-left"), Ae = resolveComponent("v-page"), Ie = resolveComponent("icon-chevron-right"), Re = resolveComponent("icon-page-last");
  return openBlock(), createBlock("ul", _hoisted_1$6$1, [
    $e.hideFirstButton ? createCommentVNode("v-if", !0) : (openBlock(), createBlock("li", _hoisted_2$5$1, [
      createVNode(Le, {
        class: ["Control", { "Control-active": $e.isPrevControlsActive }],
        onClick: $e.goToFirst
      }, null, 8, ["class", "onClick"])
    ])),
    createVNode("li", _hoisted_3$8, [
      createVNode(De, {
        class: ["Control", { "Control-active": $e.isPrevControlsActive }],
        onClick: $e.goToPrev
      }, null, 8, ["class", "onClick"])
    ]),
    (openBlock(!0), createBlock(
      Fragment,
      null,
      renderList($e.pagination, (ze) => (openBlock(), createBlock(Ae, {
        key: `pagination-page-${ze}`,
        page: ze,
        current: $e.modelValue,
        "active-color": $e.activeColor,
        onUpdate: $e.updatePageHandler
      }, null, 8, ["page", "current", "active-color", "onUpdate"]))),
      128
      /* KEYED_FRAGMENT */
    )),
    createVNode("li", _hoisted_4$8, [
      createVNode(Ie, {
        class: ["Control", { "Control-active": $e.isNextControlsActive }],
        onClick: $e.goToNext
      }, null, 8, ["class", "onClick"])
    ]),
    $e.hideLastButton ? createCommentVNode("v-if", !0) : (openBlock(), createBlock("li", _hoisted_5$8, [
      createVNode(Re, {
        class: ["Control", { "Control-active": $e.isNextControlsActive }],
        onClick: $e.goToLast
      }, null, 8, ["class", "onClick"])
    ]))
  ]);
});
script$1.render = render$6;
script$1.__scopeId = "data-v-2a30deb0";
script$1.__file = "src/components/VPagination.vue";
const _sfc_main$p = {}, _hoisted_1$m = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "800px",
  height: "800px",
  viewBox: "0 0 24 24",
  fill: "none",
  webcrx: ""
};
function _sfc_render$9($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$m, [..._e[0] || (_e[0] = [
    createElementVNode("path", {
      d: "M4 10V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V10M4 10V15M4 10H9M20 10V15M20 10H15M4 15V18C4 19.1046 4.89543 20 6 20H9M4 15H9M20 15V18C20 19.1046 19.1046 20 18 20H15M20 15H15M9 15H15M9 15V10M9 15V20M15 15V10M15 15V20M9 10H15M9 20H15M10 7H14",
      stroke: "#464455",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ])]);
}
const TableIcon = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$9]]), _hoisted_1$l = { key: 0 }, _hoisted_2$b = { key: 1 }, _sfc_main$o = /* @__PURE__ */ defineComponent({
  __name: "TableCol",
  props: {
    row: {},
    fields: {},
    rowClickHandler: { type: Function }
  },
  setup($e) {
    return (_e, ke) => (openBlock(), createElementBlock("tr", {
      class: normalizeClass(["ire-border-b ire-border-gray-200 ire-transition-all ire-duration-300 hover:ire-bg-gray-100 active:ire-bg-gray-200", { "ire-cursor-pointer": $e.rowClickHandler }]),
      onClick: ke[0] || (ke[0] = (Be) => {
        var Ne;
        return (Ne = $e.rowClickHandler) == null ? void 0 : Ne.call($e, $e.row);
      })
    }, [
      (openBlock(!0), createElementBlock(Fragment, null, renderList($e.fields, (Be, Ne) => (openBlock(), createElementBlock("td", {
        key: Ne,
        class: "irep-table-item !ire-p-4 ire-text-black [&_div]:ire-min-w-max"
      }, [
        typeof Be == "string" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          Be.includes(".") ? (openBlock(), createElementBlock("div", _hoisted_1$l, toDisplayString(unref(getNested)($e.row, Be)), 1)) : (openBlock(), createElementBlock("div", _hoisted_2$b, toDisplayString($e.row[Be]), 1))
        ], 64)) : (openBlock(), createBlock(resolveDynamicComponent(Be), {
          key: 1,
          data: $e.row
        }, null, 8, ["data"]))
      ]))), 128))
    ], 2));
  }
}), _sfc_main$n = {}, _hoisted_1$k = {
  width: "14",
  height: "14",
  viewBox: "0 0 14 14",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  class: "p-icon p-datatable-sort-icon",
  "aria-hidden": "true",
  sortOrder: "0",
  "data-pc-section": "sorticon",
  sorted: "false"
};
function _sfc_render$8($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$k, [..._e[0] || (_e[0] = [
    createElementVNode("path", {
      d: "M5.64515 3.61291C5.47353 3.61291 5.30192 3.54968 5.16644 3.4142L3.38708 1.63484L1.60773 3.4142C1.34579 3.67613 0.912244 3.67613 0.650309 3.4142C0.388374 3.15226 0.388374 2.71871 0.650309 2.45678L2.90837 0.198712C3.17031 -0.0632236 3.60386 -0.0632236 3.86579 0.198712L6.12386 2.45678C6.38579 2.71871 6.38579 3.15226 6.12386 3.4142C5.98837 3.54968 5.81676 3.61291 5.64515 3.61291Z",
      fill: "currentColor"
    }, null, -1),
    createElementVNode("path", {
      d: "M3.38714 14C3.01681 14 2.70972 13.6929 2.70972 13.3226V0.677419C2.70972 0.307097 3.01681 0 3.38714 0C3.75746 0 4.06456 0.307097 4.06456 0.677419V13.3226C4.06456 13.6929 3.75746 14 3.38714 14Z",
      fill: "currentColor"
    }, null, -1),
    createElementVNode("path", {
      d: "M10.6129 14C10.4413 14 10.2697 13.9368 10.1342 13.8013L7.87611 11.5432C7.61418 11.2813 7.61418 10.8477 7.87611 10.5858C8.13805 10.3239 8.5716 10.3239 8.83353 10.5858L10.6129 12.3652L12.3922 10.5858C12.6542 10.3239 13.0877 10.3239 13.3497 10.5858C13.6116 10.8477 13.6116 11.2813 13.3497 11.5432L11.0916 13.8013C10.9561 13.9368 10.7845 14 10.6129 14Z",
      fill: "currentColor"
    }, null, -1),
    createElementVNode("path", {
      d: "M10.6129 14C10.2426 14 9.93552 13.6929 9.93552 13.3226V0.677419C9.93552 0.307097 10.2426 0 10.6129 0C10.9833 0 11.2904 0.307097 11.2904 0.677419V13.3226C11.2904 13.6929 10.9832 14 10.6129 14Z",
      fill: "currentColor"
    }, null, -1)
  ])]);
}
const SortingArrow = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$8]]), _sfc_main$m = {}, _hoisted_1$j = {
  width: "14",
  height: "14",
  viewBox: "0 0 14 14",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  class: "p-icon p-datatable-sort-icon",
  "aria-hidden": "true",
  sorted: "true",
  sortOrder: "1",
  "data-pc-section": "sorticon"
};
function _sfc_render$7($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$j, [..._e[0] || (_e[0] = [
    createElementVNode("path", {
      d: "M3.63435 0.19871C3.57113 0.135484 3.49887 0.0903226 3.41758 0.0541935C3.255 -0.0180645 3.06532 -0.0180645 2.90274 0.0541935C2.82145 0.0903226 2.74919 0.135484 2.68597 0.19871L0.427901 2.45677C0.165965 2.71871 0.165965 3.15226 0.427901 3.41419C0.689836 3.67613 1.12338 3.67613 1.38532 3.41419L2.48726 2.31226V13.3226C2.48726 13.6929 2.79435 14 3.16467 14C3.535 14 3.84209 13.6929 3.84209 13.3226V2.31226L4.94403 3.41419C5.07951 3.54968 5.25113 3.6129 5.42274 3.6129C5.59435 3.6129 5.76597 3.54968 5.90145 3.41419C6.16338 3.15226 6.16338 2.71871 5.90145 2.45677L3.64338 0.19871H3.63435ZM13.7685 13.3226C13.7685 12.9523 13.4615 12.6452 13.0911 12.6452H7.22016C6.84984 12.6452 6.54274 12.9523 6.54274 13.3226C6.54274 13.6929 6.84984 14 7.22016 14H13.0911C13.4615 14 13.7685 13.6929 13.7685 13.3226ZM7.22016 8.58064C6.84984 8.58064 6.54274 8.27355 6.54274 7.90323C6.54274 7.5329 6.84984 7.22581 7.22016 7.22581H9.47823C9.84855 7.22581 10.1556 7.5329 10.1556 7.90323C10.1556 8.27355 9.84855 8.58064 9.47823 8.58064H7.22016ZM7.22016 5.87097H7.67177C8.0421 5.87097 8.34919 5.56387 8.34919 5.19355C8.34919 4.82323 8.0421 4.51613 7.67177 4.51613H7.22016C6.84984 4.51613 6.54274 4.82323 6.54274 5.19355C6.54274 5.56387 6.84984 5.87097 7.22016 5.87097ZM11.2847 11.2903H7.22016C6.84984 11.2903 6.54274 10.9832 6.54274 10.6129C6.54274 10.2426 6.84984 9.93548 7.22016 9.93548H11.2847C11.655 9.93548 11.9621 10.2426 11.9621 10.6129C11.9621 10.9832 11.655 11.2903 11.2847 11.2903Z",
      fill: "currentColor"
    }, null, -1)
  ])]);
}
const SortingArrowAsc = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$7]]), _hoisted_1$i = { class: "irep-table-wrapper ire-overflow-x-auto" }, _hoisted_2$a = { class: "irep-flats-list__table !ire-m-0 ire-w-full ire-border-collapse ire-border-spacing-0" }, _hoisted_3$7 = { class: "irep-flats-list__table-thead" }, _hoisted_4$7 = { class: "ire-border-b ire-border-b-gray-200" }, _hoisted_5$7 = ["onClick"], _hoisted_6$7 = { class: "irep-table__header-inner ire-flex ire-min-w-max ire-items-center ire-gap-3" }, _hoisted_7$7 = { class: "irep-flats-list__table-heading ire-font-semibold" }, _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "Table",
  props: {
    data: {},
    rowClickHandler: { type: Function }
  },
  emits: ["sortColumn"],
  setup($e, { emit: _e }) {
    const ke = _e, Be = $e, Ne = useSlots(), Ve = inject("sortField", ref("")), Le = inject("sortOrder", ref("asc")), De = computed(() => {
      if (!Ne.default) return;
      const ze = Array.from(Ne != null && Ne.default ? Ne.default({}) : []), je = [];
      return ze.forEach((Fe) => {
        var He;
        ((He = Fe == null ? void 0 : Fe.type) == null ? void 0 : He.toString()) === "Symbol(v-fgt)" && (Fe != null && Fe.children) ? je.push(...Fe.children) : je.push(Fe);
      }), je;
    }), Ae = computed(() => De.value.map((je) => {
      var He, Ge;
      const Fe = (He = je.children) == null ? void 0 : He.body;
      return typeof Fe == "function" ? Fe : (Ge = je.props) == null ? void 0 : Ge.field;
    })), Ie = computed(() => De.value.map((je) => ({
      ...je.props
      // sortable: typeof vnode.props.sortable !== "undefined",
    }))), Re = (ze) => {
      ze.sortable && (Ve.value !== (ze.field || ze.sortableField) && (Le.value = ""), Le.value = Le.value === "asc" ? "desc" : Le.value === "desc" ? "" : "asc", Le.value ? Ve.value = ze.field ?? ze.sortableField : Ve.value = "", ke("sortColumn", Ve.value, Le.value));
    };
    return (ze, je) => (openBlock(), createElementBlock("div", _hoisted_1$i, [
      createElementVNode("table", _hoisted_2$a, [
        createElementVNode("thead", _hoisted_3$7, [
          createElementVNode("tr", _hoisted_4$7, [
            (openBlock(!0), createElementBlock(Fragment, null, renderList(Ie.value, (Fe) => (openBlock(), createElementBlock("th", {
              key: Fe,
              class: normalizeClass(["ire-p-3 ire-text-left ire-capitalize ire-transition-all", {
                "irep-flats-list__table-heading--sortable ire-cursor-pointer": Fe == null ? void 0 : Fe.sortable,
                "ire-text-black": !(Fe != null && Fe.sortable && unref(Ve) === (Fe.field || Fe.sortableField)),
                "irep-flats-list__table-heading--active ire-cursor-pointer ire-bg-black ire-text-white": (Fe == null ? void 0 : Fe.sortable) && unref(Ve) === (Fe.field || Fe.sortableField),
                "hover:ire-bg-gray-100": (Fe == null ? void 0 : Fe.sortable) && unref(Ve) !== (Fe.field || Fe.sortableField)
              }]),
              onClick: (He) => Re(Fe)
            }, [
              createElementVNode("div", _hoisted_6$7, [
                createElementVNode("div", _hoisted_7$7, toDisplayString(unref(tr)(Fe == null ? void 0 : Fe.header)), 1),
                createElementVNode("div", {
                  class: normalizeClass(["irep-table__sort-icon ire-flex ire-justify-center ire-text-center [&_svg]:ire-size-3", {
                    "[&_path]:ire-fill-white": unref(Ve) === (Fe.field || Fe.sortableField) && unref(Le),
                    "ire-rotate-180": unref(Le) === "desc"
                  }])
                }, [
                  unref(Ve) === (Fe.field || Fe.sortableField) && unref(Le) ? (openBlock(), createBlock(SortingArrowAsc, { key: 0 })) : Fe.sortable ? (openBlock(), createBlock(SortingArrow, { key: 1 })) : createCommentVNode("", !0)
                ], 2)
              ])
            ], 10, _hoisted_5$7))), 128))
          ])
        ]),
        createElementVNode("tbody", null, [
          (openBlock(!0), createElementBlock(Fragment, null, renderList($e.data, (Fe, He) => (openBlock(), createBlock(_sfc_main$o, {
            key: (Fe == null ? void 0 : Fe.id) ?? He,
            row: Fe,
            fields: Ae.value,
            "row-index": He,
            rowClickHandler: Be.rowClickHandler
          }, null, 8, ["row", "fields", "row-index", "rowClickHandler"]))), 128))
        ])
      ])
    ]));
  }
}), _sfc_main$k = {};
function _sfc_render$6($e, _e) {
  return openBlock(), createElementBlock("div");
}
const Column = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$6]]), _sfc_main$j = {}, _hoisted_1$h = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "800px",
  height: "800px",
  viewBox: "0 0 24 24",
  fill: "none",
  webcrx: ""
};
function _sfc_render$5($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$h, [..._e[0] || (_e[0] = [
    createElementVNode("path", {
      d: "M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z",
      stroke: "#1C274C",
      "stroke-width": "1.5"
    }, null, -1),
    createElementVNode("path", {
      d: "M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8",
      stroke: "#1C274C",
      "stroke-width": "1.5",
      "stroke-linecap": "round"
    }, null, -1)
  ])]);
}
const ContactIcon = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$5]]), _sfc_main$i = {}, _hoisted_1$g = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "#374151",
  width: "800px",
  height: "800px",
  viewBox: "0 0 24 24",
  webcrx: "",
  class: "ire-stroke-[0px]"
};
function _sfc_render$4($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$g, [..._e[0] || (_e[0] = [
    createElementVNode("path", {
      d: "M3.624,15a8.03,8.03,0,0,0,10.619.659l5.318,5.318a1,1,0,0,0,1.414-1.414l-5.318-5.318A8.04,8.04,0,0,0,3.624,3.624,8.042,8.042,0,0,0,3.624,15Zm1.414-9.96a6.043,6.043,0,1,1-1.77,4.274A6,6,0,0,1,5.038,5.038ZM4.622,9.311a1,1,0,0,1,2,0A2.692,2.692,0,0,0,9.311,12a1,1,0,0,1,0,2A4.7,4.7,0,0,1,4.622,9.311Z",
      stroke: "0"
    }, null, -1)
  ])]);
}
const MagnifyIcon = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$4]]), _hoisted_1$f = { class: "irep-table-action" }, _hoisted_2$9 = { class: "irep-table-action__buttons ire-flex ire-items-center ire-justify-start ire-gap-3 ire-text-center [&_svg]:ire-size-6" }, _hoisted_3$6 = ["innerHTML"], _hoisted_4$6 = ["href"], _hoisted_5$6 = ["innerHTML"], _hoisted_6$6 = ["href"], _hoisted_7$6 = ["innerHTML"], _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "TableAction",
  props: {
    flat: {}
  },
  emits: ["openFlat"],
  setup($e, { emit: _e }) {
    const ke = _e, Be = useGlobalStore(), { shortcodeData: Ne } = storeToRefs(Be), Ve = computed(() => {
      var Ae;
      return (Ae = Ne.value) == null ? void 0 : Ae.configs.tableActionSvgs;
    }), Le = computed(() => {
      var Ae;
      return (Ae = Ne.value) == null ? void 0 : Ae.configs.tableContactUrl;
    }), De = computed(
      () => {
        var Ae, Ie;
        return ((Ie = (Ae = Ne.value) == null ? void 0 : Ae.configs) == null ? void 0 : Ie.hasTableWholeRowClickable) ?? !1;
      }
    );
    return (Ae, Ie) => {
      var Re, ze, je, Fe, He, Ge, qe, Xe, Ye, We, Je, ri;
      return openBlock(), createElementBlock("div", _hoisted_1$f, [
        createElementVNode("div", _hoisted_2$9, [
          De.value ? createCommentVNode("", !0) : (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            (Re = Ve.value) != null && Re.magnifySvg ? (openBlock(), createElementBlock("div", {
              key: 0,
              innerHTML: (ze = Ve.value) == null ? void 0 : ze.magnifySvg,
              class: "irep-table-action__btn ire-flex ire-cursor-pointer ire-justify-center ire-text-center [&_svg]:ire-size-6"
            }, null, 8, _hoisted_3$6)) : (openBlock(), createBlock(MagnifyIcon, {
              key: 1,
              class: "ire-cursor-pointer ire-fill-gray-900 ire-stroke-transparent",
              onClick: Ie[0] || (Ie[0] = (Qe) => {
                var ti;
                return ke("openFlat", (ti = $e.flat) == null ? void 0 : ti.id);
              })
            }))
          ], 64)),
          Le.value ? (openBlock(), createElementBlock("a", {
            key: 1,
            href: `${Le.value}${unref(getNested)($e.flat, ((Fe = (je = unref(Ne)) == null ? void 0 : je.configs) == null ? void 0 : Fe.flatFieldQueryParameter) || "") || ((He = $e.flat) == null ? void 0 : He.id)}`,
            target: "_blank",
            class: "irep-table-action__contact ire-flex ire-justify-center ire-text-center [&_svg]:ire-size-6",
            onClick: Ie[1] || (Ie[1] = withModifiers(() => {
            }, ["stop"]))
          }, [
            (Ge = Ve.value) != null && Ge.contactSvg ? (openBlock(), createElementBlock("div", {
              key: 0,
              innerHTML: (qe = Ve.value) == null ? void 0 : qe.contactSvg,
              class: "irep-table-action__btn ire-flex ire-cursor-pointer ire-justify-center ire-text-center [&_svg]:ire-size-6"
            }, null, 8, _hoisted_5$6)) : (openBlock(), createBlock(ContactIcon, {
              key: 1,
              class: "ire-cursor-pointer ire-fill-transparent ire-stroke-transparent [&_path]:ire-stroke-gray-900"
            }))
          ], 8, _hoisted_4$6)) : createCommentVNode("", !0),
          (We = (Ye = (Xe = $e.flat) == null ? void 0 : Xe.files) == null ? void 0 : Ye[0]) != null && We.url ? (openBlock(), createElementBlock("a", {
            key: 2,
            href: $e.flat.files[0].url,
            target: "_blank",
            class: "irep-table-action__download ire-flex ire-justify-center ire-text-center",
            onClick: Ie[2] || (Ie[2] = withModifiers(() => {
            }, ["stop"]))
          }, [
            (Je = Ve.value) != null && Je.downloadSvg ? (openBlock(), createElementBlock("div", {
              key: 0,
              innerHTML: (ri = Ve.value) == null ? void 0 : ri.downloadSvg,
              class: "irep-table-action__btn ire-flex ire-cursor-pointer ire-justify-center ire-text-center [&_svg]:ire-size-6"
            }, null, 8, _hoisted_7$6)) : (openBlock(), createBlock(DownloadIcon, {
              key: 1,
              class: "ire-cursor-pointer ire-fill-transparent ire-stroke-transparent [&_path]:ire-stroke-gray-900"
            }))
          ], 8, _hoisted_6$6)) : createCommentVNode("", !0)
        ])
      ]);
    };
  }
}), _hoisted_1$e = { class: "irep-table-price ire-flex ire-items-center ire-gap-2 ire-uppercase" }, _hoisted_2$8 = { key: 1 }, _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "TablePrice",
  props: {
    slotProps: {},
    item: {}
  },
  setup($e) {
    const _e = useGlobalStore(), { hasPriceHistoryAddon: ke } = storeToRefs(_e), Be = ref(!1), Ne = ref(null), Ve = (Ae) => {
      var Ie;
      return ((Ie = Ae == null ? void 0 : Ae.price_history) == null ? void 0 : Ie.length) >= 2 && ke.value;
    }, Le = (Ae) => {
      Be.value = !0, Ne.value = Ae == null ? void 0 : Ae.price_history;
    }, De = () => {
      Be.value = !1, Ne.value = null;
    };
    return (Ae, Ie) => (openBlock(), createElementBlock("div", _hoisted_1$e, [
      unref(getNested)($e.slotProps.data, "conf") || +unref(getNested)($e.slotProps.data, "price_n") == 0 ? (openBlock(), createBlock(_sfc_main$19, {
        key: 0,
        conf: unref(getNested)($e.slotProps.data, "conf")
      }, null, 8, ["conf"])) : (openBlock(), createElementBlock("span", _hoisted_2$8, toDisplayString(unref(getNested)($e.slotProps.data, $e.item.field)), 1)),
      Ve($e.slotProps.data) && unref(getNested)($e.slotProps.data, $e.item.field) ? (openBlock(), createBlock(IconButton, {
        key: 2,
        class: "price-history-button ire-w-fit",
        onClick: Ie[0] || (Ie[0] = withModifiers((Re) => Le($e.slotProps.data), ["stop", "prevent"]))
      }, {
        default: withCtx(() => [
          createVNode(LineChartIcon)
        ]),
        _: 1
      })) : createCommentVNode("", !0),
      (openBlock(), createBlock(Teleport, { to: "body" }, [
        createVNode(Transition, {
          name: "ire-fade-in-out",
          mode: "out-in"
        }, {
          default: withCtx(() => [
            Be.value && Ne.value && unref(ke) ? (openBlock(), createBlock(_sfc_main$V, {
              key: 0,
              "price-history": Ne.value,
              onClose: De
            }, null, 8, ["price-history"])) : createCommentVNode("", !0)
          ]),
          _: 1
        })
      ]))
    ]));
  }
}), _hoisted_1$d = { class: "irep-flats-table" }, _hoisted_2$7 = { class: "irep-flats-table__mobile-list ire-flex ire-flex-col md:ire-hidden" }, _hoisted_3$5 = ["onClick"], _hoisted_4$5 = { class: "irep-flats-table__responsive-row-left ire-space-y-2" }, _hoisted_5$5 = {
  key: 1,
  class: "irep-flats-table__cell-conf ire-flex ire-items-center ire-gap-2 ire-uppercase"
}, _hoisted_6$5 = {
  key: 2,
  class: "irep-flats-table__cell-value ire-text-black"
}, _hoisted_7$5 = { class: "irep-flats-table__conf-cell ire-flex ire-items-center ire-gap-2 ire-uppercase" }, _hoisted_8$5 = {
  key: 0,
  class: "ire-flex ire-items-center ire-gap-2 ire-uppercase"
}, _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "FlatsTable",
  props: {
    flats: {}
  },
  emits: ["sortColumn", "openFlat"],
  setup($e, { emit: _e }) {
    const ke = _e, Be = useGlobalStore(), { shortcodeData: Ne } = storeToRefs(Be), Ve = computed(
      () => {
        var Re, ze;
        return ((ze = (Re = Ne.value) == null ? void 0 : Re.configs) == null ? void 0 : ze.tableFields) || [];
      }
    ), Le = computed(
      () => {
        var Re, ze;
        return ((ze = (Re = Ne.value) == null ? void 0 : Re.configs) == null ? void 0 : ze.hasTableOneColumn) ?? !1;
      }
    ), De = computed(
      () => {
        var Re, ze;
        return ((ze = (Re = Ne.value) == null ? void 0 : Re.configs) == null ? void 0 : ze.hasTableWholeRowClickable) ?? !1;
      }
    ), Ae = (Re, ze) => {
      ke("sortColumn", Re, ze);
    }, Ie = (Re) => {
      ke("openFlat", Re);
    };
    return (Re, ze) => (openBlock(), createElementBlock("div", _hoisted_1$d, [
      Le.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
        createElementVNode("div", _hoisted_2$7, [
          (openBlock(!0), createElementBlock(Fragment, null, renderList($e.flats, (je) => {
            var Fe;
            return openBlock(), createElementBlock("div", {
              key: je.id,
              class: normalizeClass(["irep-flats-table__responsive-row ire-flex ire-items-center ire-justify-between !ire-border-b ire-border-solid !ire-border-b-black ire-py-4 last:ire-border-none", { "ire-cursor-pointer": De.value }]),
              onClick: (He) => De.value && Ie(je.id)
            }, [
              createElementVNode("div", _hoisted_4$5, [
                (openBlock(!0), createElementBlock(Fragment, null, renderList((Fe = Ve.value) == null ? void 0 : Fe.filter((He) => He.field), (He) => (openBlock(), createElementBlock("div", {
                  key: He.field,
                  class: "irep-flats-table__responsive-row-left-item ire-flex ire-flex-wrap ire-items-center ire-gap-1 ire-text-left"
                }, [
                  He.field === "price" ? (openBlock(), createBlock(_sfc_main$g, {
                    key: 0,
                    "slot-props": { data: je },
                    item: He
                  }, null, 8, ["slot-props", "item"])) : He.field === "conf" ? (openBlock(), createElementBlock("div", _hoisted_5$5, [
                    createVNode(_sfc_main$19, {
                      conf: unref(getNested)(je, "conf")
                    }, null, 8, ["conf"])
                  ])) : (openBlock(), createElementBlock("div", _hoisted_6$5, toDisplayString(unref(getNested)(je, He.field)), 1))
                ]))), 128))
              ]),
              createVNode(_sfc_main$h, {
                flat: je,
                onOpenFlat: Ie
              }, null, 8, ["flat"])
            ], 10, _hoisted_3$5);
          }), 128))
        ]),
        createVNode(_sfc_main$l, {
          data: $e.flats,
          class: "ire-hidden md:ire-block",
          rowClickHandler: De.value ? (je) => Ie(je.id) : void 0,
          onSortColumn: Ae
        }, {
          default: withCtx(() => [
            (openBlock(!0), createElementBlock(Fragment, null, renderList(Ve.value, (je) => (openBlock(), createBlock(Column, {
              key: je.field,
              field: je.field,
              header: je.header,
              sortable: je == null ? void 0 : je.sortable
            }, createSlots({ _: 2 }, [
              je.field === "price" ? {
                name: "body",
                fn: withCtx((Fe) => [
                  createVNode(_sfc_main$g, {
                    "slot-props": Fe,
                    item: je
                  }, null, 8, ["slot-props", "item"])
                ]),
                key: "0"
              } : je.field === "conf" ? {
                name: "body",
                fn: withCtx((Fe) => [
                  createElementVNode("div", _hoisted_7$5, [
                    createVNode(_sfc_main$19, {
                      conf: unref(getNested)(Fe.data, "conf")
                    }, null, 8, ["conf"])
                  ])
                ]),
                key: "1"
              } : void 0
            ]), 1032, ["field", "header", "sortable"]))), 128)),
            createVNode(Column, {
              header: unref(tr)("action"),
              sortable: ""
            }, {
              body: withCtx((je) => [
                createVNode(_sfc_main$h, {
                  flat: je.data,
                  onOpenFlat: Ie
                }, null, 8, ["flat"])
              ]),
              _: 1
            }, 8, ["header"])
          ]),
          _: 1
        }, 8, ["data", "rowClickHandler"])
      ], 64)) : (openBlock(), createBlock(_sfc_main$l, {
        key: 1,
        data: $e.flats,
        rowClickHandler: De.value ? (je) => Ie(je.id) : void 0,
        onSortColumn: Ae
      }, {
        default: withCtx(() => [
          (openBlock(!0), createElementBlock(Fragment, null, renderList(Ve.value, (je) => (openBlock(), createBlock(Column, {
            key: je.field,
            field: je.field,
            header: je.header,
            sortable: je == null ? void 0 : je.sortable
          }, createSlots({ _: 2 }, [
            je.field === "price" ? {
              name: "body",
              fn: withCtx((Fe) => [
                createVNode(_sfc_main$g, {
                  "slot-props": Fe,
                  item: je
                }, null, 8, ["slot-props", "item"])
              ]),
              key: "0"
            } : je.field === "conf" ? {
              name: "body",
              fn: withCtx((Fe) => [
                unref(getNested)(Fe.data, "conf") ? (openBlock(), createElementBlock("div", _hoisted_8$5, [
                  createVNode(_sfc_main$19, {
                    conf: unref(getNested)(Fe.data, "conf")
                  }, null, 8, ["conf"])
                ])) : createCommentVNode("", !0)
              ]),
              key: "1"
            } : void 0
          ]), 1032, ["field", "header", "sortable"]))), 128)),
          createVNode(Column, {
            header: unref(tr)("action"),
            sortable: ""
          }, {
            body: withCtx((je) => [
              createVNode(_sfc_main$h, {
                flat: je.data,
                onOpenFlat: Ie
              }, null, 8, ["flat"])
            ]),
            _: 1
          }, 8, ["header"])
        ]),
        _: 1
      }, 8, ["data", "rowClickHandler"]))
    ]));
  }
}), _hoisted_1$c = { class: "irep-range ire-w-full md:ire-w-auto md:ire-min-w-[200px]" }, _hoisted_2$6 = { class: "irep-range__header ire-mb-1 ire-flex ire-items-baseline ire-justify-between" }, _hoisted_3$4 = { class: "ire-text-sm ire-font-medium ire-capitalize ire-text-gray-500" }, _hoisted_4$4 = { class: "irep-range__values ire-flex ire-items-center ire-gap-1" }, _hoisted_5$4 = { class: "irep-range__values-inner ire-flex ire-items-baseline ire-gap-1 ire-bg-gray-100 ire-p-1" }, _hoisted_6$4 = { class: "ire-text-sm ire-font-semibold ire-text-gray-700" }, _hoisted_7$4 = { class: "ire-text-sm ire-font-semibold ire-text-gray-700" }, _hoisted_8$4 = { class: "ire-text-xs ire-text-gray-500" }, _hoisted_9$4 = {
  key: 0,
  class: "irep-range__thumb-dot ire-absolute ire-left-1/2 ire-top-1/2 ire-size-1 -ire-translate-x-1/2 -ire-translate-y-1/2 ire-rounded-full ire-bg-[var(--primary-color)] ire-transition-all"
}, _hoisted_10$3 = {
  key: 0,
  class: "irep-range__thumb-dot ire-absolute ire-left-1/2 ire-top-1/2 ire-size-1 -ire-translate-x-1/2 -ire-translate-y-1/2 ire-rounded-full ire-bg-[var(--primary-color)] ire-transition-all"
}, MAX_STEP_DECIMALS = 10, thumbRadiusPx = 10, _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "Range",
  props: /* @__PURE__ */ mergeModels({
    min: { default: 0 },
    max: { default: 800 },
    step: { default: 1 },
    unit: { default: "m²" },
    label: { default: "Range" },
    isPrice: { type: Boolean, default: !1 }
  }, {
    modelValue: { default: () => [0, 800] },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup($e) {
    const _e = $e, ke = useModel($e, "modelValue"), Be = ref(null), Ne = ref(null), Ve = (Ze, Ue, Ke) => Math.min(Ke, Math.max(Ue, Ze));
    function Le(Ze) {
      if (!Number.isFinite(Ze) || Ze <= 0) return 0;
      const Ke = Math.abs(Ze).toString().toLowerCase();
      if (Ke.includes("e-")) {
        const oi = /e-(\d+)/.exec(Ke);
        return oi ? Math.min(Number(oi[1]), MAX_STEP_DECIMALS) : MAX_STEP_DECIMALS;
      }
      const ii = Ke.indexOf(".");
      return ii === -1 ? 0 : Math.min(Ke.length - ii - 1, MAX_STEP_DECIMALS);
    }
    function De() {
      const Ze = Le(_e.step);
      return Ze === 0 ? 0 : Math.max(Ze, 2);
    }
    function Ae(Ze) {
      const Ue = De();
      return Ue === 0 ? Math.round(Ze) : Number.parseFloat(Ze.toFixed(Ue));
    }
    const Ie = (Ze) => {
      if (Ze <= _e.min) return Ae(_e.min);
      if (Ze >= _e.max) return Ae(_e.max);
      const Ue = Math.round((Ze - _e.min) / _e.step) * _e.step + _e.min;
      return Ae(Ve(Ue, _e.min, _e.max));
    }, Re = (Ze) => {
      const Ue = Number(Ze == null ? void 0 : Ze[0]), Ke = Number(Ze == null ? void 0 : Ze[1]), ii = Number.isFinite(Ue) ? Ie(Ue) : _e.min, oi = Number.isFinite(Ke) ? Ie(Ke) : _e.max;
      return [Math.min(ii, oi), Math.max(ii, oi)];
    }, ze = computed(() => ke.value[0]), je = computed(() => ke.value[1]), Fe = computed(
      () => ze.value > _e.min || je.value < _e.max
    ), He = (Ze) => {
      const Ue = _e.max - _e.min;
      return !Number.isFinite(Ue) || Ue <= 0 ? 0 : (Ze - _e.min) / Ue * 100;
    }, Ge = (Ze) => {
      const Ue = He(Ze), Ke = thumbRadiusPx - Ue / 100 * thumbRadiusPx * 2;
      return `calc(${Ue}% + ${Ke}px)`;
    }, qe = computed(() => {
      const Ze = He(ze.value), Ue = He(je.value), Ke = thumbRadiusPx - Ze / 100 * thumbRadiusPx * 2, ii = thumbRadiusPx - Ue / 100 * thumbRadiusPx * 2;
      return {
        left: Ge(ze.value),
        width: `calc(${Ue - Ze}% + ${ii - Ke}px)`
      };
    }), Xe = computed(() => ({ left: Ge(ze.value) })), Ye = computed(() => ({ left: Ge(je.value) })), We = (Ze) => {
      const Ue = Be.value.getBoundingClientRect(), Ke = Ue.left + thumbRadiusPx, ii = Math.max(1, Ue.width - thumbRadiusPx * 2), oi = (Ze - Ke) / ii;
      if (oi <= 0) return _e.min;
      if (oi >= 1) return _e.max;
      const ni = _e.min + oi * (_e.max - _e.min), pi = Math.round((ni - _e.min) / _e.step) * _e.step + _e.min;
      return Ae(Ve(pi, _e.min, _e.max));
    }, Je = (Ze) => {
      if (!Ne.value) return;
      const Ue = We(Ze);
      Ne.value === "min" ? ke.value = [
        Ie(Math.min(Ue, je.value - _e.step)),
        Ie(je.value)
      ] : ke.value = [
        Ie(ze.value),
        Ie(Math.max(Ue, ze.value + _e.step))
      ];
    }, ri = (Ze) => Je(Ze.clientX), Qe = (Ze) => Je(Ze.touches[0].clientX), ti = () => {
      Ne.value = null;
    };
    watch(
      () => [_e.min, _e.max, _e.step, ke.value],
      () => {
        const Ze = Re(ke.value);
        (Ze[0] !== ke.value[0] || Ze[1] !== ke.value[1]) && (ke.value = Ze);
      },
      { immediate: !0, deep: !0 }
    ), onMounted(() => {
      window.addEventListener("mousemove", ri), window.addEventListener("mouseup", ti), window.addEventListener("touchmove", Qe, { passive: !1 }), window.addEventListener("touchend", ti);
    }), onUnmounted(() => {
      window.removeEventListener("mousemove", ri), window.removeEventListener("mouseup", ti), window.removeEventListener("touchmove", Qe), window.removeEventListener("touchend", ti);
    }), computed(
      () => Array.from(
        { length: 5 },
        (Ze, Ue) => Math.round(_e.min + Ue / 4 * (_e.max - _e.min))
      )
    );
    function ei(Ze) {
      if (_e.isPrice) return getPrice(Ze);
      const Ue = De();
      return Ue === 0 ? String(Math.round(Ze)) : Number(Ze).toFixed(Ue);
    }
    return (Ze, Ue) => (openBlock(), createElementBlock("div", _hoisted_1$c, [
      createElementVNode("div", _hoisted_2$6, [
        createElementVNode("span", _hoisted_3$4, toDisplayString(unref(tr)($e.label)), 1),
        createElementVNode("div", _hoisted_4$4, [
          createElementVNode("div", _hoisted_5$4, [
            createElementVNode("span", _hoisted_6$4, toDisplayString(ei(ze.value)), 1),
            Ue[4] || (Ue[4] = createElementVNode("span", { class: "ire-text-xs ire-text-gray-500" }, "–", -1)),
            createElementVNode("span", _hoisted_7$4, toDisplayString(ei(je.value)), 1)
          ]),
          createElementVNode("span", _hoisted_8$4, toDisplayString($e.unit), 1)
        ])
      ]),
      createElementVNode("div", {
        ref_key: "trackRef",
        ref: Be,
        class: "irep-range__track ire-relative ire-flex ire-h-9 ire-cursor-default ire-select-none ire-items-center"
      }, [
        Ue[5] || (Ue[5] = createElementVNode("div", { class: "irep-range__rail ire-absolute ire-inset-y-auto ire-left-[5px] ire-right-[5px] ire-h-1 ire-rounded-full ire-bg-gray-200" }, null, -1)),
        createElementVNode("div", {
          class: normalizeClass(["irep-range__fill ire-absolute ire-h-1 ire-rounded-full ire-ease-out", [
            Fe.value ? "ire-bg-[var(--primary-color)]" : "ire-bg-gray-200",
            Ne.value ? "ire-transition-colors ire-duration-200" : "ire-transition-[left,width,background-color] ire-duration-200"
          ]]),
          style: normalizeStyle(qe.value)
        }, null, 6),
        createElementVNode("div", {
          class: normalizeClass(["irep-range__thumb irep-range__thumb--min ire-absolute ire-z-10 -ire-mt-px ire-size-5 -ire-translate-x-1/2 ire-cursor-grab ire-rounded-full ire-border ire-border-solid ire-border-black/20 ire-bg-white ire-shadow-lg ire-transition-shadow hover:ire-ring-4 hover:ire-ring-blue-500/10 active:ire-cursor-grabbing", {
            "ire-cursor-grabbing ire-ring-4 ire-ring-blue-500/20": Ne.value === "min"
          }]),
          style: normalizeStyle(Xe.value),
          onMousedown: Ue[0] || (Ue[0] = withModifiers((Ke) => Ne.value = "min", ["prevent"])),
          onTouchstart: Ue[1] || (Ue[1] = withModifiers((Ke) => Ne.value = "min", ["prevent"]))
        }, [
          Fe.value ? (openBlock(), createElementBlock("div", _hoisted_9$4)) : createCommentVNode("", !0)
        ], 38),
        createElementVNode("div", {
          class: normalizeClass(["irep-range__thumb irep-range__thumb--max ire-absolute ire-z-10 -ire-mt-px ire-size-5 -ire-translate-x-1/2 ire-cursor-grab ire-rounded-full ire-border ire-border-solid ire-border-black/20 ire-bg-white ire-shadow-lg ire-transition-shadow hover:ire-ring-4 hover:ire-ring-blue-500/10 active:ire-cursor-grabbing", {
            "ire-cursor-grabbing ire-ring-4 ire-ring-blue-500/20": Ne.value === "max"
          }]),
          style: normalizeStyle(Ye.value),
          onMousedown: Ue[2] || (Ue[2] = withModifiers((Ke) => Ne.value = "max", ["prevent"])),
          onTouchstart: Ue[3] || (Ue[3] = withModifiers((Ke) => Ne.value = "max", ["prevent"]))
        }, [
          Fe.value ? (openBlock(), createElementBlock("div", _hoisted_10$3)) : createCommentVNode("", !0)
        ], 38)
      ], 512)
    ]));
  }
}), _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "ClearFiltersButton",
  props: {
    visible: { type: Boolean }
  },
  emits: ["click"],
  setup($e) {
    return (_e, ke) => $e.visible ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: "irep-clear-filters-button ire-cursor-pointer ire-text-sm ire-font-medium ire-capitalize ire-text-[var(--primary-color)] ire-underline-offset-4 ire-transition-all hover:ire-text-black hover:ire-underline",
      onClick: ke[0] || (ke[0] = (Be) => _e.$emit("click"))
    }, toDisplayString(unref(tr)("clear filters")), 1)) : createCommentVNode("", !0);
  }
}), _hoisted_1$b = { class: "irep-flats-list-filters ire-flex ire-w-full ire-flex-wrap ire-items-center ire-gap-x-8 ire-gap-y-4 ire-text-start ire-text-base" }, _hoisted_2$5 = { class: "irep-flats-list-filters__select-wrapper ire-w-full md:ire-w-[200px] md:ire-max-w-[200px] [&_select]:ire-w-full" }, _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "Filters",
  props: {
    filtersObject: {},
    filtersObjectModifiers: {}
  },
  emits: ["update:filtersObject"],
  setup($e) {
    const _e = useGlobalStore(), ke = useModel($e, "filtersObject"), Be = ref(!1);
    function Ne(Ye) {
      if (Ye == null) return {};
      if (typeof Ye == "object" && !Array.isArray(Ye))
        return Ye;
      if (typeof Ye == "string")
        try {
          const We = JSON.parse(Ye);
          if (We && typeof We == "object" && !Array.isArray(We))
            return We;
        } catch {
        }
      return {};
    }
    function Ve(Ye, We) {
      let Je = Ye;
      if (typeof Ye == "string")
        try {
          const ri = JSON.parse(Ye);
          if (ri && typeof ri == "object" && !Array.isArray(ri))
            Je = ri;
          else
            return We;
        } catch {
          return We;
        }
      if (Je && typeof Je == "object" && !Array.isArray(Je)) {
        const ri = Number(Je.min), Qe = Number(Je.max), ti = Number(Je.step);
        return {
          min: Number.isFinite(ri) ? ri : We.min,
          max: Number.isFinite(Qe) ? Qe : We.max,
          step: Number.isFinite(ti) && ti > 0 ? ti : We.step
        };
      }
      return We;
    }
    const Le = computed(() => {
      var Je;
      const We = (((Je = _e.shortcodeData) == null ? void 0 : Je.floors) ?? []).map((ri) => Number(ri.floor_number)).filter((ri) => Number.isFinite(ri));
      return We.length ? {
        min: Math.min(...We),
        max: Math.max(...We)
      } : { min: 0, max: 16 };
    }), De = computed(
      () => Ne(_e.getMetaValue("filter_options"))
    ), Ae = computed(
      () => Ve(De.value.price_filter_options, {
        min: 0,
        max: 1e6,
        step: 1e3
      })
    ), Ie = computed(
      () => Ve(De.value.area_filter_options, {
        min: 0,
        max: 300,
        step: 10
      })
    ), Re = computed(
      () => Ve(De.value.rooms_filter_options, {
        min: 0,
        max: 10,
        step: 1
      })
    ), ze = _e.getMetaValue("custom_types"), je = Array.isArray(ze) ? ze.map((Ye) => ({ title: tr(Ye.title), value: Ye.value })) : [], Fe = [
      { title: tr("all"), value: "all" },
      { title: tr("available"), value: "available" },
      { title: tr("reserved"), value: "reserved" },
      { title: tr("sold"), value: "sold" },
      ...je
    ], He = ref(!1), Ge = computed(() => ({
      priceRange: [Ae.value.min, Ae.value.max],
      areaRange: [Ie.value.min, Ie.value.max],
      floorRange: [Le.value.min, Le.value.max],
      roomRange: [Re.value.min, Re.value.max],
      config: "all"
    })), qe = computed(() => {
      if (!He.value || !ke.value) return !1;
      const Ye = Ge.value, We = ke.value;
      return JSON.stringify(We.priceRange) !== JSON.stringify(Ye.priceRange) || JSON.stringify(We.areaRange) !== JSON.stringify(Ye.areaRange) || JSON.stringify(We.floorRange) !== JSON.stringify(Ye.floorRange) || JSON.stringify(We.roomRange) !== JSON.stringify(Ye.roomRange) || We.config !== Ye.config;
    });
    watch(
      Le,
      (Ye) => {
        if (!ke.value) return;
        const We = ke.value.floorRange, Je = Array.isArray(We) && We[0] === 0 && We[1] === 16, ri = !Array.isArray(We) || We.length !== 2 || We.some((Qe) => !Number.isFinite(Number(Qe)));
        (Je || ri) && (ke.value = {
          ...ke.value,
          floorRange: [Ye.min, Ye.max]
        }), He.value = !0;
      },
      { immediate: !0 }
    );
    const Xe = () => {
      ke.value = { ...Ge.value };
    };
    return onMounted(() => {
      setTimeout(() => {
        Be.value = !0;
      }, 500);
    }), (Ye, We) => (openBlock(), createElementBlock("div", _hoisted_1$b, [
      createVNode(_sfc_main$e, {
        modelValue: ke.value.priceRange,
        "onUpdate:modelValue": We[0] || (We[0] = (Je) => ke.value.priceRange = Je),
        min: Ae.value.min ?? 0,
        max: Ae.value.max ?? 1e6,
        step: Ae.value.step ?? 1e3,
        unit: unref(currencySymbol)(),
        label: "price",
        "is-price": ""
      }, null, 8, ["modelValue", "min", "max", "step", "unit"]),
      createVNode(_sfc_main$e, {
        modelValue: ke.value.areaRange,
        "onUpdate:modelValue": We[1] || (We[1] = (Je) => ke.value.areaRange = Je),
        min: Ie.value.min ?? 0,
        max: Ie.value.max ?? 300,
        step: Ie.value.step ?? 1,
        unit: `${unref(getAreaUnitLabel)()}²`,
        label: "area"
      }, null, 8, ["modelValue", "min", "max", "step", "unit"]),
      Le.value.min && Le.value.max ? (openBlock(), createBlock(_sfc_main$e, {
        key: 0,
        modelValue: ke.value.floorRange,
        "onUpdate:modelValue": We[2] || (We[2] = (Je) => ke.value.floorRange = Je),
        min: Le.value.min,
        max: Le.value.max,
        step: 1,
        unit: "",
        label: "floor"
      }, null, 8, ["modelValue", "min", "max"])) : createCommentVNode("", !0),
      createVNode(_sfc_main$e, {
        modelValue: ke.value.roomRange,
        "onUpdate:modelValue": We[3] || (We[3] = (Je) => ke.value.roomRange = Je),
        min: Re.value.min ?? 0,
        max: Re.value.max ?? 10,
        step: Re.value.step ?? 1,
        unit: "",
        label: "rooms"
      }, null, 8, ["modelValue", "min", "max", "step"]),
      createElementVNode("div", _hoisted_2$5, [
        createVNode(_sfc_main$15, {
          modelValue: ke.value.config,
          "onUpdate:modelValue": We[4] || (We[4] = (Je) => ke.value.config = Je),
          data: Fe,
          disabled: !1,
          class: "irep-flats-list-filters-select"
        }, null, 8, ["modelValue"])
      ]),
      createVNode(Transition, { name: "ire-fade-in-out" }, {
        default: withCtx(() => [
          createVNode(_sfc_main$d, {
            visible: qe.value,
            onClick: Xe
          }, null, 8, ["visible"])
        ]),
        _: 1
      })
    ]));
  }
}), _sfc_main$b = {}, _hoisted_1$a = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "800px",
  height: "800px",
  viewBox: "0 0 24 24",
  fill: "none",
  webcrx: ""
};
function _sfc_render$3($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$a, [..._e[0] || (_e[0] = [
    createElementVNode("path", {
      d: "M6.75 3C3.88235 3 3 3.88235 3 6.75C3 9.61765 3.88235 10.5 6.75 10.5C9.61765 10.5 10.5 9.61765 10.5 6.75C10.5 3.88235 9.61765 3 6.75 3Z",
      stroke: "#000000",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1),
    createElementVNode("path", {
      d: "M6.75 13.5C3.88235 13.5 3 14.3824 3 17.25C3 20.1176 3.88235 21 6.75 21C9.61765 21 10.5 20.1176 10.5 17.25C10.5 14.3824 9.61765 13.5 6.75 13.5Z",
      stroke: "#000000",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1),
    createElementVNode("path", {
      d: "M17.25 13.5C14.3824 13.5 13.5 14.3824 13.5 17.25C13.5 20.1176 14.3824 21 17.25 21C20.1176 21 21 20.1176 21 17.25C21 14.3824 20.1176 13.5 17.25 13.5Z",
      stroke: "#000000",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1),
    createElementVNode("path", {
      d: "M17.25 3C14.3824 3 13.5 3.88235 13.5 6.75C13.5 9.61765 14.3824 10.5 17.25 10.5C20.1176 10.5 21 9.61765 21 6.75C21 3.88235 20.1176 3 17.25 3Z",
      stroke: "#000000",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ])]);
}
const GridIcon = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$3]]), _hoisted_1$9 = { class: "irep-flats-top ire-mb-8" }, _hoisted_2$4 = { class: "irep-flats-list__header ire-mb-4 ire-flex ire-flex-wrap ire-items-center ire-justify-between ire-gap-4" }, _hoisted_3$3 = { class: "irep-flats-list__title ire-text-2xl ire-font-semibold ire-capitalize" }, _hoisted_4$3 = {
  key: 0,
  class: "irep-flats-view-container ire-flex ire-min-w-0 ire-shrink-0 ire-justify-end ire-text-center"
}, _hoisted_5$3 = ["aria-label"], _hoisted_6$3 = ["aria-selected"], _hoisted_7$3 = { class: "ire-whitespace-nowrap" }, _hoisted_8$3 = ["aria-selected"], _hoisted_9$3 = { class: "ire-whitespace-nowrap" }, _hoisted_10$2 = {
  key: 1,
  class: "irep-flats-cards-list-wrapper ire-grid ire-grid-cols-1 ire-gap-8 ire-gap-y-8 md:ire-grid-cols-2 lg:ire-grid-cols-3"
}, _hoisted_11$2 = {
  key: 1,
  class: "irep-flats-list__empty ire-my-16 ire-text-center ire-text-lg ire-font-semibold ire-capitalize ire-text-black"
}, _hoisted_12$1 = {
  key: 2,
  class: "irep-flats-list__pagination ire-mt-6 ire-flex ire-flex-col ire-items-center ire-gap-4 md:ire-mt-8"
}, _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "FlatsList",
  props: {
    data: {},
    irePlugin: {},
    perPage: {},
    fromListView: { type: Boolean },
    layout: {},
    defaultView: {},
    blockId: {},
    orderBy: {}
  },
  setup($e) {
    const _e = $e, ke = useGlobalStore();
    ke.setData(_e.data), ke.setIrePlaginWp(_e.irePlugin);
    const { getMetaValue: Be } = ke;
    function Ne(ai) {
      if (ai == null) return {};
      if (typeof ai == "object" && !Array.isArray(ai))
        return ai;
      if (typeof ai == "string")
        try {
          const di = JSON.parse(ai);
          if (di && typeof di == "object" && !Array.isArray(di))
            return di;
        } catch {
        }
      return {};
    }
    function Ve(ai, di) {
      let gi = ai;
      if (typeof ai == "string")
        try {
          const si = JSON.parse(ai);
          if (si && typeof si == "object" && !Array.isArray(si))
            gi = si;
          else
            return di;
        } catch {
          return di;
        }
      if (gi && typeof gi == "object" && !Array.isArray(gi)) {
        const si = Number(gi.min), mi = Number(gi.max);
        return {
          min: Number.isFinite(si) ? si : di.min,
          max: Number.isFinite(mi) ? mi : di.max
        };
      }
      return di;
    }
    const Le = Ne(
      ke.getMetaValue("filter_options")
    ), De = Ve(
      Le.price_filter_options,
      {
        min: 0,
        max: 1e6
      }
    ), Ae = Ve(
      Le.area_filter_options,
      {
        min: 0,
        max: 300
      }
    ), Ie = Ve(
      Le.rooms_filter_options,
      {
        min: 0,
        max: 10
      }
    ), {
      shortcodeData: Re,
      cssVariables: ze,
      flats: je
    } = storeToRefs(ke), { scrollToWithOffset: Fe } = useScroll(), He = ref(""), Ge = ref("");
    provide("sortField", He), provide("sortOrder", Ge);
    const qe = ref(!1), Xe = ref(6), Ye = ref(), We = ref(1), Je = ref(!1), ri = ref(), Qe = ref({
      priceRange: [
        (De == null ? void 0 : De.min) ?? 0,
        (De == null ? void 0 : De.max) ?? 1e6
      ],
      areaRange: [(Ae == null ? void 0 : Ae.min) ?? 0, (Ae == null ? void 0 : Ae.max) ?? 300],
      floorRange: [0, 16],
      roomRange: [(Ie == null ? void 0 : Ie.min) ?? 0, (Ie == null ? void 0 : Ie.max) ?? 10],
      config: "all"
    }), ti = computed(() => {
      var gi;
      const di = (((gi = ke.shortcodeData) == null ? void 0 : gi.floors) ?? []).map((si) => Number(si.floor_number)).filter((si) => Number.isFinite(si));
      return di.length ? { min: Math.min(...di), max: Math.max(...di) } : { min: 0, max: 16 };
    }), ei = computed(
      () => Qe.value.floorRange[0] !== ti.value.min || Qe.value.floorRange[1] !== ti.value.max
    ), Ze = computed(
      () => Qe.value.priceRange[0] !== De.min || Qe.value.priceRange[1] !== De.max
    ), Ue = computed(
      () => Qe.value.areaRange[0] !== Ae.min || Qe.value.areaRange[1] !== Ae.max
    ), Ke = computed(
      () => Qe.value.roomRange[0] !== Ie.min || Qe.value.roomRange[1] !== Ie.max
    ), ii = computed(() => {
      if (Re.value)
        return Re.value.types;
    }), oi = computed(() => {
      if (!Re.value) return [];
      const ai = _e.blockId ? _e.blockId.split(",").map((si) => si.trim()).filter(Boolean) : [];
      return (ai.length ? Re.value.flats.filter(
        (si) => ai.includes(String(si.block_id))
      ) : Re.value.flats).map((si) => {
        var yi, Oi, Ri, Di, zi;
        const mi = (Oi = (yi = Re.value) == null ? void 0 : yi.floors) == null ? void 0 : Oi.find(
          ($i) => $i.id === si.floor_id
        ), ki = (Di = (Ri = Re.value) == null ? void 0 : Ri.blocks) == null ? void 0 : Di.find(
          ($i) => $i.id === si.block_id
        ), Si = si.use_type || !si.type ? ((zi = ii.value) == null ? void 0 : zi.find(($i) => $i.id === si.type_id)) ?? si.type : si.type, Ci = Be("custom_types"), Mi = Ci == null ? void 0 : Ci.find(($i) => $i.value === si.conf);
        return {
          ...si,
          type: {
            ...Si,
            area_m2_n: Number(Si == null ? void 0 : Si.area_m2),
            area_m2: `${getArea((Si == null ? void 0 : Si.area_m2) ?? "")} ${getAreaUnitLabel()}²`,
            rooms_count: getRoomCount((Si == null ? void 0 : Si.rooms_count) ?? "")
          },
          price_n: Number(si.price),
          price: si.conf ? Mi ? Mi.title : tr(si.conf) : si.request_price ? tr("Request Price") : Number(si == null ? void 0 : si.price) ? `${getPrice(Number((si == null ? void 0 : si.offer_price) || (si == null ? void 0 : si.price)))} ${currencySymbol()}` : tr("available"),
          floor_title: mi == null ? void 0 : mi.title,
          floor_number: Number.isFinite(Number(mi == null ? void 0 : mi.floor_number)) ? Number(mi == null ? void 0 : mi.floor_number) : "",
          block_title: ki == null ? void 0 : ki.title,
          conf: Mi ? Mi.title : si.conf
        };
      }).map((si) => {
        var ki;
        const mi = (ki = si.type) == null ? void 0 : ki.other.reduce(
          (Si, Ci) => (Si[Ci.key] = Ci.value, Si),
          {}
        );
        return { ...si, type: { ...si.type, other: mi } };
      }).sort((si, mi) => {
        const ki = He.value;
        let Si = si[ki], Ci = mi[ki];
        ki != null && ki.includes(".") && (Si = getNested(si, ki), Ci = getNested(mi, ki)), Si == null && (Si = "0"), Ci == null && (Ci = "0");
        const Mi = Si.toString(), yi = Ci.toString();
        return !isNaN(Mi) && !isNaN(yi) ? Ge.value === "desc" ? yi - Mi : Mi - yi : Ge.value === "desc" ? String(Ci).localeCompare(String(Si)) : String(Si).localeCompare(String(Ci));
      });
    }), ni = computed(() => {
      var ai;
      return ci.value ? Math.ceil(((ai = pi.value) == null ? void 0 : ai.length) / Xe.value) : 0;
    }), pi = computed(() => {
      if (!oi.value) return [];
      const ai = (yi) => parseFloat(String(yi).trim().replace(",", ".")), [di, gi] = Qe.value.priceRange, [si, mi] = Qe.value.areaRange, [ki, Si] = Qe.value.floorRange, [Ci, Mi] = Qe.value.roomRange;
      return oi.value.filter((yi) => {
        var Hi, Ui, Gi, Xi;
        const Oi = Number(yi.price_n), Ri = Number((Hi = yi.type) == null ? void 0 : Hi.area_m2_n), Di = Number((Ui = getFloorById(yi.floor_id)) == null ? void 0 : Ui.floor_number), zi = ((Xi = (Gi = yi.type) == null ? void 0 : Gi.rooms_count) == null ? void 0 : Xi.toString()) || "0", $i = ai(zi), Ii = !Ze.value || (Number.isFinite(Oi) ? Oi >= di && Oi <= gi : !1), xi = !Ue.value || (Number.isFinite(Ri) ? Ri >= si && Ri <= mi : !1), wi = !ei.value || (Number.isFinite(Di) ? Di >= ki && Di <= Si : !1), Ni = !Ke.value || Number.isFinite($i) && $i >= Ci && $i <= Mi;
        let ji = !0;
        if (Qe.value.config !== "all")
          if (Qe.value.config === "available")
            ji = !yi.conf;
          else {
            const Ji = ke.getMetaValue("custom_types"), Ki = Array.isArray(Ji) ? Ji.find((ir) => ir.value === Qe.value.config) : null;
            Ki ? ji = yi.conf === Ki.title : ji = yi.conf === Qe.value.config;
          }
        return Ii && xi && wi && Ni && ji;
      });
    }), ci = computed(() => {
      var gi;
      if (!((gi = Re.value) != null && gi.flats)) return [];
      const ai = (We.value - 1) * Xe.value, di = ai + Xe.value;
      return pi.value.slice(ai, di);
    }), fi = (ai, di = !0) => {
      We.value = ai, Ye.value, di && Fe(Ye.value, 50), setQuery("flats-page", ai.toString());
    }, hi = (ai, di) => {
      He.value = ai, Ge.value = di;
    }, ui = (ai) => {
      var mi;
      const di = (mi = je.value) == null ? void 0 : mi.find((ki) => ki.id === ai), gi = Be("custom_types"), si = gi == null ? void 0 : gi.find(
        (ki) => ki.value === (di == null ? void 0 : di.conf)
      );
      di.conf = si ? si.title : di == null ? void 0 : di.conf, ri.value = di, Je.value = !0;
    };
    return watch(
      () => Qe.value,
      () => {
        We.value = 1, fi(1, !1);
      },
      {
        deep: !0
      }
    ), onMounted(() => {
      const ai = getQuery("flats-page");
      ai && !isNaN(Number(ai)) && (We.value = Number(ai)), _e.perPage && !isNaN(Number(_e.perPage)) && (Xe.value = Number(_e.perPage));
    }), onBeforeMount(() => {
      _e.layout === "mixed" ? qe.value = _e.defaultView === "table" : qe.value = _e.layout === "table", _e.orderBy && (He.value = _e.orderBy, Ge.value = "asc");
    }), provide("fromListView", _e.fromListView), (ai, di) => (openBlock(), createBlock(_sfc_main$1h, { class: "irep-flats-list ire-text-base" }, {
      default: withCtx(() => {
        var gi;
        return [
          createElementVNode("div", {
            ref_key: "flatsContainer",
            ref: Ye,
            class: "irep-flats-list__container"
          }, [
            createElementVNode("div", _hoisted_1$9, [
              createElementVNode("div", _hoisted_2$4, [
                createElementVNode("div", _hoisted_3$3, toDisplayString(unref(tr)("available apartments")), 1),
                $e.layout === "mixed" ? (openBlock(), createElementBlock("div", _hoisted_4$3, [
                  createElementVNode("div", {
                    class: "irep-flats-view-toggle ire-inline-flex ire-min-h-[2.25rem] ire-w-full ire-max-w-[min(100%,50rem)] ire-items-stretch ire-gap-1 ire-rounded-full ire-bg-gray-100/[0.8] ire-p-1 ire-capitalize ire-backdrop-blur-sm sm:ire-w-auto",
                    role: "tablist",
                    "aria-label": unref(tr)("grid view") + " / " + unref(tr)("list view")
                  }, [
                    createElementVNode("div", {
                      role: "tab",
                      "aria-selected": !qe.value,
                      class: normalizeClass([
                        "irep-flats-view-tab ire-group ire-flex ire-flex-1 ire-cursor-pointer ire-items-center ire-justify-center ire-gap-1.5 ire-rounded-full ire-px-2 ire-py-1 ire-text-xs ire-transition-all ire-duration-300 focus-visible:ire-outline focus-visible:ire-outline-2 focus-visible:ire-outline-offset-2 focus-visible:ire-outline-[var(--primary-color)] sm:ire-text-sm",
                        qe.value ? "ire-bg-transparent ire-text-black hover:ire-bg-white hover:ire-text-black" : "ire-bg-white ire-text-gray-900 ire-shadow-sm"
                      ]),
                      onClick: di[0] || (di[0] = (si) => qe.value = !1)
                    }, [
                      createVNode(GridIcon, {
                        class: normalizeClass(["ire-size-3.5 ire-shrink-0 ire-fill-transparent sm:ire-size-4 [&_path]:ire-stroke-current", qe.value ? "ire-text-black" : "ire-text-gray-900"])
                      }, null, 8, ["class"]),
                      createElementVNode("span", _hoisted_7$3, toDisplayString(unref(tr)("grid view")), 1)
                    ], 10, _hoisted_6$3),
                    createElementVNode("div", {
                      role: "tab",
                      "aria-selected": qe.value,
                      class: normalizeClass([
                        "irep-flats-view-tab ire-group ire-flex ire-flex-1 ire-cursor-pointer ire-items-center ire-justify-center ire-gap-1.5 ire-rounded-full ire-px-2 ire-py-1 ire-text-xs ire-transition-all ire-duration-300 focus-visible:ire-outline focus-visible:ire-outline-2 focus-visible:ire-outline-offset-2 focus-visible:ire-outline-[var(--primary-color)] sm:ire-text-sm",
                        qe.value ? "ire-bg-white ire-text-gray-900 ire-shadow-sm" : "ire-bg-transparent ire-text-black hover:ire-bg-white hover:ire-text-black"
                      ]),
                      onClick: di[1] || (di[1] = (si) => qe.value = !0)
                    }, [
                      createVNode(TableIcon, {
                        class: normalizeClass(["ire-size-3.5 ire-shrink-0 ire-fill-transparent sm:ire-size-4 [&_path]:ire-stroke-current", qe.value ? "ire-text-gray-900" : "ire-text-black"])
                      }, null, 8, ["class"]),
                      createElementVNode("span", _hoisted_9$3, toDisplayString(unref(tr)("list view")), 1)
                    ], 10, _hoisted_8$3)
                  ], 8, _hoisted_5$3)
                ])) : createCommentVNode("", !0)
              ]),
              createVNode(_sfc_main$c, {
                "filters-object": Qe.value,
                "onUpdate:filtersObject": di[2] || (di[2] = (si) => Qe.value = si)
              }, null, 8, ["filters-object"])
            ]),
            ci.value.length ? (openBlock(), createBlock(Transition, {
              key: 0,
              name: "ire-fade-in-out",
              mode: "out-in"
            }, {
              default: withCtx(() => [
                qe.value ? (openBlock(), createBlock(_sfc_main$f, {
                  key: 0,
                  flats: ci.value,
                  onSortColumn: di[3] || (di[3] = (si, mi) => hi(si, mi)),
                  onOpenFlat: di[4] || (di[4] = (si) => ui(si))
                }, null, 8, ["flats"])) : (openBlock(), createElementBlock("div", _hoisted_10$2, [
                  (openBlock(!0), createElementBlock(Fragment, null, renderList(ci.value, (si) => (openBlock(), createBlock(_sfc_main$q, {
                    key: si.id,
                    flat: si,
                    onOpenFlat: di[5] || (di[5] = (mi) => ui(mi))
                  }, null, 8, ["flat"]))), 128))
                ]))
              ]),
              _: 1
            })) : (openBlock(), createElementBlock("div", _hoisted_11$2, toDisplayString(unref(tr)("nothing found")), 1)),
            (gi = ci.value) != null && gi.length && ni.value > 1 ? (openBlock(), createElementBlock("div", _hoisted_12$1, [
              createVNode(unref(script$1), {
                modelValue: We.value,
                "onUpdate:modelValue": [
                  di[6] || (di[6] = (si) => We.value = si),
                  fi
                ],
                pages: ni.value,
                "range-size": 1,
                "active-color": "#000000",
                class: "[&_.Page-active]:!ire-border-none [&_.Page-active]:!ire-text-white [&_button]:!ire-mx-0.5 [&_button]:!ire-my-0 [&_button]:!ire-rounded-full [&_button]:!ire-p-0 [&_button]:ire-transition-all [&_button]:hover:!ire-border-none hover:[&_button]:!ire-bg-gray-600 hover:[&_button]:!ire-text-white"
              }, null, 8, ["modelValue", "pages"])
            ])) : createCommentVNode("", !0),
            (openBlock(), createBlock(Teleport, { to: "body" }, [
              createVNode(Transition, {
                name: "ire-fade-in-out",
                appear: ""
              }, {
                default: withCtx(() => [
                  Je.value && ri.value ? (openBlock(), createBlock(_sfc_main$y, {
                    key: 0,
                    style: normalizeStyle(unref(ze)),
                    onClose: di[7] || (di[7] = (si) => Je.value = !1)
                  }, {
                    default: withCtx(() => [
                      createVNode(_sfc_main$z, { flat: ri.value }, null, 8, ["flat"])
                    ]),
                    _: 1
                  }, 8, ["style"])) : createCommentVNode("", !0)
                ]),
                _: 1
              })
            ]))
          ], 512)
        ];
      }),
      _: 1
    }));
  }
}), CLICK_DRAG_THRESHOLD = 4, PRELOAD_RADIUS = 3, AUTO_RELEASE_MS = 2e3, SVG_FLAT_FILTER_EASE_MS = 220, FLAT_FOCUS_CLASS = "ire-flat-focus";
function applySvgFlatFilterPresentation($e, _e, ke) {
  if (!ke) {
    $e.style.opacity === "0" || $e.style.pointerEvents === "none" ? ($e.style.transition = `opacity ${SVG_FLAT_FILTER_EASE_MS}ms ease`, $e.style.opacity = "1", $e.style.pointerEvents = "") : ($e.style.removeProperty("transition"), $e.style.removeProperty("opacity"), $e.style.removeProperty("pointer-events")), $e.style.removeProperty("display");
    return;
  }
  $e.style.transition = `opacity ${SVG_FLAT_FILTER_EASE_MS}ms ease`, _e ? ($e.style.opacity = "0", $e.style.pointerEvents = "none") : ($e.style.opacity = "1", $e.style.pointerEvents = "");
}
const mod = ($e, _e) => _e === 0 ? 0 : ($e % _e + _e) % _e, easeOutCubic = ($e) => 1 - Math.pow(1 - $e, 3);
function useProject360($e) {
  const {
    frames: _e,
    sensitivity: ke,
    snapDurationMs: Be,
    containerRef: Ne,
    canvasRef: Ve,
    svgRef: Le,
    onPolygonClick: De,
    svgFlatFilterActive: Ae,
    svgVisibleFlatIds: Ie
  } = $e, Re = useGlobalStore(), { shortcodeData: ze, flats: je } = storeToRefs(Re), Fe = computed(() => _e.value.length), He = ref(0), Ge = ref(0), qe = ref(0), Xe = ref(!1), Ye = ref(!1), We = ref(null), Je = ref(""), ri = ref(0), Qe = ref(0), ti = ref(0), ei = ref(0), Ze = ref(null);
  let Ue = null, Ke = null, ii = 0, oi = null, ni = null, pi = null, ci = null, fi = null, hi = null, ui = null;
  const ai = () => {
    ni = null, Re.hoverdSvg = void 0, We.value = null, Je.value = "", pi && (pi.classList.remove("ire-path-active"), pi = null);
  }, di = () => {
    oi !== null && (clearTimeout(oi), oi = null);
  }, gi = () => {
    Ke !== null && (cancelAnimationFrame(Ke), Ke = null);
  }, si = () => {
    Ue !== null && (cancelAnimationFrame(Ue), Ue = null), Ye.value = !1;
  }, mi = () => {
    si(), ii += 1;
  }, ki = /* @__PURE__ */ new Map(), Si = /* @__PURE__ */ new Map(), Ci = async (li) => {
    var Ei;
    if (ki.has(li)) return ki.get(li);
    if (Si.has(li)) return Si.get(li);
    const vi = (Ei = _e.value[li]) == null ? void 0 : Ei.img;
    if (!vi) return null;
    const bi = new Promise((Bi) => {
      const _i = new Image();
      _i.decoding = "async", _i.onload = () => {
        ki.set(li, _i), Bi(_i);
      }, _i.onerror = () => Bi(null), _i.src = vi;
    });
    Si.set(li, bi);
    try {
      return await bi;
    } finally {
      Si.delete(li);
    }
  }, Mi = (li, vi = PRELOAD_RADIUS) => {
    const bi = Fe.value;
    if (!(bi <= 0))
      for (let Ei = -vi; Ei <= vi; Ei++)
        Ci(mod(li + Ei, bi));
  }, yi = (li) => {
    const vi = Fe.value;
    if (!(vi <= 0))
      for (let bi = 0; bi < vi; bi++)
        Ci(mod(li + bi, vi)), bi > 0 && Ci(mod(li - bi, vi));
  }, Oi = (li) => {
    const vi = Ve.value, bi = Ne.value;
    if (!vi || !bi) return;
    const Ei = vi.getContext("2d");
    if (!Ei) return;
    const Bi = ki.get(li);
    if (!Bi) return;
    const _i = window.devicePixelRatio || 1, Ti = Math.max(1, Math.round(bi.clientWidth)), Pi = Math.max(1, Math.round(bi.clientHeight));
    (vi.width !== Ti * _i || vi.height !== Pi * _i) && (vi.width = Ti * _i, vi.height = Pi * _i);
    const Fi = Math.max(Ti / Bi.naturalWidth, Pi / Bi.naturalHeight), Wi = Bi.naturalWidth * Fi, Vi = Bi.naturalHeight * Fi, Ai = (Ti - Wi) / 2, qi = (Pi - Vi) / 2;
    Ei.clearRect(0, 0, vi.width, vi.height), Ei.drawImage(
      Bi,
      Math.round(Ai * _i),
      Math.round(qi * _i),
      Math.round(Wi * _i),
      Math.round(Vi * _i)
    );
  }, Ri = () => {
    Oi(Ge.value);
  }, Di = (li, vi = 0) => {
    si();
    const bi = ++ii, Ei = He.value, Bi = Fe.value;
    if (Bi <= 0) return;
    const _i = mod(li, Bi);
    if (Ei === _i) {
      ki.get(_i) ? (Ge.value = _i, Oi(_i), qe.value = _i) : Ci(_i).then((rr) => {
        bi === ii && !Xe.value && (Ge.value = _i, rr && Oi(_i), qe.value = _i);
      });
      return;
    }
    const Ti = mod(_i - Ei, Bi), Pi = Ti === 0 ? 0 : Ti - Bi;
    let Fi;
    vi > 0 ? Fi = Ti !== 0 ? Ti : Pi : vi < 0 ? Fi = Pi !== 0 ? Pi : Ti : Fi = Ti <= Math.abs(Pi) ? Ti : Pi;
    const Wi = Math.abs(Fi), Vi = Fi >= 0 ? 1 : -1;
    for (let Yi = 0; Yi <= Wi; Yi++)
      Ci(mod(Ei + Vi * Yi, Bi));
    ai(), Ye.value = !0;
    const Ai = Be.value, qi = performance.now(), Li = (Yi) => {
      if (bi !== ii) return;
      const rr = Yi - qi, cr = Ai <= 0 ? 1 : Math.min(1, rr / Ai), hr = easeOutCubic(cr), mr = Math.min(Wi, Math.round(Wi * hr));
      He.value = mod(Ei + Vi * mr, Bi), cr < 1 ? Ue = requestAnimationFrame(Li) : (He.value = _i, Ue = null, ki.get(_i) ? (Ge.value = _i, Oi(_i), qe.value = _i, Ye.value = !1) : Ci(_i).then((vr) => {
        bi !== ii || Xe.value || (Ge.value = _i, vr && Oi(_i), qe.value = _i, Ye.value = !1);
      }));
    };
    Ue = requestAnimationFrame(Li);
  }, zi = (li) => {
    var Fi, Wi;
    const vi = _e.value, bi = He.value, Ei = Fe.value;
    if (Ei <= 0) return;
    const Bi = [];
    for (let Vi = 0; Vi < vi.length; Vi++)
      (Wi = (Fi = vi[Vi]) == null ? void 0 : Fi.polygon_data) != null && Wi.length && Bi.push(Vi);
    if (!Bi.length) return;
    const _i = (Vi) => mod(Vi - bi, Ei), Ti = (Vi) => mod(bi - Vi, Ei), Pi = (Vi) => {
      let Ai = bi, qi = 1 / 0;
      for (const Li of Bi) {
        if (Li === bi) continue;
        const Yi = Math.min(_i(Li), Ti(Li));
        Yi < qi && (qi = Yi, Ai = Li);
      }
      return Ai;
    };
    if (li > 0) {
      const Vi = Bi.filter(
        (Ai) => Ai !== bi && _i(Ai) > 0
      );
      if (Vi.length) {
        const Ai = Vi.reduce(
          (qi, Li) => _i(qi) <= _i(Li) ? qi : Li
        );
        Di(Ai, li);
        return;
      }
      Di(Pi(), li);
      return;
    }
    if (li < 0) {
      const Vi = Bi.filter(
        (Ai) => Ai !== bi && Ti(Ai) > 0
      );
      if (Vi.length) {
        const Ai = Vi.reduce(
          (qi, Li) => Ti(qi) <= Ti(Li) ? qi : Li
        );
        Di(Ai, li);
        return;
      }
      Di(Pi(), li);
      return;
    }
    Di(Pi(), li);
  }, $i = computed(() => {
    var bi;
    const li = _e.value, vi = new Array(
      li.length
    );
    for (let Ei = 0; Ei < li.length; Ei++) {
      const Bi = /* @__PURE__ */ new Map(), _i = ((bi = li[Ei]) == null ? void 0 : bi.polygon_data) ?? [];
      for (const Ti of _i)
        Ti != null && Ti.key && Bi.set(Ti.key, Ti);
      vi[Ei] = Bi;
    }
    return vi;
  }), Ii = () => $i.value[qe.value] ?? null, xi = (li) => {
    var Bi;
    const vi = _e.value, bi = String(li), Ei = [];
    for (let _i = 0; _i < vi.length; _i++) {
      const Ti = ((Bi = vi[_i]) == null ? void 0 : Bi.polygon_data) ?? [];
      for (const Pi of Ti)
        if ((Pi == null ? void 0 : Pi.type) === "flat" && String(Pi.id) === bi && Pi.key) {
          Ei.push({ frameIndex: _i, key: Pi.key });
          break;
        }
    }
    return Ei;
  }, wi = (li, vi) => {
    const bi = Fe.value;
    if (!li.length || bi <= 0) return null;
    let Ei = li[0], Bi = 1 / 0;
    for (const _i of li) {
      const Ti = mod(_i.frameIndex - vi, bi), Pi = mod(vi - _i.frameIndex, bi), Fi = Math.min(Ti, Pi);
      Fi < Bi && (Bi = Fi, Ei = _i);
    }
    return Ei;
  }, Ni = computed(() => {
    var vi;
    const li = /* @__PURE__ */ new Map();
    for (const bi of ((vi = ze.value) == null ? void 0 : vi.floors) ?? []) li.set(bi.id, bi);
    return li;
  }), ji = computed(() => {
    var vi;
    const li = /* @__PURE__ */ new Map();
    for (const bi of ((vi = ze.value) == null ? void 0 : vi.blocks) ?? []) li.set(bi.id, bi);
    return li;
  }), Hi = computed(() => {
    const li = /* @__PURE__ */ new Map();
    for (const vi of je.value ?? []) li.set(vi.id, vi);
    return li;
  }), Ui = computed(() => {
    var vi;
    const li = /* @__PURE__ */ new Map();
    for (const bi of ((vi = ze.value) == null ? void 0 : vi.actions) ?? []) li.set(bi.id, bi);
    return li;
  }), Gi = () => {
    const li = Le.value;
    if (!li) return;
    const vi = (Ae == null ? void 0 : Ae.value) ?? !1, bi = Ie == null ? void 0 : Ie.value, Ei = !!(vi && bi);
    Ei && fi !== null && (clearTimeout(fi), fi = null);
    const Bi = li.querySelector("svg");
    Bi && (Bi.setAttribute("width", "100%"), Bi.setAttribute("height", "100%"), Bi.setAttribute("preserveAspectRatio", "xMidYMid slice"), Bi.style.width = "100%", Bi.style.height = "100%");
    const _i = Ii();
    li.querySelectorAll("g").forEach((Pi) => {
      const Fi = Pi, Wi = Pi.getAttribute("id"), Vi = Wi && _i ? _i.get(Wi) : void 0;
      if (!(Vi != null && Vi.type)) {
        Pi.removeAttribute("polygon-type"), Pi.removeAttribute("conf"), applySvgFlatFilterPresentation(Fi, !0, Ei);
        return;
      }
      let Ai = "";
      switch (Vi.type) {
        case "floor": {
          const Li = Ni.value.get(Vi.id);
          Ai = getConfValue((Li == null ? void 0 : Li.conf) || "");
          break;
        }
        case "block": {
          const Li = ji.value.get(Vi.id);
          Li && Pi.setAttribute("polygon-type", Vi.type), Ai = getConfValue((Li == null ? void 0 : Li.conf) || "");
          break;
        }
        case "flat": {
          const Li = Hi.value.get(Vi.id);
          Li && Pi.setAttribute("polygon-type", Vi.type), Ai = getConfValue((Li == null ? void 0 : Li.conf) || "");
          break;
        }
        default:
          Ai = "";
      }
      Pi.setAttribute("conf", Ai || "");
      const qi = Vi.type === "flat" && (!!(bi != null && bi.has(String(Vi.id))) || Fi.classList.contains(FLAT_FOCUS_CLASS));
      applySvgFlatFilterPresentation(Fi, !qi, Ei);
    }), Ei || (fi !== null && clearTimeout(fi), fi = window.setTimeout(() => {
      fi = null;
      const Pi = Le.value;
      Pi && Pi.querySelectorAll("g").forEach((Fi) => {
        const Wi = Fi;
        Wi.style.removeProperty("transition"), Wi.style.removeProperty("opacity"), Wi.style.removeProperty("pointer-events");
      });
    }, SVG_FLAT_FILTER_EASE_MS + 40));
  }, Xi = () => {
    hi && (hi.classList.remove(FLAT_FOCUS_CLASS), hi.style.removeProperty("opacity"), hi.style.removeProperty("pointer-events"), hi = null), nextTick$1(() => Gi());
  }, Ji = (li) => {
    hi && hi !== li && (hi.classList.remove(FLAT_FOCUS_CLASS), hi.style.removeProperty("opacity"), hi.style.removeProperty("pointer-events")), li.classList.add(FLAT_FOCUS_CLASS), hi = li, nextTick$1(() => Gi());
  }, Ki = () => {
    const li = ui;
    if (!li || Xe.value || Ye.value || qe.value !== li.frameIndex || He.value !== li.frameIndex)
      return;
    const vi = Le.value;
    if (!vi) return;
    const bi = typeof CSS < "u" && "escape" in CSS ? CSS.escape(li.gKey) : li.gKey.replace(/\\/g, "\\\\").replace(/"/g, '\\"'), Ei = vi.querySelector(`g#${bi}`);
    if (!Ei) {
      ui = null;
      return;
    }
    ui = null, Ji(Ei);
  }, ir = (li) => {
    if (!li) return;
    ui = null, Xi();
    const vi = xi(li);
    if (!vi.length)
      return;
    const bi = wi(vi, He.value);
    bi && (ui = {
      frameIndex: bi.frameIndex,
      gKey: bi.key,
      flatId: String(li)
    }, Di(bi.frameIndex, 0), nextTick$1(() => {
      nextTick$1(() => Ki());
    }));
  }, dr = (li) => {
    const vi = Le.value;
    vi && (vi.style.pointerEvents = "auto");
    const bi = document.elementFromPoint(
      li.clientX,
      li.clientY
    );
    vi && (vi.style.pointerEvents = "");
    const Ei = bi == null ? void 0 : bi.closest("g[polygon-type]");
    if (!Ei) return;
    const Bi = Ei.getAttribute("id"), _i = Ii(), Ti = Bi && _i ? _i.get(Bi) ?? null : null;
    Ti != null && Ti.type && (Ti.type === "flat" && (Je.value = "flat", We.value = Hi.value.get(Ti.id) ?? null), pi && (pi.classList.remove("ire-path-active"), pi = null), De == null || De(Ti, Ti.type));
  }, or = (li) => {
    var Ti;
    if (Xe.value || Ye.value) return;
    const vi = (li == null ? void 0 : li.target) ?? null;
    if (!vi || vi.nodeName !== "path") {
      ni && ai();
      return;
    }
    const bi = vi;
    if (ni === bi) return;
    ni = bi, Re.hoverdSvg = bi;
    const Ei = bi.parentElement;
    if (!Ei || Ei.nodeName !== "g") {
      ai();
      return;
    }
    const Bi = Ei.getAttribute("id");
    if (!Bi) {
      ai();
      return;
    }
    const _i = (Ti = Ii()) == null ? void 0 : Ti.get(Bi);
    if (!(_i != null && _i.type)) {
      ai();
      return;
    }
    switch (Je.value = _i.type, _i.type) {
      case "floor":
        We.value = Ni.value.get(_i.id) ?? null;
        break;
      case "block":
        We.value = ji.value.get(_i.id) ?? null;
        break;
      case "flat":
        We.value = Hi.value.get(_i.id) ?? null;
        break;
      case "tooltip":
        We.value = Ui.value.get(_i.id) ?? null;
        break;
      default:
        We.value = null;
        break;
    }
  };
  let Qi = !1;
  const ur = () => {
    if (Ke = null, !Xe.value) return;
    const li = ei.value - ri.value;
    ti.value = Math.max(ti.value, Math.abs(li));
    const vi = ke.value > 0 ? ke.value : 12, bi = Fe.value;
    if (bi <= 0) return;
    const Ei = Math.round(-li / vi);
    He.value = mod(Qe.value + Ei, bi);
  }, nr = (li) => {
    if (!Qi) return;
    li.preventDefault(), ei.value = li.clientX;
    const vi = Math.abs(li.clientX - ri.value);
    ti.value = Math.max(ti.value, vi), !Xe.value && vi >= CLICK_DRAG_THRESHOLD && (Xe.value = !0, ai()), Xe.value && Ke === null && (Ke = requestAnimationFrame(ur));
  }, sr = () => {
    window.removeEventListener("pointermove", nr), window.removeEventListener("pointerup", er), window.removeEventListener("pointercancel", er);
  }, ar = () => {
    var vi;
    const li = Ze.value;
    if (li !== null)
      try {
        (vi = Ne.value) == null || vi.releasePointerCapture(li);
      } catch {
      }
  }, lr = (li, vi) => {
    if (!Qi) return;
    gi(), li !== ei.value && (ei.value = li);
    const bi = Xe.value;
    if (Qi = !1, Xe.value = !1, di(), sr(), ar(), Ze.value = null, bi) {
      ai();
      const Ei = ke.value > 0 ? ke.value : 12, Bi = ei.value - ri.value, _i = Fe.value, Ti = Math.round(-Bi / (Ei > 0 ? Ei : 12)), Pi = Ti === 0 ? 0 : Ti > 0 ? 1 : -1;
      _i > 0 && (He.value = mod(Qe.value + Ti, _i)), zi(Pi);
    } else vi && dr(vi);
  };
  function er(li) {
    lr(li.clientX, li);
  }
  const fr = (li) => {
    var vi;
    if (li.button === 0) {
      if (li.preventDefault(), mi(), gi(), ui = null, Xi(), Qi = !0, ei.value = li.clientX, Ze.value = li.pointerId, ri.value = li.clientX, Qe.value = He.value, ti.value = 0, Ci(He.value), Mi(He.value), di(), oi = window.setTimeout(() => {
        lr(ei.value);
      }, AUTO_RELEASE_MS), window.addEventListener("pointermove", nr, { passive: !1 }), window.addEventListener("pointerup", er), window.addEventListener("pointercancel", er), ni) {
        const bi = ni.parentElement;
        bi && bi.nodeName === "g" && (pi = bi, bi.classList.add("ire-path-active"));
      }
      try {
        (vi = Ne.value) == null || vi.setPointerCapture(li.pointerId);
      } catch {
      }
    }
  }, pr = computed(
    () => {
      var li;
      return ((li = _e.value[qe.value]) == null ? void 0 : li.svg) ?? "";
    }
  );
  return watch(
    () => [Xe.value, Ye.value],
    ([li, vi]) => {
      (li || vi) && ai();
    }
  ), watch(
    () => He.value,
    (li) => {
      if (Mi(li, PRELOAD_RADIUS), ki.has(li)) {
        Ge.value = li, Oi(li);
        return;
      }
      Ci(li).then((vi) => {
        He.value === li && (Ge.value = li, vi && Oi(li));
      });
    },
    { flush: "post" }
  ), watch(
    () => [Xe.value, Ye.value, He.value],
    ([li, vi, bi]) => {
      !li && !vi && (qe.value = bi);
    }
  ), watch(
    () => qe.value,
    () => {
      Xi(), ai(), nextTick$1(() => {
        Gi(), nextTick$1(() => Ki());
      });
    }
  ), watch(
    () => Ye.value,
    (li) => {
      li || nextTick$1(() => Ki());
    }
  ), watch(
    () => _e.value,
    () => {
      const li = Fe.value;
      li <= 0 || (He.value = mod(He.value, li), Ge.value = mod(Ge.value, li), qe.value = mod(qe.value, li), Mi(Ge.value, PRELOAD_RADIUS), Ci(Ge.value).then((vi) => {
        vi && Oi(Ge.value);
      }), nextTick$1(() => Gi()));
    }
  ), Ae && Ie && watch(
    () => [
      Ae.value,
      Ie.value,
      qe.value,
      _e.value
    ],
    () => {
      nextTick$1(() => Gi());
    }
  ), onMounted(() => {
    Ge.value = He.value, qe.value = He.value, Ci(He.value).then((li) => {
      li && Oi(He.value), yi(He.value);
    }), Mi(He.value, PRELOAD_RADIUS), Ne.value && (ci = new ResizeObserver(Ri), ci.observe(Ne.value)), nextTick$1(() => Gi()), document.addEventListener("mousemove", or);
  }), onUnmounted(() => {
    fi !== null && (clearTimeout(fi), fi = null), ui = null, Xi(), mi(), gi(), di(), sr(), ar(), ci == null || ci.disconnect(), ci = null, document.removeEventListener("mousemove", or), ai();
  }), {
    total: Fe,
    frame: He,
    renderFrame: Ge,
    settledFrame: qe,
    isDragging: Xe,
    isAnimating: Ye,
    hoveredData: We,
    activePolygonType: Je,
    currentSvg: pr,
    onPointerDown: fr,
    snapToNearestWithPolygons: zi,
    focusFlatOnViewer: ir
  };
}
const _hoisted_1$8 = { class: "irep-navigation-arrows ire-absolute ire-bottom-4 ire-left-1/2 ire-z-10 ire-flex -ire-translate-x-1/2 ire-items-center ire-gap-3 ire-rounded-xl ire-bg-white/20 ire-px-6 ire-py-4" }, _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "NavigationArrows",
  emits: ["prev", "next"],
  setup($e) {
    return (_e, ke) => (openBlock(), createElementBlock("div", _hoisted_1$8, [
      createElementVNode("div", {
        class: "irep-navigation-arrows__prev ire-flex ire-h-12 ire-w-12 ire-cursor-pointer ire-items-center ire-justify-center ire-rounded-xl ire-bg-white/70 ire-shadow-md ire-backdrop-blur-sm ire-transition hover:ire-bg-white",
        onPointerdown: ke[0] || (ke[0] = withModifiers(() => {
        }, ["stop"])),
        onClick: ke[1] || (ke[1] = withModifiers((Be) => _e.$emit("prev"), ["stop"]))
      }, [...ke[4] || (ke[4] = [
        createElementVNode("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: "20",
          height: "20",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2.5",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }, [
          createElementVNode("path", { d: "M19 12H5M12 19l-7-7 7-7" })
        ], -1)
      ])], 32),
      createElementVNode("div", {
        class: "irep-navigation-arrows__next ire-flex ire-h-12 ire-w-12 ire-cursor-pointer ire-items-center ire-justify-center ire-rounded-xl ire-bg-white/70 ire-shadow-md ire-backdrop-blur-sm ire-transition hover:ire-bg-white",
        onPointerdown: ke[2] || (ke[2] = withModifiers(() => {
        }, ["stop"])),
        onClick: ke[3] || (ke[3] = withModifiers((Be) => _e.$emit("next"), ["stop"]))
      }, [...ke[5] || (ke[5] = [
        createElementVNode("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: "20",
          height: "20",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2.5",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }, [
          createElementVNode("path", { d: "M5 12h14M12 5l7 7-7 7" })
        ], -1)
      ])], 32)
    ]));
  }
}), _hoisted_1$7 = { class: "irep-flats-sidebar-header ire-grid ire-gap-2 ire-bg-gray-50 ire-p-4 ire-pt-0 md:ire-grid-cols-2" }, _hoisted_2$3 = { class: "irep-flats-sidebar-header__select-wrapper ire-flex ire-w-full ire-items-end" }, _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "FlatsSidebarHeader",
  props: /* @__PURE__ */ mergeModels({
    hideFloorRange: { type: Boolean }
  }, {
    filtersObject: { required: !0 },
    filtersObjectModifiers: {}
  }),
  emits: ["update:filtersObject"],
  setup($e) {
    const _e = useGlobalStore(), ke = useModel($e, "filtersObject"), Be = $e, Ne = computed(() => {
      var Fe;
      const je = (((Fe = _e.shortcodeData) == null ? void 0 : Fe.floors) ?? []).map((He) => Number(He.floor_number)).filter((He) => Number.isFinite(He));
      return je.length ? {
        min: Math.min(...je),
        max: Math.max(...je)
      } : { min: 0, max: 16 };
    }), Ve = normalizeFilterOptionsMeta(
      _e.getMetaValue("filter_options")
    ), Le = normalizeRangeOption(
      Ve.area_filter_options,
      {
        min: 0,
        max: 300,
        step: 10
      }
    ), De = normalizeRangeOption(
      Ve.rooms_filter_options,
      {
        min: 0,
        max: 10,
        step: 1
      }
    ), Ae = _e.getMetaValue("custom_types"), Ie = Array.isArray(Ae) ? Ae.map((ze) => ({
      title: tr(ze.title),
      value: ze.value
    })) : [], Re = [
      { title: tr("all"), value: "all" },
      { title: tr("available"), value: "available" },
      { title: tr("reserved"), value: "reserved" },
      { title: tr("sold"), value: "sold" },
      ...Ie
    ];
    return (ze, je) => {
      var Fe, He, Ge, qe, Xe, Ye;
      return openBlock(), createElementBlock("div", _hoisted_1$7, [
        createVNode(_sfc_main$e, {
          modelValue: ke.value.areaRange,
          "onUpdate:modelValue": je[0] || (je[0] = (We) => ke.value.areaRange = We),
          min: ((Fe = unref(Le)) == null ? void 0 : Fe.min) || 0,
          max: ((He = unref(Le)) == null ? void 0 : He.max) || 300,
          step: ((Ge = unref(Le)) == null ? void 0 : Ge.step) || 1,
          unit: `${unref(getAreaUnitLabel)()}²`,
          label: "area",
          class: "md:ire-min-w-[unset]"
        }, null, 8, ["modelValue", "min", "max", "step", "unit"]),
        !Be.hideFloorRange && Number.isFinite(Ne.value.min) && Number.isFinite(Ne.value.max) ? (openBlock(), createBlock(_sfc_main$e, {
          key: 0,
          modelValue: ke.value.floorRange,
          "onUpdate:modelValue": je[1] || (je[1] = (We) => ke.value.floorRange = We),
          min: Ne.value.min,
          max: Ne.value.max,
          step: 1,
          unit: "",
          label: "floor",
          class: "md:ire-min-w-[unset]"
        }, null, 8, ["modelValue", "min", "max"])) : createCommentVNode("", !0),
        createVNode(_sfc_main$e, {
          modelValue: ke.value.roomRange,
          "onUpdate:modelValue": je[2] || (je[2] = (We) => ke.value.roomRange = We),
          min: ((qe = unref(De)) == null ? void 0 : qe.min) || 0,
          max: ((Xe = unref(De)) == null ? void 0 : Xe.max) || 10,
          step: ((Ye = unref(De)) == null ? void 0 : Ye.step) || 1,
          unit: "",
          label: "rooms",
          class: "md:ire-min-w-[unset]"
        }, null, 8, ["modelValue", "min", "max", "step"]),
        createElementVNode("div", _hoisted_2$3, [
          createVNode(_sfc_main$15, {
            modelValue: ke.value.config,
            "onUpdate:modelValue": je[3] || (je[3] = (We) => ke.value.config = We),
            data: Re,
            disabled: !1,
            class: "irep-flats-list-filters-select"
          }, null, 8, ["modelValue"])
        ])
      ]);
    };
  }
}), _hoisted_1$6 = ["aria-checked", "aria-disabled", "disabled", "aria-label", "title"], _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "Toggle",
  props: /* @__PURE__ */ mergeModels({
    ariaLabel: { default: "Toggle" },
    title: {},
    disabled: { type: Boolean, default: !1 }
  }, {
    modelValue: { type: Boolean, default: !1 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup($e) {
    const _e = useModel($e, "modelValue"), ke = $e;
    return (Be, Ne) => (openBlock(), createElementBlock("div", {
      role: "switch",
      "aria-checked": _e.value,
      "aria-disabled": ke.disabled,
      disabled: ke.disabled,
      "aria-label": ke.ariaLabel,
      title: ke.title,
      class: normalizeClass([
        "irep-toggle ire-group/toggle ire-relative ire-inline-flex ire-h-[22px] ire-w-[40px] ire-shrink-0 ire-cursor-pointer ire-items-center ire-rounded-full ire-border-0 ire-p-0 ire-transition-[background-color,box-shadow] ire-duration-300 ire-ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:ire-outline-none focus-visible:ire-ring-2 focus-visible:ire-ring-[var(--primary-color)] focus-visible:ire-ring-offset-2 focus-visible:ire-ring-offset-white disabled:ire-cursor-not-allowed disabled:ire-opacity-40",
        _e.value ? "ire-bg-[var(--primary-color)] ire-shadow-[inset_0_1px_1px_rgba(255,255,255,0.22)]" : "ire-bg-slate-200 ire-shadow-[inset_0_1px_2px_rgba(15,23,42,0.08)] hover:ire-bg-slate-300/95"
      ]),
      onClick: Ne[0] || (Ne[0] = (Ve) => !ke.disabled && (_e.value = !_e.value))
    }, [
      createElementVNode("span", {
        "aria-hidden": "true",
        class: normalizeClass(["irep-toggle__thumb ire-pointer-events-none ire-absolute ire-left-[3px] ire-top-1/2 ire-block ire-size-[14px] -ire-translate-y-1/2 ire-rounded-full ire-bg-white ire-shadow-[0_1px_2px_rgba(15,23,42,0.15),0_1px_1px_rgba(15,23,42,0.06)] ire-ring-1 ire-ring-white/90 ire-transition-[transform,box-shadow] ire-duration-300 ire-ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/toggle:ire-shadow-[0_2px_5px_rgba(15,23,42,0.14),0_1px_2px_rgba(15,23,42,0.06)]", _e.value ? "ire-translate-x-[20px]" : "ire-translate-x-0"])
      }, null, 2)
    ], 10, _hoisted_1$6));
  }
}), _sfc_main$6 = {}, _hoisted_1$5 = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "#000000",
  width: "800px",
  height: "800px",
  viewBox: "0 0 32 32",
  version: "1.1",
  webcrx: ""
};
function _sfc_render$2($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$5, [..._e[0] || (_e[0] = [
    createElementVNode("title", null, "house", -1),
    createElementVNode("path", { d: "M0 16h4l12-13.696 12 13.696h4l-13.984-16h-4zM4 32h8v-9.984q0-0.832 0.576-1.408t1.44-0.608h4q0.8 0 1.408 0.608t0.576 1.408v9.984h8v-13.408l-12-13.248-12 13.248v13.408zM26.016 6.112l4 4.576v-8.672h-4v4.096z" }, null, -1)
  ])]);
}
const HomeIcon = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$2]]), _hoisted_1$4 = { class: "irep-flats-sidebar ire-flex ire-h-full ire-flex-col ire-bg-white" }, _hoisted_2$2 = { class: "irep-flats-sidebar__count" }, _hoisted_3$2 = { class: "ire-text-lg ire-font-medium" }, _hoisted_4$2 = { class: "ire-ml-1 ire-inline-block ire-text-sm ire-capitalize" }, _hoisted_5$2 = {
  key: 0,
  class: "irep-flats-sidebar__filter-actions ire-flex ire-items-center ire-gap-2"
}, _hoisted_6$2 = {
  key: 0,
  class: "irep-flats-sidebar__empty ire-flex ire-flex-col ire-items-center ire-justify-center ire-gap-2 ire-py-16 ire-text-gray-400"
}, _hoisted_7$2 = { class: "ire-text-sm ire-font-medium ire-text-black" }, _hoisted_8$2 = {
  key: 1,
  class: "irep-flats-sidebar__list"
}, _hoisted_9$2 = { class: "irep-flats-sidebar__grid ire-grid ire-grid-cols-2 ire-gap-4 ire-p-4" }, _hoisted_10$1 = ["onClick", "onKeydown"], _hoisted_11$1 = ["onClick", "onKeydown"], _hoisted_12 = { class: "irep-flats-sidebar__item-badge ire-absolute ire-left-2 ire-top-2 ire-z-10 ire-w-fit" }, _hoisted_13 = {
  key: 0,
  class: "irep-flats-sidebar__item-image-wrapper ire-relative ire-w-full ire-pt-[85%]"
}, _hoisted_14 = ["src"], _hoisted_15 = { class: "irep-flats-sidebar__item-info ire-mt-2 ire-flex-1 ire-text-sm" }, _hoisted_16 = { class: "irep-flats-sidebar__item-number ire-font-semibold" }, _hoisted_17 = { class: "irep-flats-sidebar__item-attrs ire-mt-1 ire-grid ire-grid-cols-2 ire-gap-2" }, _hoisted_18 = {
  key: 0,
  class: "irep-flats-sidebar__item-area ire-group/sbArea focus-visible:ire-ring-[var(--primary-color)]/40 ire-relative ire-flex ire-items-center ire-gap-1 ire-rounded-lg ire-px-1 ire-py-0.5 ire-outline-none ire-transition-colors focus-visible:ire-ring-2",
  tabindex: "-1"
}, _hoisted_19 = {
  class: "irep-flats-sidebar__tooltip ease-out ire-pointer-events-none ire-absolute ire-bottom-full ire-left-1/2 ire-z-30 ire-mb-1 ire-min-w-0 -ire-translate-x-1/2 ire-translate-y-px ire-rounded-md ire-border ire-border-gray-200/80 ire-bg-white ire-px-2 ire-py-1 ire-text-center ire-opacity-0 ire-shadow-sm ire-transition-all ire-duration-150 group-hover/sbArea:ire-translate-y-0 group-hover/sbArea:ire-opacity-100",
  role: "tooltip"
}, _hoisted_20 = { class: "irep-flats-sidebar__tooltip-text ire-whitespace-nowrap ire-text-xs ire-font-medium ire-text-gray-700" }, _hoisted_21 = { class: "ire-text-xs ire-font-medium" }, _hoisted_22 = {
  key: 1,
  class: "irep-flats-sidebar__item-rooms ire-group/sbRooms focus-visible:ire-ring-[var(--primary-color)]/40 ire-relative ire-flex ire-items-center ire-gap-1 ire-rounded-lg ire-px-1 ire-py-0.5 ire-outline-none ire-transition-colors focus-visible:ire-ring-2",
  tabindex: "-1"
}, _hoisted_23 = {
  class: "irep-flats-sidebar__tooltip ease-out ire-pointer-events-none ire-absolute ire-bottom-full ire-left-1/2 ire-z-30 ire-mb-1 ire-min-w-0 -ire-translate-x-1/2 ire-translate-y-px ire-rounded-md ire-border ire-border-gray-200/80 ire-bg-white ire-px-2 ire-py-1 ire-text-center ire-opacity-0 ire-shadow-sm ire-transition-all ire-duration-150 group-hover/sbRooms:ire-translate-y-0 group-hover/sbRooms:ire-opacity-100",
  role: "tooltip"
}, _hoisted_24 = { class: "irep-flats-sidebar__tooltip-text ire-whitespace-nowrap ire-text-xs ire-font-medium ire-text-gray-700" }, _hoisted_25 = { class: "ire-text-xs ire-font-medium" }, _hoisted_26 = {
  key: 2,
  class: "irep-flats-sidebar__item-floor ire-group/sbFloor focus-visible:ire-ring-[var(--primary-color)]/40 ire-relative ire-flex ire-items-center ire-gap-1 ire-rounded-lg ire-px-1 ire-py-0.5 ire-outline-none ire-transition-colors focus-visible:ire-ring-2",
  tabindex: "-1"
}, _hoisted_27 = {
  class: "irep-flats-sidebar__tooltip ease-out ire-pointer-events-none ire-absolute ire-bottom-full ire-left-1/2 ire-z-30 ire-mb-1 ire-min-w-0 -ire-translate-x-1/2 ire-translate-y-px ire-rounded-md ire-border ire-border-gray-200/80 ire-bg-white ire-px-2 ire-py-1 ire-text-center ire-opacity-0 ire-shadow-sm ire-transition-all ire-duration-150 group-hover/sbFloor:ire-translate-y-0 group-hover/sbFloor:ire-opacity-100",
  role: "tooltip"
}, _hoisted_28 = { class: "irep-flats-sidebar__tooltip-text ire-whitespace-nowrap ire-text-xs ire-font-medium ire-text-gray-700" }, _hoisted_29 = { class: "ire-text-xs ire-font-medium" }, _hoisted_30 = {
  key: 0,
  class: "irep-flats-sidebar__load-more-wrapper ire-flex ire-px-4 ire-pb-2"
}, _hoisted_31 = { class: "ire-ml-1 ire-text-gray-400" }, PAGE_SIZE = 20, _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "FlatsSidebar",
  props: /* @__PURE__ */ mergeModels({
    activeView: {},
    floors360FloorId: {},
    floors360BlockId: {}
  }, {
    showOnlyFilteredOnSvg: { type: Boolean, default: !1 },
    showOnlyFilteredOnSvgModifiers: {}
  }),
  emits: /* @__PURE__ */ mergeModels(["update:filteredFlatIds"], ["update:showOnlyFilteredOnSvg"]),
  setup($e, { emit: _e }) {
    const ke = useGlobalStore(), { getMetaValue: Be } = ke, { flats: Ne, shortcodeData: Ve } = storeToRefs(ke), Le = useModel($e, "showOnlyFilteredOnSvg"), De = $e, Ae = _e, Ie = inject("activateFlat", () => {
    }), Re = inject(
      "focusFlatOnViewer",
      () => {
      }
    ), ze = (ai) => {
      Ie(ai);
    }, je = computed(() => {
      var gi;
      const di = (((gi = Ve.value) == null ? void 0 : gi.floors) ?? []).map((si) => Number(si.floor_number)).filter((si) => Number.isFinite(si));
      return di.length ? {
        min: Math.min(...di),
        max: Math.max(...di)
      } : { min: 0, max: 16 };
    }), Fe = computed(
      () => ke.getMetaValue("paths_hover_fill") === "true"
    ), He = normalizeFilterOptionsMeta(
      Be("filter_options")
    ), Ge = normalizeRangeOption(
      He.area_filter_options,
      {
        min: 0,
        max: 300,
        step: 10
      }
    ), qe = normalizeRangeOption(
      He.rooms_filter_options,
      {
        min: 0,
        max: 10,
        step: 1
      }
    ), Xe = ref({
      areaRange: [Ge.min, Ge.max],
      floorRange: [je.value.min, je.value.max],
      roomRange: [qe.min, qe.max],
      config: "all"
    }), Ye = computed(() => ({
      areaRange: [Ge.min, Ge.max],
      floorRange: [je.value.min, je.value.max],
      roomRange: [qe.min, qe.max],
      config: "all"
    })), We = computed(() => {
      const ai = Ye.value, di = Xe.value;
      return JSON.stringify(di.areaRange) !== JSON.stringify(ai.areaRange) || JSON.stringify(di.floorRange) !== JSON.stringify(ai.floorRange) || JSON.stringify(di.roomRange) !== JSON.stringify(ai.roomRange) || di.config !== ai.config;
    }), Je = computed(
      () => Xe.value.floorRange[0] !== je.value.min || Xe.value.floorRange[1] !== je.value.max
    ), ri = computed(
      () => Xe.value.areaRange[0] !== Ge.min || Xe.value.areaRange[1] !== Ge.max
    ), Qe = computed(
      () => Xe.value.roomRange[0] !== qe.min || Xe.value.roomRange[1] !== qe.max
    ), ti = () => {
      Xe.value = { ...Ye.value };
    }, ei = ref(null), Ze = ref(!1), Ue = () => {
      const ai = ei.value;
      ai && (Ze.value = ai.scrollTop > 0);
    }, Ke = computed(() => {
      if (Ve.value)
        return Ve.value.types;
    }), ii = (ai) => {
      var di, gi, si, mi, ki, Si;
      return ((si = (gi = (di = ai.type) == null ? void 0 : di.image_2d) == null ? void 0 : gi[0]) == null ? void 0 : si.url) || ((Si = (ki = (mi = ai.type) == null ? void 0 : mi.image_3d) == null ? void 0 : ki[0]) == null ? void 0 : Si.url) || "";
    }, oi = (ai) => {
      var di, gi;
      return ((gi = (di = getFloorById(+(ai == null ? void 0 : ai.floor_id))) == null ? void 0 : di.floor_number) == null ? void 0 : gi.toString()) ?? "";
    }, ni = computed(() => De.activeView === "floors"), pi = computed(() => {
      const ai = Ne.value ?? [];
      if (!ai.length) return [];
      const [di, gi] = Xe.value.areaRange, [si, mi] = Xe.value.floorRange, [ki, Si] = Xe.value.roomRange, Ci = Xe.value.config ?? "all", Mi = (yi) => parseFloat(String(yi).trim().replace(",", "."));
      return ai.filter((yi) => {
        var Ni, ji, Hi, Ui, Gi;
        const Oi = Number(((Ni = yi.type) == null ? void 0 : Ni.area_m2_n) ?? ((ji = yi.type) == null ? void 0 : ji.area_m2)), Ri = Number((Hi = getFloorById(yi.floor_id)) == null ? void 0 : Hi.floor_number), Di = Mi(
          ((Gi = (Ui = yi.type) == null ? void 0 : Ui.rooms_count) == null ? void 0 : Gi.toString()) || "0"
        ), zi = !ri.value || (Number.isFinite(Oi) ? Oi >= di && Oi <= gi : !1);
        let $i;
        ni.value ? $i = De.floors360FloorId != null ? yi.floor_id === De.floors360FloorId : !0 : $i = !Je.value || (Number.isFinite(Ri) ? Ri >= si && Ri <= mi : !1);
        const Ii = ni.value ? De.floors360BlockId != null ? yi.block_id === De.floors360BlockId : !yi.block_id : !0, xi = !Qe.value || Number.isFinite(Di) && Di >= ki && Di <= Si;
        let wi = !0;
        if (Ci !== "all")
          if (Ci === "available")
            wi = !yi.conf;
          else {
            const Xi = Be("custom_types"), Ji = Array.isArray(Xi) ? Xi.find(
              (Ki) => Ki.value === Ci
            ) : null;
            Ji ? wi = yi.conf === Ji.title : wi = yi.conf === Ci;
          }
        return zi && $i && Ii && xi && wi;
      }).map((yi) => {
        var Di;
        if (yi != null && yi.use_type || !(yi != null && yi.type)) {
          const zi = (Di = Ke.value) == null ? void 0 : Di.find(
            ($i) => ($i == null ? void 0 : $i.id) === (yi == null ? void 0 : yi.type_id)
          );
          zi && (yi.type = zi);
        }
        const Oi = Be("custom_types"), Ri = Oi == null ? void 0 : Oi.find((zi) => zi.value === yi.conf);
        return yi.conf = Ri ? Ri.title : yi.conf, yi;
      });
    });
    watch(
      pi,
      (ai) => {
        Ae(
          "update:filteredFlatIds",
          new Set(ai.map((di) => String(di.id)))
        );
      },
      { deep: !0, immediate: !0 }
    ), watch(
      () => We.value,
      () => {
        We.value || (Le.value = !1);
      }
    ), watch(
      Xe,
      () => {
        ci.value = PAGE_SIZE;
      },
      { deep: !0 }
    );
    const ci = ref(PAGE_SIZE), fi = computed(
      () => pi.value.slice(0, ci.value)
    ), hi = computed(() => ci.value < pi.value.length), ui = () => {
      ci.value += PAGE_SIZE;
    };
    return onMounted(() => {
      nextTick$1(() => Ue());
    }), (ai, di) => {
      var gi;
      return openBlock(), createElementBlock("div", _hoisted_1$4, [
        createElementVNode("div", {
          class: normalizeClass(["irep-flats-sidebar__header ire-z-10 ire-flex ire-h-14 ire-items-center ire-justify-between ire-gap-2 ire-bg-gray-50 ire-p-4 ire-transition-shadow", {
            "ire-shadow-[0px_10px_50px_-10px_rgba(0,_0,_0,_0.1)]": Ze.value
          }])
        }, [
          createElementVNode("div", _hoisted_2$2, [
            createElementVNode("span", _hoisted_3$2, toDisplayString((gi = pi.value) == null ? void 0 : gi.length), 1),
            createElementVNode("span", _hoisted_4$2, toDisplayString(unref(tr)("apartments")), 1)
          ]),
          createVNode(Transition, { name: "ire-fade-in-out" }, {
            default: withCtx(() => [
              We.value ? (openBlock(), createElementBlock("div", _hoisted_5$2, [
                Fe.value ? createCommentVNode("", !0) : (openBlock(), createBlock(_sfc_main$7, {
                  key: 0,
                  modelValue: Le.value,
                  "onUpdate:modelValue": di[0] || (di[0] = (si) => Le.value = si),
                  "aria-label": unref(tr)("Show only filtered flats on 360"),
                  title: unref(tr)("Show only filtered flats on 360")
                }, null, 8, ["modelValue", "aria-label", "title"])),
                createVNode(_sfc_main$d, {
                  visible: We.value,
                  onClick: ti
                }, null, 8, ["visible"])
              ])) : createCommentVNode("", !0)
            ]),
            _: 1
          })
        ], 2),
        createElementVNode("div", {
          ref_key: "scrollAreaRef",
          ref: ei,
          class: "irep-flats-sidebar__body ire-min-h-0 ire-flex-1 ire-overflow-y-auto",
          onScrollPassive: Ue
        }, [
          createVNode(_sfc_main$8, {
            "filters-object": Xe.value,
            "onUpdate:filtersObject": di[1] || (di[1] = (si) => Xe.value = si),
            "hide-floor-range": ni.value
          }, null, 8, ["filters-object", "hide-floor-range"]),
          pi.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_6$2, [
            createVNode(HomeIcon, { class: "ire-size-8 ire-stroke-black" }),
            createElementVNode("span", _hoisted_7$2, toDisplayString(unref(tr)("no apartments found")), 1)
          ])) : (openBlock(), createElementBlock("div", _hoisted_8$2, [
            createElementVNode("div", _hoisted_9$2, [
              (openBlock(!0), createElementBlock(Fragment, null, renderList(fi.value, (si) => {
                var mi, ki, Si, Ci, Mi;
                return openBlock(), createElementBlock("div", {
                  key: si.id,
                  class: "irep-flats-sidebar__item ire-relative ire-cursor-pointer ire-overflow-visible ire-rounded-md ire-bg-gray-50 ire-p-2 ire-transition-all hover:ire-bg-gray-100 hover:ire-ring-2 hover:ire-ring-[var(--primary-color)]",
                  onClick: (yi) => ze(si),
                  onKeydown: [
                    withKeys(withModifiers((yi) => ze(si), ["prevent"]), ["enter"]),
                    withKeys(withModifiers((yi) => ze(si), ["prevent"]), ["space"])
                  ]
                }, [
                  createElementVNode("div", {
                    class: "irep-flats-sidebar__item-focus-btn ire-absolute ire-right-2 ire-top-2 ire-z-10 ire-flex ire-size-8 ire-cursor-pointer ire-justify-center ire-rounded-full ire-bg-white ire-p-2 ire-text-center ire-transition-all hover:ire-bg-gray-300 active:ire-scale-105",
                    role: "button",
                    "aria-label": "Show on 360",
                    tabindex: "0",
                    onClick: withModifiers((yi) => unref(Re)(si), ["stop"]),
                    onKeydown: [
                      withKeys(withModifiers((yi) => unref(Re)(si), ["prevent", "stop"]), ["enter"]),
                      withKeys(withModifiers((yi) => unref(Re)(si), ["prevent", "stop"]), ["space"])
                    ]
                  }, [
                    createVNode(EyeIcon, { class: "ire-size-6" })
                  ], 40, _hoisted_11$1),
                  createElementVNode("div", _hoisted_12, [
                    si.conf ? (openBlock(), createBlock(_sfc_main$19, {
                      key: 0,
                      conf: si.conf
                    }, null, 8, ["conf"])) : createCommentVNode("", !0)
                  ]),
                  ii(si) ? (openBlock(), createElementBlock("div", _hoisted_13, [
                    createElementVNode("img", {
                      src: ii(si),
                      class: "ire-absolute ire-inset-0 ire-h-full ire-w-full ire-object-cover",
                      alt: "Apartment plan"
                    }, null, 8, _hoisted_14)
                  ])) : createCommentVNode("", !0),
                  createElementVNode("div", _hoisted_15, [
                    createElementVNode("div", _hoisted_16, toDisplayString(si.flat_number), 1),
                    createElementVNode("div", _hoisted_17, [
                      (mi = si == null ? void 0 : si.type) != null && mi.area_m2 ? (openBlock(), createElementBlock("div", _hoisted_18, [
                        createElementVNode("div", _hoisted_19, [
                          createElementVNode("div", _hoisted_20, toDisplayString(unref(tr)("area")), 1)
                        ]),
                        createVNode(Area, { class: "ire-size-4 ire-shrink-0 ire-text-gray-600" }),
                        createElementVNode("span", _hoisted_21, toDisplayString(unref(getArea)((ki = si.type) == null ? void 0 : ki.area_m2)) + " " + toDisplayString(unref(getAreaUnitLabel)()) + "² ", 1)
                      ])) : createCommentVNode("", !0),
                      (Si = si == null ? void 0 : si.type) != null && Si.rooms_count ? (openBlock(), createElementBlock("div", _hoisted_22, [
                        createElementVNode("div", _hoisted_23, [
                          createElementVNode("div", _hoisted_24, toDisplayString(unref(tr)("rooms")), 1)
                        ]),
                        createVNode(Bed, { class: "ire-size-4 ire-shrink-0 ire-text-gray-600" }),
                        createElementVNode("span", _hoisted_25, toDisplayString(unref(getRoomCount)((Mi = (Ci = si.type) == null ? void 0 : Ci.rooms_count) == null ? void 0 : Mi.toString()) || ""), 1)
                      ])) : createCommentVNode("", !0),
                      si != null && si.floor_id ? (openBlock(), createElementBlock("div", _hoisted_26, [
                        createElementVNode("div", _hoisted_27, [
                          createElementVNode("div", _hoisted_28, toDisplayString(unref(tr)("floor")), 1)
                        ]),
                        createVNode(Floor, { class: "ire-size-4 ire-shrink-0 ire-text-gray-600" }),
                        createElementVNode("span", _hoisted_29, toDisplayString(oi(si)), 1)
                      ])) : createCommentVNode("", !0)
                    ])
                  ])
                ], 40, _hoisted_10$1);
              }), 128))
            ]),
            hi.value ? (openBlock(), createElementBlock("div", _hoisted_30, [
              createElementVNode("div", {
                class: "irep-flats-sidebar__load-more ire-flex ire-w-full ire-cursor-pointer ire-items-center ire-justify-center ire-rounded-md ire-border ire-border-gray-200 ire-bg-white ire-px-4 ire-py-2.5 ire-text-sm ire-font-medium ire-capitalize ire-text-gray-700 ire-transition-colors hover:ire-bg-gray-50 active:ire-bg-gray-100",
                onClick: ui
              }, [
                createTextVNode(toDisplayString(unref(tr)("load more")) + " ", 1),
                createElementVNode("span", _hoisted_31, "(" + toDisplayString(pi.value.length - ci.value) + ")", 1)
              ])
            ])) : createCommentVNode("", !0)
          ]))
        ], 544)
      ]);
    };
  }
}), _sfc_main$4 = {}, _hoisted_1$3 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function _sfc_render$1($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$3, [..._e[0] || (_e[0] = [
    createElementVNode("path", { d: "M5 15l7-7 7 7" }, null, -1)
  ])]);
}
const ChevronUp = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$1]]), _sfc_main$3 = {}, _hoisted_1$2 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function _sfc_render($e, _e) {
  return openBlock(), createElementBlock("svg", _hoisted_1$2, [..._e[0] || (_e[0] = [
    createElementVNode("path", { d: "M19 9l-7 7-7-7" }, null, -1)
  ])]);
}
const ChevronDown = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render]]), _hoisted_1$1 = { class: "irep-floors-360 ire-relative ire-h-full ire-w-full ire-overflow-hidden ire-bg-white" }, _hoisted_2$1 = {
  key: 0,
  class: "irep-floors-360__block-tabs ire-absolute ire-left-2 ire-top-2 ire-z-10 ire-flex ire-flex-wrap ire-gap-1"
}, _hoisted_3$1 = ["onClick"], _hoisted_4$1 = {
  key: 1,
  class: "irep-floors-360__canvas ire-relative ire-h-full ire-w-full ire-select-none ire-overflow-hidden"
}, _hoisted_5$1 = ["src", "alt", "width", "height"], _hoisted_6$1 = ["innerHTML"], _hoisted_7$1 = {
  key: 2,
  class: "irep-floors-360__empty ire-flex ire-h-full ire-w-full ire-items-center ire-justify-center ire-text-gray-400"
}, _hoisted_8$1 = {
  key: 3,
  class: "irep-floors-360__floor-picker ire-absolute ire-left-3 ire-top-1/2 ire-z-10 ire-flex -ire-translate-y-1/2 ire-flex-col ire-items-center ire-gap-1 ire-rounded-md ire-bg-white ire-p-1"
}, _hoisted_9$1 = ["onClick"], DRAG_THRESHOLD = 4, _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Floors360",
  props: {
    flats: {},
    floors: {},
    blocks: {},
    actions: {},
    svgFlatFilterActive: { type: Boolean },
    svgVisibleFlatIds: {},
    focusFlatId: {},
    pathsVisible: { type: Boolean }
  },
  setup($e) {
    const _e = $e, ke = inject("showFlatModal"), Be = inject("activateFlat"), Ne = inject("setFloorHoverData"), Ve = inject("setFloors360Selection"), Le = useGlobalStore(), { openReservedFlat: De, openSoldFlat: Ae } = storeToRefs(Le), Ie = ref(null), Re = ref(null), ze = ref(null), je = ref(null), Fe = ref(null), He = ref(null), Ge = ref(null), qe = ref(!1), Xe = ref(0), Ye = ref(0);
    let We = null, Je = null;
    const ri = computed(
      () => _e.floors.some((ui) => !ui.block_id)
    ), Qe = computed(
      () => _e.floors.filter(
        (ui) => Ie.value ? String(ui.block_id) === Ie.value : !ui.block_id
      ).sort((ui, ai) => ui.floor_number - ai.floor_number)
    ), ti = computed(() => {
      var ui;
      return ((ui = Re.value) == null ? void 0 : ui.svg) ?? null;
    }), ei = computed(
      () => {
        var ui, ai;
        return ((ai = (ui = Re.value) == null ? void 0 : ui.floor_image) == null ? void 0 : ai[0]) ?? null;
      }
    ), Ze = computed(() => {
      const ui = ei.value;
      if (!ui) return null;
      const ai = Number(ui.width), di = Number(ui.height);
      return !Number.isFinite(ai) || !Number.isFinite(di) || ai <= 0 || di <= 0 ? null : { width: Math.round(ai), height: Math.round(di) };
    }), Ue = () => {
      if (!ze.value || !Re.value) return;
      const ui = _e.svgFlatFilterActive ?? !1, ai = _e.svgVisibleFlatIds;
      ze.value.querySelectorAll("g").forEach((gi) => {
        var Si, Ci, Mi;
        const si = gi.getAttribute("id"), mi = (Ci = (Si = Re.value) == null ? void 0 : Si.polygon_data) == null ? void 0 : Ci.find(
          (yi) => yi.key === si
        );
        if (!_e.flats) return;
        let ki = "";
        if ((Mi = Re.value) != null && Mi.conf)
          ki = getConfValue(Re.value.conf), gi.setAttribute("conf", ki);
        else {
          const yi = _e.flats.find((Oi) => Oi.id === (mi == null ? void 0 : mi.id));
          ki = getConfValue((yi == null ? void 0 : yi.conf) ?? ""), gi.setAttribute("conf", ki);
        }
        if (mi != null && mi.type && gi.setAttribute("polygon-type", mi.type), gi.style.transition = "opacity 220ms ease", (mi == null ? void 0 : mi.type) === "flat" && mi.id) {
          const yi = ui && ai != null && !ai.has(String(mi.id));
          gi.style.opacity = yi ? "0" : "", gi.style.pointerEvents = yi ? "none" : "";
        } else
          gi.style.opacity = ui ? "0" : "", gi.style.pointerEvents = ui ? "none" : "";
      });
    }, Ke = (ui) => {
      const ai = ui.target;
      Fe.value = ai, (ai == null ? void 0 : ai.nodeName) === "path" && (Le.hoverdSvg = ai);
    }, ii = (ui) => {
      var di;
      const ai = ui.target;
      (ai == null ? void 0 : ai.nodeName) === "path" && (Ge.value && "conf" in Ge.value && (Ge.value.conf === "reserved" && !De.value || Ge.value.conf === "sold" && !Ae.value) || ((di = He.value) == null ? void 0 : di.type) === "flat" && Ge.value && (Be == null || Be(Ge.value)));
    }, oi = (ui) => {
      je.value && (je.value.scrollTop += ui * 80);
    }, ni = () => {
      window.removeEventListener("pointermove", ci), window.removeEventListener("pointerup", fi), window.removeEventListener("pointercancel", fi);
    }, pi = (ui) => {
      je.value && (Xe.value = ui.clientY, Ye.value = je.value.scrollTop, We = ui.pointerId, window.addEventListener("pointermove", ci), window.addEventListener("pointerup", fi), window.addEventListener("pointercancel", fi));
    }, ci = (ui) => {
      if (ui.pointerId !== We || !je.value) return;
      const ai = ui.clientY - Xe.value;
      !qe.value && Math.abs(ai) < DRAG_THRESHOLD || (qe.value = !0, je.value.scrollTop = Ye.value - ai);
    }, fi = (ui) => {
      ui.pointerId === We && (qe.value = !1, We = null, ni());
    }, hi = (ui) => {
      var si;
      const ai = (si = Re.value) == null ? void 0 : si.floor_number;
      Ie.value = ui;
      const di = _e.floors.filter((mi) => ui ? String(mi.block_id) === ui : !mi.block_id).sort((mi, ki) => mi.floor_number - ki.floor_number), gi = ai != null ? di.find((mi) => mi.floor_number === ai) : null;
      Re.value = gi ?? di[0] ?? null;
    };
    return watch(
      () => Fe.value,
      (ui) => {
        var di, gi, si, mi, ki;
        if (!ui) return;
        const ai = ui.parentElement;
        if (ai && ai.nodeName === "g") {
          const Si = ai.getAttribute("id");
          if (!Si || (He.value = ((gi = (di = Re.value) == null ? void 0 : di.polygon_data) == null ? void 0 : gi.find((Ci) => Ci.key === Si)) ?? null, !He.value)) return;
          if (He.value.type === "flat") {
            const Ci = _e.flats.find(
              (Mi) => Mi.id === He.value.id
            );
            Ge.value = Ci ? {
              ...Ci,
              conf: Ci.conf || ((si = Re.value) == null ? void 0 : si.conf) || ""
            } : null;
          } else He.value.type === "tooltip" ? Ge.value = ((mi = _e.actions) == null ? void 0 : mi.find(
            (Ci) => Ci.id === He.value.id
          )) ?? null : Ge.value = null;
          Ne == null || Ne(Ge.value, ((ki = He.value) == null ? void 0 : ki.type) ?? "");
        } else
          He.value = null, Ge.value = null, Ne == null || Ne(null, "");
      }
    ), watch(
      () => Re.value,
      () => {
        var ui;
        Je && (Je.classList.remove("ire-flat-focus"), Je = null), setTimeout(() => Ue(), 0), Ve == null || Ve(
          ((ui = Re.value) == null ? void 0 : ui.id) ?? null,
          Ie.value
        );
      }
    ), watch(
      () => [_e.svgFlatFilterActive, _e.svgVisibleFlatIds],
      () => {
        setTimeout(() => Ue(), 0);
      }
    ), watch(
      () => _e.focusFlatId,
      (ui) => {
        if (!ui) return;
        const ai = _e.flats.find((si) => si.id === ui);
        if (!ai) return;
        const di = _e.floors.find(
          (si) => String(si.id) === String(ai.floor_id)
        );
        if (!di) return;
        const gi = di.block_id ? String(di.block_id) : null;
        gi !== Ie.value && hi(gi), Re.value = di, setTimeout(() => {
          var Si;
          if (!ze.value) return;
          const si = (Si = di.polygon_data) == null ? void 0 : Si.find(
            (Ci) => Ci.type === "flat" && Ci.id === ui
          );
          if (!si) return;
          const mi = typeof CSS < "u" && "escape" in CSS ? CSS.escape(si.key) : si.key, ki = ze.value.querySelector(
            `g#${mi}`
          );
          ki && (Je && Je.classList.remove("ire-flat-focus"), ki.classList.add("ire-flat-focus"), Je = ki);
        }, 50);
      }
    ), watch(
      () => Ie.value,
      () => {
        var ui;
        Ve == null || Ve(
          ((ui = Re.value) == null ? void 0 : ui.id) ?? null,
          Ie.value
        );
      }
    ), watch(
      () => ke == null ? void 0 : ke.value,
      () => {
        ke != null && ke.value || (Fe.value = null, He.value = null);
      }
    ), onMounted(() => {
      var ui;
      _e.blocks.length > 0 && (Ie.value = _e.blocks[0].id), Re.value = Qe.value[0] ?? null, Ve == null || Ve(
        ((ui = Re.value) == null ? void 0 : ui.id) ?? null,
        Ie.value
      ), document.addEventListener("mousemove", Ke);
    }), onUnmounted(() => {
      document.removeEventListener("mousemove", Ke), ni(), Je && Je.classList.remove("ire-flat-focus");
    }), (ui, ai) => {
      var di, gi, si;
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        $e.blocks.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_2$1, [
          (openBlock(!0), createElementBlock(Fragment, null, renderList($e.blocks, (mi) => (openBlock(), createElementBlock("div", {
            key: mi.id,
            class: normalizeClass([
              "irep-floors-360__block-tab ire-cursor-pointer ire-rounded ire-px-3 ire-py-1 ire-text-sm ire-font-medium ire-shadow ire-transition-colors",
              Ie.value === mi.id ? "ire-bg-black ire-text-white" : "ire-bg-white ire-text-black hover:ire-bg-gray-100"
            ]),
            onClick: (ki) => hi(mi.id)
          }, toDisplayString(mi.title), 11, _hoisted_3$1))), 128)),
          ri.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass([
              "irep-floors-360__block-tab ire-cursor-pointer ire-rounded ire-px-3 ire-py-1 ire-text-sm ire-font-medium ire-shadow ire-transition-colors",
              Ie.value === null ? "ire-bg-black ire-text-white" : "ire-bg-white ire-text-black hover:ire-bg-gray-100"
            ]),
            onClick: ai[0] || (ai[0] = (mi) => hi(null))
          }, toDisplayString(unref(tr)("no block")), 3)) : createCommentVNode("", !0)
        ])) : createCommentVNode("", !0),
        Re.value ? (openBlock(), createElementBlock("div", _hoisted_4$1, [
          (di = ei.value) != null && di.url ? (openBlock(), createElementBlock("img", {
            key: 0,
            src: ei.value.url,
            alt: ei.value.alt || "",
            width: (gi = Ze.value) == null ? void 0 : gi.width,
            height: (si = Ze.value) == null ? void 0 : si.height,
            class: "ire-block ire-h-full ire-w-full ire-object-contain",
            decoding: "async"
          }, null, 8, _hoisted_5$1)) : createCommentVNode("", !0),
          (openBlock(), createElementBlock("div", {
            ref_key: "svgRef",
            ref: ze,
            innerHTML: ti.value,
            key: ti.value ?? "",
            class: "irep-floors-360__svg-overlay canvas path-color ire-absolute ire-left-0 ire-top-0 ire-h-full ire-w-full",
            style: normalizeStyle({
              opacity: $e.pathsVisible === !1 ? 0 : 1,
              transition: "opacity 160ms ease",
              pointerEvents: $e.pathsVisible === !1 ? "none" : "auto"
            }),
            onClick: ii
          }, null, 12, _hoisted_6$1))
        ])) : (openBlock(), createElementBlock("div", _hoisted_7$1, toDisplayString(unref(tr)("no floors available")), 1)),
        Qe.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_8$1, [
          createElementVNode("div", {
            class: "irep-floors-360__arrow-up ire-flex ire-h-7 ire-w-7 ire-cursor-pointer ire-items-center ire-justify-center ire-rounded-full ire-bg-white ire-shadow ire-transition-colors hover:ire-bg-gray-100",
            onClick: ai[1] || (ai[1] = (mi) => oi(-1))
          }, [
            createVNode(ChevronUp)
          ]),
          createElementVNode("div", {
            ref_key: "floorListRef",
            ref: je,
            class: normalizeClass(["irep-floors-360__floor-list ire-flex ire-max-h-[30vh] ire-flex-col ire-items-center ire-gap-1 ire-overflow-y-auto ire-overscroll-contain ire-rounded-lg ire-py-1", qe.value ? "ire-cursor-grabbing" : "ire-cursor-grab"]),
            style: { "scrollbar-width": "none", "-ms-overflow-style": "none" },
            onPointerdown: pi
          }, [
            (openBlock(!0), createElementBlock(Fragment, null, renderList(Qe.value, (mi) => {
              var ki;
              return openBlock(), createElementBlock("div", {
                key: mi.id,
                class: normalizeClass([
                  "irep-floors-360__floor-item ire-flex ire-h-9 ire-w-9 ire-shrink-0 ire-cursor-pointer ire-items-center ire-justify-center ire-rounded-full ire-text-sm ire-font-semibold ire-shadow ire-transition-colors",
                  ((ki = Re.value) == null ? void 0 : ki.id) === mi.id ? "ire-bg-black ire-text-white" : "ire-bg-white ire-text-black hover:ire-bg-gray-100"
                ]),
                onClick: (Si) => Re.value = mi
              }, toDisplayString(mi.floor_number), 11, _hoisted_9$1);
            }), 128))
          ], 34),
          createElementVNode("div", {
            class: "irep-floors-360__arrow-down ire-flex ire-h-7 ire-w-7 ire-cursor-pointer ire-items-center ire-justify-center ire-rounded-full ire-bg-white ire-shadow ire-transition-colors hover:ire-bg-gray-100",
            onClick: ai[2] || (ai[2] = (mi) => oi(1))
          }, [
            createVNode(ChevronDown)
          ])
        ])) : createCommentVNode("", !0)
      ]);
    };
  }
}), Floors360 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-0c81fc95"]]), _hoisted_1 = { class: "irep-project-360-viewer building-360-viewer ire-relative ire-h-[max(600px,85svh)] ire-overflow-hidden" }, _hoisted_2 = ["aria-label"], _hoisted_3 = ["aria-label"], _hoisted_4 = { class: "irep-project-360-viewer__layout ire-flex ire-h-full ire-items-stretch" }, _hoisted_5 = {
  key: 0,
  class: "irep-project-360-viewer__content ire-relative ire-h-full ire-w-full"
}, _hoisted_6 = {
  key: 0,
  class: "irep-project-360-viewer__view-tabs ire-flex ire-overflow-hidden ire-rounded-lg ire-shadow-md"
}, _hoisted_7 = { class: "irep-project-360-viewer__frame-indicator ire-pointer-events-none ire-absolute ire-left-2 ire-top-2 ire-z-10 ire-size-8" }, _hoisted_8 = { viewBox: "0 0 32 32" }, _hoisted_9 = ["stroke-dashoffset"], _hoisted_10 = ["innerHTML"], _hoisted_11 = { class: "irep-project-360-viewer__sidebar-inner ire-h-full ire-w-full ire-overflow-hidden ire-bg-white ire-shadow-xl md:ire-w-[450px]" }, cursor360 = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='36' viewBox='0 0 120 36'%3E%3Ctext x='60' y='26' text-anchor='middle' font-family='Arial,sans-serif' font-size='22' font-weight='700' fill='white'%3E%E2%80%B9 360%C2%B0 %E2%80%BA%3C/text%3E%3C/svg%3E") 60 18, auto`, _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Project360Viewer",
  props: {
    project: {},
    sensitivity: { default: 100 },
    snapDurationMs: { default: 300 },
    pathsFillOnHoverOnly: { type: Boolean, default: !1 }
  },
  emits: ["changeComponent"],
  setup($e, { emit: _e }) {
    const ke = $e, Be = _e, Ne = useGlobalStore(), { getMetaValue: Ve } = Ne, { shortcodeData: Le, flats: De, openReservedFlat: Ae, openSoldFlat: Ie } = storeToRefs(Ne), Re = ref("360"), ze = ref(!0), je = ref(!1), Fe = ref(!1), He = computed(() => je.value || Fe.value), Ge = ref(null);
    function qe(xi, wi, Ni) {
      const ji = Math.max(xi.left, Math.min(wi, xi.right)), Hi = Math.max(xi.top, Math.min(Ni, xi.bottom));
      return Math.sqrt((wi - ji) ** 2 + (Ni - Hi) ** 2);
    }
    function Xe(xi) {
      je.value = Ge.value ? qe(
        Ge.value.getBoundingClientRect(),
        xi.clientX,
        xi.clientY
      ) <= 28 : !1;
    }
    function Ye() {
      je.value = !1, Fe.value = !1;
    }
    const We = ref(null), Je = ref(""), ri = ref(null), Qe = ref(null);
    provide("setFloorHoverData", (xi, wi) => {
      We.value = xi, Je.value = wi;
    }), provide(
      "setFloors360Selection",
      (xi, wi) => {
        ri.value = xi, Qe.value = wi;
      }
    );
    const ti = ref(!1), ei = shallowRef(/* @__PURE__ */ new Set()), Ze = (xi) => {
      ei.value = xi;
    }, Ue = ref(!1), Ke = ref(null);
    provide("showFlatModal", Ue);
    const ii = (xi) => {
      if (xi)
        if ((xi == null ? void 0 : xi.click_action) === "follow_link") {
          const { link: wi, target: Ni } = xi.follow_link ?? {};
          wi && window.open(wi, Ni ? "_blank" : "_self");
        } else {
          if ((xi == null ? void 0 : xi.conf) === "reserved" && !Ae.value || (xi == null ? void 0 : xi.conf) === "sold" && !Ie.value) return;
          const wi = Ve("custom_types"), Ni = wi == null ? void 0 : wi.find(
            (ji) => ji.title === (xi == null ? void 0 : xi.conf)
          );
          if (Ni && !(Ni != null && Ni.open_flat_modal)) return;
          Ke.value = xi, Ue.value = !0;
        }
    }, oi = computed(() => {
      var xi;
      return ((xi = Le.value) == null ? void 0 : xi.floors) ?? [];
    }), ni = computed(() => {
      var xi;
      return ((xi = Le.value) == null ? void 0 : xi.blocks) ?? [];
    }), pi = computed(() => {
      var xi;
      return (xi = Le.value) == null ? void 0 : xi.actions;
    }), ci = ref(null), fi = ref(null), hi = ref(null), ui = ref(!1), ai = ref(!1), di = computed(() => ke.project["360images"] ?? []), gi = 2 * Math.PI * 12, si = computed(
      () => mi.value > 1 ? gi * (1 - ki.value / (mi.value - 1)) : gi
    ), {
      total: mi,
      renderFrame: ki,
      isDragging: Si,
      isAnimating: Ci,
      hoveredData: Mi,
      activePolygonType: yi,
      currentSvg: Oi,
      onPointerDown: Ri,
      snapToNearestWithPolygons: Di,
      focusFlatOnViewer: zi
    } = useProject360({
      frames: di,
      sensitivity: toRef(ke, "sensitivity"),
      snapDurationMs: toRef(ke, "snapDurationMs"),
      containerRef: ci,
      canvasRef: fi,
      svgRef: hi,
      svgFlatFilterActive: ti,
      svgVisibleFlatIds: ei,
      onPolygonClick(xi, wi) {
        wi === "flat" ? ii(Mi.value) : (wi === "block" || wi === "floor") && Be("changeComponent", wi, xi);
      }
    });
    watch(Ci, (xi) => {
      xi || (ai.value = !1);
    });
    const $i = (xi) => {
      ai.value = !0, Di(xi);
    };
    onMounted(() => {
      ui.value = !window.matchMedia("(max-width: 767px)").matches;
      const xi = new URLSearchParams(window.location.search), wi = xi.get("flatId"), Ni = xi.get("projectId");
      if (!wi || Ni && String(ke.project.id) !== Ni) return;
      const ji = () => {
        var Ui;
        const Hi = (Ui = De.value) == null ? void 0 : Ui.find((Gi) => String(Gi.id) === wi);
        return Hi ? (ii(Hi), !0) : !1;
      };
      if (!ji()) {
        const Hi = watch(De, () => {
          ji() && Hi();
        });
      }
    });
    const Ii = ref(null);
    return provide("activateFlat", ii), provide("focusFlatOnViewer", (xi) => {
      (xi == null ? void 0 : xi.id) == null || xi.id === "" || (Re.value === "floors" ? Ii.value = String(xi.id) : zi(String(xi.id)));
    }), (xi, wi) => (openBlock(), createElementBlock("div", _hoisted_1, [
      createVNode(Transition, { name: "ire-fade-in-out" }, {
        default: withCtx(() => [
          ui.value ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "irep-project-360-viewer__backdrop ire-absolute ire-inset-0 ire-z-20 ire-bg-black/40 md:ire-hidden",
            onClick: wi[0] || (wi[0] = (Ni) => ui.value = !1)
          })) : createCommentVNode("", !0)
        ]),
        _: 1
      }),
      createElementVNode("div", {
        class: "irep-project-360-viewer__mobile-toggle ire-absolute ire-right-0 ire-top-1/2 ire-z-40 -ire-translate-y-1/2 ire-cursor-pointer ire-rounded-l-md ire-rounded-r-none ire-bg-white/95 ire-px-1 ire-py-3 ire-shadow-md md:ire-hidden",
        role: "button",
        tabindex: "0",
        "aria-label": ui.value ? "Hide sidebar" : "Show sidebar",
        onClick: wi[1] || (wi[1] = (Ni) => ui.value = !ui.value)
      }, [
        createVNode(ArrowRight, {
          class: normalizeClass(!ui.value && "ire-rotate-180")
        }, null, 8, ["class"])
      ], 8, _hoisted_2),
      createElementVNode("div", {
        class: normalizeClass(["irep-project-360-viewer__desktop-toggle-wrapper ire-absolute ire-top-1/2 ire-z-[5] ire-hidden -ire-translate-y-1/2 ire-transition-all ire-duration-300 md:ire-block", ui.value ? "ire-right-[450px]" : "ire-right-0"])
      }, [
        createElementVNode("div", {
          class: "irep-project-360-viewer__desktop-toggle ire-cursor-pointer ire-rounded-l-md ire-rounded-r-none ire-bg-white/95 ire-px-1 ire-py-3 ire-shadow-md",
          role: "button",
          tabindex: "0",
          "aria-label": ui.value ? "Hide sidebar" : "Show sidebar",
          onClick: wi[2] || (wi[2] = (Ni) => ui.value = !ui.value)
        }, [
          createVNode(ArrowRight, {
            class: normalizeClass(!ui.value && "ire-rotate-180")
          }, null, 8, ["class"])
        ], 8, _hoisted_3)
      ], 2),
      createVNode(_sfc_main$u, { class: "interactive-real-estate ire-h-full ire-text-base" }, {
        default: withCtx(() => [
          createElementVNode("div", _hoisted_4, [
            createVNode(_sfc_main$17, {
              class: "ire-min-w-0 ire-flex-1",
              hoverdData: Re.value === "floors" ? We.value : unref(Mi),
              type: Re.value === "floors" ? Je.value : unref(yi)
            }, {
              default: withCtx(() => [
                unref(mi) > 0 ? (openBlock(), createElementBlock("div", _hoisted_5, [
                  createElementVNode("div", {
                    ref_key: "uiToggleRef",
                    ref: Ge,
                    class: "irep-project-360-viewer__controls ire-absolute ire-right-2 ire-top-2 ire-z-20 ire-flex ire-items-center ire-gap-2"
                  }, [
                    createElementVNode("div", {
                      class: normalizeClass([
                        "irep-project-360-viewer__eye-toggle ire-flex ire-cursor-pointer ire-items-center ire-justify-center ire-rounded-lg ire-p-1.5 ire-shadow-md ire-transition-colors",
                        ze.value ? "ire-bg-white ire-text-black hover:ire-bg-gray-100" : "ire-bg-black ire-text-white"
                      ]),
                      onClick: wi[3] || (wi[3] = (Ni) => ze.value = !ze.value)
                    }, [
                      ze.value ? (openBlock(), createBlock(EyeOffIcon, {
                        key: 0,
                        class: "ire-size-4"
                      })) : (openBlock(), createBlock(EyeIcon, {
                        key: 1,
                        class: "ire-size-4"
                      }))
                    ], 2),
                    oi.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_6, [
                      createElementVNode("div", {
                        class: normalizeClass([
                          "irep-project-360-viewer__view-tab ire-cursor-pointer ire-px-3 ire-py-1.5 ire-text-xs ire-font-medium ire-capitalize ire-transition-colors",
                          Re.value === "360" ? "ire-bg-black ire-text-white" : "ire-bg-white ire-text-black hover:ire-bg-gray-100"
                        ]),
                        onClick: wi[4] || (wi[4] = (Ni) => Re.value = "360")
                      }, toDisplayString(unref(tr)("3d master plan")), 3),
                      createElementVNode("div", {
                        class: normalizeClass([
                          "irep-project-360-viewer__view-tab ire-cursor-pointer ire-px-3 ire-py-1.5 ire-text-xs ire-font-medium ire-capitalize ire-transition-colors",
                          Re.value === "floors" ? "ire-bg-black ire-text-white" : "ire-bg-white ire-text-black hover:ire-bg-gray-100"
                        ]),
                        onClick: wi[5] || (wi[5] = (Ni) => Re.value = "floors")
                      }, toDisplayString(unref(tr)("floors")), 3)
                    ])) : createCommentVNode("", !0)
                  ], 512),
                  withDirectives(createElementVNode("div", {
                    ref_key: "containerRef",
                    ref: ci,
                    class: "irep-project-360-viewer__canvas ire-h-full ire-w-full ire-touch-none ire-select-none",
                    style: normalizeStyle({
                      cursor: He.value ? "default" : !unref(Mi) || unref(Si) ? cursor360 : "default"
                    }),
                    onPointerdown: wi[10] || (wi[10] = //@ts-ignore
                    (...Ni) => unref(Ri) && unref(Ri)(...Ni)),
                    onMousemove: Xe,
                    onMouseleave: Ye
                  }, [
                    createElementVNode("canvas", {
                      ref_key: "canvasRef",
                      ref: fi,
                      class: "ire-pointer-events-none ire-block ire-h-full ire-w-full"
                    }, null, 512),
                    createElementVNode("div", _hoisted_7, [
                      (openBlock(), createElementBlock("svg", _hoisted_8, [
                        wi[13] || (wi[13] = createElementVNode("circle", {
                          cx: "16",
                          cy: "16",
                          r: "12",
                          class: "ire-fill-black/0",
                          stroke: "rgba(255,255,255,0.50)",
                          "stroke-width": "2.5"
                        }, null, -1)),
                        createElementVNode("circle", {
                          cx: "16",
                          cy: "16",
                          r: "12",
                          fill: "none",
                          stroke: "black",
                          "stroke-width": "2.5",
                          "stroke-linecap": "round",
                          transform: "rotate(-90 16 16)",
                          "stroke-dasharray": gi,
                          "stroke-dashoffset": si.value,
                          style: { transition: "stroke-dashoffset 150ms ease" }
                        }, null, 8, _hoisted_9)
                      ]))
                    ]),
                    createElementVNode("div", {
                      ref_key: "svgRef",
                      ref: hi,
                      innerHTML: unref(Oi),
                      class: normalizeClass(["canvas path-color ire-absolute ire-left-0 ire-top-0 ire-h-full ire-w-full", { "path-hover-fill-only": $e.pathsFillOnHoverOnly }]),
                      style: normalizeStyle({
                        opacity: unref(Si) || unref(Ci) || !ze.value ? 0 : 1,
                        transition: ai.value ? "none" : "opacity 160ms ease",
                        pointerEvents: unref(Si) || unref(Ci) || !ze.value ? "none" : "auto"
                      })
                    }, null, 14, _hoisted_10),
                    createVNode(_sfc_main$9, {
                      onPrev: wi[6] || (wi[6] = (Ni) => $i(-1)),
                      onNext: wi[7] || (wi[7] = (Ni) => $i(1)),
                      onMouseenter: wi[8] || (wi[8] = (Ni) => Fe.value = !0),
                      onMouseleave: wi[9] || (wi[9] = (Ni) => Fe.value = !1)
                    })
                  ], 36), [
                    [vShow, Re.value === "360"]
                  ]),
                  Re.value === "floors" ? (openBlock(), createBlock(Floors360, {
                    key: 0,
                    flats: unref(De) ?? [],
                    floors: oi.value,
                    blocks: ni.value,
                    actions: pi.value,
                    "svg-flat-filter-active": ti.value,
                    "svg-visible-flat-ids": ei.value,
                    "focus-flat-id": Ii.value,
                    "paths-visible": ze.value,
                    class: "ire-h-full ire-w-full"
                  }, null, 8, ["flats", "floors", "blocks", "actions", "svg-flat-filter-active", "svg-visible-flat-ids", "focus-flat-id", "paths-visible"])) : createCommentVNode("", !0)
                ])) : createCommentVNode("", !0)
              ]),
              _: 1
            }, 8, ["hoverdData", "type"]),
            createElementVNode("div", {
              class: normalizeClass(["irep-project-360-viewer__sidebar ire-absolute ire-right-0 ire-top-0 ire-z-30 ire-h-full ire-overflow-hidden ire-transition-all ire-duration-300 md:ire-relative md:ire-z-auto", ui.value ? "ire-w-full md:ire-w-[450px]" : "ire-w-0"])
            }, [
              createElementVNode("div", _hoisted_11, [
                createVNode(_sfc_main$5, {
                  "show-only-filtered-on-svg": ti.value,
                  "onUpdate:showOnlyFilteredOnSvg": wi[11] || (wi[11] = (Ni) => ti.value = Ni),
                  "onUpdate:filteredFlatIds": Ze,
                  "active-view": Re.value,
                  "floors360-floor-id": ri.value,
                  "floors360-block-id": Qe.value
                }, null, 8, ["show-only-filtered-on-svg", "active-view", "floors360-floor-id", "floors360-block-id"])
              ])
            ], 2)
          ])
        ]),
        _: 1
      }),
      (openBlock(), createBlock(Teleport, { to: "body" }, [
        createVNode(Transition, {
          name: "ire-fade-in-out",
          appear: ""
        }, {
          default: withCtx(() => [
            Ue.value ? (openBlock(), createBlock(_sfc_main$y, {
              key: 0,
              onClose: wi[12] || (wi[12] = (Ni) => Ue.value = !1)
            }, {
              default: withCtx(() => [
                createVNode(_sfc_main$z, {
                  flat: Ke.value,
                  floors: oi.value
                }, null, 8, ["flat", "floors"])
              ]),
              _: 1
            })) : createCommentVNode("", !0)
          ]),
          _: 1
        })
      ]))
    ]));
  }
}), _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Project360",
  props: {
    data: {},
    irePlugin: {}
  },
  setup($e) {
    const _e = $e, ke = useGlobalStore();
    ke.setData(_e.data), ke.setIrePlaginWp(_e.irePlugin), provide("fromListView", !1);
    const Be = computed(() => _e.data.project), Ne = computed(
      () => ke.getMetaValue("paths_hover_fill") === "true"
    );
    return (Ve, Le) => (openBlock(), createBlock(_sfc_main$1h, null, {
      default: withCtx(() => {
        var De, Ae;
        return [
          (Ae = (De = Be.value) == null ? void 0 : De["360images"]) != null && Ae.length ? (openBlock(), createBlock(_sfc_main$1, {
            key: 0,
            project: Be.value,
            "paths-fill-on-hover-only": Ne.value
          }, null, 8, ["project", "paths-fill-on-hover-only"])) : createCommentVNode("", !0)
        ];
      }),
      _: 1
    }));
  }
}), IrePreview = {
  install($e) {
    const _e = createPinia();
    $e.use(_e), $e.component("Project", _sfc_main$s), $e.component("Flats", _sfc_main$a), $e.component("Project360", _sfc_main);
  }
};
export {
  _sfc_main$a as FlatsList,
  _sfc_main$s as Project,
  _sfc_main as Project360,
  IrePreview as default
};
