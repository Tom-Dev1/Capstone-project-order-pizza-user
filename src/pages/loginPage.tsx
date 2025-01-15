import React, { useState } from 'react'
import { Form } from 'antd';
import { ButtonComponent, InputComponent, LocationAnimation } from '../components';


const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();
  const handleContinue = async () => {
    setIsLoading(true);
    try {
      console.log(form);
      const values = await form.validateFields();
      console.log('Form values:', values);

    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className=' px-4  max-w-sm w-full'>
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
          <InputComponent
            name={'phone'}
            type='phone'
            placeholder='Enter your phone number'
            rules={[
              { required: true, message: 'Please input your phone number!' },
              {
                pattern: /^[0-9]{10}$/,
                message: 'Phone number must be exactly 10 digits!',
              },
            ]} />
          <ButtonComponent label='Continue' onClick={handleContinue} loading={isLoading} />
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
