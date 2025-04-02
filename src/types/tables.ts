export default interface TableDataModels {
    id: string
    code: string
    capacity: number
    status: string
    zoneId: string
    currentOrderId: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentOrder: any | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    zone: any | null
}

export interface TableResult {
    items: TableDataModels[]
    totalCount: number
}
export interface CallStaff {
    success: boolean
    result: [] | null
    message: string
    statusCode: number
}