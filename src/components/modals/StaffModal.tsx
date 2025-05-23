import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { getItem } from '@/constants'
import TableService from '@/services/table-service'

interface CallStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
}

export default function StaffModal({ isOpen, onClose }: CallStaffModalProps) {
  const [reason, setReason] = useState('')
  const handleSubmit = async () => {
    try {
      const tableCode = getItem<string>('tableCode')
      const tableID = getItem<string>('tableId')
      const tablesService = TableService.getInstance()
      const apiResponse = await tablesService.callStaff(
        `${tableID}`,
        `Gọi nhân viên tới bàn ${tableCode} với yêu cầu: ${reason}`
      )

      if (apiResponse.success) {
        toast.success('Gọi nhân viên thành công!', {
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#11aa77',
            color: '#fff',
            borderRadius: '10px'
          }
        })
        // Close the modal first to prevent UI issues during navigation

        // Navigate to the payment page on success
      } else {
        alert('Không thể gọi nhân viên. Vui lòng thử lại sau.')
      }
    } catch (error) {
      console.error('Error calling staff:', error)
      alert('Đã xảy ra lỗi. Vui lòng thử lại sau.')
    } finally {
      onClose() // Close the modal in any case
      // Make sure modal is closed in any case
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 bg-black bg-opacity-55 flex items-end justify-center  z-50'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className='bg-white rounded-t-lg w-full overflow-hidden'
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
          >
            {/* Header */}
            <div className='px-6 py-4 border-b flex items-center justify-between'>
              <div className=' w-[20px]'></div>
              <h2 className='text-lg font-semibold'>Gọi nhân viên</h2>
              <Button variant='ghost' size='icon' onClick={onClose}>
                <X className='h-5 w-5' />
                <span className='sr-only'>Close</span>
              </Button>
            </div>

            {/* Content */}
            <div className='p-6'>
              <div className='space-y-4'>
                <div>
                  <label htmlFor='reason' className='block text-base text-gray-700 mb-2'>
                    Lý do gọi nhân viên
                  </label>
                  <textarea
                    id='reason'
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder='Ví dụ: Lấy thêm bát đũa, dọn bàn,...'
                    className='w-full min-h-[80px] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>

                {/* Submit Button */}
                <button
                  className='w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed'
                  onClick={handleSubmit}
                  disabled={!reason.trim()}
                >
                  Gửi yêu cầu
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
