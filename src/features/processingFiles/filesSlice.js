import { createSlice } from '@reduxjs/toolkit'

export const filesStateSlice = createSlice({
    name: 'processedFile',
    initialState: {
        processed: {
            success: [],
            fail: []
        }
    },
    reducers: {
        processedFileState: (state, action) => {
            // state.processed.success.push(action.payload)
            // AVOID DUPLICATING FILE INSIDE ARRAY
            state.processed.success = [...(new Set([...state.processed.success, JSON.stringify(action.payload)]))];

        }
    }
})
// Action creators are generated for each case reducer function
export const { processedFileState } = filesStateSlice.actions

export default filesStateSlice.reducer