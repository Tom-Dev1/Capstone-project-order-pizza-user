import ApiResponse, { get, } from "@/apis/apiUtils"
import TableDataModels, { CallStaff, TableResult } from "@/types/tables"

class TableService {
    private static instance: TableService
    private constructor() { }
    public static getInstance(): TableService {
        if (!TableService.instance) {
            TableService.instance = new TableService()
        }
        return TableService.instance
    }


    public async getAllTables(): Promise<ApiResponse<TableResult>> {
        try {
            return await get<TableResult>(`/tables`)
        } catch (error) {
            console.error("Error fetching all tables:", error)
            throw error
        }
    }
    public async getTableById(id: string): Promise<ApiResponse<TableDataModels>> {
        try {
            return await get<TableDataModels>(`/tables/${id}`)
        } catch (error) {
            console.error(`Error fetching table with id ${id}:`, error)
            throw error
        }
    }

    public async checkStatusTable(id: string): Promise<ApiResponse<TableDataModels>> {
        try {
            return await get<TableDataModels>(`/tables/${id}`)
        } catch (error) {
            console.error(`Error fetching table with status ${id}:`, error)
            throw error
        }
    }
    public async callStaff(id: string): Promise<CallStaff> {
        const url = `https://vietsac.id.vn/api/Notification/callstaff/${id}`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }

            const data: CallStaff = await response.json();
            return data;
        } catch (error) {
            console.error("Có lỗi xảy ra khi gọi API callStaff:", error);
            throw error;
        }
    }

}

export default TableService