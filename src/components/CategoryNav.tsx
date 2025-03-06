"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import type { CategoryModel } from "@/types/category"

interface ImprovedCategoryNavProps {
  categories: CategoryModel[]
}

const CategoryNav: React.FC<ImprovedCategoryNavProps> = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect()
        setIsSticky(rect.top <= 100)
      }
    }

    const observerOptions = {
      root: null,
      rootMargin: "120px 0px -60% 0px",
      threshold: [0, 0.1, 0.2],
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting)

      if (visibleEntries.length > 0) {
        const mostVisible = visibleEntries.reduce((prev, current) =>
          prev.intersectionRatio > current.intersectionRatio ? prev : current,
        )

        const id = mostVisible.target.id
        if (id.startsWith("category-")) {
          setActiveCategory(id.replace("category-", ""))

          const activeButton = document.querySelector(`[data-category-id="${id.replace("category-", "")}"]`)
          if (activeButton && isSticky) {
            activeButton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
          }
        }
      }
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    categories.forEach((category) => {
      const element = document.getElementById(`category-${category.id}`)
      if (element) observer.observe(element)
    })

    window.addEventListener("scroll", handleScroll, { passive: true })

    handleScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [categories, isSticky])

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      const navHeight = navRef.current?.offsetHeight || 0

      const elementRect = element.getBoundingClientRect()

      const offsetPosition = window.scrollY + elementRect.top - navHeight + 60

      // Scroll to the calculated position
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      setActiveCategory(categoryId)
    }
  }

  return (
    <div
      ref={navRef}
      data-category-nav="true"
      className={`bg-white  py-2 px-4 sm:px-6 lg:px-8 duration-300 ${isSticky ? "sticky z-20 top-0 shadow-md border-b border-gray-200" : ""
        }`}
    >
      <div className="overflow-x-auto pb-1 -mx-1 px-1 hide-scrollbar">
        <div className="flex gap-2 min-w-max py-1">
          {categories.map((category) => (
            <div
              key={category.id}
              data-category-id={category.id}
              onClick={() => scrollToCategory(category.id)}
              className={` cursor-pointer px-4 py-2 rounded-full transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 ${activeCategory === category.id
                ? "bg-orange-500 text-white shadow-md"
                : "bg-white border border-orange-200 text-gray-800 hover:bg-orange-50"
                }`}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryNav

