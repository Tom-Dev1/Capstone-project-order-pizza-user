"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus, ChevronLeft, } from "lucide-react"
import { addToCart, } from "@/redux/slices/cartSlice"
import { setNote } from "@/redux/slices/noteSlice"
import { setSelectedOptions, selectTotalPrice } from "@/redux/slices/selectedOptionsSlice"
import type { RootState } from "@/redux/stores/store"
import type { ProductModel } from "@/types/product"
import type OptionItem from "@/types/option"
import MiniModal from "./MiniModal"
import { convertToVND } from "@/utils/convertToVND"
import { Sheet, SheetContent, } from "@/components/ui/sheet"
interface ProductModalProps {
  product: ProductModel
  categoryId: string
  isOpen: boolean
  onClose: () => void
}

export default function ProductModal({ product, categoryId, isOpen, onClose }: ProductModalProps) {
  const dispatch = useDispatch()
  const [localSelectedOptions, setLocalSelectedOptions] = useState<OptionItem[]>([])
  // const cartItem = useSelector((state: RootState) =>
  //   selectCartItem(state, product.id, categoryId, localSelectedOptions),
  // )
  // const notes = useSelector((state: RootState) =>
  //   selectProductCategoryNotes(state, categoryId, product.id, localSelectedOptions),
  // )
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

  const handleOptionChange = useCallback((option: OptionItem) => {
    setLocalSelectedOptions((prev) => {
      const isOptionSelected = prev.some((opt) => opt.id === option.id)
      let updatedOptions

      if (isOptionSelected) {
        updatedOptions = prev.filter((opt) => opt.id !== option.id)
      } else {
        updatedOptions = [...prev, option]
      }

      return updatedOptions
    })
  }, [])

  // useEffect(() => {
  //   dispatch(
  //     setSelectedOptions({
  //       productId: memoizedProduct.id,
  //       basePrice: memoizedProduct.price,
  //       options: localSelectedOptions,
  //     }),
  //   )
  // }, [dispatch, memoizedProduct, localSelectedOptions])

  // // Add this effect to prevent background scrolling when modal is open
  // useEffect(() => {
  //   // Save the current overflow style
  //   const originalStyle = window.getComputedStyle(document.body).overflow
  //   // Prevent scrolling on the body
  //   if (isOpen) {
  //     document.body.style.overflow = "hidden"
  //   }

  //   // Restore original overflow on cleanup
  //   return () => {
  //     document.body.style.overflow = originalStyle
  //   }
  // }, [isOpen])

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
        <SheetContent side="bottom" className="max-h-[82vh]  rounded-t-lg flex flex-col p-0">
          {/* Header */}
          <div className="sticky top-0 bg-white px-4  mt-3 flex items-center gap-4 z-10">
            <button
              onClick={onClose}
              className="p-1 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <ChevronLeft size={28} className="text-gray-800 mt-1" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{memoizedProduct.name}</h2>
            </div>
          </div>

          {/* Product Content */}
          <div className="overflow-y-auto">
            {/* Product Image */}
            <div className="relative h-64 bg-gray-100">
              <img
                src={memoizedProduct.image || "https://pizza4ps.com/wp-content/uploads/2023/07/20200001_2.jpg"}
                alt={memoizedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Product Details */}
            <div className="px-6 py-4">
              <p className="text-gray-600 text-sm italic leading-relaxed">"{memoizedProduct.description}"</p>
              {/* Options */}
              {memoizedProduct.productOptions?.length > 0 && (
                <div className="mt-2 space-y-6">
                  {memoizedProduct.productOptions.map((productOption) => (
                    <div
                      key={productOption.id}

                    >
                      <div className="flex flex-col mb-3">
                        <h3 className="text-xl text-orange-500">{productOption.option.name}</h3>
                        {/* <span className="mt-1 text-sm italic text-orange-500">{productOption.option.description}</span> */}
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {productOption.option.optionItems.map((item) => (
                          <motion.button
                            key={`${productOption.id}-${item.id}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleOptionChange(item)}
                            className={`relative p-2 rounded-xl text-left transition-all duration-200 ${isOptionSelected(item)
                              ? "bg-orange-200 border-2 border-orange-400"
                              : "bg-gray-100 border-2 border-gray-100"
                              }`}
                            aria-pressed={isOptionSelected(item)}
                          >
                            <div className="flex justify-between px-2">
                              <div className="w-40">

                                <span className="font-medium text-gray-800">{item.name}</span>
                              </div>
                              <div className="w-32"><h1 className="text-base  text-right font-base text-gray-700">+{convertToVND(item.additionalPrice)}VND</h1></div>
                            </div>
                          </motion.button>
                        ))}
                        <div className=" mt-4 border-b border-dashed"></div>
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
                    className="w-full p-3 border-2  rounded-xl   text-base"
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
                    className="w-7 h-7 flex items-center bg-orange-200 justify-center rounded-full  transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} className="text-gray-600" />
                  </motion.button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="w-7 h-7 flex items-center bg-orange-200 justify-center rounded-full  transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} className="text-gray-600" />
                  </motion.button>
                </div>
              </motion.div>
            </div>



          </div>



          <div className=" bg-white border-t px-6 py-4 mt-auto" >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="px-12 py-3 w-full  rounded-md flex justify-center items-center text-white font-semibold bg-my-color"
            >
              <div className="w-28">Thêm vào giỏ</div>
              <div className="w-20">{convertToVND(totalPrice * quantity)}VND</div>

            </motion.button>
          </div >

        </SheetContent>
      </Sheet>


      <AnimatePresence>
        {showMiniModal && (
          <MiniModal
            key="mini-modal"
            productName={memoizedProduct.name}
            productImage={memoizedProduct.image}

          />
        )}
      </AnimatePresence>
    </>
  )
}

