import type React from 'react'
import { motion } from 'framer-motion'
import { Pizza } from 'lucide-react'

const LoadingFallBack: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
          scale: {
            type: 'spring',
            damping: 5,
            stiffness: 100,
            restDelta: 0.001
          }
        }}
      >
        <div className='relative'>
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 2,
              ease: 'linear',
              repeat: Number.POSITIVE_INFINITY
            }}
            className='text-orange-500'
          >
            <Pizza size={80} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className='absolute inset-0 flex items-center justify-center'
          >
            <div className='w-4 h-4 bg-white rounded-full' />
          </motion.div>
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className='mt-8 text-2xl font-semibold text-orange-600 text-center'
      >
        Đang Chuẩn Bị Pizza Cho Bạn...
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className='mt-4 text-orange-500 text-center max-w-md'
      >
        Vui lòng đợi trong giây lát. Chúng tôi đang làm những chiếc pizza thơm ngon nhất dành cho bạn!
      </motion.p>
    </div>
  )
}

export default LoadingFallBack
