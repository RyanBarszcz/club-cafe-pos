"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAdminProducts, deleteProduct } from "../../lib/api";
import ProductStatusBadges from "./ProductStatusBadges";
import EditProductModal from "./EditProductModal";
import { useAuth } from "@clerk/nextjs";


// const categories = [
//     { label: "All", value: "All" },
//     { label: "Drinks", value: "DRINKS" },
//     { label: "Hot Food", value: "HOT_FOOD" },
//     { label: "Snacks", value: "SNACKS" },
//     { label: "Merch", value: "MERCH" },
// ];

type ProductTableProps = {
    refreshKey?: number;
};

export default function ProductTable({ refreshKey = 0 }: ProductTableProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [productToDelete, setProductToDelete] = useState(null);
    const [productToEdit, setProductToEdit] = useState(null);
    const { getToken } = useAuth();

    useEffect(() => {
        async function loadProducts() {
            try {
                setIsLoading(true);

                const data = await fetchAdminProducts();
                setProducts(data);
            } catch (error) {
                console.error(error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        }

        loadProducts();
    }, [refreshKey]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesCategory =
                selectedCategory === "All" ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, selectedCategory]);

    const categoryOptions = useMemo(() => {
        const uniqueCategories = Array.from(
            new Set(products.map((product) => product.category))
        );

        return ["All", ...uniqueCategories];
    }, [products]);

    function formatCategory(category: string) {
        return category
            .toLowerCase()
            .split("_")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ");
    }

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
                    {categoryOptions.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-3 rounded-2xl font-semibold transition hover:cursor-pointer
                            ${selectedCategory === category
                                    ? "bg-blue-950 text-white"
                                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                                }
                `}
                        >
                            {category === "All"
                                ? "All"
                                : formatCategory(category)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
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
                    {isLoading && (
                        <tr>
                            <td
                                colSpan={6}
                                className="py-10 text-center text-zinc-500"
                            >
                                Loading products...
                            </td>
                        </tr>
                    )}

                    {!isLoading && filteredProducts.length === 0 && (
                        <tr>
                            <td
                                colSpan={6}
                                className="py-10 text-center text-zinc-500"
                            >
                                No products found.
                            </td>
                        </tr>
                    )}
                    {!isLoading &&
                        filteredProducts.map((product) => (
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
                                    {formatCategory(product.category)}
                                </td>

                                <td className="py-5 px-3 font-semibold text-zinc-900">
                                    ${(product.priceCents / 100).toFixed(2)}
                                </td>

                                <td className="py-5 px-3">
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                                        {product.inventoryCount} left
                                    </span>
                                </td>

                                <td className="py-5 px-3">
                                    <ProductStatusBadges
                                        isHotFood={product.isHotFood}
                                        selfServe={product.isSelfServeEnabled}
                                    />
                                </td>

                                <td className="py-5 px-3">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setProductToEdit(product)}
                                            className="bg-blue-50 hover:bg-blue-100 hover:cursor-pointer text-blue-600 px-4 py-2 rounded-xl font-semibold transition hover:cursor-pointer">
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => setProductToDelete(product)}
                                            className="bg-red-50 hover:bg-red-100 hover:cursor-pointer text-red-500 px-4 py-2 rounded-xl font-semibold transition hover:cursor-pointer">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {/* Edit Modal */}
            {productToEdit && (
                <EditProductModal
                    product={productToEdit}
                    onClose={() => setProductToEdit(null)}
                    onProductUpdated={(updatedProduct) => {
                        setProducts((currentProducts) =>
                            currentProducts.map((product) =>
                                product.id === updatedProduct.id
                                    ? updatedProduct
                                    : product
                            )
                        );

                        setProductToEdit(null);
                    }}
                />
            )}

            {/* Delete Modal */}
            {productToDelete && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold">Delete Product?</h2>

                        <p className="text-zinc-500 mt-3">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-zinc-900">
                                {productToDelete.name}
                            </span>
                            ?
                        </p>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setProductToDelete(null)}
                                className="flex-1 bg-zinc-100 hover:cursor-pointer rounded-2xl py-3 font-semibold"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    const token = await getToken({ template: "pos-admin" });
                                    await deleteProduct(productToDelete.id, token);

                                    setProducts((currentProducts) =>
                                        currentProducts.filter(
                                            (product) => product.id !== productToDelete.id
                                        )
                                    );
                                    setProductToDelete(null);
                                }}
                                className="flex-1 bg-red-500 hover:cursor-pointer text-white rounded-2xl py-3 font-semibold"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}