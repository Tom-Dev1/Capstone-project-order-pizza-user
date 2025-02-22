import type React from "react"
import { SearchBar } from "./SearchBar"
import { NotificationButton } from "./NotificationButton"
import { MenuButton } from "./MenuButton"
import { LanguageSelector } from "./LanguageSelector"

const Header: React.FC = () => {
    return (
        <header className="w-full border-b bg-white shadow-sm h-16">
            <div className="container mx-auto flex items-center justify-end h-full px-4">
                <div className="flex items-center flex-1 justify-end gap-2">
                    <SearchBar />
                    <NotificationButton />
                    <MenuButton />
                    <LanguageSelector />
                </div>
            </div>
        </header>
    )
}

export default Header

