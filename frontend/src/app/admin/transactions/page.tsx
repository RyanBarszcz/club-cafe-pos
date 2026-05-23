"use client";

import { useEffect, useState } from "react";
import { fetchTransactions } from "../../../lib/api";
import TransactionDetailsModal from "../../../components/admin/TransactionDetailModal";
import { useAuth } from "@clerk/nextjs";

// TODO: Later
// Add refund capability if by card.
// Remove from account if by membership

type TransactionItem = {
    id: string;
    productNameSnapshot: string;
    quantity: number;
    lineTotalCents: number;
};

type Transaction = {
    id: string;
    mode: string;
    paymentMethod: string;
    subtotalCents: number;
    taxCents: number;
    totalCents: number;
    status: string;
    createdAt: string;
    items: TransactionItem[];
    member?: {
        firstName?: string;
        lastName?: string;
    } | null;
    staffUser?: {
        name?: string | null;
        username?: string;
    } | null;
};

type Pagination = {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
};

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedTransaction, setSelectedTransaction] =
        useState<Transaction | null>(null);
    const { getToken } = useAuth();

    useEffect(() => {
        async function loadTransactions() {
            try {
                setIsLoading(true);
                setError("");

                const token = await getToken({ template: "pos-admin" });

                const data = await fetchTransactions({
                    page,
                    limit: 20,
                    sortBy,
                    sortOrder,
                }, token);

                setTransactions(data.transactions);
                setPagination(data.pagination);
            } catch (error) {
                console.error(error);
                setError("Failed to load transactions");
            } finally {
                setIsLoading(false);
            }
        }
        loadTransactions();
    }, [page, sortBy, sortOrder, getToken]);



    function handleSort(field: string) {
        if (sortBy === field) {
            setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }

        setPage(1);
    }

    function formatCurrency(value: number) {
        return `$${Number(value).toFixed(2)}`;
    }

    function formatDate(date: string) {
        return new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            // year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    }

    function getCustomerName(transaction: Transaction) {
        if (transaction.member) {
            return `${transaction.member.firstName ?? ""} ${transaction.member.lastName ?? ""
                }`.trim();
        }

        return "Guest";
    }

    function getStaffName(transaction: Transaction) {
        return (
            transaction.staffUser?.name ||
            transaction.staffUser?.username ||
            "Self-service"
        );
    }

    function getItemsSummary(transaction: Transaction) {
        if (!transaction.items?.length) return "No items";

        const firstItem = transaction.items[0];
        const remainingCount = transaction.items.length - 1;

        if (remainingCount === 0) {
            return `${firstItem.productNameSnapshot} x${firstItem.quantity}`;
        }

        return `${firstItem.productNameSnapshot} x${firstItem.quantity} + ${remainingCount} more`;
    }

    function SortButton({
        label,
        field,
    }: {
        label: string;
        field: string;
    }) {
        const isActive = sortBy === field;

        return (
            <button
                onClick={() => handleSort(field)}
                className={`inline-flex items-center gap-1 font-semibold hover:cursor-pointer ${isActive ? "text-blue-600" : "text-zinc-500"
                    }`}
            >
                {label}
                {isActive && (
                    <span className="text-xs">
                        {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                )}
            </button>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-zinc-900">
                        Transactions
                    </h1>

                    <p className="text-zinc-500 mt-2">
                        View cafe purchases, totals, staff activity, and member
                        charges.
                    </p>
                </div>
            </div>

            {error && (
                <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-2xl font-semibold">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-3xl border border-zinc-200 p-6">
                {isLoading ? (
                    <p className="text-zinc-500">Loading transactions...</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-zinc-200">
                                        <th className="text-left py-4 px-3 text-sm">
                                            <SortButton
                                                label="Date"
                                                field="createdAt"
                                            />
                                        </th>

                                        <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                                            Customer
                                        </th>

                                        <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                                            Staff
                                        </th>

                                        <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                                            Items
                                        </th>

                                        <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                                            Payment
                                        </th>

                                        <th className="text-left py-4 px-3 text-sm font-semibold text-zinc-500">
                                            Mode
                                        </th>

                                        <th className="text-right py-4 px-3 text-sm">
                                            <SortButton
                                                label="Total"
                                                field="totalCents"
                                            />
                                        </th>

                                        <th className="text-right py-4 px-3 text-sm font-semibold text-zinc-500">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr
                                            key={transaction.id}
                                            onClick={() => setSelectedTransaction(transaction)}
                                            className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition hover:cursor-pointer"
                                        >
                                            <td className="py-5 px-3 text-zinc-700 whitespace-nowrap">
                                                {formatDate(
                                                    transaction.createdAt
                                                )}
                                            </td>

                                            <td className="py-5 px-3 font-semibold text-zinc-900 whitespace-nowrap">
                                                {getCustomerName(transaction)}
                                            </td>

                                            <td className="py-5 px-3 text-zinc-500 whitespace-nowrap">
                                                {getStaffName(transaction)}
                                            </td>

                                            <td className="py-5 px-3 text-zinc-500 max-w-xs truncate">
                                                {getItemsSummary(transaction)}
                                            </td>

                                            <td className="py-5 px-3 text-zinc-500 whitespace-nowrap">
                                                {transaction.paymentMethod}
                                            </td>

                                            <td className="py-5 px-3 text-zinc-500 whitespace-nowrap">
                                                {transaction.mode}
                                            </td>

                                            <td className="py-5 px-3 text-right font-bold text-zinc-900 whitespace-nowrap">
                                                {formatCurrency(
                                                    (transaction.totalCents / 100)
                                                )}
                                            </td>

                                            <td className="py-5 px-3 text-right">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${transaction.status ===
                                                        "COMPLETED"
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-zinc-100 text-zinc-500"
                                                        }`}
                                                >
                                                    {transaction.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {transactions.length === 0 && (
                            <div className="py-10 text-center text-zinc-500">
                                No transactions found.
                            </div>
                        )}

                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-zinc-100">
                                <p className="text-sm text-zinc-500">
                                    Page {pagination.page} of{" "}
                                    {pagination.totalPages} ·{" "}
                                    {pagination.totalCount} transactions
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            setPage((current) =>
                                                Math.max(1, current - 1)
                                            )
                                        }
                                        disabled={page === 1}
                                        className="bg-zinc-100 hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-zinc-100 text-zinc-700 px-4 py-2 rounded-xl font-semibold transition hover:cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>

                                    <button
                                        onClick={() =>
                                            setPage((current) =>
                                                Math.min(
                                                    pagination.totalPages,
                                                    current + 1
                                                )
                                            )
                                        }
                                        disabled={
                                            page === pagination.totalPages
                                        }
                                        className="bg-zinc-100 hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-zinc-100 text-zinc-700 px-4 py-2 rounded-xl font-semibold transition hover:cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                        {selectedTransaction && (
                            <TransactionDetailsModal
                                transaction={selectedTransaction}
                                onClose={() => setSelectedTransaction(null)}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}