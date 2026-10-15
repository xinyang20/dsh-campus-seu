window.__ModuleLoader__.load({id:"dsh-campus-seu",factory:(require)=>{const module={exports:{}};const exports=module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.jsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/preferences.js
var MAX_MASCOT_BYTES = 512 * 1024;
var STORAGE_KEY = "dsh-campus-seu.preferences.v1";
var FIELDS = ["enabled", "campus", "showHero", "showMotto", "mascotEnabled", "mascotDataUrl"];
var BOOLEAN_FIELDS = ["enabled", "showHero", "showMotto", "mascotEnabled"];
var hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
var DEFAULT_PREFERENCES = Object.freeze({
  enabled: true,
  campus: "jiulonghu",
  showHero: true,
  showMotto: true,
  mascotEnabled: false,
  mascotDataUrl: null
});
function validateMascotDataUrl(value) {
  if (value === null) return null;
  if (typeof value !== "string") throw new TypeError("\u53EE\u4E1C\u56FE\u7247\u5FC5\u987B\u662F PNG\u3001JPEG \u6216 WebP \u672C\u5730\u56FE\u7247\u3002");
  const match = /^data:image\/(png|jpeg|webp);base64,([\s\S]*)$/i.exec(value);
  if (!match) throw new TypeError("\u53EE\u4E1C\u56FE\u7247\u4EC5\u652F\u6301 PNG\u3001JPEG \u6216 WebP\uFF0C\u4E0D\u652F\u6301 SVG \u6216\u7F51\u7EDC\u5730\u5740\u3002");
  const [, format, encoded] = match;
  if (encoded.length > Math.ceil(MAX_MASCOT_BYTES / 3) * 4) throw new RangeError("\u53EE\u4E1C\u56FE\u7247\u4E0D\u80FD\u8D85\u8FC7 512 KiB\uFF0C\u8BF7\u9009\u62E9\u66F4\u5C0F\u7684\u56FE\u7247\u3002");
  if (!encoded || encoded.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) {
    throw new TypeError("\u53EE\u4E1C\u56FE\u7247\u7684 base64 \u6570\u636E\u65E0\u6548\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u56FE\u7247\u3002");
  }
  const padding = encoded.endsWith("==") ? 2 : encoded.endsWith("=") ? 1 : 0;
  const bytes = encoded.length / 4 * 3 - padding;
  if (bytes > MAX_MASCOT_BYTES) throw new RangeError("\u53EE\u4E1C\u56FE\u7247\u4E0D\u80FD\u8D85\u8FC7 512 KiB\uFF0C\u8BF7\u9009\u62E9\u66F4\u5C0F\u7684\u56FE\u7247\u3002");
  const header = Array.from(atob(encoded.slice(0, 16)), (char) => char.charCodeAt(0));
  const startsWith = (signature) => signature.every((byte, index) => header[index] === byte);
  const mime = format.toLowerCase();
  const matchesFormat = mime === "png" ? startsWith([137, 80, 78, 71, 13, 10, 26, 10]) : mime === "jpeg" ? startsWith([255, 216, 255]) : startsWith([82, 73, 70, 70]) && header.slice(8, 12).join(",") === "87,69,66,80";
  if (!matchesFormat) throw new TypeError("\u53EE\u4E1C\u56FE\u7247\u5185\u5BB9\u4E0E\u6587\u4EF6\u683C\u5F0F\u4E0D\u7B26\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9 PNG\u3001JPEG \u6216 WebP \u56FE\u7247\u3002");
  return `data:image/${mime};base64,${encoded}`;
}
function normalizePreferences(input) {
  const normalized = { ...DEFAULT_PREFERENCES };
  if (input && typeof input === "object" && !Array.isArray(input)) {
    for (const field of BOOLEAN_FIELDS) {
      if (hasOwn(input, field) && typeof input[field] === "boolean") normalized[field] = input[field];
    }
    if (hasOwn(input, "campus") && ["jiulonghu", "sipailou"].includes(input.campus)) normalized.campus = input.campus;
    if (hasOwn(input, "mascotDataUrl")) {
      try {
        normalized.mascotDataUrl = validateMascotDataUrl(input.mascotDataUrl);
      } catch {
        normalized.mascotDataUrl = null;
        normalized.mascotEnabled = false;
      }
    }
  }
  return Object.freeze(normalized);
}
function readPreferences(serialized) {
  try {
    return normalizePreferences(JSON.parse(serialized));
  } catch {
    return normalizePreferences(null);
  }
}
function storageError(error) {
  const quota = ["QuotaExceededError", "NS_ERROR_DOM_QUOTA_REACHED"].includes(error?.name);
  return new Error(quota ? "\u65E0\u6CD5\u4FDD\u5B58\u6821\u56ED\u4E3B\u9898\u8BBE\u7F6E\uFF1A\u672C\u5730\u5B58\u50A8\u7A7A\u95F4\u4E0D\u8DB3\uFF0C\u8BF7\u79FB\u9664\u53EE\u4E1C\u56FE\u7247\u6216\u6E05\u7406\u5B58\u50A8\u540E\u91CD\u8BD5\u3002" : "\u65E0\u6CD5\u4FDD\u5B58\u6821\u56ED\u4E3B\u9898\u8BBE\u7F6E\uFF1A\u6D4F\u89C8\u5668\u62D2\u7EDD\u8BBF\u95EE\u672C\u5730\u5B58\u50A8\uFF0C\u8BF7\u68C0\u67E5\u6D4F\u89C8\u5668\u8BBE\u7F6E\u540E\u91CD\u8BD5\u3002", { cause: error });
}
function createPreferencesStore({ storage, eventTarget } = {}) {
  const browser = typeof window === "undefined" ? void 0 : window;
  eventTarget ??= browser;
  if (storage === void 0) {
    try {
      storage = browser?.localStorage;
    } catch {
      storage = void 0;
    }
  }
  let snapshot;
  try {
    snapshot = readPreferences(storage?.getItem(STORAGE_KEY) ?? null);
  } catch {
    snapshot = normalizePreferences(null);
  }
  const listeners = /* @__PURE__ */ new Set();
  let disposed = false;
  function publish(next) {
    if (FIELDS.every((field) => snapshot[field] === next[field])) return;
    snapshot = next;
    for (const listener of [...listeners]) listener();
  }
  function write(operation) {
    if (disposed) throw new Error("\u6821\u56ED\u4E3B\u9898\u8BBE\u7F6E\u5DF2\u5173\u95ED\uFF0C\u65E0\u6CD5\u4FDD\u5B58\u66F4\u6539\u3002");
    try {
      if (!storage) throw new Error("Local storage unavailable");
      operation(storage);
    } catch (error) {
      throw storageError(error);
    }
  }
  function onStorage(event) {
    if (disposed || event.key !== STORAGE_KEY && event.key !== null) return;
    if (event.storageArea != null && event.storageArea !== storage) return;
    publish(event.key === null ? normalizePreferences(null) : readPreferences(event.newValue));
  }
  eventTarget?.addEventListener("storage", onStorage);
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      if (disposed) return () => {
      };
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    update(patch) {
      if (!patch || typeof patch !== "object" || Array.isArray(patch)) throw new TypeError("\u6821\u56ED\u4E3B\u9898\u8BBE\u7F6E\u5FC5\u987B\u662F\u6709\u6548\u7684\u8BBE\u7F6E\u5BF9\u8C61\u3002");
      if (hasOwn(patch, "mascotDataUrl")) validateMascotDataUrl(patch.mascotDataUrl);
      const next = normalizePreferences({ ...snapshot, ...patch });
      write((target) => target.setItem(STORAGE_KEY, JSON.stringify(next)));
      publish(next);
      return snapshot;
    },
    reset() {
      write((target) => target.removeItem(STORAGE_KEY));
      publish(normalizePreferences(null));
      return snapshot;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      eventTarget?.removeEventListener("storage", onStorage);
      listeners.clear();
    }
  };
}

// src/client/tokens.js
var pair = (light, dark) => ({ light, dark });
var THEME_TOKENS = Object.freeze({
  "--dsw-alias-bg-base": pair("#FAF9F3", "#19251E"),
  "--dsw-alias-bg-layer-1": pair("#FFFFFF", "#223227"),
  "--dsw-alias-bg-layer-2": pair("#F4F6F2", "#1B2820"),
  "--dsw-alias-bg-layer-3": pair("#EDF1E9", "#2C4030"),
  "--dsw-alias-bg-module-platform": pair("#F4F6F2", "#223227"),
  "--dsw-alias-bg-overlay": pair("#FFFFFF", "#223227"),
  "--dsw-alias-label-primary": pair("#202C23", "#E7EEE6"),
  "--dsw-alias-label-primary-bluish": pair("#202C23", "#E7EEE6"),
  "--dsw-alias-label-secondary": pair("#5E6D61", "#AFBDAF"),
  "--dsw-alias-label-tertiary": pair("#5E6D61", "#A2B3A4"),
  "--dsw-alias-label-caption": pair("#657361", "#A2B3A4"),
  "--dsw-alias-brand-primary": pair("#587558", "#B2CDAA"),
  "--dsw-alias-brand-text": pair("#3D603F", "#B2CDAA"),
  "--dsw-alias-state-business-primary": pair("#3D603F", "#B2CDAA"),
  "--dsw-alias-state-business-tertiary": pair("#DBE6D4", "#2C4330"),
  "--dsw-alias-link": pair("#3D603F", "#B2CDAA"),
  "--dsw-alias-button-primary-fill": pair("#3D603F", "#B2CDAA"),
  "--dsw-alias-button-primary-hover": pair("#304D32", "#C2D9BA"),
  // Unlike general primary buttons, the composer uses a white icon in both schemes.
  "--dsw-alias-button-info-fill": pair("#3D603F", "#3D603F"),
  "--dsw-alias-button-info-hover": pair("#304D32", "#4A6D4C"),
  "--dsw-alias-interactive-bg-hover": pair("#E7EDE2", "#2C4030"),
  "--dsw-alias-interactive-bg-hover-solid": pair("#E7EDE2", "#2C4030"),
  "--dsw-alias-interactive-bg-hover-accent": pair("#DBE6D4", "#314A35"),
  "--dsw-alias-interactive-bg-active": pair("#DBE6D4", "#314A35"),
  "--dsw-alias-border-l1": pair("#DAE2D6", "#35483A"),
  "--dsw-alias-border-l2": pair("#DAE2D6", "#35483A"),
  "--dsw-alias-border-l3": pair("#CFD9C9", "#3F5545"),
  "--dsw-alias-border-l4": pair("#BBCBB5", "#59705A"),
  "--dsw-alias-markdown-code-block": pair("#F2F5EF", "#111C15"),
  "--dsw-alias-markdown-code-block-banner": pair("#E7EDE2", "#223227"),
  "--dsw-alias-markdown-inline-code": pair("#E7EDE2", "#2C4030"),
  "--dsw-alias-settings-card-fill": pair("#F4F6F2", "#223227"),
  "--dsw-alias-settings-card-stroke": pair("#DAE2D6", "#35483A"),
  "--dsw-specific-sidebar-fill": pair("#E5EBDD", "#101A14"),
  "--dsw-specific-sidebar-nav-item-active": pair("#DBE6D4", "#314A35"),
  "--dsw-specific-sidebar-nav-item-active-accent": pair("#DBE6D4", "#314A35"),
  "--dsw-specific-sidebar-nav-item-hover": pair("#E7EDE2", "#223227"),
  "--dsw-specific-input-major": pair("#FFFFFF", "#223227"),
  "--dsw-specific-bubble": pair("#E7EFE1", "#2C402E"),
  "--dsw-specific-bubble-highlight": pair("#DBE6D4", "#314A35"),
  "--dsw-specific-menu": pair("#F4F6F2", "#223227"),
  "--dsw-specific-selector": pair("#E7EDE2", "#2C4030"),
  // MenuSurface reads this material token directly, including body-level portals.
  "--dsw-menu-surface-fill": pair("#F6F7EE", "#24382A"),
  "--dsw-alias-menu-group-header-fill": pair("#EDF1E2", "#2D4231"),
  "--dsw-alias-menu-icon": pair("#466548", "#C8D8BD"),
  "--dsw-alias-scrollbar-bg-l2": pair("#BBC9AC", "#4A6250"),
  "--dsw-alias-scrollbar-hover-l2": pair("#859B78", "#758E72")
});

// src/client/lifecycle.js
var PLUGIN_ID = "dsh-campus-seu";
function installAppearance(ctx, preferences, components, { onError = () => {
}, onReady = () => {
}, installDecorations = () => () => {
} } = {}) {
  let active = false;
  let disposers = [];
  let synchronizing = false;
  let disposed = false;
  function notify(callback, value) {
    try {
      callback(value);
    } catch {
    }
  }
  function clear() {
    active = false;
    const errors = [];
    for (const dispose of disposers.splice(0).reverse()) {
      try {
        dispose();
      } catch (error) {
        errors.push(error);
      }
    }
    return errors;
  }
  function fail(error) {
    const previousSync = synchronizing;
    synchronizing = true;
    const cleanupErrors = clear();
    let rollbackError;
    try {
      preferences.update({ enabled: false });
    } catch (failure) {
      rollbackError = failure;
    } finally {
      synchronizing = previousSync;
    }
    const detail = error instanceof Error ? error.message : String(error);
    let message = `\u6821\u56ED\u4E3B\u9898\u542F\u7528\u5931\u8D25\uFF1A${detail}\u3002${cleanupErrors.length ? "\u90E8\u5206\u5916\u89C2\u6E05\u7406\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u540E\u5173\u95ED\u4E3B\u9898\u3002" : "\u4E3B\u9898\u5916\u89C2\u5DF2\u5173\u95ED\u3002"}`;
    if (rollbackError) message += `\u5173\u95ED\u72B6\u6001\u672A\u80FD\u4FDD\u5B58\uFF1A${rollbackError.message ?? String(rollbackError)}\u3002\u8BF7\u4FEE\u590D\u5B58\u50A8\u95EE\u9898\u540E\u5173\u95ED\u4E3B\u9898\uFF0C\u907F\u514D\u5237\u65B0\u540E\u518D\u6B21\u5C1D\u8BD5\u542F\u7528\u3002`;
    notify(onError, new Error(message, { cause: error }));
  }
  function sync() {
    if (disposed || synchronizing) return;
    const enabled = preferences.getSnapshot().enabled;
    if (enabled === active) return;
    if (!enabled) {
      const errors = clear();
      if (errors.length) notify(onError, new Error("\u6821\u56ED\u4E3B\u9898\u7684\u90E8\u5206\u5916\u89C2\u6E05\u7406\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u3002", { cause: errors[0] }));
      else notify(onReady);
      return;
    }
    synchronizing = true;
    try {
      disposers.push(ctx.theme.overrideTokens(PLUGIN_ID, THEME_TOKENS));
      disposers.push(installDecorations());
      for (const [name, component] of Object.entries(components)) {
        disposers.push(ctx.slots.inject(name, () => {
          try {
            return ctx.slots.register({ name, priority: -50, inject: () => ({ preferences }) }, component);
          } catch (error) {
            if (synchronizing) throw error;
            fail(error);
            return () => {
            };
          }
        }));
      }
      active = true;
      notify(onReady);
    } catch (error) {
      fail(error);
    } finally {
      synchronizing = false;
    }
  }
  sync();
  const unsubscribe = preferences.subscribe(sync);
  return () => {
    if (disposed) return;
    disposed = true;
    unsubscribe();
    clear();
  };
}

// src/client/visuals.jsx
var import_react = __toESM(require("react"), 1);

// src/client/campus-data.js
var BUILTIN_MASCOT = "/dsh-campus-seu/assets/dingdong-rebuilt.png";
var CAMPUSES = {
  jiulonghu: {
    name: "\u4E5D\u9F99\u6E56\u6821\u533A",
    landmark: "\u674E\u6587\u6B63\u56FE\u4E66\u9986",
    year: "2020",
    width: 4032,
    height: 3024,
    src: "/dsh-campus-seu/assets/jiulonghu-library-2020.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Mochtar_riady_library_in_southeast_university_jiulonghu_campus.jpg",
    author: "\u6765\u65A4\u5C0F\u4ED3\u9F20\u5427",
    authorUrl: "https://commons.wikimedia.org/wiki/User:%E6%9D%A5%E6%96%A4%E5%B0%8F%E4%BB%93%E9%BC%A0%E5%90%A7",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    position: "50% 54%"
  },
  sipailou: {
    name: "\u56DB\u724C\u697C\u6821\u533A",
    landmark: "\u5927\u793C\u5802",
    year: "2012",
    width: 4320,
    height: 3240,
    src: "/dsh-campus-seu/assets/sipailou-auditorium-2012.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Auditorium_of_Southeast_University_01_2012-09.JPG",
    author: "\u732B\u732B\u7684\u65E5\u8BB0\u672C",
    authorUrl: "https://commons.wikimedia.org/wiki/User:%E7%8C%AB%E7%8C%AB%E7%9A%84%E6%97%A5%E8%AE%B0%E6%9C%AC",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    position: "50% 55%"
  }
};

// src/client/visuals.jsx
var EMBLEM = "/dsh-campus-seu/assets/seu-emblem-official.png";
function usePreferences(preferences) {
  const subscribe = (0, import_react.useCallback)((listener) => preferences.subscribe(listener), [preferences]);
  const getSnapshot = (0, import_react.useCallback)(() => preferences.getSnapshot(), [preferences]);
  return (0, import_react.useSyncExternalStore)(subscribe, getSnapshot, getSnapshot);
}
function CampusPhoto({ campus, mascot }) {
  const [failed, setFailed] = (0, import_react.useState)(false);
  return /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-landmark" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-photo" }, failed ? /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-photo-fallback", role: "img", "aria-label": `${campus.landmark}\u7167\u7247\u6682\u4E0D\u53EF\u7528` }, /* @__PURE__ */ import_react.default.createElement("span", null, campus.landmark), /* @__PURE__ */ import_react.default.createElement("small", null, "\u6821\u56ED\u7167\u7247\u6682\u4E0D\u53EF\u7528")) : /* @__PURE__ */ import_react.default.createElement("img", { src: campus.src, alt: `\u4E1C\u5357\u5927\u5B66${campus.name}${campus.landmark}`, width: campus.width, height: campus.height, style: { objectPosition: campus.position }, decoding: "async", onError: () => setFailed(true) })), /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-photo-caption" }, campus.landmark), mascot);
}
function Mascot({ dataUrl }) {
  const [failed, setFailed] = (0, import_react.useState)(false);
  const customImage = typeof dataUrl === "string" && /^data:image\/(?:png|jpeg|webp);base64,/i.test(dataUrl);
  const src = customImage ? dataUrl : BUILTIN_MASCOT;
  return /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-mascot", "data-custom": customImage || void 0, title: "\u53EE\u4E1C\u76F8\u4F34" }, failed ? /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-mascot-fallback" }, "\u53EE\u4E1C") : /* @__PURE__ */ import_react.default.createElement("img", { className: "dsh-seu-mascot-image", src, alt: customImage ? "\u81EA\u9009\u53EE\u4E1C\u5F62\u8C61" : "\u53EE\u4E1C\u6325\u624B\u76F8\u4F34", decoding: "async", onError: () => setFailed(true) }));
}
function HeroBrand({ preferences, size = 34 }) {
  const state = usePreferences(preferences);
  const campus = CAMPUSES[state.campus] ?? CAMPUSES.jiulonghu;
  if (state.showHero === false) return /* @__PURE__ */ import_react.default.createElement(SidebarMark, { size });
  return /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-hero", role: "region", "aria-label": "\u4E1C\u5357\u5927\u5B66\u6821\u56ED\u6B22\u8FCE\u5361" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-hero-card" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-hero-copy" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-signature" }, /* @__PURE__ */ import_react.default.createElement(SidebarMark, { size: 64 }), /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-wordmark" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-hero-title", role: "heading", "aria-level": "2" }, "\u4E1C\u5357\u5927\u5B66"), /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-eyebrow" }, "SOUTHEAST UNIVERSITY"))), state.showMotto && /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-motto" }, "\u6B62\u4E8E\u81F3\u5584"), /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-hero-location" }, /* @__PURE__ */ import_react.default.createElement("span", null, campus.name), /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-since" }, "SINCE 1902"))), /* @__PURE__ */ import_react.default.createElement(CampusPhoto, { key: campus.src, campus, mascot: state.mascotEnabled && /* @__PURE__ */ import_react.default.createElement(Mascot, { key: state.mascotDataUrl || "built-in", dataUrl: state.mascotDataUrl }) })));
}
function SidebarName({ preferences }) {
  const state = usePreferences(preferences);
  const campus = CAMPUSES[state.campus] ?? CAMPUSES.jiulonghu;
  return /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-sidebar-name", title: `\u4E1C\u5357\u5927\u5B66 \xB7 ${campus.name}` }, /* @__PURE__ */ import_react.default.createElement("span", null, "\u4E1C\u5357\u5927\u5B66"), /* @__PURE__ */ import_react.default.createElement("small", null, "SOUTHEAST UNIVERSITY"));
}
function SidebarMark({ size = 24 }) {
  const [failed, setFailed] = (0, import_react.useState)(false);
  const edge = Number.isFinite(size) ? Math.max(16, Math.min(size, 64)) : 24;
  return failed ? /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-mark-fallback", role: "img", "aria-label": "\u4E1C\u5357\u5927\u5B66\u4E3B\u9898", style: { width: edge, height: edge } }, "SEU") : /* @__PURE__ */ import_react.default.createElement("img", { className: "dsh-seu-emblem", src: EMBLEM, width: edge, height: edge, alt: "\u4E1C\u5357\u5927\u5B66\u6821\u5FBD", decoding: "async", onError: () => setFailed(true) });
}
function CampusFooter({ preferences, wide }) {
  const state = usePreferences(preferences);
  if (!wide || !state.enabled) return null;
  const campus = CAMPUSES[state.campus] ?? CAMPUSES.jiulonghu;
  return /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-campus-plaque" }, /* @__PURE__ */ import_react.default.createElement("span", null, /* @__PURE__ */ import_react.default.createElement("strong", null, state.showMotto ? "\u6B62\u4E8E\u81F3\u5584" : "\u4E1C\u5357\u5927\u5B66"), /* @__PURE__ */ import_react.default.createElement("small", null, "\u4E1C\u5357\u5927\u5B66 \xB7 ", campus.name)), /* @__PURE__ */ import_react.default.createElement("span", { className: "dsh-seu-plaque-year" }, "1902"));
}

