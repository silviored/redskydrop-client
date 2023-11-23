import { AxiosError } from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';
import melhorEnvioInstance from '@/services/api/melhor-envio/instance';


export const token = async (): Promise<string> => {
  try {
    const responseAuthToken = await melhorEnvioInstance.get<string>(ENDPOINTS.TOKEN, {
      headers: {
        'public-key': `${process.env.NEXT_PUBLIC_PUBLIC_KEY}`,
      },
    });

    return responseAuthToken.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(axiosError);
  }
};