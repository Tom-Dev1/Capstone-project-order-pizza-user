import type React from "react"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"

interface Language {
    code: string
    name: string
    icon: React.ReactNode
}

const languages: Language[] = [
    { code: "vi", name: "Tiếng Việt", icon: <img src="https://cdn-icons-png.flaticon.com/512/197/197473.png" className="w-5 h-5" /> },
    { code: "en", name: "English", icon: <img src="https://cdn-icons-png.flaticon.com/512/16021/16021818.png" className="w-5 h-5" /> },
]

export const LanguageSelector: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0])

    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full overflow-hidden w-10 h-10">
                    {selectedLanguage.icon}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-1">
                {languages.map((lang) => (
                    <DropdownMenuItem key={lang.code} onSelect={() => setSelectedLanguage(lang)}>
                        <div className="flex items-center gap-3">
                            {lang.icon}
                            <span>{lang.name}</span>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