// src/client/settings.jsx
var import_react4 = __toESM(require("react"), 1);

// src/client/campus-picker.jsx
var import_react2 = __toESM(require("react"), 1);
var CAMPUSES2 = [
  { value: "jiulonghu", title: "\u4E5D\u9F99\u6E56\u6821\u533A", description: "\u674E\u6587\u6B63\u56FE\u4E66\u9986", image: "/dsh-campus-seu/assets/jiulonghu-library-2020.jpg", position: "50% 54%", fallback: "\u6E56" },
  { value: "sipailou", title: "\u56DB\u724C\u697C\u6821\u533A", description: "\u5927\u793C\u5802", image: "/dsh-campus-seu/assets/sipailou-auditorium-2012.jpg", position: "50% 55%", fallback: "\u5802" }
];
function Thumbnail({ campus }) {
  const [failed, setFailed] = (0, import_react2.useState)(false);
  return /* @__PURE__ */ import_react2.default.createElement("span", { className: "dsh-seu-campus-thumbnail", "aria-hidden": "true" }, failed ? /* @__PURE__ */ import_react2.default.createElement("span", null, campus.fallback) : /* @__PURE__ */ import_react2.default.createElement("img", { src: campus.image, alt: "", style: { objectPosition: campus.position }, decoding: "async", onError: () => setFailed(true) }));
}
function Check() {
  return /* @__PURE__ */ import_react2.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ import_react2.default.createElement("path", { d: "m3 8 3 3 7-7", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" }));
}
function CampusPicker({ value, onChange }) {
  const selectedIndex = Math.max(0, CAMPUSES2.findIndex((campus) => campus.value === value));
  const selected = CAMPUSES2[selectedIndex];
  const [open, setOpen] = (0, import_react2.useState)(false);
  const [active, setActive] = (0, import_react2.useState)(selectedIndex);
  const [placement, setPlacement] = (0, import_react2.useState)({ direction: "down", maxHeight: 240, ready: false });
  const root = (0, import_react2.useRef)(null);
  const trigger = (0, import_react2.useRef)(null);
  const list = (0, import_react2.useRef)(null);
  const rows = (0, import_react2.useRef)([]);
  const id = (0, import_react2.useId)();
  const listId = `${id}-campus-list`;
  function close(restoreFocus = true) {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus({ preventScroll: true });
  }
  function show(index = selectedIndex) {
    setActive(index);
    setPlacement((previous) => ({ ...previous, ready: false }));
    setOpen(true);
  }
  function choose(index) {
    try {
      onChange(CAMPUSES2[index].value);
    } finally {
      close();
    }
  }
  (0, import_react2.useLayoutEffect)(() => {
    if (!open) return;
    const popup = list.current;
    const button = trigger.current;
    if (!popup || !button) return;
    const place = () => {
      const rect = button.getBoundingClientRect();
      const viewport = window.visualViewport;
      let top = (viewport?.offsetTop ?? 0) + 8;
      let bottom = (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight) - 8;
      for (let ancestor = root.current?.parentElement; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
        if (!/(auto|scroll|hidden|clip)/.test(getComputedStyle(ancestor).overflowY)) continue;
        const bounds = ancestor.getBoundingClientRect();
        top = Math.max(top, bounds.top + ancestor.clientTop + 4);
        bottom = Math.min(bottom, bounds.top + ancestor.clientTop + ancestor.clientHeight - 4);
      }
      const gap = 7;
      const below = Math.max(0, bottom - rect.bottom - gap);
      const above = Math.max(0, rect.top - top - gap);
      const desired = popup.scrollHeight + 2;
      const direction = below < desired && above > below ? "up" : "down";
      const maxHeight = Math.floor(direction === "up" ? above : below);
      setPlacement((previous) => previous.ready && previous.direction === direction && previous.maxHeight === maxHeight ? previous : { direction, maxHeight, ready: true });
    };
    place();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(place);
    observer?.observe(button);
    observer?.observe(popup);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    window.visualViewport?.addEventListener("resize", place);
    window.visualViewport?.addEventListener("scroll", place);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      window.visualViewport?.removeEventListener("resize", place);
      window.visualViewport?.removeEventListener("scroll", place);
    };
  }, [open]);
  (0, import_react2.useLayoutEffect)(() => {
    if (open && placement.ready) list.current?.focus({ preventScroll: true });
  }, [open, placement.ready]);
  (0, import_react2.useLayoutEffect)(() => {
    if (!open || !placement.ready) return;
    const popup = list.current;
    const row = rows.current[active];
    if (!popup || !row) return;
    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < popup.scrollTop) popup.scrollTop = top;
    else if (bottom > popup.scrollTop + popup.clientHeight) popup.scrollTop = bottom - popup.clientHeight;
  }, [active, open, placement.ready, placement.maxHeight]);
  (0, import_react2.useEffect)(() => {
    if (!open) return;
    const outside = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
    };
  }, [open]);
  function onListKeyDown(event) {
    if (event.key === "Tab") {
      close();
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End", "Enter", " ", "Escape"].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.key === "Escape") close();
    else if (event.key === "Enter" || event.key === " ") choose(active);
    else setActive((index) => event.key === "Home" ? 0 : event.key === "End" ? CAMPUSES2.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + CAMPUSES2.length) % CAMPUSES2.length);
  }
  return /* @__PURE__ */ import_react2.default.createElement("span", { ref: root, className: "dsh-seu-campus-picker" }, /* @__PURE__ */ import_react2.default.createElement("button", { ref: trigger, type: "button", className: "dsh-seu-campus-trigger", "aria-label": "\u5C55\u793A\u6821\u533A", "aria-description": `\u5F53\u524D\uFF1A${selected.title}\uFF0C${selected.description}`, "aria-haspopup": "listbox", "aria-expanded": open, "aria-controls": open ? listId : void 0, onClick: () => open ? close(false) : show(), onKeyDown: (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    show(event.key === "Home" ? 0 : event.key === "End" ? CAMPUSES2.length - 1 : selectedIndex);
  } }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "dsh-seu-campus-trigger-dot", "aria-hidden": "true" }), /* @__PURE__ */ import_react2.default.createElement("span", { className: "dsh-seu-campus-trigger-copy" }, /* @__PURE__ */ import_react2.default.createElement("span", null, selected.title), /* @__PURE__ */ import_react2.default.createElement("span", null, selected.description)), /* @__PURE__ */ import_react2.default.createElement("svg", { className: "dsh-seu-campus-chevron", "data-open": open || void 0, width: "15", height: "15", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ import_react2.default.createElement("path", { d: "m4 6 4 4 4-4", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }))), open && /* @__PURE__ */ import_react2.default.createElement("span", { ref: list, className: "dsh-seu-campus-list", id: listId, role: "listbox", "aria-label": "\u5C55\u793A\u6821\u533A", "aria-activedescendant": `${id}-campus-${active}`, tabIndex: -1, "data-direction": placement.direction, style: { maxHeight: placement.maxHeight, visibility: placement.ready ? void 0 : "hidden" }, onKeyDown: onListKeyDown }, CAMPUSES2.map((campus, index) => /* @__PURE__ */ import_react2.default.createElement("button", { ref: (element) => {
    rows.current[index] = element;
  }, type: "button", role: "option", id: `${id}-campus-${index}`, key: campus.value, className: "dsh-seu-campus-option", tabIndex: -1, "aria-selected": campus.value === value, "data-active": index === active || void 0, onPointerMove: () => setActive(index), onMouseDown: (event) => event.preventDefault(), onClick: () => choose(index) }, /* @__PURE__ */ import_react2.default.createElement(Thumbnail, { campus }), /* @__PURE__ */ import_react2.default.createElement("span", { className: "dsh-seu-campus-option-copy" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "dsh-seu-campus-option-title" }, campus.title), /* @__PURE__ */ import_react2.default.createElement("span", { className: "dsh-seu-campus-option-description" }, campus.description)), /* @__PURE__ */ import_react2.default.createElement("span", { className: "dsh-seu-campus-check", "aria-hidden": "true" }, campus.value === value && /* @__PURE__ */ import_react2.default.createElement(Check, null))))));
}

