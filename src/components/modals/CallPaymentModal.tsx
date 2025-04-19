import { useState } from 'react'
import Cash from '../Icons/Cash'
import PaymentModal from './PaymentModal'
import { getItem } from '@/constants'
import TableService from '@/services/table-service'

const CallPaymentModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleSubmit = async (paymentOptionId: string) => {
    console.log('Selected payment option:', paymentOptionId)
    try {
      const tableCode = getItem<string>('tableCode')
      const tableID = getItem<string>('tableId')
      const tablesService = TableService.getInstance()
      const apiResponse = await tablesService.callStaff(
        `${tableID}`,
        `Gọi nhân viên thanh toán bàn ${tableCode} với phương thức: ${paymentOptionId}`
      )

      if (apiResponse.success) {
        // Close the modal first to prevent UI issues during navigation
        // Navigate to the payment page on success
      } else {
        alert('Không thể gọi nhân viên. Vui lòng thử lại sau.')
      }
    } catch (error) {
      console.error('Error calling staff:', error)
      alert('Đã xảy ra lỗi. Vui lòng thử lại sau.')
    } finally {
      closeModal()
    }
  }

  return (
    <>
      <div className='bg-[rgb(218,252,209)] h-24 w-full rounded-lg p-2 cursor-pointer' onClick={openModal}>
        <div className='mt-1 flex justify-center items-center'>
          <Cash />
        </div>
        <h1 className='mt-1 text-sm font-normal text-center'>Gọi thanh toán</h1>
      </div>
      <PaymentModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} />
    </>
  )
}

export default CallPaymentModal
