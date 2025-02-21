import type React from "react"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"

// SVG flags for languages
const VietnamFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="w-5 h-5">
        <rect width="900" height="600" fill="#da251d" />
        <polygon points="450,150 585,450 315,450" fill="#ff0" />
    </svg>
)

const USFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="w-5 h-5">
        <rect width="900" height="600" fill="#b22234" />
        <path
            d="M0,69.8h900v60.4H0zm0,120.8h900v60.4H0zm0,120.8h900v60.4H0zm0,120.8h900v60.4H0zm0,120.8h900v60.4H0zm0,120.8h900v60.4H0"
            fill="#fff"
        />
        <rect width="360" height="320" fill="#3c3b6e" />
        <g fill="#fff">
            <g id="s18">
                <g id="s9">
                    <g id="s5">
                        <g id="s4">
                            <path id="s" d="M24,24l2,6h6l-5,4l2,6l-5-4l-5,4l2-6l-5-4h6z" />
                            <use href="#s" y="36" />
                            <use href="#s" y="72" />
                        </g>
                        <use href="#s4" y="108" />
                    </g>
                    <use href="#s5" x="72" />
                </g>
                <use href="#s9" x="144" />
            </g>
            <use href="#s18" y="144" />
        </g>
    </svg>
)

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

