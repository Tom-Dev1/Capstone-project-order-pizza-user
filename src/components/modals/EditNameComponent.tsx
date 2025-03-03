import React, { useEffect, useState } from 'react'
import sgvPencil from '@/assets/icons/pencil.svg'
import { getItem, setItem } from '@/constants'
import { motion } from 'framer-motion'
import { FaChevronLeft } from 'react-icons/fa'
import { Form } from 'antd'
import { getGreeting, getIcon, getTimeOfDay } from '@/constants/GetDate'
import InputComponent from '../ui/InputComponent'
import ButtonComponent from '../ui/ButtonComponent'

const EditNameComponent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const timeOfDay = getTimeOfDay()
  const greeting = getGreeting(timeOfDay)
  const icon = getIcon(timeOfDay)

  const [name, setName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    const user = getItem<{ name: string }>('User')
    if (user) {
      form.setFieldsValue({
        name: user.name || ''
      })
      setName(user.name || '')
    }
  }, [form])

  const handleContinue = async () => {
    setIsLoading(true)
    try {
      const values = await form.validateFields()

      console.log('Form values:', values)
      setItem('User', values)
      setName(values.name)
      setIsVisible(false)
    } catch (error) {
      console.log('Error validating form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center'>
      {icon}
      <h1 className='text-base font-semibold ml-1'>{greeting}</h1>
      <div className='cursor-pointer flex items-center' onClick={() => setIsVisible(true)}>
        <h1 className='ml-1 text-base text-blue-500 font-semibold mr-1'>{name}</h1>
        <img src={sgvPencil} alt='Edit Name' width='13' height='10' />
      </div>

      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className='fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50'
        >
          <div className='w-full h-screen px-[12px] py-[16px] bg-white'>
            <div className='flex items-center' onClick={() => setIsVisible(false)}>
              <FaChevronLeft className='w-3 h-6' />
              <h1 className='text-lg font-semibold ml-3'>Chỉnh sửa thông tin</h1>
            </div>
            <div className='mt-10'>
              <Form form={form} layout='vertical' disabled={isLoading} size='large' onFinish={handleContinue}>
                <InputComponent
                  name='name'
                  type='text'
                  placeholder='Enter your name'
                  rules={[
                    { required: true, message: 'Name is required!' },
                    { max: 50, message: 'Name cannot exceed 50 characters!' }
                  ]}
                />
              </Form>
              {/* language */}
              <div className='mt-36'>
                <ButtonComponent label='Cập nhật' onClick={handleContinue} loading={isLoading} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default EditNameComponent
