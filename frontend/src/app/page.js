"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { mockProducts } from "../lib/mockProducts";
import CategoryTabs from "../components/kiosk/CategoryTabs";
import KioskProductGrid from "../components/kiosk/KioskProductGrid";
import KioskCart from "../components/kiosk/KioskCart";

const allCategories = [
  "All",
  "Drinks",
  "Snacks",
  "Protein",
  "Hot Food",
  "Grab & Go",
  "Merch",
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isEmployee, setIsEmployee] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    setIsEmployee(savedRole === "employee" || savedRole === "admin");
  }, []);

  useEffect(() => {
    localStorage.setItem("currentCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const visibleProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      if (isEmployee) return true;
      return product.isSelfServeEnabled;
    });
  }, [isEmployee]);

  const categories = useMemo(() => {
    return allCategories.filter((category) => {
      if (category === "All") return true;

      return visibleProducts.some((product) => product.category === category);
    });
  }, [visibleProducts]);

  const filteredProducts = useMemo(() => {
    return visibleProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [visibleProducts, selectedCategory, searchTerm]);

  function handleAddToCart(product) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  }

  function handleIncreaseItem(id) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function handleDecreaseItem(id) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function handleRemoveItem(id) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  }

  function handleDemoEmployeeLogin() {
    localStorage.setItem("userRole", "employee");
    setIsEmployee(true);
  }

  function handleDemoLogout() {
    localStorage.removeItem("userRole");
    setIsEmployee(false);
    setSelectedCategory("All");
  }

  return (
    <main className="kiosk-page">
      <section
        className="kiosk-shell"
      >
        <div className="kiosk-main">
          <header className="kiosk-topbar">
            <input
              className="search-input"
              placeholder="Search all products here..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <button className="search-button">Search</button>
          </header>

          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <KioskProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
          />

          {isEmployee ? (
            <Link href="/dashboard" className="staff-link">
              Admin dashboard
            </Link>
          ) : (
            <button className="staff-link staff-link-button" onClick={handleDemoEmployeeLogin}>
              Staff sign in
            </button>
          )}
        </div>

        <KioskCart
          cartItems={cartItems}
          onIncreaseItem={handleIncreaseItem}
          onDecreaseItem={handleDecreaseItem}
          onRemoveItem={handleRemoveItem}
          isEmployee={isEmployee}
        />
      </section>
    </main>
  );
}