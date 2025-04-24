'use client'

import type React from 'react'
import { motion } from 'framer-motion'
import { Home, PhoneCall, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import TableService from '@/services/table-service'
import { getItem } from '@/constants'

const Closed: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [callStatus, setCallStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleCallStaff = async () => {
    try {
      setIsLoading(true)
      setCallStatus('idle')

      const tableCode = getItem<string>('tableCode')
      const tableID = getItem<string>('tableId')

      if (!tableID) {
        throw new Error('Table ID not found')
      }

      const tableService = TableService.getInstance()
      await tableService.callStaff(tableID, `Yêu cầu mở bàn ${tableCode || ''}`)

      setCallStatus('success')
      setTimeout(() => setCallStatus('idle'), 3000)
    } catch (error) {
      console.error('Error calling staff:', error)
      setCallStatus('error')
      setTimeout(() => setCallStatus('idle'), 3000)
    } finally {
      setIsLoading(false)
    }
  }

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
            <h1 className='text-3xl font-bold text-center text-gray-800 mb-2'>Bàn Chưa Mở</h1>
            <p className='text-center text-gray-600 mb-6'>
              Xin lỗi, bàn này hiện chưa được mở. Vui lòng đợi nhân viên của chúng tôi mở bàn hoặc liên hệ với quản lý.
            </p>

            {callStatus === 'success' && (
              <div className='bg-green-50 rounded-xl p-3 mb-4 text-center text-green-700 text-sm'>
                Đã gửi yêu cầu thành công. Nhân viên sẽ đến ngay!
              </div>
            )}

            {callStatus === 'error' && (
              <div className='bg-red-50 rounded-xl p-3 mb-4 text-center text-red-700 text-sm'>
                Có lỗi xảy ra. Vui lòng thử lại sau!
              </div>
            )}

            <div className='bg-orange-50 rounded-xl p-4 mb-6'>
              <div className='flex items-start gap-3'>
                <Clock className='w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5' />
                <p className='text-sm text-gray-700'>
                  Nếu bạn đã đặt trước, vui lòng thông báo cho nhân viên của chúng tôi. Chúng tôi sẽ mở bàn cho bạn ngay
                  lập tức.
                </p>
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCallStaff}
                disabled={isLoading}
                className='w-full inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 shadow-md disabled:opacity-70'
              >
                {isLoading ? (
                  <>
                    <span className='animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full'></span>
                    <span>Đang gọi...</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className='w-5 h-5' />
                    <span>Gọi Nhân Viên Mở Bàn</span>
                  </>
                )}
              </motion.button>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to='/qr-scanner'
                  className='w-full inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 shadow-md'
                >
                  <Home className='w-5 h-5' />
                  Quay Về Trang Chủ
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Closed