// src/client/material-sources.jsx
var import_react3 = __toESM(require("react"), 1);
function Link({ href, children }) {
  return /* @__PURE__ */ import_react3.default.createElement("a", { href, target: "_blank", rel: "noopener noreferrer" }, children);
}
function MaterialSources() {
  return /* @__PURE__ */ import_react3.default.createElement("details", { className: "dsh-seu-sources" }, /* @__PURE__ */ import_react3.default.createElement("summary", null, "\u7D20\u6750\u4E0E\u7F72\u540D"), /* @__PURE__ */ import_react3.default.createElement("p", null, "\u6821\u56ED\u7167\u7247\u3001\u5B66\u6821\u6807\u8BC6\u548C\u53EE\u4E1C\u5F62\u8C61\u7684\u6765\u6E90\u96C6\u4E2D\u5217\u5728\u8FD9\u91CC\u3002\u6B64\u4E3B\u9898\u7531\u72EC\u7ACB\u5F00\u53D1\u8005\u5236\u4F5C\u3002"), Object.entries(CAMPUSES).map(([id, campus]) => /* @__PURE__ */ import_react3.default.createElement("section", { key: id }, /* @__PURE__ */ import_react3.default.createElement("h3", null, campus.name, " \xB7 ", campus.landmark), /* @__PURE__ */ import_react3.default.createElement("p", null, /* @__PURE__ */ import_react3.default.createElement(Link, { href: campus.source }, "Wikimedia Commons \u539F\u4F5C\u54C1"), " \xB7 ", /* @__PURE__ */ import_react3.default.createElement(Link, { href: campus.authorUrl }, campus.author), "\u6444\uFF0C", campus.year, " \u5E74 \xB7 ", /* @__PURE__ */ import_react3.default.createElement(Link, { href: campus.licenseUrl }, campus.license), "\u3002"), /* @__PURE__ */ import_react3.default.createElement("p", null, "\u539F\u59CB\u7167\u7247 ", campus.width, " \xD7 ", campus.height, "\uFF0C\u6587\u4EF6\u672A\u6539\u5199\u3002\u6B22\u8FCE\u5361\u4E0E\u7F29\u7565\u56FE\u6309\u5BB9\u5668\u9002\u914D\u88C1\u5207\uFF1B\u5F00\u542F\u53EE\u4E1C\u65F6\u4F1A\u53E0\u52A0\u89D2\u8272\u56FE\u5C42\u3002"))), /* @__PURE__ */ import_react3.default.createElement("section", null, /* @__PURE__ */ import_react3.default.createElement("h3", null, "\u6821\u5FBD\u3001\u6821\u540D\u3001\u6821\u8BAD\u4E0E\u914D\u8272"), /* @__PURE__ */ import_react3.default.createElement("p", null, "\u5B8C\u6574\u6821\u5FBD\u6765\u81EA", /* @__PURE__ */ import_react3.default.createElement(Link, { href: "https://www.seu.edu.cn/p47316c47313/list.psp" }, "\u4E1C\u5357\u5927\u5B66\u5B98\u7F51"), "\uFF0C\u4FDD\u6301\u539F\u8272\u548C\u5B8C\u6574\u6BD4\u4F8B\u3002\u6821\u540D\u4E0E", /* @__PURE__ */ import_react3.default.createElement(Link, { href: "https://history.seu.edu.cn/18738/list.htm" }, "\u300C\u6B62\u4E8E\u81F3\u5584\u300D\u6821\u8BAD"), "\u4F7F\u7528\u7CFB\u7EDF\u5B57\u4F53\u6392\u5199\uFF1B\u6821\u56ED\u7EFF\u4E0E\u9EC4\u8272\u53C2\u8003", /* @__PURE__ */ import_react3.default.createElement(Link, { href: "https://www.seu.edu.cn/scgf/list.htm" }, "\u5B66\u6821\u8272\u5F69\u89C4\u8303"), "\uFF0C\u754C\u9762\u989C\u8272\u53E6\u4F5C\u660E\u6697\u9002\u914D\u3002")), /* @__PURE__ */ import_react3.default.createElement("section", null, /* @__PURE__ */ import_react3.default.createElement("h3", null, "\u53EE\u4E1C \xB7 \u4E3B\u9898\u91CD\u5EFA\u5F62\u8C61"), /* @__PURE__ */ import_react3.default.createElement("p", null, "\u53C2\u7167\u73B0\u6709", /* @__PURE__ */ import_react3.default.createElement(Link, { href: "https://kknews.cc/zh-sg/education/25znl59.html" }, "2020 \u5E74\u53EE\u4E1C\u5168\u8EAB\u5F62\u8C61\u8F6C\u8F7D\u56FE"), "\uFF0C\u4F7F\u7528 AI \u91CD\u5EFA\u4E3A\u900F\u660E\u80CC\u666F\u7684\u6325\u624B\u5355\u4F53\u3002\u89D2\u8272\u53D1\u5E03\u7EBF\u7D22\u89C1", /* @__PURE__ */ import_react3.default.createElement(Link, { href: "https://m.thepaper.cn/baijiahao_8352219" }, "\u4E1C\u5357\u5927\u5B66\u5B98\u65B9\u53D1\u5E03\u4ECB\u7ECD"), "\u3002"), /* @__PURE__ */ import_react3.default.createElement("p", null, "\u4FDD\u7559\u6A59\u7EA2\u677E\u9F20\u3001\u767D\u8272\u8138\u8179\u3001\u6DF1\u84DD\u4E0A\u8863\u548C\u5927\u5C3E\u5DF4\uFF1B\u91CD\u5EFA\u56FE\u5E76\u975E\u5B98\u65B9\u6807\u51C6\u56FE\u7A3F\u3002\u81EA\u9009\u56FE\u7247\u4EC5\u5B58\u4E8E\u5F53\u524D\u6D4F\u89C8\u5668\uFF0C\u4E0D\u4E0A\u4F20\u3002")), /* @__PURE__ */ import_react3.default.createElement("p", null, "\u6444\u5F71\u8BB8\u53EF\u4EC5\u9002\u7528\u4E8E\u5BF9\u5E94\u7167\u7247\u3002\u6821\u5FBD\u3001\u5B66\u6821\u54C1\u724C\u53CA\u53EE\u4E1C\u89D2\u8272\u7684\u6743\u5229\u4ECD\u5F52\u5404\u81EA\u6743\u5229\u4EBA\uFF1B\u672C\u5730\u4E3B\u9898\u5C55\u793A\u4E0E AI \u91CD\u5EFA\u4E0D\u4EE3\u8868\u5B98\u65B9\u6388\u6743\uFF0C\u4E5F\u4E0D\u8D4B\u4E88\u989D\u5916\u518D\u5206\u53D1\u6743\u3002"));
}

