"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotificationSidebarProps {
    isOpen: boolean
    onClose: () => void
}

export const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ isOpen, onClose }) => {
    const sidebarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, onClose])

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-50 " : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed top-0 right-0 w-[80%] h-full z-[9999] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Notifications</h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </div>
                    <div className="overflow-y-auto h-[calc(100vh-80px)]">
                        {/* Notification items */}
                        <div className="p-2 border-b">
                            <p className="font-semibold">New message</p>
                            <p className="text-sm text-gray-600">You have a new message from John Doe</p>
                        </div>
                        <div className="p-2 border-b">
                            <p className="font-semibold">Order update</p>
                            <p className="text-sm text-gray-600">Your order #12345 has been shipped</p>
                        </div>
                        <div className="p-2 border-b">
                            <p className="font-semibold">Reminder</p>
                            <p className="text-sm text-gray-600">Your appointment is scheduled for tomorrow at 2 PM</p>
                        </div>
                        <div className="p-2 border-b">
                            <p className="font-semibold">New feature</p>
                            <p className="text-sm text-gray-600">Check out our latest app update with exciting new features!</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

