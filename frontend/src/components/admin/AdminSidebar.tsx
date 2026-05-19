"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
    const pathname = usePathname();

    function navClass(path: string) {
        const isActive = pathname === path;

        return `
            block
            px-4
            py-3
            rounded-2xl
            transition
            font-semibold
            ${isActive
                ? "bg-blue-50 text-blue-600"
                : "text-zinc-500 hover:bg-zinc-100"
            }
        `;
    }

    return (
        <aside className="w-72 h-screen sticky top-0 bg-white p-6 flex flex-col justify-between border-r border-zinc-200">
            <div>
                <div className="mb-12">
                    <h1 className="text-2xl font-bold text-blue-600">
                        Liberty POS
                    </h1>

                    <p className="text-sm text-zinc-400 mt-1">
                        Admin Panel
                    </p>
                </div>

                <nav className="space-y-2">
                    <p className="text-xs font-semibold text-zinc-400 uppercase mb-3">
                        Menu
                    </p>

                    <Link
                        className={navClass("/admin/dashboard")}
                        href="/admin/dashboard"
                    >
                        Dashboard
                    </Link>

                    <Link
                        className={navClass("/admin/products")}
                        href="/admin/products"
                    >
                        Products
                    </Link>

                    <Link
                        className={navClass("/admin/analytics")}
                        href="/admin/analytics"
                    >
                        Analytics
                    </Link>

                    <Link
                        className={navClass("/admin/team")}
                        href="/admin/team"
                    >
                        Team
                    </Link>
                </nav>

                <div className="mt-12 space-y-2">
                    <p className="text-xs font-semibold text-zinc-400 uppercase mb-3">
                        General
                    </p>

                    <Link
                        className={navClass("/admin/settings")}
                        href="/admin/settings"
                    >
                        Settings
                    </Link>
                </div>
            </div>

            <button className="w-full text-left px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 font-semibold hover:cursor-pointer transition">
                Logout
            </button>
        </aside>
    );
}