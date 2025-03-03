import React, { useMemo } from "react"
import { NavLink } from "react-router-dom"
import { Pizza, Coffee, ShoppingBag } from "lucide-react"
import { selectCartItemsCount } from "@/redux/slices/cartSlice"
import { useSelector } from "react-redux"

interface NavItemProps {
  to: string
  Icon: React.ElementType
  label: string
  showBadge?: boolean
  badgeContent?: number
}

const NavItem: React.FC<NavItemProps> = React.memo(({ to, Icon, label, showBadge = false, badgeContent = 0 }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `flex flex-col items-center ${isActive ? "text-orange-600" : "text-gray-600"}`}
  >
    {({ isActive }) => (
      <>
        <div className={`rounded-full p-2.5 ${isActive ? "bg-orange-500" : ""} relative`}>
          <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-600"}`} />
          {showBadge && badgeContent > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {badgeContent}
            </span>
          )}
        </div>
        <span className="text-sm font-semibold mt-0.5">{label}</span>
      </>
    )}
  </NavLink>


))

NavItem.displayName = "NavItem"

const BottomTabs: React.FC = () => {
  const cartItemsCount = useSelector(selectCartItemsCount)

  const navItems = useMemo(
    () => [
      { to: "/action/foods", Icon: Pizza, label: "Đồ ăn" },
      { to: "/action/drinks", Icon: Coffee, label: "Đồ uống" },
      { to: "/action/orders", Icon: ShoppingBag, label: "Đơn hàng", showBadge: true, badgeContent: cartItemsCount },
    ],
    [cartItemsCount],
  )

  return (
    <nav className="flex justify-around items-center bg-white border-t border-gray-300 py-1 h-[76px]">
      {navItems.map((item) => (
        <NavItem key={item.to} {...item} />
      ))}
    </nav>
  )


}

export default React.memo(BottomTabs)