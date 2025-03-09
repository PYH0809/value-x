'use client';

import { QueryClient, QueryClientProvider as Provider } from '@tanstack/react-query';
import { useRef } from 'react';

function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const queryClientRef = useRef<QueryClient>(null);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  return <Provider client={queryClientRef.current}>{children}</Provider>;
}

export { QueryClientProvider };
