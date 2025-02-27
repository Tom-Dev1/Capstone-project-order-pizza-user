import type React from 'react'

import type { CategoryModel } from '@/types/category'
import { motion } from 'framer-motion'
import { Utensils } from 'lucide-react'

interface CategoryTitleProps {
  categories: CategoryModel[]
}

const CategoryTitle: React.FC<CategoryTitleProps> = ({ categories }) => {
  return (
    <div className='mb-8'>
      {categories.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='relative'
        >
          <div className='flex items-center gap-3 mb-2'>
            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600'>
              <Utensils size={20} />
            </div>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-800'>{item.name}</h2>
          </div>

          <p className='text-gray-600 ml-13 pl-0.5 max-w-2xl'>{item.description}</p>

          <div className='mt-4 border-b border-dashed border-gray-300'></div>
        </motion.div>
      ))}
    </div>
  )
}

export default CategoryTitle
