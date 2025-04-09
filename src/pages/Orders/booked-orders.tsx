"use client"

import type { OrderItemsRES } from "@/types/order"
import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import LoadingFallBack from "../Layouts/LoadingFallBack"
import { convertToVND } from "@/utils/convertToVND"
import { getStatusColor, getStatusLabel } from "@/utils/orderStatusColor"
import useTable from "@/hooks/useTable"
import OrderService from "@/services/order-service"
import { useDispatch } from "react-redux"
import { setTotalPrice } from "@/redux/slices/totalPriceSlice"
import { setTotalCount } from "@/redux/slices/totalCountSlide"

// Explicitly define the props interface
export interface BookedOrdersProps {
    initialData?: { items: OrderItemsRES[]; totalCount: number } | null
}

const BookedOrders: React.FC<BookedOrdersProps> = ({ initialData = null }) => {
    const { currentOrderId_ } = useTable()
    const [orderItems, setOrderItems] = useState<OrderItemsRES[]>(initialData?.items || [])
    const [loading, setLoading] = useState<boolean>(!initialData || initialData.items.length === 0)
    const [error, setError] = useState<string | null>(null)
    const dispatch = useDispatch()
    const hasFetched = useRef<string | null>(null)
    // Track if component is mounted
    const isMounted = useRef(true)
    // Cache for API responses
    const orderCache = useRef<Record<string, { items: OrderItemsRES[]; totalCount: number; timestamp: number }>>({})

    // Initialize cache with initialData if available
    useEffect(() => {
        if (initialData && initialData.items.length > 0 && currentOrderId_) {
            orderCache.current[currentOrderId_] = {
                items: initialData.items,
                totalCount: initialData.totalCount,
                timestamp: Date.now(),
            }

            // Update totalCount in Redux
            dispatch(setTotalCount(initialData.totalCount))
        }
    }, [initialData, currentOrderId_, dispatch])

    const totalOrderPrice = useMemo(() => {
        if (!orderItems || orderItems.length === 0) return 0
        return orderItems.reduce((total, item) => {
            const itemTotal = item.totalPrice
            return total + itemTotal
        }, 0)
    }, [orderItems])

    // Only dispatch when totalOrderPrice changes and component is mounted
    useEffect(() => {
        dispatch(setTotalPrice(totalOrderPrice))
    }, [totalOrderPrice, dispatch])

    // Set isMounted to false when component unmounts
    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    useEffect(() => {
        const fetchOrderItems = async () => {
            // If we have initialData and haven't fetched yet, mark as fetched
            if (initialData?.items && initialData.items.length > 0 && !hasFetched.current && currentOrderId_) {
                hasFetched.current = currentOrderId_
                setLoading(false)
                return
            }

            if (!currentOrderId_ || hasFetched.current === currentOrderId_) {
                setLoading(false)
                return
            }

            // Check cache first
            const now = Date.now()
            const cacheEntry = orderCache.current[currentOrderId_]
            const CACHE_TTL = 30000 // 30 seconds cache TTL

            if (cacheEntry && now - cacheEntry.timestamp < CACHE_TTL) {
                console.log("Using cached order data")
                setOrderItems(cacheEntry.items)
                dispatch(setTotalCount(cacheEntry.totalCount))
                setLoading(false)
                hasFetched.current = currentOrderId_
                return
            }

            try {
                hasFetched.current = currentOrderId_
                setLoading(true)
                const orderService = OrderService.getInstance()
                const response = await orderService.getOrderItemByOrderID(`${currentOrderId_}`)

                // Only update state if component is still mounted
                if (!isMounted.current) return

                if (response.result && response.message) {
                    const items = response.result.items || []
                    const totalCount = response.result.totalCount

                    // Update cache
                    orderCache.current[currentOrderId_] = {
                        items,
                        totalCount,
                        timestamp: Date.now(),
                    }

                    setOrderItems(items)
                    dispatch(setTotalCount(totalCount))
                } else {
                    setOrderItems([])
                }
            } catch (err: unknown) {
                // Only update state if component is still mounted
                if (!isMounted.current) return

                setError(err instanceof Error ? err.message : "Không thể tải danh sách đơn hàng.")
                setOrderItems([])
            } finally {
                // Only update loading state if component is still mounted
                // eslint-disable-next-line no-unsafe-finally
                if (!isMounted.current) return

                setLoading(false)
            }
        }

        fetchOrderItems()

        // Set up polling for real-time updates (every 30 seconds)
        const pollingInterval = 30000 // 30 seconds
        const intervalId = setInterval(() => {
            if (isMounted.current && currentOrderId_) {
                // Reset hasFetched to allow polling to work
                hasFetched.current = null
                fetchOrderItems()
            }
        }, pollingInterval)

        return () => {
            clearInterval(intervalId)
        }
    }, [currentOrderId_, dispatch, initialData])

    if (loading && orderItems.length === 0) return <LoadingFallBack />
    if (error) return <div>Error: {error}</div>
    if (!orderItems || orderItems.length === 0) {
        return <div className="p-4 text-center text-gray-500">Không có đơn hàng nào</div>
    }

    return (
        <div className="space-y-4 p-4 pb-24">
            {orderItems && orderItems.length > 0 ? (
                orderItems.map((item) => (
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
                            <div className="border-t border-dashed mt-2"></div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="font-medium">Tổng tiền:</span>
                                <span className="font-bold">{convertToVND(item.totalPrice)} VND</span>
                            </div>
                        </div>

                        <div className="p-4 flex justify-end">
                            <div
                                className={`flex justify-center w-32 px-4 py-2 rounded-lg font-semibold text-sm ${getStatusColor(
                                    item.orderItemStatus,
                                )}`}
                            >
                                {getStatusLabel(item.orderItemStatus)}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500">Không có đơn hàng nào</div>
            )}

            {orderItems && orderItems.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-lg p-4 mt-6 sticky bottom-16">
                    <div className="text-sm space-y-1 px-3 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-lg">Tổng cộng:</span>
                            <span className="font-bold text-lg text-primary">{convertToVND(totalOrderPrice)} VND</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BookedOrders
