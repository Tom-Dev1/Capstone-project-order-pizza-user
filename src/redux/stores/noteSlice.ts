import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"

interface NoteState {
    [productId: string]: string
}

const initialState: NoteState = {}

const noteSlice = createSlice({
    name: "note",
    initialState,
    reducers: {
        setNote: (state, action: PayloadAction<{ productId: string; note: string }>) => {
            const { productId, note } = action.payload
            state[productId] = note
        },
        removeNote: (state, action: PayloadAction<string>) => {
            delete state[action.payload]
        },
    },
})

export const { setNote, removeNote } = noteSlice.actions

export const selectNote = (state: RootState, productId: string) => state.notes[productId]
export const selectAllNotes = (state: RootState) => state.notes

export default noteSlice.reducer

