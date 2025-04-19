'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Star from '../Icons/Star'
import FeedbackModal from './FeedbackModal'
import useTable from '@/hooks/useTable'
import FeedbackService from '@/services/feedback-service'

interface FeedbackData {
  rating: number
  issues: string[]
  comment: string
  phone: string
}

const RatingModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { currentOrderId_ } = useTable()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openModal = () => {
    if (!currentOrderId_) {
      toast.error('Bạn cần có đơn hàng để đánh giá!', {
        duration: 3000,
        position: 'bottom-center',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff'
        }
      })
      return
    }
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleSubmit = async (feedback: FeedbackData) => {
    if (!currentOrderId_) {
      toast.error('Không thể đánh giá khi không có đơn hàng!')
      return
    }

    try {
      setIsSubmitting(true)

      const feedbackService = FeedbackService.getInstance()
      await feedbackService.submitFeedback({
        rating: feedback.rating,
        comments:
          feedback.comment +
          (feedback.issues.length > 0 ? `\nVấn đề: ${feedback.issues.join(', ')}` : '') +
          `\nSĐT: ${feedback.phone}`,
        orderId: currentOrderId_
      })

      toast.success('Cảm ơn bạn đã đánh giá!', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#11aa77',
          color: '#fff',
          borderRadius: '10px'
        }
      })
      closeModal()
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau!')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div
        className='bg-blue-100 h-24 w-full rounded-lg p-2 cursor-pointer relative overflow-hidden'
        onClick={openModal}
      >
        <div className='mt-1 flex justify-center items-center'>
          <Star />
        </div>
        <h1 className='mt-1 text-sm font-normal text-center'>Đánh giá</h1>
        {!currentOrderId_ && (
          <div className='absolute inset-0 bg-gray-200 bg-opacity-70 flex items-center justify-center'>
            <span className='text-xs text-gray-600 font-medium text-center px-2'>Cần có đơn hàng để đánh giá</span>
          </div>
        )}
      </div>
      <FeedbackModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </>
  )
}

export default RatingModal
