"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { mockProducts } from "../lib/mockProducts";
import CategoryTabs from "../components/kiosk/CategoryTabs";
import KioskProductGrid from "../components/kiosk/KioskProductGrid";
import KioskCart from "../components/kiosk/KioskCart";

const categories = [
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

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

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

  return (
    <main className="kiosk-page">
      <section className="kiosk-shell">
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

          <Link href="/staff-login" className="staff-link">
            Staff sign in
          </Link>
        </div>

        <KioskCart
          cartItems={cartItems}
          onIncreaseItem={handleIncreaseItem}
          onDecreaseItem={handleDecreaseItem}
          onRemoveItem={handleRemoveItem}
        />
      </section>
    </main>
  );
}