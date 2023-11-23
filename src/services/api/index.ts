import apiInstance from '@/services/api/instance';
import * as Login from './login';
import * as Subscription from './subscription';
import * as Pagseguro from './pagseguro';
import * as Plan from './plan';
import * as Sale from './sale';
import * as ApiUser from './api-user';
import * as User from './user';
import * as Product from './product';
import * as ProductVariants from './product-variant';
import * as Bling from './bling';
import * as Category from './category';
import * as ProductBling from './product-bling';
import * as Tutorial from './tutorial';
import { USER_SESSION_STORAGE_KEY } from '@/constants/keys';

const persistToken = (token: string) => {
  apiInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
};

const storageUser =
  (typeof window !== 'undefined' &&
    localStorage.getItem(USER_SESSION_STORAGE_KEY)) ||
  undefined;

const cachedUser: LoginApiResponse = !!storageUser
  ? JSON.parse(storageUser)
  : {};
if (cachedUser && cachedUser.token) {
  persistToken(cachedUser.token);
}

export const ApiService = {
  persistToken,
  Login,
  Subscription,
  ProductBling,
  Plan,
  Sale,
  Tutorial,
  Category,
  ApiUser,
  User,
  Product,
  ProductVariants,
  Pagseguro,
  Bling,
};
