import type React from "react"
import { useQuery } from "@tanstack/react-query"
import { convertToVND } from "@/utils/convertToVND"
import OrderService from "@/services/order-service"
import TableService from "@/services/table-service"
import { getItem } from "@/constants"
import type { OrderDetail, OrderItemDetail } from "@/types/order-detail"
import LoadingFallBack from "@/components/Layouts/LoadingFallBack"
import { Badge } from "@/src/components/ui/badge"
import { useMemo } from "react"
import { Package } from "lucide-react"
import { getOrderItemStatusBadge } from "@/utils/orderItemStatusBadge"

// Định nghĩa interface cho món ăn có cấu trúc phân cấp
interface HierarchicalOrderItem extends OrderItemDetail {
    childItems?: OrderItemDetail[]
}

// Cập nhật interface để thêm prop đếm orderItem
export interface BookedOrdersProps {
    initialData?: OrderDetail | null
    onOrderItemCount?: (count: number) => void
}

const BookedOrders: React.FC<BookedOrdersProps> = ({ initialData = null, onOrderItemCount }) => {
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

    // Tạo cấu trúc phân cấp cho các món ăn (món cha - món con)
    const hierarchicalOrderItems = useMemo(() => {
        if (!orderDetail?.orderItems) return []

        // Tạo map để lưu trữ món cha và danh sách món con
        const parentMap = new Map<string, HierarchicalOrderItem>()
        const topLevelItems: HierarchicalOrderItem[] = []

        // Đầu tiên, xác định tất cả các món cha
        orderDetail.orderItems.forEach((item) => {
            if (!item.parentId && (item.isProductCombo || !item.isProductCombo)) {
                const hierarchicalItem: HierarchicalOrderItem = {
                    ...item,
                    childItems: [],
                }
                parentMap.set(item.id, hierarchicalItem)
                topLevelItems.push(hierarchicalItem)
            }
        })

        // Sau đó, thêm các món con vào món cha tương ứng
        orderDetail.orderItems.forEach((item) => {
            if (item.parentId) {
                const parent = parentMap.get(item.parentId)
                if (parent) {
                    if (!parent.childItems) {
                        parent.childItems = []
                    }
                    parent.childItems.push(item)
                }
            }
        })

        return topLevelItems
    }, [orderDetail?.orderItems])

    // Đếm số lượng orderItem và gọi callback nếu có
    const orderItemCount = useMemo(() => {
        const count = orderDetail?.orderItems?.length || 0

        // Gọi callback để truyền số lượng orderItem ra ngoài component
        if (onOrderItemCount && count > 0) {
            onOrderItemCount(count)
        }

        return count
    }, [orderDetail?.orderItems, onOrderItemCount])

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

    // Component để hiển thị một món ăn
    const renderOrderItem = (item: OrderItemDetail, isChild = false) => (
        <div
            key={item.id}
            className={`bg-white border border-gray-100 rounded-lg overflow-hidden ${isChild ? "ml-4 mt-2 border-l-4 border-l-orange-200" : ""
                } ${item.isProductCombo && !item.parentId ? "border-orange-300 border-2" : ""}`}
        >
            <div className="p-4 pb-2 flex justify-between ">


                <div className="font-medium"> {item.name} {isChild ? "" : (<span>x{item.quantity}</span>)}</div>

                <div className="font-normal w-28 text-right items-start h-auto">{convertToVND(item.price)}đ</div>

            </div>
            <div className="px-4">
                {/* Chỉ hiển thị phần lựa chọn nếu có orderItemDetails và không phải là combo hoặc con của combo */}
                {item.orderItemDetails && item.orderItemDetails.length > 0 ? (
                    <>
                        <h3 className="text-sm font-medium">Lựa chọn:</h3>
                        <div className="pl-5 space-y-1">
                            {item.orderItemDetails.map((detail, index) => (
                                <div key={detail.id || index} className="text-sm flex justify-between items-center text-gray-600">
                                    <div> • {detail.name}</div>
                                    <div>
                                        {detail.additionalPrice > 0 && (
                                            <span className="ml-2 text-sm text-gray-600">(+{convertToVND(detail.additionalPrice)})đ</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    // Không hiển thị "Không có lựa chọn" cho combo hoặc con của combo
                    !item.isProductCombo && !item.parentId && <p className="text-sm text-gray-500">Không có lựa chọn</p>
                )}
                {item.note && !item.parentId && (
                    <div className="mt-2">
                        <h3 className="text-sm font-medium">Ghi chú:</h3>
                        <p className="text-sm text-gray-600 pl-5">• {item.note}</p>
                    </div>
                )}
                <div className="border-t border-dashed mt-2"></div>
                <div className="flex justify-between items-center mt-1">
                    {isChild ? (
                        <>
                        </>
                    ) : (<>

                        <span className="font-medium">Tổng tiền:</span>
                        <span className={`font-bold ${item.orderItemStatus === "Cancelled" ? "line-through text-gray-500" : ""}`}>
                            {convertToVND(item.totalPrice)}đ
                        </span></>)}

                </div>
            </div>

            <div className={`p-4 flex items-center ${item.isProductCombo && !item.parentId || item.reasonCancel || isChild ? "justify-between" : "justify-end"}`}>

                {item.isProductCombo && !item.parentId && (
                    <div className="flex items-center mr-2 bg-orange-100 text-orange-600 px-2 py-1 rounded-md">
                        <Package size={16} className="mr-1" />
                        <span className="text-xs font-medium">Combo</span>
                    </div>
                )}
                {item.reasonCancel && (
                    <div className="">
                        <div className="text-sm text-red-500">
                            <span className="font-medium">Lý do hủy:</span> {item.reasonCancel}
                        </div>
                    </div>
                )}
                {isChild && <div className="text-base font-bold text-orange-500">+ Món thêm</div>}

                {getOrderItemStatusBadge(item.orderItemStatus)}

            </div>


        </div>
    )

    return (
        <div className="space-y-4 px-2 pb-24">
            {/* Hiển thị số lượng món */}
            <div className="bg-white border border-gray-100 rounded-lg p-3">
                <div className="flex justify-between items-center">
                    <h2 className="font-medium text-lg">Danh sách món đã đặt</h2>
                    <Badge variant="secondary" className="px-3 py-1">
                        {orderItemCount} món
                    </Badge>
                </div>
            </div>

            {/* Hiển thị các món ăn theo cấu trúc phân cấp */}
            {hierarchicalOrderItems.map((parentItem) => (
                <div key={parentItem.id} className="space-y-2">
                    {/* Hiển thị món cha */}
                    {renderOrderItem(parentItem)}

                    {/* Hiển thị các món con nếu có */}
                    {parentItem.childItems && parentItem.childItems.length > 0 && (
                        <div className="ml-2 space-y-2">
                            {parentItem.childItems.map((childItem) => renderOrderItem(childItem, true))}
                        </div>
                    )}
                </div>
            ))}

            {orderDetail?.orderItems.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-lg p-4 mt-6 sticky bottom-16">
                    <div className="text-sm space-y-1 px-3 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-lg">Tạm tính:</span>
                            <span className="font-bold text-lg text-primary">{convertToVND(totalOrderPrice)}đ</span>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

export default BookedOrders
