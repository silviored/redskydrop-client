'use client';

import { ApiService } from '@/services';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './styles.css';
import { CardProduct } from '@/components/card-product';


export default function Home() {
    const [productsDestaque, setProductsDestaque] = useState<ProductResponseApi[]>([])
    const [productsMaisVendidos, setProductsMaisVendidos] = useState<ProductResponseApi[]>([])

    const handleLoadProducts = useCallback(async (data?: { reset?: boolean }) => {

        try {
            const responseProducts = await ApiService.Product.getAllHome({});
            setProductsDestaque(oldData => (data?.reset ? [...responseProducts?.destaques?.data] : [...oldData, ...responseProducts?.destaques?.data]))
            setProductsMaisVendidos(oldData => (data?.reset ? [...responseProducts?.maisVendidos?.data] : [...oldData, ...responseProducts?.maisVendidos?.data]))
        } catch (error: any) {
            toast.error(error.message)
        }
    }, [])

    useEffect(() => {
        async function loadData() {
            await handleLoadProducts()
        }
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className='bg-gradient-black-white container-fluid '>
            <header className='text-white'>
                <nav>
                    <div className="logo bg-white">
                        <img src="./assets/img/logos/logo.png" alt="" />
                    </div>
                    <div>
                        <p>Seja Bem vindo</p>
                    </div>
                    <div>
                        <div className="search-bar">
                            <input type="text" placeholder="Digite o produto que deseja" />
                            <button type="submit">Pesquisar</button>
                        </div>
                    </div>
                </nav>
            </header>
            <div className="container">
                <section >
                    <h5 className='text-white'>Em destaque</h5>
                    <div className="container-cart-wrapper flex">
                        <div className='container-card-products'>
                            {productsDestaque?.map((product, index) => (
                                <CardProduct
                                    key={index}
                                    id={product.id}
                                    cover_image_url={product.fotos?.[0]}
                                    price={product.preco}
                                    title={product.nome}
                                    stock={product.estoque}
                                    showStock={true}
                                />
                            ))}
                        </div>
                    </div >
                </section>
                <section className='pt-4'>
                    <h5>Mais vendidos</h5>
                    <div className="container-cart-wrapper flex">
                        <div className='container-card-products'>
                            {productsMaisVendidos?.map((product, index) => (
                                <CardProduct
                                    key={index}
                                    id={product.id}
                                    cover_image_url={product.fotos?.[0]}
                                    price={product.preco}
                                    title={product.nome}
                                    stock={product.estoque}
                                    showStock={true}
                                />
                            ))}
                        </div>
                    </div >
                </section>
            </div>

        </div>
    )
}