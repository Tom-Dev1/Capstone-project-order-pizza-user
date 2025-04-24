"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import LoadingFallBack from "../pages/Layouts/LoadingFallBack"
import TableService from "@/services/table-service"
import { setItem } from "@/constants"

const StatusCheck: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const { id } = useParams<{ id: string }>()

    setItem("tableId", id)

    useEffect(() => {
        const checkApiStatus = async () => {
            try {
                const tableService = TableService.getInstance()
                const response = await tableService.checkStatusTable(`${id}`)
                const tableCode = response.result.code
                setItem("tableCode", tableCode)
                console.log("Table code set in local storage:", tableCode);

                if (!response.success) {
                    setError(response.message)
                } else {
                    switch (response.result.status) {
                        case "Opening":
                            navigate(`/get-started/${id}`)
                            break
                        case "Locked":
                            navigate("/locked")
                            break
                        case "Booking":
                            navigate("/booked")
                            break
                        case "Closing":
                            navigate("/closed")
                            break
                        default:
                            setError(`Unexpected table status: ${response.result.status}`)
                    }
                }
            } catch (err) {
                console.log(err);

                setError("An unexpected error occurred")
            } finally {
                setIsLoading(false)
            }
        }

        checkApiStatus()
    }, [navigate, id])

    if (isLoading) {
        return <LoadingFallBack />
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return null
}

export default StatusCheck

