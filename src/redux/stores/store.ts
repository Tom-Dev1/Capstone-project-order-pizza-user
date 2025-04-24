import { configureStore } from "@reduxjs/toolkit"
import cartReducer, { loadCartFromStorage } from "../slices/cartSlice"
import selectedOptionsReducer from "../slices/selectedOptionsSlice"
import notesReducer from "../slices/noteSlice"
import totalCountReducer from '../slices/totalCountSlide'
import totalPriceReducer from '../slices/totalPriceSlice'

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        selectedOptions: selectedOptionsReducer,
        notes: notesReducer,
        totalCount: totalCountReducer,
        totalPrice: totalPriceReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

// Load cart from localStorage when the store is created
if (typeof window !== "undefined") {
    store.dispatch(loadCartFromStorage())
}
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