// src/client/settings.jsx
function Toggle({ label, description, checked, disabled, onChange }) {
  return /* @__PURE__ */ import_react4.default.createElement("label", { className: "dsh-seu-setting-row" }, /* @__PURE__ */ import_react4.default.createElement("span", null, /* @__PURE__ */ import_react4.default.createElement("strong", null, label), /* @__PURE__ */ import_react4.default.createElement("small", null, description)), /* @__PURE__ */ import_react4.default.createElement("input", { type: "checkbox", role: "switch", "aria-label": label, checked, disabled, onChange: (event) => onChange(event.target.checked) }));
}
function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("\u65E0\u6CD5\u8BFB\u53D6\u56FE\u7247\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u3002"));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}
async function decodeImage(dataUrl) {
  const image = new Image();
  image.src = dataUrl;
  try {
    await image.decode();
  } catch {
    throw new Error("\u8FD9\u5F20\u56FE\u7247\u65E0\u6CD5\u6253\u5F00\uFF0C\u8BF7\u9009\u62E9\u6709\u6548\u7684 PNG\u3001JPEG \u6216 WebP\u3002");
  }
  if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 4e7) throw new Error("\u56FE\u7247\u5C3A\u5BF8\u8FC7\u5927\u6216\u65E0\u6548\uFF0C\u8BF7\u4F7F\u7528\u4E0D\u8D85\u8FC7 4000 \u4E07\u50CF\u7D20\u7684\u56FE\u7247\u3002");
}
function SettingsPage({ preferences, appearanceStatus }) {
  const state = (0, import_react4.useSyncExternalStore)(preferences.subscribe, preferences.getSnapshot, preferences.getSnapshot);
  const appearanceError = (0, import_react4.useSyncExternalStore)(appearanceStatus.subscribe, appearanceStatus.getSnapshot, appearanceStatus.getSnapshot);
  const [notice, setNotice] = (0, import_react4.useState)("");
  const [error, setError] = (0, import_react4.useState)("");
  const [busy, setBusy] = (0, import_react4.useState)(false);
  const revision = (0, import_react4.useRef)(0);
  const picker = (0, import_react4.useRef)(null);
  (0, import_react4.useEffect)(() => () => {
    revision.current += 1;
  }, []);
  function update(patch) {
    try {
      preferences.update(patch);
      setError("");
      setNotice("\u5DF2\u4FDD\u5B58\u5230\u5F53\u524D\u6D4F\u89C8\u5668");
    } catch (failure) {
      setNotice("");
      setError(failure.message);
    }
  }
  async function selectImage(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const current = ++revision.current;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (file.size > MAX_MASCOT_BYTES) throw new Error("\u56FE\u7247\u4E0D\u80FD\u8D85\u8FC7 512 KiB\uFF0C\u8BF7\u9009\u62E9\u66F4\u5C0F\u7684\u56FE\u7247\u3002");
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) throw new Error("\u8BF7\u9009\u62E9 PNG\u3001JPEG \u6216 WebP \u56FE\u7247\u3002");
      const dataUrl = validateMascotDataUrl(await readImage(file));
      await decodeImage(dataUrl);
      if (current !== revision.current) return;
      update({ mascotDataUrl: dataUrl, mascotEnabled: true });
    } catch (failure) {
      if (current === revision.current) setError(failure.message);
    } finally {
      if (current === revision.current) setBusy(false);
    }
  }
  function reset() {
    revision.current += 1;
    setBusy(false);
    try {
      preferences.reset();
      setError("");
      setNotice("\u5DF2\u6062\u590D\u6821\u56ED\u4E3B\u9898\u9ED8\u8BA4\u8BBE\u7F6E");
    } catch (failure) {
      setNotice("");
      setError(failure.message);
    }
  }
  return /* @__PURE__ */ import_react4.default.createElement("section", { className: "dsh-seu-settings", "aria-label": "\u6821\u56ED\u4E3B\u9898(SEU)\u8BBE\u7F6E" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "dsh-seu-settings-inner" }, /* @__PURE__ */ import_react4.default.createElement("header", { className: "dsh-seu-settings-header" }, /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("p", { className: "dsh-seu-settings-eyebrow" }, "SOUTHEAST UNIVERSITY"), /* @__PURE__ */ import_react4.default.createElement("h1", null, "\u6821\u56ED\u4E3B\u9898(SEU)"), /* @__PURE__ */ import_react4.default.createElement("p", null, "\u8BA9\u719F\u6089\u7684\u6821\u56ED\uFF0C\u966A\u4F34\u6BCF\u4E00\u6B21\u63A2\u7D22\u3002"))), appearanceError && /* @__PURE__ */ import_react4.default.createElement("p", { className: "dsh-seu-setting-error", role: "alert" }, appearanceError), /* @__PURE__ */ import_react4.default.createElement("div", { className: "dsh-seu-setting-group" }, /* @__PURE__ */ import_react4.default.createElement(Toggle, { label: "\u542F\u7528\u6821\u56ED\u4E3B\u9898", description: "\u5E94\u7528\u6821\u56ED\u914D\u8272\u4E0E\u54C1\u724C\u533A\u57DF\uFF1B\u5173\u95ED\u540E\u6062\u590D\u539F\u6709\u5916\u89C2\u3002", checked: state.enabled, onChange: (enabled) => update({ enabled }) }), /* @__PURE__ */ import_react4.default.createElement("p", { className: "dsh-seu-setting-note" }, "\u914D\u8272\u8DDF\u968F DSH \u7684\u6D45\u8272\u3001\u6DF1\u8272\u6216\u7CFB\u7EDF\u8BBE\u7F6E\uFF0C\u53EF\u5728\u300C\u8BBE\u7F6E \u2192 \u901A\u7528\u8BBE\u7F6E \u2192 \u5916\u89C2\u300D\u4E2D\u5207\u6362\u3002")), /* @__PURE__ */ import_react4.default.createElement("div", { className: "dsh-seu-setting-group" }, /* @__PURE__ */ import_react4.default.createElement("h2", null, "\u6821\u56ED\u98CE\u666F"), /* @__PURE__ */ import_react4.default.createElement("div", { className: "dsh-seu-setting-row" }, /* @__PURE__ */ import_react4.default.createElement("span", null, /* @__PURE__ */ import_react4.default.createElement("strong", null, "\u5C55\u793A\u6821\u533A"), /* @__PURE__ */ import_react4.default.createElement("small", null, "\u4F7F\u7528\u6709\u6765\u6E90\u8BB0\u5F55\u7684\u6821\u56ED\u5EFA\u7B51\u7167\u7247\u3002")), /* @__PURE__ */ import_react4.default.createElement(CampusPicker, { value: state.campus, onChange: (campus) => update({ campus }) })), /* @__PURE__ */ import_react4.default.createElement(Toggle, { label: "\u663E\u793A\u6821\u56ED\u6B22\u8FCE\u5361", description: "\u5728\u65B0\u5BF9\u8BDD\u4E2D\u5C55\u793A\u6821\u533A\u7167\u7247\u3002", checked: state.showHero, onChange: (showHero) => update({ showHero }) }), /* @__PURE__ */ import_react4.default.createElement(Toggle, { label: "\u663E\u793A\u6821\u8BAD", description: "\u5728\u6B22\u8FCE\u5361\u4E0E\u4FA7\u680F\u94ED\u724C\u4E2D\u5C55\u793A\u300C\u6B62\u4E8E\u81F3\u5584\u300D\u3002", checked: state.showMotto, onChange: (showMotto) => update({ showMotto }) })), /* @__PURE__ */ import_react4.default.createElement("div", { className: "dsh-seu-setting-group" }, /* @__PURE__ */ import_react4.default.createElement("h2", null, "\u53EE\u4E1C\u76F8\u4F34 ", /* @__PURE__ */ import_react4.default.createElement("span", { className: "dsh-seu-optional" }, "\u53EF\u9009")), /* @__PURE__ */ import_react4.default.createElement(Toggle, { label: "\u663E\u793A\u53EE\u4E1C", description: state.showHero ? "\u8BA9\u53EE\u4E1C\u51FA\u73B0\u5728\u6821\u56ED\u98CE\u666F\u91CC\uFF0C\u53EF\u968F\u65F6\u5173\u95ED\u3002" : "\u5F00\u542F\u6821\u56ED\u6B22\u8FCE\u5361\u540E\uFF0C\u53EF\u5728\u98CE\u666F\u4E2D\u663E\u793A\u53EE\u4E1C\u3002", checked: state.mascotEnabled, disabled: !state.showHero, onChange: (mascotEnabled) => update({ mascotEnabled }) }), /* @__PURE__ */ import_react4.default.createElement("div", { className: "dsh-seu-image-setting" }, /* @__PURE__ */ import_react4.default.createElement("img", { src: state.mascotDataUrl || BUILTIN_MASCOT, alt: state.mascotDataUrl ? "\u5DF2\u9009\u62E9\u7684\u53EE\u4E1C\u56FE\u7247" : "\u5185\u7F6E\u53EE\u4E1C\u91CD\u5EFA\u5F62\u8C61\u9884\u89C8" }), /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("strong", null, state.mascotDataUrl ? "\u81EA\u9009\u5F62\u8C61" : "\u5185\u7F6E\u6325\u624B\u5F62\u8C61"), /* @__PURE__ */ import_react4.default.createElement("div", { className: "dsh-seu-button-row" }, /* @__PURE__ */ import_react4.default.createElement("button", { className: "dsh-seu-button", disabled: busy, onClick: () => picker.current?.click() }, busy ? "\u6B63\u5728\u8BFB\u53D6\u2026" : state.mascotDataUrl ? "\u66F4\u6362\u672C\u5730\u56FE\u7247" : "\u66FF\u6362\u4E3A\u672C\u5730\u56FE\u7247"), state.mascotDataUrl && /* @__PURE__ */ import_react4.default.createElement("button", { className: "dsh-seu-button", disabled: busy, onClick: () => update({ mascotDataUrl: null }) }, "\u6062\u590D\u5185\u7F6E\u5F62\u8C61")), /* @__PURE__ */ import_react4.default.createElement("p", { className: "dsh-seu-setting-note" }, "\u672C\u5730\u66FF\u6362\u652F\u6301 PNG\u3001JPEG\u3001WebP\uFF0C\u6700\u5927 512 KiB\u3002"))), /* @__PURE__ */ import_react4.default.createElement("input", { ref: picker, className: "dsh-seu-file-input", type: "file", accept: "image/png,image/jpeg,image/webp", "aria-label": "\u9009\u62E9\u53EE\u4E1C\u56FE\u7247", onChange: selectImage })), /* @__PURE__ */ import_react4.default.createElement("div", { className: "dsh-seu-save-status", "aria-live": "polite" }, error ? /* @__PURE__ */ import_react4.default.createElement("p", { role: "alert", className: "dsh-seu-setting-error" }, error) : /* @__PURE__ */ import_react4.default.createElement("p", { role: "status" }, notice || "\u8BBE\u7F6E\u5373\u65F6\u751F\u6548\uFF0C\u4EC5\u5E94\u7528\u4E8E\u5F53\u524D\u6D4F\u89C8\u5668\u3002")), /* @__PURE__ */ import_react4.default.createElement(MaterialSources, null), /* @__PURE__ */ import_react4.default.createElement("footer", { className: "dsh-seu-settings-footer" }, /* @__PURE__ */ import_react4.default.createElement("button", { className: "dsh-seu-button", onClick: reset }, "\u6062\u590D\u4E3B\u9898\u9ED8\u8BA4\u8BBE\u7F6E"))));
}

