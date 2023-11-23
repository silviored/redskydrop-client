"use client"
import { Input } from "@/components/input"
import { Loading } from "@/components/loading"
import { QUERY_KEYS } from "@/constants/keys"
import { ApiService } from "@/services"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useSearchParams } from "next/navigation"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { cepMask, unMaskCep } from "@/utils/mask"
import { Info } from "./info"

type SearchCorreios = {
  cepOrigem: string
  cepDestino: string
  pesoProdutoGramas: string
  alturaEmbalagemCentimetros: string
  larguraEmbalagemCentimetros: string
  profundidadeEmbalagemCentimetros: string
}

type FormSimulationData = 
  { product_name: string; cep: string }


const generateUrlQueryCorreios = (params: SearchCorreios) => {
  return `https://www.cepcerto.com/ws/json-frete/${params.cepOrigem}/${params.cepDestino}/${params.pesoProdutoGramas}/${params.alturaEmbalagemCentimetros}/${params.larguraEmbalagemCentimetros}/${params.profundidadeEmbalagemCentimetros}`
}

const DontKnowCepLabel = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <label>CEP</label>
      <div>
      <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank">
        <span style={{ fontSize: '14px', color: 'rgb(245, 54, 92)' }}>
          Não sei meu cep
        </span>
      </a>
      </div>
    </div>
  )
}

export function FormContainer() {
  const query = useSearchParams()
  const reactHookForm = useForm<FormSimulationData>();
  const [queryCepData, setQueryCepData] = useState<ApiQueryCepResponseApi | null>()
  const [isFetchData, setIsFetchData] = useState(false)


  const { data = { items: []}, isLoading } = useQuery<{ items: ProductResponseApi[]}>(
    QUERY_KEYS.PRODUCTS.LIST_ALL,
    async () => ApiService.Product.getAll({})
  );

useEffect(() => {
}, [])
  const onSubmit = useCallback(
    async (formData: FormSimulationData) => {
      setIsFetchData(true)
      const product_id = formData.product_name.split(' ')[0];
      const findProduct = data.items.find(product => product.id === Number(product_id))
      if(!findProduct) {
        toast.error('Produto não encontrado')
        return
      }
      try {
        const responseQuerySimulation = await axios.get(generateUrlQueryCorreios({
          alturaEmbalagemCentimetros: findProduct.altura.toString(),
          larguraEmbalagemCentimetros: findProduct.largura.toString(),
          profundidadeEmbalagemCentimetros: findProduct.comprimento.toString(),
          pesoProdutoGramas: ((Number(findProduct.peso)) * 12000).toString(),
          cepDestino: unMaskCep(formData.cep),
          cepOrigem: process.env.NEXT_PUBLIC_COMPANY_CEP as string,
        }))
        if(!responseQuerySimulation.data?.prazosedex) {
          setIsFetchData(false)
          toast.error(responseQuerySimulation.data.msg)
          return
        }
        setQueryCepData(responseQuerySimulation.data)
      } catch (error: any) {
        toast.error(error.message);
      }
      setIsFetchData(false)
    },
    [data.items]
  );


  return (
    <>
    {isLoading || isFetchData && <Loading  />}
      <form
      role='form text-left'
      className='my-profile-wrapper-form'
      onSubmit={reactHookForm.handleSubmit(onSubmit)}
    >
      <div className='mb-4'>
        <Controller
          control={reactHookForm.control}
          name="cep"
          render={({ field}) => {
            return (
              <Input
                placeholder='CEP'
                htmlLabel={<DontKnowCepLabel />}
                errors={reactHookForm.formState.errors.cep?.message}
                {...field}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  if(event.target.value) {
                    event.target.value = cepMask(event.target.value)
                  }
                  field.onChange(event)
                }}
              />
            )
          }}
        />
      </div>
      <div className='mb-4'>
        <Input list="products" {...reactHookForm.register('product_name')} placeholder="Produto"/>

        <datalist id="products">
          {data.items.map(product => {
            return (
              <option value={`${product.id} - ${product.nome}`} key={product.id}/>
            )
          })}
        </datalist>
      </div>

      {queryCepData && (
       <>
         <Info title="Transportadora" description="Sedex" />
        <Info title="Prazo (Dias)" description={queryCepData?.prazosedex || ''} />
        <Info title="Valor" description={queryCepData?.valorsedex || ''} />
       </>
      )}

      <div className='mb-5 text-center my-profile-container-button'>
        <button
          type='submit'
          className='mb-2 mt-6 inline-block cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'
        >
          Simular
        </button>
      </div>
    </form>
    </>
  )
}