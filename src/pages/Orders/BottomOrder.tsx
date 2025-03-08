"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useTable from "@/hooks/useTable"
import { useOrderService } from "@/hooks/useOrderService"
import { Button } from "@/components/ui/button"
import { Loader2, XCircle } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/redux/stores/store"
import type { OrderItem } from "@/types/order"
import { clearCart } from "@/redux/slices/cartSlice"
import { getItem } from "@/constants"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,

} from "@/components/ui/alert-dialog"
import SuccessCart from "@/components/Animations/SuccessCart"
import { CheckoutNotificationModal } from "./CheckoutNotificationModal"

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
    const [showCheckOutModal, setShowCheckOutModal] = useState(false)
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

        // If on checkout tab, open checkout notification modal

        if (activeTab === "tab1") {
            if (isCartEmpty) {
                console.log('Cart is empty, returning')
                return
            }
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
        } else {
            setShowCheckOutModal(true)
        }


    }
    console.log('currentOrderID_', orderId);

    const handleCloseModal = () => {
        setShowConfirmModal(false)
        setShowResultModal(false)
        setShowCheckOutModal(false)
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

    const handleCheckoutConfirm = async () => {
        // Add  checkout logic here
        setShowCheckOutModal(false)
        // navigate or show a success message
    }
    const renderButton = (text: string, action: () => void, isWhite = false, isHidden = false) => {
        if (isHidden) return null
        return (
            <div
                className={`text-sm w-40 flex justify-center items-center border-2 rounded-md py-2 cursor-pointer
                                ${isWhite ? "bg-white" : ""} 
                                `}
                onClick={isLoading ? undefined : action}
            >
                {isLoading && text === "Đặt đơn" ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-my-color" />
                ) : (
                    <p className={`uppercase font-semibold ${isWhite ? "text-my-color" : "text-white"}`}>{text}</p>
                )}
            </div>
        )
    }
    const tableCode = getItem<string>('tableCode')

    // Add console.log to track state changes
    useEffect(() => {
        console.log('showCheckOutModal changed:', showCheckOutModal)
    }, [showCheckOutModal])

    return (
        <>
            <div className="flex justify-center gap-4 items-center bg-my-color border-t border-gray-300 py-1 h-[76px]">
                <div className="flex items-center">{renderButton("Thêm món", () => navigate("/action/foods"))}</div>
                <div className="flex items-center">
                    {renderButton(
                        activeTab === "tab1" ? "Đặt đơn" : "Thanh Toán",
                        () => {
                            console.log('Button clicked')
                            handleOpenModal()
                        },
                        true,
                        isCartEmpty && activeTab === "tab1",
                    )}
                </div>
            </div>

            {showConfirmModal && (
                <AlertDialog open={showConfirmModal} onOpenChange={handleCloseModal} >
                    <AlertDialogContent className="max-w-[80%] flex flex-col">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Bạn đã xác nhận đặt món?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Yêu cầu của bạn sẽ được gửi tới nhà hàng.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex flex-row justify-between items-center mt-2">
                            <Button variant={"outline"} className="px-4 w-28" onClick={handleCloseModal} disabled={isLoading}>Hủy</Button>
                            <Button className="px-4 w-28 bg-my-color border rounded-sm text-white" onClick={handleConfirmCheckout} disabled={isLoading}>Xác nhận</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {showResultModal && (
                <AlertDialog open={showResultModal} onOpenChange={handleCloseModal} >
                    <AlertDialogContent className="max-w-[80%] flex flex-col">
                        {success ?
                            (<>
                                <div className="flex flex-col items-center justify-center mb-4">
                                    <SuccessCart />
                                    <h3 className="mt-2">Bàn {tableCode}</h3>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-xl font-semibold text-green-500 my-1">Yêu cầu gọi món thành công</AlertDialogTitle>
                                        <AlertDialogDescription className="break-words italic">
                                            Yêu cầu của bạn sẽ được gửi tới nhà hàng, nhân viên sẽ xác nhận đơn hàng trong ít phút. Chúc quý khách vui vẻ!
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                </div>
                            </>) :
                            (<>
                                <div className="flex items-center mb-4">
                                    <XCircle className="text-red-500 mr-2" size={24} />
                                    <h2 className="text-2xl font-bold text-gray-800">Order Failed</h2>
                                </div>
                                <p className="mb-6 text-gray-600">{error}</p>
                            </>)}
                        <AlertDialogFooter className="justify-center items-center mt-3">
                            <Button className="px-4 w-28 bg-my-color border rounded-sm text-white" onClick={handleCloseModal} disabled={isLoading}>Đóng</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            <CheckoutNotificationModal
                isOpen={showCheckOutModal}
                onClose={handleCloseModal}
                onConfirm={handleCheckoutConfirm}
                tableCode={tableCode || "Unknown"}
            />

        </>
    )
}

export default BottomOrder

