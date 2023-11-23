import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import type { PropsWithChildren } from 'react';

import { USER_PRODUCTS_STORAGE_KEY } from '@/constants/keys';

import * as Types from './types';
import { CacheService } from '@/services/cache';

const ProductContext = createContext<Types.Product>({} as Types.Product);

export const ProductProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const [products, setProducts] = useState<ProductResponseApi[]>([]);

  const getTotal = useCallback((newProducts: ProductResponseApi[]) => {
    const total = newProducts.reduce((currentProduct, nextProduct) => {
      const nextProductTotal = nextProduct.preco * (nextProduct.quantidade || 0)
      return currentProduct + nextProductTotal
    }, 0)
    return total
  }, []);

  const addProduct = useCallback(async (product: ProductResponseApi) => {
    const newProducts = [...products.filter(item => item.id !== product.id), {...product, quantidade: 1}]
    setProducts(newProducts)
    CacheService.product.save(newProducts)
  }, [products]);

  const addProductMany = useCallback(async (newProducts: ProductResponseApi[]) => {
    const newProductsId = newProducts.map(item => item.id)
    const filteredOldProducts = products.filter(item => !newProductsId.includes(item.id))
    const newProductsData = [...filteredOldProducts, ...newProducts.map(item => ({ ...item, quantidade: 1 }))]
    setProducts(newProductsData)
    CacheService.product.save(newProductsData)
  }, [products]);

  const updateProduct = useCallback(async (product: ProductResponseApi) => {
    const newProducts = products.map(oldProduct => oldProduct.id === product.id ? { ...oldProduct, ...product } : { ...oldProduct })
    setProducts(newProducts)
    getTotal(newProducts)
    CacheService.product.save(newProducts)
  }, [getTotal, products]);

  const removeProduct = useCallback(async ({ product_id }:{product_id: number}) => {
    const newProducts = products.filter(oldProduct => oldProduct.id !== product_id)
    setProducts(newProducts)
    CacheService.product.save(newProducts)
  }, [products]);


  useEffect(() => {
    const storageProducts = localStorage.getItem(USER_PRODUCTS_STORAGE_KEY)
    if(storageProducts) {
      setProducts(JSON.parse(storageProducts))
    }
  }, [])

  return (
    <ProductContext.Provider
      value={{
        getTotal,
        addProduct,
        addProductMany,
        products,
        removeProduct,
        updateProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      'useProduct should be encapsuled inside ProductContextProvider'
    );
  }

  return useContext(ProductContext);
};
