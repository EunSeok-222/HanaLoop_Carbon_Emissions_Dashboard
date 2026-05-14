import Sidebar from '@/components/dashboard/Sidebar';

export default function CompaniesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pl-64 transition-all duration-300">
        <div className="h-full px-6 py-8 md:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
