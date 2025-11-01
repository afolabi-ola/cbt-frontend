'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position='top-right'
      toastOptions={{
        duration: 5000,
        className: 'bg-background text-foreground',
        success: {
          className: 'bg-success-50 text-success-700 border border-success-500',
          duration: 4000,
        },
        error: {
          className: 'bg-error-50 text-error-700 border border-error-500',
          duration: 6000,
        },
        loading: {
          className: 'bg-primary-50 text-primary-700 border border-primary-500',
        },
      }}
    />
  );
}
