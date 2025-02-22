import type React from "react"
import type { CartItem } from "@/redux/stores/cartSlice"
import { Minus, Plus, Trash2 } from "lucide-react"

interface OrderItemProps {
    item: CartItem
    onIncrease: (id: string) => void
    onDecrease: (id: string) => void
    onRemove: (id: string) => void
}

export const OrderItem: React.FC<OrderItemProps> = ({ item, onIncrease, onDecrease, onRemove }) => {
    return (
        <div className="flex items-center justify-between py-4 border-b">
            <div className="flex items-center space-x-4">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-500">${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={() => onDecrease(item.id)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                    <Minus size={16} />
                </button>
                <span className="font-semibold">{item.quantity}</span>
                <button onClick={() => onIncrease(item.id)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                    <Plus size={16} />
                </button>
                <button onClick={() => onRemove(item.id)} className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-500">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    )
}


