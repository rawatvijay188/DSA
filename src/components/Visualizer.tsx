'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

type VizTab = 'sort' | 'bsearch' | 'graph' | 'stackq';
type SortAlgo = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';

interface SortStep { a: number[]; cmp: number[]; swp: number[]; srt: number[]; pvt: number | null; }

const SORT_CX: Record<SortAlgo, { avg: string; worst: string; space: string }> = {
  bubble:    { avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)' },
  selection: { avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)' },
  insertion: { avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)' },
  merge:     { avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  quick:     { avg: 'O(n log n)', worst: 'O(n²)',      space: 'O(log n)' },
};

function randArr(n: number) { return Array.from({ length: n }, () => Math.floor(Math.random() * 95) + 5); }

function genSortSteps(arr: number[], algo: SortAlgo): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  function snap(cmp: number[] = [], swp: number[] = [], srt: number[] = [], pvt: number | null = null) {
    steps.push({ a: [...a], cmp, swp, srt: [...srt], pvt });
  }
  if (algo === 'bubble') {
    const srt: number[] = [];
    for (let i = 0; i < a.length - 1; i++) {
      for (let j = 0; j < a.length - 1 - i; j++) {
        snap([j, j + 1], [], srt);
        if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; snap([], [j, j + 1], srt); }
      }
      srt.push(a.length - 1 - i);
    }
    srt.push(0); snap([], [], srt);
  } else if (algo === 'selection') {
    const srt: number[] = [];
    for (let i = 0; i < a.length; i++) {
      let mi = i;
      for (let j = i + 1; j < a.length; j++) { snap([mi, j], [], srt); if (a[j] < a[mi]) mi = j; }
      if (mi !== i) { [a[i], a[mi]] = [a[mi], a[i]]; snap([], [i, mi], srt); }
      srt.push(i);
    }
    snap([], [], [...Array.from({ length: a.length }, (_, i) => i)]);
  } else if (algo === 'insertion') {
    const srt = [0];
    for (let i = 1; i < a.length; i++) {
      let j = i;
      while (j > 0) { snap([j - 1, j], [], srt); if (a[j] < a[j - 1]) { [a[j], a[j - 1]] = [a[j - 1], a[j]]; snap([], [j, j - 1], srt); j--; } else break; }
      srt.push(i);
    }
  } else if (algo === 'merge') {
    function ms(l: number, r: number) {
      if (l >= r) return;
      const m = Math.floor((l + r) / 2); ms(l, m); ms(m + 1, r);
      const tmp: number[] = []; let i = l, j = m + 1;
      while (i <= m && j <= r) { snap([i, j]); if (a[i] <= a[j]) tmp.push(a[i++]); else tmp.push(a[j++]); }
      while (i <= m) tmp.push(a[i++]);
      while (j <= r) tmp.push(a[j++]);
      for (let k = l; k <= r; k++) { a[k] = tmp[k - l]; snap([], [k]); }
    }
    ms(0, a.length - 1);
    snap([], [], Array.from({ length: a.length }, (_, i) => i));
  } else if (algo === 'quick') {
    const srt: number[] = [];
    function qs(l: number, r: number) {
      if (l >= r) { if (l === r) srt.push(l); return; }
      let i = l - 1;
      for (let j = l; j < r; j++) { snap([j, r], [], srt, r); if (a[j] <= a[r]) { i++; [a[i], a[j]] = [a[j], a[i]]; snap([], [i, j], srt, r); } }
      [a[i + 1], a[r]] = [a[r], a[i + 1]]; srt.push(i + 1); snap([], [i + 1, r], srt, i + 1);
      qs(l, i); qs(i + 2, r);
    }
    qs(0, a.length - 1); snap([], [], srt);
  }
  return steps;
}

