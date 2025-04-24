export interface OrderDetail {
    id: string
    orderCode: string | null
    tableCode: string
    startTime: string
    endTime: string | null
    totalPrice: number
    totalOrderItemPrice: number
    totalAdditionalFeePrice: number
    status: 'Paid' | 'Unpaid' | 'CheckedOut'
    type: 'Order' | 'Workshop'
    phone: string | null
    tableId: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    table: any
    additionalFees: AdditionalFee[]
    orderItems: OrderItemDetail[]
    orderVouchers: OrderVoucher[]
}
export interface AdditionalFee {
    id: string
    name: string
    description: string
    value: number
    orderId: string
}

export interface OrderItemDetail {
    id: string
    name: string
    note: string
    quantity: number
    price: number
    totalPrice: number
    startTime: string
    endTime: string | null
    orderItemStatus: 'Cancelled' | 'Cooking' | 'Done' | 'Serving' | 'Pending'
    type: "Order" | "Workshop"
    productType: 'ColdKitchen' | 'HotKitChen'
    orderItemDetails: OrderItemOption[]
    startTimeCooking: string | null
    startTimeServing: string | null
    isProductCombo: boolean
    reasonCancel: string | null
    parentId: string | null
}

export interface OrderItemOption {
    id: string
    name: string
    additionalPrice: number
    orderItemId: string
}

export interface OrderVoucher {
    id: string
    orderId: string
    voucherId: string
    voucher: Voucher
}
export interface Voucher {
    id: string
    code: string
    discountType: "Percentage" | "Direct"
    discountValue: number
    voucherStatus: 'Available' | 'Used' | 'PendingPayment' | 'PendingPayment'
    voucherBatchId: string
    expiryDate?: string
}