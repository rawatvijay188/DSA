'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { RICH } from '@/data/rich-solutions';
import { SOL } from '@/data/solutions';
import { ApproachView, SimpleView } from '@/components/SolutionContent';

export default function SolutionView() {
  const params = useSearchParams();
  const d = params.get('d');
  const pi = params.get('pi');
  const name = params.get('name') ?? 'Solution';

  const key = d && pi !== null ? `d${d}:p${pi}` : null;
  const rich = key ? (RICH[key] ?? null) : null;
  const simple = key ? (SOL[key] ?? null) : null;

  const [selIdx, setSelIdx] = useState(0);
  const [descOpen, setDescOpen] = useState(false);

  if (!key) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: "'JetBrains Mono',monospace", fontSize: '.85rem', color: 'var(--muted)' }}>
        No solution specified.
      </div>
    );
  }

  const approach = rich?.approaches[selIdx] ?? null;
  const diff = rich?.difficulty;
  const diffColor = diff === 'Easy' ? 'var(--green)' : diff === 'Medium' ? 'var(--accent)' : 'var(--red)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '.85rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surf)', flexShrink: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#E8EAED', letterSpacing: '-.01em' }}>{name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.55rem', marginTop: '.2rem', flexWrap: 'wrap' }}>
            {diff && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 600, color: diffColor }}>{diff}</span>}
            {rich?.link && (
              <a
                href={rich.link}
                target="_blank"
                rel="noreferrer"
                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 600, color: 'var(--blue)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '.2rem', padding: '.1rem .35rem', borderRadius: 4, border: '1px solid rgba(88,166,255,.3)', background: 'rgba(88,166,255,.07)' }}
              >
                LeetCode ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* problem description */}
      {rich?.description && (
        <div style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <button
            onClick={() => setDescOpen(o => !o)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.45rem 1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontFamily: "'DM Sans',sans-serif", fontSize: '.78rem', fontWeight: 500 }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
              <span style={{ fontSize: '.72rem' }}>📋</span> Problem Statement
            </span>
            <span style={{ fontSize: '.7rem', opacity: .7, transition: 'transform .2s', transform: descOpen ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</span>
          </button>
          {descOpen && (
            <div style={{ padding: '.1rem 1.5rem .85rem', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
              <p style={{ margin: 0, fontFamily: "'DM Sans',sans-serif", fontSize: '.84rem', lineHeight: 1.65, color: 'var(--text)' }}>{rich.description}</p>
              {rich.constraints && rich.constraints.length > 0 && (
                <div style={{ background: 'var(--surf)', borderRadius: 6, padding: '.5rem .75rem', display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 600, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.1rem' }}>Constraints</div>
                  {rich.constraints.map((c, i) => (
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

      {rich ? (
        <>
          {/* approach selector */}
          <div style={{ display: 'flex', gap: '.3rem', padding: '.55rem 1.5rem', background: 'var(--surf)', borderBottom: '1px solid var(--border)', overflowX: 'auto', flexShrink: 0 }}>
            {rich.approaches.map((a, i) => (
              <button
                key={i}
                onClick={() => setSelIdx(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '.4rem', flexShrink: 0,
                  padding: '.28rem .75rem', borderRadius: 5,
                  border: selIdx === i ? '1px solid var(--border2)' : '1px solid transparent',
                  background: selIdx === i ? 'var(--bg)' : 'transparent',
                  color: selIdx === i ? 'var(--text)' : 'var(--muted)',
                  fontFamily: "'DM Sans',sans-serif", fontSize: '.8rem', fontWeight: selIdx === i ? 600 : 400,
                  cursor: 'pointer', transition: 'all .15s', whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 700, color: selIdx === i ? 'var(--accent)' : 'var(--faint)' }}>#{a.rank}</span>
                {a.name}
                {a.tags.includes('optimal') && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {approach && <ApproachView approach={approach} />}
          </div>
        </>
      ) : simple ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <SimpleView solution={simple} />
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', color: 'var(--muted)' }}>
          Solution coming soon.
        </div>
      )}
    </div>
  );
}
