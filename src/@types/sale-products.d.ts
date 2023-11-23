type SaleProductRequestApi = {
  preco_total: number
  tipo_pagamento_id: number
  products: ProductResponseApi[]
}


type SaleProductResponseApi = {
  id: number;
  preco_unit: number;
  qtd: number;
  id_varicao: number;
  produto: ProductResponseApi
  variacao?: VariantResponseApi
}