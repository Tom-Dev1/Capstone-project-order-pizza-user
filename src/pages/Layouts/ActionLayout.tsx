import type React from "react"
import { useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import BottomTabs from "@/components/BottomTabs"
import HeaderWithBack from "@/components/HeaderComponents/HeaderWithBack"
import Header from "@/components/HeaderComponents/HeaderComponents"

const ActionLayout: React.FC = () => {
    const location = useLocation()
    const isOrderPage = location.pathname === "/action/orders"
    const [mainContentStyle, setMainContentStyle] = useState({})

    useEffect(() => {
        const updateMainContentStyle = () => {
            const headerHeight = 70
            const bottomTabsHeight = 76
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
        <div className="flex flex-col h-screen pt-[70px] bg-gray-50">
            <div className="sticky top-0 right-0  z-10">
                {isOrderPage ? <HeaderWithBack title="Thông tin đơn hàng" /> : <Header />}
            </div>
            <main style={mainContentStyle} className="z-9">
                <Outlet />
            </main>
            <div className="fixed bottom-0 left-0 right-0">
                {isOrderPage ? "" : <BottomTabs />}
            </div>
        </div>
    )
}

export default ActionLayout

