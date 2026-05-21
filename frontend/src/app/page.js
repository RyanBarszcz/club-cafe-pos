"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchProducts } from "../../src/lib/api.js";
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
  const { isLoaded, isSignedIn, user } = useUser();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  const role = useMemo(() => {
    if (!isLoaded || !isSignedIn || !user) return "guest";

    const metadataRole = user.publicMetadata?.role;

    if (metadataRole === "admin") return "admin";
    if (metadataRole === "employee") return "employee";

    return "guest";
  }, [isLoaded, isSignedIn, user]);

  const isEmployee = role === "employee" || role === "admin";

  useEffect(() => {
      async function loadProducts() {
          try {
              const data = await fetchProducts();
              setProducts(data);
          } catch (error) {
              console.error(error);
          }
      }

      loadProducts();
  }, []);

  useEffect(() => {
    console.log("products state updated", products);
  }, [products]);

  useEffect(() => {
    localStorage.setItem("currentCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      if (isEmployee) return true;
      return product.isSelfServeEnabled;
    });
  }, [isEmployee, products]);

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
