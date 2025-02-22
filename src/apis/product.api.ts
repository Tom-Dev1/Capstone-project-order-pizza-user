import { ProductsResult } from "@/types/product"
import ApiResponse, { get } from "./apiUtils"

export const getAllProductFood = async (): Promise<ApiResponse<ProductsResult>> => {
    return get<ProductsResult>(`/products`)
}