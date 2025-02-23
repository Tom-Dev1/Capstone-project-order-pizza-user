import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./cartSlice"
import selectedOptionsReducer from "./selectedOptionsSlice"
import notesReducer from './noteSlice'
export const store = configureStore({
    reducer: {
        cart: cartReducer,
        selectedOptions: selectedOptionsReducer,
        notes: notesReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

