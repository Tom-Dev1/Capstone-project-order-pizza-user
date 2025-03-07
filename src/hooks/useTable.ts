import { getItem } from "@/constants"
import OrderService from "@/services/order-service"
import TableService from "@/services/table-service"
import type TableDataModels from "@/types/tables"
import { useCallback, useEffect, useState } from "react"

const useTable = () => {
    const [table, setTable] = useState<TableDataModels[]>([])
    const [tableId_gbId, setTableId_gbId] = useState<string>('')
    const [currentOrderId_, setCurrentOrderId_] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const tableId = getItem("tableId")
    const createNewOrder = useCallback(async () => {
        if (!tableId) {
            setError("No table ID provided")
            return
        }
        setLoading(true)
        setError(null)
        try {
            const tableService = TableService.getInstance()
            const tableResponse = await tableService.getTableById(`${tableId}`)

            if (tableResponse.success && tableResponse.result) {
                setTable([tableResponse.result])
                setTableId_gbId(tableResponse.result.id)
                if (tableResponse.result.currentOrderId === null) {

                    const orderService = OrderService.getInstance()
                    const orderResponse = await orderService.createOrder(JSON.stringify({ tableId: tableResponse.result.id }))

                    if (orderResponse.success && orderResponse.result) {
                        setCurrentOrderId_(orderResponse.result.result.id)
                    } else {
                        throw new Error(orderResponse.message || "Failed to create order")
                    }
                } else {
                    setCurrentOrderId_(tableResponse.result.currentOrderId)
                }
            } else {
                throw new Error(tableResponse.message || "No table data found")
            }
        } catch (err) {
            setTable([])
            setCurrentOrderId_(null)
            setError(err instanceof Error ? err.message : "An unknown error occurred")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [tableId])

    useEffect(() => {
        createNewOrder()
    }, [createNewOrder])

    return { table, loading, error, currentOrderId_, tableId_gbId }
}

export default useTable

