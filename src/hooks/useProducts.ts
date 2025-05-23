import { useState, useEffect, useCallback } from "react"
import type { ProductModel } from "@/types/product"
import ProductService from "@/services/product-service"

const useProducts = () => {
    const [products, setProducts] = useState<ProductModel[]>([])

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAllProducts = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const productService = ProductService.getInstance()
            const response = await productService.getAllProducts()
            if (response.success && response.result.items) {
                console.log(response.result);
                const productsData = Array.isArray(response.result.items) ? response.result.items : [response.result.items]
                const masterProducts = productsData.filter(
                    (product) => product.productRole === 'Master' || product.productRole === 'Combo' && product.productStatus !== 'Locked',
                )
                setProducts(masterProducts)
            } else {
                setProducts([])
            }
        } catch (err) {
            setError("Failed to fetch products")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAllProducts()
    }, [fetchAllProducts])


    return { products, loading, error }
}

export default useProducts

