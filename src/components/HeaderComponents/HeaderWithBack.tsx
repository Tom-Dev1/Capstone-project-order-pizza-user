import type React from "react"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface HeaderWithBackProps {
    title: string
    onBack?: () => void
}

const HeaderWithBack: React.FC<HeaderWithBackProps> = ({ title, onBack }) => {
    const navigate = useNavigate()

    const handleBack = () => {
        if (onBack) {
            onBack()
        } else {
            navigate(-1)
        }
    }

    return (
        <header className="w-full border-b bg-white shadow-sm h-16">
            <div className="container mx-auto flex items-center h-full px-4">
                <button
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-lg font-semibold text-gray-900 flex-1">{title}</h1>
            </div>
        </header>
    )
}

export default HeaderWithBack

