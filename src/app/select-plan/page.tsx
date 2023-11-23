import { Plans } from '@/components/plans';
import './styles.css';

export default function SelectPlan() {
  return (
    <div className='container-select-plan'>
      <div className='container-logo flex items-center justify-center'>
      <div className='bg-white rounded-2xl shadow-2xl container-logo flex items-center justify-center'>
            {/* <Image src="https://primodrop.com.br/assets/img/brand/logo.png?v=2" width={300} height={90} alt='Logo Red Sky Drop' /> */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/img/logos/logo.png" alt="" width={250} style={{ margin: '0 auto' }} />
          </div>
        
      </div>
      <Plans />
    </div>
  );
}
