import type ApiResponse from "@/apis/apiUtils"
import { get, post } from "@/apis/apiUtils"
import type { AddFoodResponse, CreateOrderResponse, Order, OrderItemResutl } from "@/types/order"

class OrderService {
    private static instance: OrderService

    private constructor() { }

    public static getInstance(): OrderService {
        if (!OrderService.instance) {
            OrderService.instance = new OrderService()
        }
        return OrderService.instance
    }

    public async createOrder(tableIdJson: string): Promise<ApiResponse<CreateOrderResponse>> {
        try {
            const { tableId } = JSON.parse(tableIdJson)
            return await post<CreateOrderResponse>("/orders", { tableId })
        } catch (error) {
            console.error("Error creating new order:", error)
            throw error
        }
    }

    public async addFoodToOrder(orderDataJson: string): Promise<ApiResponse<AddFoodResponse>> {
        try {
            const orderData = JSON.parse(orderDataJson)
            const response = await post<AddFoodResponse>("/orders/add-food-to-order", orderData)
            return response
        } catch (error) {
            console.error("Error adding food to existing order:", error)
            throw error
        }
    }
    public async getOrderById(orderId: string): Promise<ApiResponse<Order>> {
        try {
            return await get<Order>(`/orders/${orderId}`)


        } catch (error) {
            console.error(`Error fetching order with id ${orderId}:`, error)
            throw error
        }
    }
    public async getOrderItemByOrderID(orderId: string): Promise<ApiResponse<OrderItemResutl>> {
        try {
            return await get<OrderItemResutl>(`/order-items?OrderId=${orderId}&IncludeProperties=OrderItemDetails`)
        } catch (error) {
            console.error(`Error fetching order with id ${orderId}:`, error)
            throw error
        }
    }
}

export default OrderService

