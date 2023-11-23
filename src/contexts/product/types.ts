export type Product = {
  removeProduct: (params: { product_id: number }) => void;
  updateProduct: (params: ProductResponseApi) => void;
  addProduct: (params: ProductResponseApi) => void;
  addProductMany: (params: ProductResponseApi[]) => void;
  getTotal: (newProducts: ProductResponseApi[]) => number;
  products: ProductResponseApi[];
};
