import { CartItem } from "../../lib/types";

type KioskCartProps = {
    cartItems: CartItem[];
    onIncreaseItem: (id: string) => void;
    onDecreaseItem: (id: string) => void;
    onRemoveItem: (id: string) => void;
};

export default function KioskCart({
    cartItems,
    onIncreaseItem,
    onDecreaseItem,
    onRemoveItem,
}: KioskCartProps) {
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const tax = subtotal * 0.06;
    const total = subtotal + tax;

    return (
        <aside className="cart-panel">
            <h2>Order Details</h2>

            <div className="cart-items">
                {cartItems.length === 0 ? (
                    <p className="empty-cart">No items added yet.</p>
                ) : (
                    cartItems.map((item) => (
                        <div className="cart-item" key={item.id}>
                            <button
                                className="remove-cart-item"
                                onClick={() => onRemoveItem(item.id)}
                                aria-label={`Remove ${item.name}`}
                            >
                                ×
                            </button>

                            <div className="cart-item-info">
                                <h3>{item.name}</h3>
                                <strong>${(item.price * item.quantity).toFixed(2)}</strong>

                                <div className="quantity-controls">
                                    <button onClick={() => onDecreaseItem(item.id)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => onIncreaseItem(item.id)}>+</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="cart-totals">
                <div>
                    <span>Subtotal</span>
                    <strong>${subtotal.toFixed(2)}</strong>
                </div>
                <div>
                    <span>Tax</span>
                    <strong>${tax.toFixed(2)}</strong>
                </div>
                <div className="total-row">
                    <span>Total</span>
                    <strong>${total.toFixed(2)}</strong>
                </div>
            </div>

            <button className="pay-button">Charge to Account</button>
        </aside>
    );
}