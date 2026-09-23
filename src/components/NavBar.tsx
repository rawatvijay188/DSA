'use client';

type Tab = 'dashboard' | 'plan' | 'visualizer';

interface Props {
  active: Tab;
  onChange: (t: Tab) => void;
}

export default function NavBar({ active, onChange }: Props) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'plan', label: 'Study Plan' },
    { id: 'visualizer', label: 'Visualizer' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 52, display: 'flex', alignItems: 'center',
      padding: '0 1.5rem', gap: '1rem',
      background: 'rgba(13,17,23,.92)', backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.05rem', fontWeight: 800, color: '#E8EAED', letterSpacing: '-.02em', marginRight: '.75rem' }}>
        DSA<span style={{ color: 'var(--accent)', fontStyle: 'normal' }}>.</span>atlas
      </div>
      <div style={{ display: 'flex', gap: '.2rem' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              padding: '.32rem .85rem', borderRadius: 5, border: 'none',
              fontFamily: "'DM Sans',sans-serif", fontSize: '.84rem', fontWeight: active === t.id ? 600 : 500,
              cursor: 'pointer', transition: 'all .15s',
              background: active === t.id ? 'var(--accent)' : 'transparent',
              color: active === t.id ? '#0D1117' : 'var(--muted)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
