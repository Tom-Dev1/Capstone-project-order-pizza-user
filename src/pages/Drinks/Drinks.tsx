import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import CategoryTitle from '@/components/CategoryTitle'
import ProductCard from '@/components/ProductCard'
import CategoryNav from '@/components/CategoryNav'
import SmoothScrollHelper from '@/components/SmoothScrollHelper'
import useCategories from '@/hooks/useCategories'
import useProducts from '@/hooks/useProducts'

const Drinks: React.FC = () => {
  const { drinkCategory } = useCategories()
  const { products } = useProducts()

  const categoriesWithProducts = useMemo(() => {
    return drinkCategory.map((category) => ({
      ...category,
      products: products.filter((product) => product.categoryId === category.id)
    }))
  }, [drinkCategory, products])

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-blue-50'>
      {/* Helper component for improved scroll behavior */}
      <SmoothScrollHelper />

      {/* Hero Section */}
      {/* <div className='bg-blue-500 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-3xl'
          >
            <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold mb-4'>Refreshing Drinks Delivered to You</h1>
            <p className='text-lg md:text-xl opacity-90 mb-8'>
              Explore our drink menu and quench your thirst with our delicious beverages.
            </p>

            <div className='relative max-w-xl'>
              <input
                type='text'
                placeholder='Search for drinks...'
                className='w-full py-3 px-5 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300'
              />
              <button className='absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500'>
                <Search size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </div> */}

      {/* Improved Sticky Category Navigation */}
      <CategoryNav categories={drinkCategory} />

      {/* Categories with Products */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        {categoriesWithProducts.map((category) => (
          <motion.div
            key={category.id}
            className='mb-16 pt-4'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            {/* Invisible anchor for scroll targeting with proper offset */}
            <div id={`category-${category.id}`} className='-mt-20 pt-20 invisible absolute' aria-hidden='true'></div>
            <CategoryTitle categories={[category]} />
            <ProductCard products={category.products} categoryId={category.id} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(Drinks)
