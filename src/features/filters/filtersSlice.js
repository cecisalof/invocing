import { createSlice } from '@reduxjs/toolkit'

export const dateFilterSlice = createSlice({
    name: 'dataFilter',
    initialState: {
        filter: '',
    },
    reducers: {
        dateFilterState: (state, action) => { 
            return action.payload
        }
    }
})
// Action creators are generated for each case reducer function
export const { dateFilterState } = dateFilterSlice.actions

export default dateFilterSlice.reducer