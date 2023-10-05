import { createSlice } from '@reduxjs/toolkit'

export const filesStateSlice = createSlice({
    name: 'processedFile',
    initialState: {
        processed: [],
    },
    reducers: {
        processedFileState: (state, action) => {            
            // AVOID DUPLICATING FILE INSIDE ARRAY
            state.processed = [...(new Set([...state.processed, JSON.stringify(action.payload)]))];
        }
    }
})
// Action creators are generated for each case reducer function
export const { processedFileState } = filesStateSlice.actions

export default filesStateSlice.reducer