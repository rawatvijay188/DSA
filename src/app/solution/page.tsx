import { Suspense } from 'react';
import SolutionView from './SolutionView';

export default function Page() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', color: '#8B949E', background: '#0D1117' }}>
        Loading…
      </div>
    }>
      <SolutionView />
    </Suspense>
  );
}
