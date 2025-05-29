import axios from 'axios';
import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getToken } from '../utils/tokenStorage';
import { useNavigation } from '@react-navigation/native';
import config from '../config/api';

export const useAxios = () => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const axiosInstance = useRef(axios.create({ 
    baseURL: config.API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    }
  }));

  useEffect(() => {
    const instance = axiosInstance.current;

    instance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (res) => res,
      async (err) => {
        if (err.message === 'Network Error' || err.code === 'ECONNABORTED') {
          return Promise.reject({
            response: {
              status: 500,
              data: { message: 'Error de conexión. Por favor, verifica tu conexión a internet.' }
            }
          });
        }
        
        if (err.response?.status === 401 && !err.config.url.includes('/auth/login')) {
          await logout();
          if (navigation) {
            navigation.navigate('Login');
          }
        }
        return Promise.reject(err);
      }
    );
  }, [navigation]);

  return axiosInstance.current;
}; 