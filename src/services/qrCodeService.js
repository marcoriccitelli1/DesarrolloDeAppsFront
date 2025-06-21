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

  return {
    processQRCode
  };
};