import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Dashboard • CanTho FireGuard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-linear-to-b from-[#3d130e] via-[#4f1c13] to-[#f0703a] text-gray-100">
      <Header />

      <div className="flex flex-1 px-6 py-6 gap-6 overflow-hidden">
        <aside className="shrink-0">
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
