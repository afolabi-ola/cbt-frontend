'use client';

import ClientProviders from '@/components/ClientProviders';
import '@/app/globals.css'; // ensure global styles still apply

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}
