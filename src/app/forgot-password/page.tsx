"use client"
import './styles.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendMailForgotPassword } from './form-validation';
import { ApiService } from '@/services';
import { toast } from 'react-toastify';
import { useCallback, useState } from 'react';
import { Input } from '@/components/input';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/loading';
import Link from 'next/link';

type SendForgotPasswordMail = { email: string }

export default function ForgotPassword() {
  const navigation = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const reactHookForm = useForm<SendForgotPasswordMail>({
    resolver: zodResolver(sendMailForgotPassword),
  });

  const onSubmit = useCallback(
    async (data: SendForgotPasswordMail) => {
      setIsLoading(true)
      try {
        await ApiService.Login.sendForgotPasswordMail({
          ...data,
        });

        navigation.push('/?callback=send_success_forgot_mail');
      } catch (error: any) {
        toast.error(error.message);
        setIsLoading(false)
      }
    },
    [navigation]
  );

  if (isLoading) {
    return <Loading />
  }
  return (
    <div className='bg-gradient-black-white '>
      <div className='flex h-full flex-col '>
        <div className='flex h-full flex-col items-center justify-center'>
          <div className='bg-white rounded-2xl shadow-2xl container-logo flex items-center justify-center'>
            <img src="/assets/img/logos/logo.png" alt="" width={250} style={{ margin: '0 auto' }} />
          </div>
          <div className='container-form container'>
            <div className='flex flex-wrap '>
              <div className='mx-auto mt-0 w-full max-w-full shrink-0 px-3 md:w-7/12 md:flex-0 lg:w-5/12'>
                <div className='relative z-0 flex min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border shadow-xl'>
                  <div className='mb-0 rounded-t-2xl border-b-0 bg-white p-6 text-center'>
                    <h5 >Esqueci minha senha</h5>
                  </div>
                  <div className='px-l-5 flex-auto pb-5 '>
                    <form
                      onSubmit={reactHookForm.handleSubmit(onSubmit)}
                      className=''
                    >
                      <div className='mb-4'>
                        <Input
                          type='email'
                          placeholder='Email'
                          icon={<i className='ni ni-email-83'></i>}
                          errors={reactHookForm.formState.errors.email?.message}
                          helpText={reactHookForm.formState.errors.email?.message}
                          {...reactHookForm.register('email')}
                        />
                      </div>
                      <div className='mb-5 text-center'>
                        <button type='submit' className='mb-2 mt-6 inline-block cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                          Enviar
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
      </div>
    </div>
  );
}
