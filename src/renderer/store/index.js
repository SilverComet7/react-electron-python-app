import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  devTools: {
    name: 'Electron Redux App',
    trace: true,
  },
}) 