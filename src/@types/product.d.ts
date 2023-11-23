type ProductResponseApi = {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  periodo: number;
  fotos: string[];
  preco: number;
  estoque: number;
  quantidade?: number;
  variant_id?: number
  produtosBling_id?: number
  variant_name?: string
  largura: number;
  altura: number;
  comprimento: number;
  peso: string;
  peso_bruto: string;
  label_image?: File | null
};
type ProductRequestApi = {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  periodo: number;
  preco: number;
};
