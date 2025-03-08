import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../stores/store';

interface TotalCountState {
    totalCount: number;
}

const initialState: TotalCountState = {
    totalCount: 0,
};

// Create the totalCount slice
const totalCountSlice = createSlice({
    name: 'totalCount',
    initialState,
    reducers: {
        setTotalCount: (state, action: PayloadAction<number>) => {
            state.totalCount = action.payload;
        },

    },
});

// Export actions
export const { setTotalCount } = totalCountSlice.actions;

// Selector to get the totalCount from the state
export const selectTotalCount = (state: RootState) => state.totalCount.totalCount;

// Export the reducer to be included in the store
export default totalCountSlice.reducer;