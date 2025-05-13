import { createSlice } from "@reduxjs/toolkit"

interface GlobalState {
  isDarkMode: boolean
  isSidebarCollapsed: boolean
  isMobileSidebarOpen: boolean
}

const initialState: GlobalState = {
  isDarkMode: false,
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
}

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsDarkmode: (state, action) => {
      state.isDarkMode = action.payload
    },
    setIsSidebarCollapsed: (state, action) => {
      state.isSidebarCollapsed = action.payload
    },
    toggleMobileSidebar: (state) => {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen
    },
  },
})

export const { setIsDarkmode, setIsSidebarCollapsed, toggleMobileSidebar } = globalSlice.actions
export default globalSlice.reducer
