
import type React from "react"
import { useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import { ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { addToCart } from "@/redux/stores/cartSlice"
import type { ProductModel } from "@/types/product"
import ProductModal from "./modals/ProductModal"
import OptionItem from "@/types/option"

interface ProductListProps {
  products: ProductModel[]
  categoryId: string
}

const ProductCard: React.FC<ProductListProps> = ({ products, categoryId }) => {
  const categoryProducts = products.filter((product) => product.categoryId === categoryId)

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {categoryProducts.map((product) => (
        <ProductItem key={product.id} product={product} />))}
    </div>
  )
}

interface ProductItemProps {
  product: ProductModel
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const handleOpenModal = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleAddToCart = useCallback(
    (product: ProductModel, selectedOptions: OptionItem[]) => {
      setIsClicked(true)
      const totalPrice = product.price + selectedOptions.reduce((sum, option) => sum + option.additionalPrice, 0)
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: totalPrice,
          quantity: 1,
          image: product.image,
          selectedOptions: selectedOptions,
        }),
      )
      setIsModalOpen(false)
      setTimeout(() => setIsClicked(false), 300) // Reset after 300ms
    },
    [dispatch],
  )

  return (
    <>
      <div className="bg-white rounded-lg p-4 w-52">
        <img
          src={product.image || "https://pizza4ps.com/wp-content/uploads/2023/08/BYO_Cold-Cuts_S-2-scaled.jpg"}
          alt={product.name}
          className="w-full h-32 object-cover rounded-md mb-2"
        />
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

        <motion.div
          className={`flex justify-around p-2 rounded-xl mt-2 cursor-pointer ${isClicked ? "bg-blue-800 rounded-xl border-2" : "bg-white rounded-xl border-2 border-blue-800"
            }`}
          animate={{ scale: isClicked ? 0.95 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          onClick={handleOpenModal}
        >
          <h1 className={`text-base font-semibold ${isClicked ? "text-white" : "text-black hover:bg-white"}`}>
            ${product.price.toFixed(2)}
          </h1>
          <div className={isClicked ? "text-white" : "text-black"}>
            <ShoppingCart size={24} />
          </div>
        </motion.div>
      </div>
      <ProductModal product={product} isOpen={isModalOpen} onClose={handleCloseModal} onAddToCart={handleAddToCart} />
    </>
  )
}

export default ProductCard

