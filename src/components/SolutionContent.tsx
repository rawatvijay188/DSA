'use client';
import { useEffect, useRef, useState } from 'react';
import type { Approach, FlowNode, DryRun } from '@/data/rich-solutions';

export interface SimpleSolution { t: string; s: string; c: string; }

// ── syntax highlighter ───────────────────────────────────────
const KW = new Set(['function','return','let','const','var','if','else','for','while','do','break','continue','new','class','this','null','undefined','true','false','in','of','typeof','throw','try','catch','instanceof','switch','case','default']);
const BI = new Set(['Math','Array','Object','Set','Map','parseInt','Infinity','Number','String','JSON','console']);
function esc(s: string) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

export function highlight(code: string): string {
  const spans: { start: number; end: number; cls: string }[] = [];
  const used = new Uint8Array(code.length);

  function add(re: RegExp, cls: string, group = 0) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(code)) !== null) {
      const raw = m[group] ?? m[0];
      const start = m.index + (group ? m[0].indexOf(raw) : 0);
      const end = start + raw.length;
      let ok = true;
      for (let i = start; i < end; i++) if (used[i]) { ok = false; break; }
      if (ok) { spans.push({ start, end, cls }); for (let i = start; i < end; i++) used[i] = 1; }
    }
  }

  spans.length = 0; used.fill(0);
  add(/(\/\/[^\n]*)/g, 'cc');
  add(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, 'cs');
  add(/\b\d+(?:\.\d+)?\b/g, 'cn');
  {
    const re = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(code)) !== null) {
      const word = m[1];
      const start = m.index;
      const end = start + word.length;
      let ok = true;
      for (let i = start; i < end; i++) if (used[i]) { ok = false; break; }
      if (!ok) continue;
      const after = code.slice(end).match(/^\s*\(/);
      let cls = '';
      if (KW.has(word)) cls = 'ck';
      else if (BI.has(word)) cls = 'cf';
      else if (after) cls = 'cf';
      if (cls) { spans.push({ start, end, cls }); for (let i = start; i < end; i++) used[i] = 1; }
    }
  }

  spans.sort((a, b) => a.start - b.start);
  let out = '', pos = 0;
  for (const { start, end, cls } of spans) {
    out += esc(code.slice(pos, start));
    out += `<span class="${cls}">${esc(code.slice(start, end))}</span>`;
    pos = end;
  }
  return out + esc(code.slice(pos));
}

