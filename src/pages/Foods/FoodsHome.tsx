import CategoryTitle from '@/components/CategoryTitle'
import ProductCard from '@/components/ProductCard'
import useCategories from '@/hooks/useCategories'
import useProducts from '@/hooks/useProducts'
import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
const FoodsHome: React.FC = () => {
  const { foodCategory } = useCategories()
  const { products } = useProducts()

  const categoriesWithProducts = useMemo(() => {
    return foodCategory.map((category) => ({
      ...category,
      products: products.filter((product) => product.categoryId === category.id)
    }))
  }, [foodCategory, products])

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-orange-50'>
      {/* Hero Section */}

      {/* Categories and Products */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
        {/* Category Navigation */}
        <div className='mb-10 overflow-x-auto pb-2'>
          <div className='flex gap-2 min-w-max'>
            {categoriesWithProducts.map((category) => (
              <button
                key={category.id}
                className='px-4 py-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow text-gray-800 font-medium'
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Categories with Products */}
        {categoriesWithProducts.map((category) => (
          <motion.div
            key={category.id}
            className='mb-16'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <CategoryTitle categories={[category]} />
            <ProductCard products={category.products} categoryId={category.id} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(FoodsHome)
