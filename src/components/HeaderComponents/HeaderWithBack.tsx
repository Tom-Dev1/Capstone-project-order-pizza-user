import type React from "react"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getItem } from "@/constants"

interface HeaderWithBackProps {
    title: string
    onBack?: () => void
}

const HeaderWithBack: React.FC<HeaderWithBackProps> = ({ title, onBack }) => {
    const navigate = useNavigate()
    const tableCode = getItem<string>('tableCode')
    const handleBack = () => {
        if (onBack) {
            onBack()
        } else {
            navigate(-1)
        }
    }

    return (
        <header className="w-full  bg-gray-50  h-[76px]">
            <div className="container mx-auto flex items-center h-full px-4">
                <button
                    onClick={handleBack}
                    className="p-1  rounded-full bg-white shadow-lg transition-colors mr-2"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-6 h-6 text-neutral-700" />
                </button>
                <div className="ml-2">
                    <h1 className=" uppercase text-lg font-normal text-gray-900 flex-1">{title}</h1>
                    <h1 className="font-medium">Bàn <span >{tableCode}</span></h1>
                </div>
            </div>
        </header>
    )
}

export default HeaderWithBack

