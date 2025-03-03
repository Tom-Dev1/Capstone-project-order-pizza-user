"use client"

import type React from "react"
import { useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { removeFromCart, selectCartItems, selectCartTotal } from "@/redux/slices/cartSlice"
import { selectProductCategoryNotes, removeNote } from "@/redux/slices/noteSlice"
import { ShoppingCart } from "lucide-react"
import { OrderItem } from "./OrderItem"
import CheckoutProcessButton from "./CheckoutProcessButton"
import type { RootState } from "@/redux/stores/store"

const Orders: React.FC = () => {
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const totalPrice = useSelector(selectCartTotal)

  const productCategoryNotes = useSelector((state: RootState) => {
    const notes: { [key: string]: string[] } = {}
    cartItems.forEach((item) => {
      const categoryNotes = selectProductCategoryNotes(state, item.categoryId, item.id)
      if (categoryNotes.length > 0) {
        notes[`${item.categoryId}-${item.id}`] = categoryNotes
      }
    })
    return notes
  })

  const handleRemove = (productId: string, categoryId: string, index: number) => {
    dispatch(removeFromCart({ productId, categoryId, index }))
    dispatch(removeNote({ productId, categoryId, index }))
  }

  const orderItems = useMemo(() => {
    return cartItems.map((item) => {
      const notes = productCategoryNotes[`${item.categoryId}-${item.id}`] || []
      return {
        ...item,
        notes,
      }
    })
  }, [cartItems, productCategoryNotes])

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Order</h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-orange-100">
            <ShoppingCart size={80} className="text-orange-300 mb-6" />
            <p className="text-xl text-gray-500 mb-6">Your cart is empty</p>
            <a
              href="/action/foods"
              className="bg-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-200 hover:shadow-lg"
            >
              Start Ordering
            </a>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {orderItems.map((item, index) => (
                <OrderItem
                  key={`${item.id}-${item.categoryId}-${index}`}
                  item={item}
                  onRemove={() => handleRemove(item.id, item.categoryId, index)}
                />
              ))}
            </div>

            <div className="sticky bottom-4">
              <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg text-gray-600 font-medium">Total Amount</span>
                  <span className="text-3xl font-bold text-orange-500">${totalPrice.toFixed(2)}</span>
                </div>
                <CheckoutProcessButton />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Orders