function SortViz() {
  const [algo, setAlgo] = useState<SortAlgo>('bubble');
  const [size, setSize] = useState(40);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  const initSort = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; setPlaying(false); }
    const a = randArr(size);
    const s = genSortSteps(a, algo);
    setSteps(s); setIdx(0);
  }, [algo, size]);

  useEffect(() => { initSort(); }, [initSort]);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setIdx(prev => {
          if (prev >= steps.length - 1) { clearInterval(timerRef.current!); timerRef.current = null; setPlaying(false); return prev; }
          return prev + 1;
        });
      }, Math.max(20, 300 - (speed - 1) * 28));
    } else if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, speed, steps.length]);

  const cx = SORT_CX[algo];
  const step = steps[idx];
  const barStyle = (i: number): React.CSSProperties => {
    if (!step) return {};
    let bg = 'var(--border2)';
    if (step.pvt === i) bg = 'var(--purple)';
    else if (step.srt.includes(i)) bg = 'var(--green)';
    else if (step.swp.includes(i)) bg = 'var(--red)';
    else if (step.cmp.includes(i)) bg = 'var(--yellow)';
    return { background: bg };
  };

  const max = step ? Math.max(...step.a) : 1;

  const ctrlBtn = (label: string, onClick: () => void, primary = false) => (
    <button
      onClick={onClick}
      style={{ padding: '.35rem .8rem', borderRadius: 4, border: `1px solid ${primary ? 'var(--accent)' : 'var(--border)'}`, background: primary ? 'var(--accent)' : 'var(--surf2)', color: primary ? '#0D1117' : 'var(--text)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', fontWeight: primary ? 700 : 500, cursor: 'pointer' }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div ref={barsRef} style={{ flex: 1, padding: '1rem 1rem 0', display: 'flex', alignItems: 'flex-end', gap: 2, overflow: 'hidden', minHeight: 0 }}>
        {step?.a.map((v, i) => (
          <div key={i} className="bar" style={{ height: `${(v / max * 92).toFixed(1)}%`, ...barStyle(i) }} />
        ))}
      </div>
      <div style={{ background: 'var(--surf)', borderTop: '1px solid var(--border)', padding: '.7rem 1rem', display: 'flex', alignItems: 'center', gap: '.75rem', flexWrap: 'wrap' }}>
        {ctrlBtn(playing ? '⏸ Pause' : '▶ Play', () => { if (idx >= steps.length - 1) setIdx(0); setPlaying(p => !p); }, true)}
        {ctrlBtn('Step →', () => { setPlaying(false); setIdx(i => Math.min(i + 1, steps.length - 1)); })}
        {ctrlBtn('↺', initSort)}
        <div style={{ width: 1, height: 20, background: 'var(--border)', flexShrink: 0 }} />
        <select value={algo} onChange={e => setAlgo(e.target.value as SortAlgo)} style={{ background: 'var(--surf2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 4, padding: '.3rem .55rem', fontFamily: "'DM Sans',sans-serif", fontSize: '.82rem' }}>
          {(['bubble','selection','insertion','merge','quick'] as SortAlgo[]).map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)} Sort</option>)}
        </select>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'var(--muted)' }}>SIZE</span>
        <input type="range" min={10} max={80} value={size} onChange={e => setSize(+e.target.value)} style={{ accentColor: 'var(--accent)', width: 80 }} />
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'var(--muted)' }}>SPEED</span>
        <input type="range" min={1} max={10} value={speed} onChange={e => setSpeed(+e.target.value)} style={{ accentColor: 'var(--accent)', width: 80 }} />
      </div>
      <div style={{ background: 'var(--surf)', borderTop: '1px solid var(--border)', padding: '.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        {[{ l: 'Step', v: `${idx} / ${steps.length - 1}` }].map(({ l, v }) => (
          <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: '.1rem' }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>{l}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', color: 'var(--text)' }}>{v}</div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginLeft: 'auto' }}>
          <span className="badge bt">Avg {cx.avg}</span>
          <span className="badge bw">Worst {cx.worst}</span>
          <span className="badge bs">Space {cx.space}</span>
        </div>
      </div>
    </div>
  );
}

