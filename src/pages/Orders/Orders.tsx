
import { useAppSelector } from "@/hooks/useAppSelector"
import { selectCartItems, addToCart, removeFromCart, updateQuantity } from "@/redux/stores/cartSlice"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { ShoppingCart } from "lucide-react"
import { OrderItem } from "./OrderItem"

const Orders = () => {
    const cartItems = useAppSelector(selectCartItems)
    const dispatch = useAppDispatch()

    const handleIncrease = (id: string) => {
        const item = cartItems.find((item) => item.id === id)
        if (item) {
            dispatch(addToCart(item))
        }
    }

    const handleDecrease = (id: string) => {
        const item = cartItems.find((item) => item.id === id)
        if (item) {
            if (item.quantity > 1) {
                dispatch(updateQuantity({ id, quantity: item.quantity - 1 }))
            } else {
                dispatch(removeFromCart(id))
            }
        }
    }

    const handleRemove = (id: string) => {
        dispatch(removeFromCart(id))
    }

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

    return (
        <div className="px-4 py-4 bg-slate-50">
            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
                    <ShoppingCart size={64} className="text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500 mb-4">Your cart is empty.</p>
                    <a
                        href="/action/foods"
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                        Start Shopping
                    </a>
                </div>
            ) : (
                <>
                    <div className="space-y-4 mb-4">
                        {cartItems.map((item) => (
                            <OrderItem
                                key={item.id}
                                item={item}
                                onIncrease={handleIncrease}
                                onDecrease={handleDecrease}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                    <div className="mt-6 border-t pt-4 sticky bottom-0 bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
                        </div>
                        <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Orders