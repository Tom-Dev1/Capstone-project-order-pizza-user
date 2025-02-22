import TableDataModels from "@/types/tables"
import ApiResponse from "./apiUtils"
import { getTableById } from "./tables.api"



export const checkStatus = async (): Promise<ApiResponse<TableDataModels>> => {
    return getTableById("f789a7fe-1c6d-4dd3-8390-3ac823f06983")
}