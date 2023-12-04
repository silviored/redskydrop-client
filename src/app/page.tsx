'use client';

import { Header } from '@/components/header';
import './styles.css';

import CardsList from '@/components/cards-list';

import { ApiService } from '@/services';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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
        <>
            <Header />
            <div className='mb-6 pt-body'>
                <div className="xl:px-24 lg:px-24 md:px-24 sm:px-2 xs:px-2">
                    <CardsList
                        products={productsDestaque}
                        title="Produtos Destaques"
                    />
                    <CardsList
                        products={productsMaisVendidos}
                        title="Produtos mais vendidos"
                    />
                </div>
            </div>
        </>
    )
}