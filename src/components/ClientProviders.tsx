'use client';

import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastProvider } from '@/providers/toast-provider';
import { SocketProvider } from '@/context/SocketContext';
import { TestAttemptProvider } from '@/features/tests/context/TestAttemptContext';
import { TestResultProvider } from '@/features/tests/context/TestResultContext';
import { TestProvider } from '@/context/TestContext';
import { QueryProvider } from '@/providers/query-provider';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <SocketProvider>
        <TestProvider>
          <TestAttemptProvider>
            <TestResultProvider>{children}</TestResultProvider>
          </TestAttemptProvider>
        </TestProvider>
        <ToastProvider />
      </SocketProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryProvider>
  );
}
