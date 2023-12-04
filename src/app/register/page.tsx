'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import formatCnpj from '@/utils/formatCNPJ';
import formatCpf from '@/utils/formatCPF';
import formatDate from '@/utils/formatDate';
import formatPhone from '@/utils/formatPhone';
import formatZipCode from '@/utils/formatZipCode';

interface FormDataTypes {
    name: string;
    document: string;
    storeDocument: string;
    secondStoreDocument: string;
    birth: Date;
    storeCreationDate: Date;
    secondStoreCreationDate: Date;
    email: string;
    phoneNumber: number;
    storeName: string;
    secondStoreName: string;
    password: string;
    zipCode: string;
    secondZipCode: string;
    state: string;
    secondState: string;
    city: string;
    secondCity: string;
    district: string;
    secondDistrict: string;
    street: string;
    secondStreet: string;
    addressNumber: number;
    secondAddressNumber: number;
}

export default function App() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [createDate, setCreateDate] = useState('');
    const [cpfField, setCpfField] = useState('');
    const [cnpjField, setCnpjField] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [isPasswordHidden, setPasswordHidden] = useState(true);
    const [showSecondStore, setShowSecondStore] = useState(false);

    const inputProps = "w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"

    const { register, handleSubmit, formState: { errors } } = useForm<FormDataTypes>();

    const onSubmit = (data: FormDataTypes) => console.log(data);

    function handleFormatPhone(e: React.ChangeEvent<HTMLInputElement>) {
        setPhoneNumber(formatPhone(e.target.value));
    }

    function handleFormatBirthDate(e: React.ChangeEvent<HTMLInputElement>) {
        setBirthDate(formatDate(e.target.value));
    }

    function handleFormatCreateDate(e: React.ChangeEvent<HTMLInputElement>) {
        setCreateDate(formatDate(e.target.value));
    }

    function handleFormatCpf(e: React.ChangeEvent<HTMLInputElement>) {
        setCpfField(formatCpf(e.target.value));
    }

    function handleFormatCnpj(e: React.ChangeEvent<HTMLInputElement>) {
        setCnpjField(formatCnpj(e.target.value));
    }

    function handleFormatZipCode(e: React.ChangeEvent<HTMLInputElement>) {
        setZipCode(formatZipCode(e.target.value));
    }

    function handleShowStoreField() {
        setShowSecondStore(true)
    }

    return (
        <div className='xl:mx-24 lg:mx-24 md:mx-24 sm:mx-2 xs:mx-2 bg-white pb-12'>
            <h1 className='text-center text-2xl font-semibold text-gray-700 py-8'>
                Cadaste-se como lojista
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className='px-6 grid grid-cols-3 gap-4'>
                <div className='xl:col-span-2 lg:col-span-2 md:col-span-2 sm:col-span-3 xs:col-span-3'>
                    <label
                        htmlFor="name"
                        className='mb-2 text-gray-700'
                    >
                        Nome completo
                    </label>
                    <input
                        type="text"
                        placeholder="Insira seu nome"
                        {...register("name", { required: true })}
                        className={inputProps}
                    />
                </div>
                <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                    <label
                        htmlFor="document"
                        className='mb-2 text-gray-700'
                    >
                        CPF
                    </label>
                    <input
                        type="text"
                        placeholder="Insira seu CPF"
                        {...register("document", { required: true, pattern: /^([0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2})|([0-9]{14})$/i })}
                        className={inputProps}
                        value={cpfField}
                        onChange={(e) => handleFormatCpf(e)}
                        maxLength={14}
                    />
                </div>
                <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                    <label
                        htmlFor="birth"
                        className='mb-2 text-gray-700'
                    >
                        Data de nascimento
                    </label>
                    <input
                        type="datetime"
                        placeholder="DD/MM/AAAA"
                        {...register("birth", { required: true, minLength: 10, maxLength: 10 })}
                        value={birthDate}
                        onChange={(e) => handleFormatBirthDate(e)}
                        maxLength={10}
                        className={inputProps}
                    />
                </div>
                <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                    <label
                        htmlFor="email"
                        className='mb-2 text-gray-700'
                    >
                        E-mail
                    </label>
                    <input
                        type="text"
                        placeholder="Insira seu e-mail"
                        {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                        className={inputProps}
                    />
                </div>
                <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                    <label
                        htmlFor="phoneNumber"
                        className='mb-2 text-gray-700'
                    >
                        Telefone
                    </label>
                    <input
                        type="tel"
                        placeholder="Insira seu telefone"
                        {...register("phoneNumber", { required: true, minLength: 6, maxLength: 15 })}
                        value={phoneNumber}
                        onChange={(e) => handleFormatPhone(e)}
                        maxLength={15}
                        className={inputProps}
                    />
                </div>
                <hr className='col-span-3 h-1 my-4 bg-gray-300' />
                <h3 className='col-span-3 text-gray-700 text-xl mb-5 font-semibold text-center'>Dados da Loja</h3>
                <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                    <label
                        htmlFor="storeName"
                        className='mb-2 text-gray-700'
                    >
                        Nome da loja
                    </label>
                    <input
                        type="text"
                        placeholder="Insira o nome da loja"
                        {...register("storeName")}
                        className={inputProps}
                    />
                </div>
                <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                    <label
                        htmlFor="birth"
                        className='mb-2 text-gray-700'
                    >
                        Data de abertura da empresa
                    </label>
                    <input
                        type="datetime"
                        placeholder="DD/MM/AAAA"
                        {...register("storeCreationDate", { required: true, minLength: 10, maxLength: 10 })}
                        value={createDate}
                        onChange={(e) => handleFormatCreateDate(e)}
                        maxLength={10}
                        className={inputProps}
                    />
                </div>
                <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                    <label
                        htmlFor="storeDocument"
                        className='mb-2 text-gray-700'
                    >
                        CNPJ
                    </label>
                    <input
                        type="text"
                        placeholder="Insira o CNPJ da empresa"
                        {...register("storeDocument", { required: true, pattern: /^([0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2})|([0-9]{14})$/i })}
                        className={inputProps}
                        value={cnpjField}
                        onChange={(e) => handleFormatCnpj(e)}
                        maxLength={18}
                    />
                </div>
                <div className='xl:col-span-2 lg:col-span-2 md:col-span-2 sm:col-span-3 xs:col-span-3'>
                    <label
                        htmlFor="street"
                        className='mb-2 text-gray-700'
                    >
                        Endereço
                    </label>
                    <input
                        type="text"
                        placeholder="Insira o nome da Rua/Avenida"
                        {...register("street")}
                        className={inputProps}
                    />
                </div>
                <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                    <label
                        htmlFor="addressNumber"
                        className='mb-2 text-gray-700'
                    >
                        Número
                    </label>
                    <input
                        type="number"
                        placeholder="Inisra o número"
                        {...register("addressNumber")}
                        className={inputProps}
                    />
                </div>
                <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                    <label
                        htmlFor="neighborhiid"
                        className='mb-2 text-gray-700'
                    >
                        Bairro
                    </label>
                    <input
                        type="text"
                        placeholder="Insira o bairro"
                        {...register("district")}
                        className={inputProps}
                    />
                </div>
                <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                    <label
                        htmlFor="city"
                        className='mb-2 text-gray-700'
                    >
                        Cidade
                    </label>
                    <input
                        type="text"
                        placeholder="Insira a cidade"
                        {...register("city")}
                        className={inputProps}
                    />
                </div>
                <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                    <label
                        htmlFor="state"
                        className='mb-2 text-gray-700'
                    >
                        Estado
                    </label>
                    <select
                        {...register("state")}
                        className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    >
                        <option value="">Escolha seu estado</option>
                        <option value="SP">São Paulo</option>
                    </select>
                </div>
                <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                    <label
                        htmlFor="zipCode"
                        className='mb-2 text-gray-700'
                    >
                        CEP
                    </label>
                    <input
                        type="text"
                        placeholder="Insira o CEP"
                        {...register("zipCode")}
                        className={inputProps}
                        value={zipCode}
                        onChange={(e) => handleFormatZipCode(e)}
                        maxLength={8}
                    />
                </div>
                <button
                    type='button'
                    className='flex justify-center items-center mt-8 py-2 bg-red-650 text-white rounded font-semibold hover:opacity-75 transition-all duration-300 xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-2 xs:col-span-2'
                    onClick={handleShowStoreField}
                >
                    Adicionar loja
                </button>

                {showSecondStore &&
                    <div className='col-span-3 grid grid-cols-3 gap-4'>
                        <hr className='col-span-3 h-1 my-4 bg-gray-300' />
                        <h3 className='col-span-3 text-gray-700 text-xl mb-5 font-semibold text-center'>Dados da Loja 02</h3>
                        <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                            <label
                                htmlFor="storeName"
                                className='mb-2 text-gray-700'
                            >
                                Nome da loja
                            </label>
                            <input
                                type="text"
                                placeholder="Insira o nome da loja"
                                {...register("secondStoreName")}
                                className={inputProps}
                            />
                        </div>
                        <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                            <label
                                htmlFor="birth"
                                className='mb-2 text-gray-700'
                            >
                                Data de abertura da empresa
                            </label>
                            <input
                                type="datetime"
                                placeholder="DD/MM/AAAA"
                                {...register("secondStoreCreationDate", { required: true, minLength: 10, maxLength: 10 })}
                                value={createDate}
                                onChange={(e) => handleFormatCreateDate(e)}
                                maxLength={10}
                                className={inputProps}
                            />
                        </div>
                        <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                            <label
                                htmlFor="storeDocument"
                                className='mb-2 text-gray-700'
                            >
                                CNPJ
                            </label>
                            <input
                                type="text"
                                placeholder="Insira o CNPJ da empresa"
                                {...register("secondStoreDocument", { required: true, pattern: /^([0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2})|([0-9]{14})$/i })}
                                className={inputProps}
                                value={cnpjField}
                                onChange={(e) => handleFormatCnpj(e)}
                                maxLength={18}
                            />
                        </div>
                        <div className='xl:col-span-2 lg:col-span-2 md:col-span-2 sm:col-span-3 xs:col-span-3'>
                            <label
                                htmlFor="street"
                                className='mb-2 text-gray-700'
                            >
                                Endereço
                            </label>
                            <input
                                type="text"
                                placeholder="Insira o nome da Rua/Avenida"
                                {...register("secondStreet")}
                                className={inputProps}
                            />
                        </div>
                        <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                            <label
                                htmlFor="addressNumber"
                                className='mb-2 text-gray-700'
                            >
                                Número
                            </label>
                            <input
                                type="number"
                                placeholder="Inisra o número"
                                {...register("secondAddressNumber")}
                                className={inputProps}
                            />
                        </div>
                        <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                            <label
                                htmlFor="neighborhiid"
                                className='mb-2 text-gray-700'
                            >
                                Bairro
                            </label>
                            <input
                                type="text"
                                placeholder="Insira o bairro"
                                {...register("secondDistrict")}
                                className={inputProps}
                            />
                        </div>
                        <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                            <label
                                htmlFor="city"
                                className='mb-2 text-gray-700'
                            >
                                Cidade
                            </label>
                            <input
                                type="text"
                                placeholder="Insira a cidade"
                                {...register("secondCity")}
                                className={inputProps}
                            />
                        </div>
                        <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                            <label
                                htmlFor="state"
                                className='mb-2 text-gray-700'
                            >
                                Estado
                            </label>
                            <select
                                {...register("secondState")}
                                className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                            >
                                <option value="">Escolha seu estado</option>
                                <option value="SP">São Paulo</option>
                            </select>
                        </div>
                        <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-3 xs:col-span-3'>
                            <label
                                htmlFor="zipCode"
                                className='mb-2 text-gray-700'
                            >
                                CEP
                            </label>
                            <input
                                type="text"
                                placeholder="Insira o CEP"
                                {...register("secondZipCode")}
                                className={inputProps}
                                value={zipCode}
                                onChange={(e) => handleFormatZipCode(e)}
                                maxLength={8}
                            />
                        </div>
                    </div>
                }
                <hr className='col-span-3 h-1 my-4 bg-gray-300' />
                <div className='xl:col-span-1 lg:col-span-1 md:col-span-1 sm:col-span-2 xs:col-span-2'>
                    <label
                        htmlFor="password"
                        className='mb-2 text-gray-700'
                    >
                        Senha
                    </label>
                    <div className="relative max-w-xs">
                        <button className="text-gray-400 absolute right-0 mr-2 inset-y-0 my-auto active:text-gray-600"
                            onClick={() => setPasswordHidden(!isPasswordHidden)}
                        >
                            {
                                isPasswordHidden ? (
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>

                                )
                            }
                        </button>
                        <input
                            type={isPasswordHidden ? "password" : "text"}
                            placeholder="Insira sua senha"
                            {...register("password")}
                            className={inputProps}
                        />
                    </div>
                </div>
                <button
                    type='submit'
                    className='flex justify-center items-center mt-8 bg-red-650 text-white rounded font-semibold hover:opacity-75 transition-all duration-300'
                >
                    Cadastrar
                </button>
            </form>
        </div>
    );
};
