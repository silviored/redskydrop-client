'use client';
import { CacheService } from '@/services/cache';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { Toast } from '../toast';
import { GlobalStateProvider } from '@/contexts/global-state';
import { ProductProvider } from '@/contexts/product';
export function Providers({ children }: { children: ReactNode }) {
  return (
    <GlobalStateProvider>
      <ProductProvider>
      <QueryClientProvider client={CacheService.queryClient}>
        <Toast>{children}</Toast>
      </QueryClientProvider>
      </ProductProvider>
    </GlobalStateProvider>
  );
}
