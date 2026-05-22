"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardStatCard from "../../../components/admin/DashboardStatCard";
import Link from "next/link";
import { fetchAdminDashboard } from "../../../lib/api";

export default function DashboardPage() {
    const [dashboard, setDashboard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const salesChangePercent = dashboard?.summary?.salesChangePercent ?? 0;
    const isSalesIncrease = salesChangePercent >= 0;

    useEffect(() => {
        async function loadDashboard() {
            try {
                setIsLoading(true);
                const data = await fetchAdminDashboard();
                setDashboard(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        loadDashboard();
    }, []);

    const maxWeeklyRevenue = useMemo(() => {
        if (!dashboard?.weeklySales?.length) return 1;

        return Math.max(
            ...dashboard.weeklySales.map((day) => day.revenueCents),
            1
        );
    }, [dashboard]);

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
                    <Link
                        className="bg-blue-950 text-white px-5 py-3 rounded-full"
                        href="/admin/products"
                    >
                        + Add Product
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <DashboardStatCard
                    title="Today's Sales"
                    value={
                        isLoading
                            ? "Loading..."
                            : `$${((dashboard?.summary?.todaysSalesCents ?? 0) / 100).toFixed(2)}`
                    }
                    change={
                        isLoading
                            ? ""
                            : `${isSalesIncrease ? "+" : ""}${salesChangePercent.toFixed(1)}% vs last month`
                    }
                    changeType={isSalesIncrease ? "positive" : "negative"}
                    highlighted
                />
                <DashboardStatCard
                    title="Transactions"
                    value={isLoading ? "Loading..." : dashboard?.summary?.transactionCount ?? 0}
                />
                <DashboardStatCard
                    title="Low Stock Items"
                    value={isLoading ? "Loading..." : dashboard?.summary?.lowStockCount ?? 0}
                />
                <DashboardStatCard
                    title="Products"
                    value={isLoading ? "Loading..." : dashboard?.summary?.productCount ?? 0}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                {/* Sales Analytics */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-6">Sales Analytics</h2>

                    <div className="flex items-end gap-5 h-52">
                        {(dashboard?.weeklySales ?? []).map((day, index) => {
                            const height = Math.max(
                                28,
                                Math.round((day.revenueCents / maxWeeklyRevenue) * 192)
                            );

                            return (
                                <div
                                    key={index}
                                    className="flex flex-col items-center gap-2 flex-1 relative group"
                                >
                                    <div
                                        className="
                                        absolute
                                        -top-12
                                        opacity-0
                                        group-hover:opacity-100
                                        transition-opacity
                                        duration-200
                                        pointer-events-none
                                        bg-zinc-900
                                        text-white
                                        text-sm
                                        px-3
                                        py-1.5
                                        rounded-full
                                        whitespace-nowrap
                                        shadow-lg
                                        "
                                    >
                                        ${(day.revenueCents / 100).toFixed(2)}
                                    </div>

                                    <div
                                        className={`w-full rounded-full transition-all duration-200 ${day.revenueCents === maxWeeklyRevenue
                                            ? "bg-blue-950"
                                            : day.revenueCents > 0
                                                ? "bg-blue-400"
                                                : "bg-zinc-200"
                                            }`}
                                        style={{ height: `${height}px` }}
                                    />

                                    <span className="text-zinc-400">{day.day[0]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* Low Stock */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Low Stock</h2>

                    <div className="space-y-4">
                        {(dashboard?.lowStockItems ?? []).length === 0 ? (
                            <p className="text-sm text-zinc-500">No low stock items.</p>
                        ) : (
                            dashboard.lowStockItems.map((item) => (
                                <div key={item.id}>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-zinc-500">
                                        Only {item.inventoryCount} left
                                    </p>
                                </div>
                            ))
                        )}

                        <button className="w-full bg-blue-900 text-white py-3 rounded-full mt-4">
                            View Inventory
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

                    <div className="space-y-4">
                        {(dashboard?.recentTransactions ?? []).map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between border-b border-zinc-100 pb-3"
                            >
                                <div>
                                    <p className="font-medium">{transaction.title}</p>
                                    <p className="text-sm text-zinc-500">
                                        {transaction.paymentMethod.replace("_", " ")}
                                    </p>
                                </div>

                                <span className="font-semibold">
                                    ${(transaction.totalCents / 100).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cafe Status */}
                <div className="bg-blue-950 text-white rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-8">Cafe Status</h2>

                    <p className="text-5xl font-bold mb-2">
                        {dashboard?.cafeStatus?.isOpen ? "Open" : "Closed"}
                    </p>
                    <p className="text-blue-100">
                        {dashboard?.cafeStatus?.kioskEnabled
                            ? "Self-service kiosk enabled"
                            : "Self-service kiosk disabled"}
                    </p>

                    <button className="w-full bg-white text-blue-950 py-3 rounded-full mt-10">
                        Manage Kiosk
                    </button>
                </div>
            </div>
        </div>
    );
}