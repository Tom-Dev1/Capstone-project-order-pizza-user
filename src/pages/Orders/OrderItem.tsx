import React from 'react'
import { useSelector } from 'react-redux'
import type { CartItem } from '@/redux/stores/cartSlice'
import { Trash2, Plus, Minus } from 'lucide-react'
import type { RootState } from '@/redux/stores/store'
import { selectNote } from '@/redux/stores/noteSlice'
import { selectTotalPrice } from '@/redux/stores/selectedOptionsSlice'
import { motion } from 'framer-motion'

interface OrderItemProps {
  item: CartItem
  onRemove: (uniqueId: string) => void
}

export const OrderItem: React.FC<OrderItemProps> = ({ item, onRemove }) => {
  const note = useSelector((state: RootState) => selectNote(state, item.id))
  const totalPrice = useSelector((state: RootState) => selectTotalPrice(state, item.id))
  const optionsText = item.selectedOptions.map((option) => `${option.name} (+$${option.additionalPrice})`).join(', ')

  return (
    <motion.div
      className='flex items-start space-x-4 p-4 border-b last:border-b-0'
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
    >
      <img
        src={item.image || 'https://pizza4ps.com/wp-content/uploads/2024/04/BYO_Garlic-Shrimp-Pizza-1.jpg'}
        alt={item.name}
        className='w-20 h-20 object-cover rounded-md'
      />
      <div className='flex-grow'>
        <h3 className='font-semibold text-lg text-gray-800'>{item.name}</h3>
        {optionsText && <p className='text-sm text-gray-500 mt-1'>{optionsText}</p>}
        {note && <p className='text-sm text-gray-500 italic mt-1 bg-gray-100 p-2 rounded'>Note: {note}</p>}
        <div className='flex items-center justify-between mt-2'>
          <p className='text-lg font-medium text-gray-700'>${totalPrice.toFixed(2)}</p>
          <div className='flex items-center space-x-2'>
            <span className='font-semibold text-gray-800'>{item.quantity}</span>
            <button
              onClick={() => onRemove(item.id)}
              className='p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-colors duration-200'
              aria-label='Remove item'
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
