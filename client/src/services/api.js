import axios from 'axios';

// Locally the Vite dev server and the API run on different ports, so default
// to the Express dev server. In a production build, default to a same-origin
// /api path so the app works when the client and API are served together
// (as they are in the single Vercel project). Set VITE_API_URL to override,
// e.g. when the API is hosted on a separate domain.
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

const api = axios.create({ baseURL });

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('travelmate_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
