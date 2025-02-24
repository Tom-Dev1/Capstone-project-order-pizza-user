"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { selectCartItem } from "@/redux/stores/cartSlice"
import type { ProductModel } from "@/types/product"
import ProductModal from "./modals/ProductModal"
import type { RootState } from "@/redux/stores/store"

interface ProductListProps {
  products: ProductModel[]
  categoryId: string
}

const ProductCard: React.FC<ProductListProps> = ({ products, categoryId }) => {
  const categoryProducts = products.filter((product) => product.categoryId === categoryId)

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {categoryProducts.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  )
}
interface ProductItemProps {
  product: ProductModel
}
const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const cartItem = useSelector((state: RootState) => selectCartItem(state, product.id))

  const handleOpenModal = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsModalOpen(true)
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 200)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  return (
    <>
      <div className="bg-white rounded-lg p-4 w-full shadow-md">
        <img
          src={product.image || "/placeholder.svg?height=128&width=256"}
          alt={product.name}
          className="w-full h-32 object-cover rounded-md mb-2"
        />
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{product.description}</p>

        <motion.div
          className={`flex justify-between items-center p-2 rounded-xl mt-2 cursor-pointer ${cartItem ? "bg-blue-100 border-2 border-blue-500" : "bg-white border-2 border-blue-300"
            }`}
          animate={{ scale: isClicked ? 0.95 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          onClick={handleOpenModal}
        >
          <span className="text-base font-semibold">${product.price.toFixed(2)}</span>

        </motion.div>
      </div>
      <ProductModal product={product} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}

export default ProductCard

