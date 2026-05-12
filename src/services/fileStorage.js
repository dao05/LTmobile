import { Platform } from 'react-native';

const DEFAULT_API_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3001'
  : 'http://localhost:3001';

const FILE_API_URL = process.env.EXPO_PUBLIC_FILE_API_URL || DEFAULT_API_URL;
const REQUEST_TIMEOUT_MS = 1200;

const request = async (path, options = {}) => {
  const controller = typeof AbortController !== 'undefined'
    ? new AbortController()
    : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    : null;

  try {
    const response = await fetch(`${FILE_API_URL}${path}`, {
      ...options,
      signal: controller?.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`File API error ${response.status}`);
    }

    return await response.json();
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

export const fileStorage = {
  getData: async () => {
    try {
      return await request('/data');
    } catch (error) {
      console.log('File storage unavailable, using AsyncStorage fallback');
      return null;
    }
  },

  putData: async (data) => {
    try {
      await request('/data', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  patchData: async (partialData) => {
    try {
      await request('/data', {
        method: 'PATCH',
        body: JSON.stringify(partialData),
      });
      return true;
    } catch (error) {
      return false;
    }
  },
};
