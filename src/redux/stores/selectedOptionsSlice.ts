import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"
import type OptionItem from "@/types/option"

interface SelectedOptionsState {
    [productId: string]: {
        basePrice: number
        options: OptionItem[]
    }
}

const initialState: SelectedOptionsState = {}

const selectedOptionsSlice = createSlice({
    name: "selectedOptions",
    initialState,
    reducers: {
        setSelectedOptions: (
            state,
            action: PayloadAction<{ productId: string; basePrice: number; options: OptionItem[] }>,
        ) => {
            const { productId, basePrice, options } = action.payload
            state[productId] = { basePrice, options }
        },
        clearSelectedOptions: (state, action: PayloadAction<string>) => {
            delete state[action.payload]
        },
    },
})

export const { setSelectedOptions, clearSelectedOptions } = selectedOptionsSlice.actions

export const selectSelectedOptions = (state: RootState, productId: string) =>
    state.selectedOptions[productId] || { basePrice: 0, options: [] }

export const selectAllSelectedOptions = (state: RootState) => state.selectedOptions

export const selectTotalPrice = (state: RootState, productId: string) => {
    const product = state.selectedOptions[productId]
    if (!product) return 0

    const optionsTotal = product.options.reduce((total, option) => total + option.additionalPrice, 0)
    return product.basePrice + optionsTotal
}

export default selectedOptionsSlice.reducer

