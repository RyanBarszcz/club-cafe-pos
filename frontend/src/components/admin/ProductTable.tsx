// components/admin/ProductTable.tsx

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
];

export default function ProductTable() {
    return (
        <div className="bg-zinc-900 rounded-2xl overflow-hidden">
            <table className="w-full">
                <thead className="bg-zinc-800">
                    <tr>
                        <th className="text-left p-4">Name</th>
                        <th className="text-left p-4">Category</th>
                        <th className="text-left p-4">Price</th>
                        <th className="text-left p-4">Inventory</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {mockProducts.map((product) => (
                        <tr
                            key={product.id}
                            className="border-t border-zinc-800"
                        >
                            <td className="p-4">{product.name}</td>
                            <td className="p-4">{product.category}</td>
                            <td className="p-4">
                                ${product.price}
                            </td>
                            <td className="p-4">
                                {product.inventory}
                            </td>

                            <td className="p-4">
                                <ProductStatusBadges
                                    isHotFood={product.isHotFood}
                                    selfServe={product.selfServe}
                                />
                            </td>

                            <td className="p-4 flex gap-2">
                                <button className="bg-blue-600 px-3 py-1 rounded-lg">
                                    Edit
                                </button>

                                <button className="bg-red-600 px-3 py-1 rounded-lg">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}