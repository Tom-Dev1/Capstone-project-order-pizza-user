import type React from "react"
import { NavLink } from "react-router-dom"
import { Pizza, Coffee, ShoppingBag } from "lucide-react"

const BottomTabs: React.FC = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white border-t border-gray-300 p-2">
            <NavLink
                to="/action/foods"
                className={({ isActive }) =>
                    `flex flex-col items-center ${isActive ? "text-blue-500" : "text-gray-600"}`
                }
            >
                {({ isActive }) => (
                    <>
                        <div className={`rounded-full p-2 ${isActive ? "bg-blue-500" : ""}`}>
                            <Pizza className={`w-7 h-7 ${isActive ? "text-white" : "text-gray-600"}`} />
                        </div>
                        <span className="text-base font-medium mt-1">Đồ ăn</span>
                    </>
                )}
            </NavLink>

            <NavLink
                to="/action/drinks"
                className={({ isActive }) =>
                    `flex flex-col items-center ${isActive ? "text-blue-500" : "text-gray-600 "}`
                }
            >
                {({ isActive }) => (
                    <>
                        <div className={`rounded-full p-2 ${isActive ? "bg-blue-500" : ""}`}>
                            <Coffee className={`w-7 h-7 ${isActive ? "text-white" : "text-gray-600"}`} />
                        </div>
                        <span className="text-base font-medium mt-1">Đồ uống</span>
                    </>
                )}
            </NavLink>

            <NavLink
                to="/action/orders"
                className={({ isActive }) =>
                    `flex flex-col items-center ${isActive ? "text-blue-500" : "text-gray-600 "}`
                }
            >
                {({ isActive }) => (
                    <>
                        <div className={`rounded-full p-2 ${isActive ? "bg-blue-500" : ""}`}>
                            <ShoppingBag className={`w-7 h-7 ${isActive ? "text-white" : "text-gray-600"}`} />
                        </div>
                        <span className="text-base font-medium mt-1">Đơn hàng</span>
                    </>
                )}
            </NavLink>
        </div>
    )
}

export default BottomTabs

