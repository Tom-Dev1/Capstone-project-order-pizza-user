"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useTable from "@/hooks/useTable"
import { useOrderService } from "@/hooks/useOrderService"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/redux/stores/store"
import type { OrderItem } from "@/types/order"
import { motion, AnimatePresence } from "framer-motion"
import { clearCart } from "@/redux/slices/cartSlice"

interface BottomOrderProps {
    activeTab: "tab1" | "tab2"
}

const BottomOrder: React.FC<BottomOrderProps> = ({ activeTab }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { tableId_gbId, currentOrderId_ } = useTable()
    const { createOrder, addFoodToOrder, isLoading } = useOrderService()
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showResultModal, setShowResultModal] = useState(false)
    const [orderId, setOrderId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const cartItems = useSelector((state: RootState) => state.cart.items)
    const notes = useSelector((state: RootState) => state.notes)

    const isCartEmpty = cartItems.length === 0

    const orderItems: OrderItem[] = cartItems.map((item) => {
        const itemNotes = notes[item.categoryId]?.[item.id]?.[item.optionsHash] || []
        const combinedNote = itemNotes.join(" + ")
        return {
            productId: item.id,
            optionItemIds: item.selectedOptions.map((option) => option.id),
            quantity: item.quantity,
            note: combinedNote,
        }
    })

    useEffect(() => {
        if (currentOrderId_ !== null) {
            setOrderId(currentOrderId_)
        }
    }, [currentOrderId_])

    const handleOpenModal = async () => {
        if (isCartEmpty) return
        if (currentOrderId_ === null) {
            try {
                if (!tableId_gbId) {
                    throw new Error("No table ID available")
                }
                const createResponse = await createOrder(JSON.stringify({ tableId: tableId_gbId }))
                if (!createResponse || !createResponse.success) {
                    throw new Error(createResponse?.message || "Failed to create a new order")
                }
                const newOrderId = createResponse.result.result.id
                setOrderId(newOrderId)
            } catch (err) {
                console.error("Error creating order:", err)
                setError(err instanceof Error ? err.message : "An unknown error occurred")
                setShowResultModal(true)
                return
            }
        } else {
            setOrderId(currentOrderId_)
        }
        setShowConfirmModal(true)
    }

    const handleCloseModal = () => {
        setShowConfirmModal(false)
        setShowResultModal(false)
    }

    const validateOrderItems = (items: OrderItem[]): boolean => {
        return items.every((item) => item.productId && item.quantity > 0 && Array.isArray(item.optionItemIds))
    }

    const handleConfirmCheckout = async () => {
        setError(null)
        setSuccess(null)

        try {
            if (!orderId) {
                throw new Error("No order ID available")
            }

            if (!validateOrderItems(orderItems)) {
                throw new Error("Invalid order items")
            }

            const addFoodResponse = await addFoodToOrder(
                JSON.stringify({
                    orderId: orderId,
                    orderItems: orderItems.map((item) => ({
                        productId: item.productId,
                        optionItemIds: item.optionItemIds,
                        quantity: item.quantity,
                        note: item.note || "No Comment",
                    })),
                }),
            )
            if (!addFoodResponse || !addFoodResponse.success) {
                throw new Error(addFoodResponse?.message || "Failed to add food to the order")
            }

            dispatch(clearCart())
            setShowConfirmModal(false)
            setSuccess("Order placed successfully!")
            setShowResultModal(true)
        } catch (err) {
            console.error("Adding food to order failed:", err)
            setError(err instanceof Error ? err.message : "An unknown error occurred")
            setShowResultModal(true)
        }
    }

    const renderButton = (text: string, action: () => void, isWhite = false, isDisabled = false) => (
        <div
            className={`text-sm w-40 flex justify-center items-center border-2 rounded-md py-3 cursor-pointer
                        ${isWhite ? "bg-white" : ""} 
                        ${isLoading || isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={isLoading || isDisabled ? undefined : action}
        >
            {isLoading && text === "Đặt đơn" ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-my-color" />
            ) : (
                <p
                    className={`uppercase font-semibold ${isWhite ? "text-my-color" : "text-white"} ${isDisabled ? "text-gray-400" : ""}`}
                >
                    {text}
                </p>
            )}
        </div>
    )

    return (
        <>
            <div className="flex justify-center gap-4 items-center bg-my-color border-t border-gray-300 py-1 h-[76px]">
                <div className="flex items-center">{renderButton("Thêm món", () => navigate("/action/foods"))}</div>
                <div className="flex items-center">
                    {renderButton(
                        activeTab === "tab1" ? "Đặt đơn" : "Thanh Toán",
                        handleOpenModal,
                        true,
                        isCartEmpty && activeTab === "tab1",
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showConfirmModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 15, stiffness: 300 }}
                            className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full"
                        >
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirm Order</h2>
                            <p className="mb-6 text-gray-600">Are you ready to place your order?</p>
                            <div className="flex justify-end space-x-3">
                                <Button variant="outline" onClick={handleCloseModal} disabled={isLoading} className="hover:bg-gray-100">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleConfirmCheckout}
                                    disabled={isLoading}
                                    className="bg-orange-500 hover:bg-orange-600 text-white"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Confirm Order"
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {showResultModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 15, stiffness: 300 }}
                            className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full"
                        >
                            {success ? (
                                <>
                                    <div className="flex items-center mb-4">
                                        <CheckCircle className="text-green-500 mr-2" size={24} />
                                        <h2 className="text-2xl font-bold text-gray-800">Order Successful</h2>
                                    </div>
                                    <p className="mb-6 text-gray-600">{success}</p>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center mb-4">
                                        <XCircle className="text-red-500 mr-2" size={24} />
                                        <h2 className="text-2xl font-bold text-gray-800">Order Failed</h2>
                                    </div>
                                    <p className="mb-6 text-gray-600">{error}</p>
                                </>
                            )}
                            <div className="flex justify-end">
                                <Button onClick={handleCloseModal} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
                                    Close
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default BottomOrder

