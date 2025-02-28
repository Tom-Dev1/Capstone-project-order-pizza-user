import type React from 'react'
import { useEffect } from 'react'
const SmoothScrollHelper: React.FC = () => {
  useEffect(() => {
    // Function to handle smooth scrolling with offset
    const handleCategoryClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Check if the clicked element is a category button
      if (target.tagName === 'BUTTON' && target.closest('[data-category-nav="true"]')) {
        e.preventDefault()

        const categoryId = target.getAttribute('data-category-id')
        if (categoryId) {
          const element = document.getElementById(`category-${categoryId}`)
          if (element) {
            // Calculate position with offset for sticky header
            const headerOffset = 70
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
            const offsetPosition = elementPosition - headerOffset

            // Smooth scroll to the position
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            })
          }
        }
      }
    }

    // Add event listener
    document.addEventListener('click', handleCategoryClick)

    // Clean up
    return () => {
      document.removeEventListener('click', handleCategoryClick)
    }
  }, [])

  return null
}

export default SmoothScrollHelper
