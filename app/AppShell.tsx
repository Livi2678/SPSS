'use client';

import { useEffect } from 'react';
import { useApiKey } from '@/hooks/useApiKey';
import { ApiKeyModal } from '@/components/ui/ApiKeyModal';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { status } = useApiKey();

  // Show modal if no key or status has never been set
  const showModal = status === 'idle';

  return (
    <>
      {children}
      <ApiKeyModal isOpen={showModal} />
    </>
  );
}
