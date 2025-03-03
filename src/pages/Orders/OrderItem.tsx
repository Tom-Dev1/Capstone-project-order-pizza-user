"use client"

import type React from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import type { CartItem } from "@/redux/slices/cartSlice"

interface OrderItemProps {
  item: CartItem & {
    categoryId: string
    notes: string[]
  }
  onRemove: () => void
}

export const OrderItem: React.FC<OrderItemProps> = ({ item, onRemove }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-sm border border-orange-100 p-4 flex items-center"
    >
      <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-20 h-20 object-cover rounded-lg mr-4" />
      <div className="flex-grow">
        <h3 className="text-sm font-semibold text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
        {item.selectedOptions && item.selectedOptions.length > 0 && (
          <p className="text-sm text-gray-500">Options: {item.selectedOptions.map((opt) => opt.name).join(", ")}</p>
        )}
        {item.notes && item.notes.length > 0 && (
          <div className="text-sm text-gray-500 mt-2">
            <span className="font-medium">Note{item.notes.length > 1 ? "s" : ""}:</span>
            <ul className="list-disc list-inside">
              {item.notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end">
        <span className="text-lg font-bold text-orange-500">${(item.price * item.quantity).toFixed(2)}</span>
        <button onClick={onRemove} className="mt-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
          <X size={20} />
        </button>
      </div>
    </motion.div>
  )
}

