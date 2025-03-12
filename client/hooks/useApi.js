import { useState } from 'react';

// Generic API hook that handles loading, error states, and different HTTP methods
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic fetch function
  async function FetchData( endpoint, method, body, header) {
    setLoading(true);
    setError(null);

    try {
      const options = {
        method,
        headers: header || {
          'Content-Type': 'application/json',
        },
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      // Call our Next.js API route - this ensures the token is added
      const response = await fetch(`/api/${endpoint}`, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
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

  // Return specific methods for different HTTP verbs
  return {
    get: (endpoint) => FetchData(endpoint, 'GET'),
    post: (endpoint, data, header) => FetchData(endpoint, 'POST', data, header),
    put: (endpoint, data) => FetchData(endpoint, 'PUT', data),
    delete: (endpoint) => FetchData(endpoint, 'DELETE'),
    loading,
    error,
  };
}