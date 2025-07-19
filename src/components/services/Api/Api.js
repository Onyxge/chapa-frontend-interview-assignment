/**
 * A generic fetch handler that simplifies requests and error handling.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} options - The options for the fetch request (method, body, etc.).
 * @returns {Promise<any>} - The JSON response from the API.
 * @throws {Error} - Throws an error if the network response is not ok.
 */
const apiClient = async (endpoint, { body, ...customOptions } = {}) => {
  const headers = { 'Content-Type': 'application/json' };

  const config = {
    method: body ? 'POST' : 'GET',
    ...customOptions,
    headers: {
      ...headers,
      ...customOptions.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred with the API request.');
  }

  return data;
};

// --- AUTH ---
export const login = (email, password) => {
  return apiClient('/api/auth/login', { body: { email, password } });
};

// --- USERS ---
export const getUsers = () => {
  return apiClient('/api/users');
};

export const toggleUserStatus = (userId) => {
  return apiClient(`/api/users/${userId}/status`, { method: 'PATCH' });
};

export const addAdmin = (userData) => {
  const adminData = { ...userData, role: 'admin' };
  return apiClient('/api/users', { body: adminData });
};

export const removeAdmin = (userId) => {
  return apiClient(`/api/users/${userId}`, { method: 'DELETE' });
};

// --- TRANSACTIONS ---
export const getTransactions = (userId) => {
  return apiClient(`/api/transactions?userId=${userId}`);
};

export const addTransaction = (transactionData) => {
  return apiClient('/api/transactions', { body: transactionData });
};

// --- WALLET ---
export const getWalletBalance = (userId) => {
  return apiClient(`/api/wallet/${userId}`);
};