// src/client/visual-style.js
var css = `
.dsh-seu-hero {
  --dsh-seu-card-surface: var(--dsw-specific-input-major, #fff);
  --dsh-seu-card-edge: var(--dsw-alias-border-l2, #dbe3d8);
  --dsh-seu-quiet: var(--dsw-alias-label-secondary, #62725f);
  box-sizing: border-box; display: block; min-width: 0;
  width: max(0px, calc(min(var(--dsh-composer-card-max-width, 712px), calc(var(--dsh-conversation-column-width, 100vw) - 32px)) - 24px));
  max-width: min(928px, max(0px, calc(var(--dsh-conversation-column-width, 100vw) - 72px)));
  margin-block: 0 8px; color: var(--dsw-alias-label-primary); font-family: inherit; font-size: 12px; font-weight: 400; line-height: 1.5; text-align: left; white-space: normal;
  container-type: inline-size; container-name: dsh-seu-welcome;
}
.dsh-seu-hero *, .dsh-seu-hero *::before, .dsh-seu-hero *::after { box-sizing: border-box; }
.dsh-seu-hero-card { display: grid; grid-template-columns: minmax(0, .93fr) minmax(0, 1.07fr); overflow: hidden; border: 1px solid #587558; border-top: 3px solid #fdd000; border-radius: 16px; background: #314f3b; box-shadow: 0 8px 28px #1d3a2410; }
.dsh-seu-hero-copy { display: flex; min-width: 0; flex-direction: column; justify-content: center; padding: 24px 22px; color: #fffaf0; background: linear-gradient(135deg,#4b694e,#2c4936); }
.dsh-seu-signature { display: flex; align-items: center; gap: 13px; min-width: 0; }
.dsh-seu-wordmark { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
.dsh-seu-emblem { display: block; flex: none; object-fit: contain; }
.dsh-seu-hero-title { font-family: "Songti SC", "STSong", "Noto Serif CJK SC", serif; font-size: clamp(26px, 4.5cqw, 32px); font-weight: 600; line-height: 1.2; letter-spacing: .07em; white-space: nowrap; }
.dsh-seu-eyebrow { color: #e0e8d8; font-size: 7px; font-weight: 600; letter-spacing: .11em; line-height: 1.4; }
.dsh-seu-motto { align-self: flex-start; margin-top: 21px; border-left: 2px solid #fdd000; padding-left: 13px; font-family: "Songti SC", "STSong", serif; color: #f5e5a0; font-size: 23px; line-height: 1.2; letter-spacing: .22em; }
.dsh-seu-hero-location { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; margin-top: 19px; color: #e0e8d8; font-size: 11px; }
.dsh-seu-since { color: #e4d58e; font-size: 8px; letter-spacing: .11em; }
.dsh-seu-landmark { position: relative; display: flex; min-width: 0; flex-direction: column; }
.dsh-seu-photo { display: block; flex: 1; min-width: 0; height: 204px; overflow: hidden; background: var(--dsw-alias-bg-layer-2); }
.dsh-seu-photo > img { display: block; width: 100%; height: 100%; object-fit: cover; }
.dsh-seu-photo-caption { position: absolute; left: 12px; bottom: 12px; padding: 4px 9px; border: 1px solid #ffffff30; border-radius: 6px; color: #fffaf0; background: #203829c9; font-size: 10px; backdrop-filter: blur(8px); }
.dsh-seu-photo-fallback { display: flex; height: 100%; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 16px; color: var(--dsh-seu-quiet); text-align: center; }
.dsh-seu-photo-fallback > span { font-size: 15px; }
.dsh-seu-photo-fallback > small { font-size: 11px; }
.dsh-seu-mascot { position: absolute; right: 9px; bottom: 2px; display: block; width: 148px; height: 164px; pointer-events: none; }
.dsh-seu-mascot-image { display: block; width: 100%; height: 100%; object-fit: contain; object-position: center bottom; filter: drop-shadow(0 5px 5px #102b2840); }
.dsh-seu-mascot[data-custom] { width: 128px; height: 128px; right: 12px; bottom: 12px; }
.dsh-seu-mascot-fallback { display: block; width: max-content; margin: 60px auto 0; padding: 6px 12px; border-radius: 20px; background: #fff5de; color: #734e26; }
.dsh-seu-sidebar-name { display: inline-flex; min-width: 0; flex-direction: column; align-items: flex-start; gap: 3px; color: var(--dsw-alias-label-primary); line-height: 1; white-space: nowrap; }
.dsh-seu-sidebar-name > span { font-family: "Songti SC", "STSong", serif; overflow: hidden; text-overflow: ellipsis; font-size: 19px; font-weight: 700; letter-spacing: .12em; }
.dsh-seu-sidebar-name > small { color: var(--dsw-alias-label-secondary); font-size: 6px; font-weight: 600; letter-spacing: .07em; }
.dsh-seu-mark-fallback { display: inline-flex; align-items: center; justify-content: center; flex: none; border-radius: 50%; background: #fdd000; color: #231815; font-size: 9px; font-weight: 700; }
.dsh-seu-campus-plaque { box-sizing: border-box; display: flex; width: 100%; min-width: 0; align-items: center; justify-content: space-between; gap: 12px; margin: 0 0 10px; padding: 14px 12px; border-top: 2px solid #d8ba39; border-radius: 10px; background: #3b5941; color: #f8f5dd; }
.dsh-seu-campus-plaque > span:first-child { display: flex; min-width: 0; flex-direction: column; gap: 6px; }
.dsh-seu-campus-plaque strong { font-family: "Songti SC", "STSong", serif; font-weight: 500; font-size: 19px; line-height: 1.2; letter-spacing: .16em; }
.dsh-seu-campus-plaque small { color: #dce6d4; font-size: 9px; }
.dsh-seu-plaque-year { font-family: Georgia, serif; font-size: 23px; letter-spacing: -.04em; color: #e9d484; }
@container dsh-seu-welcome (max-width: 480px) {
  .dsh-seu-hero-card { grid-template-columns: minmax(0, 1fr); border-radius: 14px; }
  .dsh-seu-hero-copy { padding: 16px 18px; }
  .dsh-seu-signature { gap: 12px; }
  .dsh-seu-signature > .dsh-seu-emblem { width: 46px; height: 46px; }
  .dsh-seu-hero-title { font-size: 27px; }
  .dsh-seu-eyebrow { font-size: 6px; }
  .dsh-seu-motto { margin-top: 12px; padding-left: 10px; font-size: 19px; }
  .dsh-seu-hero-location { margin-top: 10px; font-size: 10px; }
  .dsh-seu-photo { height: 158px; }
  .dsh-seu-photo-caption { left: 9px; bottom: 9px; font-size: 9px; }
  .dsh-seu-mascot { width: 112px; height: 128px; right: 5px; }
  .dsh-seu-mascot[data-custom] { width: 96px; height: 96px; right: 9px; bottom: 9px; }
}
@media (max-height: 640px) {
  .dsh-seu-hero-card { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
  .dsh-seu-hero-copy { padding: 11px; }
  .dsh-seu-signature { gap: 7px; }
  .dsh-seu-signature > .dsh-seu-emblem { width: clamp(24px, 8cqw, 40px); height: auto; }
  .dsh-seu-wordmark { gap: 4px; }
  .dsh-seu-hero-title { font-size: clamp(16px, 5.5cqw, 27px); letter-spacing: .02em; }
  .dsh-seu-eyebrow { font-size: 6px; letter-spacing: 0; }
  .dsh-seu-motto { margin-top: 8px; padding-left: 7px; font-size: 16px; }
  .dsh-seu-hero-location { margin-top: 8px; font-size: 9px; }
  .dsh-seu-since { display: none; }
  .dsh-seu-photo { height: 96px; }
  .dsh-seu-photo-caption { left: 5px; bottom: 5px; padding: 2px 5px; font-size: 8px; }
  .dsh-seu-mascot, .dsh-seu-mascot[data-custom] { width: 68px; height: 78px; right: 1px; bottom: 0; }
}
@media (max-height: 540px) {
  .dsh-seu-hero-copy { padding: 8px; }
  .dsh-seu-signature { gap: 5px; }
  .dsh-seu-signature > .dsh-seu-emblem { width: 24px; }
  .dsh-seu-hero-title { font-size: 17px; }
  .dsh-seu-eyebrow { display: none; }
  .dsh-seu-motto { margin-top: 6px; font-size: 13px; }
  .dsh-seu-hero-location { margin-top: 5px; font-size: 9px; line-height: 1.4; }
  .dsh-seu-photo { height: 84px; }
  .dsh-seu-photo-caption { display: none; }
}
`;

