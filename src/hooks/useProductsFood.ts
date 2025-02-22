import { getAllProductFood } from "@/apis/product.api";
import { ProductModels } from "@/models/product.models";
import { useEffect, useState } from "react";

const useProducts = () => {
    const [products, setProducts] = useState<ProductModels[]>([]);

    useEffect(() => {
        const fetchAllProductsFood = async () => {
            try {
                const response = await getAllProductFood();
                setProducts(response.result.items);
            } catch (err) {
                console.error(err);

            }
        }
        fetchAllProductsFood();
    }, []);

    return { products };
};

export default useProducts;