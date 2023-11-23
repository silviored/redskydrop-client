import { currencyMask } from '@/utils/mask';
import { useProduct } from '@/contexts/product';
import { Input } from '@/components/input';
import { ChangeEvent } from 'react';
import './styles.css';

enum ViewType {
  list = "list",
  card = "card",
  minimal = "minimal",
}

type CardProductsProps = {
  cover_image_url: string;
  title: string;
  id: number;
  price: number;
  stock?: number;
  disabledButton?: boolean;
  disabledContainer?: boolean;
  viewType?: string;
  key?: number
  showBlingBtn?: boolean
  showQty?: boolean
  showQtySelector?: boolean
  showStock?: boolean
  showAddToCart?: boolean
  onCLickAddToBling?: (data: any) => void;
  onCLickAddToCart?: (data: any) => void;
  onCLickBuyNow?: (data: any) => void;
  onClick?: (data: any) => void;
};

export function CardProduct({
  cover_image_url,
  onClick,
  disabledButton,
  onCLickAddToBling,
  onCLickAddToCart,
  price,
  stock,
  disabledContainer,
  title,
  id,
  viewType,
  key,
  showBlingBtn,
  showQty,
  showQtySelector,
  showAddToCart,
  showStock,
}: CardProductsProps) {
  const { products, updateProduct, removeProduct } = useProduct()
  return (
    <div>
      {(viewType == "card" || viewType == "" || viewType == undefined) ? (
        <div className='container-card-product border-solid border-transparent bg-white bg-clip-border shadow-2xl break-words rounded-2xl border-0 ' onClick={onClick} >
          {
            showAddToCart ? (<div className="btn-addToCart">
              <i className='ni ni-cart'></i>
            </div>) : ""
          }

          <div className='wrapper-content-product relative flex h-full min-w-0 flex-col  py-4'>
            <div className='container-cover-image '>
              <img src={cover_image_url || "/assets/img/logos/image.png"} alt={title} className='product-img' />
            </div>
            <div className='container-info px-4 py-3'>
              <div>
                <p className='container-info-title'>{title}</p>
              </div>
              <div className='container-info-extra'>
                <div>
                  <span className='price'>{'R$ ' + currencyMask(price)}</span>
                </div>
                {
                  showStock ? (
                    <div>
                      <span className='stock'>Estoque: {stock}</span>
                    </div>
                  ) : ""
                }

              </div>
            </div>
            {
              showBlingBtn ? (
                <div className='container-buttons-card-product'>
                  <button onClick={onCLickAddToBling} disabled={disabledButton} className='btn-add-cart w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                    Enviar ao Bling
                  </button>
                </div>
              ) : ""
            }
          </div>
        </div >
      ) : ""}
      {viewType == "list" ? (
        <div className="container-wrapper product-list flex">
          <div className="img">
            <img src={cover_image_url || "/assets/img/logos/image.png"} width={100} alt={title} />
          </div>
          <div className="info grow pl-4">
            <div className='info-title'>
              <span className='cart-component-container-info-title'>{title}</span>
            </div>
            <div className="flex">
              <div className='flex flex-1'>
                <div className='py-2 pr-4'>
                  <button onClick={() => removeProduct({
                    product_id: id
                  })} className='cart-component-btn-removed w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Remover</button>
                </div>
                <div>
                  <Input
                    value={products.find(item => item.id)?.quantidade}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const product = products.find(item => item.id === id)
                      if (product) {
                        updateProduct({ ...product, quantidade: Number(event.target.value) })
                      }
                    }}
                    type="number"
                  />
                </div>
              </div>
              <div>
                <h6 className=''>{'R$ ' + currencyMask(price)}</h6>
              </div>
            </div>
          </div>
        </div>
      ) : ""}
    </div>
  )
}
