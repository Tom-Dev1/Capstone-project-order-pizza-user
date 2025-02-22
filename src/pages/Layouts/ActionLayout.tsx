"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import BottomTabs from "@/components/BottomTabs"
import Header from "@/components/HeaderComponents/HeaderComponents"
import HeaderWithBack from "@/components/HeaderComponents/HeaderWithBack"

const ActionLayout: React.FC = () => {
    const location = useLocation()
    const isOrderPage = location.pathname === "/action/orders"
    const [mainContentStyle, setMainContentStyle] = useState({})

    useEffect(() => {
        const updateMainContentStyle = () => {
            const headerHeight = 64
            const bottomTabsHeight = 56
            const newStyle = {
                height: `calc(100vh - ${headerHeight}px - ${bottomTabsHeight}px)`,
                top: `${headerHeight}px`,
            }
            setMainContentStyle(newStyle)
        }

        updateMainContentStyle()
        window.addEventListener("resize", updateMainContentStyle)

        return () => {
            window.removeEventListener("resize", updateMainContentStyle)
        }
    }, [])

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="fixed top-0 left-0 right-0 z-10">
                {isOrderPage ? <HeaderWithBack title="Đơn hàng" /> : <Header />}
            </div>
            <main style={mainContentStyle} className="fixed left-0 right-0 overflow-y-auto w-full">
                <Outlet />
            </main>
            <div className="fixed bottom-0 left-0 right-0 z-10">
                <BottomTabs />
            </div>
        </div>
    )
}

export default ActionLayout

