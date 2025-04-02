import React, { useEffect, useState } from "react"
import { CheckCircle, Clock } from 'lucide-react'
import { motion } from "framer-motion"
import { getItem } from "@/constants"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const Payment: React.FC = () => {
    const navigate = useNavigate()
    const [elapsedTime, setElapsedTime] = useState(0)
    const tableCode = getItem<string>('tableCode') || "Unknown"

    // Start a timer when the component mounts
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(prev => prev + 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // Format the elapsed time as minutes and seconds
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    return (
        <div className=" bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-my-color text-white p-4">
                <h1 className="text-xl font-bold text-center">Thanh Toán</h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-start justify-center mt-6 p-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="relative">
                            <CheckCircle size={80} className="text-green-500" />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                                className="absolute -top-2 -right-2 bg-green-100 rounded-full p-1"
                            >
                                <CheckCircle size={24} className="text-green-500" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-2xl font-bold text-gray-800 mb-2"
                    >
                        Yêu Cầu Thanh Toán Thành Công
                    </motion.h2>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <p className="text-gray-600 mb-6">
                            Nhân viên đã nhận được yêu cầu thanh toán của bạn và sẽ đến bàn {tableCode} trong thời gian sớm nhất.
                        </p>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-center gap-3">
                            <Clock className="text-my-color" size={24} />
                            <span className="text-gray-700">Thời gian chờ: <span className="font-medium">{formatTime(elapsedTime)}</span></span>
                        </div>

                        <p className="text-gray-600 italic mb-8">
                            Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi. Chúc quý khách một ngày tốt lành!
                        </p>

                        <Button
                            onClick={() => navigate("/action/foods")}
                            className="bg-my-color hover:bg-my-color/90 text-white font-medium py-2 px-6 rounded-md w-full"
                        >
                            Quay Lại Menu
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default Payment
