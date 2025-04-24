import ApiResponse, { get } from "@/apis/apiUtils"
import { ProductModel, ProductsResult } from "@/types/product"

class ProductService {
    private static instance: ProductService

    private constructor() { }

    public static getInstance(): ProductService {
        if (!ProductService.instance) {
            ProductService.instance = new ProductService()
        }
        return ProductService.instance
    }

    public async getProductById(id: string): Promise<ApiResponse<ProductModel>> {
        try {
            return await get<ProductModel>(`products/${id}?includeProperties=Category%2CProductOptions.Option.OptionItems%2CProductComboSlots%2CRecipes.Ingredient%2CProductComboSlots.ProductComboSlotItems.Product%2CChildProducts`)
        } catch (error) {
            console.error(`Error fetching product with id ${id}:`, error)
            throw error
        }
    }
    public async getProductsByCategory(categoryId: string): Promise<ApiResponse<ProductsResult>> {
        try {
            return await get<ProductsResult>(`/products?TakeCount=1000&categoryId=${categoryId}`)
        } catch (error) {
            console.error(`Error fetching products for category ${categoryId}:`, error)
            throw error
        }
    }
    public async getAllProducts(): Promise<ApiResponse<ProductsResult>> {
        try {
            return await get<ProductsResult>(
                `/products?TakeCount=1000`,
            )
        } catch (error) {
            console.error("Error fetching all products:", error)
            throw error
        }
    }
}

export default ProductService

