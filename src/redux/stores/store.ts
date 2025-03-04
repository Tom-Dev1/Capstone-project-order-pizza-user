import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "../slices/cartSlice"
import selectedOptionsReducer from "../slices/selectedOptionsSlice"
import notesReducer from "../slices/noteSlice"

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        selectedOptions: selectedOptionsReducer,
        notes: notesReducer,
    },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
