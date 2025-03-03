import type React from 'react'
import { useState } from 'react'
import { Form } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ButtonComponent, InputComponent } from '@/components'
import { setItem } from '@/constants'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

interface LoginPageProps {
  lable: string
}
const LoginPage: React.FC<LoginPageProps> = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleContinue = async () => {
    setIsLoading(true)
    try {
      const values = await form.validateFields()
      setItem('User', values)
      navigate('/action')
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4'>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='w-full max-w-md'>
        {/* Main Card */}
        <div className='bg-white rounded-3xl shadow-lg overflow-hidden'>
          {/* Top Section */}

          {/* Content */}
          <div className='px-6 pt-6 pb-8'>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className='text-center mb-6'>
                <span className='block text-6xl font-cursive text-black-500 mb-2'>Hello Pizza</span>
                <span className='text-sm text-gray-600'>Chào mừng bạn đến với nhà hàng của chúng tôi!</span>
              </h1>

              {/* Location Card */}
              <div className='bg-orange-50 rounded-xl p-4'>
                <div className='flex items-start gap-3'>
                  <MapPin className='w-5 h-5 text-orange-500 mt-0.5' />
                  <div>
                    <h3 className='font-medium text-gray-900'>Nhà hàng Pizza</h3>
                    <p className='text-sm text-gray-600 mt-1'>Long Thạnh Mỹ, Quận 9, Tp Thủ Đức, Tp Hồ Chí Minh</p>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className='mt-8'>
                <Form layout='vertical' disabled={isLoading} size='large' form={form} onFinish={handleContinue}>
                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Xin chào! Bạn tên là gì?</label>
                      <InputComponent
                        name='name'
                        type='name'
                        placeholder='Nhập tên của bạn'
                        rules={[
                          { required: true, message: 'Vui lòng nhập tên của bạn!' },
                          { max: 50, message: 'Tên không được quá 50 ký tự!' }
                        ]}
                      />
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <ButtonComponent
                        label='Tiếp tục'
                        onClick={handleContinue}
                        loading={isLoading}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(to right, #ff7a1a, #ff6600)',
                          color: 'white',
                          borderRadius: '12px',
                          padding: '12px',
                          fontWeight: 500
                        }}
                      />
                    </motion.div>
                  </div>
                </Form>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
