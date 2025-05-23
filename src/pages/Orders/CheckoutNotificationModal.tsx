"use client"

import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ShoppingBag, CreditCard } from "lucide-react"
import { convertToVND } from "@/utils/convertToVND"

interface CheckoutNotificationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    tableCode: string
    totalCount: number
    totalPrice: number
}

export function CheckoutNotificationModal({
    isOpen,
    onClose,
    onConfirm,
    tableCode,
    totalCount,
    totalPrice,
}: CheckoutNotificationModalProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-[90%] flex flex-col">
                <div className="flex justify-center mb-2">
                    <div className="bg-orange-100 p-3 rounded-full">
                        <CreditCard className="h-6 w-6 text-orange-500" />
                    </div>
                </div>

                <AlertDialogHeader className="text-center">
                    <AlertDialogTitle className="text-xl">Xác nhận thanh toán</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">Bàn {tableCode}</AlertDialogDescription>
                </AlertDialogHeader>

                <div className="my-4 border-t border-b py-4">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Tổng món</span>
                        <div className="flex items-center">
                            <div className="mr-2">{totalCount}</div>
                            <ShoppingBag className="h-4 w-4 mr-1 text-gray-500" />
                        </div>
                    </div>

                    <div className="text-sm space-y-1 mt-3">
                        <div className="flex justify-between items-center text-gray-600">
                            <span>Giá chưa thuế</span>
                            <span className="font-medium">{convertToVND(totalPrice)}đ</span>
                        </div>

                        <div className="flex justify-between items-center pt-2 text-gray-900 border-t mt-2">
                            <span className="font-medium">Tổng cộng</span>
                            <span className="font-medium text-base">{convertToVND(totalPrice)}đ</span>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-center text-gray-600 ">Bạn có muốn thanh toán hóa đơn này?</p>
                <p className="text-sm text-center text-gray-600 ">
                    Chúng tôi sẽ cho nhân viên tới thanh toán đơn hàng của bạn.
                </p>
                <AlertDialogFooter className="flex flex-row justify-between items-center mt-3">
                    <Button variant={"outline"} className="px-4 w-28" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button className="px-4 w-28 bg-my-color border rounded-sm text-white" onClick={onConfirm}>
                        Xác nhận
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
