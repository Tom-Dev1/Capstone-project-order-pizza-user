import TableDataModels from "@/models/tables.models"
import ApiResponse from "./apiUtils"
import { getTableById } from "./tables.api"



export const checkStatus = async (): Promise<ApiResponse<TableDataModels>> => {
    return getTableById("e0f203ee-082d-4bd1-aa53-d3dab4e2e5e9")
}