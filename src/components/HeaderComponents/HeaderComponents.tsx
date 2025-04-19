import type React from 'react'
import { NotificationButton } from './NotificationButton'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

const Header: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className='fixed top-0 left-0 right-0 bg-background text-foreground h-[70px] flex items-center z-10 shadow-sm'>
      <div className='container mx-auto flex items-center justify-between h-full px-4'>
        <div>
          <Button
            onClick={() => navigate(-1)}
            variant='outline'
            size='sm'
            className='flex items-center gap-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all'
          >
            <ChevronLeft className='h-4 w-4' />
            <span className='font-medium'>Quay lại</span>
          </Button>
        </div>
        <div className='flex items-center justify-end'>
          <NotificationButton />
        </div>
      </div>
    </div>
  )
}

export default Header
