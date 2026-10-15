// Loaded only while the theme is enabled. Use host semantic markers, never generated class names.
export const css = `
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
