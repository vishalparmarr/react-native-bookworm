import { Platform } from 'react';

// When running in development on a physical device or emulator
const DEV_API_URL = Platform.select({
  // For Android Emulator, use 10.0.2.2 instead of localhost
  android: 'http://10.0.2.2:3000/api',
  // For iOS Simulator, use localhost
  ios: 'http://localhost:3000/api',
  // For physical device, use your computer's IP address
  default: 'http://192.168.1.100:3000/api', // Replace X with your IP's last number
});

export const API_BASE_URL = 'http://localhost:3000/api/books';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },
  BOOKS: {
    CREATE: `${API_BASE_URL}/books`,
    LIST: `${API_BASE_URL}/books`,
    DELETE: (id) => `${API_BASE_URL}/books/${id}`,
  }
}; 