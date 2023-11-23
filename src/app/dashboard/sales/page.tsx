"use client"
import InfiniteScroll from 'react-infinite-scroll-component'
import './styles.css'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Loading } from '@/components/loading'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { ApiService } from '@/services'
import { currencyMask } from '@/utils/mask'
import { useProduct } from '@/contexts/product'
import { useRouter, useSearchParams } from 'next/navigation'
import { ROUTES } from '@/constants/routes'
import moment, { ISO_8601 } from 'moment'
import { MASKS } from '@/constants/mask'
import { ORDER_SITUATIONS } from '@/constants/types'


const TAKE_SALES = 20

export default function Sales() {
  const query = useSearchParams()
  const status = query.get('status')
  const { addProductMany } = useProduct()
  const navigation = useRouter()
  const [sales, setSales] = useState<SaleResponseApi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const handleLoadSales = useCallback(async () => {
    try {
      const responseSales = await ApiService.Sale.getAll({
        skip: TAKE_SALES * (page - 1),
        take: TAKE_SALES,
        status
      })
      setHasMore(!!responseSales.items.length)
      if (!responseSales?.items.length) {
        toast.info('Você chegou ao final', {
          toastId: 'toast-id-end-data'
        })
        return
      }
      setPage(oldPage => oldPage + 1)
      setSales(oldSales => ([...oldSales, ...responseSales.items]))
    } catch (error: any) {
      toast.error(error?.message || 'Ocorreu um erro ao carregar os produtos')
    }
  }, [page, status])


  useEffect(() => {
    async function loadData() {
      await handleLoadSales()
      setIsLoading(false)
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const handlePayment = useCallback(({ sale }: { sale: SaleResponseApi }) => {
    if (!sale) return
    // Add produtos to cart
    const productsToCart: ProductResponseApi[] = sale.vendaProdutos.map(item => ({
      ...item.produto,
      nome: item.produto.nome,
      fotos: item.produto.fotos,
      preco: item.preco_unit * item.qtd,
      quantidade: item.qtd,
    }))
    addProductMany(productsToCart)

    // Send to cart page with saved id
    navigation.push(ROUTES.CART.ROOT + `?sale_id=${sale.id}`)
  }, [addProductMany, navigation])

  const handleReSale = useCallback(({ sale }: { sale: SaleResponseApi }) => {
    if (!sale) return
    // Add produtos to cart
    const productsToCart: ProductResponseApi[] = sale.vendaProdutos.map(item => ({
      ...item.produto,
      nome: item.produto.nome,
      fotos: item.produto.fotos,
      preco: item.preco_unit * item.qtd,
      quantidade: item.qtd,
      variant_id: item?.id_varicao,
      variant_name: item?.variacao?.name,
    }))
    addProductMany(productsToCart)

    // Send to cart page without id
    navigation.push(ROUTES.CART.ROOT)
  }, [addProductMany, navigation])

  if (isLoading) {
    return <Loading />
  }
  return (
    <div className='bg-white rounded-2xl shadow-2xl sales-container'>
      <div className='sales-wrapper-filter'>
        <h3 className='px-3 pt-2 page-title'>Pedidos</h3>
        {status && (
          <div className='btn-clean-filter '>
            <button onClick={() => {
              setHasMore(false)
              setPage(1)
              navigation.replace(`${ROUTES.SALE.ROOT}`)
            }} className='w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
              Limpar filtro
            </button>
          </div>
        )}
      </div>


      <InfiniteScroll
        dataLength={sales.length}
        next={handleLoadSales}
        hasMore={hasMore}
        loader={<Loading />}
        className='sales-container-list'
      >
        <></>
        <Table>
          <Thead>
            <Tr>
              <Th>Cod.</Th>
              <Th>Preço total</Th>
              <Th>Qtd. Produtos</Th>
              <Th>Status</Th>
              <Th>Reservado</Th>
              <Th>Pago</Th>
              <Th>Pago em</Th>
              <Th>Criado em</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sales.length ? sales?.map(sale => (
              <Tr key={sale.id}>
                <Td>{sale.id}</Td>
                <Td>R$ {currencyMask(Number(sale.preco_total))}</Td>
                <Td>{sale.vendaProdutos?.length}</Td>
                <Td>{ORDER_SITUATIONS[sale.status] || sale.status}</Td>
                <Td>{sale.isreservado ? 'Sim' : 'Não'}</Td>
                <Td data-paid={sale.ispago}>{sale.ispago ? 'Sim' : 'Não'}</Td>
                <Td>{sale.pagamentos?.[sale.pagamentos?.length - 1]?.data_pagamento ? moment(sale.pagamentos?.[sale.pagamentos?.length - 1]?.data_pagamento).format(MASKS.DATE.LOCALE_WITHOUT_TIME) : 'Pagamento Pendente'}</Td>
                <Td>{sale.criado_em ? moment(sale.criado_em, ISO_8601).format(MASKS.DATE.LOCALE_WITHOUT_TIME) : ''}</Td>
                <Td data-last-item={true}>
                  <button onClick={() => handlePayment({ sale })} disabled={sale.ispago} className='btn-payment w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                    Editar
                  </button>
                  <button onClick={() => handlePayment({ sale })} disabled={sale.ispago} className='btn-payment w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                    Pagar
                  </button>
                </Td>
              </Tr>
            )) : (
              <Tr >
                <Td colSpan={8} style={{ textAlign: 'center' }}>Nenhum resultado encontrado</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </InfiniteScroll>

    </div>
  )
}