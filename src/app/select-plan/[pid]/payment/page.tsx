/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import usePagseguro from '@/hooks/usePagseguro/usePagseguro';
import { ApiService } from '@/services';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import './styles.css';
import { useGlobalState } from '@/contexts/global-state';
import { PAYMENT_EXPIRED_MINUTES, QUERY_KEYS } from '@/constants/keys';
import { useQuery } from '@tanstack/react-query';
import { currencyMask } from '@/utils/mask';
import { Footer } from '@/components/without-login/footer';
import { Loading } from '@/components/loading';
import { CacheService } from '@/services/cache';
import { ROUTES } from '@/constants/routes';

type Info = {
  label: string;
  content: string;
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

export default function PlanPayment({ params }: { params: { pid: string } }) {
  const navigation = useRouter();
  const { data: plan, isLoading } = useQuery<PlanResponseApi>(
    QUERY_KEYS.PLANS.GET(params.pid),
    async () => ApiService.Plan.get({ id: params.pid })
  );
  const { user, saveUser } = useGlobalState();
  const { setSenderHash, createPix, setType, isLoadingSession } =
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
    if (!user || !plan) return;
    setLoadingPayment(true);
    await ApiService.Subscription.create({
      plano_id: plan.id,
      user_id: user.id,
    })
      .then((pixResponse) => {
        setLoadingPayment(false);
        setPixResponse(pixResponse.payment);
        const id = toast.loading('Aguardando a confirmação do pagamento', {
          toastId: 'awaiting-payment',
        });
        const intervalId = setInterval(() => {
          if (pixResponse) {
            ApiService.Subscription.get({
              id: pixResponse.subscription.id,
            }).then((subscriptionResponse) => {
              if (subscriptionResponse.status === 'ativo') {
                toast.dismiss(id);
                toast.success('Pagamento confirmado. Assinatura confirmada!');
                const updateUser = {...user, ativado: '1' }
                CacheService.user.saveCurrentUser(updateUser);
                saveUser(updateUser);
                navigation.push('/dashboard');
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
  }, [navigation, plan, saveUser, user]);

  useEffect(() => {
    generatePix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, plan]);

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

  if (isLoadingSession || isLoading || loadingPayment) {
    return <Loading />;
  }

  return (
    <>
      <div className='container-payment'>
        <div>
          <div className='flex flex-wrap '>
                        

            <div className='mx-auto mt-0 w-full max-w-full shrink-0 px-3 md:w-7/12 md:flex-0 lg:w-5/12'>
              <div className='relative z-0 flex min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border p-4 shadow-xl'>
                {/* <div className='flex justify-start mb-4'>
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
                  <Info label='Plano' content={plan?.nome || ''} />
                  <Info
                    label='Preço'
                    content={'R$ ' + currencyMask(plan?.preco || '0')}
                  />
                  <Info label='Período' content={`${plan?.periodo} Meses`} />
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
