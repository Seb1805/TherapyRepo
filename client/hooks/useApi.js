import { useState } from 'react';

// Generic API hook that handles loading, error states, and different HTTP methods
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic fetch function
  async function FetchData( endpoint, method, body) {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Include the token in the request to your API route
          'Authorization': token ? `Bearer ${token}` : '',
        },
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      console.log(`/api/${endpoint}, ${options}`);
      // Call our Next.js API route - this ensures the token is added
      const response = await fetch(`/api/${endpoint}`, options);
      console.log(`2: /api/${endpoint}, ${options}`);

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

  // Return specific methods for different HTTP verbs
  return {
    get: (endpoint) => FetchData(endpoint, 'GET'),
    post: (endpoint, data) => FetchData(endpoint, 'POST', data),
    put: (endpoint, data) => FetchData(endpoint, 'PUT', data),
    delete: (endpoint) => FetchData(endpoint, 'DELETE'),
    loading,
    error,
  };
}