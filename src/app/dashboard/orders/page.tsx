"use client"
import { useProduct } from '@/contexts/product'
import './styles.css'
import { CardProduct } from './_components/card-product'
import { ChangeEvent, useCallback, useState } from 'react'
import { Loading } from '@/components/loading'
import { ApiService } from '@/services'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { ROUTES } from '@/constants/routes'
import { currencyMask } from '@/utils/mask'
import { Input } from '@/components/input'

export default function Orders({ params }: { params: { id: string } }) {
  const navigation = useRouter()
  const { products, getTotal } = useProduct()
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null | undefined>(null)
  const searchParams = useSearchParams()
  const saleId = searchParams.get('sale_id')
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
    <>
    </>
  )
}