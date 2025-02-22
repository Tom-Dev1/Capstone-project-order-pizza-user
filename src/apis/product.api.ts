import { ProductsResult } from "@/models/product.models"
import ApiResponse, { get } from "./apiUtils"

export const getAllProductFood = async (): Promise<ApiResponse<ProductsResult>> => {
    return get<ProductsResult>(`/products`)
}