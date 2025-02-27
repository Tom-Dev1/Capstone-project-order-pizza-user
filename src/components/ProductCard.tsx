import type React from 'react'
import { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { selectCartItem } from '@/redux/stores/cartSlice'
import type { ProductModel } from '@/types/product'
import ProductModal from './modals/ProductModal'
import type { RootState } from '@/redux/stores/store'
import { ShoppingCart, Eye } from 'lucide-react'

interface ProductListProps {
  products: ProductModel[]
  categoryId: string
}

const ProductCard: React.FC<ProductListProps> = ({ products, categoryId }) => {
  const categoryProducts = products.filter((product) => product.categoryId === categoryId)

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6'>
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
  const [isHovered, setIsHovered] = useState(false)
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
      <motion.div
        className='relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300'
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Image container with overlay */}
        <div className='relative h-48 overflow-hidden'>
          <motion.img
            src={product.image || 'https://pizza4ps.com/wp-content/uploads/2024/04/BYO_Garlic-Shrimp-Pizza-1.jpg'}
            alt={product.name}
            className='w-full h-full object-cover'
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end'>
            <motion.button
              className='m-3 px-4 py-2 bg-white/90 rounded-full text-sm font-medium text-gray-800 flex items-center gap-1.5'
              whileHover={{ scale: 1.05 }}
              onClick={handleOpenModal}
            >
              <Eye size={16} />
              <span>Quick View</span>
            </motion.button>
          </div>

          {/* Price tag */}
          <div className='absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full shadow-md'>
            <span className='font-bold text-gray-800'>${product.price}</span>
          </div>

          {/* Cart indicator */}
          {cartItem && (
            <div className='absolute top-3 left-3 bg-blue-500 text-white p-1.5 rounded-full shadow-md'>
              <ShoppingCart size={16} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className='p-4'>
          <h3 className='text-lg font-semibold truncate'>{product.name}</h3>
          <p className='text-gray-600 text-sm line-clamp-2 mt-1 mb-3 h-10'>{product.description}</p>

          <motion.button
            className={`w-full py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              cartItem ? ' bg-orange-300 hover:bg-orange-600' : 'bg-orange-500 hover:bg-orange-600 text-white '
            }`}
            animate={{ scale: isClicked ? 0.95 : 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            onClick={handleOpenModal}
          >
            {cartItem ? (
              <>
                <ShoppingCart size={18} />
                <span>In Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      <ProductModal product={product} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}

export default ProductCard
