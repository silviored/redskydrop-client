import { AxiosError } from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';

import { handleErrorMessage } from '../errors';
import apiInstance from '@/services/api/instance';

export const create = async (data: ProductBlingRequest): Promise<boolean> => {
  try {
    const responseGetAll = await apiInstance.post(ENDPOINTS.PRODUCT_BLING.CREATE, data);
    return responseGetAll.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};

