import TableDataModels from "@/types/tables"
import ApiResponse from "./apiUtils"
import { getTableById } from "./tables.api"



export const checkStatus = async (): Promise<ApiResponse<TableDataModels>> => {
    return getTableById("3f4c2e1e-4271-4584-83b0-82647504ca66")
}