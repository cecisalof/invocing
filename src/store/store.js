import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './slice'

export default configureStore({
  reducer: {
    tasks: tasksReducer
  }
})


