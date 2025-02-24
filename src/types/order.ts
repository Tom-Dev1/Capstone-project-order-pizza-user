export interface OrderItem {
    productId: string
    optionItemIds: string[] | null
    quantity: number
    note: string
}

export interface AddFoodToOrderRequest {
    orderId: string;
    orderItems: OrderItem[];
}


// Response
export interface CreateOrderResponse {
    success: boolean;
    result: OrderIdResponse;
    message: string;
    statusCode: number;
}
export interface OrderIdResponse {
    id: string;
}
export interface AddFoodResponse {
    success: boolean
    result: null
    message: string
    statusCode: number
}
