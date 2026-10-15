import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { MAX_MASCOT_BYTES, validateMascotDataUrl } from './preferences.js';
import { CampusPicker } from './campus-picker.jsx';
import { BUILTIN_MASCOT } from './campus-data.js';
import { MaterialSources } from './material-sources.jsx';

function Toggle({ label, description, checked, disabled, onChange }) {
  return <label className="dsh-seu-setting-row"><span><strong>{label}</strong><small>{description}</small></span><input type="checkbox" role="switch" aria-label={label} checked={checked} disabled={disabled} onChange={event => onChange(event.target.checked)} /></label>;
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('无法读取图片，请重新选择。'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

async function decodeImage(dataUrl) {
  const image = new Image();
  image.src = dataUrl;
  try { await image.decode(); } catch { throw new Error('这张图片无法打开，请选择有效的 PNG、JPEG 或 WebP。'); }
  if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 40_000_000) throw new Error('图片尺寸过大或无效，请使用不超过 4000 万像素的图片。');
}

export function SettingsPage({ preferences, appearanceStatus }) {
  const state = useSyncExternalStore(preferences.subscribe, preferences.getSnapshot, preferences.getSnapshot);
  const appearanceError = useSyncExternalStore(appearanceStatus.subscribe, appearanceStatus.getSnapshot, appearanceStatus.getSnapshot);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const revision = useRef(0);
  const picker = useRef(null);
  useEffect(() => () => { revision.current += 1; }, []);
  function update(patch) {
    try { preferences.update(patch); setError(''); setNotice('已保存到当前浏览器'); }
    catch (failure) { setNotice(''); setError(failure.message); }
  }
  async function selectImage(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const current = ++revision.current;
    setBusy(true); setError(''); setNotice('');
    try {
      if (file.size > MAX_MASCOT_BYTES) throw new Error('图片不能超过 512 KiB，请选择更小的图片。');
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error('请选择 PNG、JPEG 或 WebP 图片。');
      const dataUrl = validateMascotDataUrl(await readImage(file));
      await decodeImage(dataUrl);
      if (current !== revision.current) return;
      update({ mascotDataUrl: dataUrl, mascotEnabled: true });
    } catch (failure) { if (current === revision.current) setError(failure.message); }
    finally { if (current === revision.current) setBusy(false); }
  }
  function reset() {
    revision.current += 1; setBusy(false);
    try { preferences.reset(); setError(''); setNotice('已恢复校园主题默认设置'); }
    catch (failure) { setNotice(''); setError(failure.message); }
  }
  return <section className="dsh-seu-settings" aria-label="校园主题(SEU)设置"><div className="dsh-seu-settings-inner">
    <header className="dsh-seu-settings-header"><div><p className="dsh-seu-settings-eyebrow">SOUTHEAST UNIVERSITY</p><h1>校园主题(SEU)</h1><p>让熟悉的校园，陪伴每一次探索。</p></div></header>
    {appearanceError && <p className="dsh-seu-setting-error" role="alert">{appearanceError}</p>}
    <div className="dsh-seu-setting-group">
      <Toggle label="启用校园主题" description="应用校园配色与品牌区域；关闭后恢复原有外观。" checked={state.enabled} onChange={enabled => update({ enabled })} />
      <p className="dsh-seu-setting-note">配色跟随 DSH 的浅色、深色或系统设置，可在「设置 → 通用设置 → 外观」中切换。</p>
    </div>
    <div className="dsh-seu-setting-group"><h2>校园风景</h2>
      <div className="dsh-seu-setting-row"><span><strong>展示校区</strong><small>使用有来源记录的校园建筑照片。</small></span><CampusPicker value={state.campus} onChange={campus => update({ campus })} /></div>
      <Toggle label="显示校园欢迎卡" description="在新对话中展示校区照片。" checked={state.showHero} onChange={showHero => update({ showHero })} />
      <Toggle label="显示校训" description="在欢迎卡与侧栏铭牌中展示「止于至善」。" checked={state.showMotto} onChange={showMotto => update({ showMotto })} />
    </div>
    <div className="dsh-seu-setting-group"><h2>叮东相伴 <span className="dsh-seu-optional">可选</span></h2>
      <Toggle label="显示叮东" description={state.showHero ? '让叮东出现在校园风景里，可随时关闭。' : '开启校园欢迎卡后，可在风景中显示叮东。'} checked={state.mascotEnabled} disabled={!state.showHero} onChange={mascotEnabled => update({ mascotEnabled })} />
      <div className="dsh-seu-image-setting"><img src={state.mascotDataUrl || BUILTIN_MASCOT} alt={state.mascotDataUrl ? '已选择的叮东图片' : '内置叮东重建形象预览'} /><div><strong>{state.mascotDataUrl ? '自选形象' : '内置挥手形象'}</strong><div className="dsh-seu-button-row"><button className="dsh-seu-button" disabled={busy} onClick={() => picker.current?.click()}>{busy ? '正在读取…' : state.mascotDataUrl ? '更换本地图片' : '替换为本地图片'}</button>{state.mascotDataUrl && <button className="dsh-seu-button" disabled={busy} onClick={() => update({ mascotDataUrl: null })}>恢复内置形象</button>}</div><p className="dsh-seu-setting-note">本地替换支持 PNG、JPEG、WebP，最大 512 KiB。</p></div></div>
      <input ref={picker} className="dsh-seu-file-input" type="file" accept="image/png,image/jpeg,image/webp" aria-label="选择叮东图片" onChange={selectImage} />
    </div>
    <div className="dsh-seu-save-status" aria-live="polite">{error ? <p role="alert" className="dsh-seu-setting-error">{error}</p> : <p role="status">{notice || '设置即时生效，仅应用于当前浏览器。'}</p>}</div>
    <MaterialSources />
    <footer className="dsh-seu-settings-footer"><button className="dsh-seu-button" onClick={reset}>恢复主题默认设置</button></footer>
  </div></section>;
}
