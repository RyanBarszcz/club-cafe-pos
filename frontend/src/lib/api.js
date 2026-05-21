const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse(response) {
    if (!response.ok) {
        let errorMessage = "Request failed";

        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {}

        throw new Error(errorMessage);
    }

    return response.json();
}

export async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);

        const data = await handleResponse(response);

        return data.products;
    } catch (error) {
        console.error("fetchProducts error:", error);
        throw error;
    }
}

export async function createTransaction(transactionData) {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(transactionData),
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("createTransaction error:", error);
        throw error;
    }
}

export async function fetchProductAnalytics(range) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/analytics/products?range=${range}`
        );

        return await handleResponse(response);
    } catch (error) {
        console.error("fetchProductAnalytics error:", error);
        throw error;
    }
}

export async function fetchAdminDashboard() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`);

    return await handleResponse(response);
  } catch (error) {
    console.error("fetchAdminDashboard error:", error);
    throw error;
  }
}

export async function fetchAdminProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);

        const data = await handleResponse(response);

        return data.products;
    } catch (error) {
        console.error("fetchAdminProducts error:", error);
        throw error;
    }
}

export async function createProduct(productData) {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
        });

        const data = await handleResponse(response);
        return data.product;
    } catch (error) {
        console.error("createProduct error:", error);
        throw error;
    }
}

export async function updateProduct(id, productData) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
    });

    const data = await handleResponse(response);
    return data.product;
}

export async function deleteProduct(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
    });

    const data = await handleResponse(response);
    return data.product;
}