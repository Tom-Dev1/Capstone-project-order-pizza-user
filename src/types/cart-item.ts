import OptionItem from "./product"

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
    selectedOptions: OptionItem[]
    uniqueId: string
}