import type React from 'react'
import { useSelector } from 'react-redux'
import type { CartItem } from '@/redux/stores/cartSlice'
import { Trash2 } from 'lucide-react'
import type { RootState } from '@/redux/stores/store'
import { selectNote } from '@/redux/stores/noteSlice'
import { selectTotalPrice } from '@/redux/stores/selectedOptionsSlice'

interface OrderItemProps {
  item: CartItem
  onRemove: (uniqueId: string) => void
}

export const OrderItem: React.FC<OrderItemProps> = ({ item, onRemove }) => {
  const note = useSelector((state: RootState) => selectNote(state, item.id))
  const totalPrice = useSelector((state: RootState) => selectTotalPrice(state, item.id))
  const optionsText = item.selectedOptions.map((option) => `${option.name} (+$${option.additionalPrice})`).join(', ')

  return (
    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-orange-100 hover:border-orange-200 transition-colors'>
      <div className='flex items-start space-x-4 mb-2 sm:mb-0'>
        <img
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          className='w-20 h-20 object-cover rounded-lg shadow-sm'
        />
        <div>
          <h3 className='font-semibold text-gray-800'>{item.name}</h3>
          {optionsText && <p className='text-sm text-gray-500 mt-1'>{optionsText}</p>}
          {note && <p className='text-sm text-orange-600 italic mt-1'>Note: {note}</p>}
          <p className='text-lg font-semibold text-orange-500 mt-1'>${totalPrice}</p>
        </div>
      </div>
      <div className='flex items-center space-x-4 mt-2 sm:mt-0'>
        <span className='px-3 py-1 bg-orange-50 text-orange-600 rounded-full font-medium'>Qty: {item.quantity}</span>
        <button
          onClick={() => onRemove(item.id)}
          className='p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-all duration-200 hover:scale-105'
          aria-label='Remove item'
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
