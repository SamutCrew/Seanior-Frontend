"use client"
import { useRouter } from "next/navigation"
import Modal from "@/components/UI/Modal"
import { FaSignInAlt } from "react-icons/fa"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  returnUrl?: string
}

export default function LoginModal({ isOpen, onClose, returnUrl = "/" }: LoginModalProps) {
  const router = useRouter()

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
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <FaSignInAlt className="text-blue-500 text-2xl" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Login Required</h3>
          <p className="text-gray-600 dark:text-gray-300">
            You need to be logged in to access this page. Would you like to login now?
          </p>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLogin}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </Modal>
  )
}
