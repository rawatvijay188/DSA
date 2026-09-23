'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Dashboard from '@/components/Dashboard';
import StudyPlan from '@/components/StudyPlan';
import Visualizer from '@/components/Visualizer';
import SolutionDrawer from '@/components/SolutionDrawer';
import { ProgressProvider } from '@/context/ProgressContext';
import { SOL } from '@/data/solutions';
import { RICH } from '@/data/rich-solutions';

type Tab = 'dashboard' | 'plan' | 'visualizer';

interface DrawerState {
  open: boolean;
  day: number;
  pi: number;
  name: string;
}

function AppContent() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [drawer, setDrawer] = useState<DrawerState>({ open: false, day: 0, pi: 0, name: '' });

  function openSolution(day: number, pi: number, name: string) {
    setDrawer({ open: true, day, pi, name });
  }
  function closeDrawer() {
    setDrawer(d => ({ ...d, open: false }));
  }

  const key = `d${drawer.day}:p${drawer.pi}`;

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <NavBar active={tab} onChange={setTab} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginTop: 52 }}>
        {tab === 'dashboard' && <Dashboard onGoToPlan={() => setTab('plan')} />}
        {tab === 'plan' && <StudyPlan onOpenSolution={openSolution} />}
        {tab === 'visualizer' && <Visualizer />}
      </main>
      <SolutionDrawer
        open={drawer.open}
        name={drawer.name}
        richSolution={RICH[key] ?? null}
        simpleSolution={SOL[key] ?? null}
        onClose={closeDrawer}
      />
    </div>
  );
}

export default function Page() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}
