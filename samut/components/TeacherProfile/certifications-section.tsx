"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { FaCheckCircle, FaExternalLinkAlt } from "react-icons/fa"
import type { Certification } from "@/types/teacher"

interface CertificationsSectionProps {
  certifications: Certification[]
}

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Certifications & Qualifications</h2>

      <div className="space-y-6">
        {certifications.map((certification, index) => (
          <motion.div
            key={certification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col md:flex-row gap-4 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
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
                  <h3 className="font-semibold text-gray-800">{certification.name}</h3>
                  <p className="text-gray-500 text-sm">{certification.issuer}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Issued: {certification.issueDate}</span>
                  {certification.expiryDate && <span className="ml-4">Expires: {certification.expiryDate}</span>}
                </div>
              </div>

              <p className="text-gray-600 mt-2">{certification.description}</p>

              {certification.skills && certification.skills.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Skills Verified:</p>
                  <div className="flex flex-wrap gap-2">
                    {certification.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                      >
                        <FaCheckCircle className="text-blue-500" />
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
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-3"
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
