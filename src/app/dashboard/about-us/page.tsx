"use client"
import "./styles.css"

export default function Integrations() {

  return (
    <div className="bg-white rounded-2xl shadow-2xl page">
      <div className="about-us-container ">
        <div className="flex">
          <img src="https://electrofundacao.pt/novo/assets/icons/location.svg" alt="Endereço" />
          <div className="px-5">
            <a href="#">
              <h3>Nosso Endereço</h3>
              <p>Rua Carnot 341, 7 andar sala 702, Canindé, São Paulo SP, 03032-030</p>
            </a>
          </div>
        </div>
        <div className="flex">
          <img src="https://electrofundacao.pt/novo/assets/icons/mail.svg" alt="Contato" />
          <div className="px-5">
            <h3>Contato</h3>
            <a href="mailto:redsky.eletronicos8888@gmail.com">redsky.eletronicos8888@gmail.com</a>
          </div>
        </div>
        <div className="flex">
          <img src="https://electrofundacao.pt/novo/assets/icons/phone.svg" alt="Telefone" />
          <div className="px-5">
            <h3>Telefone</h3>
            <a href="tel:11985552526">+55 11 98555-2526</a>
          </div>
        </div>
      </div>
    </div>
  )
}
