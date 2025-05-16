"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/Common/Button"
import { XCircle } from "lucide-react"
import { useAppSelector } from "@/app/redux"

interface AuthWarningProps {
  message: string
  onClose?: () => void
  fullPage?: boolean
}

const AuthWarning: React.FC<AuthWarningProps> = ({ message, onClose, fullPage }) => {
  const router = useRouter()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const containerClass = fullPage
    ? `fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-50`
    : `animate-slideDown fixed top-4 left-1/2 -translate-x-1/2 max-w-md bg-amber-50 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-700 text-amber-800 dark:text-amber-300 rounded-md shadow-lg p-4 z-50`

  const contentClass = fullPage ? "text-center" : "flex items-center justify-between"

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        <p className="mr-4">{message}</p>
        <div>
          <Button variant="primary" onClick={() => router.push("/auth/Login")}>
            เข้าสู่ระบบ
          </Button>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthWarning
