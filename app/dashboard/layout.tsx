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
    <div className="min-h-screen bg-linear-to-b from-[#3d130e] via-[#4f1c13] to-[#f0703a] text-gray-100">
      <Header />

      <div className="flex px-6 py-6 gap-6">
        <aside>
          <Sidebar />
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
