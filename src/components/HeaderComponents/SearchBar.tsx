import type React from "react"
import { useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export const SearchBar: React.FC = () => {
    const [showSearch, setShowSearch] = useState<boolean>(false)

    return (
        <>
            {showSearch && (
                <div className="flex-1 w-full animate-in slide-in-from-top duration-300 mr-2">
                    <Input type="text" placeholder="Tìm món..." className="bg-gray-100 border-none" />
                </div>
            )}
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)}>
                {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                <span className="sr-only">{showSearch ? "Close search" : "Search"}</span>
            </Button>
        </>
    )
}

