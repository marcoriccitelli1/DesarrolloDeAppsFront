import { useAxios } from '../hooks/useAxios';

export const useAuthService = () => {
  const axios = useAxios();

  // Función centralizada para manejar errores de autenticación
  const handleAuthError = (err) => {
    if (err.message === 'Network Error' || err.code === 'ECONNABORTED') {
      return {
        error: 'No hay conexión a internet. Por favor, verifica tu conexión.',
        isNetworkError: true
      };
    }

    if (err.response) {
      const status = err.response.status;
      const defaultMessages = {
        400: 'Datos de entrada inválidos.',
        401: 'Email o contraseña incorrectos.',
        409: 'Este correo electrónico ya está registrado.',
        500: 'Error en el servidor. Por favor, intenta más tarde.',
        default: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.'
      };

      return {
        error: err.response.data?.error || defaultMessages[status] || defaultMessages.default,
        status
      };
    }

    return {
      error: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
      status: 'unknown'
    };
  };

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      return {
        success: false,
        ...handleAuthError(err)
      };
    }
  };

  // Registrar usuario
  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      return {
        success: false,
        ...handleAuthError(err)
      };
    }
  };

  // Cambiar contraseña
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      return {
        success: false,
        ...handleAuthError(err)
      };
    }
  };

  // Recuperar contraseña
  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('/auth/forgot-password', {
        email
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      return {
        success: false,
        ...handleAuthError(err)
      };
    }
  };

  // Obtener perfil del usuario
  const getProfile = async () => {
    try {
      const response = await axios.get('/auth/profile');
      
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      return {
        success: false,
        ...handleAuthError(err)
      };
    }
  };

  return {
    login,
    register,
    changePassword,
    forgotPassword,
    getProfile,
    handleAuthError
  };
}; 