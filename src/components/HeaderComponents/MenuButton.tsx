import type React from "react"
import { Menu } from "lucide-react"
import { Button } from "../ui/button"

export const MenuButton: React.FC = () => {
    return (
        <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
        </Button>
    )
}

