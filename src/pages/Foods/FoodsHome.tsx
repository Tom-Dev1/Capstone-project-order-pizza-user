"use client"

import CategoryTitle from "@/components/CategoryTitle"
import ProductCard from "@/components/ProductCard"
import useCategories from "@/hooks/useCategories"
import useProducts from "@/hooks/useProducts"
import React, { useMemo, useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

const FoodsHome: React.FC = () => {
  const { foodCategory } = useCategories()
  const { products } = useProducts()
  const [activeCategory, setActiveCategory] = useState<string>("")
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const categoriesWithProducts = useMemo(() => {
    return foodCategory.map((category) => ({
      ...category,
      products: products.filter((product) => product.categoryId === category.id),
    }))
  }, [foodCategory, products])

  // Scroll to category when clicking on navigation button
  const scrollToCategory = (categoryId: string) => {
    const yOffset = -80 // Adjust this value based on your header height
    const element = categoryRefs.current[categoryId]
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  // Set up intersection observer to detect which category is in view
  useEffect(() => {
    if (categoriesWithProducts.length === 0) return

    const observerOptions = {
      root: null,
      rootMargin: "-80px 0px -70% 0px",
      threshold: 0,
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    Object.values(categoryRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    if (!activeCategory && categoriesWithProducts.length > 0) {
      setActiveCategory(categoriesWithProducts[0].id)
    }

    return () => {
      observer.disconnect()
    }
  }, [categoriesWithProducts, activeCategory])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      {/* Hero Section */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="py-3 shadow-sm overflow-hidden">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4">
            {categoriesWithProducts.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-all duration-300 font-medium whitespace-nowrap
                    ${activeCategory === category.id ? "bg-orange-500 text-white shadow-md" : "bg-white text-gray-800"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Categories and Products */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-1">
        {categoriesWithProducts.map((category) => (
          <motion.div
            key={category.id}
            id={category.id}
            ref={(el) => (categoryRefs.current[category.id] = el)}
            className="mb-16 scroll-mt-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
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

