import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
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
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find((item) => item.id === action.payload.id)
            if (existingItem) {
                existingItem.quantity += 1
            } else {
                state.items.push({ ...action.payload, quantity: 1 })
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload)
        },
        updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const item = state.items.find((item) => item.id === action.payload.id)
            if (item) {
                item.quantity = action.payload.quantity
            }
        },
    },
})

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions

export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartItemsCount = (state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)

export default cartSlice.reducer

