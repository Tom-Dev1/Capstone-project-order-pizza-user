import type React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronRight } from 'react-icons/fa6'
import { EditNameComponent } from '@/components'
import LocationAnimation from '@/components/Animations/LocationAnimation'
import GiftAnimation from '@/components/Animations/GiftAnimation'
import CallPaymentModal from '@/components/modals/CallPaymentModal'
import CallStaffModal from '@/components/modals/CallStaffModal'
import RatingModal from '@/components/modals/RatingModal'
import { getItem } from '@/constants'
import { motion } from 'framer-motion'

const ViewActionPage: React.FC = () => {
  const tableCode = getItem<string>('tableCode')
  const [currentBanner, setCurrentBanner] = useState(0)
  const banners = [
    'https://graphicsfamily.com/wp-content/uploads/edd/2021/09/Pizza-Restaurant-Social-Media-Banner-1180x664.jpg',
    'https://cms.piklab.vn/resources/Tai%20nguyen%20Piklab/File%20design%20TMDT/piklab926.jpg',
    'https://thumbs.dreamstime.com/z/close-up-freshly-baked-pizza-banner-topped-melted-cheese-red-bell-peppers-mushrooms-parsley-wooden-serving-board-342980956.jpg?ct=jpeg'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [banners.length])

  return (
    <div className='max-w-2xl mx-auto px-4 py-6 sm:px-6 lg:px-8 bg-orange-50'>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex items-start space-x-3 mb-6'
      >
        <LocationAnimation />
        <div>
          <h1 className='font-bold text-2xl sm:text-3xl text-orange-700'>Nhà hàng Pizza</h1>
          <h2 className='text-sm sm:text-base text-orange-600'>Long Thạnh Mỹ, Quận 9, Tp Thủ Đức, Tp Hồ Chí Minh</h2>
        </div>
      </motion.header>
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='mb-8 relative overflow-hidden rounded-2xl shadow-lg'
      >
        <div className='relative h-48 sm:h-64'>
          {banners.map((banner, index) => (
            <motion.img
              key={index}
              src={banner}
              alt={`Restaurant Banner ${index + 1}`}
              className='absolute inset-0 w-full h-full object-cover'
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentBanner ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>
        <div className='absolute bottom-4 left-0 right-0 flex justify-center space-x-2'>
          {banners.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentBanner ? 'bg-white' : 'bg-white/50'}`}
            ></div>
          ))}
        </div>
      </motion.section>
      <EditNameComponent />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='flex justify-center items-center space-x-2 my-6'
      >
        <span className='text-base sm:text-lg text-orange-800'>Chúng tôi sẽ trả đồ cho bạn tại bàn:</span>
        <div className='rounded-full bg-orange-200 border-2 border-orange-500 px-4 py-1'>
          <span className='text-lg font-bold text-orange-700'>{tableCode}</span>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className='bg-orange-100 rounded-2xl p-6 flex items-center space-x-4 mb-8 shadow-md'
      >
        <GiftAnimation />
        <p className='text-base sm:text-lg font-semibold text-orange-700'>Số điện thoại của bạn sẽ được tích điểm !</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className='grid grid-cols-3 gap-4 mb-8'
      >
        <CallPaymentModal />
        <CallStaffModal />
        <RatingModal />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Link to='/action/foods' className='block'>
          <div className='bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl p-5 flex justify-center items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
            <span className='text-lg sm:text-xl font-bold text-white'>Xem Menu - Gọi món</span>
            <FaChevronRight className='text-2xl text-white' />
          </div>
        </Link>
      </motion.div>
    </div>
  )
}

export default ViewActionPage
