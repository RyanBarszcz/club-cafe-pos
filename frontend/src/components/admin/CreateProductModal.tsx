"use client";

import { useState } from "react";
import { createProduct } from "../../lib/api";
import { useAuth } from "@clerk/nextjs";

const categories = [
    { label: "Drinks", value: "DRINKS" },
    { label: "Snacks", value: "SNACKS" },
    { label: "Protein", value: "PROTEIN" },
    { label: "Hot Food", value: "HOT_FOOD" },
    { label: "Grab & Go", value: "GRAB_AND_GO" },
    { label: "Merch", value: "MERCH" },
];

type CreateProductModalProps = {
    onClose: () => void;
    onProductCreated: () => void;
};

export default function CreateProductModal({
    onClose,
    onProductCreated,
}: CreateProductModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        category: "DRINKS",
        price: "",
        description: "",
        inventoryCount: "",
        lowStockThreshold: "5",
        isHotFood: false,
        isSelfServeEnabled: true,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { getToken } = useAuth();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        try {
            setIsSubmitting(true);
            const token = await getToken({ template: "pos-admin" });

            await createProduct({
                name: formData.name.trim(),
                category: formData.category,
                priceCents: Math.round(Number(formData.price) * 100),
                description: formData.description.trim() || undefined,
                inventoryCount: Number(formData.inventoryCount),
                lowStockThreshold: Number(formData.lowStockThreshold),
                isHotFood: formData.isHotFood,
                isSelfServeEnabled: formData.isSelfServeEnabled,
            }, token);

            onProductCreated();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Add Product</h2>
                        <p className="text-zinc-500 mt-1">
                            Create a new cafe product.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                        placeholder="Product name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        required
                    />

                    <select
                        className="w-full border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                        value={formData.category}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                category: e.target.value,
                            })
                        }
                    >
                        {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            className="border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="Price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    price: e.target.value,
                                })
                            }
                            required
                        />

                        <input
                            className="border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="Inventory"
                            type="number"
                            min="0"
                            value={formData.inventoryCount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    inventoryCount: e.target.value,
                                })
                            }
                            required
                        />

                        <input
                            className="border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="Low stock threshold"
                            type="number"
                            min="0"
                            value={formData.lowStockThreshold}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    lowStockThreshold: e.target.value,
                                })
                            }
                        />
                    </div>

                    <textarea
                        className="w-full border border-zinc-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 min-h-24"
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                    />

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm font-medium">
                            <input
                                type="checkbox"
                                checked={formData.isHotFood}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        isHotFood: e.target.checked,
                                    })
                                }
                            />
                            Hot food
                        </label>

                        <label className="flex items-center gap-2 text-sm font-medium">
                            <input
                                type="checkbox"
                                checked={formData.isSelfServeEnabled}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        isSelfServeEnabled: e.target.checked,
                                    })
                                }
                            />
                            Self-serve enabled
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-950 hover:bg-blue-800 hover:cursor-pointer text-white rounded-2xl py-4 font-semibold transition disabled:opacity-60"
                    >
                        {isSubmitting ? "Creating..." : "Create Product"}
                    </button>
                </form>
            </div>
        </div>
    );
}