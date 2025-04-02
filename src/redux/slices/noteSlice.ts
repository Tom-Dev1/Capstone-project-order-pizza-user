import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/redux/stores/store"
import OptionItem from "@/types/product"

// Modified to include optionsHash for identifying unique option combinations
interface NoteState {
    [categoryId: string]: {
        [productId: string]: {
            [optionsHash: string]: string[]
        }
    }
}

const initialState: NoteState = {}

// Helper function to generate a hash from selected options
const generateOptionsHash = (options: OptionItem[]): string => {
    return JSON.stringify(options.map((opt) => opt.id).sort())
}

export const noteSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        setNote: (
            state,
            action: PayloadAction<{
                productId: string
                categoryId: string
                note: string
                selectedOptions: OptionItem[]
                index?: number
            }>,
        ) => {
            const { productId, categoryId, note, selectedOptions, index } = action.payload
            const optionsHash = generateOptionsHash(selectedOptions)

            if (!state[categoryId]) {
                state[categoryId] = {}
            }
            if (!state[categoryId][productId]) {
                state[categoryId][productId] = {}
            }
            if (!state[categoryId][productId][optionsHash]) {
                state[categoryId][productId][optionsHash] = []
            }

            if (index !== undefined) {
                state[categoryId][productId][optionsHash][index] = note
            } else {
                state[categoryId][productId][optionsHash].push(note)
            }
        },
        removeNote: (
            state,
            action: PayloadAction<{
                productId: string
                categoryId: string
                selectedOptions: OptionItem[]
                index: number
            }>,
        ) => {
            const { productId, categoryId, selectedOptions, index } = action.payload
            const optionsHash = generateOptionsHash(selectedOptions)

            if (state[categoryId]?.[productId]?.[optionsHash]?.length > index) {
                state[categoryId][productId][optionsHash].splice(index, 1)

                // Clean up empty arrays
                if (state[categoryId][productId][optionsHash].length === 0) {
                    delete state[categoryId][productId][optionsHash]
                }
                if (Object.keys(state[categoryId][productId]).length === 0) {
                    delete state[categoryId][productId]
                }
                if (Object.keys(state[categoryId]).length === 0) {
                    delete state[categoryId]
                }
            }
        },
        clearNotes: (
            state,
            action: PayloadAction<{
                productId: string
                categoryId: string
                selectedOptions?: OptionItem[]
            }>,
        ) => {
            const { productId, categoryId, selectedOptions } = action.payload

            if (selectedOptions) {
                const optionsHash = generateOptionsHash(selectedOptions)
                if (state[categoryId]?.[productId]?.[optionsHash]) {
                    delete state[categoryId][productId][optionsHash]

                    if (Object.keys(state[categoryId][productId]).length === 0) {
                        delete state[categoryId][productId]
                    }
                    if (Object.keys(state[categoryId]).length === 0) {
                        delete state[categoryId]
                    }
                }
            } else {
                if (state[categoryId]?.[productId]) {
                    delete state[categoryId][productId]
                    if (Object.keys(state[categoryId]).length === 0) {
                        delete state[categoryId]
                    }
                }
            }
        },
        clearProductNotes: (
            state,
            action: PayloadAction<{
                productId: string
                categoryId: string
            }>,
        ) => {
            const { productId, categoryId } = action.payload
            if (state[categoryId]?.[productId]) {
                delete state[categoryId][productId]
                if (Object.keys(state[categoryId]).length === 0) {
                    delete state[categoryId]
                }
            }
        },
    },
})

export const { setNote, removeNote, clearNotes, clearProductNotes } = noteSlice.actions

// Helper function exposed for other components
export const getOptionsHash = generateOptionsHash

export const selectNote = (
    state: RootState,
    categoryId: string,
    productId: string,
    selectedOptions: OptionItem[],
    index: number,
) => {
    const optionsHash = generateOptionsHash(selectedOptions)
    return state.notes[categoryId]?.[productId]?.[optionsHash]?.[index]
}

export const selectProductCategoryNotes = (
    state: RootState,
    categoryId: string,
    productId: string,
    selectedOptions: OptionItem[],
) => {
    const optionsHash = generateOptionsHash(selectedOptions)
    return state.notes[categoryId]?.[productId]?.[optionsHash] || []
}

export const selectAllProductNotes = (state: RootState, categoryId: string, productId: string) => {
    const productNotes: { [optionsHash: string]: string[] } = {}

    if (state.notes[categoryId]?.[productId]) {
        return state.notes[categoryId][productId]
    }

    return productNotes
}

export const selectCategoryNotes = (state: RootState, categoryId: string) => {
    const categoryNotes = state.notes[categoryId]
    if (!categoryNotes) return {}
    return categoryNotes
}

export default noteSlice.reducer

