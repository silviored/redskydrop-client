import { WhatsAppColored } from '@/assets/img/icons/WhatsAppColored';
import './styles.css';
export function Whatsapp() {
  return (
    <div
      className='container-button-whatsapp'
      onClick={() => {
        window.open(
          `https://api.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_COMPANY_WHATSAPP}`,
          '_blank'
        );
      }}
    >
      <WhatsAppColored height={52} width={52} />
    </div>
  );
}
