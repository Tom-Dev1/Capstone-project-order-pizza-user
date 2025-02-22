"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import type { ProductModels } from "@/types/product"
import { addToCart } from "@/redux/stores/cartSlice"
import ProductModal from "./modals/OptionsModal"

interface ProductListProps {
  products: ProductModels[]
  categoryId: string
}

const ProductCard: React.FC<ProductListProps> = ({ products, categoryId }) => {
  const dispatch = useDispatch()
  const categoryProducts = products.filter((product) => product.categoryId === categoryId)

  const handleAddToCart = useCallback(
    (product: ProductModels) => {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        }),
      )
    },
    [dispatch],
  )

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {categoryProducts.map((product) => (
        <ProductItem key={product.id} product={product} handleAddToCart={handleAddToCart} />
      ))}
    </div>
  )
}

interface ProductItemProps {
  product: ProductModels
  handleAddToCart: (product: ProductModels) => void
}

const ProductItem: React.FC<ProductItemProps> = ({ product, handleAddToCart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleAddToCartAndClose = useCallback(
    (product: ProductModels) => {
      setIsClicked(true)
      handleAddToCart(product)
      setIsModalOpen(false)
      setTimeout(() => setIsClicked(false), 300) // Reset after 300ms
    },
    [handleAddToCart],
  )

  return (
    <>
      <div className="bg-white rounded-lg p-4 w-52" >
        <img
          src={product.image || "https://pizza4ps.com/wp-content/uploads/2023/08/BYO_Cold-Cuts_S-2-scaled.jpg"}
          alt={product.name}
          className="w-full h-32 object-cover rounded-md mb-2"
        />
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

        <div
          className={`flex justify-around p-2 rounded-xl mt-2 cursor-pointer ${isClicked ? "bg-blue-800 rounded-xl border-2" : "bg-white rounded-xl border-2 border-blue-800"
            }`}
          onClick={handleOpenModal}
        >
          <h1 className={`text-base font-semibold ${isClicked ? "text-white" : "text-black hover:bg-white"}`}>
            ${product.price.toFixed(2)}
          </h1>
        </div>
      </div>
      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCartAndClose}
      />
    </>
  )
}

export default ProductCard

