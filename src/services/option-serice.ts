import type ApiResponse from "@/apis/apiUtils"
import { get } from "@/apis/apiUtils"
import type ProductOptionModels from "@/types/product-option"

class OptionService {
    private static instance: OptionService

    private constructor() { }

    public static getInstance(): OptionService {
        if (!OptionService.instance) {
            OptionService.instance = new OptionService()
        }
        return OptionService.instance
    }

    public async getAllOptions(): Promise<ApiResponse<ProductOptionModels[]>> {
        try {
            return await get<ProductOptionModels[]>(`/options`)
        } catch (error) {
            console.error("Error fetching all options:", error)
            throw error
        }
    }

    public async getOptionById(id: string): Promise<ApiResponse<ProductOptionModels>> {
        try {
            return await get<ProductOptionModels>(`/options/${id}`)
        } catch (error) {
            console.error(`Error fetching option with id ${id}:`, error)
            throw error
        }
    }

    public async getOptionsByProduct(productId: string): Promise<ApiResponse<ProductOptionModels[]>> {
        try {
            return await get<ProductOptionModels[]>(`/options?productId=${productId}`)
        } catch (error) {
            console.error(`Error fetching options for product ${productId}:`, error)
            throw error
        }
    }
}

export default OptionService

