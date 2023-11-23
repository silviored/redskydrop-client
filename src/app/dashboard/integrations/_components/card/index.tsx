"use client"
import Image from "next/image"
import { useCallback } from "react"
import LogoBling from '@/assets/img/logos/bling.png'
import './styles.css'
export function Card() {
  
  const handleLink = useCallback(() => {
    window.open(process.env.NEXT_PUBLIC_API_BLING_URL)
  }, [])
  return (
      <div className='bg-white rounded-2xl shadow-2xl card-container'>
      <div className='container-header'>
        <Image src={LogoBling} alt='' width={100} height={100} />
        <p>Dados da Bling</p>
      </div>
      {/* <div className='container-description'>
      </div> */}
      <div className='container-button'>
        <button onClick={handleLink} className='w-full cursor-pointer rounded-lg border-0 bg-red-400 px-5 py-2.5 text-center align-middle text-sm font-bold leading-normal text-white shadow-md'>Autorizar</button>
      </div>
    </div>
  )
}