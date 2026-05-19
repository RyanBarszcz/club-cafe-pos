"use client";

import { useMemo, useState } from "react";
import DashboardStatCard from "../../../components/admin/DashboardStatCard";

const ranges = ["Daily", "Weekly", "Monthly", "YTD"] as const;
const categories = ["All", "Drinks", "Hot Food", "Snacks", "Merch"] as const;

type Range = (typeof ranges)[number];
type SortBy = "units" | "revenue";
type SortDirection = "asc" | "desc";

const productAnalytics = [
    {
        id: 1,
        name: "Protein Shake",
        category: "Drinks",
        dailyUnits: 9,
        weeklyUnits: 48,
        monthlyUnits: 190,
        ytdUnits: 1320,
        dailyRevenue: 80.91,
        weeklyRevenue: 431.52,
        monthlyRevenue: 1708.1,
        ytdRevenue: 11866.8,
    },
    {
        id: 2,
        name: "Chicken Caesar Wrap",
        category: "Hot Food",
        dailyUnits: 5,
        weeklyUnits: 32,
        monthlyUnits: 124,
        ytdUnits: 840,
        dailyRevenue: 57.45,
        weeklyRevenue: 367.68,
        monthlyRevenue: 1424.76,
        ytdRevenue: 9651.6,
    },
    {
        id: 3,
        name: "Energy Bar",
        category: "Snacks",
        dailyUnits: 7,
        weeklyUnits: 26,
        monthlyUnits: 115,
        ytdUnits: 910,
        dailyRevenue: 27.93,
        weeklyRevenue: 103.74,
        monthlyRevenue: 458.85,
        ytdRevenue: 3630.9,
    },
    {
        id: 4,
        name: "Iced Coffee",
        category: "Drinks",
        dailyUnits: 6,
        weeklyUnits: 29,
        monthlyUnits: 142,
        ytdUnits: 1040,
        dailyRevenue: 26.94,
        weeklyRevenue: 130.21,
        monthlyRevenue: 637.58,
        ytdRevenue: 4669.6,
    },
];

export default function AnalyticsPage() {
    const [selectedRange, setSelectedRange] = useState<Range>("Weekly");
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState<SortBy>("revenue");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    const unitKey =
        selectedRange === "Daily"
            ? "dailyUnits"
            : selectedRange === "Weekly"
                ? "weeklyUnits"
                : selectedRange === "Monthly"
                    ? "monthlyUnits"
                    : "ytdUnits";

    const revenueKey =
        selectedRange === "Daily"
            ? "dailyRevenue"
            : selectedRange === "Weekly"
                ? "weeklyRevenue"
                : selectedRange === "Monthly"
                    ? "monthlyRevenue"
                    : "ytdRevenue";

    function handleSort(column: SortBy) {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("desc");
        }
    }

    const filteredProducts = useMemo(() => {
        return productAnalytics
            .filter((product) => {
                const matchesSearch = product.name
                    .toLowerCase()
                    .includes(search.toLowerCase());

                const matchesCategory =
                    selectedCategory === "All" ||
                    product.category === selectedCategory;

                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                const aValue = sortBy === "units" ? a[unitKey] : a[revenueKey];
                const bValue = sortBy === "units" ? b[unitKey] : b[revenueKey];

                return sortDirection === "asc"
                    ? aValue - bValue
                    : bValue - aValue;
            });
    }, [search, selectedCategory, sortBy, sortDirection, unitKey, revenueKey]);

    const totalRevenue = filteredProducts.reduce(
        (sum, product) => sum + product[revenueKey],
        0
    );

    const totalUnits = filteredProducts.reduce(
        (sum, product) => sum + product[unitKey],
        0
    );

    const bestSeller = [...filteredProducts].sort(
        (a, b) => b[unitKey] - a[unitKey]
    )[0];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-zinc-900">
                    Analytics
                </h1>

                <p className="text-zinc-500 mt-2">
                    View product sales by daily, weekly, monthly, and YTD performance.
                </p>
            </div>

            <div className="flex gap-2 mb-6">
                {ranges.map((range) => (
                    <button
                        key={range}
                        onClick={() => setSelectedRange(range)}
                        className={`px-4 py-3 rounded-2xl font-semibold transition hover:cursor-pointer ${selectedRange === range
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-zinc-200 text-zinc-500 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                    >
                        {range}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <DashboardStatCard
                    title={`${selectedRange} Revenue`}
                    value={`$${totalRevenue.toFixed(2)}`}
                    highlighted
                />

                <DashboardStatCard
                    title={`${selectedRange} Units Sold`}
                    value={String(totalUnits)}
                />

                <DashboardStatCard
                    title="Best Seller"
                    value={bestSeller?.name ?? "N/A"}
                />
            </div>

            <div className="bg-white rounded-3xl border border-zinc-200 p-6 mt-6">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-zinc-100 border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                    />

                    <div className="flex gap-2 flex-wrap">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-3 rounded-2xl font-semibold transition hover:cursor-pointer ${selectedCategory === category
                                    ? "bg-blue-600 text-white"
                                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-200">
                            <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                                Product
                            </th>

                            <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                                Category
                            </th>

                            <th
                                onClick={() => handleSort("units")}
                                className={`text-left py-4 px-3 text-sm font-semibold cursor-pointer select-none transition ${sortBy === "units"
                                    ? "text-blue-600"
                                    : "text-zinc-500 hover:text-zinc-700"
                                    }`}
                            >
                                Units Sold{" "}
                                {sortBy === "units" &&
                                    (sortDirection === "asc" ? "↑" : "↓")}
                            </th>

                            <th
                                onClick={() => handleSort("revenue")}
                                className={`text-left py-4 px-3 text-sm font-semibold cursor-pointer select-none transition ${sortBy === "revenue"
                                    ? "text-blue-600"
                                    : "text-zinc-500 hover:text-zinc-700"
                                    }`}
                            >
                                Revenue{" "}
                                {sortBy === "revenue" &&
                                    (sortDirection === "asc" ? "↑" : "↓")}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr
                                key={product.id}
                                className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition"
                            >
                                <td className="py-5 px-3 font-semibold text-zinc-900">
                                    {product.name}
                                </td>

                                <td className="py-5 px-3 text-zinc-500">
                                    {product.category}
                                </td>

                                <td className="py-5 px-3">
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                                        {product[unitKey]}
                                    </span>
                                </td>

                                <td className="py-5 px-3 font-bold text-zinc-900">
                                    ${product[revenueKey].toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}