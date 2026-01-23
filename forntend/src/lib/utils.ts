import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api').replace(/\/api\/?$/, '') || 'http://localhost:3002';

export function getImageSrc(url: string | undefined): string {
  if (!url) return '/placeholder.svg';
  if (url.startsWith('http')) return url;
  return API_ORIGIN + (url.startsWith('/') ? url : '/' + url);
}
