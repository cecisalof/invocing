import { createSlice } from '@reduxjs/toolkit'

export const filesStateSlice = createSlice({
    name: 'processedFile',
    initialState: false,
    reducers: {
        failedProcessedFileState: (state, action) => {
            // console.log(action);
            return action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { failedProcessedFileState } = filesStateSlice.actions

export default filesStateSlice.reducer