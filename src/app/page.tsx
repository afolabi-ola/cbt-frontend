import Login from "@/features/dashboard/components/Login";
import ClientProviders from '@/components/ClientProviders';

export default function Page() {
  return (
    <ClientProviders>
      <Login />
    </ClientProviders>
  );
}
