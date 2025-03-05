import type React from "react"
import { Bell } from "lucide-react"
import { Button } from "../ui/button"
import { NotificationSidebar } from "./Sidebar/Notification-sidebar"
import { useState } from "react"

export const NotificationButton: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div >
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
            </Button>
            <NotificationSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>
    )
}