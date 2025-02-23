"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { X, ShoppingCart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { ProductModel } from "@/types/product"
import type { RootState } from "@/redux/stores/store"
import OptionItem from "@/types/option"
import { selectNote, setNote } from "@/redux/stores/noteSlice"

interface ProductModalProps {
  product: ProductModel
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: ProductModel, selectedOptions: OptionItem[]) => void
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const dispatch = useDispatch()
  const [localSelectedOptions, setLocalSelectedOptions] = useState<OptionItem[]>([])
  const note = useSelector((state: RootState) => selectNote(state, product.id))
  const [localNote, setLocalNote] = useState(note)

  useEffect(() => {
    setLocalNote(note)
  }, [note])

  const handleOptionChange = (option: OptionItem) => {
    setLocalSelectedOptions((prev) => {
      const existingOptionIndex = prev.findIndex((opt) => opt.id === option.id)
      if (existingOptionIndex !== -1) {
        return prev.filter((_, index) => index !== existingOptionIndex)
      } else {
        const newOptions = prev.filter((opt) => opt.id !== option.id)
        return [...newOptions, option]
      }
    })
  }

  const handleAddToCart = () => {
    dispatch(setNote({ productId: product.id, note: localNote }))
    onAddToCart(product, localSelectedOptions)
    onClose()
  }

  const isOptionSelected = (item: OptionItem) => {
    return localSelectedOptions.some((opt) => opt.id === item.id)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="bg-white rounded-lg w-full max-w-md mx-auto overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{product.name}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="px-6 py-4">
              <img
                src={product.image || "https://pizza4ps.com/wp-content/uploads/2023/08/BYO_Cold-Cuts_S-2-scaled.jpg"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <p className="text-gray-600 mb-4">{product.description}</p>

              {product.productOptions && product.productOptions.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Options</h3>
                  {product.productOptions.map((productOption) => (
                    <div key={productOption.id} className="mb-4">
                      <h4 className="font-medium">{productOption.option.name}</h4>
                      <p className="text-sm text-gray-500 mb-2">{productOption.option.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {productOption.option.optionItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleOptionChange(item)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${isOptionSelected(item)
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                              }`}
                          >
                            {item.name} (+${item.additionalPrice.toFixed(2)})
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Note</h3>
                <textarea
                  value={localNote}
                  onChange={(e) => setLocalNote(e.target.value)}
                  placeholder="Add a note for this item"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold">Total: ${product.price.toFixed(2)}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="bg-blue-800 text-white px-4 py-2 rounded-full flex items-center"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Add to Cart
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProductModal

