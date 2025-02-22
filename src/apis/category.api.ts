import { CategoriesResult } from "@/types/category";
import ApiResponse, { get } from "./apiUtils";

export const getAllCategory = async (): Promise<ApiResponse<CategoriesResult>> => {
    return get<CategoriesResult>(`/categories`)
}

export const getCategoryById = async (id: string): Promise<ApiResponse<CategoriesResult>> => {
    return get<CategoriesResult>(`/?CategoryId=${id}`)
}