import { useState } from 'react'
import Star from '../Icons/Star'
import FeedbackModal from './FeedbackModal'

interface FeedbackData {
    rating: number
    issues: string[]
    comment: string
    phone: string
}
const RatingModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    const handleSubmit = (feedback: FeedbackData) => {
        console.log("Feedback submitted:", feedback)
        // You can add more logic here, such as making an API call
        closeModal()
    }

    return (
        <>
            <div className="bg-blue-100 h-24 w-full rounded-lg p-2 cursor-pointer" onClick={openModal}>
                <div className="mt-1 flex justify-center items-center">
                    <Star />
                </div>
                <h1 className="mt-1 text-sm font-normal text-center">Đánh giá</h1>
            </div>
            <FeedbackModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} />
        </>
    )
}
export default RatingModal