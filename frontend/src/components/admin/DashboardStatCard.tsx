type DashboardStatCardProps = {
    title: string;
    value: string;
    highlighted?: boolean;
    change?: string;
    changeType?: "positive" | "negative";
};

export default function DashboardStatCard({
    title,
    value,
    highlighted = false,
    change,
    changeType = "positive",
}: DashboardStatCardProps) {
    const isNegative = changeType === "negative";

    return (
        <div
            className={`
                rounded-3xl p-6 shadow-sm border transition-all duration-200 hover:-translate-y-1
                ${highlighted
                    ? "bg-blue-950 text-white"
                    : "bg-white border-zinc-200 text-zinc-950"
                }
            `}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className={`text-sm font-medium mb-3 ${highlighted ? "text-blue-100" : "text-zinc-500"}`}>
                        {title}
                    </p>

                    <h2 className="text-5xl font-bold tracking-tight">
                        {value}
                    </h2>
                </div>

                <div
                    className={`
                        w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-bold
                        ${highlighted ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"}
                    `}
                >
                    {isNegative ? "↘" : "↗"}
                </div>
            </div>

            {change && (
                <div className="mt-6 flex items-center gap-2">
                    <div
                        className={`
                            w-2 h-2 rounded-full
                            ${isNegative ? "bg-red-500" : "bg-green-500"}
                        `}
                    />

                    <p
                        className={`
                            text-sm
                            ${highlighted
                                ? isNegative ? "text-red-200" : "text-green-200"
                                : isNegative ? "text-red-500" : "text-green-600"
                            }
                        `}
                    >
                        {change}
                    </p>
                </div>
            )}
        </div>
    );
}