const API_BASE_URL = "https://maestro-api-dev.secil.biz";
const SECRET_TOKEN = "YOUR_SECRET_TOKEN";

export const apiEndpoints = {
  login: `${API_BASE_URL}/Auth/Login`,
  refreshToken: `${API_BASE_URL}/Auth/RefreshTokenLogin`,
  collections: `${API_BASE_URL}/Collection/GetAll`,
  getProducts: (collectionId: number) =>
    `${API_BASE_URL}/Collection/${collectionId}/GetProductsForConstants`,
  getFilters: (collectionId: number) =>
    `${API_BASE_URL}/Collection/${collectionId}/GetFiltersForConstants`,
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiLogin(username: string, password: string) {
  const response = await fetch(apiEndpoints.login, {
    method: "POST",
    headers: {
      Authorization: SECRET_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new ApiError("Login failed", response.status, response.statusText);
  }

  return response.json();
}

export async function apiRefreshToken(refreshToken: string) {
  const response = await fetch(apiEndpoints.refreshToken, {
    method: "POST",
    headers: {
      Authorization: SECRET_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json();

  // Backend returns 200 OK with status: 500 for invalid tokens (buggy API)
  if (data.status === 500 || (data.status !== 0 && data.message)) {
    throw new ApiError(data.message || "Token refresh failed", 500, "Internal Server Error");
  }

  return data;
}

export async function apiGetCollections(accessToken: string, page = 1, pageSize = 10) {
  const response = await fetch(`${apiEndpoints.collections}?page=${page}&pageSize=${pageSize}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new ApiError("Failed to fetch collections", response.status, response.statusText);
  }

  return response.json();
}

export async function apiGetProducts(
  accessToken: string,
  collectionId: number,
  additionalFilters: { id: string; value: string; comparisonType: number }[] = [],
  page = 1,
  pageSize = 36
) {
  const response = await fetch(apiEndpoints.getProducts(collectionId), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ additionalFilters, page, pageSize }),
  });

  if (!response.ok) {
    throw new ApiError("Failed to fetch products", response.status, response.statusText);
  }

  return response.json();
}

export async function apiGetFilters(accessToken: string, collectionId: number) {
  const response = await fetch(apiEndpoints.getFilters(collectionId), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new ApiError("Failed to fetch filters", response.status, response.statusText);
  }

  return response.json();
}
