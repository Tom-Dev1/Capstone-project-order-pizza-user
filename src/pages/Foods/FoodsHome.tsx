import React, { useCallback, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import CategoryTitle from '@/components/CategoryTitle'
import ProductCard from '@/components/ProductCard'
import CategoryNav from '@/components/CategoryNav'
// import SmoothScrollHelper from '@/components/SmoothScrollHelper'
import useCategories from '@/hooks/useCategories'
import useProducts from '@/hooks/useProducts'
import { Search } from 'lucide-react'

const FoodsHome: React.FC = () => {
  const { foodCategory } = useCategories()
  const { products } = useProducts()
  const [searchTerm, setSearchTerm] = useState("")
  const categoriesWithProducts = useMemo(() => {
    return foodCategory.map((category) => {
      const categoryProducts = products.filter((product) => product.categoryId === category.id)
      return {
        ...category,
        products: categoryProducts,
      }
    })
  }, [foodCategory, products])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return []
    return products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [products, searchTerm])

  const isSearching = searchTerm.trim() !== ""
  return (
    <div className='bg-gray-50'>
      {/* Helper component for improved scroll behavior */}
      {/* <SmoothScrollHelper /> */}

      {/* Hero Section */}
      <div className="relative overflow-hidden z-0">
        <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0">
          <source
            src="https://media.istockphoto.com/id/180617222/vi/video/th%C3%AAm-m%E1%BB%99t-r%E1%BA%AFc-ph%C3%B4-mai-v%C3%A0o-pizza.mp4?s=mp4-640x640-is&k=20&c=D62lyWpPG3FK6WYgpY0bmyPmIQieZt06ar8DRtJpjRU="
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 bg-black bg-opacity-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl justify-center items-center text-white"
            >
              <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold mb-4">Pizza CapStone</h1>
              <p className="text-lg antialiased italic md:text-xl opacity-90 mb-8">
                "Thưởng thức những chiếc pizza thơm ngon, nóng hổi. Chọn món pizza yêu thích và cùng bạn bè tận hưởng bữa
                ăn tuyệt vời!"
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      {!isSearching && (

        <CategoryNav categories={foodCategory} />
      )}

      <div className='relative mx-3 mt-4'>
        <input
          type='text'
          placeholder='Tìm kiếm pizza yêu thích...'
          className='w-full py-3 px-3 pr-12 rounded-lg  border-1 border-gray-600 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200'
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className='absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500'>
          <Search size={20} />
        </button>
      </div>
      {/* Search Results */}
      {isSearching && (
        <div className="max-w-7xl px-3 py-1 pb-20">
          <h2 className="text-2xl font-bold mb-4">Kết quả tìm kiếm</h2>
          {filteredProducts.length > 0 ? (
            <ProductCard products={filteredProducts} categoryId="search-results" />
          ) : (
            <p>Không tìm thấy sản phẩm phù hợp.</p>
          )}
        </div>
      )}

      {/* Categories with Products */}
      {!isSearching && (
        <div className="max-w-7xl px-3 py-1 pb-20 ">
          {categoriesWithProducts.map((category) => (
            <div key={category.id} className="mb-6 mt-4 bg-gray-50">
              <div id={`category-${category.id}`} className="-mt-20 pt-20 invisible absolute" aria-hidden="true"></div>
              <CategoryTitle categories={[category]} />
              <ProductCard products={category.products} categoryId={category.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default React.memo(FoodsHome)
