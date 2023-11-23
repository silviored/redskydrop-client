"use client"
import { ApiService } from '@/services'
import { Card } from './_components/card'
import './styles.css'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ROUTES } from '@/constants/routes'
import { Loading } from '@/components/loading'



export default function Integrations() {
  const query = useSearchParams()
  const navigation = useRouter()
  const code = query.get('code')
  const state = query.get('state')
  const [isLoading, setIsLoading] = useState(false)

  const saveToken = useCallback(async () => {
    try {

      toast.promise(ApiService.ApiUser.createBling({
        api_id: 1, // 1 - BLING
        credentials: { code, state  },
      }), {
        success: 'Integração feita com sucesso',
        error: 'Houve um erro ao concluir sua integração',
        pending: 'Finalizando sua integração'
      })
      // navigation.replace(ROUTES.INTEGRATIONS.ROOT)
    } catch (error: any) {
      console.log(error)
      toast.error(error?.message)
    }
  }, [code, state])

  useEffect(() => {
    if(!code && !state) {
      return
    }
    // if(code && state && state !== process.env.NEXT_PUBLIC_API_STATE_BLING) {
    //   toast.error('Algo de errado com sua integração, por favor tente novamente')
    //   return
    // }
    saveToken()
  }, [code, saveToken, state])

  if(isLoading) {
    return <Loading/>
  }
  
  return (
    <div>
      <div className='integration-container'>
      {/* <div className='bg-white rounded-2xl shadow-2xl integration-container'> */}
        <Card />
      </div>
    </div>
  )
}
