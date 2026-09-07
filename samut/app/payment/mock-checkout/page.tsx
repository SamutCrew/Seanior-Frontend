// app/payment/mock-checkout/page.tsx
// Stand-in for the real Stripe-hosted checkout page. Only reachable in demo
// mode (see lib/demoMode.ts) - createCheckoutSession() only points here when
// there is no real backend/Stripe account configured.
"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CreditCard, ShieldCheck } from "lucide-react"
import { Button } from "@/components/Common/Button"
import { getCourseRequestById, completeDemoPayment } from "@/mocks/store"

export default function MockCheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestId = searchParams.get("requestId") || ""
  const bookingId = searchParams.get("bookingId") || ""
  const [isPaying, setIsPaying] = useState(false)

  const request = getCourseRequestById(requestId)

  const onPay = () => {
    setIsPaying(true)
    completeDemoPayment(requestId)
    setTimeout(() => {
      router.push(`/payment/success?booking_id=${bookingId}&request_id=${requestId}`)
    }, 800)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
        <CreditCard className="text-blue-500 w-14 h-14 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Demo Checkout</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          This stands in for the real Stripe checkout page. No card details, no real charge.
        </p>

        {request ? (
          <div className="text-left bg-gray-50 dark:bg-slate-700 p-4 rounded-md mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Course:</strong> {request.Course?.course_name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Amount:</strong> {request.request_price?.toLocaleString()} THB
            </p>
          </div>
        ) : (
          <p className="text-sm text-red-500 mb-6">Request not found.</p>
        )}

        <Button variant="primary" className="w-full" disabled={isPaying || !request} onClick={onPay}>
          <ShieldCheck className="mr-2 h-5 w-5" />
          {isPaying ? "Processing..." : "Pay Now (Demo)"}
        </Button>
      </div>
    </div>
  )
}
