// components/admin/DashboardStatCard.tsx

type DashboardStatCardProps = {
    title: string;
    value: string;
};

export default function DashboardStatCard({
    title,
    value,
}: DashboardStatCardProps) {
    return (
        <div className="bg-zinc-900 rounded-2xl p-5">
            <p className="text-zinc-400 text-sm mb-2">
                {title}
            </p>

            <h2 className="text-3xl font-bold">
                {value}
            </h2>
        </div>
    );
}