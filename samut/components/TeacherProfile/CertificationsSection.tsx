"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { FaCheckCircle, FaExternalLinkAlt } from "react-icons/fa"
import type { Certification } from "@/types/teacher"
import { useAppSelector } from "@/app/redux"

interface CertificationsSectionProps {
  certifications: Certification[]
}

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        Certifications & Qualifications
      </h2>

      <div className="space-y-6">
        {certifications.map((certification, index) => (
          <motion.div
            key={certification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex flex-col md:flex-row gap-4 border rounded-lg p-4 hover:shadow-md transition-shadow ${
              isDarkMode ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 relative">
                <Image
                  src={certification.logo || "/placeholder.svg?height=80&width=80&query=certification badge"}
                  alt={certification.name}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {certification.name}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>{certification.issuer}</p>
                </div>
                <div className={`flex items-center text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                  <span>Issued: {certification.issueDate}</span>
                  {certification.expiryDate && <span className="ml-4">Expires: {certification.expiryDate}</span>}
                </div>
              </div>

              <p className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{certification.description}</p>

              {certification.skills && certification.skills.length > 0 && (
                <div className="mt-3">
                  <p className={`text-sm font-medium mb-1 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                    Skills Verified:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {certification.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          isDarkMode ? "bg-blue-900/50 text-blue-300" : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        <FaCheckCircle className={isDarkMode ? "text-blue-400" : "text-blue-500"} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {certification.verificationUrl && (
                <a
                  href={certification.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 text-sm mt-3 ${
                    isDarkMode ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-800"
                  }`}
                >
                  Verify Certification <FaExternalLinkAlt className="text-xs" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
