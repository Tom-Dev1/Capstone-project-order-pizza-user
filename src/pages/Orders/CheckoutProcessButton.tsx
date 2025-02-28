"use client"

import type React from "react"
import { useState, useEffect } from "react"
import useTable from "@/hooks/useTable"
import { useOrderService } from "@/hooks/useOrderService"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/redux/stores/store"
import type { OrderItem } from "@/types/order"
import { motion, AnimatePresence } from "framer-motion"
import { clearCart } from "@/redux/stores/cartSlice"
import { getPaymentStatus } from "@/utils/status-order-utils";
import { PAYMENT_STATUS } from "@/types/order";
import { useNavigate } from "react-router-dom"

const CheckoutProcessButton: React.FC = () => {
    const { tableId_gbId, currentOrderId_ } = useTable()
    const { createOrder, addFoodToOrder, isLoading, order } = useOrderService()
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [orderId, setOrderId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const navigate = useNavigate();
    const dispatch = useDispatch()

    // Get items from Redux store
    const cartItems = useSelector((state: RootState) => state.cart.items)
    const notes = useSelector((state: RootState) => state.notes)
    const selectedOptions = useSelector((state: RootState) => state.selectedOptions)

    const orderItems: OrderItem[] = cartItems.map((item) => ({
        productId: item.id,
        optionItemIds: selectedOptions[item.id]?.options.map((option) => option.id) || [],
        quantity: item.quantity,
        note: notes[item.id] || "",
    }))

    console.log(orderItems);

    useEffect(() => {
        if (currentOrderId_ !== null) {
            setOrderId(currentOrderId_)
        }
    }, [currentOrderId_])

    console.log(order);

    console.log("orderId", orderId);

    const handleOpenModal = async () => {

        const orderStatus = getPaymentStatus(order?.[0]?.status);
        if (orderStatus === PAYMENT_STATUS.PAID) {
            console.log("Order is paid. Performing paid order logic...");
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
                    console.log('newOrderId', newOrderId);

                    setOrderId(newOrderId)
                } catch (err) {
                    console.error("Error creating order:", err)
                    setError(err instanceof Error ? err.message : "An unknown error occurred")
                    return
                }
            } else {
                setOrderId(currentOrderId_)
            }
        } else if (orderStatus === PAYMENT_STATUS.CHECKOUT) {
            console.log("Order is checked out. Performing checkout order logic...");

            navigate("/")
        } else if (orderStatus === PAYMENT_STATUS.UNPAID) {
            console.log("Order is unpaid. Performing unpaid order logic...");
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
                    console.log('newOrderId', newOrderId);

                    setOrderId(newOrderId)
                } catch (err) {
                    console.error("Error creating order:", err)
                    setError(err instanceof Error ? err.message : "An unknown error occurred")
                    return
                }
            } else {
                setOrderId(currentOrderId_)
            }
        } else {
            console.log("Unknown order status.");
        }
        setShowConfirmModal(true)
    }

    const handleCloseModal = () => {
        setShowConfirmModal(false)
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

            console.log("Food added to order successfully")
            dispatch(clearCart())
            setShowConfirmModal(false)
            setSuccess("Food added to order successfully!")
        } catch (err) {
            console.error("Adding food to order failed:", err)
            setError(err instanceof Error ? err.message : "An unknown error occurred")
        }
    }

    return (
        <div className="relative">
            <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors"
                onClick={handleOpenModal}
                disabled={isLoading || cartItems.length === 0}
            >
                Proceed to Checkout
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}

            <AnimatePresence>
                {showConfirmModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 15, stiffness: 300 }}
                            className="bg-white p-6 rounded-lg shadow-lg"
                        >
                            <h2 className="text-xl font-bold mb-4">Confirm Checkout</h2>
                            <p className="mb-4">Are you sure you want to proceed with the checkout?</p>
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={handleCloseModal} disabled={isLoading}>
                                    Cancel
                                </Button>
                                <Button onClick={handleConfirmCheckout} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Confirm Checkout"
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CheckoutProcessButton

