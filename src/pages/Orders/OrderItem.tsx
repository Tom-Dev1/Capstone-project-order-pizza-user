"use client"

import type React from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { type CartItem } from "@/redux/slices/cartSlice"
import { convertToVND } from "@/utils/convertToVND"

interface OrderItemProps {
  item: CartItem & {
    notes: string[]
    index: number
  }
  onRemove: () => void

}

export const OrderItem: React.FC<OrderItemProps> = ({ item, onRemove, }) => {


  return (
    <div className=" p-2 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`flex items-start gap-4 pb-4 border-b-2 border-dashed`}
      >
        <img
          src={item.image || "https://pizza4ps.com/wp-content/uploads/2023/07/20200001_2.jpg"}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">{item.name}</h3>

          </div>
          {item.selectedOptions && item.selectedOptions.length > 0 && (
            <div className="text-sm text-gray-500 mt-1">
              <span className="font-medium">Lựa chọn:</span>
              <ul className="list-disc list-inside">
                {item.selectedOptions.map((opt, index) => (
                  <li key={index} >
                    <span>{opt.name}</span> <span>+{convertToVND(opt.additionalPrice)}VND</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {item.notes && item.notes.length > 0 && (
            <div className="text-sm text-gray-500 mt-">
              <span className="font-medium">Note{item.notes.length > 1 ? "s" : ""}:</span>
              <ul className="list-disc list-inside">
                {item.notes.map((note, index) => (
                  <li key={index} className="break-words pl-1 -indent-4 ml-4">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="">
            <span className="text-sm font-semibold text-black">x{item.quantity}</span>
            <span className="text-sm font-bold text-my-color"> Tổng tiền: {convertToVND((item.price * item.quantity))}VND</span>
          </div>

        </div>
        <div className="flex flex-col items-end">
          <button
            onClick={onRemove}
            className="mt-2 text-white bg-my-color rounded-full transition-colors duration-200"
            aria-label="Remove item"
          >
            <X size={20} />
          </button>
        </div>
      </motion.div>

    </div >
  )
}

