import React, { useState } from 'react'

interface ButtonProps {
  label: string
  onClick: () => void
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      className='w-full max-w-sm px-4 py-2 bg-orange-500 text-white rounded-md text-lg font-medium hover:bg-orange-600'
      onClick={onClick}
    >
      {label}
    </button>
  )
}

const LoginPage: React.FC = () => {
  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')

  const handleContinue = () => {
    if (!name || !phone) {
      alert('Please fill out both fields before continuing.')
      return
    }
    console.log('Name:', name)
    console.log('Phone:', phone)
    alert('Thank you! Your information has been submitted.')
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 font-sans'>
      <div className='bg-white shadow-md rounded-lg p-4 sm:p-6 max-w-sm sm:max-w-md w-full'>
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
        <p className='text-xs sm:text-sm text-gray-600 mb-1 text-center'>
          Nhà hàng Pizza - Long Thạnh Mỹ, Quận 9, Tp Thủ Đức, Tp Hồ Chí Minh
        </p>
        <p className='text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-center'>Chào bạn !!!</p>
        <p className='text-xs sm:text-sm mb-4 sm:mb-6 text-gray-700 text-center'>
          Please enter your name so that the restaurant can serve you faster and more accurately
        </p>
        <input
          className='w-full px-3 py-2 mb-3 sm:mb-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
          type='text'
          placeholder='Enter your name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className='w-full px-3 py-2 mb-4 sm:mb-6 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
          type='tel'
          placeholder='Enter your phone number'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button label='Continue' onClick={handleContinue} />
      </div>
    </div>
  )
}

export default LoginPage
