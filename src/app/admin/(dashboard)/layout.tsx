"use client";

import AdminSidebar from "@/components/sidebar";
import AdminTopBar from "@/components/topbar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <main className="flex flex-row items-stretch min-h-screen bg-primary-50 max-w-400 w-full mx-auto">
      <section className="w-full max-w-70">
        <AdminSidebar />
      </section>

      <section className="flex-1 flex flex-col gap-4 w-full">
        <AdminTopBar />

        <div className="flex-1 w-full p-4">{children}</div>

        <div className="flex items-center justify-center w-full">
          <small>Florintech CBT Portal &#9400; {currentYear}</small>
        </div>
      </section>
    </main>
  );
}
