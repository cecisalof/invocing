import { createSlice } from '@reduxjs/toolkit'

export const tasksStateSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    tasksAdded: (state, action) => {
      state.slice(action.payload)
    }
  }
})

// Action creators are generated for each case reducer function
export const { tasksAdded } = tasksStateSlice.actions

export default tasksStateSlice.reducer