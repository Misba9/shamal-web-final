import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api').replace(/\/api\/?$/, '');

export function getImageSrc(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return API_BASE + (url.startsWith('/') ? url : '/' + url);
}
