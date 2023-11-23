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
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS, USER_DISMISS_NOTICE } from '@/constants/keys'
import { Modal } from '@/components/modal'


const TAKE_SALES = 10

type CardProps = {
  title: string
  value: string
  backgroundColor: string
  color?: string
  iconClassName: string
  onClick: () => void
}

function Card({ backgroundColor, color, title, value, iconClassName, onClick }: CardProps) {
  return (
    <div className='bg-white rounded-2xl shadow-2xl dashboard-card-container' onClick={onClick}>
      <div className='dashboard-card-container-info'>
        <h6>{title}</h6>
        <p>{value}</p>
      </div>
      <div className='dashboard-card-container-icon' style={{ backgroundColor }}>
        <i className={iconClassName} style={{ color }} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { addProductMany } = useProduct()
  const query = useSearchParams()
  const error = query.get('error')
  const navigation = useRouter()
  const [sales, setSales] = useState<SaleResponseApi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [openModalNotice, setOpenModalNotice] = useState(true)

/*   const { data, isLoading: isLoadingReport } = useQuery(
    QUERY_KEYS.REPORT.DASHBOARD,
    async () =>  ApiService.Sale.reportDashboard() 
  ); */

  const handleLoadSales = useCallback(async () => {
    try {
      const responseSales = await ApiService.Sale.getAll({
        skip: 0,
        take: TAKE_SALES
      })
      setSales(responseSales.items)
    } catch (error: any) {
      toast.error(error.message)
    }
  }, [])

  useEffect(() => {
    async function loadData() {
      await handleLoadSales()
      setIsLoading(false)
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  
  const handleEditOrder = useCallback(({ sale }: { sale: SaleResponseApi }) => {
    if (!sale) return
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
    }))
    addProductMany(productsToCart)

    // Send to cart page without id
    navigation.push(ROUTES.CART.ROOT)
  }, [addProductMany, navigation])


  useEffect(() => {
    if (error && error === 'not_subscription') {
      toast.error('Sua assinatura ainda esta pendente ou expirou, por isso seu acesso é limitado')
    }
    if (error && error === 'expired_payment') {
      toast.error('Seu pagamento expirou refaça o processo, para gerar um novo pagamento')
    }
  }, [error])

  const handleAcceptConditions = useCallback(() => {
    localStorage.setItem(USER_DISMISS_NOTICE, 'true')
    setOpenModalNotice(false)
  }, [])

  useEffect(() => {
    const storageAcceptCondition = localStorage.getItem(USER_DISMISS_NOTICE)
    setOpenModalNotice(storageAcceptCondition === 'true' ? false : true)
  }, [])


/*   if (isLoading || isLoadingReport) {
    return <Loading />
  }
 */
  return (
    <>
      <div className='dashboard-wrapper'>
        <div className='dashboard-card-wrapper'>
      {/*     <Card
            backgroundColor='#fbb140'
            iconClassName='fas fa-dollar-sign'
            title='Total pendente'
            value={`R$ ${currencyMask(Number(data?.pending) || 0)}`}
            onClick={() => {
              navigation.push(`${ROUTES.SALE.ROOT}?status=awaiting_payment`)
            }}
          />
          <Card
            backgroundColor='rgb(45 206 137)'
            iconClassName='fas fa-dollar-sign'
            title='Total pago'
            value={`R$ ${currencyMask(Number(data?.paid) || 0)}`}
            onClick={() => {
              navigation.push(`${ROUTES.SALE.ROOT}?status=paid`)
            }}
          />
          <Card
            backgroundColor='red'
            iconClassName='fas fa-dollar-sign'
            title='Total cancelado'
            value={`R$ ${currencyMask(Number(data?.cancelled) || 0)}`}
            onClick={() => {
              navigation.push(`${ROUTES.SALE.ROOT}?status=cancelled`)
            }}
          /> */}
        </div>
        <div className='bg-white rounded-2xl shadow-2xl sales-container'>
          <div className='dashboard-container-orders-header'>
            <h3 className='page-title'>Pedidos recentes</h3>
            <button onClick={() => {
              navigation.push(ROUTES.SALE.ROOT)
            }} className='btn-view-all w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
              Ver Todos
            </button>
          </div>


          <Table>
            <Thead>
              <Tr>
                <Th>Cod.</Th>
                <Th>Preço total</Th>
                <Th>Qtd. Produtos</Th>
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
                  <Td>{sale.isreservado ? 'Sim' : 'Não'}</Td>
                  <Td data-paid={sale.ispago}>{sale.ispago ? 'Sim' : 'Não'}</Td>
                  <Td>{sale.pagamentos?.[sale.pagamentos?.length - 1]?.data_pagamento ? moment(sale.pagamentos?.[sale.pagamentos?.length - 1]?.data_pagamento).format(MASKS.DATE.LOCALE_WITHOUT_TIME) : 'Pagamento Pendente'}</Td>
                  <Td>{sale.criado_em ? moment(sale.criado_em, ISO_8601).format(MASKS.DATE.LOCALE_WITHOUT_TIME) : ''}</Td>
                  <Td data-last-item={true}>
                    <button onClick={() => handlePayment({ sale })} disabled={sale.ispago} className='btn-payment w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                      Pagar
                    </button>
                    <button onClick={() => handleEditOrder({ sale })} className='btn-re-sale w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                      Editar
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

        </div>
      </div>
      <Modal
        onClose={() => setOpenModalNotice(false)}
        visible={openModalNotice}
      >
        <div style={{ maxWidth: '500px' }}>
          <p>Pedidos feitos antes das 8H e depois das 14H, só serão processados no proximo dia util. você aceita essas condições?</p>
          <div>
            <button onClick={handleAcceptConditions} className='w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Aceito</button>
          </div>
        </div>
      </Modal>
    </>
  )
}