// ── tag pill ──────────────────────────────────────────────────
const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  'optimal':        { bg: 'rgba(63,185,80,.15)',  text: '#3FB950' },
  'interview-pick': { bg: 'rgba(88,166,255,.15)', text: '#58A6FF' },
  'elegant':        { bg: 'rgba(188,140,255,.15)',text: '#BC8CFF' },
  'classic':        { bg: 'rgba(121,192,255,.15)',text: '#79C0FF' },
  'brute-force':    { bg: 'rgba(248,113,113,.12)',text: '#F87171' },
};
function TagPill({ tag }: { tag: string }) {
  const c = TAG_COLORS[tag] ?? { bg: 'rgba(255,255,255,.07)', text: '#8B949E' };
  return (
    <span style={{ padding: '.15rem .55rem', borderRadius: 99, fontSize: '.65rem', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', background: c.bg, color: c.text, whiteSpace: 'nowrap' }}>
      {tag}
    </span>
  );
}

// ── section heading ───────────────────────────────────────────
function SectionHead({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.5rem', marginTop: '1.1rem' }}>
      <span style={{ fontSize: '.8rem' }}>{icon}</span>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</span>
    </div>
  );
}

// ── approach view ─────────────────────────────────────────────
type SubTab = 'explanation' | 'flow' | 'dryrun';

export function ApproachView({ approach }: { approach: Approach }) {
  const copyBtn = useRef<HTMLButtonElement>(null);
  const hasFlow = !!(approach.flow && approach.flow.length > 0);
  const hasDryRun = !!approach.dryRun;
  const [subTab, setSubTab] = useState<SubTab>('explanation');

  useEffect(() => { setSubTab('explanation'); }, [approach]);

  const subTabs: { id: SubTab; label: string; icon: string; available: boolean }[] = [
    { id: 'explanation', label: 'Explanation', icon: '📖', available: true },
    { id: 'flow',        label: 'Flow Diagram', icon: '⬡', available: hasFlow },
    { id: 'dryrun',      label: 'Dry Run',      icon: '▶', available: hasDryRun },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '.4rem', padding: '.7rem 1.1rem .3rem', flexShrink: 0 }}>
        <span className="badge bt">{approach.t}</span>
        <span className="badge bs">{approach.s}</span>
        <div style={{ width: 1, height: 14, background: 'var(--border2)', margin: '0 .1rem' }} />
        {approach.tags.map(t => <TagPill key={t} tag={t} />)}
      </div>

      <div style={{ display: 'flex', gap: 2, padding: '.25rem 1.1rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        {subTabs.filter(st => st.available).map(st => (
          <button
            key={st.id}
            onClick={() => setSubTab(st.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '.3rem',
              padding: '.22rem .7rem', borderRadius: '4px 4px 0 0',
              border: subTab === st.id ? '1px solid var(--border)' : '1px solid transparent',
              borderBottom: subTab === st.id ? '1px solid var(--surf)' : '1px solid transparent',
              background: subTab === st.id ? 'var(--surf)' : 'transparent',
              color: subTab === st.id ? 'var(--text)' : 'var(--muted)',
              fontFamily: "'DM Sans',sans-serif", fontSize: '.76rem', fontWeight: subTab === st.id ? 600 : 400,
              cursor: 'pointer', transition: 'all .15s', whiteSpace: 'nowrap',
              marginBottom: -1,
            }}
          >
            <span style={{ fontSize: '.7rem' }}>{st.icon}</span>
            {st.label}
          </button>
        ))}
      </div>

      {subTab === 'explanation' && (
        <div style={{ padding: '0 1.1rem 1.5rem', overflowY: 'auto', flex: 1 }}>
          <SectionHead icon="💡" label="Core Idea" />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.84rem', lineHeight: 1.7, color: 'var(--text)', margin: 0 }}>
            {approach.idea}
          </p>
          <SectionHead icon="🪜" label="Step-by-Step" />
          <ol style={{ margin: 0, padding: '0 0 0 1.2rem', display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
            {approach.walk.map((step, i) => (
              <li key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.83rem', lineHeight: 1.65, color: step.startsWith('  ') ? 'var(--muted)' : 'var(--text)', listStyle: step.startsWith('  ') ? 'none' : 'decimal', marginLeft: step.startsWith('  ') ? '.6rem' : 0 }}>
                {step.trim()}
              </li>
            ))}
          </ol>
          <SectionHead icon="⚠️" label="Notes & Gotchas" />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.83rem', lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>
            {approach.notes}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.1rem', marginBottom: '.45rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
              <span style={{ fontSize: '.8rem' }}>🖥️</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>JavaScript</span>
            </div>
            <button
              ref={copyBtn}
              onClick={() => {
                navigator.clipboard.writeText(approach.code).then(() => {
                  if (copyBtn.current) { copyBtn.current.textContent = 'Copied!'; setTimeout(() => { if (copyBtn.current) copyBtn.current.textContent = 'Copy'; }, 1500); }
                });
              }}
              style={{ padding: '.22rem .65rem', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--surf2)', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', cursor: 'pointer' }}
            >
              Copy
            </button>
          </div>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '.9rem 1rem', overflowX: 'auto' }}>
            <pre
              style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.8rem', lineHeight: 1.75, margin: 0, whiteSpace: 'pre', color: 'var(--text)' }}
              dangerouslySetInnerHTML={{ __html: highlight(approach.code) }}
            />
          </div>
        </div>
      )}

      {subTab === 'flow' && approach.flow && <FlowChart nodes={approach.flow} />}
      {subTab === 'dryrun' && approach.dryRun && <DryRunViewer dryRun={approach.dryRun} />}
    </div>
  );
}

