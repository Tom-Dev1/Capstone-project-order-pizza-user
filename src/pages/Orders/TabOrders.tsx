import { useState } from "react"
import Orders from "./Orders"
import BookedOrders from "./booked-orders"
import Tab from "@/components/ui/tab"
import { useSelector } from "react-redux"
import { selectCartItemsCount } from "@/redux/slices/cartSlice"
import BottomOrder from "./BottomOrder"

type TabType = "tab1" | "tab2"

export default function SwitchTabs() {
    const [activeTab, setActiveTab] = useState<TabType>("tab1")
    const cartItemsCount = useSelector(selectCartItemsCount)
    const [totalCount,] = useState<number>(0)


    // Fetch order items every 30 seconds when on the "Giỏ hàng" tab

    // Fetch order items when switching to the "Giỏ hàng" tab

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

