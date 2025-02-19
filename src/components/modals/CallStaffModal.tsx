"use client"

import { useState } from "react"
import Waiter from "../Icons/Waiter"
import StaffModal from "./StaffModal"

const CallStaffButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    const handleSubmit = (reason: string) => {
        console.log("Staff called with reason:", reason)
        // You can add more logic here, such as making an API call
        closeModal()
    }

    return (
        <>
            <div className="bg-[rgb(231,251,243)] h-24 w-full rounded-lg p-2 cursor-pointer" onClick={openModal}>
                <div className="mt-1 flex justify-center items-center">
                    <Waiter />
                </div>
                <h1 className="mt-1 text-sm font-normal text-center">Gọi nhân viên</h1>
            </div>
            <StaffModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} />
        </>
    )
}

export default CallStaffButton

