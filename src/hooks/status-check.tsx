'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import LoadingFallBack from '../pages/Layouts/LoadingFallBack'
import TableService from '@/services/table-service'
import { setItem } from '@/constants'
const StatusCheck: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const { id } = useParams<{ id: string }>();

    // Get the `tableCode` from the query parameters "?tableCode=XYZ"
    const [searchParams] = useSearchParams();
    const tableCode = searchParams.get("tableCode");

    setItem("tableCode", tableCode)
    setItem('tableId', id)

    useEffect(() => {
        const checkApiStatus = async () => {
            try {
                const tableService = TableService.getInstance()
                const response = await tableService.checkStatusTable(`${id}`)

                if (!response.success) {
                    setError(response.message)
                } else {
                    if (response.result.status === 'Opening') {
                        navigate(`/get-started/${id}`)
                    } else {
                        navigate('/closed')
                    }
                }
            } catch (err) {
                setError('An unexpected error occurred')
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
