import { NavLink } from "react-router-dom"
import { Pizza, Coffee, ShoppingBag } from "lucide-react"

function BottomTabs() {
    return (
        <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white border-t border-gray-300 p-3">
            <NavLink
                to="/action/foods"
                className={({ isActive }) =>
                    `flex flex-col items-center ${isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`
                }
            >
                {({ isActive }) => (
                    <>
                        <Pizza className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-gray-600"}`} />
                        <span className="text-sm font-medium mt-1">Thức ăn</span>
                    </>
                )}
            </NavLink>

            <NavLink
                to="/action/drinks"
                className={({ isActive }) =>
                    `flex flex-col items-center ${isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`
                }
            >
                {({ isActive }) => (
                    <>
                        <Coffee className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-gray-600"}`} />
                        <span className="text-sm font-medium mt-1">Đồ uống</span>
                    </>
                )}
            </NavLink>

            <NavLink
                to="/action/orders"
                className={({ isActive }) =>
                    `flex flex-col items-center ${isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`
                }
            >
                {({ isActive }) => (
                    <>
                        <ShoppingBag className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-gray-600"}`} />
                        <span className="text-sm font-medium mt-1">Đơn hàng</span>
                    </>
                )}
            </NavLink>
        </div>
    )
}

export default BottomTabs

