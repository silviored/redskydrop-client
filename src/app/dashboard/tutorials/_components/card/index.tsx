"use client"
import Image from "next/image"
import { useCallback } from "react"
import LogoBling from '@/assets/img/logos/bling.png'
import './styles.css'

type CardProps = {
  name: string
  description?: string
  link: string
}

export function Card({ link,name,description }: CardProps) {
  
  const handleLink = useCallback(() => {
    window.open(process.env.NEXT_PUBLIC_API_BLING_URL)
  }, [])
  
  const getVideoId = useCallback(() => {
    if (!link) return ''

    const currentUrl = new URL(link)
    const searchParams = currentUrl.searchParams
    const videoId = searchParams.get('v') || ''

    return videoId
  }, [link])

  return (
      <div className='bg-white rounded-2xl shadow-2xl card-container'>
      <div className='container-header'>
        <iframe
          src={`https://www.youtube.com/embed/${getVideoId()}`}
          title={name}
          style={{ borderWidth: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <p>{name}</p>
      </div>
      <div className='container-description'>
        {description}
      </div>
    </div>
  )
}