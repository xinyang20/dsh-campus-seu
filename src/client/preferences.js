export const MAX_MASCOT_BYTES = 512 * 1024;

const STORAGE_KEY = 'dsh-campus-seu.preferences.v1';
const FIELDS = ['enabled', 'campus', 'showHero', 'showMotto', 'mascotEnabled', 'mascotDataUrl'];
const BOOLEAN_FIELDS = ['enabled', 'showHero', 'showMotto', 'mascotEnabled'];
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

export const DEFAULT_PREFERENCES = Object.freeze({
  enabled: true,
  campus: 'jiulonghu',
  showHero: true,
  showMotto: true,
  mascotEnabled: false,
  mascotDataUrl: null,
});

/** Validate a browser-local raster image; return its normalized data URL or null. */
export function validateMascotDataUrl(value) {
  if (value === null) return null;
  if (typeof value !== 'string') throw new TypeError('叮东图片必须是 PNG、JPEG 或 WebP 本地图片。');
  const match = /^data:image\/(png|jpeg|webp);base64,([\s\S]*)$/i.exec(value);
  if (!match) throw new TypeError('叮东图片仅支持 PNG、JPEG 或 WebP，不支持 SVG 或网络地址。');
  const [, format, encoded] = match;
  if (encoded.length > Math.ceil(MAX_MASCOT_BYTES / 3) * 4) throw new RangeError('叮东图片不能超过 512 KiB，请选择更小的图片。');
  if (!encoded || encoded.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) {
    throw new TypeError('叮东图片的 base64 数据无效，请重新选择图片。');
  }
  const padding = encoded.endsWith('==') ? 2 : encoded.endsWith('=') ? 1 : 0;
  const bytes = encoded.length / 4 * 3 - padding;
  if (bytes > MAX_MASCOT_BYTES) throw new RangeError('叮东图片不能超过 512 KiB，请选择更小的图片。');
  const header = Array.from(atob(encoded.slice(0, 16)), char => char.charCodeAt(0));
  const startsWith = signature => signature.every((byte, index) => header[index] === byte);
  const mime = format.toLowerCase();
  const matchesFormat = mime === 'png'
    ? startsWith([137, 80, 78, 71, 13, 10, 26, 10])
    : mime === 'jpeg'
      ? startsWith([255, 216, 255])
      : startsWith([82, 73, 70, 70]) && header.slice(8, 12).join(',') === '87,69,66,80';
  if (!matchesFormat) throw new TypeError('叮东图片内容与文件格式不符，请重新选择 PNG、JPEG 或 WebP 图片。');
  return `data:image/${mime};base64,${encoded}`;
}

/** Recover each known preference independently; malformed persisted images stay disabled. */
export function normalizePreferences(input) {
  const normalized = { ...DEFAULT_PREFERENCES };
  if (input && typeof input === 'object' && !Array.isArray(input)) {
    for (const field of BOOLEAN_FIELDS) {
      if (hasOwn(input, field) && typeof input[field] === 'boolean') normalized[field] = input[field];
    }
    if (hasOwn(input, 'campus') && ['jiulonghu', 'sipailou'].includes(input.campus)) normalized.campus = input.campus;
    if (hasOwn(input, 'mascotDataUrl')) {
      try { normalized.mascotDataUrl = validateMascotDataUrl(input.mascotDataUrl); }
      catch { normalized.mascotDataUrl = null; normalized.mascotEnabled = false; }
    }
  }
  // A null image deliberately selects the bundled mascot; invalid images never enable it.
  return Object.freeze(normalized);
}

function readPreferences(serialized) {
  try { return normalizePreferences(JSON.parse(serialized)); } catch { return normalizePreferences(null); }
}

function storageError(error) {
  const quota = ['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED'].includes(error?.name);
  return new Error(quota
    ? '无法保存校园主题设置：本地存储空间不足，请移除叮东图片或清理存储后重试。'
    : '无法保存校园主题设置：浏览器拒绝访问本地存储，请检查浏览器设置后重试。', { cause: error });
}

/** One isolated browser preference key; successful writes precede observable state changes. */
export function createPreferencesStore({ storage, eventTarget } = {}) {
  const browser = typeof window === 'undefined' ? undefined : window;
  eventTarget ??= browser;
  if (storage === undefined) {
    try { storage = browser?.localStorage; } catch { storage = undefined; }
  }
  let snapshot;
  try { snapshot = readPreferences(storage?.getItem(STORAGE_KEY) ?? null); } catch { snapshot = normalizePreferences(null); }
  const listeners = new Set();
  let disposed = false;

  function publish(next) {
    if (FIELDS.every(field => snapshot[field] === next[field])) return;
    snapshot = next;
    for (const listener of [...listeners]) listener();
  }

  function write(operation) {
    if (disposed) throw new Error('校园主题设置已关闭，无法保存更改。');
    try {
      if (!storage) throw new Error('Local storage unavailable');
      operation(storage);
    } catch (error) { throw storageError(error); }
  }

  function onStorage(event) {
    if (disposed || (event.key !== STORAGE_KEY && event.key !== null)) return;
    if (event.storageArea != null && event.storageArea !== storage) return;
    publish(event.key === null ? normalizePreferences(null) : readPreferences(event.newValue));
  }
  eventTarget?.addEventListener('storage', onStorage);

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      if (disposed) return () => {};
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    update(patch) {
      if (!patch || typeof patch !== 'object' || Array.isArray(patch)) throw new TypeError('校园主题设置必须是有效的设置对象。');
      if (hasOwn(patch, 'mascotDataUrl')) validateMascotDataUrl(patch.mascotDataUrl);
      const next = normalizePreferences({ ...snapshot, ...patch });
      write(target => target.setItem(STORAGE_KEY, JSON.stringify(next)));
      publish(next);
      return snapshot;
    },
    reset() {
      write(target => target.removeItem(STORAGE_KEY));
      publish(normalizePreferences(null));
      return snapshot;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      eventTarget?.removeEventListener('storage', onStorage);
      listeners.clear();
    },
  };
}
