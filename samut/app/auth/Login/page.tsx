"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { AlertType } from "@/types/AlertTypes"
import AlertResponse from "@/components/Responseback/AlertResponse"
import withLayout from "@/hocs/WithLayout"
import { LayoutType } from "@/types/layout"
import { motion } from "framer-motion"
import { Mail, Lock, LogIn, Moon, Sun, Eye, EyeOff } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/redux"
import { setIsDarkmode } from "@/state"
import AuthBackground from "@/components/PageAuth/AuthBackground"

const Login = () => {
  const { googleSignIn, signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState(AlertType.INFO)
  const [showPassword, setShowPassword] = useState(false)

  // Get dark mode state from Redux
  const dispatch = useAppDispatch()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const onEmailLogin = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    if (!email || !password) {
      setAlertType(AlertType.ERROR)
      setAlertMessage("Please enter your email and password")
      setLoading(false)
      return
    }
    await signIn(email, password)
      .then(() => {
        setAlertType(AlertType.SUCCESS)
        setAlertMessage("Login successful")
        // Redirect to homepage after successful login
        router.push("/")
      })
      .catch((error: any) => {
        console.error("Error logging in with email:", error)
        setAlertType(AlertType.ERROR)
        setAlertMessage(error.message || "Failed to sign in")
      })
      .finally(() => setLoading(false))
  }

  const onGoogleSignIn = async () => {
    setLoading(true)
    await googleSignIn()
      .then(() => {
        setAlertType(AlertType.SUCCESS)
        setAlertMessage("Google login successful")
        // Redirect to homepage after successful Google login
        router.push("/")
      })
      .catch((error: any) => {
        console.error("Error logging in with Google:", error)
        setAlertType(AlertType.ERROR)
        setAlertMessage(error.message || "Failed to sign in with Google")
      })
      .finally(() => setLoading(false))
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    dispatch(setIsDarkmode(!isDarkMode))
  }

  return (
    <AuthBackground>
      {/* Dark mode toggle */}
      <motion.button
        onClick={toggleDarkMode}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`absolute top-4 right-4 p-2 rounded-full ${
          isDarkMode
            ? "bg-slate-800/80 text-white hover:bg-slate-700/80 backdrop-blur-sm"
            : "bg-white/80 text-gray-800 hover:bg-gray-100/80 shadow-md backdrop-blur-sm"
        }`}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Login Card */}
        <div
          className={`overflow-hidden rounded-xl shadow-xl ${
            isDarkMode
              ? "bg-slate-800/90 backdrop-blur-md border border-slate-700/50"
              : "bg-white/90 backdrop-blur-md border border-white/50"
          }`}
        >
          {/* Blue Gradient Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-8 text-center text-white relative overflow-hidden">
            {/* Animated water ripples in header */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                >
                  <div className={`water-ripple delay-${i}`}></div>
                </div>
              ))}
            </div>

            <div className="relative z-10">
              <motion.div
                className="flex justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2,
                }}
              >
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <LogIn className="h-8 w-8" />
                </div>
              </motion.div>
              <motion.h1
                className="text-3xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Welcome Back
              </motion.h1>
              <motion.p
                className="text-blue-100 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Sign in to your account
              </motion.p>
            </div>
          </div>

          <div className="p-6">
            {alertMessage && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <AlertResponse message={alertMessage} type={alertType} />
              </motion.div>
            )}

            <form onSubmit={onEmailLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                  </div>
                  <input
                    disabled={loading}
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                      isDarkMode
                        ? "bg-slate-700/80 border-slate-600 text-white placeholder-gray-400"
                        : "bg-white/80 border-gray-300 text-gray-900"
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    required
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="password"
                    className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Password
                  </label>
                  <Link
                    href="/auth/Forgotpassword"
                    className={`text-sm ${
                      isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                    }`}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                  </div>
                  <input
                    disabled={loading}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg ${
                      isDarkMode
                        ? "bg-slate-700/80 border-slate-600 text-white placeholder-gray-400"
                        : "bg-white/80 border-gray-300 text-gray-900"
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                    ) : (
                      <Eye className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                    )}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex justify-center items-center shadow-md relative overflow-hidden group"
              >
                {/* Water ripple effect on hover */}
                <span className="ripple-on-hover"></span>

                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>

            <div className="my-6 flex items-center">
              <div className={`flex-grow border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}></div>
              <span className={`mx-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>or continue with</span>
              <div className={`flex-grow border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}></div>
            </div>

            <motion.button
              onClick={onGoogleSignIn}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium ${
                isDarkMode
                  ? "bg-slate-700/80 text-white hover:bg-slate-600/80 border border-slate-600"
                  : "bg-white/80 text-gray-700 hover:bg-gray-50/80 border border-gray-300 shadow-sm"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </motion.button>

            <div className="mt-6 text-center">
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Don't have an account?{" "}
                <Link
                  href="/auth/Register"
                  className={`font-medium ${
                    isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                  }`}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AuthBackground>
  )
}

export default withLayout(Login, LayoutType.Auth)
