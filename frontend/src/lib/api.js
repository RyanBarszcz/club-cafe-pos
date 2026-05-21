const API_BASE_URL = "http://localhost:5000";

export async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        return data.products;
    } catch (error) {
        console.error("fetchProducts error:", error);
        throw error;
    }
}