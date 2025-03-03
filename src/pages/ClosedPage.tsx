import type React from 'react'
import { motion } from 'framer-motion'
import { Clock, AlertCircle } from 'lucide-react'

const Closed: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <div className='bg-white rounded-3xl shadow-lg overflow-hidden'>
          <div className='bg-orange-100 p-8 flex justify-center'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className='bg-orange-500 rounded-full p-6 shadow-md'
            >
              <Clock className='w-12 h-12 text-white' />
            </motion.div>
          </div>

          <div className='p-8'>
            <h1 className='text-3xl font-bold text-center text-gray-800 mb-4'>Bàn Chưa Mở</h1>
            <p className='text-center text-gray-600 mb-6'>
              Xin lỗi, bàn này hiện chưa được mở. Vui lòng đợi nhân viên của chúng tôi mở bàn hoặc liên hệ với quản lý.
            </p>
            <div className='bg-orange-50 rounded-xl p-4 flex items-start gap-3'>
              <AlertCircle className='w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5' />
              <p className='text-sm text-gray-700'>
                Nếu bạn đã đặt trước, vui lòng thông báo cho nhân viên của chúng tôi. Chúng tôi sẽ mở bàn cho bạn ngay
                lập tức.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Closed
