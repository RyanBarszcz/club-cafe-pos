"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    MdAccountBalance,
    MdCreditCard,
} from "react-icons/md";

import { CartItem } from "../../lib/types";
import { createTransaction } from "../../lib/api";
import MemberLookupModal from "../../components/checkout/MemberLookupModal";
import { useAuth } from "@clerk/nextjs";

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isEmployee, setIsEmployee] = useState(false);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [customDiscount, setCustomDiscount] = useState(0);
    const [isCustomDiscountModalOpen, setIsCustomDiscountModalOpen] =
        useState(false);
    const [isCustomDiscountActive, setIsCustomDiscountActive] =
        useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [isMemberLookupOpen, setIsMemberLookupOpen] = useState(false);
    const { getToken } = useAuth();


    useEffect(() => {
        const savedCart = localStorage.getItem("currentCart");
        const savedRole = localStorage.getItem("userRole");

        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }

        setIsEmployee(
            savedRole === "employee" || savedRole === "admin"
        );
    }, []);

    const subtotal = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            return sum + (item.priceCents / 100) * item.quantity;
        }, 0);
    }, [cartItems]);

    const compedAmount = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            if (!item.isComped) return sum;
            return sum + (item.priceCents / 100) * item.quantity;
        }, 0);
    }, [cartItems]);

    const discountableSubtotal = subtotal - compedAmount;

    const percentDiscountAmount =
        discountableSubtotal * (discountPercent / 100);

    const totalDiscount = Math.min(
        subtotal,
        compedAmount + percentDiscountAmount + customDiscount
    );

    const taxableSubtotal = subtotal - totalDiscount;

    const tax = taxableSubtotal * 0.06;
    const total = taxableSubtotal + tax;

    function handleToggleComp(id: string) {
        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item.id === id
                    ? { ...item, isComped: !item.isComped }
                    : item
            )
        );
    }

    async function handlePayByCard() {
        if (cartItems.length === 0) return;

        try {
            setIsProcessingPayment(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            await createTransaction({
                mode: "KIOSK",
                paymentMethod: "CARD",
                items: cartItems
                    .filter((item) => !item.isComped)
                    .map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                    })),
            });

            localStorage.removeItem("currentCart");
            setCartItems([]);

            window.location.href = "/";
        } catch (error) {
            console.error(error);
            setIsProcessingPayment(false);
        }
    }

    async function handleChargeToAccount(member: { id: string }) {
        if (cartItems.length === 0) return;

        try {
            setIsProcessingPayment(true);

            await createTransaction({
                mode: "STAFF",
                paymentMethod: "CHARGE_TO_ACCOUNT",
                memberId: member.id,
                items: cartItems
                    .filter((item) => !item.isComped)
                    .map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                    })),
            });

            localStorage.removeItem("currentCart");
            setCartItems([]);

            window.location.href = "/";
        } catch (error) {
            console.error(error);
            setIsProcessingPayment(false);
        }
    }

    return (
        <>
            <main className="checkout-page">
                <section className="checkout-shell">
                    <div className="checkout-cart-panel">
                        <div className="checkout-header">
                            <div>
                                <Link href="/" className="back-link">
                                    ← Back to items
                                </Link>

                                <h1>Review Order</h1>
                            </div>
                        </div>

                        <div className="checkout-items">
                            {cartItems.map((item) => (
                                <div className="checkout-item" key={item.id}>
                                    <div className="checkout-item-image">
                                        <span>{item.name.charAt(0)}</span>
                                    </div>

                                    <div>
                                        <h3>{item.name}</h3>

                                        <p>
                                            {item.quantity}x • $
                                            {(item.priceCents / 100).toFixed(2)} each
                                        </p>
                                    </div>

                                    <div className="checkout-item-actions">
                                        <strong
                                            className={item.isComped ? "comped-price" : ""}
                                        >
                                            {item.isComped
                                                ? "COMPED"
                                                : `$${((item.priceCents / 100) * item.quantity).toFixed(2)}`}
                                        </strong>

                                        {isEmployee && (
                                            <button
                                                className={`comp-button ${item.isComped ? "active" : ""
                                                    }`}
                                                onClick={() => handleToggleComp(item.id)}
                                            >
                                                {item.isComped ? "Undo Comp" : "Comp Item"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside className="checkout-payment-panel">
                        <div className="payment-summary-header">
                            <h2>Payment Summary</h2>

                            {isEmployee && (
                                <div className="employee-badge">
                                    EMPLOYEE
                                </div>
                            )}
                        </div>

                        <div className="checkout-summary">
                            <div>
                                <span>Subtotal</span>
                                <strong>${subtotal.toFixed(2)}</strong>
                            </div>

                            {isEmployee && totalDiscount > 0 && (
                                <>
                                    <div>
                                        <span>Discounts</span>
                                        <strong>- ${totalDiscount.toFixed(2)}</strong>
                                    </div>
                                </>
                            )}

                            <div>
                                <span>Total sales tax</span>
                                <strong>${tax.toFixed(2)}</strong>
                            </div>

                            <div className="checkout-total-row">
                                <span>Total</span>
                                <strong>${total.toFixed(2)}</strong>
                            </div>
                        </div>

                        <div className="checkout-payment-options">
                            <button
                                onClick={() => setIsMemberLookupOpen(true)}
                                disabled={cartItems.length === 0}
                                className="checkout-pay-option primary">
                                <MdAccountBalance />
                                Charge to Account
                            </button>

                            <button
                                onClick={handlePayByCard}
                                disabled={isProcessingPayment || cartItems.length === 0}
                                className="checkout-pay-option secondary">
                                <MdCreditCard />
                                Pay by Card
                            </button>
                        </div>

                        {isEmployee && (
                            <div className="employee-checkout-tools">
                                {isEmployee && (
                                    <div className="checkout-discounts">
                                        <p>Discount</p>

                                        <div className="checkout-discount-buttons">
                                            <button
                                                className={discountPercent === 0 ? "active" : ""}
                                                onClick={() => setDiscountPercent(0)}
                                            >
                                                None
                                            </button>

                                            <button
                                                className={discountPercent === 10 ? "active" : ""}
                                                onClick={() => setDiscountPercent(10)}
                                            >
                                                10%
                                            </button>

                                            <button
                                                className={discountPercent === 15 ? "active" : ""}
                                                onClick={() => setDiscountPercent(15)}
                                            >
                                                15%
                                            </button>

                                            <button
                                                className={discountPercent === 20 ? "active" : ""}
                                                onClick={() => setDiscountPercent(20)}
                                            >
                                                20%
                                            </button>
                                            <button
                                                className={isCustomDiscountActive ? "active" : ""}
                                                onClick={() => {
                                                    setDiscountPercent(0);
                                                    setIsCustomDiscountActive(true);
                                                    setIsCustomDiscountModalOpen(true);
                                                }}
                                            >
                                                Custom
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </aside>
                </section>
                {/* Discount Modal */}
                {isCustomDiscountModalOpen && (
                    <div className="modal-backdrop">
                        <div className="custom-discount-modal">
                            <h2>Custom Discount</h2>

                            <label>
                                Discount amount ($)
                                <input
                                    type="number"
                                    min="0.00"
                                    step="0.01"
                                    value={customDiscount}
                                    onChange={(event) =>
                                        setCustomDiscount(Number(event.target.value))
                                    }
                                    placeholder="$0.00"
                                    autoFocus
                                />
                            </label>

                            <div className="modal-actions">
                                <button
                                    className="modal-secondary-button"
                                    onClick={() => {
                                        setCustomDiscount(0);
                                        setIsCustomDiscountActive(false);
                                        setIsCustomDiscountModalOpen(false);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="modal-primary-button"
                                    onClick={() => {
                                        setIsCustomDiscountModalOpen(false);
                                    }}
                                >
                                    Apply Discount
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Member Lookup Modal */}
                {isMemberLookupOpen && (
                    <MemberLookupModal
                        total={total}
                        onClose={() => setIsMemberLookupOpen(false)}
                        onConfirmCharge={handleChargeToAccount}
                    />
                )}
            </main>
            {isProcessingPayment && (
                <div className="payment-processing-overlay">
                    <div className="payment-processing-card">
                        <div className="payment-loader" />
                        <h2>Processing payment</h2>
                        <p>Please wait while we complete your transaction.</p>
                    </div>
                </div>
            )}
        </>
    );
}