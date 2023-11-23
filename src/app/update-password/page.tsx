"use client"
import './styles.css';
import { useGlobalState } from '@/contexts/global-state';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema } from './form-validation';
import { ApiService } from '@/services';
import { toast } from 'react-toastify';
import { useCallback, useState } from 'react';
import { Input } from '@/components/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loading } from '@/components/loading';

export default function UpdatePassword() {
  const navigation = useRouter();
  const query = useSearchParams()
  const token = query.get('token')
  const [isLoading, setIsLoading] = useState(false)
  const reactHookForm = useForm<UserRequestApi>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = useCallback(
    async (data: { password: string }) => {
      if(!token) return
      setIsLoading(true)
      try {
         await ApiService.Login.updatePasswordForgot({
          ...data,
          token,
        });
        toast.success('Senha alterada com sucesso. faça o login');
        navigation.push('/');
      } catch (error: any) {
        toast.error(error.message);
        setIsLoading(true)
      }
    },
    [navigation, token]
  );

  if(isLoading) {
    return <Loading />
  }
  return (
    <div className='container-forgot-password bg-white rounded-2xl shadow-2xl'>
        <div className='flex flex-wrap'>
        <div className='relative z-0 flex min-w-0 flex-col break-words rounded-2xl border-0 bg-black bg-clip-border shadow-xl container-forgot-password-form'>
                  <div className='mb-0 rounded-t-2xl border-b-0 bg-black p-6 text-center'>
                    <h5 className='text-white'>Alterar senha</h5>
                  </div>
                  <div className='px-l-5 flex-auto pb-5 '>
                    <form
                      onSubmit={reactHookForm.handleSubmit(onSubmit)}
                      className=''
                    >
                       <div className='mb-4'>
                        <Input
                          type='password'
                          placeholder='Senha'
                          icon={<i className='ni ni-lock-circle-open'></i>}
                          errors={
                            reactHookForm.formState.errors.password?.message
                          }
                          helpText={
                            reactHookForm.formState.errors.password?.message
                          }
                          {...reactHookForm.register('password')}
                        />
                      </div>
                      <div className='mb-4'>
                        <Input
                          type='password'
                          placeholder='Confirmar senha'
                          icon={<i className='ni ni-lock-circle-open'></i>}
                          errors={
                            reactHookForm.formState.errors.password_confirmation
                              ?.message
                          }
                          helpText={
                            reactHookForm.formState.errors.password_confirmation
                              ?.message
                          }
                          {...reactHookForm.register('password_confirmation')}
                        />
                      </div>
                      <div className='mb-5 text-center'>
                        <button
                          type='submit'
                          className='mb-2 mt-6 inline-block cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'
                        >
                          Enviar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
            </div>
    </div>
  );
}
