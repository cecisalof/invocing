import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from '../features/tasks/taskSlice'
import processedFilesReducer from '../features/processingFiles/filesSlice'
import dateFilterSliceReducer from '../features/filters/filtersSlice'

export default configureStore({
  reducer: {
    tasks: tasksReducer,
    processedFiles: processedFilesReducer,
    filters: dateFilterSliceReducer
  }
})


