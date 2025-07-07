import { useAxios } from '../hooks/useAxios';

export const useQRCodeService = () => {
  const axiosInstance = useAxios();
  
  const processQRCode = async (qrData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        timestamp: new Date().toISOString(),
        processedData: qrData,
        message: 'QR code processed successfully'
      };
    } catch (error) {
      console.error('Error processing QR code:', error);
      throw error;
    }
  };

  // Nueva función para tomar pedido por QR
  const takeOrderByQr = async (orderId) => {
    try {
      const response = await axiosInstance.post(`/orders/takeOrder/${orderId}`);
      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = 'Error al procesar el pedido';
      if (error.response) {
        errorMessage = error.response.data?.message || 'Error al procesar el pedido';
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      } else {
        errorMessage = error.message || 'Error desconocido';
      }
      return { success: false, error: errorMessage };
    }
  };

  return {
    processQRCode,
    takeOrderByQr
  };
};