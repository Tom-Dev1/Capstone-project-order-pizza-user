"use client"

import React from "react"
import { useState, useCallback } from "react"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import type { ProductModel } from "@/types/product"
import ProductModal from "./modals/ProductModal"
import type { RootState } from "@/redux/stores/store"
import { ShoppingCart } from "lucide-react"
import { convertToVND } from "@/utils/convertToVND"
import { selectCartItem } from "@/redux/slices/cartSlice"

interface ProductListProps {
  products: ProductModel[]
  categoryId: string
}

const ProductCard: React.FC<ProductListProps> = ({ products, categoryId }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-6">
      {products.map((product, index) => (
        <ProductItem key={`${product.id}-${index}`} product={product} categoryId={categoryId} />
      ))}
    </div>
  )
}

interface ProductItemProps {
  product: ProductModel
  categoryId: string
}

const ProductItem: React.FC<ProductItemProps> = React.memo(({ product, categoryId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cartItem = useSelector<RootState, any>((state: RootState) => selectCartItem(state, product.id, categoryId))

  const handleOpenModal = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      // Only open modal if product is available
      if (product.productStatus !== "OutOfIngredient") {
        setIsModalOpen(true)
        setIsClicked(true)
        setTimeout(() => setIsClicked(false), 200)
      }
    },
    [product.productStatus],
  )

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  // Check if product is out of stock
  const isOutOfStock = product.productStatus === "OutOfIngredient"

  return (
    <>
      <motion.div
        className={`w-44 relative bg-white rounded-lg border-gray-100 border overflow-hidden ${isOutOfStock ? "opacity-75" : ""}`}
        whileHover={{ y: isOutOfStock ? 0 : -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Image container with overlay */}
        <div className="relative h-44 w-44 md:h-44 overflow-hidden">
          <motion.img
            src={product.imageUrl || "https://pizza4ps.com/wp-content/uploads/2023/07/20200001_2.jpg"}
            alt={product.name}
            className={`w-44 h-44 md:h-44 md:w-56 object-cover rounded-sm ${isOutOfStock ? "grayscale" : ""}`}
            animate={{ scale: isHovered && !isOutOfStock ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            onClick={handleOpenModal}
          />

          {/* Cart indicator */}
          {cartItem && (
            <div className="absolute top-3 left-3 bg-blue-500 text-white p-1.5 rounded-full shadow-md">
              <ShoppingCart size={16} />
            </div>
          )}

          {/* Out of stock indicator */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="bg-orange-500 text-white px-3 py-1 rounded-md font-medium text-sm transform -rotate-12">
                Hết nguyên liệu
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-2 mt-1">
          <div className="h-10">
            <div className="text-sm font-medium text-center text-my-color truncate">{product.name}</div>
          </div>
          <motion.button
            className={`w-[155px] mt-2 py-1 mb-2 rounded-sm font-medium transition-colors flex items-center justify-center ${isOutOfStock
              ? "border rounded-md border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed"
              : cartItem
                ? "border rounded-md border-my-color bg-my-color text-white"
                : "border rounded-md border-my-color text-my-color"
              }`}
            animate={{ scale: isClicked ? 0.95 : 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            onClick={handleOpenModal}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? (
              <span>Hết nguyên liệu</span>
            ) : cartItem ? (
              <span>{convertToVND(product.price)} đ</span>
            ) : (
              <span>{convertToVND(product.price)} đ</span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Pass productId instead of the full product object */}
      <ProductModal productId={product.id} categoryId={categoryId} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
})
ProductItem.displayName = "ProductItem"

export default ProductCard
