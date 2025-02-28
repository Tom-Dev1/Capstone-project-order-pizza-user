import type React from 'react'

interface CategoryTitleProps {
  categories: { id: number; name: string }[]
}

const CategoryTitle: React.FC<CategoryTitleProps> = ({ categories }) => {
  return (
    <div className='flex space-x-4 overflow-x-auto py-2 bg-orange-400 shadow-md rounded-lg'>
      {categories.map((item) => (
        <div
          key={item.id}
          id={`category-${item.id}`}
          className='flex-shrink-0 px-4 py-2  text-white cursor-pointer transition duration-300 ease-in-out transform hover:scale-105'
        >
          {item.name}
        </div>
      ))}
    </div>
  )
}

export default CategoryTitle
