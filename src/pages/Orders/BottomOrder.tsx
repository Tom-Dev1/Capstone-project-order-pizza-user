import type React from "react"
import { useState, useEffect, useMemo } from "react"
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
import TableService from "@/services/table-service"
import { useQuery } from "@tanstack/react-query"
import OrderService from "@/services/order-service"

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
  // Thêm state mới để lưu trạng thái đơn hàng
  const [orderStatus, setOrderStatus] = useState<"Paid" | "Unpaid" | "CheckedOut" | null>(null)
  const [showPaidOrderModal, setShowPaidOrderModal] = useState(false)

  const cartItems = useSelector((state: RootState) => state.cart.items)
  const notes = useSelector((state: RootState) => state.notes)

  const isCartEmpty = cartItems.length === 0

  // Fetch order details for checkout
  const { data: orderDetail, } = useQuery({
    queryKey: ["orderDetail", currentOrderId_],
    queryFn: async () => {
      if (!currentOrderId_) return null
      const orderService = OrderService.getInstance()
      const response = await orderService.getOrderDetailDetailByOrderId(currentOrderId_)
      if (!response.success) throw new Error(response.message || "Không thể tải thông tin đơn hàng")

      // Cập nhật trạng thái đơn hàng
      if (response.result) {
        setOrderStatus(response.result.status)
      }

      return response.result
    },
    enabled: !!currentOrderId_,
    staleTime: 10000,
  })

  // Calculate total count and price for checkout
  const { totalCount, totalPrice } = useMemo(() => {
    if (!orderDetail?.orderItems) return { totalCount: 0, totalPrice: 0 }

    const count = orderDetail.orderItems.length
    const price = orderDetail.orderItems.reduce((total, item) => {
      if (item.orderItemStatus !== "Cancelled") {
        return total + item.totalPrice
      }
      return total
    }, 0)

    return { totalCount: count, totalPrice: price }
  }, [orderDetail?.orderItems])

  // Chuyển đổi cart items thành định dạng orderItems
  const getOrderItems = (): OrderItem[] => {
    return cartItems.map((item) => {
      // Lấy ghi chú từ Redux store
      const itemNotes = notes[item.categoryId]?.[item.id]?.[item.optionsHash] || []
      const combinedNote = itemNotes.join(" + ") || "No Comment"

      // Xử lý khác nhau dựa trên loại sản phẩm
      if (item.productRole === "Combo") {
        // Đối với sản phẩm Combo:
        // - productId là ID của sản phẩm Combo
        // - optionItemIds là các ID của ProductComboSlotItem đã chọn và các tùy chọn thông thường

        // Lấy optionItemIds từ selectedOptions (đây là các tùy chọn thông thường)
        const regularOptionIds = item.selectedOptions.map((option) => option.id)

        // Lấy các ID của ProductComboSlotItem
        const comboSlotItemIds = item.comboSlotItemIds || []

        // Kết hợp cả hai loại ID
        const allOptionIds = [...regularOptionIds, ...comboSlotItemIds]

        return {
          productId: item.id, // ID của sản phẩm Combo
          optionItemIds: allOptionIds,
          quantity: item.quantity,
          note: combinedNote,
        }
      } else if (item.productRole === "Master" || item.productRole === "Child") {
        // Đối với sản phẩm Master hoặc Child:

        // Xác định productId đúng:
        // - Nếu là Master có childProduct đã chọn, sử dụng childProductId
        // - Nếu không, sử dụng id của sản phẩm
        const productId = item.childProductId || item.id

        // Lấy danh sách optionItemIds từ selectedOptions
        const optionItemIds = item.selectedOptions.map((option) => option.id)

        return {
          productId: productId,
          optionItemIds: optionItemIds,
          quantity: item.quantity,
          note: combinedNote,
        }
      } else {
        // Đối với các loại sản phẩm khác, sử dụng cách xử lý mặc định
        return {
          productId: item.id,
          optionItemIds: item.selectedOptions.map((option) => option.id),
          quantity: item.quantity,
          note: combinedNote,
        }
      }
    })
  }

  useEffect(() => {
    if (currentOrderId_ !== null) {
      setOrderId(currentOrderId_)
    }
  }, [currentOrderId_])

  // Cập nhật hàm handleOpenModal để kiểm tra trạng thái đơn hàng
  const handleOpenModal = async () => {
    if (activeTab === "tab1") {
      if (isCartEmpty) {
        console.log("Cart is empty, returning")
        return
      }

      // Kiểm tra trạng thái đơn hàng
      if (orderStatus === "Paid" || orderStatus === "CheckedOut") {
        setShowPaidOrderModal(true)
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

  const handleCloseModal = () => {
    setShowConfirmModal(false)
    setShowResultModal(false)
    setShowCheckOutModal(false)
  }

  // Thêm hàm để đóng modal thông báo đơn hàng đã thanh toán
  const handleClosePaidOrderModal = () => {
    setShowPaidOrderModal(false)
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

      // Lấy orderItems hiện tại
      const orderItems = getOrderItems()

      if (!validateOrderItems(orderItems)) {
        throw new Error("Invalid order items")
      }

      // Tạo payload để gửi đi
      const orderPayload = {
        orderId: orderId,
        orderItems: orderItems,
      }

      // Log để debug
      console.log("Sending order payload:", JSON.stringify(orderPayload, null, 2))

      // Gửi dữ liệu đơn hàng
      const addFoodResponse = await addFoodToOrder(JSON.stringify(orderPayload))

      if (!addFoodResponse || !addFoodResponse.success) {
        throw new Error(addFoodResponse?.message || "Failed to add food to the order")
      }

      // Xóa giỏ hàng trong Redux và localStorage
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
    try {
      const tableCode = getItem<string>("tableCode")
      const tableID = getItem<string>("tableId")
      const tablesService = TableService.getInstance()
      const apiResponse = await tablesService.callStaff(`${tableID}`, `Gọi nhân viên tới bàn ${tableCode} thanh toán`)

      if (apiResponse.success) {
        setShowCheckOutModal(false)
        navigate("/action/payment")
      } else {
        alert("Không thể gọi nhân viên. Vui lòng thử lại sau.")
      }
    } catch (error) {
      console.error("Error calling staff:", error)
      alert("Đã xảy ra lỗi. Vui lòng thử lại sau.")
    } finally {
      setShowCheckOutModal(false)
    }
  }

  const renderButton = (text: string, action: () => void, isWhite = false, isHidden = false) => {
    if (isHidden) return null
    return (
      <div
        className={`text-sm w-40 flex justify-center items-center border-2 rounded-md py-2 cursor-pointer
                                ${isWhite ? "bg-white" : ""} 
                                `}
        onClick={action}
      >
        {isLoading && text === "Đặt đơn" ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-my-color" />
        ) : (
          <p className={`uppercase font-semibold ${isWhite ? "text-my-color" : "text-white"}`}>{text}</p>
        )}
      </div>
    )
  }
  const tableCode = getItem<string>("tableCode")

  return (
    <>
      <div className="flex justify-center gap-4 items-center bg-my-color border-t border-gray-300 py-1 h-[76px]">
        <div className="flex items-center">{renderButton("Thêm món", () => navigate("/action/foods"))}</div>
        <div className="flex items-center">
          {renderButton(
            activeTab === "tab1" ? "Đặt đơn" : "Thanh Toán",
            () => {
              console.log("Button clicked")
              handleOpenModal()
            },
            true,
            isCartEmpty && activeTab === "tab1",
          )}
        </div>
      </div>

      {showConfirmModal && (
        <AlertDialog open={showConfirmModal} onOpenChange={handleCloseModal}>
          <AlertDialogContent className="max-w-[80%] flex flex-col">
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn đã xác nhận đặt món?</AlertDialogTitle>
              <AlertDialogDescription>Yêu cầu của bạn sẽ được gửi tới nhà hàng.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-row justify-between items-center mt-2">
              <Button variant={"outline"} className="px-4 w-28" onClick={handleCloseModal} disabled={isLoading}>
                Hủy
              </Button>
              <Button
                className="px-4 w-28 bg-my-color border rounded-sm text-white"
                onClick={handleConfirmCheckout}
                disabled={isLoading}
              >
                Xác nhận
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {showResultModal && (
        <AlertDialog open={showResultModal} onOpenChange={handleCloseModal}>
          <AlertDialogContent className="max-w-[80%] flex flex-col">
            {success ? (
              <>
                <div className="flex flex-col items-center justify-center mb-4">
                  <SuccessCart />
                  <h3 className="mt-2">Bàn {tableCode}</h3>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-semibold text-green-500 my-1">
                      Yêu cầu gọi món thành công
                    </AlertDialogTitle>
                    <AlertDialogDescription className="break-words italic">
                      Yêu cầu của bạn sẽ được gửi tới nhà hàng, nhân viên sẽ xác nhận đơn hàng trong ít phút. Chúc quý
                      khách vui vẻ!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
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
            <AlertDialogFooter className="justify-center items-center mt-3">
              <Button
                className="px-4 w-28 bg-my-color border rounded-sm text-white"
                onClick={handleCloseModal}
                disabled={isLoading}
              >
                Đóng
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {showCheckOutModal && (
        <CheckoutNotificationModal
          isOpen={showCheckOutModal}
          onClose={handleCloseModal}
          onConfirm={handleCheckoutConfirm}
          tableCode={tableCode || "Unknown"}
          totalCount={totalCount}
          totalPrice={totalPrice}
        />
      )}
      {showPaidOrderModal && (
        <AlertDialog open={showPaidOrderModal} onOpenChange={handleClosePaidOrderModal}>
          <AlertDialogContent className="max-w-[80%] flex flex-col">
            <div className="flex items-center mb-4">
              <XCircle className="text-orange-500 mr-2" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Đơn hàng đã thanh toán</h2>
            </div>
            <AlertDialogDescription className="break-words">
              Đơn hàng của bạn đã được thanh toán hoặc đã hoàn tất. Vui lòng liên hệ nhân viên để được trợ giúp nếu bạn
              muốn đặt thêm món.
            </AlertDialogDescription>
            <AlertDialogFooter className="justify-center items-center mt-3">
              <Button
                className="px-4 w-28 bg-my-color border rounded-sm text-white"
                onClick={handleClosePaidOrderModal}
              >
                Đóng
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
export default BottomOrder