function BSViz() {
  const [arr, setArr] = useState<number[]>([]);
  const [target, setTarget] = useState(42);
  const [steps, setSteps] = useState<{ l: number; r: number; m: number; found: number }[]>([]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function genArr() {
    const s = new Set<number>();
    while (s.size < 16) s.add(Math.floor(Math.random() * 90) + 1);
    return [...s].sort((a, b) => a - b);
  }
  function genSteps(a: number[], t: number) {
    const s: { l: number; r: number; m: number; found: number }[] = [];
    let l = 0, r = a.length - 1;
    while (l <= r) {
      const m = Math.floor((l + r) / 2);
      s.push({ l, r, m, found: a[m] === t ? m : -1 });
      if (a[m] === t) break;
      else if (a[m] < t) l = m + 1;
      else r = m - 1;
    }
    if (!s.length || s[s.length - 1].found === -1) s.push({ l: -1, r: -1, m: -1, found: -2 });
    return s;
  }
  useEffect(() => {
    const a = genArr(); setArr(a); const s = genSteps(a, target); setSteps(s); setIdx(0);
  }, []);

  const step = steps[idx];
  const ctrlBtn = (label: string, onClick: () => void, primary = false) => (
    <button onClick={onClick} style={{ padding: '.35rem .8rem', borderRadius: 4, border: `1px solid ${primary ? 'var(--accent)' : 'var(--border)'}`, background: primary ? 'var(--accent)' : 'var(--surf2)', color: primary ? '#0D1117' : 'var(--text)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', fontWeight: primary ? 700 : 500, cursor: 'pointer' }}>{label}</button>
  );
  const msg = step?.found >= 0 ? `Found ${target}!` : step?.found === -2 ? `${target} not found` : `Step ${idx + 1}/${steps.length}`;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '1.5rem', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 7, padding: '.65rem 1.1rem' }}>
        <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.75rem', color: 'var(--muted)', letterSpacing: '.08em' }}>TARGET</label>
        <input type="number" value={target} onChange={e => { const t = +e.target.value; setTarget(t); setSteps(genSteps(arr, t)); setIdx(0); }} style={{ width: 70, background: 'var(--surf2)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text)', padding: '.3rem .55rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.88rem', textAlign: 'center' }} />
        {ctrlBtn('New Array', () => { const a = genArr(); setArr(a); setSteps(genSteps(a, target)); setIdx(0); })}
      </div>
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {arr.map((v, i) => {
          let cls = 'bs-box';
          if (!step || step.found === -2 || i < step.l || i > step.r) cls += ' bsout';
          else if (i === step.m) cls += step.found === i ? ' bsfnd' : ' bsmid';
          else cls += ' bsact';
          return (
            <div key={i} className={cls} style={{ width: 50, height: 50, border: '2px solid var(--border)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '.95rem', fontWeight: 600, color: 'var(--muted)', background: 'var(--surf)', transition: 'all .2s', position: 'relative', flexShrink: 0 }}>
              {v}
              {step && i === step.l && i !== step.m && <span style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', fontWeight: 700, color: 'var(--blue)' }}>L</span>}
              {step && i === step.m && <span style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', fontWeight: 700, color: 'var(--accent)' }}>MID</span>}
              {step && i === step.r && i !== step.m && <span style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', fontWeight: 700, color: 'var(--purple)' }}>R</span>}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', border: '1px solid var(--border)', borderRadius: 7, background: 'var(--surf)', padding: '.7rem 1rem' }}>
        {ctrlBtn(playing ? '⏸ Pause' : '▶ Play', () => {
          if (!playing) {
            if (idx >= steps.length - 1) setIdx(0);
            setPlaying(true);
            timerRef.current = setInterval(() => setIdx(p => { if (p >= steps.length - 1) { clearInterval(timerRef.current!); setPlaying(false); return p; } return p + 1; }), 600);
          } else { clearInterval(timerRef.current!); setPlaying(false); }
        }, true)}
        {ctrlBtn('Step →', () => setIdx(i => Math.min(i + 1, steps.length - 1)))}
        {ctrlBtn('↺', () => setIdx(0))}
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: 'var(--accent)', marginLeft: 'auto' }}>{msg}</span>
      </div>
    </div>
  );
}

function GraphViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<{ id: number; x: number; y: number; l: string; c: string }[]>([]);
  const edgesRef = useRef<[number, number][]>([]);
  const dragRef = useRef<typeof nodesRef.current[0] | null>(null);
  const doffRef = useRef({ x: 0, y: 0 });
  const [algo, setAlgo] = useState<'bfs' | 'dfs'>('bfs');
  const [visited, setVisited] = useState<string[]>([]);

  const draw = useCallback(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = '#484F58'; ctx.lineWidth = 2;
    edgesRef.current.forEach(([a, b]) => {
      const na = nodesRef.current[a], nb = nodesRef.current[b]; if (!na || !nb) return;
      ctx.beginPath(); ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y); ctx.stroke();
    });
    nodesRef.current.forEach(n => {
      ctx.beginPath(); ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);
      ctx.fillStyle = n.c; ctx.fill();
      ctx.font = 'bold 13px "JetBrains Mono"'; ctx.fillStyle = '#0D1117';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(n.l, n.x, n.y);
    });
  }, []);

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; initGraph(); draw(); };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [draw]);

  function initGraph() {
    const cv = canvasRef.current; if (!cv) return;
    const cx = cv.width / 2, cy = cv.height / 2;
    nodesRef.current = [
      { id: 0, x: cx - 120, y: cy - 60, l: 'A', c: '#58A6FF' },
      { id: 1, x: cx + 20, y: cy - 100, l: 'B', c: '#58A6FF' },
      { id: 2, x: cx + 130, y: cy - 30, l: 'C', c: '#58A6FF' },
      { id: 3, x: cx - 40, y: cy + 80, l: 'D', c: '#58A6FF' },
      { id: 4, x: cx + 100, y: cy + 90, l: 'E', c: '#58A6FF' },
    ];
    edgesRef.current = [[0, 1], [0, 3], [1, 2], [1, 3], [2, 4], [3, 4]];
    setVisited([]);
    draw();
  }

  function getNode(x: number, y: number) { return nodesRef.current.find(n => Math.hypot(n.x - x, n.y - y) < 24); }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const cv = canvasRef.current!;
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    const n = getNode(x, y);
    if (n) { dragRef.current = n; doffRef.current = { x: x - n.x, y: y - n.y }; }
    else {
      const id = nodesRef.current.length;
      nodesRef.current = [...nodesRef.current, { id, x, y, l: String.fromCharCode(65 + id % 26), c: '#58A6FF' }];
      draw();
    }
  }
  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!dragRef.current) return;
    const r = canvasRef.current!.getBoundingClientRect();
    dragRef.current.x = e.clientX - r.left - doffRef.current.x;
    dragRef.current.y = e.clientY - r.top - doffRef.current.y;
    draw();
  }

  function runTraversal() {
    const nodes = nodesRef.current, adj: Record<number, number[]> = {};
    nodes.forEach(n => (adj[n.id] = []));
    edgesRef.current.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
    const order: number[] = [], vis = new Set([0]);
    if (algo === 'bfs') {
      const q = [0];
      while (q.length) { const c = q.shift()!; order.push(c); (adj[c] || []).forEach(nb => { if (!vis.has(nb)) { vis.add(nb); q.push(nb); } }); }
    } else {
      function dfs(n: number) { vis.add(n); order.push(n); (adj[n] || []).forEach(nb => { if (!vis.has(nb)) dfs(nb); }); }
      dfs(0);
    }
    nodes.forEach(n => (n.c = '#58A6FF')); draw(); setVisited([]);
    let i = 0;
    const timer = setInterval(() => {
      if (i >= order.length) { clearInterval(timer); return; }
      nodes[order[i]].c = '#3FB950'; draw();
      setVisited(prev => [...prev, nodes[order[i]].l]);
      i++;
    }, 500);
  }

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{ flex: 1, display: 'block', cursor: 'crosshair' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => (dragRef.current = null)}
      />
      <div style={{ width: 210, background: 'var(--surf)', borderLeft: '1px solid var(--border)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '.85rem', overflowY: 'auto', flexShrink: 0 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.85rem', fontWeight: 700, color: '#E8EAED' }}>Graph Traversal</div>
        <select value={algo} onChange={e => setAlgo(e.target.value as 'bfs' | 'dfs')} style={{ background: 'var(--surf2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 4, padding: '.3rem .55rem', fontFamily: "'DM Sans',sans-serif", fontSize: '.82rem', width: '100%' }}>
          <option value="bfs">BFS</option>
          <option value="dfs">DFS</option>
        </select>
        {[{ label: '▶ Run', onClick: runTraversal, primary: true }, { label: 'Reset', onClick: initGraph, primary: false }].map(({ label, onClick, primary }) => (
          <button key={label} onClick={onClick} style={{ padding: '.35rem .8rem', borderRadius: 4, border: `1px solid ${primary ? 'var(--accent)' : 'var(--border)'}`, background: primary ? 'var(--accent)' : 'var(--surf2)', color: primary ? '#0D1117' : 'var(--text)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', fontWeight: primary ? 700 : 500, cursor: 'pointer', width: '100%' }}>
            {label}
          </button>
        ))}
        {visited.length > 0 && (
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.4rem' }}>Visited Order</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {visited.map((l, i) => <span key={i} style={{ padding: '.18rem .5rem', borderRadius: 3, fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', fontWeight: 600, background: 'rgba(63,185,80,.12)', color: 'var(--green)', border: '1px solid rgba(63,185,80,.25)' }}>{l}</span>)}
            </div>
          </div>
        )}
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'var(--faint)', lineHeight: 1.5 }}>
          Click canvas to add nodes.<br />Drag nodes to reposition.
        </div>
      </div>
    </div>
  );
}

