import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"
import type { ProductModel } from "@/types/product"
import type OptionItem from "@/types/option"

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
    selectedOptions: OptionItem[]
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
        addToCart: (
            state,
            action: PayloadAction<{ product: ProductModel; selectedOptions: OptionItem[]; quantity: number }>,
        ) => {
            const { product, selectedOptions, quantity } = action.payload
            const existingItemIndex = state.items.findIndex((item) => item.id === product.id)

            if (existingItemIndex === -1) {
                state.items.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity,
                    image: product.image,
                    selectedOptions,
                })
            } else {
                state.items[existingItemIndex] = {
                    ...state.items[existingItemIndex],
                    quantity,
                    selectedOptions,
                }
            }
        },
        updateCartItem: (
            state,
            action: PayloadAction<{ productId: string; selectedOptions: OptionItem[]; quantity: number }>,
        ) => {
            const { productId, selectedOptions, quantity } = action.payload
            const itemIndex = state.items.findIndex((item) => item.id === productId)

            if (itemIndex !== -1) {
                state.items[itemIndex] = {
                    ...state.items[itemIndex],
                    selectedOptions,
                    quantity,
                }
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload)
        },
        clearCart: (state) => {
            state.items = []
        },
    },
})

export const { addToCart, updateCartItem, removeFromCart, clearCart } = cartSlice.actions

export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartItem = (state: RootState, productId: string) =>
    state.cart.items.find((item) => item.id === productId)
export const selectCartTotal = (state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
export const selectCartItemsCount = (state: RootState) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0)

export default cartSlice.reducer

