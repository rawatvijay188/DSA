'use client';
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { pid } from '@/data/curriculum';

interface ProgressState {
  completed: Record<string, boolean>;
}

interface ProgressCtx {
  state: ProgressState;
  toggle: (day: number, pi: number) => void;
  reset: () => void;
  isChecked: (day: number, pi: number) => boolean;
  countDone: () => number;
}

const Ctx = createContext<ProgressCtx | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>({ completed: {} });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch('/api/progress')
      .then(r => r.json())
      .then((data: Record<string, boolean>) => setState({ completed: data }))
      .catch(() => {});
  }, []);

  const save = useCallback((s: ProgressState) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s.completed),
      }).catch(() => {});
    }, 800);
  }, []);

  const toggle = useCallback((day: number, pi: number) => {
    setState(prev => {
      const id = pid(day, pi);
      const next = { ...prev, completed: { ...prev.completed, [id]: !prev.completed[id] } };
      save(next);
      return next;
    });
  }, [save]);

  const reset = useCallback(() => {
    const next = { completed: {} };
    setState(next);
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }).catch(() => {});
  }, []);

  const isChecked = useCallback((day: number, pi: number) => {
    return !!state.completed[pid(day, pi)];
  }, [state]);

  const countDone = useCallback(() => {
    return Object.values(state.completed).filter(Boolean).length;
  }, [state]);

  return (
    <Ctx.Provider value={{ state, toggle, reset, isChecked, countDone }}>
      {children}
    </Ctx.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProgress must be inside ProgressProvider');
  return ctx;
}
