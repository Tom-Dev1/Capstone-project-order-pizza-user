import type React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCartItems, removeFromCart } from '@/redux/stores/cartSlice'
import { ShoppingCart } from 'lucide-react'
import { OrderItem } from './OrderItem'
import CheckoutProcessButton from './CheckoutProcessButton'
import { selectTotalPrice } from '@/redux/stores/selectedOptionsSlice'
import type { RootState } from '@/redux/stores/store'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Orders: React.FC = () => {
  const cartItems = useSelector(selectCartItems)
  const dispatch = useDispatch()

  const totalPrice = useSelector((state: RootState) =>
    cartItems.reduce((total, item) => {
      const itemTotalPrice = selectTotalPrice(state, item.id)
      return total + itemTotalPrice * item.quantity
    }, 0)
  )

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId))
  }

  return (
    <div className='bg-gray-100 min-h-screen'>
      <div className='max-w-3xl mx-auto px-4 py-8'>
        <div className='flex items-center mb-6'>
          <h1 className='text-3xl font-bold text-gray-800'>Đơn hàng của bạn</h1>
        </div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white rounded-lg shadow-md p-8 text-center'
          >
            <ShoppingCart size={64} className='text-gray-400 mb-4 mx-auto' />
            <p className='text-xl text-gray-600 mb-6'>Giỏ hàng của bạn trống.</p>
            <Link
              to='/action/foods'
              className=' text-white py-3 px-6 rounded-full font-semibold bg-orange-500 hover:bg-orange-600 transition-colors inline-block'
            >
              Đặt hàng ngay
            </Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }}>
            <div className='bg-white rounded-lg shadow-md overflow-hidden mb-6'>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <OrderItem item={item} onRemove={() => handleRemove(item.id)} />
                </motion.div>
              ))}
            </div>
            <motion.div
              className='bg-white rounded-lg shadow-md p-6'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: cartItems.length * 0.1 }}
            >
              <div className='flex justify-between items-center mb-6'>
                <span className='text-lg text-gray-600'>Total:</span>
                <span className='text-3xl font-bold text-gray-800'>${totalPrice.toFixed(2)}</span>
              </div>
              <CheckoutProcessButton />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Orders
