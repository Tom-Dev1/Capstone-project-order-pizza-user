"use client"

import { useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { removeFromCart, selectCartItems, selectCartTotal } from "@/redux/slices/cartSlice"
import { selectProductCategoryNotes, clearProductNotes } from "@/redux/slices/noteSlice"
import { ShoppingCart } from "lucide-react"
import type { RootState } from "@/redux/stores/store"
import { motion } from "framer-motion"
import { OrderItem } from "./OrderItem"
import CheckoutProcessButton from "./CheckoutProcessButton"

export default function Orders() {
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const totalPrice = useSelector(selectCartTotal)

  const productCategoryNotes = useSelector((state: RootState) => {
    const notes: { [key: string]: string[] } = {}
    cartItems.forEach((item) => {
      const categoryNotes = selectProductCategoryNotes(state, item.categoryId, item.id, item.selectedOptions)
      if (categoryNotes.length > 0) {
        notes[`${item.categoryId}-${item.id}-${item.optionsHash}`] = categoryNotes
      }
    })
    return notes
  })

  const handleRemove = (productId: string, categoryId: string, index: number, optionsHash: string) => {
    dispatch(removeFromCart({ productId, categoryId, index, optionsHash }))

    // Clear all notes for this product
    dispatch(clearProductNotes({ productId, categoryId }))
  }

  const orderItems = useMemo(() => {
    return cartItems.map((item, index) => {
      const notes = productCategoryNotes[`${item.categoryId}-${item.id}-${item.optionsHash}`] || []
      return {
        ...item,
        notes,
        index,
      }
    })
  }, [cartItems, productCategoryNotes])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Order</h1>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-orange-100"
          >
            <ShoppingCart size={80} className="text-orange-300 mb-6" />
            <p className="text-xl text-gray-500 mb-6">Your cart is empty</p>
            <a
              href="/action/foods"
              className="bg-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-200 hover:shadow-lg"
            >
              Start Ordering
            </a>
          </motion.div>
        ) : (
          <>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 mb-8">
              {orderItems.map((item) => (
                <OrderItem
                  key={`${item.id}-${item.categoryId}-${item.optionsHash}`}
                  item={item}
                  onRemove={() => handleRemove(item.id, item.categoryId, item.index, item.optionsHash)}
                />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky bottom-4"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg text-gray-600 font-medium">Total Amount</span>
                  <span className="text-3xl font-bold text-orange-500">${totalPrice.toFixed(2)}</span>
                </div>
                <CheckoutProcessButton />
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

