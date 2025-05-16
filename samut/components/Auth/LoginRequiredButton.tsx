"use client"
import { useRouter } from "next/navigation"
import Modal from "@/components/UI/Modal"
import { FaSignInAlt } from "react-icons/fa"
import { useState } from "react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  returnUrl?: string
}

export default function LoginModal({ isOpen, onClose, returnUrl = "/" }: LoginModalProps) {
  const router = useRouter()
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  const handleLogin = () => {
    // Close the modal
    onClose()
    // Redirect to login page with return URL
    router.push(`/auth/Login?returnUrl=${encodeURIComponent(returnUrl)}`)
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login Required" size="sm">
      <div className="flex flex-col items-center">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center transform transition-transform duration-500 hover:scale-110 animate-fadeIn">
              <FaSignInAlt className="text-blue-500 text-2xl animate-fadeIn animation-delay-200" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 animate-fadeIn animation-delay-300">Login Required</h3>
          <p className="text-gray-600 dark:text-gray-300 animate-fadeIn animation-delay-400">
            You need to be logged in to access this page. Would you like to login now?
          </p>
        </div>

        <div className="flex gap-3 w-full animate-fadeIn animation-delay-500">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1"
          >
            Cancel
          </button>
          <button
            onClick={handleLogin}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          >
            <span className="relative z-10">Login</span>
            <span
              className={`ripple-on-hover ${isButtonHovered ? "opacity-30 scale-100" : "opacity-0 scale-0"}`}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: isButtonHovered ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0)",
                width: "200%",
                height: "200%",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                transition: "all 0.7s ease-out",
              }}
            ></span>
          </button>
        </div>
      </div>
    </Modal>
  )
}
