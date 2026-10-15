import { THEME_TOKENS } from './tokens.js';

export const PLUGIN_ID = 'dsh-campus-seu';

/** Own one reversible appearance layer, without changing host preferences. */
export function installAppearance(ctx, preferences, components, { onError = () => {}, onReady = () => {}, installDecorations = () => () => {} } = {}) {
  let active = false;
  let disposers = [];
  let synchronizing = false;
  let disposed = false;

  function notify(callback, value) {
    // Reporting must never interrupt the preferences store's other subscribers.
    try { callback(value); } catch {}
  }

  function clear() {
    active = false;
    const errors = [];
    for (const dispose of disposers.splice(0).reverse()) {
      try { dispose(); } catch (error) { errors.push(error); }
    }
    return errors;
  }

  function fail(error) {
    const previousSync = synchronizing;
    synchronizing = true;
    const cleanupErrors = clear();
    let rollbackError;
    try { preferences.update({ enabled: false }); } catch (failure) { rollbackError = failure; }
    finally { synchronizing = previousSync; }
    const detail = error instanceof Error ? error.message : String(error);
    let message = `校园主题启用失败：${detail}。${cleanupErrors.length ? '部分外观清理失败，请刷新页面后关闭主题。' : '主题外观已关闭。'}`;
    if (rollbackError) message += `关闭状态未能保存：${rollbackError.message ?? String(rollbackError)}。请修复存储问题后关闭主题，避免刷新后再次尝试启用。`;
    notify(onError, new Error(message, { cause: error }));
  }

  function sync() {
    if (disposed || synchronizing) return;
    const enabled = preferences.getSnapshot().enabled;
    if (enabled === active) return;
    if (!enabled) {
      const errors = clear();
      if (errors.length) notify(onError, new Error('校园主题的部分外观清理失败，请刷新页面。', { cause: errors[0] }));
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
            // A slot may be declared only after the initial setup has finished.
            fail(error);
            return () => {};
          }
        }));
      }
      active = true;
      notify(onReady);
    } catch (error) { fail(error); }
    finally { synchronizing = false; }
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
