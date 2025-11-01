'use client';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-background'>
      {/* Add admin dashboard header/nav here */}
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </div>
  );
}
