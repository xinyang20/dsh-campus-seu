export const css = `
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
