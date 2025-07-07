import { useAxios } from '../hooks/useAxios';

export const useOrderService = () => {
  const axios = useAxios();

  // Función centralizada para manejar errores de red y otros errores
  const handleApiError = (err, customMessages = {}) => {
    if (err.message === 'Network Error' || err.code === 'ECONNABORTED') {
      return {
        error: 'No hay conexión a internet. Por favor, verifica tu conexión.',
        isNetworkError: true
      };
    }

    if (err.response) {
      const status = err.response.status;
      const defaultMessages = {
        401: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        403: 'No tienes permisos para realizar esta acción.',
        404: 'Recurso no encontrado.',
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

  // Función para procesar respuestas de órdenes
  const processOrdersResponse = (response) => {
    if (!response.data) {
      return [];
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (Array.isArray(response.data.orders)) {
      return response.data.orders;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    return [];
  };

  // Obtener órdenes sin asignar
  const getUnassignedOrders = async () => {
    try {
      const response = await axios.get('/orders/getOrders');
      return {
        success: true,
        data: processOrdersResponse(response)
      };
    } catch (err) {
      return {
        success: false,
        ...handleApiError(err, {
          403: 'No tienes permisos para ver estos pedidos.',
          default: 'Error al cargar los pedidos sin asignar'
        })
      };
    }
  };

  // Obtener órdenes asignadas
  const getAssignedOrders = async () => {
    try {
      const response = await axios.get('/orders/getAssignedOrders');
      return {
        success: true,
        data: processOrdersResponse(response)
      };
    } catch (err) {
      return {
        success: false,
        ...handleApiError(err, {
          403: 'No tienes permisos para ver estos pedidos.',
          default: 'Error al cargar los pedidos asignados'
        })
      };
    }
  };

  // Obtener historial de órdenes
  const getOrdersRecord = async () => {
    try {
      const response = await axios.get('/orders/getOrdersRecord');
      return {
        success: true,
        data: processOrdersResponse(response)
      };
    } catch (err) {
      return {
        success: false,
        ...handleApiError(err, {
          403: 'No tienes permisos para ver el historial de pedidos.',
          default: 'Error al cargar el historial de pedidos'
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
      // Si es 404, no mostrar error ni loguear
      if (err.response && err.response.status === 404) {
        return {
          success: false,
          isConnected: false
        };
      }
      // Otros errores sí pueden loguearse si se desea
      // console.error('Error en checkConnection:', err);
      return {
        success: false,
        isConnected: false
      };
    }
  };

  // Cancelar un pedido
  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.post('/orders/cancelOrder', { orderId });
      return {
        success: response.data.success,
        message: response.data.message,
        ...response.data
      };
    } catch (err) {
      return {
        success: false,
        ...handleApiError(err, {
          default: 'Error al cancelar el pedido.'
        })
      };
    }
  };

  return {
    getUnassignedOrders,
    getAssignedOrders,
    getOrdersRecord,
    checkConnection,
    cancelOrder,
    handleApiError
  };
}; 