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

function authHeaders(token) {
    // console.log("Auth token:", token);
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
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
            headers: {"Content-Type": "application/json"},
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
}, token) {
    try {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            sortBy,
            sortOrder,
        });

        const response = await fetch(`${API_BASE_URL}/transactions?${params}`, {
            headers: authHeaders(token),
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("fetchTransactions error:", error);
        throw error;
    }
}

export async function fetchProductAnalytics(range, token) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/analytics/products?range=${range}`,{
                headers: authHeaders(token),
            }
        );

        return await handleResponse(response);
    } catch (error) {
        console.error("fetchProductAnalytics error:", error);
        throw error;
    }
}

export async function fetchAdminDashboard(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: authHeaders(token),
    });

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

export async function createProduct(productData, token) {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: "POST",
            headers: authHeaders(token),
            body: JSON.stringify(productData),
        });

        const data = await handleResponse(response);
        return data.product;
    } catch (error) {
        console.error("createProduct error:", error);
        throw error;
    }
}

export async function updateProduct(id, productData, token) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify(productData),
    });

    const data = await handleResponse(response);
    return data.product;
}

export async function deleteProduct(id, token) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: authHeaders(token),
    });

    const data = await handleResponse(response);
    return data.product;
}

export async function fetchTeamMembers(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/team`, {
            headers: authHeaders(token),
        });

        const data = await handleResponse(response);

        return data.users ?? data;
    } catch (error) {
        console.error("fetchTeamMembers error:", error);
        throw error;
    }
}

export async function createTeamMember(teamMemberData, token) {
    try {
        const response = await fetch(`${API_BASE_URL}/team`, {
            method: "POST",
            headers: authHeaders(token),
            body: JSON.stringify(teamMemberData),
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("createTeamMember error:", error);
        throw error;
    }
}

export async function updateTeamMember(id, teamMemberData, token) {
    try {
        const response = await fetch(`${API_BASE_URL}/team/${id}`, {
            method: "PATCH",
            headers: authHeaders(token),
            body: JSON.stringify(teamMemberData),
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("updateTeamMember error:", error);
        throw error;
    }
}

export async function deleteTeamMember(id, token) {
    try {
        const response = await fetch(`${API_BASE_URL}/team/${id}`, {
            method: "DELETE",
            headers: authHeaders(token)
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("deleteTeamMember error:", error);
        throw error;
    }
}

export async function fetchSettings(token) {
    const response = await fetch(`${API_BASE_URL}/settings`, {
        headers: authHeaders(token),
    });
    return await handleResponse(response);
}

export async function updateSettings(settingsData, token) {
    const response = await fetch(`${API_BASE_URL}/settings`, {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify(settingsData),
    });

    return await handleResponse(response);
}