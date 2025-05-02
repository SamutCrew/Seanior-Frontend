'use client'
import React, { useState, useEffect } from 'react'
import { uploadProfileImage, getAllResources } from "@/api"
import { useAuth } from "@/context/AuthContext"
import { Input } from "@heroui/react"
import withLayout from "@/hocs/WithLayout"
import { LayoutType } from "@/types/layout"

// Utility function to parse backend date string
const parseBackendDate = (dateString: string | null | undefined): Date | null => {
    if (!dateString) {
        console.warn("parseBackendDate: Received null or undefined date string")
        return null
    }
    try {
        const trimmedDateString = dateString.trim()
        const isoDateString = trimmedDateString.replace(' ', 'T')
        const parsedDate = new Date(isoDateString)
        if (isNaN(parsedDate.getTime())) {
            console.warn(`parseBackendDate: Invalid date string: ${trimmedDateString}`)
            return null
        }
        return parsedDate
    } catch (error) {
        console.error(`parseBackendDate: Error parsing date string: ${dateString}`, error)
        return null
    }
}

// Utility function to determine if a resource is an image or PDF
const isImage = (resource: Resource): boolean => {
    const imageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
    const extension = resource.resource_url.split('.').pop()?.toLowerCase()
    return imageTypes.includes(resource.resource_type) || ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension || '')
}

const isPDF = (resource: Resource): boolean => {
    const extension = resource.resource_url.split('.').pop()?.toLowerCase()
    return resource.resource_type === 'application/pdf' || extension === 'pdf'
}

// Resource interface
export interface Resource {
    resource_id: string;
    user_id: number;
    resource_name: string;
    resource_size: number;
    resource_type: string;
    resource_url: string;
    create_at: string | null;
    update_at: string | null;
}

const Admin = () => {
    const { user } = useAuth()
    const [file, setFile] = useState<File | null>(null)
    const [resources, setResources] = useState<Resource[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    // Fetch resources when component mounts
    useEffect(() => {
        const fetchResources = async () => {
            try {
                setLoading(true)
                const data = await getAllResources()
                if (typeof data === "string") {
                    setError(data)
                    setResources([])
                } else {
                    console.log("Fetched resources:", data)
                    setResources(data as Resource[])
                    // Log URLs for debugging
                    data.forEach((resource: Resource) =>
                        console.log(`Resource ${resource.resource_id} URL:`, resource.resource_url)
                    )
                    setError(null)
                }
            } catch (err) {
                setError("Failed to fetch resources")
                setResources([])
            } finally {
                setLoading(false)
            }
        }

        fetchResources()
    }, [])

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }

    // Handle file upload
    const handleFileUpload = async () => {
        if (!file) {
            console.error("No file selected")
            return
        }
        if (!user?.user_id) {
            console.error("User ID not available")
            return
        }

        try {
            const response = await uploadProfileImage(user.user_id, file)
            if (typeof response === "string") {
                console.error("Upload failed:", response)
            } else {
                console.log("File uploaded successfully:", response)
                const data = await getAllResources()
                if (typeof data !== "string") {
                    setResources(data as Resource[])
                    setError(null)
                }
                setFile(null)
            }
        } catch (error) {
            console.error("Error uploading file:", error)
        }
    }

    // Handle opening the modal
    const openModal = (resource: Resource) => {
        setSelectedResource(resource)
        setIsModalOpen(true)
    }

    // Handle closing the modal
    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedResource(null)
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <p className="mb-2">Welcome, {user?.user_name || "Admin"}</p>
        </div>
    )
}

export default withLayout(Admin, LayoutType.Admin)