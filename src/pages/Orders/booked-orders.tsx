"use client"

import type React from "react"
import { useQuery } from "@tanstack/react-query"
import { convertToVND } from "@/utils/convertToVND"
import { getStatusLabel } from "@/utils/orderStatusColor"
import OrderService from "@/services/order-service"
import TableService from "@/services/table-service"
import { getItem } from "@/constants"
import type { OrderDetail, OrderItemDetail } from "@/types/order-detail"
import LoadingFallBack from "@/components/Layouts/LoadingFallBack"
import { Badge } from "@/src/components/ui/badge"
import { useMemo } from "react"

// Explicitly define the props interface
export interface BookedOrdersProps {
    initialData?: OrderDetail | null
}

const BookedOrders: React.FC<BookedOrdersProps> = ({ initialData = null }) => {
    // Sử dụng React Query để lấy currentOrderId từ tableId
    const tableId = getItem("tableId")

    // Query để lấy thông tin bàn và currentOrderId
    const {
        data: tableData,
        isLoading: isLoadingTable,
        error: tableError,
    } = useQuery({
        queryKey: ["table", tableId],
        queryFn: async () => {
            if (!tableId) throw new Error("Không có ID bàn")
            const tableService = TableService.getInstance()
            const tableResponse = await tableService.getTableById(`${tableId}`)
            if (!tableResponse.success) throw new Error(tableResponse.message || "Không thể tải thông tin bàn")
            return tableResponse.result
        },
        enabled: !!tableId,
        staleTime: 60000, // 1 phút
    })

    const currentOrderId = tableData?.currentOrderId || null

    // Query để lấy chi tiết đơn hàng dựa trên currentOrderId
    const {
        data: orderDetail,
        isLoading: isLoadingOrder,
        error: orderError,
    } = useQuery<OrderDetail | null, Error>({
        queryKey: ["orderDetail", currentOrderId],
        queryFn: async () => {
            if (!currentOrderId) return null
            const orderService = OrderService.getInstance()
            const response = await orderService.getOrderDetailDetailByOrderId(currentOrderId)
            if (!response.success) throw new Error(response.message || "Không thể tải thông tin đơn hàng")
            return response.result
        },
        initialData: initialData,
        enabled: !!currentOrderId,
        refetchInterval: 30000, // Polling mỗi 30 giây
        refetchOnWindowFocus: true,
        staleTime: 1000, // Dữ liệu được coi là "stale" sau 10 giây
    })

    // Cập nhật cách tính totalOrderPrice để loại bỏ các món có trạng thái "Cancelled"
    const totalOrderPrice = useMemo(() => {
        if (!orderDetail?.orderItems || orderDetail.orderItems.length === 0) return 0

        return orderDetail.orderItems.reduce((total, item) => {
            // Chỉ cộng vào tổng nếu món không bị hủy
            if (item.orderItemStatus !== "Cancelled") {
                return total + item.totalPrice
            }
            return total
        }, 0)
    }, [orderDetail?.orderItems])

    // Hàm để xác định variant của Badge dựa trên trạng thái
    const getBadgeVariant = (status: string) => {
        switch (status) {
            case "Pending":
                return "Pending" as const
            case "Serving":
                return "Serving" as const
            case "Done":
                return "Done" as const
            case "Cancelled":
                return "Cancelled" as const
            case "Cooking":
                return "Cooking" as const
            default:
                return "secondary" as const
        }
    }

    // Hiển thị trạng thái loading
    const isLoading = isLoadingTable || isLoadingOrder
    if (isLoading && (!orderDetail || !orderDetail?.orderItems || orderDetail.orderItems.length === 0))
        return <LoadingFallBack />

    // Hiển thị lỗi
    const error = tableError || orderError
    if (error) return <div className="p-4 text-center text-red-500">Lỗi: {(error as Error).message}</div>

    // Hiển thị khi không có đơn hàng
    if (!orderDetail || !orderDetail?.orderItems || orderDetail.orderItems.length === 0) {
        return <div className="p-4 text-center text-gray-500">Không có đơn hàng nào</div>
    }

    return (
        <div className="space-y-4 p-4 pb-24">
            {orderDetail.orderItems.map((item: OrderItemDetail) => (
                <div key={item.id} className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <span className="font-medium">
                            {item.name}
                            <span className="ml-2"> x{item.quantity}</span>
                        </span>
                        <span className="font-normal">{convertToVND(item.price)} VND</span>
                    </div>
                    <div className="px-4">
                        {item.orderItemDetails && item.orderItemDetails.length > 0 ? (
                            <>
                                <h3 className="text-sm font-medium">Lựa chọn:</h3>
                                <div className="pl-5 space-y-1">
                                    {item.orderItemDetails.map((detail, index) => (
                                        <div key={detail.id || index} className="text-sm flex justify-between items-center text-gray-600">
                                            <div> • {detail.name}</div>
                                            <div>
                                                {detail.additionalPrice > 0 && (
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        (+{convertToVND(detail.additionalPrice)}) VND
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">Không có lựa chọn</p>
                        )}
                        {item.note && (
                            <div className="mt-2">
                                <h3 className="text-sm font-medium">Ghi chú:</h3>
                                <p className="text-sm text-gray-600 pl-5">• {item.note}</p>
                            </div>
                        )}
                        <div className="border-t border-dashed mt-2"></div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="font-medium">Tổng tiền:</span>
                            <span className={`font-bold ${item.orderItemStatus === "Cancelled" ? "line-through text-gray-500" : ""}`}>
                                {convertToVND(item.totalPrice)} VND
                            </span>
                        </div>
                    </div>

                    <div className="p-4 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            {item.startTimeCooking && <div>Bắt đầu nấu: {new Date(item.startTimeCooking).toLocaleTimeString()}</div>}
                            {item.startTimeServing && (
                                <div>Bắt đầu phục vụ: {new Date(item.startTimeServing).toLocaleTimeString()}</div>
                            )}
                        </div>
                        <Badge variant={getBadgeVariant(item.orderItemStatus)} className="px-4 py-2 text-sm font-semibold">
                            {getStatusLabel(item.orderItemStatus)}
                        </Badge>
                    </div>

                    {item.reasonCancel && (
                        <div className="px-4 pb-3">
                            <div className="text-sm text-red-500">
                                <span className="font-medium">Lý do hủy:</span> {item.reasonCancel}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {orderDetail?.orderItems.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-lg p-4 mt-6 sticky bottom-16">
                    <div className="text-sm space-y-1 px-3 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-lg">Tạm tính:</span>
                            <span className="font-bold text-lg text-primary">{convertToVND(totalOrderPrice)} VND</span>
                        </div>
                        <div className="text-sm text-gray-500">
                            Thời gian đặt: {new Date(orderDetail.startTime).toLocaleString()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BookedOrders
