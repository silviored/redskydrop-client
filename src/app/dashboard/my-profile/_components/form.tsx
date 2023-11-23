"use client"
import { Input } from "@/components/input"
import { Select } from "@/components/select"
import { SELECT_BRAZILIAN_STATES } from "@/constants/brazilian-states"
import { MASKS } from "@/constants/mask"
import { useGlobalState } from "@/contexts/global-state"
import { AddressService, ApiService } from "@/services"
import { CacheService } from "@/services/cache"
import moment from "moment"
import { useRouter, useSearchParams } from "next/navigation"
import { ChangeEvent, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

export function FormContainer() {
  const { user, saveUser }= useGlobalState()
  const query = useSearchParams()
  const navigation = useRouter()
  const type_document = query.get('type_document')
  const reactHookForm = useForm<UserRequestApi>();

  useEffect(() => {
    if(!user) return
    reactHookForm.reset({
      cpf: user.cpf,
      email: user.email,
      inscricao_estadual: user.inscricao_estadual,
      nome_fantasia: user.nome_fantasia,
      nome: user.nome,
      razao_social: user.razao_social,
      responsavel: user.responsavel,
      telefone: user.telefone,
      data_nascimento_abertura: user.data_nascimento_abertura,
      logradouro: user?.logradouro,
      cep: user?.cep,
      numero: user?.numero,
      bairro: user?.bairro,
      estado: user?.estado,
      complemento: user?.complemento,
      cidade: user?.cidade,
      nome_loja_2: user?.nome_loja_2,
      nome_loja_3: user?.nome_loja_3,
    })
  }, [reactHookForm, user])

  const onSubmit = useCallback(
    async (data: Partial<UserRequestApi>) => {
      if(!user) return
      try {
        const responseUserUpdated = await ApiService.User.update({
          ...data,
          id: user.id
        });
        saveUser(responseUserUpdated);
        CacheService.user.saveCurrentUser(responseUserUpdated)
        toast.success('Dados atualizados com sucesso');
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [saveUser, user]
  );
  return (
    <form
                      role='form text-left'
                      className='my-profile-wrapper-form'
                      onSubmit={reactHookForm.handleSubmit(onSubmit)}
                    >
                      <div className='mb-4'>
                        <Input
                          placeholder='Nome da loja'
                          errors={reactHookForm.formState.errors.nome?.message}
                          {...reactHookForm.register('nome')}
                        />
                      </div>
                      <div className='mb-4'>
                        <Input
                          placeholder='Nome da loja 2'
                          errors={reactHookForm.formState.errors.nome_loja_2?.message}
                          {...reactHookForm.register('nome_loja_2')}
                        />
                      </div>
                      <div className='mb-4'>
                        <Input
                          placeholder='nome da loja 3'
                          errors={reactHookForm.formState.errors.nome_loja_3?.message}
                          {...reactHookForm.register('nome_loja_3')}
                        />
                      </div>
                      
                      <div className='mb-4'>
                        <Input
                          type='telefone'
                          placeholder='Telefone'
                          errors={
                            reactHookForm.formState.errors.telefone?.message
                          }
                          {...reactHookForm.register('telefone')}
                        />
                      </div>
                      <div className='mb-4'>
                        <Input
                          placeholder='Nome responsável'
                          errors={
                            reactHookForm.formState.errors.responsavel?.message
                          }
                          {...reactHookForm.register('responsavel')}
                        />
                      </div>
  
                      
                      <div className='mb-4'>
                        <Select
                          placeholder='Tipo de documento'
                          options={[
                            {
                              label: 'CNPJ',
                              value: 'cnpj'
                            },
                            {
                              label: 'CPF',
                              value: 'cpf'
                            },
                          ]}
                          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                            navigation.replace(`/dashboard/my-profile?type_document=${event.target.value}`)
                          }}
                          value={type_document || ''}
                        />
                      </div>

                      <div className='mb-4'>
                        <Input
                          type='email'
                          placeholder='Email'
                          disabled
                          errors={reactHookForm.formState.errors.email?.message}
                          {...reactHookForm.register('email')}
                        />
                      </div>

                      <div className='mb-4'>
                        <Input
                          placeholder="Documento"
                          errors={reactHookForm.formState.errors.cpf?.message}
                          {...reactHookForm.register('cpf')}
                        />
                      </div>
                      <div className='mb-4'>
                        <Input
                          type='date'
                          placeholder='Data de nascimento/abertura'
                          max={moment().format(MASKS.DATE.EUA_WITHOUT_TIME)}
                          errors={
                            reactHookForm.formState.errors.data_nascimento_abertura?.message
                          }
                          {...reactHookForm.register('data_nascimento_abertura')}
                        />
                      </div>
                      {type_document === 'cnpj' && (
                        <>
                          <div className='mb-4'>
                        <Input
                          placeholder='Nome fantasia'
                          errors={
                            reactHookForm.formState.errors.nome_fantasia?.message
                          }
                          {...reactHookForm.register('nome_fantasia')}
                        />
                      </div>
                      <div className='mb-4'>
                        <Input
                          placeholder='Inscrição estadual'
                          errors={
                            reactHookForm.formState.errors.inscricao_estadual?.message
                          }
                          {...reactHookForm.register('inscricao_estadual')}
                        />
                      </div>

                      <div className='mb-4'>
                        <Input
                          placeholder='Razão social'
                          errors={
                            reactHookForm.formState.errors.razao_social?.message
                          }
                          {...reactHookForm.register('razao_social')}
                        />
                      </div>
                        </>
                      )}

<Input
                          placeholder='Cep'
                          errors={reactHookForm.formState.errors.cep?.message}
                          {...reactHookForm.register('cep')}
                          maxLength={8}
                          onChange={async (event) => {
                            let value = event.target.value
                            if(value) {
                              value = value.replaceAll(/\D/g, '')
                            }

                            reactHookForm.setValue('cep', value)
                            if (!value || value.replaceAll('_', '').length > 8) return

                            await AddressService.getAddressByCEP(value).then((response) => {
                              if (!response) return
                              reactHookForm.setValue('logradouro', response.street)
                              reactHookForm.setValue('cidade', response.city)
                              reactHookForm.setValue('estado', response.state)
                              reactHookForm.setValue('bairro', response.neighborhood)
                            })
                          }}
                        />

<Select
                        placeholder='Estado'
                        errors={reactHookForm.formState.errors.estado?.message}
                        {...reactHookForm.register('estado')}
                        options={SELECT_BRAZILIAN_STATES}
                      />

<Input
                          placeholder='Cidade'
                          errors={
                            reactHookForm.formState.errors.cidade?.message
                          }
                          {...reactHookForm.register('cidade')}
                        />
                      <Input
                        placeholder='Bairro'
                        errors={
                          reactHookForm.formState.errors.bairro?.message
                        }
                        {...reactHookForm.register('bairro')}
                      />
                      <Input
                      placeholder='Logradouro'
                      errors={
                        reactHookForm.formState.errors.logradouro?.message
                      }
                      {...reactHookForm.register('logradouro')}
                    />
                    <Input
                        placeholder='Número'
                        errors={
                          reactHookForm.formState.errors.numero?.message
                        }
                        {...reactHookForm.register('numero')}
                      />
                      <div className='mb-4'>
                        <Input
                          type='password'
                          placeholder='Alterar senha'
                          errors={
                            reactHookForm.formState.errors.password
                              ?.message
                          }
                          {...reactHookForm.register('password')}
                        />
                      </div>
                      <div className='mb-5 text-center my-profile-container-button'>
                        <button
                          type='submit'
                          className='mb-2 mt-6 inline-block cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'
                        >
                          Atualizar meu dados
                        </button>
                      </div>
                    </form>
  )
}