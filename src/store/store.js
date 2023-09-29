import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from '../features/tasks/taskSlice'
import processedFilesReducer from '../features/processingFiles/filesSlice'

export default configureStore({
  reducer: {
    tasks: tasksReducer,
    processedFiles: processedFilesReducer
  }
})


