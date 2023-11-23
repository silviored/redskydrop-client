/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import usePagseguro from '@/hooks/usePagseguro/usePagseguro';
import { ApiService } from '@/services';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import './styles.css';
import { useGlobalState } from '@/contexts/global-state';
import { currencyMask } from '@/utils/mask';
import { Footer } from '@/components/without-login/footer';
import { Loading } from '@/components/loading';
import { useProduct } from '@/contexts/product';
import { CacheService } from '@/services/cache';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { ROUTES } from '@/constants/routes';
import { PAYMENT_EXPIRED_MINUTES } from '@/constants/keys';

type Info = {
  label: string;
  content: string | number;
  className?: string;
};


function Info({ content, label, className }: Info) {
  return (
    <div className={className}>
      <label>{label}</label>
      <p>{content}</p>
    </div>
  );
}

export default function CartPayment({ params }: { params: { id: string}}) {
  const navigation = useRouter();
  const { user } = useGlobalState();
  const { products, getTotal } = useProduct();
  const { setSenderHash, setType, isLoadingSession } =
    usePagseguro();
  const [pixResponse, setPixResponse] = useState<PagseguroCreatePixResponse>();

  const pixInterval = useRef<NodeJS.Timeout | null>();

  const [loadingPayment, setLoadingPayment] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (pixInterval.current) {
        clearInterval(pixInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    setType({
      type: 'default',
    });
    setTimeout(() => {
      setSenderHash();
    }, 1000);
  }, [setSenderHash, setType]);

  const generatePix = useCallback(async () => {
    if (!user) return;
    setLoadingPayment(true);
    await ApiService.Pagseguro.createPix({
      cell_phone: user.telefone,
      cpf: user.cpf,
      email: user.email,
      id_venda: Number(params.id),
      item: {
        nome: 'Nova compra de produto',
        quantity: '1',
        unit_amount: `${getTotal(products)}`
      },
      nome: 'Nova compra de produto'
    })
      .then((pixResponse) => {
        setLoadingPayment(false);
        setPixResponse(pixResponse);
        const id = toast.loading('Aguardando a confirmação do pagamento', {
          toastId: 'awaiting-payment',
          closeOnClick: true
        });
        const intervalId = setInterval(() => {
          if (pixResponse) {
            ApiService.Sale.get({
              id: params.id,
            }).then((saleResponse) => {
              if (saleResponse.ispago) {
                toast.dismiss(id);
                toast.success('Pagamento confirmado. Compra confirmada!');
                navigation.push('/dashboard');
                CacheService.product.clear()
                clearInterval(intervalId);
              }
            });
          }
        }, 10000);
        pixInterval.current = intervalId;
      })
      .catch((error) => {
        setLoadingPayment(false);
        toast.error(error.message);
      });
  }, [getTotal, navigation, params.id, products, user]);

  useEffect(() => {
    console.log(params)
  },[params])

  useEffect(() => {
    generatePix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  
  useEffect(() => {
    window.addEventListener('keydown', (event) => {
      if(event.code === 'F5') {
        event.preventDefault()
      }
    })
    return () => {
      window.removeEventListener('keydown', (event) => {
        if(event.code === 'F5') {
          event.preventDefault()
        }
      })
    }
  }, [])

  
  useEffect(() => {
    const timer = setInterval(() => {
      navigation.push(`${ROUTES.DASHBOARD}?error=expired_payment`)
    }, PAYMENT_EXPIRED_MINUTES * 60000)

    return () => {
      if(timer) {
        clearInterval(timer)
      }
    }
  }, [navigation]);

  if (isLoadingSession || loadingPayment) {
    return <Loading />;
  }

  return (
    <>
      <div className='container-payment'>
        <div style={{ marginBottom: '2rem' }}>
          <div className='flex flex-wrap '>
            <div className='mx-auto mt-0 w-full max-w-full shrink-0 px-3'>
              <div className='relative z-0 flex min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border p-4 shadow-xl'>
              {/* <div className='flex justify-start mb-4 p-4'>
                  <span style={{ cursor: 'pointer' }} onClick={() => {
                    navigation.back()
                  }}>Voltar</span>
                </div> */}
                <div className='container-info'>
                  <Info
                    label='Cliente'
                    content={user?.nome || ''}
                    className='info-client-name'
                  />
                  <Info label='Total de Produtos' content={products.length || '0'} />
                  <Info
                    label='Valor Total'
                    content={'R$ ' + currencyMask(getTotal(products) || '0')}
                  />
                </div>
                <div className='sales-container-list mb-4'>
                <Table>
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Variação</Th>
            <Th>Preço UN</Th>
            <Th>Preço total</Th>
          </Tr>
        </Thead>
            <Tbody>
              {products.length ? products?.map(product => (
              <Tr key={product.id}>
                <Td>{product.nome}</Td>
                <Td>{product.variant_name}</Td>
                <Td>{currencyMask(product.preco)}</Td>
                <Td>{currencyMask(product.preco * (product.quantidade || 1))}</Td>
              </Tr>
            )): (
              <Tr >
                  <Td colSpan={8} style={{ textAlign: 'center' }}>Nenhum resultado encontrado</Td>
                  </Tr>
            )}
          </Tbody>
          </Table>
                </div>
                <div>
                  {pixResponse && (
                    <>
                      <div className='container-qr-code'>
                        <h4>Acesse o aplicativo do seu banco e escaneio o QR CODE para concluir o pagamento em até <strong>10 minutos</strong></h4>
                        <img
                          src={pixResponse.qr_codes[0].links[0].href}
                          alt='qr_code'
                          className='qr-code-image'
                        />
                      </div>
                      <div className='container-copy-past'>
                        <h5>Por código copia e cola:</h5>
                        <p className='copy-past-text'>
                          {pixResponse?.qr_codes[0].text}
                        </p>
                        <div className='container-button-copy-past'>
                          <button
                            className='mb-2 inline-block cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'
                            onClick={() => {
                              const copyText = pixResponse?.qr_codes[0].text;
                              const el = document.createElement('textarea');
                              el.value = copyText;
                              el.setAttribute('readonly', '');
                              document.body.appendChild(el);
                              el.select();
                              navigator.clipboard.writeText(copyText);
                              document.body.removeChild(el);
                              toast.success('código copiado');
                            }}
                          >
                            Copiar código
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer className='text-white' />
      </div>
    </>
  );
}
