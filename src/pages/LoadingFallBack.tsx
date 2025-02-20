import type React from "react"

const LoadingFallback: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100">
                    <circle className="text-gray-300" strokeWidth="4" stroke="currentColor" fill="none" r="45" cy="50" cx="50" />
                    <path
                        className="text-blue-600"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="none"
                        d="M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80"
                    >
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 50 50"
                            to="360 50 50"
                            dur="1s"
                            repeatCount="indefinite"
                        />
                    </path>
                    <circle className="text-red-500 animate-bounce" fill="currentColor" r="5" cy="30" cx="50">
                        <animateMotion path="M0,0 C -20,-20 -20,20 0,0 C 20,-20 20,20 0,0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                </svg>
                <p className="mt-4 text-xl font-semibold text-gray-700">Đang chuẩn bị...</p>
            </div>
        </div>
    )
}

export default LoadingFallback
