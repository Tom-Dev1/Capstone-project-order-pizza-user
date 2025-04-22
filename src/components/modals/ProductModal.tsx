"use client"

import { useState, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus, ChevronLeft, Check, X } from "lucide-react"
import type { RootState } from "@/redux/stores/store"
import type { ProductModel, ChildProducts, ProductComboSlotItem } from "@/types/product"
import MiniModal from "./MiniModal"
import { convertToVND } from "@/utils/convertToVND"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import type OptionItem from "@/types/product"
import { setNote } from "@/redux/slices/noteSlice"
import { addToCart, selectCartItem } from "@/redux/slices/cartSlice"
import { setSelectedOptions } from "@/redux/slices/selectedOptionsSlice"
import ProductService from "@/services/product-service"

export interface Option {
  id: string
  name: string
  selectMany: boolean
  description: string
  optionItems: OptionItem[]
}

interface ProductModalProps {
  productId: string
  categoryId: string
  isOpen: boolean
  onClose: () => void
}

export default function ProductModal({ productId, categoryId, isOpen, onClose }: ProductModalProps) {
  const dispatch = useDispatch()
  const [product, setProduct] = useState<ProductModel | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localSelectedOptions, setLocalSelectedOptions] = useState<OptionItem[]>([])
  const [localNote, setLocalNote] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedChildProduct, setSelectedChildProduct] = useState<ChildProducts | null>(null)
  const [selectedComboItems, setSelectedComboItems] = useState<Record<string, ProductComboSlotItem>>({})
  const [showMiniModal, setShowMiniModal] = useState(false)

  // Check if this product is already in the cart
  const cartItem = useSelector((state: RootState) =>
    selectCartItem(state, productId, categoryId, localSelectedOptions, selectedChildProduct?.id),
  )

  // Calculate the current base price based on selection
  const currentBasePrice = selectedChildProduct ? selectedChildProduct.price : product?.price || 0

  // Calculate additional price from options
  const additionalOptionsPrice = localSelectedOptions.reduce((sum, option) => sum + option.additionalPrice, 0)

  // Calculate the final total price
  const finalTotalPrice = currentBasePrice + additionalOptionsPrice

  // Fetch product data when modal opens
  useEffect(() => {
    if (isOpen && productId) {
      const fetchProduct = async () => {
        setLoading(true)
        setError(null)
        try {
          const productService = ProductService.getInstance()
          const response = await productService.getProductById(productId)
          if (response.success && response.result) {
            setProduct(response.result)
            // Reset selected child product
            setSelectedChildProduct(null)
            // Reset selected combo items
            setSelectedComboItems({})
          } else {
            setError("Failed to fetch product details")
          }
        } catch (err) {
          console.error(`Error fetching product with id ${productId}:`, err)
          setError("An error occurred while fetching product details")
        } finally {
          setLoading(false)
        }
      }

      fetchProduct()
    }
  }, [isOpen, productId])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1)
      setLocalNote("")
      setLocalSelectedOptions([])

      // Nếu sản phẩm có childProducts, tự động chọn childProduct có giá thấp nhất
      if (product?.childProducts && product.childProducts.length > 0) {
        // Sắp xếp childProducts theo giá tăng dần và chọn cái đầu tiên (giá thấp nhất)
        const sortedChildProducts = [...product.childProducts].sort((a, b) => a.price - b.price)
        setSelectedChildProduct(sortedChildProducts[0])

        // Cập nhật Redux với giá của childProduct đầu tiên
        dispatch(
          setSelectedOptions({
            productId: productId,
            basePrice: sortedChildProducts[0].price,
            options: [],
          }),
        )
      } else {
        setSelectedChildProduct(null)
        dispatch(
          setSelectedOptions({
            productId: productId,
            basePrice: product?.price || 0,
            options: [],
          }),
        )
      }

      setSelectedComboItems({})
    }
  }, [isOpen, productId, product, dispatch])

  // Update Redux state when child product is selected
  useEffect(() => {
    if (product && product.productRole !== "Combo") {
      dispatch(
        setSelectedOptions({
          productId: productId,
          basePrice: currentBasePrice,
          options: localSelectedOptions,
        }),
      )
    }
  }, [selectedChildProduct, dispatch, productId, currentBasePrice, localSelectedOptions, product])

  const handleChildProductSelect = useCallback(
    (childProduct: ChildProducts) => {
      setSelectedChildProduct(childProduct)
      // Update Redux with the new base price
      dispatch(
        setSelectedOptions({
          productId: productId,
          basePrice: childProduct.price,
          options: localSelectedOptions,
        }),
      )
    },
    [dispatch, productId, localSelectedOptions],
  )

  const handleComboItemSelect = useCallback((slotId: string, item: ProductComboSlotItem) => {
    setSelectedComboItems((prev) => {
      // If the item is already selected, remove it (deselect)
      if (prev[slotId]?.id === item.id) {
        const newState = { ...prev }
        delete newState[slotId]
        return newState
      }
      // Otherwise, select it
      return {
        ...prev,
        [slotId]: item,
      }
    })
  }, [])

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
            productId: productId,
            basePrice: currentBasePrice,
            options: updatedOptions,
          }),
        )

        return updatedOptions
      })
    },
    [dispatch, productId, currentBasePrice],
  )



  const handleAddToCart = useCallback(() => {
    if (!product) return

    if (localNote) {
      dispatch(
        setNote({
          productId: productId,
          categoryId,
          note: localNote,
          selectedOptions: localSelectedOptions,
        }),
      )
    }

    if (product.productRole === "Combo") {
      // Lấy danh sách ID của các ProductComboSlotItem đã chọn
      const comboSlotItemIds = Object.values(selectedComboItems).map((item) => item.id)

      // For combo products, create a special name that includes selected items
      const selectedItems = Object.values(selectedComboItems)
      const comboItemNames =
        selectedItems.length > 0 ? selectedItems.map((item) => item.product.name).join(", ") : "Cơ bản" // If no items selected, indicate it's the basic combo

      const comboName = selectedItems.length > 0 ? `${product.name} (${comboItemNames})` : product.name

      dispatch(
        addToCart({
          product: {
            ...product,
            name: comboName,
            price: product.price + Object.values(selectedComboItems).reduce((sum, item) => sum + item.product.price, 0),
          },
          categoryId,
          selectedOptions: localSelectedOptions,
          quantity,
          comboSlotItemIds, // Thêm danh sách ID của các combo slot items
        }),
      )
    } else if (product.productRole === "Master") {
      // Check if this is a Master product with child products
      const hasChildProducts = product.childProducts && product.childProducts.length > 0

      if (hasChildProducts && selectedChildProduct) {
        // Case 1: Master product with child products - ALWAYS use the selected child product
        dispatch(
          addToCart({
            product: {
              ...product,
              id: product.id, // Vẫn giữ ID của Master product
              price: selectedChildProduct.price + additionalOptionsPrice, // Use child product price + options
            },
            categoryId,
            selectedOptions: localSelectedOptions,
            quantity,
            childProductId: selectedChildProduct.id, // Lưu ID của child product đã chọn
            hasChildProducts: true,
            childProductName: selectedChildProduct.name,
          }),
        )
      } else {
        // Case 2: Master product without child products
        dispatch(
          addToCart({
            product: {
              ...product,
              price: product.price + additionalOptionsPrice, // Use master product price + options
            },
            categoryId,
            selectedOptions: localSelectedOptions,
            quantity,
            hasChildProducts: hasChildProducts,
          }),
        )
      }
    } else {
      // Các loại sản phẩm khác (Child, Regular, etc.)
      dispatch(
        addToCart({
          product: {
            ...product,
            price: product.price + additionalOptionsPrice,
          },
          categoryId,
          selectedOptions: localSelectedOptions,
          quantity,
        }),
      )
    }

    setShowMiniModal(true)
    setTimeout(() => {
      setShowMiniModal(false)
    }, 2000)
    onClose()
  }, [
    dispatch,
    product,
    productId,
    categoryId,
    localNote,
    localSelectedOptions,
    quantity,
    onClose,
    selectedChildProduct,
    selectedComboItems,
    additionalOptionsPrice,
  ])

  const isOptionSelected = useCallback(
    (item: OptionItem) => {
      return localSelectedOptions.some((opt) => opt.id === item.id)
    },
    [localSelectedOptions],
  )

  // Show loading state
  if (loading) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="max-h-[82vh] rounded-t-lg flex flex-col p-0">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Show error state
  if (error) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="max-h-[82vh] rounded-t-lg flex flex-col p-0">
          <div className="flex flex-col justify-center items-center h-64 p-6">
            <div className="text-red-500 text-xl mb-4">Error</div>
            <p className="text-center">{error}</p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // If product is not loaded yet, don't render the content
  if (!product) {
    return null
  }

  // Determine if this is a combo product
  const isCombo = product.productRole === "Combo"
  // Determine if this product has child products
  const hasChildProducts = product.childProducts && product.childProducts.length > 0

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
              <SheetTitle className="text-2xl w-80 font-bold text-gray-800 truncate">{product.name}</SheetTitle>
              {isCombo && <div className="text-sm text-orange-500 font-medium">Combo</div>}
            </div>
          </div>

          {/* Product Content */}
          <div className="overflow-y-auto">
            {/* Product Image */}
            <div className="relative h-64 bg-gray-100">
              <img
                src={product.imageUrl || "https://pizza4ps.com/wp-content/uploads/2023/07/20200001_2.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

              {/* Product Status Badge */}
              {product.productStatus !== "Available" && (
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-medium ${product.productStatus === "OutOfIngredient" ? "bg-orange-500" : "bg-red-500"
                    }`}
                >
                  {product.productStatus === "OutOfIngredient" ? "Hết nguyên liệu" : "Không khả dụng"}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="px-6 py-4">
              <SheetDescription className="text-gray-600 text-sm italic leading-relaxed">
                "{product.description}"
              </SheetDescription>

              {/* Combo Slots Section - Only for Combo products */}
              {isCombo && product.productComboSlots && product.productComboSlots.length > 0 && (
                <div className="mt-6 space-y-6">
                  <div className="bg-orange-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-gray-700">
                      Bạn có thể chọn combo với giá gốc {convertToVND(product.price)} VND hoặc tùy chỉnh các món bên
                      dưới. Bấm vào món đã chọn để bỏ chọn.
                    </p>
                  </div>
                  {product.productComboSlots.map((slot) => (
                    <div key={slot.id} className="mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl text-orange-500">
                          {slot.slotName} <span className="text-sm font-normal text-gray-500">(Tùy chọn)</span>
                        </h3>
                        {selectedComboItems[slot.id] && (
                          <button
                            onClick={() => {
                              setSelectedComboItems((prev) => {
                                const newState = { ...prev }
                                delete newState[slot.id]
                                return newState
                              })
                            }}
                            className="text-sm text-orange-500 flex items-center gap-1 hover:text-orange-700"
                          >
                            <X size={14} /> Bỏ chọn
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {slot.productComboSlotItems.map((item) => (
                          <motion.button
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleComboItemSelect(slot.id, item)}
                            className={`relative p-3 rounded-xl text-left transition-all duration-200 ${selectedComboItems[slot.id]?.id === item.id
                              ? "bg-orange-200 border-2 border-orange-400"
                              : "bg-gray-100 border-2 border-gray-100"
                              }`}
                            aria-pressed={selectedComboItems[slot.id]?.id === item.id}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedComboItems[slot.id]?.id === item.id
                                    ? "border-orange-500 bg-orange-100"
                                    : "border-gray-300"
                                    }`}
                                >
                                  {selectedComboItems[slot.id]?.id === item.id && (
                                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                                  )}
                                </div>
                                <span className="font-medium text-gray-800">{item.product.name}</span>
                              </div>
                              {item.product.price > 0 && (
                                <div>
                                  <span className="font-medium text-gray-700">
                                    +{convertToVND(item.product.price)} VND
                                  </span>
                                </div>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      <div className="mt-4 border-b border-dashed"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Child Products Section - Only for non-Combo products with child products */}
              {!isCombo && hasChildProducts && (
                <div className="mt-6 mb-2">
                  <h3 className="text-xl text-orange-500 mb-3">Chọn kích cỡ</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {/* Child products - sorted by price ascending */}
                    {product.childProducts
                      .slice() // Create a copy to avoid mutating the original array
                      .sort((a, b) => a.price - b.price) // Sort by price ascending
                      .map((childProduct) => (
                        <motion.button
                          key={childProduct.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleChildProductSelect(childProduct)}
                          className={`relative p-3 rounded-xl text-left transition-all duration-200 ${selectedChildProduct?.id === childProduct.id
                            ? "bg-orange-200 border-2 border-orange-400"
                            : "bg-gray-100 border-2 border-gray-100"
                            }`}
                          aria-pressed={selectedChildProduct?.id === childProduct.id}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedChildProduct?.id === childProduct.id
                                  ? "border-orange-500 bg-orange-100"
                                  : "border-gray-300"
                                  }`}
                              >
                                {selectedChildProduct?.id === childProduct.id && (
                                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                                )}
                              </div>
                              <span className="font-medium text-gray-800">{childProduct.name}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">{convertToVND(childProduct.price)} VND</span>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    <div className="mt-4 border-b border-dashed"></div>
                  </div>
                </div>
              )}

              {/* Options Section - For both Combo and non-Combo products */}
              {product.productOptions?.length > 0 && (
                <div className="mt-2 space-y-6">
                  {product.productOptions.map((productOptionWrapper) => {
                    const productOption = productOptionWrapper.option
                    return (
                      <div key={productOption.id}>
                        <div className="flex flex-col mb-3">
                          <h3 className="text-xl text-orange-500">{productOption.name}</h3>
                          <p className="text-sm text-gray-500">
                            {productOption.selectMany ? "Chọn nhiều" : "Chỉ chọn một"}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {productOption.optionItems.sort((a, b) => a.additionalPrice - b.additionalPrice).map((item) => (
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
                    )
                  })}
                </div>
              )}

              {/* Price Summary */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Tổng giá</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Giá cơ bản:</span>
                    <span>{convertToVND(isCombo ? product.price : currentBasePrice)} VND</span>
                  </div>
                  {!isCombo && additionalOptionsPrice > 0 && (
                    <div className="flex justify-between">
                      <span>Phụ thu tùy chọn:</span>
                      <span>+{convertToVND(additionalOptionsPrice)} VND</span>
                    </div>
                  )}
                  {isCombo && Object.values(selectedComboItems).some((item) => item.product.price > 0) && (
                    <div className="flex justify-between">
                      <span>Phụ thu combo:</span>
                      <span>
                        +
                        {convertToVND(
                          Object.values(selectedComboItems).reduce((sum, item) => sum + item.product.price, 0),
                        )}{" "}
                        VND
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-base pt-1 border-t">
                    <span>Tổng cộng:</span>
                    <span>
                      {convertToVND(
                        isCombo
                          ? product.price +
                          Object.values(selectedComboItems).reduce((sum, item) => sum + item.product.price, 0)
                          : finalTotalPrice,
                      )}{" "}
                      VND
                    </span>
                  </div>
                </div>
              </div>

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
              disabled={product.productStatus !== "Available"}
              className={`px-12 py-3 w-full rounded-md flex justify-center items-center text-white font-semibold ${product.productStatus !== "Available" ? "bg-gray-400 cursor-not-allowed" : "bg-my-color"
                }`}
            >
              <div className="w-28">
                {product.productStatus !== "Available"
                  ? "Không khả dụng"
                  : cartItem
                    ? "Cập nhật giỏ hàng"
                    : "Thêm vào giỏ"}
              </div>
              <div className="w-20">
                {convertToVND(
                  isCombo
                    ? (product.price +
                      Object.values(selectedComboItems).reduce((sum, item) => sum + item.product.price, 0)) *
                    quantity
                    : finalTotalPrice * quantity,
                )}{" "}
                VND
              </div>
            </motion.button>
            {isCombo && Object.keys(selectedComboItems).length === 0 && (
              <p className="text-center text-gray-500 text-sm mt-2">
                Bạn đang chọn combo với giá gốc {convertToVND(product.price)} VND
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AnimatePresence>
        {showMiniModal && <MiniModal key="mini-modal" productName={product.name} productImage={product.imageUrl} />}
      </AnimatePresence>
    </>
  )
}
