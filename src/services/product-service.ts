import ApiResponse, { get } from "@/apis/apiUtils"
import type { ProductsResult, ProductModels } from "@/types/product"

class ProductService {
    private static instance: ProductService

    private constructor() { }

    public static getInstance(): ProductService {
        if (!ProductService.instance) {
            ProductService.instance = new ProductService()
        }
        return ProductService.instance
    }

    public async getAllProductFood(): Promise<ApiResponse<ProductsResult>> {
        try {
            return await get<ProductsResult>(`/products`)
        } catch (error) {
            console.error("Error fetching all food products:", error)
            throw error
        }
    }

    public async getProductById(id: string): Promise<ApiResponse<ProductModels>> {
        try {
            return await get<ProductModels>(`/products/${id}`)
        } catch (error) {
            console.error(`Error fetching product with id ${id}:`, error)
            throw error
        }
    }


    public async getProductsByCategory(categoryId: string): Promise<ApiResponse<ProductsResult>> {
        try {
            return await get<ProductsResult>(`/products?categoryId=${categoryId}`)
        } catch (error) {
            console.error(`Error fetching products for category ${categoryId}:`, error)
            throw error
        }
    }
}

export default ProductService

