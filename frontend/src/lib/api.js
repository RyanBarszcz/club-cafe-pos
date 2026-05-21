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

export async function fetchTransactions({
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
}) {
    try {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            sortBy,
            sortOrder,
        });

        const response = await fetch(`${API_BASE_URL}/transactions?${params}`);

        return await handleResponse(response);
    } catch (error) {
        console.error("fetchTransactions error:", error);
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

export async function fetchTeamMembers() {
    try {
        const response = await fetch(`${API_BASE_URL}/team`);

        const data = await handleResponse(response);

        return data.users ?? data;
    } catch (error) {
        console.error("fetchTeamMembers error:", error);
        throw error;
    }
}

export async function createTeamMember(teamMemberData) {
    try {
        const response = await fetch(`${API_BASE_URL}/team`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(teamMemberData),
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("createTeamMember error:", error);
        throw error;
    }
}

export async function updateTeamMember(id, teamMemberData) {
    try {
        const response = await fetch(`${API_BASE_URL}/team/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(teamMemberData),
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("updateTeamMember error:", error);
        throw error;
    }
}

export async function deleteTeamMember(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/team/${id}`, {
            method: "DELETE",
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("deleteTeamMember error:", error);
        throw error;
    }
}

export async function fetchSettings() {
    const response = await fetch(`${API_BASE_URL}/settings`);
    return await handleResponse(response);
}

export async function updateSettings(settingsData) {
    const response = await fetch(`${API_BASE_URL}/settings`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsData),
    });

    return await handleResponse(response);
}