// src/client/settings-style.js
var css2 = `
.dsh-seu-settings { box-sizing:border-box; height:100%; min-width:0; overflow:auto; color:var(--dsw-alias-label-primary); background:var(--dsw-alias-bg-base); font-size:14px; line-height:1.6; }
.dsh-seu-settings * { box-sizing:border-box; }
.dsh-seu-settings-inner { max-width:860px; margin:auto; padding:40px 36px 56px; }
.dsh-seu-settings-header { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:26px; }
.dsh-seu-settings h1 { margin:4px 0 6px; font-size:27px; font-weight:650; line-height:1.4; }
.dsh-seu-settings-header p { margin:0; color:var(--dsw-alias-label-secondary); }
.dsh-seu-settings-eyebrow { font-size:10px; letter-spacing:.14em; }
.dsh-seu-setting-group { border:1px solid var(--dsw-alias-border-l2); border-radius:16px; padding:8px 22px; margin-bottom:18px; background:var(--dsw-alias-bg-layer-1); }
.dsh-seu-setting-group h2 { font-size:16px; font-weight:600; margin:13px 0 2px; }
.dsh-seu-setting-row { display:flex; align-items:center; justify-content:space-between; gap:20px; padding:16px 0; }
.dsh-seu-setting-row + .dsh-seu-setting-row { border-top:1px solid var(--dsw-alias-border-l1); }
.dsh-seu-setting-row > span { min-width:0; }
.dsh-seu-setting-row strong { display:block; font-weight:550; }
.dsh-seu-setting-row small { display:block; color:var(--dsw-alias-label-secondary); font-size:12px; margin-top:3px; }
.dsh-seu-setting-row input[type=checkbox] { appearance:none; flex:0 0 38px; width:38px; height:23px; border:1px solid var(--dsw-alias-border-l4); border-radius:20px; background:var(--dsw-alias-bg-layer-3); cursor:pointer; position:relative; margin:0; }
.dsh-seu-setting-row input[type=checkbox]::after { content:''; position:absolute; top:3px; left:3px; width:15px; height:15px; border-radius:50%; background:var(--dsw-alias-label-secondary); }
.dsh-seu-setting-row input:checked { background:var(--dsw-alias-state-business-primary); border-color:var(--dsw-alias-state-business-primary); }
.dsh-seu-setting-row input:checked::after { transform:translateX(15px); background:var(--dsw-alias-bg-base); }
.dsh-seu-settings input:disabled,.dsh-seu-settings button:disabled { opacity:.45; cursor:default; }
.dsh-seu-settings select,.dsh-seu-button { border:1px solid var(--dsw-alias-border-l3); border-radius:8px; background:var(--dsw-alias-bg-base); color:inherit; padding:8px 12px; font:inherit; font-size:12px; line-height:1.5; max-width:100%; cursor:pointer; }
.dsh-seu-button { flex:none; }
.dsh-seu-button:hover:not(:disabled) { background:var(--dsw-alias-interactive-bg-hover); }
.dsh-seu-settings :is(input,select,button,summary):focus-visible { outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:3px; }
.dsh-seu-setting-note { margin:0 0 14px; font-size:12px; color:var(--dsw-alias-label-secondary); }
.dsh-seu-optional { margin-left:8px; font-size:11px; font-weight:400; color:var(--dsw-alias-label-secondary); }
.dsh-seu-image-setting { display:flex; align-items:center; gap:16px; padding-bottom:7px; }
.dsh-seu-image-setting > img { flex:none; width:96px; height:112px; object-fit:contain; padding:7px; border:1px solid var(--dsw-alias-border-l2); border-radius:12px; background:var(--dsw-alias-bg-base); }
.dsh-seu-image-setting > div { min-width:0; }
.dsh-seu-image-setting > div > strong { display:block; margin-bottom:8px; font-size:12px; font-weight:550; }
.dsh-seu-image-setting p { margin:8px 0; }
.dsh-seu-button-row { display:flex; flex-wrap:wrap; gap:8px; }
.dsh-seu-file-input { position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%); }
.dsh-seu-save-status { min-height:34px; color:var(--dsw-alias-label-secondary); font-size:12px; }
.dsh-seu-save-status p { margin:0 0 12px; }
.dsh-seu-setting-error { color:var(--dsw-alias-state-error-primary,#b13030); }
.dsh-seu-settings-footer { display:flex; align-items:flex-start; justify-content:space-between; gap:20px; padding-top:12px; border-top:1px solid var(--dsw-alias-border-l2); }
.dsh-seu-sources { margin:4px 0 18px; border:1px solid var(--dsw-alias-border-l2); border-radius:12px; padding:0 16px; color:var(--dsw-alias-label-secondary); font-size:12px; overflow-wrap:anywhere; }
.dsh-seu-sources summary { cursor:pointer; padding:13px 0; color:var(--dsw-alias-label-primary); font-weight:550; }
.dsh-seu-sources h3 { margin:0 0 6px; font-size:12px; color:var(--dsw-alias-label-primary); }
.dsh-seu-sources section { border-top:1px solid var(--dsw-alias-border-l2); padding:14px 0 4px; }
.dsh-seu-sources p { margin:0 0 12px; }
.dsh-seu-sources a { text-decoration:underline; text-underline-offset:3px; color:var(--dsw-alias-state-business-primary); }
.dsh-seu-sources a:focus-visible { outline:2px solid var(--dsw-alias-state-business-primary); outline-offset:2px; }
@media(max-width:600px) { .dsh-seu-settings-inner { padding:24px 16px 40px; } .dsh-seu-settings h1 { font-size:23px; } .dsh-seu-settings-header { flex-wrap:wrap; } .dsh-seu-setting-group { padding:6px 16px; } .dsh-seu-setting-row { gap:12px; } .dsh-seu-setting-row:has(.dsh-seu-campus-picker) { align-items:flex-start; flex-direction:column; } .dsh-seu-settings-footer { flex-direction:column; gap:10px; } }
/* Only adapt the host dialog while this plugin's section is displayed. */
@media(max-width:600px) {
  [data-shortcut-modal="settings"]:has(.dsh-seu-settings) { flex-direction:column; }
  [data-shortcut-modal="settings"]:has(.dsh-seu-settings) > nav { flex:none; width:100%; min-width:0; padding:12px; }
  [data-shortcut-modal="settings"]:has(.dsh-seu-settings) > nav > [id] { padding:0 8px 8px; }
  [data-shortcut-modal="settings"]:has(.dsh-seu-settings) > nav > div:has(> button) { flex-direction:row; flex-wrap:wrap; gap:4px; }
  [data-shortcut-modal="settings"]:has(.dsh-seu-settings) > nav button { width:auto; min-width:0; flex:0 1 auto; padding:7px 9px; font-size:12px; }
  [data-shortcut-modal="settings"]:has(.dsh-seu-settings) > div:has([data-slot="settings.section"]) { width:100%; min-width:0; min-height:0; }
  [data-shortcut-modal="settings"] div:has(> [data-slot="settings.section"] > .dsh-seu-settings) { min-height:0; padding:0 8px 12px; }
  .dsh-seu-settings-inner { padding:18px 8px 32px; }
  .dsh-seu-settings h1 { font-size:21px; }
  .dsh-seu-image-setting { gap:10px; flex-wrap:wrap; }
  .dsh-seu-image-setting > img { width:76px; height:88px; }
  .dsh-seu-image-setting > div { flex:1; min-width:140px; }
}
`;

