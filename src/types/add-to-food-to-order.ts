export interface OrderItem {
    productId: string;
    optionItemIds: string[];
    quantity: number;
    note: string;
}
export interface AddFoodToOrderRequest {
    orderId: string;
    orderItems: OrderItem[];
}
export interface CheckoutRequest {
    orderId: string
}