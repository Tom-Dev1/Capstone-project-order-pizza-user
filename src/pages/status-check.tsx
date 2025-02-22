"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import LoadingFallBack from "./Layouts/LoadingFallBack"
import { checkStatus } from "@/apis/check-status-table"
const StatusCheck: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const checkApiStatus = async () => {
            try {
                const response = await checkStatus()
                console.log(response);

                if (!response.success) {
                    setError(response.message)
                } else {
                    if (response.result.status === "Opening") {
                        navigate("/get-started")
                    } else {
                        navigate("/closed")
                    }
                }
            } catch (err) {
                setError("An unexpected error occurred")
            } finally {
                setIsLoading(false)
            }
        }

        checkApiStatus()
    }, [navigate])

    if (isLoading) {
        return <LoadingFallBack />
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return null
}

export default StatusCheck