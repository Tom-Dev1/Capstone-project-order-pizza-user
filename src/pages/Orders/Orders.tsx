import type React from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectCartItems, removeFromCart, selectCartTotal } from "@/redux/stores/cartSlice"
import { ShoppingCart } from "lucide-react"
import { OrderItem } from "./OrderItem"
import CheckoutProcessButton from "./CheckoutProcessButton"

const Orders: React.FC = () => {
    const cartItems = useSelector(selectCartItems)
    const totalPrice = useSelector(selectCartTotal)
    const dispatch = useDispatch()

    const handleRemove = (productId: string) => {
        dispatch(removeFromCart(productId))
    }

    return (
        <div className="px-4 py-6 bg-slate-50 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Your Order</h1>
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
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
                        <div className="space-y-4 mb-8">
                            {cartItems.map((item) => (
                                <OrderItem key={item.id} item={item} onRemove={() => handleRemove(item.id)} />
                            ))}
                        </div>
                        <div className="border-t pt-4 sticky bottom-0 bg-white p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold">Total:</span>
                                <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
                            </div>
                            <CheckoutProcessButton />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Orders

