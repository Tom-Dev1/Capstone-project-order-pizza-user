import React from 'react'
import { EditNameComponent } from '@/components'
import LocationAnimation from '@/components/Animations/LocationAnimation'
import GiftAnimation from '@/components/Animations/GiftAnimation'
import PaymentAnimation from '@/components/Animations/PaymentAnimation'
import StaffAnimation from '@/components/Animations/StaffAnimation'
import RatingAnimation from '@/components/Animations/RatingAnimation'
const ViewActionPage: React.FC = () => {
    return (
        <div className='w-full h-screen px-[12px] py-[16px]'>
            <div className='flex'>
                <LocationAnimation />
                <div className="flex flex-col">

                    <h1 className='font-semibold text-xl'>Nhà hàng Pizza</h1>
                    <h2 className='text-xs text-gray-500'> Long Thạnh Mỹ, Quận 9, Tp Thủ Đức, Tp Hồ Chí Minh</h2></div>
            </div>
            {/* Banner */}
            <div className='mt-2'>
                <img src='https://image.foodbook.vn/upload/20230707/1688720502417_image_o2o.jpg' />
                <div className="flex justify-center items-center flex-col">
                    <div className=" w-5 mt-2 px-1 py-[2px] rounded bg-slate-500"></div>
                </div>
            </div>
            {/* Say Hello Component, Morning, Afternoon, Night and Icon  */}
            <div className='w-full mt-2'>
                <EditNameComponent />
            </div>
            {/* Table */}
            <div className="flex justify-center w-full mt-1">
                <h1 className='text-sm'>Chúng tôi sẽ trả đồ cho bạn tại bàn:</h1>
                <div className='rounded-full border border-black px-2 ml-1'>
                    <h1 className='text-sm font-semibold'>A02</h1>
                </div>
            </div>
            <div className="w-full h-18 flex items-center border-orange-100 rounded-2xl mt-3 p-3 bg-orange-100">
                <div className="">
                    <GiftAnimation />
                </div>
                <p className="text-sm font-semibold text-gray-700 ml-1">
                    Số điện thoại của bạn sẽ được tích điểm !
                </p>
            </div>
            {/* Action  */}
            <div className="grid grid-cols-3 gap-2 mt-5">
                <div className="bg-gradient-to-b from-blue-200/70 to-green-300/30 h-24 w-full rounded-lg p-2 ">
                    <h1 className='text-sm font-semibold text-center '>Gọi thanh toán</h1>
                    <div className='flex justify-center items-center'>
                        <PaymentAnimation />
                    </div>
                </div>
                <div className="bg-gradient-to-t from-orange-200/70 to-blue-300/30 h-24 w-full rounded-lg p-2">
                    <h1 className='text-sm font-semibold text-center '>Gọi nhân viên</h1>
                    <div className='flex justify-center items-center'>
                        <StaffAnimation />
                    </div>
                </div>
                <div className="bg-gradient-to-b from-slate-200/70 to-green-500/30 h-24 w-full rounded-lg p-2">
                    <h1 className='text-sm font-semibold text-center '>Đánh giá</h1>
                    <div className='flex justify-center items-center'>
                        <RatingAnimation />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewActionPage