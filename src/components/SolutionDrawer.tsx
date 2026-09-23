'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RichSolution } from '@/data/rich-solutions';
import { ApproachView, SimpleView, type SimpleSolution } from '@/components/SolutionContent';

interface Props {
  open: boolean;
  name: string;
  richSolution: RichSolution | null;
  simpleSolution: SimpleSolution | null;
  onClose: () => void;
}

// ── main drawer ───────────────────────────────────────────────
const MIN_W = 320;
const MAX_W = 900;
const DEFAULT_W = 560;

export default function SolutionDrawer({ open, name, richSolution, simpleSolution, onClose }: Props) {
  const [selIdx, setSelIdx] = useState(0);
  const [width, setWidth] = useState(DEFAULT_W);
  const [collapsed, setCollapsed] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(DEFAULT_W);

  useEffect(() => { setSelIdx(0); setDescOpen(false); }, [richSolution, simpleSolution]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // drag-to-resize handlers
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    startX.current = e.clientX;
    startW.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width]);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!dragging.current) return;
      const delta = startX.current - e.clientX;
      setWidth(Math.min(MAX_W, Math.max(MIN_W, startW.current + delta)));
    }
    function onUp() {
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  const approach = richSolution?.approaches[selIdx] ?? null;
  const diff = richSolution?.difficulty;
  const diffColor = diff === 'Easy' ? 'var(--green)' : diff === 'Medium' ? 'var(--accent)' : 'var(--red)';
  const visibleWidth = collapsed ? 0 : width;

  return (
    <>
      {/* overlay */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, top: 52, background: 'rgba(13,17,23,.5)', zIndex: 199, display: open && !collapsed ? 'block' : 'none' }} />

      {/* collapse toggle tab — always visible when drawer is open */}
      {open && (
        <div
          onClick={() => setCollapsed(c => !c)}
          style={{
            position: 'fixed', top: '50%', right: collapsed ? 0 : visibleWidth,
            transform: 'translateY(-50%)',
            zIndex: 201, cursor: 'pointer',
            background: 'var(--surf2)', border: '1px solid var(--border)',
            borderRight: collapsed ? '1px solid var(--border)' : 'none',
            borderRadius: collapsed ? '6px 0 0 6px' : '6px 0 0 6px',
            padding: '.4rem .22rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.15rem',
            transition: 'right .25s ease',
          }}
          title={collapsed ? 'Expand drawer' : 'Collapse drawer'}
        >
          <span style={{ fontSize: '.7rem', color: 'var(--muted)', writingMode: 'vertical-lr', transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform .2s', lineHeight: 1 }}>
            {collapsed ? '◀' : '▶'}
          </span>
        </div>
      )}

      {/* drawer */}
      <div style={{
        position: 'fixed', top: 52, right: 0, bottom: 0,
        width: visibleWidth,
        minWidth: 0,
        background: 'var(--surf)', borderLeft: collapsed ? 'none' : '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: dragging.current ? 'none' : 'transform .25s ease, width .2s ease',
        zIndex: 200,
        overflow: 'hidden',
      }}>
        {/* drag handle */}
        <div
          onMouseDown={onMouseDown}
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 5,
            cursor: 'col-resize', zIndex: 10,
            background: 'transparent',
            transition: 'background .15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(88,166,255,.25)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          title="Drag to resize"
        />

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '.85rem 1.1rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.95rem', fontWeight: 700, color: '#E8EAED', letterSpacing: '-.01em' }}>{name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.55rem', marginTop: '.2rem', flexWrap: 'wrap' }}>
              {diff && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 600, color: diffColor }}>{diff}</span>}
              {richSolution?.link && (
                <a
                  href={richSolution.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 600, color: 'var(--blue)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '.2rem', padding: '.1rem .35rem', borderRadius: 4, border: '1px solid rgba(88,166,255,.3)', background: 'rgba(88,166,255,.07)' }}
                >
                  LeetCode ↗
                </a>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '.3rem .6rem', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--surf2)', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', cursor: 'pointer', flexShrink: 0, marginLeft: '.75rem' }}>✕</button>
        </div>

        {/* problem description panel */}
        {richSolution?.description && (
          <div style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <button
              onClick={() => setDescOpen(o => !o)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.45rem 1.1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '.78rem', fontWeight: 500 }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                <span style={{ fontSize: '.72rem' }}>📋</span> Problem Statement
              </span>
              <span style={{ fontSize: '.7rem', opacity: .7, transition: 'transform .2s', transform: descOpen ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</span>
            </button>
            {descOpen && (
              <div style={{ padding: '.1rem 1.1rem .85rem', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                <p style={{ margin: 0, fontFamily: "'DM Sans',sans-serif", fontSize: '.84rem', lineHeight: 1.65, color: 'var(--text)' }}>{richSolution.description}</p>
                {richSolution.constraints && richSolution.constraints.length > 0 && (
                  <div style={{ background: 'var(--bg)', borderRadius: 6, padding: '.5rem .75rem', display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 600, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.1rem' }}>Constraints</div>
                    {richSolution.constraints.map((c, i) => (
                      <div key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                        <span style={{ color: 'var(--accent)', fontSize: '.6rem' }}>▸</span>{c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {richSolution ? (
          <>
            {/* approach selector tabs */}
            <div style={{ display: 'flex', gap: '.3rem', padding: '.55rem 1.1rem', background: 'var(--bg)', borderBottom: '1px solid var(--border)', overflowX: 'auto', flexShrink: 0 }}>
              {richSolution.approaches.map((a, i) => (
                <button
                  key={i}
                  onClick={() => setSelIdx(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '.4rem', flexShrink: 0,
                    padding: '.28rem .75rem', borderRadius: 5,
                    border: selIdx === i ? '1px solid var(--border2)' : '1px solid transparent',
                    background: selIdx === i ? 'var(--surf)' : 'transparent',
                    color: selIdx === i ? 'var(--text)' : 'var(--muted)',
                    fontFamily: "'DM Sans',sans-serif", fontSize: '.8rem', fontWeight: selIdx === i ? 600 : 400,
                    cursor: 'pointer', transition: 'all .15s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 700, color: selIdx === i ? 'var(--accent)' : 'var(--faint)' }}>#{a.rank}</span>
                  {a.name}
                  {a.tags.includes('optimal') && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />}
                </button>
              ))}
            </div>

            {/* approach body */}
            {approach && <ApproachView approach={approach} />}
          </>
        ) : simpleSolution ? (
          <SimpleView solution={simpleSolution} />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', color: 'var(--muted)' }}>
            Solution coming soon.
          </div>
        )}
      </div>
    </>
  );
}
