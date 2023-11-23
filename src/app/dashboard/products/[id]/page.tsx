/* eslint-disable @next/next/no-img-element */
"use client"
import { useQuery } from '@tanstack/react-query';
import './styles.css'
import { QUERY_KEYS } from '@/constants/keys';
import { ApiService } from '@/services';
import { Loading } from '@/components/loading';
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useProduct } from '@/contexts/product';
import { ChangeEvent, useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { currencyMask } from '@/utils/mask';
import { Select } from '@/components/select';

export default function ProductView({ params }: { params: { id: string}}) {
  const query = useSearchParams()
  const variant = query.get('variant')
  const navigation = useRouter()
  const { addProduct } = useProduct()
  const [isLoadingCart, setIsLoadingCart] = useState(false)
  const [emblaRef] = useEmblaCarousel({}, [Autoplay()])
  
  const { data: product, isLoading } = useQuery<ProductResponseApi>(
    QUERY_KEYS.PRODUCTS.GET(params.id),
    async () => ApiService.Product.get({ id: params.id})
  );

  const { data: variants = [], isLoading: isLoadingVariants } = useQuery<VariantResponseApi[]>(
    QUERY_KEYS.PRODUCTS_VARIANTS.GET(params.id),
    async () => ApiService.ProductVariants.get({ id: params.id})
  );

  const handleClickAddToCart = useCallback(() => {
    if(!product) {
      return 
    }
    const findVariant = variants?.find(variant => variant.id === Number(variant))
    addProduct({...product, variant_id: findVariant?.id ? Number(findVariant?.id) : undefined, variant_name: findVariant?.name })
  }, [addProduct, product, variants])

  const handleClickAddToCartAndNavigateToCart = useCallback(() => {
    setIsLoadingCart(true)
    if(!product) {
      return 
    }
    const findVariant = variants?.find(variantData => variantData.id === Number(variant))
    addProduct({...product, variant_id: findVariant?.id ? Number(findVariant?.id) : undefined, variant_name: findVariant?.name })
    navigation.push(ROUTES.CART.ROOT)
  }, [addProduct, navigation, product, variant, variants])

  if (isLoading || !product || isLoadingCart || isLoadingVariants) {
    return <Loading />
  }
  return (
    <div className='bg-white rounded-2xl shadow-2xl container-details-product'>
      <h1 className='title'>{product.nome}</h1>

      <div className='container-images'>
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {(product?.fotos || []).map((photo, index) => (
              <div key={index} className="embla__slide">
                <img className='container-image' src={photo} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='container-price'>
        <h1>R$ {currencyMask(product.preco)}</h1>
        <span>Estoque: {product.estoque}</span>
      </div>

      <div className='container-buttons'>
        <div style={{ width: '100%' }}>
          <Select
            placeholder='Variação'
            options={variants?.map((variant) => ({ label: `${variant.name} ${variant.stock === 0 ? '(Esgotado)': ''}`, value: variant.id, disabled: !variant.stock }))}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              navigation.replace(`?variant=${event.target.value}`)
            }}
            value={variant || ''}
          />
        </div>

          <button onClick={handleClickAddToCartAndNavigateToCart} className='w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Comprar</button>
          <button onClick={handleClickAddToCart}  className='w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Adicionar ao carrinho</button>
      </div>

      <div className='container-description'>
        <p>{product.descricao}</p>
      </div>
    </div>
  )
}