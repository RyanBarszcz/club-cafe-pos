import ProductTable from "../../../components/admin/ProductTable";

export default function ProductsPage() {
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

                <button className="bg-blue-950 hover:bg-blue-800 transition hover:cursor-pointer text-white px-5 py-3 rounded-2xl font-semibold">
                    + Add Product
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-zinc-200 p-6">
                <ProductTable />
            </div>
        </div>
    );
}