// src/client/campus-picker-style.js
var css3 = `
.dsh-seu-campus-picker {
  --dsh-seu-campus-accent: var(--dsw-alias-state-business-primary, #587558);
  --dsh-seu-campus-surface: var(--dsw-alias-bg-layer-1, #fff);
  --dsh-seu-campus-yellow: #c6a827;
  box-sizing: border-box;
  position: relative;
  display: inline-block;
  flex: 0 1 auto;
  width: min(100%, 290px);
  max-width: min(290px, calc(100vw - 32px));
  min-width: 0;
  font-family: inherit;
  text-align: left;
}
.dsh-seu-campus-picker *, .dsh-seu-campus-picker *::before { box-sizing: border-box; }
.dsh-seu-campus-trigger {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 0;
  min-height: 48px;
  margin: 0;
  padding: 8px 12px;
  border: 1px solid var(--dsw-alias-border-l3, #ccd6c8);
  border-radius: 11px;
  color: var(--dsw-alias-label-primary, #202c23);
  background: var(--dsw-alias-bg-base, #f4f6f2);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.dsh-seu-campus-trigger:hover, .dsh-seu-campus-trigger[aria-expanded=true] { border-color: var(--dsh-seu-campus-accent); background: var(--dsw-alias-interactive-bg-hover, #edf1e8); }
.dsh-seu-campus-trigger-dot { flex: 0 0 6px; width: 6px; height: 6px; border-radius: 50%; background: var(--dsh-seu-campus-yellow); }
.dsh-seu-campus-trigger-copy { display: flex; flex: 1; min-width: 0; flex-direction: column; gap: 1px; line-height: 1.5; }
.dsh-seu-campus-trigger-copy > span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-seu-campus-trigger-copy > :first-child { font-size: 12px; font-weight: 600; }
.dsh-seu-campus-trigger-copy > :last-child { color: var(--dsw-alias-label-secondary, #657361); font-size: 10px; }
.dsh-seu-campus-chevron { flex: none; color: var(--dsh-seu-campus-accent); }
.dsh-seu-campus-chevron[data-open] { transform: rotate(180deg); }
.dsh-seu-campus-list {
  position: absolute;
  z-index: 30;
  inset: calc(100% + 7px) 0 auto;
  display: block;
  width: 100%;
  min-width: 0;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 5px;
  border: 1px solid var(--dsw-alias-border-l3, #ccd6c8);
  border-radius: 13px;
  color: var(--dsw-alias-label-primary, #202c23);
  background: var(--dsh-seu-campus-surface);
  box-shadow: var(--dsw-elevation-panel, 0 8px 25px #17251924);
  scrollbar-width: thin;
}
.dsh-seu-campus-list[data-direction=up] { top: auto; bottom: calc(100% + 7px); }
.dsh-seu-campus-trigger:focus-visible, .dsh-seu-campus-list:focus-visible { outline: 2px solid var(--dsh-seu-campus-accent); outline-offset: 3px; }
.dsh-seu-campus-option {
  appearance: none;
  position: relative;
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) 18px;
  align-items: center;
  gap: 9px;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 9px;
  border: 1px solid transparent;
  border-radius: 8px;
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.dsh-seu-campus-option + .dsh-seu-campus-option { margin-top: 3px; }
.dsh-seu-campus-option:hover, .dsh-seu-campus-option[data-active] { background: var(--dsw-alias-interactive-bg-hover, #edf1e8); border-color: var(--dsw-alias-border-l2, #dbe3d8); }
.dsh-seu-campus-option[aria-selected=true] { background: var(--dsw-alias-state-business-tertiary, #e7eee3); }
.dsh-seu-campus-option[aria-selected=true]::before { content: ''; position: absolute; left: 2px; top: 16px; bottom: 16px; width: 2px; border-radius: 2px; background: var(--dsh-seu-campus-yellow); }
.dsh-seu-campus-option[data-active] { border-color: var(--dsh-seu-campus-accent); }
.dsh-seu-campus-option:focus-visible { outline: 2px solid var(--dsh-seu-campus-accent); outline-offset: -2px; }
.dsh-seu-campus-thumbnail { display: flex; flex: none; width: 46px; height: 40px; align-items: center; justify-content: center; overflow: hidden; border-radius: 6px; background: var(--dsw-alias-bg-layer-2, #e8eee4); color: var(--dsh-seu-campus-accent); font-size: 18px; }
.dsh-seu-campus-thumbnail img { display: block; width: 100%; height: 100%; object-fit: cover; }
.dsh-seu-campus-option-copy { display: flex; min-width: 0; flex-direction: column; gap: 3px; line-height: 1.45; }
.dsh-seu-campus-option-title { font-size: 12px; font-weight: 600; overflow-wrap: anywhere; }
.dsh-seu-campus-option-description { color: var(--dsw-alias-label-secondary, #657361); font-size: 10px; overflow-wrap: anywhere; }
.dsh-seu-campus-check { display: flex; width: 18px; height: 18px; align-items: center; justify-content: center; color: var(--dsh-seu-campus-accent); }
body[data-ds-dark-theme] .dsh-seu-campus-picker { --dsh-seu-campus-yellow: #e1c85a; --dsh-seu-campus-surface: var(--dsw-alias-bg-layer-1, #1b2820); }
@media (forced-colors: active) {
  .dsh-seu-campus-option[data-active] { outline: 1px solid Highlight; outline-offset: -2px; }
  .dsh-seu-campus-option[aria-selected=true] { border-color: Highlight; }
  .dsh-seu-campus-check { color: Highlight; }
}
`;

