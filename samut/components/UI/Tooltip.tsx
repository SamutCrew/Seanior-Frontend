"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppSelector } from "@/app/redux"

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
  delay?: number
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = "top", delay = 300 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const showTooltip = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true)
      updatePosition()
    }, delay)
  }

  const hideTooltip = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setIsVisible(false)
  }

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()

    let x = 0
    let y = 0

    switch (position) {
      case "top":
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
        y = triggerRect.top - tooltipRect.height - 8
        break
      case "bottom":
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
        y = triggerRect.bottom + 8
        break
      case "left":
        x = triggerRect.left - tooltipRect.width - 8
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
        break
      case "right":
        x = triggerRect.right + 8
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
        break
    }

    // Adjust if tooltip would go off screen
    const padding = 10
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Horizontal adjustment
    if (x < padding) {
      x = padding
    } else if (x + tooltipRect.width > viewportWidth - padding) {
      x = viewportWidth - tooltipRect.width - padding
    }

    // Vertical adjustment
    if (y < padding) {
      y = padding
    } else if (y + tooltipRect.height > viewportHeight - padding) {
      y = viewportHeight - tooltipRect.height - padding
    }

    setCoords({ x, y })
  }

  useEffect(() => {
    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  // Update position when tooltip becomes visible
  useEffect(() => {
    if (isVisible) {
      updatePosition()
      window.addEventListener("scroll", updatePosition)
      window.addEventListener("resize", updatePosition)
    }

    return () => {
      window.removeEventListener("scroll", updatePosition)
      window.removeEventListener("resize", updatePosition)
    }
  }, [isVisible])

  const getPositionStyles = () => {
    const styles: React.CSSProperties = {
      position: "fixed",
      left: `${coords.x}px`,
      top: `${coords.y}px`,
      zIndex: 9999,
    }
    return styles
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-flex"
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            style={getPositionStyles()}
            className={`pointer-events-none max-w-xs px-3 py-2 text-xs font-medium rounded shadow-lg ${
              isDarkMode ? "bg-slate-800 text-gray-200 border border-slate-700" : "bg-gray-800 text-white"
            }`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
