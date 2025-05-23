"use client"

import { useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { removeFromCart, selectCartItems, selectCartTotal } from "@/redux/slices/cartSlice"
import { selectProductCategoryNotes, clearProductNotes } from "@/redux/slices/noteSlice"
import { ShoppingCart } from "lucide-react"
import type { RootState } from "@/redux/stores/store"
import { motion } from "framer-motion"
import { OrderItem } from "./OrderItem"
import { convertToVND } from "@/utils/convertToVND"

export default function Orders() {
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const totalPrice = useSelector(selectCartTotal)

  const reduxState = useSelector((state: RootState) => state)
  const productCategoryNotes = useMemo(() => {
    const notes: { [key: string]: string[] } = {}
    cartItems.forEach((item) => {
      const categoryNotes = selectProductCategoryNotes(reduxState, item.categoryId, item.id, item.selectedOptions)
      if (categoryNotes.length > 0) {
        notes[`${item.categoryId}-${item.id}-${item.optionsHash}`] = categoryNotes
      }
    })
    return notes
  }, [cartItems, reduxState])

  const handleRemove = (productId: string, categoryId: string, index: number, optionsHash: string) => {
    dispatch(removeFromCart({ productId, categoryId, index, optionsHash }))
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
    <div className=" bg-gray-50 to-white">
      <div className="max-w-3xl px-2 py-3 pb-32">
        {cartItems.length === 0 ? (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 rounded-2xl  "
            >
              <ShoppingCart size={80} className="text-orange-400 mb-6" />
              <p className="text-lg font-semibold text-gray-500 mb-6">Bạn chưa có đơn hàng nào!</p>
            </motion.div>
          </div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="border border-gray-200 rounded-lg pb-4"
            >
              {orderItems.map((item) => (
                <OrderItem
                  key={`${item.id}-${item.categoryId}-${item.optionsHash}`}
                  item={item}
                  onRemove={() => handleRemove(item.id, item.categoryId, item.index, item.optionsHash)}
                />
              ))}

              <div className="text-sm space-y-1 px-3 mt-4">
                <div className="flex justify-between items-center mt-4 pt-1 text-my-color">
                  <span className="font-bold text-lg">Tổng cộng</span>
                  <span className="font-medium text-base">{convertToVND(totalPrice)}đ</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
