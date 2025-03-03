import type React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner'
import { Pizza, Camera } from 'lucide-react'

const QRScannerPage: React.FC = () => {
  const [scanning, setScanning] = useState(false)
  const navigate = useNavigate()

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      const result = detectedCodes[0].rawValue
      console.log('QR Code scanned:', result)
      const url = new URL(result)
      const path = url.pathname + url.search
      navigate(path)
    }
  }

  useEffect(() => {
    // Start scanning after a short delay to allow animations to complete
    const timer = setTimeout(() => setScanning(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-b from-orange-50 via-orange-100/30 to-orange-50 flex flex-col items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-center mb-8'
      >
        <h1 className='text-3xl font-bold text-orange-600 mb-2'>Quét Mã QR</h1>
        <p className='text-orange-500'>Đưa mã QR vào khung hình để quét</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='w-full max-w-md aspect-square relative rounded-2xl overflow-hidden shadow-xl'
      >
        {scanning ? (
          <Scanner onScan={handleScan} />
        ) : (
          <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
            <Camera className='w-16 h-16 text-gray-400 animate-pulse' />
          </div>
        )}
        <motion.div
          className='absolute inset-0 border-4 border-orange-500 rounded-2xl pointer-events-none'
          animate={{
            scale: [1, 1.05, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Number.POSITIVE_INFINITY
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className='mt-8 text-center'
      >
        <p className='text-orange-600 mb-2'>Đang tìm kiếm mã QR...</p>
        <div className='flex justify-center space-x-2'>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className='w-3 h-3 bg-orange-500 rounded-full'
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Decorative background elements */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden'>
        {[...Array(10)].map((_, i) => (
          <Pizza
            key={i}
            className='absolute text-orange-200/20'
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default QRScannerPage
