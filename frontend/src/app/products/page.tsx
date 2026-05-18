// app/products/page.tsx

import ProductTable from "@/components/admin/ProductTable";

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold">
                    Products
                </h1>

                <button className="bg-blue-600 px-5 py-3 rounded-xl">
                    Add Product
                </button>
            </div>

            <ProductTable />
        </div>
    );
}