"use client"

import { useState } from "react"

import Orders from "./Orders"
import BookedOrders from "./booked-orders"
import Tab from "@/components/ui/tab"

type TabType = "tab1" | "tab2"

export default function SwitchTabs() {
    const [activeTab, setActiveTab] = useState<TabType>("tab1")

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex border-b border-gray-200 w-[204px] ml-2 mt-3">
                <Tab label="Giỏ hàng" isActive={activeTab === "tab1"} onClick={() => setActiveTab("tab1")} />
                <Tab label="Đơn đã đặt" isActive={activeTab === "tab2"} onClick={() => setActiveTab("tab2")} />
            </div>

            <div className="mt-4 mx-2">{activeTab === "tab1" ? <Orders /> : <BookedOrders />}</div>
        </div>
    )
}
