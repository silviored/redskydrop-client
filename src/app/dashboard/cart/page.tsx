"use client"
import { useProduct } from '@/contexts/product'
import './styles.css'
/* import { CardProduct } from './_components/card-product' */
import { ChangeEvent, useCallback, useState } from 'react'
import { Loading } from '@/components/loading'
import { ApiService } from '@/services'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { ROUTES } from '@/constants/routes'
import { currencyMask } from '@/utils/mask'
import { Input } from '@/components/input'
import { CardProduct } from '@/components/card-product2'

export default function Cart({ params }: { params: { id: string } }) {
  const navigation = useRouter()
  const { products, getTotal } = useProduct()
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null | undefined>(null)
  const searchParams = useSearchParams()
  const saleId = searchParams.get('sale_id')
  const isList = true;
  const handlePayment = useCallback(async () => {
    setIsLoading(true)
    if (saleId) {
      try {
        const responseSale = await ApiService.Sale.verifyStock({
          id: saleId
        })
        navigation.push(ROUTES.CART.PAYMENT(responseSale.id))
      } catch (error: any) {
        setIsLoading(false)
        toast.error(error.message)
      }
      return;
    }
    if (!file) {
      toast.error('Você precisa adicionar uma etiqueta para o pedido')
      setIsLoading(false)
      return
    }
    const formData = new FormData()
    formData.append('label_image', file)
    formData.append('preco_total', getTotal(products).toString())
    formData.append('products', JSON.stringify(products))
    formData.append('tipo_pagamento_id', '1')
    try {
      const responseSale = await ApiService.Sale.create(formData)
      navigation.push(ROUTES.CART.PAYMENT(responseSale.vendas.id))
    } catch (error: any) {
      toast.error(error.message || 'Ocorreu um erro ao processar sua compra')
      setIsLoading(false)
    }
  }, [file, getTotal, navigation, products, saleId])

  if (isLoading) {
    return <Loading />
  }
  return (
    <div className="container-cart bg-white rounded-2xl shadow-2xl">
      <h1 className="pt-4 page-title">Resumo</h1>
      <div className="container-cart-wrapper flex">
        <div className={isList ? 'container-list-products flex-1 rounded-2xl shadow-2xl' : 'container-card-products'}>
          {products.map(product => (
            <CardProduct
              key={product.id}
              id={product.id}
              cover_image_url={product.fotos?.[0]}
              price={product.preco}
              title={product.nome}
              viewType="list"
            />
          ))}
        </div>
        <div className='container-resume'>
          <div className='product-container-wrapper-resume'>
            <div className='product-container-info-page break-words rounded-2xl border-0 border-solid border-transparent bg-white bg-clip-border shadow-2xl'>
              <div className='wrapper-info'>
                <div className="order-resume">
                  <table>
                    <thead>
                      <tr>
                        <th colSpan={2}>Resumo do Pedido</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td width={"66%"}>{products.length} produtos</td>
                        <td>R$ {currencyMask(getTotal(products))}</td>
                      </tr>
                      <tr>
                        <td>Frete</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td>{currencyMask(getTotal(products))}  </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <hr className='mt-3 h-px bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent' />
                          <Input placeholder='Etiqueta' type='file' accept=".pdf,.zip" onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setFile(event.target.files?.[0])
                          }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className='container-button-cart'>
                <button onClick={handlePayment} className='w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                  Comprar agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}