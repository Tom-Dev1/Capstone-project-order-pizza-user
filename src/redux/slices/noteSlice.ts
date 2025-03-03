import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/redux/stores/store"

interface NoteState {
    [categoryId: string]: {
        [productId: string]: string[]
    }
}

const initialState: NoteState = {}

export const noteSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        setNote: (state, action: PayloadAction<{ productId: string; categoryId: string; note: string; index: number }>) => {
            const { productId, categoryId, note, index } = action.payload
            if (!state[categoryId]) {
                state[categoryId] = {}
            }
            if (!state[categoryId][productId]) {
                state[categoryId][productId] = []
            }
            state[categoryId][productId][index] = note
        },
        removeNote: (state, action: PayloadAction<{ productId: string; categoryId: string; index: number }>) => {
            const { productId, categoryId, index } = action.payload
            if (state[categoryId]?.[productId]?.length > index) {
                state[categoryId][productId].splice(index, 1)
                // Clean up empty arrays
                if (state[categoryId][productId].length === 0) {
                    delete state[categoryId][productId]
                }
                if (Object.keys(state[categoryId]).length === 0) {
                    delete state[categoryId]
                }
            }
        },
        clearNotes: (state, action: PayloadAction<{ productId: string; categoryId: string }>) => {
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

export const { setNote, removeNote, clearNotes } = noteSlice.actions

export const selectNote = (state: RootState, categoryId: string, productId: string, index: number) =>
    state.notes[categoryId]?.[productId]?.[index]

export const selectProductCategoryNotes = (state: RootState, categoryId: string, productId: string) =>
    state.notes[categoryId]?.[productId] || []

export const selectCategoryNotes = (state: RootState, categoryId: string) => {
    const categoryNotes = state.notes[categoryId]
    if (!categoryNotes) return {}
    return categoryNotes
}

export default noteSlice.reducer

