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
    optionsHash: string // Added to identify unique option combinations
}

interface CartState {
    items: CartItem[]
}

const initialState: CartState = {
    items: [],
}

// Helper function to generate a hash from selected options
const generateOptionsHash = (options: OptionItem[]): string => {
    return JSON.stringify(options.map((opt) => opt.id).sort())
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
            const optionsHash = generateOptionsHash(selectedOptions)

            const existingItemIndex = state.items.findIndex(
                (item) => item.id === product.id && item.categoryId === categoryId && item.optionsHash === optionsHash,
            )

            if (existingItemIndex !== -1) {
                // If the item already exists with the same options, update its quantity and price
                state.items[existingItemIndex].quantity += quantity
                state.items[existingItemIndex].price = product.price // Update the price
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
                    optionsHash,
                    addedAt: Date.now(),
                })
            }
        },
        removeFromCart: (
            state,
            action: PayloadAction<{
                productId: string
                categoryId: string
                index: number
                optionsHash?: string
            }>,
        ) => {
            const { productId, categoryId, index, optionsHash } = action.payload

            if (optionsHash) {
                // Remove specific item with matching options hash
                state.items = state.items.filter(
                    (item) => !(item.id === productId && item.categoryId === categoryId && item.optionsHash === optionsHash),
                )
            } else {
                // Remove by index (backward compatibility)
                state.items = state.items.filter(
                    (item, i) => !(item.id === productId && item.categoryId === categoryId && i === index),
                )
            }
        },
        clearCart: (state) => {
            state.items = []
        },
    },
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export const getOptionsHash = generateOptionsHash

const selectCart = (state: RootState) => state.cart

export const selectCartItems = createSelector([selectCart], (cart) =>
    cart.items.slice().sort((a, b) => a.addedAt - b.addedAt),
)

// Memoized selector for cart items count
export const selectCartItemsCount = createSelector([selectCart], (cart) =>
    cart.items.reduce((count, item) => count + item.quantity, 0),
)

export const selectCartItemCount = createSelector(
    [
        selectCart,
        (_state, productId: string, categoryId: string, selectedOptions?: OptionItem[]) => ({
            productId,
            categoryId,
            optionsHash: selectedOptions ? generateOptionsHash(selectedOptions) : undefined,
        }),
    ],
    (cart, { productId, categoryId, optionsHash }) => {
        if (optionsHash) {
            return cart.items.filter(
                (item) => item.id === productId && item.categoryId === categoryId && item.optionsHash === optionsHash,
            ).length
        }
        return cart.items.filter((item) => item.id === productId && item.categoryId === categoryId).length
    },
)

export const selectCartTotal = createSelector([selectCart], (cart) =>
    cart.items.reduce((total, item) => total + item.price * item.quantity, 0),
)

export const selectCartItem = createSelector(
    [
        selectCart,
        (_state, productId?: string, categoryId?: string, selectedOptions?: OptionItem[]) => ({
            productId,
            categoryId,
            optionsHash: selectedOptions ? generateOptionsHash(selectedOptions) : undefined,
        }),
    ],
    (cart, { productId, categoryId, optionsHash }) => {
        if (!productId || !categoryId) return undefined

        if (optionsHash) {
            return cart.items.find(
                (item) => item.id === productId && item.categoryId === categoryId && item.optionsHash === optionsHash,
            )
        }

        return cart.items.find((item) => item.id === productId && item.categoryId === categoryId)
    },
)

export default cartSlice.reducer

