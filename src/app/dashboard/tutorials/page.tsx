"use client"
import { ApiService } from '@/services'
import { Card } from './_components/card'
import './styles.css'
import { Loading } from '@/components/loading'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/keys'

export default function Integrations() {
  const { data = [], isLoading: isLoading } = useQuery<TutorialResponseApi[]>(
    QUERY_KEYS.REPORT.DASHBOARD,
    async () => ApiService.Tutorial.getAll()
  );

  if(isLoading) {
    return <Loading/>
  }
  
  return (
    <div>
      <div className='tutorials-container'>
        {data?.map(tutorial => (
          <Card key={tutorial.link} name={tutorial.nome} link={tutorial.link} description={tutorial.descricao}/>
        ))}
      </div>
    </div>
  )
}
