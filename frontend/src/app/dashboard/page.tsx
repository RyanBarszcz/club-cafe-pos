// app/dashboard/page.tsx

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6">
            <h1 className="text-4xl font-bold mb-6">
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* DashboardStatCard components go here */}
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">
                    Quick Actions
                </h2>

                <div className="flex gap-4">
                    <button className="bg-blue-600 px-5 py-3 rounded-xl">
                        Manage Products
                    </button>

                    <button className="bg-zinc-800 px-5 py-3 rounded-xl">
                        View Transactions
                    </button>
                </div>
            </div>
        </div>
    );
}