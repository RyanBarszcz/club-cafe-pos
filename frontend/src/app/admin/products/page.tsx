"use client";

import { useState } from "react";
import ProductTable from "../../../components/admin/ProductTable";
import CreateProductModal from "../../../components/admin/CreateProductModal";

// TODO: Later better adds
// 1. Product images
// 2. Low stock warning colors
// 3. Product active / inactive toggle
// 4. Sort by inventory / revenue
// 5. Pagination
// 6. Search debounce
// 7. Bulk inventory updates

export default function ProductsPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    function handleProductCreated() {
        setRefreshKey((current) => current + 1);
        setIsCreateOpen(false);
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-zinc-900">
                        Products
                    </h1>

                    <p className="text-zinc-500 mt-2">
                        Create, edit, and manage cafe products.
                    </p>
                </div>

                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-blue-950 hover:bg-blue-800 transition hover:cursor-pointer text-white px-5 py-3 rounded-2xl font-semibold"
                >
                    + Add Product
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-zinc-200 p-6">
                <ProductTable refreshKey={refreshKey} />
            </div>

            {isCreateOpen && (
                <CreateProductModal
                    onClose={() => setIsCreateOpen(false)}
                    onProductCreated={handleProductCreated}
                />
            )}
        </div>
    );
}