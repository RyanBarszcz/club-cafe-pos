"use client";

import DashboardStatCard from "../../../components/admin/DashboardStatCard";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">Dashboard</h1>
                    <p className="text-zinc-500 mt-2">
                        Manage cafe products, inventory, and daily sales.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Link className="bg-blue-950 text-white px-5 py-3 rounded-full" href="/admin/products">
                        + Add Product
                    </Link>

                    <button className="border border-blue-900 text-blue-900 px-5 py-3 rounded-full">
                        Import Data
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <DashboardStatCard title="Today's Sales" value="$1,284" highlighted />
                <DashboardStatCard title="Transactions" value="86" />
                <DashboardStatCard title="Low Stock Items" value="4" />
                <DashboardStatCard title="Products" value="32" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-6">Sales Analytics</h2>

                    <div className="flex items-end gap-5 h-52">
                        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 flex-1">
                                <div
                                    className={`w-full rounded-full ${index === 3
                                        ? "bg-blue-950 h-48"
                                        : index === 2
                                            ? "bg-blue-400 h-36"
                                            : "bg-zinc-200 h-28"
                                        }`}
                                />
                                <span className="text-zinc-400">{day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Low Stock</h2>

                    <div className="space-y-4">
                        <div>
                            <p className="font-medium">Protein Shake</p>
                            <p className="text-sm text-zinc-500">Only 4 left</p>
                        </div>

                        <div>
                            <p className="font-medium">Chicken Wrap</p>
                            <p className="text-sm text-zinc-500">Only 2 left</p>
                        </div>

                        <button className="w-full bg-blue-900 text-white py-3 rounded-full mt-4">
                            View Inventory
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

                    <div className="space-y-4">
                        {["Chicken Caesar Wrap", "Protein Shake", "Energy Bar"].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between border-b border-zinc-100 pb-3"
                            >
                                <div>
                                    <p className="font-medium">{item}</p>
                                    <p className="text-sm text-zinc-500">Member charge</p>
                                </div>

                                <span className="font-semibold">$8.99</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-blue-950 text-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-8">Cafe Status</h2>

                    <p className="text-5xl font-bold mb-2">Open</p>
                    <p className="text-blue-100">Self-service kiosk enabled</p>

                    <button className="w-full bg-white text-blue-950 py-3 rounded-full mt-10">
                        Manage Kiosk
                    </button>
                </div>
            </div>
        </div>
    );
}