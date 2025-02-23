import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"
import OptionItem from "@/types/option"

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
    selectedOptions: OptionItem[]
    uniqueId: string
}

interface CartState {
    items: CartItem[]
}

const initialState: CartState = {
    items: [],
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Omit<CartItem, "uniqueId">>) => {
            const newItem = {
                ...action.payload,
                uniqueId: `${action.payload.id}-${JSON.stringify(action.payload.selectedOptions)}`,
            }
            const existingItemIndex = state.items.findIndex((item) => item.uniqueId === newItem.uniqueId)
            if (existingItemIndex !== -1) {
                state.items[existingItemIndex].quantity += 1
            } else {
                state.items.push({ ...newItem, quantity: 1 })
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.uniqueId !== action.payload)
        },
        updateQuantity: (state, action: PayloadAction<{ uniqueId: string; quantity: number }>) => {
            const itemIndex = state.items.findIndex((item) => item.uniqueId === action.payload.uniqueId)
            if (itemIndex !== -1) {
                state.items[itemIndex].quantity = action.payload.quantity
            }
        },
        clearCart: (state) => {
            state.items = []
        },
    },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions

export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartItemsCount = (state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
export const selectCartTotal = (state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

export default cartSlice.reducer

