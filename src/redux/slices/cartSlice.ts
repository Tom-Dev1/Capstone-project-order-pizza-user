import { createSlice, type PayloadAction, createSelector } from "@reduxjs/toolkit"
import type { ProductModel } from "@/types/product"
import type { RootState } from "../stores/store"
import type OptionItem from "@/types/product"

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
    childProductId?: string // Added to track which child product was selected
    productRole?: string // Added to track the product role
    hasChildProducts?: boolean // Added to track if the product has child products
    childProductName?: string // Added to store the child product name
    comboSlotItemIds?: string[] // Added to store the IDs of selected combo slot items
}



// Helper function to generate a hash from selected options
const generateOptionsHash = (options: OptionItem[]): string => {
    return JSON.stringify(options.map((opt) => opt.id).sort())
}

// Helper function to save cart to localStorage
const saveCartToLocalStorage = (items: CartItem[]) => {
    try {
        localStorage.setItem("cart", JSON.stringify(items))
    } catch (error) {
        console.error("Error saving cart to localStorage:", error)
    }
}

// Helper function to load cart from localStorage
const loadCartFromLocalStorage = (): CartItem[] => {
    try {
        const cartItems = localStorage.getItem("cart")
        return cartItems ? JSON.parse(cartItems) : []
    } catch (error) {
        console.error("Error loading cart from localStorage:", error)
        return []
    }
}

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: loadCartFromLocalStorage(), // Load cart from localStorage on initialization
    },
    reducers: {
        addToCart: (
            state,
            action: PayloadAction<{
                product: ProductModel
                categoryId: string
                selectedOptions: OptionItem[]
                quantity: number
                childProductId?: string
                hasChildProducts?: boolean
                childProductName?: string
                comboSlotItemIds?: string[] // Thêm tham số này để lưu trữ IDs của combo slot items
            }>,
        ) => {
            const {
                product,
                categoryId,
                selectedOptions,
                quantity,
                childProductId,
                hasChildProducts,
                childProductName,
                comboSlotItemIds,
            } = action.payload

            const optionsHash = generateOptionsHash(selectedOptions)

            const existingItemIndex = state.items.findIndex(
                (item) =>
                    item.id === product.id &&
                    item.categoryId === categoryId &&
                    item.optionsHash === optionsHash &&
                    item.childProductId === childProductId,
            )

            // Determine the display name based on whether it's a child product or master product
            let displayName = product.name
            if (hasChildProducts && childProductId && childProductName) {
                // If it's a master product with child products and a child product is selected
                displayName = `${childProductName}`
            }

            if (existingItemIndex !== -1) {
                // If the item already exists with the same options, update its quantity and price
                state.items[existingItemIndex].quantity += quantity
                state.items[existingItemIndex].price = product.price // Update the price
                // Update the name in case it changed
                state.items[existingItemIndex].name = displayName
                // Update combo slot item IDs if provided
                if (comboSlotItemIds) {
                    state.items[existingItemIndex].comboSlotItemIds = comboSlotItemIds
                }
            } else {
                // If it's a new item or has different options, add it to the cart
                state.items.push({
                    id: product.id,
                    categoryId,
                    name: displayName,
                    price: product.price,
                    quantity,
                    image: product.imageUrl,
                    selectedOptions,
                    optionsHash,
                    addedAt: Date.now(),
                    childProductId,
                    productRole: product.productRole,
                    hasChildProducts,
                    childProductName,
                    comboSlotItemIds,
                })
            }

            // Save cart to localStorage after update
            saveCartToLocalStorage(state.items)
        },
        removeFromCart: (
            state,
            action: PayloadAction<{
                productId: string
                categoryId: string
                index: number
                optionsHash?: string
                childProductId?: string
            }>,
        ) => {
            const { productId, categoryId, index, optionsHash, childProductId } = action.payload

            if (optionsHash) {
                // Remove specific item with matching options hash and childProductId
                state.items = state.items.filter(
                    (item) =>
                        !(
                            item.id === productId &&
                            item.categoryId === categoryId &&
                            item.optionsHash === optionsHash &&
                            (childProductId ? item.childProductId === childProductId : true)
                        ),
                )
            } else {
                // Remove by index (backward compatibility)
                state.items = state.items.filter(
                    (item, i) => !(item.id === productId && item.categoryId === categoryId && i === index),
                )
            }

            // Save cart to localStorage after update
            saveCartToLocalStorage(state.items)
        },
        clearCart: (state) => {
            state.items = []

            // Clear cart from localStorage
            localStorage.removeItem("cart")
        },
        loadCartFromStorage: (state) => {
            state.items = loadCartFromLocalStorage()
        },
    },
})

export const { addToCart, removeFromCart, clearCart, loadCartFromStorage } = cartSlice.actions
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
        (_state, productId: string, categoryId: string, selectedOptions?: OptionItem[], childProductId?: string) => ({
            productId,
            categoryId,
            optionsHash: selectedOptions ? generateOptionsHash(selectedOptions) : undefined,
            childProductId,
        }),
    ],
    (cart, { productId, categoryId, optionsHash, childProductId }) => {
        if (optionsHash) {
            return cart.items.filter(
                (item) =>
                    item.id === productId &&
                    item.categoryId === categoryId &&
                    item.optionsHash === optionsHash &&
                    (childProductId ? item.childProductId === childProductId : true),
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
        (_state, productId?: string, categoryId?: string, selectedOptions?: OptionItem[], childProductId?: string) => ({
            productId,
            categoryId,
            optionsHash: selectedOptions ? generateOptionsHash(selectedOptions) : undefined,
            childProductId,
        }),
    ],
    (cart, { productId, categoryId, optionsHash, childProductId }) => {
        if (!productId || !categoryId) return undefined

        if (optionsHash) {
            return cart.items.find(
                (item) =>
                    item.id === productId &&
                    item.categoryId === categoryId &&
                    item.optionsHash === optionsHash &&
                    (childProductId ? item.childProductId === childProductId : true),
            )
        }

        return cart.items.find((item) => item.id === productId && item.categoryId === categoryId)
    },
)

export default cartSlice.reducer
