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
    throw new Error("Login failed");
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

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  return response.json();
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
    throw new Error("Failed to fetch collections");
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
    throw new Error("Failed to fetch products");
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
    throw new Error("Failed to fetch filters");
  }

  return response.json();
}
