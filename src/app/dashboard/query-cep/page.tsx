import './styles.css'
import { FormContainer } from './_components/form';



export default async function QueryCep() {
  return (
    <div>
      <div className='bg-white rounded-2xl shadow-2xl my-profile-container'>
        <h3 className='page-title'>Simular frete</h3>
        <div className='my-profile-container-form'>
         <FormContainer />
        </div>
      </div>
    </div>
  )
}
