"use client"

import type React from "react"
import { X, ShoppingCart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { ProductModels } from "@/types/product"

interface ProductModalProps {
    product: ProductModels
    isOpen: boolean
    onClose: () => void
    onAddToCart: (product: ProductModels) => void
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-9999"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 500 }}
                        className="bg-white rounded-lg p-6 w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{product.name}</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <img
                            src={product.image || "https://pizza4ps.com/wp-content/uploads/2023/08/BYO_Cold-Cuts_S-2-scaled.jpg"}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onAddToCart(product)}
                                className="bg-blue-800 text-white px-4 py-2 rounded-full flex items-center"
                            >
                                <ShoppingCart size={20} className="mr-2" />
                                Add to Cart
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ProductModal

