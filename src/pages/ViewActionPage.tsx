import type React from "react"
import { Link } from "react-router-dom"
import { FaChevronRight } from "react-icons/fa6"
import { EditNameComponent } from "@/components"
import LocationAnimation from "@/components/Animations/LocationAnimation"
import GiftAnimation from "@/components/Animations/GiftAnimation"
import CallPaymentModal from "@/components/modals/CallPaymentModal"
import CallStaffModal from "@/components/modals/CallStaffModal"
import RatingModal from "@/components/modals/RatingModal"

const ViewActionPage: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <header className="flex items-start space-x-3 mb-4">
                <LocationAnimation />
                <div>
                    <h1 className="font-semibold text-xl sm:text-2xl">Nhà hàng Pizza</h1>
                    <h2 className="text-xs sm:text-sm text-gray-500">Long Thạnh Mỹ, Quận 9, Tp Thủ Đức, Tp Hồ Chí Minh</h2>
                </div>
            </header>
            <section className="mb-6">
                <img
                    src="https://image.foodbook.vn/upload/20230707/1688720502417_image_o2o.jpg"
                    alt="Restaurant Banner"
                    className="w-full rounded-lg shadow-md"
                />
                <div className="flex justify-center mt-2">
                    <div className="w-5 h-1 bg-slate-500 rounded"></div>
                </div>
            </section>
            <EditNameComponent />
            <div className="flex justify-center items-center space-x-2 my-4">
                <span className="text-sm sm:text-base">Chúng tôi sẽ trả đồ cho bạn tại bàn:</span>
                <div className="rounded-full border border-black px-2 py-1">
                    <span className="text-sm font-semibold">A02</span>
                </div>
            </div>
            <div className="bg-orange-100 rounded-2xl p-4 flex items-center space-x-3 mb-6">
                <GiftAnimation />
                <p className="text-sm sm:text-base font-semibold text-gray-700">Số điện thoại của bạn sẽ được tích điểm !</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <CallPaymentModal />
                <CallStaffModal />
                <RatingModal />
            </div>

            <Link to="/action/foods" className="block">
                <div className="bg-orange-300 rounded-2xl p-4 flex justify-center items-center space-x-2">
                    <span className="text-sm sm:text-base font-semibold">Xem Menu - Gọi món</span>
                    <FaChevronRight className="text-lg" />
                </div>
            </Link>
        </div>
    )
}

export default ViewActionPage

