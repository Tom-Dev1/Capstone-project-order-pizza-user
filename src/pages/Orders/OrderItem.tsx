import type React from "react"
import { useSelector } from "react-redux"
import type { CartItem } from "@/redux/stores/cartSlice"
import { Trash2 } from "lucide-react"
import type { RootState } from "@/redux/stores/store"
import { selectNote } from "@/redux/stores/noteSlice"
import { selectTotalPrice } from "@/redux/stores/selectedOptionsSlice"

interface OrderItemProps {
    item: CartItem
    onRemove: (uniqueId: string) => void
}

export const OrderItem: React.FC<OrderItemProps> = ({ item, onRemove }) => {
    const note = useSelector((state: RootState) => selectNote(state, item.id))
    const totalPrice = useSelector((state: RootState) => selectTotalPrice(state, item.id))
    const optionsText = item.selectedOptions
        .map((option) => `${option.name} (+$${option.additionalPrice})`)
        .join(", ")

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b">
            <div className="flex items-start space-x-4 mb-2 sm:mb-0">
                <img
                    src={item.image || "https://pizza4ps.com/wp-content/uploads/2024/04/BYO_Garlic-Shrimp-Pizza-1.jpg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    {optionsText && <p className="text-sm text-gray-500">{optionsText}</p>}
                    {note && <p className="text-sm text-gray-500 italic">Note: {note}</p>}
                    <p className="text-gray-700 font-medium">${totalPrice}</p>
                </div>
            </div>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                <span className="font-semibold">Qty: {item.quantity}</span>
                <button
                    onClick={() => onRemove(item.id)}
                    className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-colors duration-200"
                    aria-label="Remove item"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    )
}

