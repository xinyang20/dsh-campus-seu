import { createPreferencesStore } from './preferences.js';
import { installAppearance, PLUGIN_ID } from './lifecycle.js';
import { CampusFooter, HeroBrand, SidebarMark, SidebarName } from './visuals.jsx';
import { SettingsPage } from './settings.jsx';
import { css as visualCss } from './visual-style.js';
import { css as settingsCss } from './settings-style.js';
import { css as pickerCss } from './campus-picker-style.js';
import { css as menuCss } from './menu-style.js';

export const inject = ['slots', 'theme'];
export function apply(ctx) {
  const preferences = createPreferencesStore();
  let appearanceError = '';
  const listeners = new Set();
  const appearanceStatus = {
    getSnapshot: () => appearanceError,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    update(message) { appearanceError = message; for (const listener of listeners) listener(); },
  };
  ctx.effect(() => () => preferences.dispose());
  ctx.effect(() => {
    const style = document.createElement('style');
    style.dataset.plugin = PLUGIN_ID;
    style.textContent = visualCss + settingsCss + pickerCss;
    document.head.append(style);
    return () => style.remove();
  });
  ctx.effect(() => installAppearance(ctx, preferences, {
    'sidebar.brand.name': SidebarName,
    'sidebar.brand.mark': SidebarMark,
    'conversation.hero.brand.mark': HeroBrand,
  }, {
    onError: error => appearanceStatus.update(error.message), onReady: () => appearanceStatus.update(''),
    installDecorations: () => {
      const style = document.createElement('style');
      style.dataset.pluginAppearance = PLUGIN_ID;
      style.textContent = menuCss;
      document.head.append(style);
      return () => style.remove();
    },
  }));
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({ name: 'sidebar.footer.action', id: PLUGIN_ID, order: 10, inject: () => ({ preferences }) }, CampusFooter));
  ctx.slots.inject('settings.section', () => ctx.slots.register({ name: 'settings.section', id: PLUGIN_ID, order: 100, label: () => '校园主题(SEU)', inject: () => ({ preferences, appearanceStatus }) }, SettingsPage));
}
