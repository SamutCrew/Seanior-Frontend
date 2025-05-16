"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

interface SimpleTooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function SimpleTooltip({ content, children, className = "" }: SimpleTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const updatePosition = () => {
    if (triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      // Position above the trigger by default
      let top = triggerRect.top - tooltipRect.height - 8
      let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2

      // If tooltip would go off the top of the screen, position it below the trigger
      if (top < 0) {
        top = triggerRect.bottom + 8
      }

      // Ensure tooltip doesn't go off the left or right of the screen
      if (left < 10) left = 10
      if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10
      }

      setPosition({ top, left })
    }
  }

  const handleMouseEnter = () => {
    setIsVisible(true)
    // Use setTimeout to ensure the tooltip is rendered before measuring
    setTimeout(updatePosition, 0)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  return (
    <>
      <div ref={triggerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="inline-flex">
        {children}
      </div>

      {mounted &&
        isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`fixed z-50 px-3 py-1.5 text-sm text-slate-200 bg-slate-800 border border-slate-700 rounded-md shadow-md ${className}`}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  )
}
