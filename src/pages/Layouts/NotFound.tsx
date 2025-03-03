'use client'

import type React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Pizza, Home } from 'lucide-react'

const NotFound: React.FC = () => {
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
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'linear'
              }}
              className='bg-orange-500 rounded-full p-6 shadow-md'
            >
              <Pizza className='w-12 h-12 text-white' />
            </motion.div>
          </div>

          <div className='p-8 text-center'>
            <h1 className='text-3xl font-bold text-gray-800 mb-4'>404 - Không Tìm Thấy Trang</h1>
            <p className='text-gray-600 mb-8'>
              Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có lẽ bạn đã nhập sai địa chỉ hoặc trang
              đã bị di chuyển.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to='/qr-scanner'
                className='inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 shadow-md'
              >
                <Home className='w-5 h-5' />
                Quay Về Trang Chủ
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound
