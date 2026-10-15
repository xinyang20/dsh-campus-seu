import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

const CAMPUSES = [
  { value: 'jiulonghu', title: '九龙湖校区', description: '李文正图书馆', image: '/dsh-campus-seu/assets/jiulonghu-library-2020.jpg', position: '50% 54%', fallback: '湖' },
  { value: 'sipailou', title: '四牌楼校区', description: '大礼堂', image: '/dsh-campus-seu/assets/sipailou-auditorium-2012.jpg', position: '50% 55%', fallback: '堂' },
];

function Thumbnail({ campus }) {
  const [failed, setFailed] = useState(false);
  return <span className="dsh-seu-campus-thumbnail" aria-hidden="true">{failed ? <span>{campus.fallback}</span> : <img src={campus.image} alt="" style={{ objectPosition: campus.position }} decoding="async" onError={() => setFailed(true)} />}</span>;
}

function Check() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

/** A local listbox; its popup stays in the settings container and never changes host DOM. */
export function CampusPicker({ value, onChange }) {
  const selectedIndex = Math.max(0, CAMPUSES.findIndex(campus => campus.value === value));
  const selected = CAMPUSES[selectedIndex];
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(selectedIndex);
  const [placement, setPlacement] = useState({ direction: 'down', maxHeight: 240, ready: false });
  const root = useRef(null);
  const trigger = useRef(null);
  const list = useRef(null);
  const rows = useRef([]);
  const id = useId();
  const listId = `${id}-campus-list`;

  function close(restoreFocus = true) {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus({ preventScroll: true });
  }

  function show(index = selectedIndex) {
    setActive(index);
    setPlacement(previous => ({ ...previous, ready: false }));
    setOpen(true);
  }

  function choose(index) {
    try { onChange(CAMPUSES[index].value); }
    finally { close(); }
  }

  useLayoutEffect(() => {
    if (!open) return;
    const popup = list.current;
    const button = trigger.current;
    if (!popup || !button) return;
    const place = () => {
      const rect = button.getBoundingClientRect();
      const viewport = window.visualViewport;
      let top = (viewport?.offsetTop ?? 0) + 8;
      let bottom = (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight) - 8;
      // Respect the nearest scrolling/clipping surfaces as well as the viewport.
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
      const direction = below < desired && above > below ? 'up' : 'down';
      const maxHeight = Math.floor(direction === 'up' ? above : below);
      setPlacement(previous => previous.ready && previous.direction === direction && previous.maxHeight === maxHeight ? previous : { direction, maxHeight, ready: true });
    };
    place();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(place);
    observer?.observe(button);
    observer?.observe(popup);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    window.visualViewport?.addEventListener('resize', place);
    window.visualViewport?.addEventListener('scroll', place);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      window.visualViewport?.removeEventListener('resize', place);
      window.visualViewport?.removeEventListener('scroll', place);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (open && placement.ready) list.current?.focus({ preventScroll: true });
  }, [open, placement.ready]);

  useLayoutEffect(() => {
    if (!open || !placement.ready) return;
    const popup = list.current;
    const row = rows.current[active];
    if (!popup || !row) return;
    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < popup.scrollTop) popup.scrollTop = top;
    else if (bottom > popup.scrollTop + popup.clientHeight) popup.scrollTop = bottom - popup.clientHeight;
  }, [active, open, placement.ready, placement.maxHeight]);

  useEffect(() => {
    if (!open) return;
    const outside = event => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
    };
  }, [open]);

  function onListKeyDown(event) {
    if (event.key === 'Tab') {
      // Leave normal Tab/Shift+Tab traversal anchored at the trigger, without trapping focus.
      close();
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' ', 'Escape'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.key === 'Escape') close();
    else if (event.key === 'Enter' || event.key === ' ') choose(active);
    else setActive(index => event.key === 'Home' ? 0 : event.key === 'End' ? CAMPUSES.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + CAMPUSES.length) % CAMPUSES.length);
  }

  return <span ref={root} className="dsh-seu-campus-picker">
    <button ref={trigger} type="button" className="dsh-seu-campus-trigger" aria-label="展示校区" aria-description={`当前：${selected.title}，${selected.description}`} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listId : undefined} onClick={() => open ? close(false) : show()} onKeyDown={event => {
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      show(event.key === 'Home' ? 0 : event.key === 'End' ? CAMPUSES.length - 1 : selectedIndex);
    }}>
      <span className="dsh-seu-campus-trigger-dot" aria-hidden="true" />
      <span className="dsh-seu-campus-trigger-copy"><span>{selected.title}</span><span>{selected.description}</span></span>
      <svg className="dsh-seu-campus-chevron" data-open={open || undefined} width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
    {open && <span ref={list} className="dsh-seu-campus-list" id={listId} role="listbox" aria-label="展示校区" aria-activedescendant={`${id}-campus-${active}`} tabIndex={-1} data-direction={placement.direction} style={{ maxHeight: placement.maxHeight, visibility: placement.ready ? undefined : 'hidden' }} onKeyDown={onListKeyDown}>
      {CAMPUSES.map((campus, index) => <button ref={element => { rows.current[index] = element; }} type="button" role="option" id={`${id}-campus-${index}`} key={campus.value} className="dsh-seu-campus-option" tabIndex={-1} aria-selected={campus.value === value} data-active={index === active || undefined} onPointerMove={() => setActive(index)} onMouseDown={event => event.preventDefault()} onClick={() => choose(index)}>
        <Thumbnail campus={campus} />
        <span className="dsh-seu-campus-option-copy"><span className="dsh-seu-campus-option-title">{campus.title}</span><span className="dsh-seu-campus-option-description">{campus.description}</span></span>
        <span className="dsh-seu-campus-check" aria-hidden="true">{campus.value === value && <Check />}</span>
      </button>)}
    </span>}
  </span>;
}
