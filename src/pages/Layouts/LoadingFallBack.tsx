import { Pizza } from "lucide-react"

export default function LoadingFallBack() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <div className="text-blue-600 animate-spin">
                <Pizza size={64} />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-blue-600">Pizza for you...!</h2>
            <p className="mt-2 text-blue-600">Please wait while we prepare your delicious meal!</p>
        </div>
    )
}

