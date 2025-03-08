import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../stores/store';


interface TotalPriceState {
    totalPrice: number;
}
const initialState: TotalPriceState = {
    totalPrice: 0,
};

const totalPriceSlice = createSlice({
    name: 'totalPrice',
    initialState,
    reducers: {
        setTotalPrice: (state, action: PayloadAction<number>) => {
            state.totalPrice = action.payload;
        },

    },
});

export const { setTotalPrice } = totalPriceSlice.actions

export const selectTotalPrice = (state: RootState) => state.totalPrice.totalPrice


export default totalPriceSlice.reducer