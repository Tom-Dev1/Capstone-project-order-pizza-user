"use client"

import { useState, useCallback, } from "react"
import type { CreateOrderResponse, AddFoodResponse, } from "@/types/order"
import type ApiResponse from "@/apis/apiUtils"
import OrderService from "@/services/order-service"

export function useOrderService() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createOrder = useCallback(async (tableIdJson: string): Promise<ApiResponse<CreateOrderResponse> | null> => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await OrderService.getInstance().createOrder(tableIdJson)
            return response
        } catch (err) {
            console.log(err);

            setError("Error creating order")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const addFoodToOrder = useCallback(async (orderDataJson: string): Promise<ApiResponse<AddFoodResponse> | null> => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await OrderService.getInstance().addFoodToOrder(orderDataJson)
            return response
        } catch (err) {
            console.log(err);

            setError("Error add Food to Order")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])
    return {


        createOrder,
        addFoodToOrder,
        isLoading,
        error,
    }
}

