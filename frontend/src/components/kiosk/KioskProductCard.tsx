import { Product } from "../../lib/types";

type KioskProductCardProps = {
    product: Product;
    onAddToCart: (product: Product) => void;
};

export default function KioskProductCard({
    product,
    onAddToCart,
}: KioskProductCardProps) {
    return (
        <button className="product-card" onClick={() => onAddToCart(product)}>
            <div className="product-image">
                <span>{product.name.charAt(0)}</span>
            </div>

            <div className="product-info">
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
            </div>
        </button>
    );
}