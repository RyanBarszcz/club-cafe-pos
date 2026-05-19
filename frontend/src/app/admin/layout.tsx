// src/app/admin/layout.tsx

import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-zinc-100 flex">
            <AdminSidebar />

            <main className="flex-1 h-screen overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}