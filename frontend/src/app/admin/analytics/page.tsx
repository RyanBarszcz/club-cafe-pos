"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardStatCard from "../../../components/admin/DashboardStatCard";
import { fetchProductAnalytics } from "../../../lib/api";
import { useAuth } from "@clerk/nextjs";

const ranges = ["Daily", "Weekly", "Monthly", "YTD"] as const;
const categories = ["All", "Drinks", "Hot Food", "Snacks", "Merch"] as const;

type Range = (typeof ranges)[number];
type SortBy = "units" | "revenue";
type SortDirection = "asc" | "desc";

const rangeToApi = {
    Daily: "daily",
    Weekly: "weekly",
    Monthly: "monthly",
    YTD: "ytd",
} as const;

type AnalyticsProduct = {
    id: string;
    name: string;
    category: string;
    unitsSold: number;
    revenueCents: number;
};

type AnalyticsResponse = {
    summary: {
        revenueCents: number;
        unitsSold: number;
        bestSeller: AnalyticsProduct | null;
    };
    products: AnalyticsProduct[];
};

export default function AnalyticsPage() {
    const [selectedRange, setSelectedRange] = useState<Range>("Weekly");
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState<SortBy>("revenue");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { getToken } = useAuth();

    useEffect(() => {
        async function loadAnalytics() {
            try {
                setIsLoading(true);
                const token = await getToken({ template: "pos-admin" });

                const data = await fetchProductAnalytics(
                    rangeToApi[selectedRange], token
                );

                setAnalytics(data);
            } catch (error) {
                console.error(error);
                setAnalytics(null);
            } finally {
                setIsLoading(false);
            }
        }

        loadAnalytics();
    }, [selectedRange]);

    function handleSort(column: SortBy) {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("desc");
        }
    }

    const filteredProducts = useMemo(() => {
        const products = analytics?.products ?? [];

        return products
            .filter((product) => {
                const matchesSearch = product.name
                    .toLowerCase()
                    .includes(search.toLowerCase());

                const matchesCategory =
                    selectedCategory === "All" || product.category === selectedCategory;

                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                const aValue = sortBy === "units" ? a.unitsSold : a.revenueCents;
                const bValue = sortBy === "units" ? b.unitsSold : b.revenueCents;

                return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
            });
    }, [analytics, search, selectedCategory, sortBy, sortDirection]);

    const totalRevenueCents = filteredProducts.reduce(
        (sum, product) => sum + product.revenueCents,
        0
    );

    const totalUnits = filteredProducts.reduce(
        (sum, product) => sum + product.unitsSold,
        0
    );

    const bestSeller = [...filteredProducts].sort(
        (a, b) => b.unitsSold - a.unitsSold
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
                    value={`$${(totalRevenueCents / 100).toFixed(2)}`}
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
                                        {product.unitsSold}
                                    </span>
                                </td>

                                <td className="py-5 px-3 font-bold text-zinc-900">
                                    ${(product.revenueCents / 100).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}