"use client"

import { Button } from "../Common/Button"
import { motion } from "framer-motion"

interface CTASectionProps {
  title: string
  description: string
  buttonText: string
  onButtonClick?: () => void
}

export const CTASection = ({ title, description, buttonText, onButtonClick }: CTASectionProps) => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white rounded-full opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/3 w-12 h-12 bg-white rounded-full opacity-10"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-10 text-lg md:text-xl text-blue-100"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button
            variant="secondary"
            onClick={onButtonClick}
            className="text-lg px-8 py-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {buttonText}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection
