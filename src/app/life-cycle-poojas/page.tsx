import LifeCycleSamskaras from '@/components/LifeCycleSamskaras';
import { Suspense } from 'react';

export default function LifeCyclePoojasPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading...</div>}>
        <LifeCycleSamskaras />
      </Suspense>
    </div>
  );
}
