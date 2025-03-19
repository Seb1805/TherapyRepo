import { useState } from 'react';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function FetchData( endpoint, method, body) {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      };

      if (body) {
        options["body"] = JSON.stringify(body);
      }

      const response = await fetch(`/api/${endpoint}`, options);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Request failed');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    get: (endpoint) => FetchData(endpoint, 'GET'),
    post: (endpoint, data) => FetchData(endpoint, 'POST', data),
    put: (endpoint, data) => FetchData(endpoint, 'PUT', data),
    delete: (endpoint) => FetchData(endpoint, 'DELETE'),
    loading,
    error,
  };
}