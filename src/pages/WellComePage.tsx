import React, { useState } from 'react'
import { Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ButtonComponent, InputComponent } from '@/components';
import { setItem } from '@/constants';
import LocationAnimation from '@/components/Animations/LocationAnimation';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [form] = Form.useForm();


  const handleContinue = async () => {

    setIsLoading(true);
    try {
      console.log(form);
      const values = await form.validateFields();
      console.log('Form values:', values);
      setItem('User', values)
      navigate('/action');
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  return (
    <div className='flex justify-center h-screen'>
      <div className=' px-[12px] py-[16px]  max-w-sm w-full'>
        <h1
          className='text-center'
          style={{
            fontFamily: 'Inspiration',
            fontSize: '128px',
            fontWeight: 400,
            lineHeight: 'normal',
            color: '#000'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              transform: 'rotate(-5deg)',
              position: 'relative',
              top: 20,
              right: 60
            }}
          >
            Hello
          </span>
          <span
            style={{
              display: 'inline-block',
              transform: 'rotate(5deg)',
              marginLeft: 120,
              position: 'relative',
              bottom: 40
            }}
          >
            Pizza
          </span>
        </h1>
        <div className='text-sm text-gray-600 mb-2  flex items-center'>
          <LocationAnimation /><p className='font-semibold'>Nhà hàng Pizza - Long Thạnh Mỹ, Quận 9, Tp Thủ Đức, Tp Hồ Chí Minh -
            Chào bạn !!!</p></div>
        <p className='text-sm sm:text-sm mb-4 sm:mb-6 text-gray-700 '>
          Please enter your name so that the restaurant can serve you faster and more accurately
        </p>
        <Form
          layout='vertical'
          disabled={isLoading}
          size='large'
          form={form}
          onFinish={handleContinue}
        >
          <InputComponent
            name={'name'}
            type='name'
            placeholder='Enter your name'
            rules={[
              { required: true, message: 'Name is required!' },
              { max: 50, message: 'Name cannot exceed 50 characters!' },
            ]}
          />

          <ButtonComponent label='Tiếp tục' onClick={handleContinue} loading={isLoading} />
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
