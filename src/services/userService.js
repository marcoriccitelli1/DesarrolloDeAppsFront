import { useAxios } from '../hooks/useAxios';

export const useUserService = () => {
  const axios = useAxios();

  // Función centralizada para manejar errores de usuario
  const handleUserError = (err, customMessages = {}) => {
    console.error('Error en operación de usuario:', err);
    
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
        401: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        403: 'No tienes permisos para realizar esta acción.',
        404: 'Usuario no encontrado.',
        500: 'Error en el servidor. Por favor, intenta más tarde.',
        default: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.'
      };

      return {
        error: customMessages[status] || defaultMessages[status] || defaultMessages.default,
        status
      };
    }

    return {
      error: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
      status: 'unknown'
    };
  };

  // Obtener datos del usuario actual
  const getUserProfile = async () => {
    try {
      const response = await axios.get('/user/getUser');
      
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      return {
        success: false,
        ...handleUserError(err, {
          403: 'No tienes permisos para ver tu perfil.',
          default: 'Error al cargar los datos del perfil'
        })
      };
    }
  };

  // Cambiar contraseña del usuario
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.post('/user/changePassword', {
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
        ...handleUserError(err, {
          400: 'La contraseña actual es incorrecta.',
          401: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          default: 'Error al cambiar la contraseña'
        })
      };
    }
  };

  // Actualizar datos del perfil (para futuras funcionalidades)
  const updateProfile = async (userData) => {
    try {
      const response = await axios.put('/user/updateProfile', userData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      return {
        success: false,
        ...handleUserError(err, {
          400: 'Datos de perfil inválidos.',
          409: 'El email ya está en uso por otro usuario.',
          default: 'Error al actualizar el perfil'
        })
      };
    }
  };

  // Verificar conexión al servidor
  const checkConnection = async () => {
    try {
      const response = await axios.get('/health');
      return {
        success: true,
        isConnected: response.status === 200
      };
    } catch (err) {
      return {
        success: false,
        isConnected: false,
        ...handleUserError(err)
      };
    }
  };

  return {
    getUserProfile,
    changePassword,
    updateProfile,
    checkConnection,
    handleUserError
  };
}; 