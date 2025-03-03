interface TabProps {
    label: string
    isActive: boolean
    onClick: () => void
}

export default function Tab({ label, isActive, onClick }: TabProps) {
    return (
        <button
            onClick={onClick}
            className={`relative py-2 px-3 text-sm font-medium uppercase ${isActive ? "text-green-600" : "text-gray-500 hover:text-gray-700"
                }`}
        >
            {label}
            {isActive && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600" />}
        </button>
    )
}