import { useEffect, useState } from "react"
import Orders from "./Orders"
import BookedOrders from "./booked-orders"
import Tab from "@/components/ui/tab"
import { useSelector } from "react-redux"
import { selectCartItemsCount } from "@/redux/slices/cartSlice"
import BottomOrder from "./BottomOrder"
import useTable from "@/hooks/useTable"
import OrderService from "@/services/order-service"
import type { OrderItemsRES } from "@/types/order"

type TabType = "tab1" | "tab2"

export default function SwitchTabs() {
    const [activeTab, setActiveTab] = useState<TabType>("tab1")
    const cartItemsCount = useSelector(selectCartItemsCount)
    const [bookedOrdersData, setBookedOrdersData] = useState<{ items: OrderItemsRES[]; totalCount: number } | null>(null)
    const [isDataFetched, setIsDataFetched] = useState(false)
    const { currentOrderId_ } = useTable()

    // Prefetch data when component mounts or when currentOrderId_ changes
    useEffect(() => {
        if (!currentOrderId_ || isDataFetched) return

        // Prefetch after a short delay to prioritize initial tab rendering
        const timer = setTimeout(() => {
            prefetchBookedOrders()
        }, 1500) // 1.5 second delay - shorter for mobile

        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentOrderId_, isDataFetched])

    // Prefetch when user is about to switch tabs (on tab press)
    const handleTabClick = (tab: TabType) => {
        // If switching to tab2 and we haven't fetched data yet, fetch it immediately
        if (tab === "tab2" && !isDataFetched && currentOrderId_) {
            prefetchBookedOrders()
        }
        setActiveTab(tab)
    }

    const prefetchBookedOrders = async () => {
        if (!currentOrderId_) return

        try {
            const orderService = OrderService.getInstance()
            const response = await orderService.getOrderItemByOrderID(`${currentOrderId_}`)

            if (response.result && response.message) {
                setBookedOrdersData({
                    items: response.result.items || [],
                    totalCount: response.result.totalCount,
                })
                setIsDataFetched(true)
            }
        } catch (error) {
            console.error("Error prefetching booked orders:", error)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex border-b border-gray-200 w-fit ml-2 mt-3">
                <Tab
                    label={`Giỏ hàng ${cartItemsCount > 0 ? `(${cartItemsCount})` : ""}`}
                    isActive={activeTab === "tab1"}
                    onClick={() => handleTabClick("tab1")}
                />
                <Tab
                    label={`Đơn đã đặt ${bookedOrdersData?.totalCount && bookedOrdersData?.totalCount > 0 ? `(${bookedOrdersData.totalCount})` : ""}`}
                    isActive={activeTab === "tab2"}
                    onClick={() => handleTabClick("tab2")}
                />
            </div>

            <div className="mt-4 mx-2">
                {activeTab === "tab1" ? <Orders /> : <BookedOrders initialData={bookedOrdersData} />}
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-9">
                <BottomOrder activeTab={activeTab} />
            </div>
        </div>
    )
}
