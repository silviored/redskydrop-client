"use client"
import InfiniteScroll from 'react-infinite-scroll-component';
import './styles.css'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { useCallback, useEffect, useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { Loading } from '@/components/loading';
import { currencyMask } from '@/utils/mask';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useProduct } from '@/contexts/product';
import { ApiService } from '@/services';
import moment from 'moment';
import { MASKS } from '@/constants/mask';
import { SUBSCRIPTION_STATUS_TRANSLATED } from '@/constants/types';
import { Details } from './_components/details';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/keys';


export default function Subscription() {
  const navigation = useRouter()

  const { data = [], isLoading } = useQuery<SubscriptionResponseApi[]>(
    QUERY_KEYS.SUBSCRIPTIONS.LIST,
    async () => ApiService.Subscription.getAll()
  );
  const handleChangePlan = useCallback(() => {
    navigation.push('/select-plan?not_skip=true');
  }, [navigation])

  const handlePayment = useCallback(({ plan_id }: { plan_id: number }) => {
    navigation.push(`/select-plan/${plan_id}/payment`);
  }, [navigation])

  if(isLoading) {
    return <Loading />
  }
  return (
    <div className='subscription-container'>
      <div className='bg-white rounded-2xl shadow-2xl subscription-details-container'>
        <h3 className='page-title'>Assinatura</h3>
          <Details/>
        <div className='subscription-container-button'>
          <button onClick={handleChangePlan} className=' cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Alterar plano</button>
        </div>
      </div>

      
      <div className='bg-white rounded-2xl shadow-2xl subscription-invoice-container'>
      <h3 className='px-3 pt-2 page-title'>Faturas</h3>

        
      <Table>
        <Thead>
          <Tr>
            <Th>Cod.</Th>
            <Th>Plano</Th>
            <Th>Vencimento</Th>
            <Th>Valor</Th>
            <Th>Pago em</Th>
            <Th>Status</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
            <Tbody>
              {data.length ? data?.map(sale => (
              <Tr key={sale?.id}>
                <Td>{sale?.id}</Td>
                <Td>{sale?.plano?.nome}</Td>
                <Td>{moment(sale?.pagamento?.criado_em).add(2, 'days').format(MASKS.DATE.LOCALE_WITHOUT_TIME)}</Td>
                <Td>R$ {currencyMask(sale?.pagamento?.valor)}</Td>
                <Td>{sale?.pagamento?.data_pagamento ? moment(sale.pagamento.data_pagamento).format(MASKS.DATE.LOCALE_WITHOUT_TIME) : 'Pagamento pendente'}</Td>
                <Td>{SUBSCRIPTION_STATUS_TRANSLATED[sale?.status]}</Td>
                <Td data-last-item={true}>
                  <button onClick={() => handlePayment({ plan_id: sale?.plano_id})} disabled={!!sale?.pagamento?.data_pagamento} className='btn-payment w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
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

    </div>
    </div>
  )
}