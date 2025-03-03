import { createSlice, type PayloadAction, createSelector } from "@reduxjs/toolkit"
import type { RootState } from "../stores/store"
import type { ProductModel } from "@/types/product"
import type OptionItem from "@/types/option"

export interface CartItem {
    id: string
    categoryId: string
    name: string
    price: number
    quantity: number
    image?: string
    selectedOptions: OptionItem[]
    addedAt: number
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
            action: PayloadAction<{
                product: ProductModel
                categoryId: string
                selectedOptions: OptionItem[]
                quantity: number
            }>,
        ) => {
            const { product, categoryId, selectedOptions, quantity } = action.payload
            const existingItemIndex = state.items.findIndex(
                (item) =>
                    item.id === product.id &&
                    item.categoryId === categoryId &&
                    JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions),
            )

            if (existingItemIndex !== -1) {
                // If the item already exists with the same options, update its quantity
                state.items[existingItemIndex].quantity += quantity
            } else {
                // If it's a new item or has different options, add it to the cart
                state.items.push({
                    id: product.id,
                    categoryId,
                    name: product.name,
                    price: product.price,
                    quantity,
                    image: product.image,
                    selectedOptions,
                    addedAt: Date.now(),
                })
            }
        },
        removeFromCart: (state, action: PayloadAction<{ productId: string; categoryId: string; index: number }>) => {
            const { productId, categoryId, index } = action.payload
            state.items = state.items.filter(
                (item, i) => !(item.id === productId && item.categoryId === categoryId && i === index),
            )
        },
        clearCart: (state) => {
            state.items = []
        },
    },
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions

const selectCart = (state: RootState) => state.cart

export const selectCartItems = createSelector([selectCart], (cart) =>
    cart.items.slice().sort((a, b) => a.addedAt - b.addedAt),
)

export const selectCartItemCount = createSelector(
    [selectCart, (_state, productId: string, categoryId: string) => ({ productId, categoryId })],
    (cart, { productId, categoryId }) =>
        cart.items.filter((item) => item.id === productId && item.categoryId === categoryId).length,
)

export const selectCartTotal = createSelector([selectCart], (cart) =>
    cart.items.reduce((total, item) => total + item.price * item.quantity, 0),
)

export const selectCartItemsCount = createSelector([selectCart], (cart) =>
    cart.items.reduce((count, item) => count + item.quantity, 0),
)

export const selectCartItem = createSelector(
    [selectCart, (_state, productId?: string, categoryId?: string) => ({ productId, categoryId })],
    (cart, { productId, categoryId }) =>
        productId && categoryId
            ? cart.items.find((item) => item.id === productId && item.categoryId === categoryId)
            : undefined,
)

export default cartSlice.reducer

