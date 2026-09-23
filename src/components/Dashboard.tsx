'use client';
import { TOPICS, DAYS, TOTAL, getTopicDays } from '@/data/curriculum';
import { useProgress } from '@/context/ProgressContext';

function ProgressRing({ done, total }: { done: number; total: number }) {
  const r = 60, circ = 2 * Math.PI * r;
  const dash = (done / total) * circ;
  return (
    <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
      <svg viewBox="0 0 150 150" width="150" height="150">
        <circle fill="none" stroke="var(--surf2)" strokeWidth="8" cx="75" cy="75" r={r} />
        <circle
          fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round"
          cx="75" cy="75" r={r}
          strokeDasharray={`${dash} ${circ}`}
          transform="rotate(-90 75 75)"
          style={{ transition: 'stroke-dasharray .6s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.9rem', fontWeight: 800, color: '#E8EAED', letterSpacing: '-.04em', lineHeight: 1 }}>{done}</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', marginTop: '.25rem' }}>of {total}</div>
      </div>
    </div>
  );
}

function motivateMsg(pct: number, done: number, total: number) {
  if (pct === 0) return 'Every expert was once a beginner. Start with Day 1.';
  if (pct < 25) return `${done} problems done. Build the habit first.`;
  if (pct < 50) return `${done} / ${total} — you're in the thick of it. Keep going.`;
  if (pct < 80) return `More than halfway. The hard patterns are unlocking each other.`;
  if (pct < 100) return `${total - done} left. The finish line is real.`;
  return `All ${total} problems complete. Exceptional work.`;
}

export default function Dashboard({ onGoToPlan }: { onGoToPlan: () => void }) {
  const { isChecked, countDone } = useProgress();

  const done = countDone();
  const pct = Math.round((done / TOTAL) * 100);
  const daysTouched = DAYS.filter(d => d.problems.some((_, pi) => isChecked(d.n, pi))).length;

  function topicStats(topicId: string) {
    const days = getTopicDays(topicId);
    let tot = 0, td = 0;
    days.forEach(day => {
      day.problems.forEach((_, pi) => { tot++; if (isChecked(day.n, pi)) td++; });
    });
    return { tot, td };
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <ProgressRing done={done} total={TOTAL} />
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.6rem', fontWeight: 800, color: '#E8EAED', letterSpacing: '-.03em', marginBottom: '.4rem' }}>
            34 Days to DSA Mastery
          </div>
          <div style={{ fontSize: '.9rem', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
            {motivateMsg(pct, done, TOTAL)}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { val: `${pct}%`, label: 'Complete' },
              { val: `${daysTouched}/34`, label: 'Days Touched' },
              { val: TOTAL - done, label: 'Remaining' },
            ].map(({ val, label }) => (
              <div key={label} style={{ background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 7, padding: '.6rem 1rem' }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.4rem', fontWeight: 800, color: '#E8EAED', letterSpacing: '-.03em', lineHeight: 1 }}>
                  <span style={{ color: 'var(--accent)' }}>{val}</span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '.2rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topic Grid */}
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.9rem' }}>
        Topic Progress
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: '.75rem' }}>
        {TOPICS.map(t => {
          const { tot, td } = topicStats(t.id);
          const p = tot ? Math.round((td / tot) * 100) : 0;
          return (
            <div
              key={t.id}
              onClick={onGoToPlan}
              style={{ background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', cursor: 'pointer', transition: 'border-color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border2)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.65rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, flexShrink: 0, display: 'inline-block' }} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', fontWeight: 600, color: p === 100 ? 'var(--green)' : 'var(--muted)' }}>{td}/{tot}</span>
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.88rem', fontWeight: 700, color: '#E8EAED', marginBottom: '.2rem', letterSpacing: '-.01em' }}>{t.name}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'var(--faint)', letterSpacing: '.05em', marginBottom: '.6rem' }}>Day {t.days}</div>
              <div style={{ height: 3, background: 'var(--surf2)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${p}%`, background: t.color, borderRadius: 99, transition: 'width .4s ease' }} />
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.63rem', color: 'var(--faint)', marginTop: '.3rem', letterSpacing: '.03em' }}>{p}% complete</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
