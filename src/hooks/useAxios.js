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
    timeout: 10000,
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
        if (err.response?.status === 401) {
          await logout();              
          navigation.reset({           
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
        return Promise.reject(err);
      }
    );
  }, []);

  return axiosInstance.current;
};