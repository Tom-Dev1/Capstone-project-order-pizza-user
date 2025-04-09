"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus, ChevronLeft, Check } from "lucide-react"
import type { RootState } from "@/redux/stores/store"
import type { ProductModel } from "@/types/product"
import MiniModal from "./MiniModal"
import { convertToVND } from "@/utils/convertToVND"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import type OptionItem from "@/types/product"
import { setNote } from "@/redux/slices/noteSlice"
import { addToCart } from "@/redux/slices/cartSlice"
import { selectTotalPrice, setSelectedOptions } from "@/redux/slices/selectedOptionsSlice"

export interface Option {
  id: string
  name: string
  selectMany: boolean
  description: string
  optionItems: OptionItem[]
}

interface ProductModalProps {
  product: ProductModel
  categoryId: string
  isOpen: boolean
  onClose: () => void
}

export default function ProductModal({ product, categoryId, isOpen, onClose }: ProductModalProps) {
  const dispatch = useDispatch()
  const [localSelectedOptions, setLocalSelectedOptions] = useState<OptionItem[]>([])
  const [localNote, setLocalNote] = useState("")
  const [quantity, setQuantity] = useState(1)
  const totalPrice = useSelector((state: RootState) => selectTotalPrice(state, product.id))
  const [showMiniModal, setShowMiniModal] = useState(false)

  const memoizedProduct = useMemo(() => product, [product])

  useEffect(() => {
    if (isOpen) {
      setQuantity(1)
      setLocalNote("")
      setLocalSelectedOptions([])
      dispatch(
        setSelectedOptions({
          productId: memoizedProduct.id,
          basePrice: memoizedProduct.price,
          options: [],
        }),
      )
    }
  }, [isOpen, memoizedProduct, dispatch])

  const handleOptionChange = useCallback(
    (option: OptionItem, productOption: Option) => {
      setLocalSelectedOptions((prev) => {
        const isOptionSelected = prev.some((opt) => opt.id === option.id)
        let updatedOptions

        if (isOptionSelected) {
          // If already selected, remove it
          updatedOptions = prev.filter((opt) => opt.id !== option.id)
        } else {
          if (productOption.selectMany) {
            // If selectMany is true, add to existing selections
            updatedOptions = [...prev, option]
          } else {
            // If selectMany is false, remove any other options from the same group and add the new one
            updatedOptions = [
              ...prev.filter(
                (opt) =>
                  // Keep options from other groups
                  !productOption.optionItems.some((item) => item.id === opt.id),
              ),
              option,
            ]
          }
        }

        dispatch(
          setSelectedOptions({
            productId: memoizedProduct.id,
            basePrice: memoizedProduct.price,
            options: updatedOptions,
          }),
        )

        return updatedOptions
      })
    },
    [dispatch, memoizedProduct],
  )

  const handleAddToCart = useCallback(() => {
    if (localNote) {
      dispatch(
        setNote({
          productId: memoizedProduct.id,
          categoryId,
          note: localNote,
          selectedOptions: localSelectedOptions,
        }),
      )
    }
    dispatch(
      addToCart({
        product: {
          ...memoizedProduct,
          price: totalPrice, // Use the calculated total price
        },
        categoryId,
        selectedOptions: localSelectedOptions,
        quantity,
      }),
    )
    setShowMiniModal(true)
    setTimeout(() => {
      setShowMiniModal(false)
    }, 2000)
    onClose()
  }, [dispatch, memoizedProduct, categoryId, localNote, localSelectedOptions, quantity, onClose, totalPrice])

  const isOptionSelected = useCallback(
    (item: OptionItem) => {
      return localSelectedOptions.some((opt) => opt.id === item.id)
    },
    [localSelectedOptions],
  )

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="max-h-[82vh] rounded-t-lg flex flex-col p-0">
          {/* Header */}
          <div className="sticky top-0 bg-white px-4 mt-3 flex items-center gap-4 z-10">
            <button onClick={onClose} className="p-1 rounded-full transition-colors" aria-label="Close modal">
              <ChevronLeft size={28} className="text-gray-800 mt-1" />
            </button>
            <div>
              <SheetTitle className="text-2xl w-80 font-bold text-gray-800 truncate">{memoizedProduct.name}</SheetTitle>
            </div>
          </div>

          {/* Product Content */}
          <div className="overflow-y-auto">
            {/* Product Image */}
            <div className="relative h-64 bg-gray-100">
              <img
                src={memoizedProduct.imageUrl || "https://pizza4ps.com/wp-content/uploads/2023/07/20200001_2.jpg"}
                alt={memoizedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Product Details */}
            <div className="px-6 py-4">
              <SheetDescription className="text-gray-600 text-sm italic leading-relaxed">
                "{memoizedProduct.description}"
              </SheetDescription>
              {/* Options */}
              {memoizedProduct.options?.length > 0 && (
                <div className="mt-2 space-y-6">
                  {memoizedProduct.options.map((productOption) => (
                    <div key={productOption.id}>
                      <div className="flex flex-col mb-3">
                        <h3 className="text-xl text-orange-500">{productOption.name}</h3>
                        <p className="text-sm text-gray-500">
                          {productOption.selectMany ? "Chọn nhiều" : "Chỉ chọn một"}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {productOption.optionItems.map((item) => (
                          <motion.button
                            key={`${productOption.id}-${item.id}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleOptionChange(item, productOption)}
                            className={`relative p-2 rounded-xl text-left transition-all duration-200 ${isOptionSelected(item)
                                ? "bg-orange-200 border-2 border-orange-400"
                                : "bg-gray-100 border-2 border-gray-100"
                              }`}
                            aria-pressed={isOptionSelected(item)}
                          >
                            <div className="flex justify-between px-2">
                              <div className="w-40 flex items-center gap-2">
                                {!productOption.selectMany && (
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isOptionSelected(item) ? "border-orange-500 bg-orange-100" : "border-gray-300"
                                      }`}
                                  >
                                    {isOptionSelected(item) && <div className="w-3 h-3 rounded-full bg-orange-500" />}
                                  </div>
                                )}
                                {productOption.selectMany && (
                                  <div
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${isOptionSelected(item) ? "border-orange-500 bg-orange-100" : "border-gray-300"
                                      }`}
                                  >
                                    {isOptionSelected(item) && <Check size={14} className="text-orange-500" />}
                                  </div>
                                )}
                                <span className="font-medium text-gray-800">{item.name}</span>
                              </div>
                              <div className="w-32">
                                <h1 className="text-base text-right font-base text-gray-700">
                                  +{convertToVND(item.additionalPrice)}VND
                                </h1>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                        <div className="mt-4 border-b border-dashed"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Note Section */}
              <motion.div
                key="note-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-3"
              >
                <h3 className="text-xl text-orange-500">Thêm ghi chú</h3>
                <motion.div layout className="mt-3">
                  <textarea
                    value={localNote}
                    onChange={(e) => setLocalNote(e.target.value)}
                    placeholder="Ghi chú món ăn của bạn...."
                    className="w-full p-3 border-2 rounded-xl text-base"
                    rows={3}
                  />
                </motion.div>
              </motion.div>
              {/* Quantity */}
              <motion.div
                key="quantity-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 flex items-center justify-between"
              >
                <span className="font-medium text-gray-800">Số lượng</span>
                <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 flex items-center bg-orange-200 justify-center rounded-full transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} className="text-gray-600" />
                  </motion.button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="w-7 h-7 flex items-center bg-orange-200 justify-center rounded-full transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} className="text-gray-600" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="bg-white border-t px-4 py-3 mt-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="px-12 py-3 w-full rounded-md flex justify-center items-center text-white font-semibold bg-my-color"
            >
              <div className="w-28">Thêm vào giỏ</div>
              <div className="w-20">{convertToVND(totalPrice * quantity)}VND</div>
            </motion.button>
          </div>
        </SheetContent>
      </Sheet>

      <AnimatePresence>
        {showMiniModal && (
          <MiniModal key="mini-modal" productName={memoizedProduct.name} productImage={memoizedProduct.imageUrl} />
        )}
      </AnimatePresence>
    </>
  )
}
