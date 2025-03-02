'use client'

import type React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, ChevronLeft, ShoppingCart, Edit2 } from 'lucide-react'
import { addToCart, updateCartItem, selectCartItem } from '@/redux/stores/cartSlice'
import { selectNote, setNote } from '@/redux/stores/noteSlice'
import { setSelectedOptions, selectTotalPrice } from '@/redux/stores/selectedOptionsSlice'
import type { RootState } from '@/redux/stores/store'
import type { ProductModel } from '@/types/product'
import type OptionItem from '@/types/option'
import MiniModal from './MiniModal'

interface ProductModalProps {
  product: ProductModel
  isOpen: boolean
  onClose: () => void
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const dispatch = useDispatch()
  const cartItem = useSelector((state: RootState) => selectCartItem(state, product.id))
  const [localSelectedOptions, setLocalSelectedOptions] = useState<OptionItem[]>([])
  const note = useSelector((state: RootState) => selectNote(state, product.id))
  const [localNote, setLocalNote] = useState(note || '')
  const [quantity, setQuantity] = useState(1)
  const [isEditing, setIsEditing] = useState(false)
  const totalPrice = useSelector((state: RootState) => selectTotalPrice(state, product.id))
  const [showMiniModal, setShowMiniModal] = useState(false)
  useEffect(() => {
    if (isOpen) {
      if (cartItem) {
        setIsEditing(true)
        setQuantity(cartItem.quantity)
        setLocalNote(note || '')
        setLocalSelectedOptions(cartItem.selectedOptions)
      } else {
        setIsEditing(false)
        setQuantity(1)
        setLocalNote('')
        setLocalSelectedOptions([])
      }
      dispatch(
        setSelectedOptions({
          productId: product.id,
          basePrice: product.price,
          options: cartItem ? cartItem.selectedOptions : []
        })
      )
    }
  }, [isOpen, cartItem, note, product.id, product.price, dispatch])

  const handleOptionChange = useCallback(
    (option: OptionItem) => {
      setLocalSelectedOptions((prev) => {
        const existingOptionIndex = prev.findIndex((opt) => opt.id === option.id)
        if (existingOptionIndex !== -1) {
          const newOptions = prev.filter((_, index) => index !== existingOptionIndex)
          dispatch(
            setSelectedOptions({
              productId: product.id,
              basePrice: product.price,
              options: newOptions
            })
          )
          return newOptions
        } else {
          const newOptions = [...prev.filter((opt) => opt.id !== option.id), option]
          dispatch(
            setSelectedOptions({
              productId: product.id,
              basePrice: product.price,
              options: newOptions
            })
          )
          return newOptions
        }
      })
    },
    [dispatch, product.id, product.price]
  )

  const handleAddOrUpdateCart = useCallback(() => {
    if (localNote) {
      dispatch(setNote({ productId: product.id, note: localNote }))
    }
    if (isEditing) {
      dispatch(updateCartItem({ productId: product.id, selectedOptions: localSelectedOptions, quantity }))
    } else {
      dispatch(addToCart({ product, selectedOptions: localSelectedOptions, quantity }))
    }
    setShowMiniModal(true)
    setTimeout(() => {
      setShowMiniModal(false)
    }, 2000)
    onClose()
  }, [dispatch, product, localNote, isEditing, localSelectedOptions, quantity, onClose])

  const isOptionSelected = useCallback(
    (item: OptionItem) => {
      return localSelectedOptions.some((opt) => opt.id === item.id)
    },
    [localSelectedOptions]
  )

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  const modalVariants = {
    hidden: { y: '100%' },
    visible: { y: 0 },
    exit: { y: '100%' }
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key='modal-overlay'
            variants={overlayVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50'
            onClick={onClose}
          >
            <motion.div
              key='modal-container'
              variants={modalVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              transition={{ type: 'spring', damping: 40, stiffness: 500 }}
              className='bg-white w-full rounded-t-2xl overflow-hidden max-h-[calc(100vh-100px)]'
              style={{ height: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div key='modal-content' variants={contentVariants} initial='hidden' animate='visible' exit='exit'>
                {/* Header */}
                <div className='sticky top-0 bg-white px-6 py-4 border-b flex items-center gap-4 z-10'>
                  <button onClick={onClose} className='p-1 hover:bg-gray-100 rounded-full transition-colors'>
                    <ChevronLeft size={28} className='text-gray-800 mt-1' />
                  </button>
                  <div>
                    <h2 className='text-2xl font-bold text-gray-800'>{product.name}</h2>
                  </div>
                </div>

                {/* Content */}
                <div className='overflow-y-auto pb-24' style={{ maxHeight: 'calc(100vh - 180px)' }}>
                  {/* Product Image */}
                  <div className='relative h-64 bg-gray-100'>
                    <img
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent' />
                  </div>

                  {/* Product Details */}
                  <div className='px-6 py-4'>
                    <p className='text-gray-600 text-sm leading-relaxed'>{product.description}</p>

                    {/* Options */}
                    {product.productOptions?.length > 0 && (
                      <div className='mt-6 space-y-6'>
                        {product.productOptions.map((productOption) => (
                          <motion.div
                            key={productOption.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className='flex flex-col mb-3'>
                              <h3 className='font-semibold text-gray-800'>{productOption.option.name}</h3>
                              <span className='mt-1 text-sm text-orange-500'>{productOption.option.description}</span>
                            </div>
                            <div className='grid grid-cols-2 gap-2'>
                              {productOption.option.optionItems.map((item) => (
                                <motion.button
                                  key={`${productOption.id}-${item.id}`}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleOptionChange(item)}
                                  className={`relative p-3 rounded-2xl text-left transition-all duration-200 ${
                                    isOptionSelected(item)
                                      ? 'bg-orange-200 border-2 border-orange-400'
                                      : 'bg-gray-100 border-2 border-gray-100'
                                  }`}
                                >
                                  <div className='flex justify-around items-start'>
                                    <span className='font-medium text-gray-800'>{item.name}</span>
                                    <span className='text-base font-base text-gray-700'>+${item.additionalPrice}</span>
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Note Section */}
                    <motion.div
                      key='note-section'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className='mt-6'
                    >
                      <h1 className='text-xl text-orange-500'>Thêm ghi chú</h1>
                      <motion.div layout className='mt-3'>
                        <textarea
                          value={localNote}
                          onChange={(e) => setLocalNote(e.target.value)}
                          placeholder='Add any special requests, allergies, or preferences...'
                          className='w-full p-3 border-2 border-gray-100 rounded-xl focus:border-orange-500  text-base'
                          rows={3}
                        />
                      </motion.div>
                    </motion.div>

                    {/* Quantity */}
                    <motion.div
                      key='quantity-section'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className='mt-6 flex items-center justify-between'
                    >
                      <span className='font-medium text-gray-800'>Số lượng</span>
                      <div className='flex items-center gap-3 bg-gray-50 rounded-full p-1'>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                          className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors'
                        >
                          <Minus size={16} className='text-gray-600' />
                        </motion.button>
                        <span className='w-8 text-center font-medium'>{quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQuantity((prev) => prev + 1)}
                          className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors'
                        >
                          <Plus size={16} className='text-gray-600' />
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              {/* Footer */}
              <div className='fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 flex items-center justify-center w-full'>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddOrUpdateCart}
                  className={`px-12 py-3 w-96 rounded-md flex justify-center items-center text-white font-semibold ${
                    isEditing ? 'bg-orange-500' : 'bg-orange-500'
                  }`}
                >
                  <div className='w-20'>${totalPrice * quantity}</div>
                  <div>-</div>
                  <div className='w-28'>{isEditing ? 'Update Cart' : 'Add to Cart'}</div>
                  <div>{isEditing ? <Edit2 size={20} /> : <ShoppingCart size={20} />}</div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMiniModal && (
          <MiniModal key='mini-modal' productName={product.name} productImage={product.image} isEditing={isEditing} />
        )}
      </AnimatePresence>
    </>
  )
}

export default ProductModal
