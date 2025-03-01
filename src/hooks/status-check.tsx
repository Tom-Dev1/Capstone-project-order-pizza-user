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

    const getIdFromPath = (): string | null => {
        const path = window.location.pathname;
        const match = path.match(/\/([^/]+)/);
        if (match) {
            return match[1];
        }
        return null;
    };
    const id = getIdFromPath();
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