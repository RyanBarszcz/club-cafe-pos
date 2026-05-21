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
    staffUser?: {
        name?: string | null;
        username?: string;
    } | null;
};

type TransactionDetailsModalProps = {
    transaction: Transaction;
    onClose: () => void;
};

export default function TransactionDetailsModal({
    transaction,
    onClose,
}: TransactionDetailsModalProps) {
    function formatCurrency(value: number) {
        return `$${Number(value).toFixed(2)}`;
    }

    function formatDate(date: string) {
        return new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    }

    function getStaffName() {
        return (
            transaction.staffUser?.name ||
            transaction.staffUser?.username ||
            "Self-service"
        );
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900">
                            Transaction Details
                        </h2>

                        <p className="text-zinc-500 mt-1">
                            {formatDate(transaction.createdAt)}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 px-4 py-2 rounded-xl font-semibold hover:cursor-pointer"
                    >
                        Close
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <DetailCard
                        label="Total"
                        value={formatCurrency(
                            transaction.totalCents / 100
                        )}
                    />

                    <DetailCard
                        label="Payment"
                        value={transaction.paymentMethod}
                    />

                    <DetailCard
                        label="Status"
                        value={transaction.status}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <DetailCard
                        label="Mode"
                        value={transaction.mode}
                    />

                    <DetailCard
                        label="Staff"
                        value={getStaffName()}
                    />

                    <DetailCard
                        label="Subtotal"
                        value={formatCurrency(
                            transaction.subtotalCents / 100
                        )}
                    />

                    <DetailCard
                        label="Tax"
                        value={formatCurrency(
                            transaction.taxCents / 100
                        )}
                    />
                </div>

                <div className="bg-zinc-50 rounded-2xl p-4">
                    <h3 className="font-bold text-zinc-900 mb-4">
                        Items
                    </h3>

                    <div className="space-y-3">
                        {transaction.items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between"
                            >
                                <div>
                                    <p className="font-semibold text-zinc-900">
                                        {item.productNameSnapshot}
                                    </p>

                                    <p className="text-sm text-zinc-500">
                                        Qty {item.quantity}
                                    </p>
                                </div>

                                <p className="font-bold text-zinc-900">
                                    {formatCurrency(
                                        item.lineTotalCents / 100
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

type DetailCardProps = {
    label: string;
    value: string;
};

function DetailCard({ label, value }: DetailCardProps) {
    return (
        <div className="bg-zinc-50 rounded-2xl p-4">
            <p className="text-sm font-semibold text-zinc-500">
                {label}
            </p>

            <p className="text-lg font-bold text-zinc-900 mt-1">
                {value}
            </p>
        </div>
    );
}