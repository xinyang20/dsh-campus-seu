import React, { useCallback, useState, useSyncExternalStore } from 'react';
import { CAMPUSES, BUILTIN_MASCOT } from './campus-data.js';

const EMBLEM = '/dsh-campus-seu/assets/seu-emblem-official.png';
function usePreferences(preferences) {
  const subscribe = useCallback(listener => preferences.subscribe(listener), [preferences]);
  const getSnapshot = useCallback(() => preferences.getSnapshot(), [preferences]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
function CampusPhoto({ campus, mascot }) {
  const [failed, setFailed] = useState(false);
  return <span className="dsh-seu-landmark">
    <span className="dsh-seu-photo">
      {failed ? <span className="dsh-seu-photo-fallback" role="img" aria-label={`${campus.landmark}照片暂不可用`}>
        <span>{campus.landmark}</span><small>校园照片暂不可用</small>
      </span> : <img src={campus.src} alt={`东南大学${campus.name}${campus.landmark}`} width={campus.width} height={campus.height} style={{ objectPosition: campus.position }} decoding="async" onError={() => setFailed(true)} />}
    </span>
    <span className="dsh-seu-photo-caption">{campus.landmark}</span>
    {mascot}
  </span>;
}

function Mascot({ dataUrl }) {
  const [failed, setFailed] = useState(false);
  const customImage = typeof dataUrl === 'string' && /^data:image\/(?:png|jpeg|webp);base64,/i.test(dataUrl);
  const src = customImage ? dataUrl : BUILTIN_MASCOT;
  return <span className="dsh-seu-mascot" data-custom={customImage || undefined} title="叮东相伴">
    {failed ? <span className="dsh-seu-mascot-fallback">叮东</span> : <img className="dsh-seu-mascot-image" src={src} alt={customImage ? '自选叮东形象' : '叮东挥手相伴'} decoding="async" onError={() => setFailed(true)} />}
  </span>;
}

/** The host requests a mark here; this rc.2 adaptation keeps its entire card in normal flow. */
export function HeroBrand({ preferences, size = 34 }) {
  const state = usePreferences(preferences);
  const campus = CAMPUSES[state.campus] ?? CAMPUSES.jiulonghu;
  if (state.showHero === false) return <SidebarMark size={size} />;
  return <span className="dsh-seu-hero" role="region" aria-label="东南大学校园欢迎卡">
    <span className="dsh-seu-hero-card">
      <span className="dsh-seu-hero-copy">
        <span className="dsh-seu-signature"><SidebarMark size={64} /><span className="dsh-seu-wordmark"><span className="dsh-seu-hero-title" role="heading" aria-level="2">东南大学</span><span className="dsh-seu-eyebrow">SOUTHEAST UNIVERSITY</span></span></span>
        {state.showMotto && <span className="dsh-seu-motto">止于至善</span>}
        <span className="dsh-seu-hero-location"><span>{campus.name}</span><span className="dsh-seu-since">SINCE 1902</span></span>
      </span>
      <CampusPhoto key={campus.src} campus={campus} mascot={state.mascotEnabled && <Mascot key={state.mascotDataUrl || 'built-in'} dataUrl={state.mascotDataUrl} />} />
    </span>
  </span>;
}

export function SidebarName({ preferences }) {
  const state = usePreferences(preferences);
  const campus = CAMPUSES[state.campus] ?? CAMPUSES.jiulonghu;
  return <span className="dsh-seu-sidebar-name" title={`东南大学 · ${campus.name}`}><span>东南大学</span><small>SOUTHEAST UNIVERSITY</small></span>;
}

export function SidebarMark({ size = 24 }) {
  const [failed, setFailed] = useState(false);
  const edge = Number.isFinite(size) ? Math.max(16, Math.min(size, 64)) : 24;
  return failed ? <span className="dsh-seu-mark-fallback" role="img" aria-label="东南大学主题" style={{ width: edge, height: edge }}>SEU</span> : <img className="dsh-seu-emblem" src={EMBLEM} width={edge} height={edge} alt="东南大学校徽" decoding="async" onError={() => setFailed(true)} />;
}

export function CampusFooter({ preferences, wide }) {
  const state = usePreferences(preferences);
  if (!wide || !state.enabled) return null;
  const campus = CAMPUSES[state.campus] ?? CAMPUSES.jiulonghu;
  return <span className="dsh-seu-campus-plaque"><span><strong>{state.showMotto ? '止于至善' : '东南大学'}</strong><small>东南大学 · {campus.name}</small></span><span className="dsh-seu-plaque-year">1902</span></span>;
}
