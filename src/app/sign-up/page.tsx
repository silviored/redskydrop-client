'use client';
import { Footer } from '@/components/without-login/footer';
import { Input } from '@/components/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { createUserSchema } from './form-validation';
import { AddressService, ApiService } from '@/services';
import { toast } from 'react-toastify';
import { CacheService } from '@/services/cache';
import { useGlobalState } from '@/contexts/global-state';
import './styles.css';
import { MASKS } from '@/constants/mask';
import moment from 'moment';
import { Select } from '@/components/select';
import { SELECT_BRAZILIAN_STATES } from '@/constants/brazilian-states';
import { Modal } from '@/components/modal';


export default function SignUp() {
  const navigation = useRouter();
  const { saveUser } = useGlobalState();
  const [openModalTerms, setOpenModalTerms] = useState(false)
  const reactHookForm = useForm<UserRequestApi>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = useCallback(
    async (data: UserRequestApi) => {
      try {
        const responseUserLogin =
          await ApiService.Login.signUp({
            ...data,
            tipo: '1'
          });
        ApiService.persistToken(responseUserLogin.token as string);
        CacheService.user.saveCurrentUser(responseUserLogin);
        saveUser(responseUserLogin);
        toast.success('Usuário cadastrado com sucesso');
        navigation.push('/select-plan?not_back=true');
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [navigation, saveUser]
  );

  return (
    <div className='bg-gradient'>
      <div className='flex h-full flex-col'>
        <div className='flex h-full flex-col justify-center'>
          <div className='container-logo flex items-center justify-center'>
            <div className='bg-white rounded-2xl shadow-2xl container-logo flex items-center justify-center'>
              <img src="/assets/img/logos/logo.png" alt="" width={250} style={{ margin: '0 auto' }} />
            </div>
          </div>

          <div className='container-form container'>
            <div className='flex flex-wrap '>
              <div className='mx-auto mt-0 w-full max-w-full shrink-0 px-3 md:flex-0'>
                <div className='relative z-0 flex min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border shadow-xl'>
                  <div className='mb-0 rounded-t-2xl border-b-0 p-6 text-center'>
                    <h5 >Cadastrar-se como lojista</h5>
                  </div>
                  <div className='px-l-5 flex-auto pb-5'>
                    <form role='form text-left' onSubmit={reactHookForm.handleSubmit(onSubmit)}>
                      <div className='grid-row-1 mb-4'>
                        <Input
                          placeholder='Nome completo'
                          // icon={<i className='ni ni-badge'></i>}
                          errors={reactHookForm.formState.errors.nome?.message}
                          {...reactHookForm.register('nome')}
                        />
                        <Input
                          type='cpf_cnpj'
                          placeholder='CPF ou CNPJ'
                          // icon={<i className='ni ni-badge'></i>}
                          errors={reactHookForm.formState.errors.cpf?.message}
                          {...reactHookForm.register('cpf')}
                        />
                        <Input
                          type='date'
                          placeholder='Data de nascimento/abertura'
                          max={moment().format(MASKS.DATE.EUA_WITHOUT_TIME)}
                          // icon={<i className='fa fa-calendar'></i>}
                          errors={
                            reactHookForm.formState.errors.data_nascimento_abertura?.message
                          }
                          {...reactHookForm.register('data_nascimento_abertura')}
                        />

                      </div>
                      <div className='grid-row-1 mb-4'>
                        <Input
                          placeholder='Nome da loja'
                          // icon={<i className='ni ni-badge'></i>}
                          errors={reactHookForm.formState.errors.nome_fantasia?.message}
                          {...reactHookForm.register('nome_fantasia')}
                        />
                        <Input
                          placeholder='Nome da loja 2'
                          // icon={<i className='ni ni-badge'></i>}
                          errors={reactHookForm.formState.errors.nome_loja_2?.message}
                          {...reactHookForm.register('nome_loja_2')}
                        />
                        <Input
                          placeholder='Nome da loja 3'
                          // icon={<i className='ni ni-badge'></i>}
                          errors={reactHookForm.formState.errors.nome_loja_3?.message}
                          {...reactHookForm.register('nome_loja_3')}
                        />
                      </div>
                      <div className='grid-row-1 mb-4'>

                        <Input
                          type='email'
                          placeholder='Email'
                          // icon={<i className='ni ni-email-83'></i>}
                          errors={reactHookForm.formState.errors.email?.message}
                          {...reactHookForm.register('email')}
                        />
                        <Input
                          type='telefone'
                          placeholder='Telefone'
                          // icon={<i className='ni ni-mobile-button'></i>}
                          errors={
                            reactHookForm.formState.errors.telefone?.message
                          }
                          {...reactHookForm.register('telefone')}
                          maxLength={11}
                          minLength={10}
                        />
                        <Input
                          type='password'
                          placeholder='Senha'
                          // icon={<i className='ni ni-lock-circle-open'></i>}
                          errors={
                            reactHookForm.formState.errors.password?.message
                          }
                          {...reactHookForm.register('password')}
                        />

                      </div>
                      <div className='grid-row-1 mb-4'>
                        <Input
                          type='password'
                          placeholder='Confirmar senha'
                          // icon={<i className='ni ni-lock-circle-open'></i>}
                          errors={
                            reactHookForm.formState.errors.password_confirmation
                              ?.message
                          }
                          {...reactHookForm.register('password_confirmation')}
                        />
                        <Input
                          placeholder='Cep'
                          // icon={<i className='ni ni-badge'></i>}
                          errors={reactHookForm.formState.errors.cep?.message}
                          {...reactHookForm.register('cep')}
                          maxLength={8}
                          onChange={async (event) => {
                            let value = event.target.value
                            if (value) {
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


                      </div>

                      <div className='grid-row-1 mb-4'>
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

                      </div>

                      <div className='mb-0.5 block min-h-6 pl-7'>
                        <input
                          className="ease relative float-left -ml-7 mt-1 h-4.8 w-4.8 cursor-pointer appearance-none rounded-1.4 border border-solid border-slate-200 bg-white bg-contain bg-center bg-no-repeat align-top transition-all duration-250 after:absolute after:flex after:h-full after:w-full after:items-center after:justify-center after:font-awesome after:text-xxs after:text-white after:opacity-0 after:transition-all after:duration-250 after:ease-in-out after:content-['\f00c'] checked:border-0 checked:border-transparent checked:bg-transparent checked:bg-gradient-to-tl checked:from-blue-500 checked:to-violet-500 checked:after:opacity-100"
                          type='checkbox'
                          {...reactHookForm.register('acceptedTerms')}
                        />
                        <label className='mb-2 ml-1 cursor-pointer text-sm font-normal'>
                          Eu li e concordo com os{' '}
                          <a href='#' onClick={() => setOpenModalTerms(true)} className='text-red-600'>
                            Termos e Condições de uso{' '}
                          </a>{' '}
                          do SkyDrop.
                        </label>
                        {reactHookForm.formState.errors.acceptedTerms
                          ?.message && (
                            <p className='mt-1 text-red-600'>
                              Você precisa ler e aceitar os termos
                            </p>
                          )}
                      </div>
                      <div className='mb-5 text-center'>
                        <button
                          type='submit'
                          className='mb-2 mt-6 inline-block cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'
                        >
                          Proximo
                        </button>
                      </div>
                      <div className='flex flex-col items-center justify-end lg:flex-row'>
                        <p className='mb-0 mt-4 leading-normal text-white'>
                          Já tem conta?{' '}
                          <Link href='/' className='text-red-600'>
                            Login
                          </Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
      <Modal visible={openModalTerms} onClose={() => setOpenModalTerms(false)}>
        <div className='container-terms-and-conditions'>
          <iframe src="/terms-and-conditions.html" width="100%" height="100%"></iframe>
        </div>
      </Modal>
    </div>
  );
}
