import TableDataModel from "@/models/tables.models"
import ApiResponse, { get } from "./apiUtils"



export const getAllTables = async (): Promise<ApiResponse<TableDataModel[]>> => {
    return get<TableDataModel[]>(`/tables`)
}

export const getTableById = async (id: string): Promise<ApiResponse<TableDataModel>> => {
    return get<TableDataModel>(`/tables/${id}`)
}