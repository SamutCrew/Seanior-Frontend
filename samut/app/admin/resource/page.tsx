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
            <h1 className="text-2xl font-bold mb-4">Admin Resource Page</h1>
            <p className="mb-4">Use to see all resources uploaded by users.</p>
            <p className="mb-4">You can upload a new resource using the form below.</p>

            {/* File Upload Section */}
            <div className="mb-6">
                <Input
                    type="file"
                    label="Upload File"
                    variant="bordered"
                    radius="none"
                    onChange={handleFileChange}
                    className="mb-2"
                />
                <button
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
                    onClick={handleFileUpload}
                    disabled={!file || !user?.user_id}
                >
                    Upload Resource
                </button>
            </div>

            {/* Resource List Table */}
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-3">Resource List</h2>
                {loading ? (
                    <p>Loading resources...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : resources.length === 0 ? (
                    <p>No resources available.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-2 text-left">Resource Name</th>
                                    <th className="border border-gray-300 p-2 text-left">Type</th>
                                    <th className="border border-gray-300 p-2 text-left">Size (KB)</th>
                                    <th className="border border-gray-300 p-2 text-left">User ID</th>
                                    <th className="border border-gray-300 p-2 text-left">Created At</th>
                                    <th className="border border-gray-300 p-2 text-left">URL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resources.map((resource) => {
                                    console.log(`Resource ${resource.resource_id} create_at:`, resource.create_at)
                                    const parsedDate = parseBackendDate(resource.create_at)
                                    return (
                                        <tr key={resource.resource_id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 p-2">{resource.resource_name}</td>
                                            <td className="border border-gray-300 p-2">{resource.resource_type}</td>
                                            <td className="border border-gray-300 p-2">
                                                {(resource.resource_size / 1024).toFixed(2)}
                                            </td>
                                            <td className="border border-gray-300 p-2">{resource.user_id}</td>
                                            <td className="border border-gray-300 p-2">
                                                {parsedDate ? parsedDate.toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                <button
                                                    onClick={() => openModal(resource)}
                                                    className="text-blue-500 hover:underline focus:outline-none"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal for Viewing Resource */}
            {isModalOpen && selectedResource && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full h-full max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{selectedResource.resource_name}</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex justify-center h-screen max-h-[10vh]">
                            {isImage(selectedResource) ? (
                                <img
                                    src={selectedResource.resource_url}
                                    alt={selectedResource.resource_name}
                                    className="max-w-full max-h-[70vh] object-contain"
                                    onError={() => console.error(`Failed to load image: ${selectedResource.resource_url}`)}
                                />
                            ) : isPDF(selectedResource) ? (
                                <iframe
                                    src={selectedResource.resource_url}
                                    title={selectedResource.resource_name}
                                    className="w-full h-full"
                                    onError={() => console.error(`Failed to load PDF: ${selectedResource.resource_url}`)}
                                />
                            ) : (
                                <p className="text-gray-600 dark:text-gray-300">
                                    Preview not available for this file type ({selectedResource.resource_type}).
                                </p>
                            )}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <a
                                href={selectedResource.resource_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                Open in new tab
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default withLayout(Admin, LayoutType.Admin)