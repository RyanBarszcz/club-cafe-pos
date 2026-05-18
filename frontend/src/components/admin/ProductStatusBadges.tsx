// components/admin/ProductStatusBadges.tsx

type ProductStatusBadgesProps = {
    isHotFood: boolean;
    selfServe: boolean;
};

export default function ProductStatusBadges({
    isHotFood,
    selfServe,
}: ProductStatusBadgesProps) {
    return (
        <div className="flex gap-2 flex-wrap">
            {isHotFood && (
                <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-lg text-sm">
                    Hot Food
                </span>
            )}

            {selfServe && (
                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-sm">
                    Self Serve
                </span>
            )}
        </div>
    );
}