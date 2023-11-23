import { AxiosError } from 'axios';
import { ENDPOINTS } from '@/constants/endpoints';
import apiInstance from '@/services/api/instance';

import { handleErrorMessage } from '../errors';

export const create = async (data: ApiUserRequestApi) => {
  try {
    const responseCreate = await apiInstance.post(ENDPOINTS.API_USERS.CREATE, data);

    return responseCreate.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const update = async (data: Partial<UserRequestApi> & { id: string | number }) => {
  try {
    const responseUpdate = await apiInstance.put(ENDPOINTS.USERS.UPDATE(data.id), data);

    return responseUpdate.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const getAll = async () => {
  try {
    const responseGetAll = await apiInstance.get(ENDPOINTS.API_USERS.GET_ALL);

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
export const get = async ({ id }: { id: string | number }) => {
  try {
    const responseGetAll = await apiInstance.get(ENDPOINTS.USERS.GET(id));

    return responseGetAll.data.data;
  } catch (loginError) {
    const axiosError = loginError as AxiosError;
    return Promise.reject(handleErrorMessage({ axiosError }));
  }
};
