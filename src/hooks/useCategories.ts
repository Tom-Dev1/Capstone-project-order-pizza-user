"use client"

import { useState, useEffect, useCallback } from "react"
import type { CategoryModel } from "@/types/category"
import CategoryService from "@/services/category-service"

const DRINK_CATEGORY_ID = "fb66e60f-a554-433a-898b-f31512b7fed4"

const useCategories = () => {
  const [foodCategory, setFoodCategory] = useState<CategoryModel[]>([])
  const [drinkCategory, setDrinkCategory] = useState<CategoryModel[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAllCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const categoryService = CategoryService.getInstance()
      const response = await categoryService.getAllCategories()
      if (response.success && response.result.items && response.result.items.length > 0) {
        const categories = response.result.items
        const drinkCategories = categories.filter((category: CategoryModel) => category.id === DRINK_CATEGORY_ID)
        const foodCategories = categories.filter((category: CategoryModel) => category.id !== DRINK_CATEGORY_ID)

        setDrinkCategory(drinkCategories)
        setFoodCategory(foodCategories)
      } else {
        setFoodCategory([])
        setDrinkCategory([])
      }
    } catch (err) {
      setError("Failed to fetch categories")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllCategories()
  }, [fetchAllCategories])



  return { foodCategory, drinkCategory, loading, error }
}

export default useCategories