// ── flowchart ─────────────────────────────────────────────────
const NODE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  start:    { bg: 'rgba(63,185,80,.14)',   border: '#3FB950', text: '#3FB950' },
  end:      { bg: 'rgba(248,81,73,.14)',   border: '#F85149', text: '#F85149' },
  init:     { bg: 'rgba(88,166,255,.12)',  border: '#58A6FF', text: '#79C0FF' },
  process:  { bg: 'rgba(255,255,255,.05)', border: '#484F58', text: '#C9D1D9' },
  decision: { bg: 'rgba(240,136,62,.12)',  border: '#F0883E', text: '#F0883E' },
  return:   { bg: 'rgba(188,140,255,.14)', border: '#BC8CFF', text: '#BC8CFF' },
  loop:     { bg: 'rgba(88,166,255,.07)',  border: '#58A6FF', text: '#79C0FF' },
};
const CONNECTOR = (
  <div style={{ width: 2, height: 20, background: '#484F58', margin: '0 auto', flexShrink: 0 }} />
);
function FlowBox({ node }: { node: FlowNode }) {
  const c = NODE_COLORS[node.type] ?? NODE_COLORS.process;
  const isTerminal = node.type === 'start' || node.type === 'end';
  const isDiamond = node.type === 'decision';
  const isLoop = node.type === 'loop';
  const lines = node.text.split('\n');

  if (isDiamond) {
    const maxLen = Math.max(...lines.map(l => l.length));
    const W = Math.max(160, maxLen * 8 + 48);
    const H = 56 + (lines.length - 1) * 20;
    return (
      <svg width={W} height={H} style={{ flexShrink: 0, overflow: 'visible' }}>
        <polygon
          points={`${W/2},4 ${W-6},${H/2} ${W/2},${H-4} 6,${H/2}`}
          fill={c.bg} stroke={c.border} strokeWidth={1.5}
        />
        {lines.map((line, i) => (
          <text key={i} x={W/2} y={H/2 + (i - (lines.length-1)/2) * 18}
            textAnchor="middle" dominantBaseline="middle"
            fill={c.text} fontSize="11.5" fontFamily="JetBrains Mono, monospace" fontWeight="600"
          >{line}</text>
        ))}
      </svg>
    );
  }

  return (
    <div style={{
      borderRadius: isTerminal ? 999 : isLoop ? 6 : 5,
      border: `1.5px solid ${c.border}`,
      background: c.bg,
      padding: isTerminal ? '.35rem 1.4rem' : '.4rem .85rem',
      minWidth: 120,
      maxWidth: 280,
      textAlign: 'center',
    }}>
      {isLoop && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#58A6FF', marginBottom: '.15rem', opacity: .7 }}>↺ LOOP</div>}
      {lines.map((line, i) => (
        <div key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.75rem', fontWeight: 600, color: c.text, lineHeight: 1.55 }}>{line}</div>
      ))}
    </div>
  );
}

function FlowTree({ nodes }: { nodes: FlowNode[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {nodes.map((node, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {i > 0 && CONNECTOR}
          <FlowBox node={node} />
          {node.type === 'decision' && ((node.yes && node.yes.length > 0) || (node.no && node.no.length > 0)) && (
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: 0, alignItems: 'flex-start', justifyContent: 'center' }}>
              {[
                { label: 'YES', nodes: node.yes ?? [], color: '#3FB950' },
                { label: 'NO',  nodes: node.no  ?? [], color: '#F85149' },
              ].map(({ label, nodes: bnodes, color }) => bnodes.length > 0 && (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 100 }}>
                  <div style={{ width: 2, height: 12, background: color }} />
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700, color, letterSpacing: '.06em', marginBottom: 4 }}>{label}</div>
                  <FlowTree nodes={bnodes} />
                </div>
              ))}
            </div>
          )}
          {node.type === 'loop' && node.body && node.body.length > 0 && (
            <div style={{ marginTop: 6, paddingLeft: 12, borderLeft: '2px solid rgba(88,166,255,.35)', marginLeft: 8, alignSelf: 'stretch' }}>
              <FlowTree nodes={node.body} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FlowChart({ nodes }: { nodes: FlowNode[] }) {
  return (
    <div style={{ padding: '1.25rem 1.1rem 1.5rem', overflowY: 'auto', flex: 1 }}>
      <FlowTree nodes={nodes} />
    </div>
  );
}

// ── dry run ───────────────────────────────────────────────────
function DryRunViewer({ dryRun }: { dryRun: DryRun }) {
  const [frame, setFrame] = useState(0);
  const f = dryRun.frames[frame];
  const varKeys = Array.from(new Set(dryRun.frames.flatMap(fr => Object.keys(fr.vars))));

  return (
    <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto' }}>
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '.6rem .9rem', display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: 'var(--muted)', fontWeight: 500 }}>
          <span style={{ color: 'var(--faint)', marginRight: 6 }}>INPUT</span>{dryRun.input}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: 'var(--muted)', fontWeight: 500 }}>
          <span style={{ color: 'var(--faint)', marginRight: 6 }}>EXPECTED</span>{dryRun.expected}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        <button onClick={() => setFrame(f => Math.max(0, f - 1))} disabled={frame === 0}
          style={{ padding: '.28rem .65rem', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--surf2)', color: frame === 0 ? 'var(--faint)' : 'var(--text)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', cursor: frame === 0 ? 'default' : 'pointer' }}>
          ‹
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', color: 'var(--muted)' }}>
          Step {frame + 1} / {dryRun.frames.length}
        </div>
        <button onClick={() => setFrame(f => Math.min(dryRun.frames.length - 1, f + 1))} disabled={frame === dryRun.frames.length - 1}
          style={{ padding: '.28rem .65rem', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--surf2)', color: frame === dryRun.frames.length - 1 ? 'var(--faint)' : 'var(--text)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', cursor: frame === dryRun.frames.length - 1 ? 'default' : 'pointer' }}>
          ›
        </button>
        <button onClick={() => setFrame(0)} style={{ padding: '.28rem .6rem', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--surf2)', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', cursor: 'pointer', marginLeft: '.25rem' }}>↺</button>
      </div>
      <div style={{ background: 'rgba(88,166,255,.08)', border: '1px solid rgba(88,166,255,.2)', borderRadius: 6, padding: '.7rem .9rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#58A6FF', marginBottom: '.3rem' }}>Action</div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.84rem', color: 'var(--text)', lineHeight: 1.55 }}>{f.action}</div>
        {f.note && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: 'var(--green)', marginTop: '.35rem' }}>{f.note}</div>}
      </div>
      <div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.45rem' }}>Variable State</div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(varKeys.length, 3)}, 1fr)`, gap: '.4rem' }}>
          {varKeys.map(k => {
            const changed = f.changed?.includes(k);
            const val = f.vars[k];
            return (
              <div key={k} style={{
                background: changed ? 'rgba(240,136,62,.1)' : 'var(--bg)',
                border: `1px solid ${changed ? 'rgba(240,136,62,.4)' : 'var(--border)'}`,
                borderRadius: 5, padding: '.45rem .6rem', transition: 'all .2s',
              }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: changed ? 'var(--accent)' : 'var(--faint)', marginBottom: '.18rem' }}>{k}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', fontWeight: 700, color: changed ? 'var(--accent)' : 'var(--text)' }}>{String(val)}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.4rem' }}>All Steps</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {dryRun.frames.map((fr, i) => (
            <button key={i} onClick={() => setFrame(i)} style={{
              textAlign: 'left', padding: '.3rem .55rem', borderRadius: 4, border: 'none',
              background: i === frame ? 'rgba(88,166,255,.12)' : 'transparent',
              color: i === frame ? '#58A6FF' : 'var(--muted)',
              fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.45rem',
            }}>
              <span style={{ opacity: .5, minWidth: 18 }}>{i + 1}.</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fr.action}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── simple (legacy) view ──────────────────────────────────────
export function SimpleView({ solution }: { solution: SimpleSolution }) {
  return (
    <>
      <div style={{ padding: '.6rem 1.1rem', display: 'flex', gap: '.4rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <span className="badge bt">Time: {solution.t}</span>
        <span className="badge bs">Space: {solution.s}</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.1rem' }}>
        <pre
          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', lineHeight: 1.7, whiteSpace: 'pre', color: 'var(--text)', margin: 0 }}
          dangerouslySetInnerHTML={{ __html: highlight(solution.c) }}
        />
      </div>
    </>
  );
}
