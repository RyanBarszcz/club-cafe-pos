import { CartItem } from "../../lib/types";

type KioskCartProps = {
    cartItems: CartItem[];
    onIncreaseItem: (id: string) => void;
    onDecreaseItem: (id: string) => void;
    onRemoveItem: (id: string) => void;
    isEmployee?: boolean;
};

export default function KioskCart({
    cartItems,
    onIncreaseItem,
    onDecreaseItem,
    onRemoveItem,
    isEmployee,
}: KioskCartProps) {
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const tax = subtotal * 0.06;
    const total = subtotal + tax;

    return (
        <aside className="cart-panel">
            <div className="cart-header">
                <h2>Order Details</h2>

                {isEmployee && (
                    <div className="employee-badge">
                        EMPLOYEE
                    </div>
                )}
            </div>

            <div className="cart-items">
                {cartItems.length === 0 ? (
                    <p className="empty-cart">No items added yet.</p>
                ) : (
                    cartItems.map((item) => (
                        <div className="cart-item" key={item.id}>
                            <div className="cart-item-image">
                                <span>{item.name.charAt(0)}</span>
                            </div>

                            <div className="cart-item-content">
                                <div className="cart-item-top">
                                    <h3>{item.name}</h3>

                                    <button
                                        className="remove-cart-item"
                                        onClick={() => onRemoveItem(item.id)}
                                        aria-label={`Remove ${item.name}`}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="cart-item-bottom">
                                    <div className="quantity-controls">
                                        <button onClick={() => onDecreaseItem(item.id)}>-</button>
                                        <span>{item.quantity}x</span>
                                        <button onClick={() => onIncreaseItem(item.id)}>+</button>
                                    </div>

                                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="cart-summary">
                <div>
                    <span>Subtotal</span>
                    <strong>${subtotal.toFixed(2)}</strong>
                </div>

                <div>
                    <span>Total sales tax</span>
                    <strong>${tax.toFixed(2)}</strong>
                </div>
            </div>

            <div className="cart-total">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
            </div>

            <button className="checkout-button">Pay Now</button>
        </aside>
    );
}