function StackQueueViz() {
  const [stack, setStack] = useState<string[]>(['93', '8', '17', '42']);
  const [queue, setQueue] = useState<string[]>(['42', '17', '8', '93']);
  const [stackVal, setStackVal] = useState('');
  const [queueVal, setQueueVal] = useState('');

  const itemStyle = (top: boolean): React.CSSProperties => ({
    padding: '.5rem .75rem', borderRadius: 4, background: 'var(--surf2)',
    border: `1px solid ${top ? 'var(--blue)' : 'var(--border)'}`,
    fontFamily: "'JetBrains Mono',monospace", fontSize: '.85rem', fontWeight: 600,
    color: 'var(--text)', textAlign: 'center',
  });
  const ctrlBtn = (label: string, onClick: () => void, primary = false) => (
    <button onClick={onClick} style={{ padding: '.35rem .8rem', borderRadius: 4, border: `1px solid ${primary ? 'var(--accent)' : 'var(--border)'}`, background: primary ? 'var(--accent)' : 'var(--surf2)', color: primary ? '#0D1117' : 'var(--text)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', fontWeight: primary ? 700 : 500, cursor: 'pointer' }}>{label}</button>
  );

  return (
    <div style={{ flex: 1, display: 'flex', gap: '1.5rem', padding: '1.5rem', overflow: 'hidden' }}>
      {/* Stack */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '.75rem', minWidth: 0 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.95rem', fontWeight: 700, color: '#E8EAED' }}>Stack <span style={{ fontSize: '.68rem', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", fontWeight: 400 }}>LIFO</span></div>
        <div style={{ flex: 1, background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 7, padding: '.6rem', display: 'flex', flexDirection: 'column-reverse', gap: 3, overflowY: 'auto', minHeight: 120 }}>
          {stack.map((v, i) => <div key={i} style={itemStyle(i === stack.length - 1)}>{v}</div>)}
        </div>
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
          <input value={stackVal} onChange={e => setStackVal(e.target.value)} placeholder="val" maxLength={6} style={{ background: 'var(--surf2)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text)', padding: '.35rem .6rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', width: 70 }} />
          {ctrlBtn('Push', () => { if (stackVal) { setStack(s => [...s, stackVal]); setStackVal(''); } }, true)}
          {ctrlBtn('Pop', () => setStack(s => s.slice(0, -1)))}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', color: 'var(--muted)' }}>Top: <strong style={{ color: 'var(--text)' }}>{stack[stack.length - 1] ?? '—'}</strong></div>
      </div>
      {/* Queue */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '.75rem', minWidth: 0 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.95rem', fontWeight: 700, color: '#E8EAED' }}>Queue <span style={{ fontSize: '.68rem', color: 'var(--muted)', fontFamily: "'JetBrains Mono',monospace", fontWeight: 400 }}>FIFO</span></div>
        <div style={{ flex: 1, background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 7, padding: '.6rem', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto', minHeight: 120 }}>
          {queue.map((v, i) => <div key={i} style={itemStyle(i === 0)}>{v}</div>)}
        </div>
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
          <input value={queueVal} onChange={e => setQueueVal(e.target.value)} placeholder="val" maxLength={6} style={{ background: 'var(--surf2)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text)', padding: '.35rem .6rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', width: 70 }} />
          {ctrlBtn('Enqueue', () => { if (queueVal) { setQueue(q => [...q, queueVal]); setQueueVal(''); } }, true)}
          {ctrlBtn('Dequeue', () => setQueue(q => q.slice(1)))}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', color: 'var(--muted)' }}>Front: <strong style={{ color: 'var(--text)' }}>{queue[0] ?? '—'}</strong></div>
      </div>
    </div>
  );
}

export default function Visualizer() {
  const [tab, setTab] = useState<VizTab>('sort');
  const tabs: { id: VizTab; label: string }[] = [
    { id: 'sort', label: 'Sorting' },
    { id: 'bsearch', label: 'Binary Search' },
    { id: 'graph', label: 'Graph' },
    { id: 'stackq', label: 'Stack & Queue' },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: '.25rem', padding: '.65rem 1rem', background: 'var(--surf)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '.28rem .75rem', borderRadius: 4, border: tab === t.id ? '1px solid var(--border)' : 'none', fontFamily: "'DM Sans',sans-serif", fontSize: '.82rem', fontWeight: 500, cursor: 'pointer', background: tab === t.id ? 'var(--surf2)' : 'transparent', color: tab === t.id ? 'var(--text)' : 'var(--muted)', transition: 'all .15s' }}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'sort' && <SortViz />}
      {tab === 'bsearch' && <BSViz />}
      {tab === 'graph' && <GraphViz />}
      {tab === 'stackq' && <StackQueueViz />}
    </div>
  );
}
