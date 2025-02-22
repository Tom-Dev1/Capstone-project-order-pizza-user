import { CategoriesResult } from "@/models/category.models";
import ApiResponse, { get } from "./apiUtils";

export const getAllCategory = async (): Promise<ApiResponse<CategoriesResult>> => {
    return get<CategoriesResult>(`/categories`)
}

