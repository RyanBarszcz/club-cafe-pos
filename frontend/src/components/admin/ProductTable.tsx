"use client";

import { useMemo, useState } from "react";
import ProductStatusBadges from "./ProductStatusBadges";

const mockProducts = [
    {
        id: 1,
        name: "Protein Shake",
        category: "Drinks",
        price: 8.99,
        inventory: 12,
        isHotFood: false,
        selfServe: true,
    },
    {
        id: 2,
        name: "Chicken Caesar Wrap",
        category: "Hot Food",
        price: 11.49,
        inventory: 4,
        isHotFood: true,
        selfServe: false,
    },
    {
        id: 3,
        name: "Energy Bar",
        category: "Snacks",
        price: 3.99,
        inventory: 28,
        isHotFood: false,
        selfServe: true,
    },
    {
        id: 4,
        name: "Iced Coffee",
        category: "Drinks",
        price: 4.49,
        inventory: 15,
        isHotFood: false,
        selfServe: true,
    },
    {
        id: 5,
        name: "Turkey Panini",
        category: "Hot Food",
        price: 10.99,
        inventory: 3,
        isHotFood: true,
        selfServe: false,
    },
    {
        id: 6,
        name: "Protein Cookies",
        category: "Snacks",
        price: 5.99,
        inventory: 19,
        isHotFood: false,
        selfServe: true,
    },
    {
        id: 7,
        name: "Fruit Smoothie",
        category: "Drinks",
        price: 7.49,
        inventory: 10,
        isHotFood: false,
        selfServe: true,
    },
    {
        id: 8,
        name: "Liberty Hoodie",
        category: "Merch",
        price: 44.99,
        inventory: 6,
        isHotFood: false,
        selfServe: false,
    },
];

const categories = [
    "All",
    "Drinks",
    "Hot Food",
    "Snacks",
    "Merch",
];

export default function ProductTable() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredProducts = useMemo(() => {
        return mockProducts.filter((product) => {
            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesCategory =
                selectedCategory === "All" ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [search, selectedCategory]);

    return (
        <div className="overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="
            flex-1
            bg-zinc-100
            border
            border-zinc-200
            rounded-2xl
            px-4
            py-3
            outline-none
            focus:border-blue-500
        "
                />

                <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`
                    px-4
                    py-3
                    rounded-2xl
                    font-semibold
                    transition
                    hover:cursor-pointer
                    ${selectedCategory === category
                                    ? "bg-blue-950 text-white"
                                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                                }
                `}
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
                            Name
                        </th>
                        <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                            Category
                        </th>
                        <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                            Price
                        </th>
                        <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                            Inventory
                        </th>
                        <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                            Status
                        </th>
                        <th className="text-right py-4 px-3 text-sm font-semibold text-zinc-500">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {filteredProducts.map((product) => (
                        <tr
                            key={product.id}
                            className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition"
                        >
                            <td className="py-5 px-3">
                                <p className="font-semibold text-zinc-900">
                                    {product.name}
                                </p>
                            </td>

                            <td className="py-5 px-3 text-zinc-500">
                                {product.category}
                            </td>

                            <td className="py-5 px-3 font-semibold text-zinc-900">
                                ${ce.toFixed(2)}
                            </td>

                            <td className="py-5 px-3">
                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                                    {product.inventory} left
                                </span>
                            </td>

                            <td className="py-5 px-3">
                                <ProductStatusBadges
                                    isHotFood={product.isHotFood}
                                    selfServe={product.selfServe}
                                />
                            </td>

                            <td className="py-5 px-3">
                                <div className="flex justify-end gap-2">
                                    <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl font-semibold transition hover:cursor-pointer">
                                        Edit
                                    </button>

                                    <button className="bg-red-50 hover:bg-red-100 text-red-500 px-4 py-2 rounded-xl font-semibold transition hover:cursor-pointer">
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}