import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const webStorage = {
  setItemAsync: (key, value) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  getItemAsync: (key) => {
    const value = localStorage.getItem(key);
    return Promise.resolve(value);
  },
  deleteItemAsync: (key) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

const storage = isWeb ? webStorage : SecureStore;

export const saveToken = async (token) => {
  try {
    await storage.setItemAsync('jwt', token);
  } catch (error) {
    if (isWeb) {
      localStorage.setItem('jwt', token);
    }
  }
};

export const getToken = async () => {
  try {
    return await storage.getItemAsync('jwt');
  } catch (error) {
    if (isWeb) {
      return localStorage.getItem('jwt');
    }
    return null;
  }
};

export const removeToken = async () => {
  try {
    await storage.deleteItemAsync('jwt');
  } catch (error) {
    if (isWeb) {
      localStorage.removeItem('jwt');
    }
  }
};