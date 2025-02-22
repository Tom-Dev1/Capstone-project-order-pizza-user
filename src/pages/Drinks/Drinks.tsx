import CategoryTitle from "@/components/CategoryTitle"
import ProductCard from "@/components/ProductCard";
import useCategories from "@/hooks/useCategories";
import useProducts from "@/hooks/useProducts";
import { CategoryModel } from "@/types/category";
import { useEffect, useState } from "react";


const Drinks = () => {
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const { drinkCategory } = useCategories();
    const { products } = useProducts();

    useEffect(() => {
        if (drinkCategory) {
            setCategories(drinkCategory);
        }
    }, [drinkCategory]);

    return (
        <div className=" flex flex-col mx-auto">
            <div className=" px-4">
                {categories.map((category) => (
                    <div key={category.id} className="mb-8">
                        <CategoryTitle categories={[category]} />
                        <ProductCard products={products} categoryId={category.id} />
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Drinks