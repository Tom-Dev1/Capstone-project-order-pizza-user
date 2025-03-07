import type React from 'react'

interface CategoryTitleProps {
  categories: { id: string; name: string; description?: string }[]
}

const CategoryTitle: React.FC<CategoryTitleProps> = ({ categories }) => {
  return (
    <div className='flex overflow-x-auto py-2 bg-orange-50  rounded-l-lg border-l-[7px] border-orange-400'>
      {categories.map((item) => (
        <div
          key={item.id}
          id={`category-${item.id}`}
          className='ml-5 py-1 text-my-color font-bold text-xl '
        >
          {item.name}
        </div>
      ))}
    </div>
  )
}

export default CategoryTitle
