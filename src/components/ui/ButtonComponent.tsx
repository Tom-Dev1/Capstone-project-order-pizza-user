import React from 'react'
import { Button, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface ButtonProps {
  label: string
  onClick: () => void
  loading?: boolean
  style: React.CSSProperties
}

const ButtonComponent: React.FC<ButtonProps> = ({ label, onClick, loading = false }) => {
  const loadingIcon = <LoadingOutlined style={{ fontSize: 16 }} spin />

  return (
    <Button
      className='w-full mt-2 py-5 bg-orange-400 text-white rounded-md border-orange-400 text-lg font-medium'
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <Spin indicator={loadingIcon} /> : label}
    </Button>
  )
}

export default ButtonComponent
