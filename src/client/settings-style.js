export const css = `
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
