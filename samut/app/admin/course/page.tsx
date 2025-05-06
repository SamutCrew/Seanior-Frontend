'use client'
import React, { useState, useEffect } from 'react'
import { useAuth } from "@/context/AuthContext"
import withLayout from "@/hocs/WithLayout"
import { LayoutType } from "@/types/layout"

const AdminCourse = () => {
    const { user } = useAuth()

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Course Dashboard</h1>
            <p className="mb-2">Welcome, {user?.user_name || "Admin"}</p>
        </div>
    )
}

export default withLayout(AdminCourse, LayoutType.Admin)