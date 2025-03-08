"use client"

import { useEffect, useState, useCallback } from "react"
import Orders from "./Orders"
import BookedOrders from "./booked-orders"
import Tab from "@/components/ui/tab"
import { useSelector } from "react-redux"
import { selectCartItemsCount } from "@/redux/slices/cartSlice"
import BottomOrder from "./BottomOrder"
import useTable from "@/hooks/useTable"
import OrderService from "@/services/order-service"

type TabType = "tab1" | "tab2"

export default function SwitchTabs() {
    const [activeTab, setActiveTab] = useState<TabType>("tab1")
    const cartItemsCount = useSelector(selectCartItemsCount)
    const [totalCount, setTotalCount] = useState<number>(0)
    const { currentOrderId_ } = useTable()
    const fetchOrderItems = useCallback(async () => {

        try {
            const orderService = OrderService.getInstance()
            const response = await orderService.getOrderItemByOrderID(`${currentOrderId_}`)
            if (response.result && response.message) {
                setTotalCount(response.result.totalCount)
            }
        } catch (err) {
            console.log("Không thể tải danh sách đơn hàng.");

        } finally {
            console.log("Không thể tải danh sách đơn hàng.");
        }
    }, [currentOrderId_])

    useEffect(() => {
        if (currentOrderId_) {
            fetchOrderItems()
        }
    }, [currentOrderId_, fetchOrderItems])

    // Fetch order items every 30 seconds when on the "Giỏ hàng" tab
    useEffect(() => {
        let intervalId: NodeJS.Timeout

        if (activeTab === "tab1") {
            intervalId = setInterval(() => {
                fetchOrderItems()
            }, 3000) // 3 seconds
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [activeTab, fetchOrderItems])

    // Fetch order items when switching to the "Giỏ hàng" tab
    useEffect(() => {
        if (activeTab === "tab1") {
            fetchOrderItems()
        }
    }, [activeTab, fetchOrderItems])

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex border-b border-gray-200 w-fit ml-2 mt-3">
                <Tab
                    label={`Giỏ hàng ${cartItemsCount > 0 ? `(${cartItemsCount})` : ""}`}
                    isActive={activeTab === "tab1"}
                    onClick={() => setActiveTab("tab1")}
                />
                <Tab
                    label={`Đơn đã đặt ${totalCount > 0 ? `(${totalCount})` : ""}`}
                    isActive={activeTab === "tab2"}
                    onClick={() => setActiveTab("tab2")}
                />
            </div>

            <div className="mt-4 mx-2">{activeTab === "tab1" ? <Orders /> : <BookedOrders />}</div>

            <div className="fixed bottom-0 left-0 right-0 z-9">
                <BottomOrder activeTab={activeTab} />
            </div>
        </div>
    )
}

