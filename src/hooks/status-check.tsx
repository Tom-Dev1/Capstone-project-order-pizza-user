"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import LoadingFallBack from "../pages/Layouts/LoadingFallBack"
import TableService from "@/services/table-service"
import { setItem } from "@/constants"
const StatusCheck: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const id = `ed5f4000-8b30-4bb9-8e5c-0188f57eb0d0`

    setItem("tableId", id)

    useEffect(() => {
        const checkApiStatus = async () => {
            try {
                const tableService = TableService.getInstance()
                const response = await tableService.checkStatusTable(`${id}`)

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