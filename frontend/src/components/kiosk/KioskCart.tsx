import { useEffect, useState } from "react";
import { CartItem } from "../../lib/types";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

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
        (sum, item) => sum + (item.priceCents / 100) * item.quantity,
        0
    );
    const router = useRouter();
    const { signOut } = useClerk();

    const tax = subtotal * 0.06;
    const total = subtotal + tax;

    const [tapCount, setTapCount] = useState(0);
    const [employeeTapCount, setEmployeeTapCount] = useState(0);

    function handleLogoTap() {
        setTapCount((prev) => prev + 1);
    }

    function handleEmployeeTap() {
        setEmployeeTapCount((prev) => prev + 1);
    }

    useEffect(() => {
        if (tapCount >= 3) {
            router.push("/staff-login");
        }

        const timeout = setTimeout(() => {
            setTapCount(0);
        }, 1200);

        return () => clearTimeout(timeout);
    }, [tapCount, router]);

    useEffect(() => {
        if (employeeTapCount >= 3) {
            signOut(() => {
                router.push("/");
            });
        }

        const timeout = setTimeout(() => {
            setEmployeeTapCount(0);
        }, 1200);

        return () => clearTimeout(timeout);
    }, [employeeTapCount, signOut, router]);

    return (
        <aside className="cart-panel">
            <div className="cart-header">
                <h2>Order Details</h2>

                {isEmployee ? (
                    <div className="employee-badge"
                        onClick={handleEmployeeTap}>
                        EMPLOYEE
                    </div>
                ) : (
                    <button
                        className="logo-login-button"
                        onClick={handleLogoTap}
                        aria-label="Staff login access"
                    >
                        <Image
                            src="/libertylogo.png"
                            alt="Liberty Cafe"
                            width={64}
                            height={64}
                        />
                    </button>
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

                                    <strong>${((item.priceCents / 100) * item.quantity).toFixed(2)}</strong>
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

            <Link href="/checkout" className="checkout-button">
                Pay Now
            </Link>
        </aside>
    );
}