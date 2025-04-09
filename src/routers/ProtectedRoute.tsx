"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Navigate, useLocation, useParams, useSearchParams } from "react-router-dom"
import { getItem, setItem } from "@/constants"
import TableService from "@/services/table-service"
import LoadingFallBack from "@/pages/Layouts/LoadingFallBack"

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isAllowed, setIsAllowed] = useState(false)
    const [redirectPath, setRedirectPath] = useState<string | null>(null)
    const location = useLocation()
    const { id } = useParams<{ id: string }>()
    const [searchParams] = useSearchParams()
    const tableCode = searchParams.get("tableCode")

    // Exclude these paths from protection
    const publicPaths = ["/closed", "/locked", "/booked"]
    const isPublicPath = publicPaths.some((path) => location.pathname.startsWith(path))

    // Store tableId and tableCode in storage
    useEffect(() => {
        if (id) {
            setItem("tableId", id)
        }
        if (tableCode) {
            setItem("tableCode", tableCode)
        }
    }, [id, tableCode])

    // If current path is a public path, allow access without checking
    if (isPublicPath) {
        return <>{children}</>
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        let isMounted = true
        let intervalId: NodeJS.Timeout | null = null

        const checkTableStatus = async () => {
            try {
                // Get tableId from params or from storage
                const tableId = id || getItem("tableId")

                // If no tableId is found, we can't check status
                if (!tableId) {
                    if (isMounted) {
                        setIsAllowed(false)
                        setIsLoading(false)
                        setRedirectPath("/closed") // Default fallback
                    }
                    return
                }

                const tableService = TableService.getInstance()
                const response = await tableService.checkStatusTable(tableId)

                if (response.success && response.result) {
                    // Handle different table statuses exactly like StatusCheck component
                    switch (response.result.status) {
                        case "Opening":
                            if (isMounted) {
                                setIsAllowed(true)
                                setRedirectPath(null)
                            }
                            break
                        case "Locked":
                            if (isMounted) {
                                setIsAllowed(false)
                                setRedirectPath("/locked")
                            }
                            break
                        case "Booking":
                            if (isMounted) {
                                setIsAllowed(false)
                                setRedirectPath("/booked")
                            }
                            break
                        case "Closing":
                            if (isMounted) {
                                setIsAllowed(false)
                                setRedirectPath("/closed")
                            }
                            break
                        default:
                            if (isMounted) {
                                setIsAllowed(false)
                                setRedirectPath("/closed") // Default fallback
                            }
                    }
                } else {
                    if (isMounted) {
                        setIsAllowed(false)
                        setRedirectPath("/closed") // Default fallback on error
                    }
                }
            } catch (error) {
                console.error("Error checking table status:", error)
                if (isMounted) {
                    setIsAllowed(false)
                    setRedirectPath("/closed")
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        checkTableStatus()

        // Set up periodic status check (every 30 seconds)
        intervalId = setInterval(checkTableStatus, 30000)

        return () => {
            isMounted = false
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [id])

    if (isLoading) {
        return <LoadingFallBack />
    }

    if (!isAllowed && redirectPath) {
        // Redirect to the appropriate path based on table status
        return <Navigate to={redirectPath} replace />
    }

    return <>{children}</>
}

export default ProtectedRoute
