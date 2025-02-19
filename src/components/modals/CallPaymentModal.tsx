import { useState } from "react"
import Cash from "../Icons/Cash"
import PaymentModal from "./PaymentModal"

const CallPaymentModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    const handleSubmit = (paymentOptionId: string) => {
        console.log("Selected payment option:", paymentOptionId)
        // You can add more logic here, such as making an API call
        closeModal()
    }

    return (
        <>
            <div className="bg-[rgb(255,247,231)] h-24 w-full rounded-lg p-2 cursor-pointer" onClick={openModal}>
                <div className="mt-1 flex justify-center items-center">
                    <Cash />
                </div>
                <h1 className="mt-1 text-sm font-normal text-center">Gọi thanh toán</h1>
            </div>
            <PaymentModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} />
        </>
    )
}

export default CallPaymentModal