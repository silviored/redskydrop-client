import Image from 'next/image';
import Link from 'next/link';

import SearchIcon from '../../assets/img/icons/search.svg';
import ShoppingCartLogo from '../../assets/img/icons/shopping-cart.svg';
import FacebookLogo from '../../assets/img/logos/facebook.svg';
import InstagramLogo from '../../assets/img/logos/instagram.svg';
import RedSkyLogo from '../../assets/img/logos/logo.png';
import TwitterLogo from '../../assets/img/logos/twitter.svg';

export function Header() {
  return (
    <header className='text-white xl:h-[170px] lg:h-[170px] md:h-[170px] sm:h-[140px] xs:h-[140px] w-full bg-gradient-header fixed top-0 pt-2 z-50'>
      <nav className='flex flex-col xl:px-16 lg:px-16 md:px-14 sm:px-2 xs:px-2'>
        <div className='flex justify-between w-full mb-6'>
          <div className='xl:flex lg:flex md:flex sm:hidden xs:hidden items-center'>
{/*             <Link className='text-white text-sm' href="/">Central do Vendedor</Link>
            <div className='border mx-4 h-5' />
            <Link className='text-white text-sm' href="/">Vender</Link>
            <div className='border mx-4 h-5' />
            <Link className='text-white text-sm' href="/">Baixe o App</Link>
            <div className='border mx-4 h-5' /> */}
            <div className='flex items-center'>
              <span className='text-sm'>Siga nos:</span>
              <Link className='mx-2' href="/">
                <Image
                  src={InstagramLogo}
                  alt='Logo Instagram'
                />
              </Link>
              <Link className='mx-2' href="/">
                <Image
                  src={TwitterLogo}
                  alt='Logo Twitter'
                />
              </Link>
              <Link className='mx-2' href="/">
                <Image
                  src={FacebookLogo}
                  alt='Logo Facebook'
                />
              </Link>
            </div>
          </div>
          <div className='flex items-center'>
            <Link className='text-white' href="/register">Cadastrar</Link>
            <div className='border mx-4 h-5' />
            <Link className='text-white' href="/login">Entrar</Link>
          </div>
        </div>
        <div className='flex justify-between w-full'>
          <div className="logo bg-white mr-4">
            <Link href="/">
              <Image
                src={RedSkyLogo}
                alt='Logo Red Sky'
                width='150'
              />
            </Link>
          </div>
          <div className='flex w-full items-center'>
            <div className="flex items-center w-full mr-4">
              <input type="text" className='flex-1 rounded w-full outline-none text-black px-4 py-2' placeholder="Digite o produto que deseja" />
              <button type="submit" className='flex items-center bg-red-500 -ml-14 z-20 px-4 h-8 rounded hover:opacity-75 duration-300'>
                <Image
                  src={SearchIcon}
                  alt='Search icon'
                  width={20}
                />
              </button>
            </div>
            <Image
              src={ShoppingCartLogo}
              alt='Shopping Cart'
              width={30}
            />
          </div>
        </div>
        <div className='xl:flex lg:flex md:flex sm:hidden xs:hidden justify-center py-2'>
          {/*           <Link className='text-white text-xs mx-2' href="/">Ofertas de 1,99</Link> */}
        </div>
      </nav>
    </header>
  );
}
