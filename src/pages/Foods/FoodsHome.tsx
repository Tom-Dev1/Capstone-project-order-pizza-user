import CategoryTitle from "@/components/CategoryTitle"
import ProductCard from "@/components/ProductCard"
import useCategories from "@/hooks/useCategories"
import useProducts from "@/hooks/useProducts"
import React, { useMemo } from "react"

const FoodsHome: React.FC = () => {
    const { foodCategory } = useCategories()
    const { products } = useProducts()

    const categoriesWithProducts = useMemo(() => {
        return foodCategory.map((category) => ({
            ...category,
            products: products.filter((product) => product.categoryId === category.id),
        }))
    }, [foodCategory, products])

    if (foodCategory.length === 0) {
        return <div className="text-center mt-8">No food categories found.</div>
    }

    return (
        <div className="flex flex-col mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-slate-100">
            {categoriesWithProducts.map((category) => (
                <div key={category.id} className="mb-12">
                    <CategoryTitle categories={[category]} />
                    <ProductCard products={category.products} categoryId={category.id} />
                </div>
            ))}
        </div>
    )
}

export default React.memo(FoodsHome)

