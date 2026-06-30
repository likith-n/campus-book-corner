// Derives the backend's base URL (without /api) from VITE_API_URL,
// so uploaded image paths like "/uploads/xyz.jpg" resolve correctly
// in both local dev and production deployments.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BACKEND_BASE_URL = API_URL.replace(/\/api\/?$/, '');

export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return '/placeholder.svg';
  return url.startsWith('http') ? url : `${BACKEND_BASE_URL}${url}`;
};
