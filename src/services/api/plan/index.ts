import { AxiosError } from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';
import apiInstance from '@/services/api/instance';

import { handleErrorMessage } from '../errors';

export const getAll = async () => {
  try {
    const responseGetAll = await apiInstance.get(ENDPOINTS.PLANS.GET_ALL);

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const get = async ({ id }: { id: string }) => {
  try {
    const responseGetAll = await apiInstance.get(ENDPOINTS.PLANS.GET(id));

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
