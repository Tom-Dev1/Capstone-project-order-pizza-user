'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import useTable from '@/hooks/useTable'
import { useOrderService } from '@/hooks/useOrderService'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/redux/stores/store'
import type { OrderItem } from '@/types/order'
import { motion, AnimatePresence } from 'framer-motion'
import { getPaymentStatus } from '@/utils/status-order-utils'
import { PAYMENT_STATUS } from '@/types/order'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '@/redux/slices/cartSlice'

const CheckoutProcessButton: React.FC = () => {
  const { tableId_gbId, currentOrderId_ } = useTable()
  const { createOrder, addFoodToOrder, isLoading, order } = useOrderService()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const cartItems = useSelector((state: RootState) => state.cart.items)
  const notes = useSelector((state: RootState) => state.notes)
  // const selectedOptions = useSelector((state: RootState) => state.selectedOptions)

  const orderItems: OrderItem[] = cartItems.map((item) => {
    const itemNotes = notes[item.categoryId]?.[item.id]?.[item.optionsHash] || []
    const combinedNote = itemNotes.join(" + ")
    return {
      productId: item.id,
      optionItemIds: item.selectedOptions.map((option) => option.id),
      quantity: item.quantity,
      note: combinedNote,
    }
  })

  console.log(orderItems);

  useEffect(() => {
    if (currentOrderId_ !== null) {
      setOrderId(currentOrderId_)
    }
  }, [currentOrderId_])

  console.log("currentOrderId_", currentOrderId_);

  const handleOpenModal = async () => {
    const orderStatus = getPaymentStatus(order?.[0]?.status)
    if (orderStatus === PAYMENT_STATUS.PAID) {
      if (currentOrderId_ === null) {
        try {
          if (!tableId_gbId) {
            throw new Error('No table ID available')
          }
          const createResponse = await createOrder(JSON.stringify({ tableId: tableId_gbId }))

          if (!createResponse || !createResponse.success) {
            throw new Error(createResponse?.message || 'Failed to create a new order')
          }
          const newOrderId = createResponse.result.result.id
          setOrderId(newOrderId)
        } catch (err) {
          console.error('Error creating order:', err)
          setError(err instanceof Error ? err.message : 'An unknown error occurred')
          return
        }
      } else {
        setOrderId(currentOrderId_)
      }
    } else if (orderStatus === PAYMENT_STATUS.CHECKOUT) {
      navigate('/')
    } else if (orderStatus === PAYMENT_STATUS.UNPAID) {
      if (currentOrderId_ === null) {
        try {
          if (!tableId_gbId) {
            throw new Error('No table ID available')
          }
          const createResponse = await createOrder(JSON.stringify({ tableId: tableId_gbId }))

          if (!createResponse || !createResponse.success) {
            throw new Error(createResponse?.message || 'Failed to create a new order')
          }
          const newOrderId = createResponse.result.result.id
          setOrderId(newOrderId)
        } catch (err) {
          console.error('Error creating order:', err)
          setError(err instanceof Error ? err.message : 'An unknown error occurred')
          return
        }
      } else {
        setOrderId(currentOrderId_)
      }
    }
    setShowConfirmModal(true)
  }

  const handleCloseModal = () => {
    setShowConfirmModal(false)
  }

  const validateOrderItems = (items: OrderItem[]): boolean => {
    return items.every((item) => item.productId && item.quantity > 0 && Array.isArray(item.optionItemIds))
  }

  const handleConfirmCheckout = async () => {
    setError(null)
    setSuccess(null)

    try {
      if (!orderId) {
        throw new Error('No order ID available')
      }

      if (!validateOrderItems(orderItems)) {
        throw new Error('Invalid order items')
      }

      const addFoodResponse = await addFoodToOrder(
        JSON.stringify({
          orderId: orderId,
          orderItems: orderItems.map((item) => ({
            productId: item.productId,
            optionItemIds: item.optionItemIds,
            quantity: item.quantity,
            note: item.note || 'No Comment'
          }))
        })
      )
      if (!addFoodResponse || !addFoodResponse.success) {
        throw new Error(addFoodResponse?.message || 'Failed to add food to the order')
      }

      dispatch(clearCart())
      setShowConfirmModal(false)
      setSuccess('Order placed successfully!')
      console.log(success);

    } catch (err) {
      console.error('Adding food to order failed:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  return (
    <div className='relative'>
      <Button
        className='w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:bg-orange-300'
        onClick={handleOpenModal}
        disabled={isLoading || cartItems.length === 0}
      >
        {isLoading ? <Loader2 className='mr-2 h-5 w-5 animate-spin' /> : 'Proceed to Checkout'}
      </Button>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-red-500 mt-3 text-center bg-red-50 p-3 rounded-lg'
        >
          {error}
        </motion.p>
      )}

      {success && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-green-500 mt-3 text-center bg-green-50 p-3 rounded-lg'
        >
          {success}
        </motion.p>
      )}

      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className='bg-white p-6 rounded-xl shadow-xl max-w-md w-full'
            >
              <h2 className='text-2xl font-bold mb-4 text-gray-800'>Confirm Order</h2>
              <p className='mb-6 text-gray-600'>Are you ready to place your order?</p>
              <div className='flex justify-end space-x-3'>
                <Button variant='outline' onClick={handleCloseModal} disabled={isLoading} className='hover:bg-gray-100'>
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmCheckout}
                  disabled={isLoading}
                  className='bg-orange-500 hover:bg-orange-600 text-white'
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Processing...
                    </>
                  ) : (
                    'Confirm Order'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CheckoutProcessButton
