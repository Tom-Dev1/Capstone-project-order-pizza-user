"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import type { CategoryModel } from "@/types/category"

interface CategoryNavigationProps {
    categories: CategoryModel[]
    onCategoryClick: (categoryId: string) => void
    activeCategory: string | null
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({ categories, onCategoryClick, activeCategory }) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current && activeCategory) {
            const activeButton = containerRef.current.querySelector(`[data-category-id="${activeCategory}"]`)
            if (activeButton) {
                activeButton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
            }
        }
    }, [activeCategory])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
    }

    const handleCategoryClick = (categoryId: string) => {
        onCategoryClick(categoryId)
    }

    return (
        <motion.div
            ref={containerRef}
            className="overflow-x-auto pb-2 px-2 sticky top-[-1px] bg-white z-10 shadow-sm hide-scrollbar"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex gap-2 min-w-max">
                {categories.map((category) => (
                    <motion.button
                        key={category.id}
                        data-category-id={category.id}
                        variants={itemVariants}
                        className={`px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-gray-800 font-medium
              ${activeCategory === category.id ? "bg-orange-400 text-white" : "bg-white hover:bg-orange-100"}`}
                        onClick={() => handleCategoryClick(category.id)}
                    >
                        {category.name}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    )
}

export default CategoryNavigation

