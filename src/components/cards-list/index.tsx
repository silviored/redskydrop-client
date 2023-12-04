import { CardProduct } from "../card-product";

type CardsListProps = {
    title: string;
    products: any,
}

export default function CardsList({ title, products }: CardsListProps) {
    return (
        <section className="">
            <div className="bg-white border-b-2 border-red-650 p-4 sticky xl:top-[170px] lg:top-[170px] md:top-[170px] sm:top-[140px] xs:top-[140px] z-40">
                <h3 className='text-red-650 text-center text-xl uppercase'>{title}</h3>
            </div>
            <div className="grid gap-4 xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-5 sm:grid-cols-2 xs:grid-cols-2 pt-4">
                {products?.map((product: any, index: any) => (
                    <CardProduct
                        key={index}
                        id={product.id}
                        cover_image_url={product.fotos?.[0]}
                        price={product.preco}
                        title={product.nome}
                        stock={product.estoque}
                        showStock={true}
                        viewType="minimal"
                    />
                ))}

                {/*    <ProductCard
                    discount={13}
                    freeShipping={true}
                    indicated={true}
                    productTitle="Alicate Amperímetro para medição de energia"
                    sales={62}
                    price="19,90"
                />

                <ProductCard
                    discount={30}
                    freeShipping={false}
                    indicated={true}
                    productTitle="Título do produto de demonstração 02"
                    sales={100}
                    price="69,90"
                />

                <ProductCard
                    discount={0}
                    freeShipping={true}
                    indicated={true}
                    productTitle="Título do produto de demonstração 03"
                    sales={620}
                    price="19,90"
                />

                <ProductCard
                    discount={20}
                    freeShipping={true}
                    indicated={false}
                    productTitle="Título do produto de demonstração 04"
                    sales={14}
                    price="19,90"
                />

                <ProductCard
                    discount={20}
                    freeShipping={true}
                    indicated={false}
                    productTitle="Título do produto de demonstração 04"
                    sales={14}
                    price="19,90"
                /> */}
            </div >
        </section>
    )
}