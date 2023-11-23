"use client"
import { useCallback } from 'react'
import './styles.css'
import { ApiService } from '@/services'
import { QUERY_KEYS } from '@/constants/keys';
import { Loading } from '@/components/loading';
import { useQuery } from '@tanstack/react-query';
import { SUBSCRIPTION_STATUS_TRANSLATED } from '@/constants/types';
import { currencyMask } from '@/utils/mask';
import moment from 'moment';
import { MASKS } from '@/constants/mask';



export function Details() {

  const { data, isLoading } = useQuery<SubscriptionResponseApi>(
    QUERY_KEYS.SUBSCRIPTIONS.MY_SUBSCRIPTION,
    async () => ApiService.Subscription.getMyPlan()
  );

  if (isLoading) {
    return <Loading/>
  }

  if(!data) {
    return (
      <div>
    <h5>Sem plano contratado</h5>
  </div>
    )
  }

  return (
    <div>
    <h5>Plano Contratado</h5>
    <div className='subscription-plan-details-container'>
      <strong>{data?.plano?.nome}</strong>
      <div className='subscription-container-info'>
        <span>Situação:</span>
        <strong>{SUBSCRIPTION_STATUS_TRANSLATED[data?.status]}</strong>
      </div>
      <div className='subscription-container-info'>
        <span>Valor:</span>
        <strong>R$ {currencyMask(data?.plano?.preco)}</strong>
      </div>
      <div className='subscription-container-info'>
        <span>Método de pagamento:</span>
        <strong>PIX</strong>
      </div>
      <div className='subscription-container-info'>
        <span>Expira em:</span>
        <strong>{moment(data?.data_termino).format(MASKS.DATE.LOCALE_WITHOUT_TIME)}</strong>
      </div>
    </div>
  </div>
  )
}