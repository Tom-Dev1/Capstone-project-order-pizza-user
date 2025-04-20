'use client'

import type React from 'react'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (feedback: FeedbackData) => void
  isSubmitting?: boolean
}

interface FeedbackData {
  rating: number
  issues: string[]
  comment: string
  phone: string
}

export default function FeedbackModal({ isOpen, onClose, onSubmit, isSubmitting = false }: FeedbackModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedIssues, setSelectedIssues] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const issues = [
    'Vệ sinh không sạch sẽ',
    'Nhân viên không nhiệt tình',
    'Món ăn không ngon',
    'Món ăn phục vụ lâu',
    'Giá không phù hợp với chất lượng',
    'Không gian bất tiện',
    'Không gian ồn'
  ]

  const handleIssueToggle = (issue: string) => {
    setSelectedIssues((prev) => (prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]))
  }

  const validatePhone = (phoneNumber: string) => {
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
    return phoneRegex.test(phoneNumber)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhone(value)
    if (value && !validatePhone(value)) {
      setPhoneError('Số điện thoại không hợp lệ')
    } else {
      setPhoneError('')
    }
  }

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá!')
      return
    }
    if (!phone) {
      toast.error('Vui lòng nhập số điện thoại!')
      return
    }
    if (!validatePhone(phone)) {
      toast.error('Số điện thoại không hợp lệ!')
      return
    }

    onSubmit({
      rating,
      issues: selectedIssues,
      comment,
      phone
    })

    // Reset form
    setRating(0)
    setSelectedIssues([])
    setComment('')
    setPhone('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 bg-black bg-opacity-55 flex items-end justify-center z-50'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className='bg-white rounded-t-lg w-full h-[480px] overflow-hidden flex flex-col'
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
          >
            {/* Header */}
            <div className='px-6 py-4 border-b flex items-center justify-between'>
              <div className='w-[20px]'></div>
              <h2 className='text-lg font-semibold'>Đánh giá của bạn</h2>
              <Button variant='ghost' size='icon' onClick={onClose}>
                <X className='h-5 w-5' />
                <span className='sr-only'>Close</span>
              </Button>
            </div>

            {/* Content */}
            <div className='p-6 flex-1 overflow-y-auto'>
              {/* Star Rating */}
              <div className='mb-4'>
                <div className='mb-2'>
                  <h2 className='text-lg font-semibold'>Trải nghiệm của bạn ở nhà hàng hôm nay thế nào?</h2>
                </div>
                <div className='flex items-center gap-1'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setRating(star)}
                      className='focus:outline-none'
                      disabled={isSubmitting}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoveredStar || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Issues */}
              <div className='mb-4'>
                <p className='text-sm text-gray-500 mb-2'>Bạn có điều gì chưa hài lòng phải không?</p>
                <div className='flex flex-wrap gap-2'>
                  {issues.map((issue) => (
                    <button
                      key={issue}
                      onClick={() => handleIssueToggle(issue)}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        selectedIssues.includes(issue) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}
                      disabled={isSubmitting}
                    >
                      {issue}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className='mb-4'>
                <textarea
                  maxLength={200}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder='Viết góp ý cho nhà hàng...'
                  className='w-full min-h-[80px] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  disabled={isSubmitting}
                />
              </div>

              {/* Phone Number */}
              <div className='mb-2'>
                <p className='text-sm text-gray-600 mb-2'>
                  Nhà hàng rất trân trọng và mong muốn phản hồi lại đánh giá trên, bạn vui lòng để lại số điện thoại nhé
                </p>
                <div className='space-y-1'>
                  <input
                    type='tel'
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder='Số điện thoại'
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      phoneError ? 'border-red-500' : ''
                    }`}
                    disabled={isSubmitting}
                  />
                  {phoneError && <p className='text-red-500 text-sm'>{phoneError}</p>}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className='p-6 border-t'>
              <button
                className='w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed'
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className='flex items-center justify-center'>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Đang gửi...
                  </div>
                ) : (
                  'Gửi đánh giá'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