// src/client/menu-style.js
var css4 = `
[data-menu-material="translucent"] {
  border: 1px solid var(--dsw-alias-border-l4) !important;
  border-top: 2px solid #c2aa40 !important;
  border-radius: 13px !important;
  box-shadow: 0 12px 32px #12241924, 0 2px 6px #12241910 !important;
  color: var(--dsw-alias-label-primary);
}
[data-menu-material="translucent"] :is([role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], [role="option"]) {
  border-radius: 8px;
}
[data-menu-material="translucent"] :is([role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], [role="option"]):hover {
  background: var(--dsw-alias-interactive-bg-hover) !important;
}
[data-menu-material="translucent"] :is([role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], [role="option"]):focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: -2px;
}
[data-menu-material="translucent"] :is([aria-selected="true"], [aria-checked="true"]) {
  background: var(--dsw-alias-state-business-tertiary) !important;
}
[data-menu-group-heading][data-stuck] { color: var(--dsw-alias-label-secondary); }
[data-composer-card] { border-color: var(--dsw-alias-border-l3) !important; }
button[aria-haspopup="menu"][aria-expanded="true"] { color: var(--dsw-alias-state-business-primary); background: var(--dsw-alias-state-business-tertiary); }
`;

// src/client/index.jsx
var inject = ["slots", "theme"];
function apply(ctx) {
  const preferences = createPreferencesStore();
  let appearanceError = "";
  const listeners = /* @__PURE__ */ new Set();
  const appearanceStatus = {
    getSnapshot: () => appearanceError,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    update(message) {
      appearanceError = message;
      for (const listener of listeners) listener();
    }
  };
  ctx.effect(() => () => preferences.dispose());
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.plugin = PLUGIN_ID;
    style.textContent = css + css2 + css3;
    document.head.append(style);
    return () => style.remove();
  });
  ctx.effect(() => installAppearance(ctx, preferences, {
    "sidebar.brand.name": SidebarName,
    "sidebar.brand.mark": SidebarMark,
    "conversation.hero.brand.mark": HeroBrand
  }, {
    onError: (error) => appearanceStatus.update(error.message),
    onReady: () => appearanceStatus.update(""),
    installDecorations: () => {
      const style = document.createElement("style");
      style.dataset.pluginAppearance = PLUGIN_ID;
      style.textContent = css4;
      document.head.append(style);
      return () => style.remove();
    }
  }));
  ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({ name: "sidebar.footer.action", id: PLUGIN_ID, order: 10, inject: () => ({ preferences }) }, CampusFooter));
  ctx.slots.inject("settings.section", () => ctx.slots.register({ name: "settings.section", id: PLUGIN_ID, order: 100, label: () => "\u6821\u56ED\u4E3B\u9898(SEU)", inject: () => ({ preferences, appearanceStatus }) }, SettingsPage));
}

return module.exports;}});
