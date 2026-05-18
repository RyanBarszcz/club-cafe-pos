// components/admin/ProductFormModal.tsx

type ProductFormModalProps = {
    isOpen: boolean;
};

export default function ProductFormModal({
    isOpen,
}: ProductFormModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-zinc-900 w-full max-w-xl rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">
                    Add Product
                </h2>

                <div className="space-y-4">
                    <input
                        placeholder="Product Name"
                        className="w-full bg-zinc-800 rounded-xl p-3"
                    />

                    <input
                        placeholder="Category"
                        className="w-full bg-zinc-800 rounded-xl p-3"
                    />

                    <input
                        placeholder="Price"
                        className="w-full bg-zinc-800 rounded-xl p-3"
                    />

                    <textarea
                        placeholder="Description"
                        className="w-full bg-zinc-800 rounded-xl p-3"
                    />

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            Hot Food
                        </label>

                        <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            Self Serve Enabled
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button className="bg-zinc-700 px-4 py-2 rounded-xl">
                        Cancel
                    </button>

                    <button className="bg-blue-600 px-4 py-2 rounded-xl">
                        Save Product
                    </button>
                </div>
            </div>
        </div>
    );
}