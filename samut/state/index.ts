import { createSlice } from "@reduxjs/toolkit"

export interface User {
  user_id: string
  name: string
  email: string
  firebase_uid?: string
  profile_img?: string
  user_type?: string
  description?: string
  phone_number?: string
  address?: string
  gender?: string
  created_at?: string
  updated_at?: string
}

interface GlobalState {
  isDarkMode: boolean
  isSidebarCollapsed: boolean
  isMobileSidebarOpen: boolean
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const initialState: GlobalState = {
  isDarkMode: false,
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  user: null,
  token: null,
  isAuthenticated: false,
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
    setLogin: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
    setLogout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
  },
})

export const { setIsDarkmode, setIsSidebarCollapsed, toggleMobileSidebar, setLogin, setLogout, setUser } =
  globalSlice.actions

export default globalSlice.reducer
