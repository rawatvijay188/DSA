'use client';
import { useState } from 'react';
import { DAYS, TOTAL, pid } from '@/data/curriculum';
import { SOL } from '@/data/solutions';
import { useProgress } from '@/context/ProgressContext';

interface DrawerState { day: number; pi: number; name: string; }

interface Props {
  onOpenSolution: (day: number, pi: number, name: string) => void;
}

export default function StudyPlan({ onOpenSolution }: Props) {
  const { isChecked, toggle, countDone, reset } = useProgress();
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([1]));

  function toggleDay(n: number) {
    setOpenDays(prev => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n); else next.add(n);
      return next;
    });
  }

  function expandAll() {
    setOpenDays(new Set(DAYS.map(d => d.n)));
  }

  function handleReset() {
    if (!confirm('Reset all progress? This cannot be undone.')) return;
    reset();
  }

  const done = countDone();

  const rowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '.65rem', padding: '.3rem 0',
    cursor: 'pointer', position: 'relative',
  };
  const checkBase: React.CSSProperties = {
    width: 15, height: 15, borderRadius: 3, border: '1.5px solid var(--border2)',
    background: 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center',
    justifyContent: 'center', transition: 'all .15s', cursor: 'pointer',
    fontSize: '.6rem', color: '#0D1117', fontWeight: 800,
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ padding: '.65rem 1.25rem', background: 'var(--surf)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', color: 'var(--muted)' }}>
          Progress: <strong style={{ color: 'var(--accent)', fontWeight: 600 }}>{done} / {TOTAL}</strong>
        </div>
        <div style={{ display: 'flex', gap: '.5rem', marginLeft: 'auto' }}>
          {[
            { label: 'Expand All', onClick: expandAll, danger: false },
            { label: 'Reset All', onClick: handleReset, danger: true },
          ].map(({ label, onClick, danger }) => (
            <button
              key={label}
              onClick={onClick}
              style={{ padding: '.3rem .75rem', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--surf2)', color: 'var(--text)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', cursor: 'pointer', transition: 'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = danger ? 'var(--red)' : 'var(--accent)'; e.currentTarget.style.color = danger ? 'var(--red)' : 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Day grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(360px,1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          {DAYS.map(d => {
            const isOpen = openDays.has(d.n);
            const dayDone = d.problems.filter((_, pi) => isChecked(d.n, pi)).length;
            const full = dayDone === d.problems.length;

            return (
              <div key={d.n} style={{ background: 'var(--bg)' }}>
                {/* Day header */}
                <div
                  onClick={() => toggleDay(d.n)}
                  style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.9rem 1.1rem', cursor: 'pointer', userSelect: 'none', transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surf)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 3, height: 36, borderRadius: 99, background: d.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.9rem', fontWeight: 700, color: '#E8EAED', letterSpacing: '-.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: 'var(--faint)', letterSpacing: '.05em', marginTop: '.1rem' }}>Day {d.n} · {d.problems.length} problems</div>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', fontWeight: 600, color: full ? 'var(--green)' : 'var(--muted)', flexShrink: 0 }}>{dayDone}/{d.problems.length}</span>
                  <span style={{ fontSize: '.75rem', color: 'var(--faint)', flexShrink: 0, transition: 'transform .18s', transform: isOpen ? 'rotate(90deg)' : 'none' }}>›</span>
                </div>

                {/* Problems */}
                {isOpen && (
                  <div style={{ padding: '0 1.1rem .85rem' }}>
                    {d.problems.map((name, pi) => {
                      const checked = isChecked(d.n, pi);
                      const hasSol = !!SOL[pid(d.n, pi)];
                      return (
                        <div
                          key={pi}
                          style={rowStyle}
                          onMouseEnter={e => {
                            const btn = e.currentTarget.querySelector('[data-sol]') as HTMLElement;
                            if (btn) btn.style.opacity = '1';
                          }}
                          onMouseLeave={e => {
                            const btn = e.currentTarget.querySelector('[data-sol]') as HTMLElement;
                            if (btn) btn.style.opacity = '0';
                          }}
                        >
                          <div
                            onClick={() => toggle(d.n, pi)}
                            style={{ ...checkBase, background: checked ? 'var(--green)' : 'transparent', borderColor: checked ? 'var(--green)' : 'var(--border2)' }}
                          >
                            {checked && '✓'}
                          </div>
                          <div
                            onClick={() => toggle(d.n, pi)}
                            style={{ fontSize: '.84rem', color: checked ? 'var(--faint)' : 'var(--text)', transition: 'color .15s', lineHeight: 1.4, flex: 1, textDecoration: checked ? 'line-through' : 'none' }}
                          >
                            {name}
                          </div>
                          {hasSol && (
                            <>
                              <button
                                data-sol="1"
                                onClick={() => onOpenSolution(d.n, pi, name)}
                                style={{ opacity: 0, padding: '.15rem .45rem', borderRadius: 3, border: '1px solid var(--border2)', background: 'var(--surf2)', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', cursor: 'pointer', transition: 'all .15s', whiteSpace: 'nowrap', flexShrink: 0 }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--muted)'; }}
                              >
                                {'{ }'}
                              </button>
                              <button
                                data-sol="1"
                                onClick={() => window.open(`/solution?d=${d.n}&pi=${pi}&name=${encodeURIComponent(name)}`, '_blank')}
                                title="Open in new tab"
                                style={{ opacity: 0, padding: '.15rem .4rem', borderRadius: 3, border: '1px solid var(--border2)', background: 'var(--surf2)', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', cursor: 'pointer', transition: 'all .15s', whiteSpace: 'nowrap', flexShrink: 0 }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--muted)'; }}
                              >
                                ↗
                              </button>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
