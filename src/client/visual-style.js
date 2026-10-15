export const css = `
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
