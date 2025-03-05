import type React from "react"
import { SearchBar } from "./SearchBar"
import { NotificationButton } from "./NotificationButton"
import { MenuButton } from "./MenuButton"
import { LanguageSelector } from "./LanguageSelector"

const Header: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 right-0 bg-background text-foreground h-[70px] flex items-center">
            <div className="container mx-auto flex items-center justify-end h-full px-4">
                <div className="container mx-auto px-4 flex items-center justify-end">
                    <SearchBar />
                    <NotificationButton />
                    <MenuButton />
                    <LanguageSelector />
                </div>
            </div>
        </div>
    )
}

export default Header

