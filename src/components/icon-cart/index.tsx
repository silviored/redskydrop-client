"use client"
import { useProduct } from '@/contexts/product'
import { useRouter } from 'next/navigation'
import './styles.css'
export function IconCart() {
  const navigation = useRouter()
  const { products } = useProduct()
  return (
    <div className='container-icon-cart' onClick={() => {
      navigation.push('/dashboard/cart')
    }}>
      {!!products.length && (
         <div className="container-badge-icon-cart">
            <span className="text-badge-icon-cart">{products.length}</span>
          </div>
      )}
     
      <li className='relative flex items-center pr-2'>
        <p className='hidden transform-dropdown-show'></p>
        <a
          href='javascript:;'
          className='ease-nav-brand block p-0 text-white transition-all'
          dropdown-trigger="true"
          aria-expanded='false'
        >
          <i className="ni ni-bag-17 text-lg"></i>
        </a>

      </li> 
    </div>
  )
}