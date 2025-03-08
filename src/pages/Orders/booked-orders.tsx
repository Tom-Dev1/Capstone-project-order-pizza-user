import { OrderItemsRES } from "@/types/order"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import LoadingFallBack from "../Layouts/LoadingFallBack"
import { convertToVND } from "@/utils/convertToVND"
import { getStatusColor, getStatusLabel } from "@/utils/orderStatusColor"
import useTable from "@/hooks/useTable"
import OrderService from "@/services/order-service"
import { useDispatch } from 'react-redux'
import { setTotalCount } from '@/redux/slices/totalCountSlide'
import { setTotalPrice } from "@/redux/slices/totalPriceSlice"


const BookedOrders: React.FC = () => {
    const { currentOrderId_ } = useTable()
    const [orderItems, setOrderItems] = useState<OrderItemsRES[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const dispatch = useDispatch()
    const totalOrderPrice = useMemo(() => {
        if (!orderItems || orderItems.length === 0) return 0
        return orderItems.reduce((total, item) => {
            const itemTotal = item.totalPrice
            return total + itemTotal
        }, 0)
    }, [orderItems])

    console.log("total price", totalOrderPrice);
    dispatch(setTotalPrice(totalOrderPrice))



    const fetchOrderItems = useCallback(async () => {

        try {
            setLoading(true)
            const orderService = OrderService.getInstance()
            const response = await orderService.getOrderItemByOrderID(`${currentOrderId_}`)
            if (response.result && response.message) {
                setOrderItems(response.result.items)
                dispatch(setTotalCount(response.result.totalCount))
            }

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Không thể tải danh sách đơn hàng.")
        } finally {
            setLoading(false)
        }
    }, [currentOrderId_, dispatch])

    useEffect(() => {
        if (currentOrderId_) {
            fetchOrderItems()
        }
    }, [currentOrderId_, fetchOrderItems])

    console.log('crrOrderID', currentOrderId_);

    if (loading) return <LoadingFallBack />
    if (error) return <div>Error: {error}</div>

    return (
        <div className="space-y-4 p-4 pb-24">
            {orderItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <span className="font-medium">{item.name}<span className=" ml-2"> x{item.quantity}</span></span>
                        <span className="font-normal">{convertToVND(item.price)} VND</span>
                    </div>
                    <div className="px-4">
                        {item.orderItemDetails && item.orderItemDetails.length > 0 ? (
                            <>
                                <h3 className="text-sm font-medium ">Lựa chọn:</h3>
                                <div className=" pl-5 space-y-1">
                                    {item.orderItemDetails.map((detail, index) => (
                                        <div key={detail.id || index} className="text-sm flex justify-between items-center text-gray-600">
                                            <div> •   {detail.name}</div>
                                            <div>
                                                {detail.additionalPrice > 0 && (
                                                    <span className="ml-2 text-sm text-gray-600">(+{convertToVND(detail.additionalPrice)}) VND</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">Không có lựa chọn</p>
                        )}
                        <div className="border-t border-dashed mt-2"></div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="font-medium">Tổng tiền:</span>
                            <span className="font-bold">{convertToVND(item.totalPrice)} VND</span>
                        </div>
                    </div>

                    <div className="p-4 flex justify-end">
                        <div className={` flex justify-center w-32 px-4 py-2 rounded-lg font-semibold text-sm ${getStatusColor(item.orderItemStatus)}`}>
                            {getStatusLabel(item.orderItemStatus)}
                        </div>
                    </div>
                </div>
            ))}

            <div className="bg-white border border-gray-100 rounded-lg p-4 mt-6 sticky bottom-16">
                <div className="text-sm space-y-1 px-3 mt-4">
                    <div className="flex justify-between items-center text-gray-600">
                        <span className="font-bold">Giá chưa thuế</span>
                        <span className="font-medium">{convertToVND(totalOrderPrice)} VND </span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                        <span className="font-bold">Thuế 8%</span>
                        <span className="font-medium"></span>
                    </div>
                    <div className="border-t-2"></div>

                    <div className="flex justify-between items-center">
                        <span className="font-medium text-lg">Tổng cộng:</span>
                        <span className="font-bold text-lg text-primary">{convertToVND(totalOrderPrice)} VND</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookedOrders