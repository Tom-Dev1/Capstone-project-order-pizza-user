export const ORDER_ID_STATUS_STATUS = {
    PENDING: { value: "Pending", label: "Đang nấu" },
    SERVING: { value: "Serving", label: "Đang phục vụ" },
    DONE: { value: "Done", label: "Hoàn thành" },
} as const

// Define the type for the status object
export type OrderStatusObject = (typeof ORDER_ID_STATUS_STATUS)[keyof typeof ORDER_ID_STATUS_STATUS]

// Define the type for just the value string
export type OrderStatusValue = OrderStatusObject["value"]

export function getStatusColor(status: OrderStatusObject | OrderStatusValue): string {
    const statusValue = typeof status === "object" ? status.value : status

    switch (statusValue) {
        case "Pending":
            return "bg-red-600 text-white"
        case "Serving":
            return "bg-blue-600 text-white"
        case "Done":
            return "bg-green-600 text-white"
        default:
            return "bg-gray-100 text-gray-800"
    }
}

export function getStatusLabel(status: OrderStatusObject | OrderStatusValue): string {
    if (typeof status === "object") {
        return status.label
    }

    // If it's just the value string, find the matching object
    const statusEntry = Object.values(ORDER_ID_STATUS_STATUS).find((entry) => entry.value === status)
    return statusEntry ? statusEntry.label : status
}

