import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopBar } from "@/components/layout/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9F9FF]">
      <AppSidebar />
      <TopBar />
      <main className="md:ml-[240px] min-h-[calc(100vh-64px)] p-6 md:p-8 flex flex-col gap-8 max-w-[1440px] mx-auto">
        {children}
      </main>
    </div>
  );
}
