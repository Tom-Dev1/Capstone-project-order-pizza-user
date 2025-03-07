import type React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
interface MiniModalProps {
    productName: string
    productImage: string
    isEditing: boolean
}
const MiniModal: React.FC<MiniModalProps> = ({ productName, productImage, isEditing }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed left-3 bottom-20 w-[94%] transform -translate-x-1/2 bg-orange-100 text-gray-800 px-5 py-3 rounded-lg shadow-lg z-50 flex items-center justify-center overflow-hidden"

        >      <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
                <div className="h-full bg-green-600 animate-countdown-timer" />
            </div>
            <img
                src={productImage || "https://pizza4ps.com/wp-content/uploads/2024/04/BYO_Garlic-Shrimp-Pizza-1.jpg"}
                alt={productName}
                className="w-16 h-16 object-cover rounded-md mr-4"
            />
            <div className="flex-1">
                <h3 className="font-semibold">{productName}</h3>
                <p className="text-sm text-green-600 flex items-center">
                    <Check className="mr-1" size={16} />
                    Added to cart
                </p>
            </div>
        </motion.div>
    )
}
export default MiniModal
