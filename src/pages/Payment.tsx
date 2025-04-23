"use client"

import type React from "react"
import { useEffect, useState, useMemo } from "react"
import { CheckCircle, Clock, Receipt, ArrowLeft, Package } from "lucide-react"
import { motion } from "framer-motion"
import { getItem } from "@/constants"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import OrderService from "@/services/order-service"
import useTable from "@/hooks/useTable"
import { convertToVND } from "@/utils/convertToVND"
import LoadingFallBack from "@/components/Layouts/LoadingFallBack"
import { getOrderItemStatusBadge } from "@/utils/orderItemStatusBadge"
import type { OrderItemDetail } from "@/types/order-detail"

// Định nghĩa interface cho món ăn có cấu trúc phân cấp
interface HierarchicalOrderItem extends OrderItemDetail {
    childItems?: OrderItemDetail[]
}

const Payment: React.FC = () => {
    const navigate = useNavigate()
    const [elapsedTime, setElapsedTime] = useState(0)
    const tableCode = getItem<string>("tableCode") || "Unknown"
    const { currentOrderId_ } = useTable()

    // Fetch order details
    const {
        data: orderDetail,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["orderDetail", currentOrderId_],
        queryFn: async () => {
            if (!currentOrderId_) return null
            const orderService = OrderService.getInstance()
            const response = await orderService.getOrderDetailDetailByOrderId(currentOrderId_)
            if (!response.success) throw new Error(response.message || "Không thể tải thông tin đơn hàng")
            return response.result
        },
        enabled: !!currentOrderId_,
        refetchInterval: 10000, // Refetch every 10 seconds to check status
    })

    // Start a timer when the component mounts
    useEffect(() => {
        // Only start timer if not checked out
        if (orderDetail?.status !== "CheckedOut") {
            const timer = setInterval(() => {
                setElapsedTime((prev) => prev + 1)
            }, 1000)

            return () => clearInterval(timer)
        }
    }, [orderDetail?.status])

    // Format the elapsed time as minutes and seconds
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`
    }

    // Format date for receipt
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    // Create hierarchical structure for order items
    const hierarchicalOrderItems = useMemo(() => {
        if (!orderDetail?.orderItems) return []

        // Create a map to store parent items and their children
        const parentMap = new Map<string, HierarchicalOrderItem>()
        const topLevelItems: HierarchicalOrderItem[] = []

        // First, identify all parent items
        orderDetail.orderItems.forEach((item) => {
            if (!item.parentId) {
                const hierarchicalItem: HierarchicalOrderItem = {
                    ...item,
                    childItems: [],
                }
                parentMap.set(item.id, hierarchicalItem)
                topLevelItems.push(hierarchicalItem)
            }
        })

        // Then, add child items to their parents
        orderDetail.orderItems.forEach((item) => {
            if (item.parentId) {
                const parent = parentMap.get(item.parentId)
                if (parent && parent.childItems) {
                    parent.childItems.push(item)
                }
            }
        })

        return topLevelItems
    }, [orderDetail?.orderItems])

    if (isLoading) {
        return <LoadingFallBack />
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-red-500 mb-4">Đã xảy ra lỗi khi tải thông tin thanh toán</p>
                <Button onClick={() => refetch()} className="bg-my-color text-white">
                    Thử lại
                </Button>
            </div>
        )
    }

    // If order is checked out, show receipt
    if (orderDetail?.status === "CheckedOut") {
        return (
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Header */}
                <div className="bg-my-color text-white p-4 sticky top-0 z-10">
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate("/action/foods")}>
                            <ArrowLeft size={24} />
                        </Button>
                        <h1 className="text-xl font-bold text-center flex-1">Hóa Đơn Thanh Toán</h1>
                    </div>
                </div>

                {/* Receipt */}
                <div className="w-full p-4">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                        {/* Receipt Header */}
                        <div className="bg-my-color text-white p-4 text-center w-full">
                            <Receipt size={32} className="mx-auto mb-2" />
                            <h2 className="text-xl font-bold">Hóa Đơn Thanh Toán</h2>
                            <p className="text-sm opacity-90">Mã đơn: {orderDetail.orderCode || "N/A"}</p>
                        </div>

                        {/* Restaurant Info */}
                        <div className="border-b p-4 text-center">
                            <h3 className="font-bold text-lg">Pizza CapStone</h3>
                            <p className="text-sm text-gray-600">Địa chỉ: 123 Đường ABC, Quận XYZ</p>
                            <p className="text-sm text-gray-600">SĐT: 0123 456 789</p>
                        </div>

                        {/* Order Info */}
                        <div className="p-4 border-b">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Bàn:</span>
                                <span className="font-medium">{orderDetail.tableCode}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Thời gian:</span>
                                <span className="font-medium">{formatDate(orderDetail.startTime)}</span>
                            </div>
                            {orderDetail.endTime && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Thanh toán:</span>
                                    <span className="font-medium">{formatDate(orderDetail.endTime)}</span>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="p-4">
                            <h3 className="font-bold mb-3 text-gray-800">Chi tiết đơn hàng</h3>
                            <div className="space-y-4">
                                {hierarchicalOrderItems.map((parentItem) => (
                                    <div key={parentItem.id} className="space-y-2">
                                        {/* Parent Item */}
                                        <div
                                            className={`bg-white border border-gray-100 rounded-lg overflow-hidden ${parentItem.isProductCombo ? "border-orange-300 border-2" : ""
                                                }`}
                                        >
                                            <div className="p-4 pb-2">
                                                <div className="flex justify-between  mb-1">
                                                    <div className="flex items-center">

                                                        <div className="font-medium">{parentItem.name} <span className="text-gray-600 ml-2">x{parentItem.quantity}</span></div>
                                                    </div>
                                                    <div className="font-medium w-32 text-right items-start h-auto">
                                                        {convertToVND(parentItem.price * parentItem.quantity)} đ
                                                    </div>
                                                </div>

                                                {/* Item options */}
                                                {parentItem.orderItemDetails && parentItem.orderItemDetails.length > 0 && (
                                                    <div className="pl-4 text-sm text-gray-600">
                                                        {parentItem.orderItemDetails.map((option, idx) => (
                                                            <div key={option.id || idx} className="flex justify-between">
                                                                <span>• {option.name}</span>
                                                                {option.additionalPrice > 0 && <span>+{convertToVND(option.additionalPrice)} đ</span>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Item note */}
                                                {parentItem.note && (
                                                    <div className="pl-4 text-sm text-gray-600 mt-1">
                                                        <span className="italic">Ghi chú: {parentItem.note}</span>
                                                    </div>
                                                )}

                                                <div className="border-t border-dashed mt-2"></div>
                                                <div className="flex justify-between items-center mt-1">

                                                    <span className="font-medium">Tổng tiền:</span>
                                                    <span
                                                        className={`font-bold ${parentItem.orderItemStatus === "Cancelled" ? "line-through text-gray-500" : ""
                                                            }`}
                                                    >
                                                        {convertToVND(parentItem.totalPrice)} đ
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={`p-4 flex  items-center ${parentItem.isProductCombo ? "justify-between" : "justify-end"}`}>
                                                {parentItem.isProductCombo && (
                                                    <div className="flex items-center mr-2 bg-orange-100 text-orange-600 px-2 py-1 rounded-md">
                                                        <Package size={16} className="mr-1" />
                                                        <span className="text-xs font-medium">Combo</span>
                                                    </div>
                                                )}
                                                <div>{getOrderItemStatusBadge(parentItem.orderItemStatus)}</div>
                                            </div>

                                            {parentItem.reasonCancel && (
                                                <div className="px-4 pb-3">
                                                    <div className="text-sm text-red-500">
                                                        <span className="font-medium">Lý do hủy:</span> {parentItem.reasonCancel}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Child Items */}
                                        {parentItem.childItems && parentItem.childItems.length > 0 && (
                                            <div className="ml-2 space-y-2">
                                                {parentItem.childItems.map((childItem) => (
                                                    <div
                                                        key={childItem.id}
                                                        className="bg-white border border-gray-100 rounded-lg overflow-hidden ml-4 mt-2 border-l-4 border-l-orange-200"
                                                    >
                                                        <div className="p-4 pb-2 flex justify-between items-center">
                                                            <div className="flex items-center">

                                                                <span className="font-medium">{childItem.name}<span className="text-gray-600 ml-2">x{childItem.quantity}</span></span>

                                                            </div>
                                                            <div className="font-medium w-24 text-right">
                                                                {convertToVND(childItem.price * childItem.quantity)} đ
                                                            </div>
                                                        </div>

                                                        {/* Child item options */}
                                                        {childItem.orderItemDetails && childItem.orderItemDetails.length > 0 && (
                                                            <div className="px-4 pl-9 text-sm text-gray-600">
                                                                {childItem.orderItemDetails.map((option, idx) => (
                                                                    <div key={option.id || idx} className="flex justify-between">
                                                                        <div>• {option.name}</div>
                                                                        {option.additionalPrice > 0 && (
                                                                            <div>+{convertToVND(option.additionalPrice)} đ</div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Child item note */}
                                                        {childItem.note && (
                                                            <div className="px-4 pl-9 text-sm text-gray-600 mt-1">
                                                                <span className="italic">Ghi chú: {childItem.note}</span>
                                                            </div>
                                                        )}

                                                        <div className="px-4 border-t border-dashed mt-2"></div>
                                                        <div className="flex justify-between items-center px-4 mt-1">

                                                        </div>

                                                        <div className="p-4 flex justify-between items-center">
                                                            <div className="text-base font-bold text-orange-500">+ Món thêm</div>
                                                            <div>{getOrderItemStatusBadge(childItem.orderItemStatus)}</div>
                                                        </div>

                                                        {childItem.reasonCancel && (
                                                            <div className="px-4 pb-3">
                                                                <div className="text-sm text-red-500">
                                                                    <span className="font-medium">Lý do hủy:</span> {childItem.reasonCancel}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Fees */}
                        {orderDetail.additionalFees && orderDetail.additionalFees.length > 0 && (
                            <div className="px-4 py-2 border-t">
                                <h3 className="font-medium mb-2 text-gray-800">Phụ thu</h3>
                                {orderDetail.additionalFees.map((fee) => (
                                    <div key={fee.id} className="flex justify-between text-sm mb-1">
                                        <span>{fee.name}</span>
                                        <span>{convertToVND(fee.value)} đ</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Vouchers */}
                        {orderDetail.orderVouchers && orderDetail.orderVouchers.length > 0 && (
                            <div className="px-4 py-2 border-t">
                                <h3 className="font-medium mb-2 text-gray-800">Voucher áp dụng</h3>
                                {orderDetail.orderVouchers.map((voucherItem) => (
                                    <div key={voucherItem.id} className="flex justify-between text-sm mb-1">
                                        <span>{voucherItem.voucher.code}</span>
                                        <span className="text-green-600">
                                            {voucherItem.voucher.discountType === "Percentage"
                                                ? `-${voucherItem.voucher.discountValue}%`
                                                : `-${convertToVND(voucherItem.voucher.discountValue)} đ`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Total */}
                        <div className="p-4 border-t bg-gray-50">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">Tổng cộng:</span>
                                <span className="font-bold text-xl text-my-color">{convertToVND(orderDetail.totalPrice)} đ</span>
                            </div>
                        </div>

                        {/* Thank you message */}
                        <div className="p-4 text-center border-t">
                            <p className="text-gray-600 italic">Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
                            <p className="text-gray-600 text-sm mt-1">Hẹn gặp lại quý khách lần sau</p>
                        </div>
                    </motion.div>

                    <div className="mt-6 text-center">
                        <Button onClick={() => navigate("/action/foods")} className="bg-my-color text-white px-8">
                            Quay Lại Menu
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // If not checked out yet, show waiting screen
    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            {/* Header */}
            <div className="bg-my-color text-white p-4">
                <h1 className="text-xl font-bold text-center">Thanh Toán</h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-start justify-center mt-6 p-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="relative">
                            <CheckCircle size={80} className="text-green-500" />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                                className="absolute -top-2 -right-2 bg-green-100 rounded-full p-1"
                            >
                                <CheckCircle size={24} className="text-green-500" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-2xl font-bold text-gray-800 mb-2"
                    >
                        Yêu Cầu Thanh Toán Thành Công
                    </motion.h2>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <p className="text-gray-600 mb-6">
                            Nhân viên đã nhận được yêu cầu thanh toán của bạn và sẽ đến bàn {tableCode} trong thời gian sớm nhất.
                        </p>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-center gap-3">
                            <Clock className="text-my-color" size={24} />
                            <span className="text-gray-700">
                                Thời gian chờ: <span className="font-medium">{formatTime(elapsedTime)}</span>
                            </span>
                        </div>

                        <p className="text-gray-600 italic mb-8">
                            Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi. Chúc quý khách một ngày tốt lành!
                        </p>

                        <Button
                            onClick={() => navigate("/action/foods")}
                            className="bg-my-color hover:bg-my-color/90 text-white font-medium py-2 px-6 rounded-md w-full"
                        >
                            Quay Lại Menu
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default Payment
