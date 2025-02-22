import type React from "react"
import { NavLink } from "react-router-dom"
import { Pizza, Coffee, ShoppingBag } from "lucide-react"
import { useAppSelector } from "@/hooks/useAppSelector"
import { selectCartItemsCount } from "@/redux/stores/cartSlice"

const BottomTabs: React.FC = () => {
    const cartItemsCount = useAppSelector(selectCartItemsCount)

    const NavItem: React.FC<{
        to: string
        Icon: React.ElementType
        label: string
        showBadge?: boolean
        badgeContent?: number
    }> = ({ to, Icon, label, showBadge = false, badgeContent = 0 }) => (
        <NavLink
            to={to}
            className={({ isActive }) => `flex flex-col items-center ${isActive ? "text-blue-500" : "text-gray-600"}`}
        >
            {({ isActive }) => (
                <>
                    <div className={`rounded-full p-2 ${isActive ? "bg-blue-500" : ""} relative`}>
                        <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-600"}`} />
                        {showBadge && badgeContent > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                {badgeContent}
                            </span>
                        )}
                    </div>
                    <span className="text-xs font-medium mt-0.5">{label}</span>
                </>
            )}
        </NavLink>
    )

    return (
        <nav className="flex justify-around items-center bg-white border-t border-gray-300 py-1 h-[76px]">
            <NavItem to="/action/foods" Icon={Pizza} label="Đồ ăn" />
            <NavItem to="/action/drinks" Icon={Coffee} label="Đồ uống" />
            <NavItem to="/action/orders" Icon={ShoppingBag} label="Đơn hàng" showBadge={true} badgeContent={cartItemsCount} />
        </nav>
    )
}

export default BottomTabs

