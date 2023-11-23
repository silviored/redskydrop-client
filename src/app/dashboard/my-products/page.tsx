"use client"
import { CardProduct } from '@/components/card-product'
import './styles.css'
import { ApiService } from '@/services'
import { Loading } from '@/components/loading'
import { useProduct } from '@/contexts/product';
import { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify'
import { useRouter, useSearchParams } from 'next/navigation'
import { ROUTES } from '@/constants/routes'
import { useGlobalState } from '@/contexts/global-state'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/keys'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { useForm } from 'react-hook-form'

type FilterProps = {
  nome?: string
  categoriaid?: string
  subcategoriaid?: string
}

const TAKE_PRODUCTS = 20

export default function Products() {
  const reactHookForm = useForm<FilterProps>()
  const navigation = useRouter()
  const query = useSearchParams()
  const name = query.get('name')
  const category_id = query.get('category_id')
  const sub_category_id = query.get('sub_category_id')
  const { addProduct } = useProduct()
  const { user } = useGlobalState()
  const [products, setProducts] = useState<ProductResponseApi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [productsDisabledButton, setProductDisabledButton] = useState<number[]>([])


  const { data: hasIntegrationWithBling, isLoading: isLoadingApiUser } = useQuery<ApiUserResponseApi>(
    QUERY_KEYS.API_USER.GET_BY_USER(user?.id || 0),
    async () => ApiService.ApiUser.getByUser({ user_id: (user?.id || 0).toString() })
  );

  const { data: categories, isLoading: isLoadingCategories } = useQuery<{ items: CategoryResponseApi[] }>(
    QUERY_KEYS.CATEGORIES.LIST,
    async () => ApiService.Category.getAll()
  );

  const categoryID = reactHookForm.watch('categoriaid')

  const { data: subCategories = [] } = useQuery<CategoryResponseApi[]>(
    QUERY_KEYS.CATEGORIES.GET(categoryID?.toString() as string),
    async () => {
      if (!categoryID) return []
      const responseCategories = await ApiService.Category.get({ id: categoryID.toString() })
      return responseCategories.childCategories
    },
    {
      enabled: !!categoryID
    }
  );

  const handleLoadProducts = useCallback(async (data?: { reset?: boolean }) => {
    try {
      const responseProducts = await ApiService.Product.getAll({
        skip: data?.reset ? 0 : TAKE_PRODUCTS * (page - 1),
        take: TAKE_PRODUCTS,
        nome: name,
        categoriaid: category_id,
        subcategoriaid: sub_category_id,
      })
      setHasMore(!!responseProducts?.items?.length)
      setProducts(oldData => (data?.reset ? [...responseProducts.items] : [...oldData, ...responseProducts.items]))
      if (!responseProducts?.items?.length) {
        toast.info('Você chegou ao final', {
          toastId: 'toast-id-end-data'
        })
        return
      }
      setPage(oldPage => data?.reset ? 1 : oldPage + 1)
    } catch (error: any) {
      toast.error(error.message)
    }
  }, [category_id, name, page, sub_category_id])

  const handleClickAddToBling = useCallback(async (product: ProductResponseApi) => {
    try {
      await toast.promise(
        ApiService.ProductBling.create({
          product_id: product.id
        }),
        {
          pending: 'Cadastrando produto ao bling',
          success: 'Produto cadastrado com sucesso',
          error: 'Houve um erro ao cadastrar o produto'
        }
      )
      setProductDisabledButton(oldState => [...oldState, product.id])
    } catch (error) {
      console.log(error)
    }
    return
  }, [])

  const handleClickAddToCart = useCallback((product: ProductResponseApi) => {
    addProduct(product)
  }, [addProduct])

  useEffect(() => {
    async function loadData() {
      await handleLoadProducts()
      setIsLoading(false)
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    console.log(category_id, name, sub_category_id)
    // handleLoadProducts({ reset: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category_id, name, sub_category_id])

  useEffect(() => {
    reactHookForm.reset({
      categoriaid: category_id || undefined, nome: name || undefined, subcategoriaid: sub_category_id || undefined
    })
  }, [category_id, name, reactHookForm, sub_category_id])


  if (isLoading || isLoadingApiUser || isLoadingCategories) {
    return <Loading />
  }

  return (
    <div className='bg-white rounded-2xl shadow-2xl container-products'>
      <h3 className='px-3 pt-2 page-title'>Catálogo de produtos</h3>
      <form onSubmit={reactHookForm.handleSubmit((data) => {
        console.log('Filtro', data)
        let url = ''
        if (data.nome) {
          url += `&name=${data.nome}`
        }
        if (data.categoriaid) {
          url += `&category_id=${data.categoriaid}`
        }
        if (data.subcategoriaid) {
          url += `&sub_category_id=${data.subcategoriaid}`
        }
        navigation.replace(`${ROUTES.PRODUCTS_CATALOG.LIST}?${url}`.replace('&', ''))
      })}>
        <div className='product-container-filter'>
          <Input
            placeholder='Nome'
            {...reactHookForm.register('nome')}
          />
          <Select
            placeholder='Categoria'
            {...reactHookForm.register('categoriaid')}
            options={categories?.items?.map(category => ({ label: category.nome, value: category.id })) || []}
          />
          <Select
            placeholder='Sub categoria'

            {...reactHookForm.register('subcategoriaid')}
            options={subCategories?.map(subCategory => ({ label: subCategory.nome, value: subCategory.id }))}
          />

        </div>
        <div className='product-container-button-filter'>
          <button type='reset' onClick={() => {
            navigation.replace(ROUTES.PRODUCTS_CATALOG.LIST)
          }} className='product-btn-filter w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
            Limpar
          </button>
          <button className='product-btn-filter w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
            Filtrar
          </button>
        </div>
      </form>
      {/*      <InfiniteScroll
        dataLength={products.length}
        next={handleLoadProducts}
        hasMore={hasMore}
        loader={<Loading />}
        className='container-card-products '
      > */}
      <div className="container-cart-wrapper flex">
        <div className='container-card-products'>
          {products?.map(product => (
            <CardProduct
              key={product.id}
              id={product.id}
              cover_image_url={product.fotos?.[0]}
              price={product.preco}
              title={product.nome}
              onCLickAddToBling={(event) => {
                event.stopPropagation();
                handleClickAddToBling(product)
              }}
              stock={product.estoque}
              showBlingBtn={true}
              showStock={true}
              disabledContainer={!Number(user?.ativado)}
              disabledButton={!!Number(user?.ativado) ? !hasIntegrationWithBling || !!product.produtosBling_id || productsDisabledButton.includes(product.id) : true}
              onCLickBuyNow={() => {
                handleClickAddToCart(product)
                navigation.push(ROUTES.CART.ROOT)
              }}
              onClick={() => {
                navigation.push(ROUTES.PRODUCTS_CATALOG.VIEW(product.id))
              }}
            />
          ))}
        </div>

        {/*       </InfiniteScroll> */}
      </div >
    </div >
  )
}