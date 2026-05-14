import { Product } from "../../lib/types";
import KioskProductCard from "./KioskProductCard";

type KioskProductGridProps = {
    products: Product[];
    onAddToCart: (product: Product) => void;
};

export default function KioskProductGrid({
    products,
    onAddToCart,
}: KioskProductGridProps) {
    return (
        <div className="product-grid">
            {products.map((product) => (
                <KioskProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
}