'use client';
import { useForm } from 'react-hook-form';
import { Footer } from '@/components/without-login/footer';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { REQUIRED_MESSAGE } from '@/constants/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { ApiService } from '@/services';
import { toast } from 'react-toastify';
import { Input } from '@/components/input';
import { useGlobalState } from '@/contexts/global-state';
import { CacheService } from '@/services/cache';
import { Loading } from '@/components/loading';
import CookieConsent from "react-cookie-consent";
import { ROUTES } from '@/constants/routes';

const loginUserSchema = z.object({
  email: z.string().nonempty(REQUIRED_MESSAGE),
  password: z.string().nonempty(REQUIRED_MESSAGE),
});

type LoginUserFormData = z.infer<typeof loginUserSchema> & {
  remember_me: boolean;
};

export default function Login() {
  const navigation = useRouter();
  const query = useSearchParams()
  const callback = query.get('callback')
  const { saveUser } = useGlobalState();
  const [loading, setLoading] = useState(false)
  const reactHookForm = useForm<LoginUserFormData>({
    resolver: zodResolver(loginUserSchema),
  });

  const onSubmit = useCallback(
    async (data: LoginUserFormData) => {
      setLoading(true)
      const rememberMe = reactHookForm.watch('remember_me');
      CacheService.user.saveRememberMe(rememberMe);
      try {
        const loginResponseUser = await ApiService.Login.login({
          email: data.email,
          tipo: '1',
          password: data.password
        });
        if (loginResponseUser?.user?.ativado === undefined || loginResponseUser?.user?.ativado === null) {
          toast.error(
            'Seus dados estão incompletos. recarregue a página e tente novamente por favor',
          );
          setLoading(false)
          return
        }
        ApiService.persistToken(loginResponseUser.accessToken as string);
        const user = {
          ...loginResponseUser.user,
          token: loginResponseUser.accessToken,
        };

        CacheService.user.saveCurrentUser(user);
        saveUser(user);
        navigation.push('/dashboard');
      } catch (error: any) {
        toast.error(`Ocorreu um erro ao fazer o login: ${error.message || error}`);
        setLoading(false)
      }

    },
    [navigation, reactHookForm, saveUser]
  );

  useEffect(() => {
    const cachedRememberMe = CacheService.user.getRememberMe();
    reactHookForm.setValue('remember_me', cachedRememberMe === 'true');
    if (cachedRememberMe === 'false') {
      CacheService.user.clear();
    }
  }, [reactHookForm]);

  useEffect(() => {
    if (callback && callback === 'send_success_forgot_mail') {
      toast.success('Email de recuperação enviado com sucesso');
    }
  }, [callback])

  if (loading) {
    return <Loading />
  }

  return (
    <div className='bg-gradient-black-white '>
      <div className='flex h-full flex-col '>
        <div className='flex h-full flex-col items-center justify-center'>
          <div className='bg-white rounded-2xl shadow-2xl container-logo flex items-center justify-center'>
            <Link href='/' >
              <img src="/assets/img/logos/logo.png" alt="" width={250} style={{ margin: '0 auto' }} />
            </Link>
          </div>

          <div className='container-form container'>
            <div className='flex flex-wrap '>
              <div className='mx-auto mt-0 w-full max-w-full shrink-0 px-3 md:w-7/12 md:flex-0 lg:w-5/12'>
                <div className='relative z-0 flex min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border shadow-xl'>
                  <div className='mb-0 rounded-t-2xl border-b-0 bg-white p-6 text-center'>
                    <h5 >Login</h5>
                  </div>
                  <div className='px-l-5 flex-auto pb-5'>
                    <form role='form text-left' onSubmit={reactHookForm.handleSubmit(onSubmit)}>
                      <div className='mb-4'>
                        <Input
                          type='email'
                          placeholder='Email'
                          style={{ paddingLeft: '10px' }}
                          icon={
                            <div>
                              <i className='ni ni-email-83'></i>
                            </div>
                          }
                          {...reactHookForm.register('email')}
                          errors={reactHookForm.formState.errors.email?.message}
                        />
                      </div>
                      <div className='mb-4'>
                        <Input type='password' placeholder='Senha' style={{ paddingLeft: '10px' }}
                          icon={
                            <div>
                              <i className='ni ni-lock-circle-open'></i>
                            </div>
                          }
                          {...reactHookForm.register('password')}
                          errors={
                            reactHookForm.formState.errors.password?.message
                          }
                        />
                      </div>
                      <div className='mb-5 text-center'>
                        <button type='submit' className='mb-2 mt-6 inline-block cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>
                          Entrar
                        </button>
                      </div>
                      <div className='flex flex-col items-center justify-between lg:flex-row '>
                        <Link href='/forgot-password' className='mb-0 mt-4 leading-normal '>
                          Esqueci minha senha
                        </Link>
                        <Link href='/sign-up' className='mb-0 mt-4 leading-normal'>
                          Criar nova conta
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CookieConsent
          buttonText="Aceitar"
          buttonStyle={{ background: "rgb(245, 54, 92)", borderRadius: '8px', color: '#fff', padding: '0.5rem' }}
        >Utilizamos cookies para fornecer uma melhor experiência para nossos usuários. Para saber
          mais sobre o uso de cookies, consulte nossa{' '}
          <a href={ROUTES.PRIVACY_POLICY} style={{ color: 'rgb(245, 54, 92)' }}>política de privacidade</a>. Ao
          continuar navegando em nosso site, você concorda com a nossa política.</CookieConsent>
        <Footer />
      </div>
    </div>
  );
}
