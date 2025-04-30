"use client"
import { useState } from "react"
import Link from "next/link"
import { AlertType } from "@/types/AlertTypes"
import AlertResponse from "@/components/Responseback/AlertResponse"
import withLayout from "@/hocs/WithLayout"
import { LayoutType } from "@/types/layout"
import { SendForgotPassword } from "@/provider/EmailProvider"
import { motion } from "framer-motion"
import { Mail, Lock, Moon, Sun } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/redux"
import { setIsDarkmode } from "@/state"
import AuthBackground from "@/components/PageAuth/AuthBackground"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState(AlertType.INFO)

  // Get dark mode state from Redux
  const dispatch = useAppDispatch()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const onResetPassword = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const email = e.target.email.value
    if (!email) {
      setAlertType(AlertType.ERROR)
      setAlertMessage("Please enter your email")
      setLoading(false)
      return
    }

    try {
      await SendForgotPassword(email)
      setAlertType(AlertType.SUCCESS)
      setAlertMessage(`Password reset email sent to ${email}`)
      setSuccess(true)
    } catch (error: any) {
      setAlertType(AlertType.ERROR)
      setAlertMessage(error.message)
    } finally {
      setLoading(false)
    }
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
        {/* Forgot Password Card */}
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
                  <Lock className="h-8 w-8" />
                </div>
              </motion.div>
              <motion.h1
                className="text-3xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {success ? "Check Your Email" : "Forgot Password"}
              </motion.h1>
              <motion.p
                className="text-blue-100 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {success ? `We've sent a password reset link to ${email}` : "Enter your email to reset your password"}
              </motion.p>
            </div>
          </div>

          <div className="p-6">
            {alertMessage && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <AlertResponse message={alertMessage} type={alertType} />
              </motion.div>
            )}

            {!success ? (
              <form onSubmit={onResetPassword} className="space-y-4">
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
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>

                <div className="mt-6 text-center">
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                    Remember your password?{" "}
                    <Link
                      href="/auth/Login"
                      className={`font-medium ${
                        isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                      }`}
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-6">
                  <button
                    onClick={() => {
                      setSuccess(false)
                      setEmail("")
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-medium py-3 px-4 rounded-lg transition duration-200 relative overflow-hidden"
                  >
                    <span className="ripple-on-hover"></span>
                    Resend Email
                  </button>
                </motion.div>
                <div className="mt-6">
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                    If you change your mind,{" "}
                    <Link
                      href="/auth/Login"
                      className={`font-medium ${
                        isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                      }`}
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AuthBackground>
  )
}

export default withLayout(ForgotPassword, LayoutType.Auth)
