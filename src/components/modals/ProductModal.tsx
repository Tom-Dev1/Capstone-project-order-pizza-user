
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, ShoppingCart, Edit2 } from "lucide-react"
import { addToCart, updateCartItem, selectCartItem } from "@/redux/stores/cartSlice"
import { selectNote, setNote } from "@/redux/stores/noteSlice"
import { setSelectedOptions, selectTotalPrice } from "@/redux/stores/selectedOptionsSlice"
import type { RootState } from "@/redux/stores/store"
import type { ProductModel } from "@/types/product"
import type OptionItem from "@/types/option"
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
  const [localNote, setLocalNote] = useState(note || "")
  const [quantity, setQuantity] = useState(1)
  const [isEditing, setIsEditing] = useState(false)
  const totalPrice = useSelector((state: RootState) => selectTotalPrice(state, product.id))

  useEffect(() => {
    if (isOpen) {
      if (cartItem) {
        setIsEditing(true)
        setQuantity(cartItem.quantity)
        setLocalNote(note || "")
        setLocalSelectedOptions(cartItem.selectedOptions)
      } else {
        setIsEditing(false)
        setQuantity(1)
        setLocalNote("")
        setLocalSelectedOptions([])
      }
      // Initialize the selected options with the base price when opening the modal
      dispatch(setSelectedOptions({
        productId: product.id,
        basePrice: product.price,
        options: cartItem ? cartItem.selectedOptions : [],
      }))
    }
  }, [isOpen, cartItem, note, product.id, product.price, dispatch])

  const handleOptionChange = useCallback((option: OptionItem) => {
    setLocalSelectedOptions((prev) => {
      const existingOptionIndex = prev.findIndex((opt) => opt.id === option.id)
      if (existingOptionIndex !== -1) {
        const newOptions = prev.filter((_, index) => index !== existingOptionIndex)
        dispatch(setSelectedOptions({
          productId: product.id,
          basePrice: product.price,
          options: newOptions,
        }))
        return newOptions
      } else {
        const newOptions = [...prev.filter((opt) => opt.id !== option.id), option]
        dispatch(setSelectedOptions({
          productId: product.id,
          basePrice: product.price,
          options: newOptions,
        }))
        return newOptions
      }
    })
  }, [dispatch, product.id, product.price])

  const handleAddOrUpdateCart = useCallback(() => {
    if (localNote) {
      dispatch(setNote({ productId: product.id, note: localNote }))
    }

    if (isEditing) {
      dispatch(updateCartItem({ productId: product.id, selectedOptions: localSelectedOptions, quantity }))
    } else {
      dispatch(addToCart({ product, selectedOptions: localSelectedOptions, quantity }))
    }
    onClose()
  }, [dispatch, product, localNote, isEditing, localSelectedOptions, quantity, onClose])

  const isOptionSelected = useCallback((item: OptionItem) => {
    return localSelectedOptions.some((opt) => opt.id === item.id)
  }, [localSelectedOptions])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 40, stiffness: 500 }}
            className="bg-white w-full rounded-t-lg overflow-hidden"
            style={{ height: 'calc(100vh - 200px)', zIndex: 10000 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between z-10">
              <h2 className="text-xl font-bold">{product.name}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto pb-16" style={{ height: 'calc(100% - 64px)' }}>
              <img
                src={product.image || "https://pizza4ps.com/wp-content/uploads/2024/04/BYO_Garlic-Shrimp-Pizza-1.jpg"}
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
                            {item.name} (+${item.additionalPrice})
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
                  placeholder="Add a note for this item (optional)"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Quantity:</span>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="bg-gray-200 text-gray-600 p-2 rounded-l-md hover:bg-gray-300"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="bg-gray-100 px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="bg-gray-200 text-gray-600 p-2 rounded-r-md hover:bg-gray-300"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-between items-center">
              <span className="text-lg font-bold">Total: ${(totalPrice * quantity).toFixed(2)}</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddOrUpdateCart}
                className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center"
              >
                {isEditing ? <Edit2 size={20} className="mr-2" /> : <ShoppingCart size={20} className="mr-2" />}
                {isEditing ? "Update Cart" : "Add to Cart"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProductModal

