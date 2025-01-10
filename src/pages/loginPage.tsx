import { useState } from 'react'

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
    <div
      className='flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 font-sans'
      style={{
        backgroundImage: 'url(src/assets/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div
        className='bg-white shadow-md rounded-lg p-4 sm:p-6 max-w-xs sm:max-w-md w-full'
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(6px)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h1
          className='text-center'
          style={{
            fontFamily: 'Inspiration',
            fontSize: 'clamp(100px, 6vw, 48px)',
            fontWeight: 600,
            lineHeight: 'normal',
            color: '#000'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              transform: 'rotate(-5deg)',
              position: 'relative',
              top: 'clamp(45px, 1vw, 0px)',
              right: 'clamp(45px, 2vw, 16px)'
            }}
          >
            Hello
          </span>
          <span
            style={{
              display: 'block',
              transform: 'rotate(5deg)',
              marginLeft: 'clamp(20px, 5vw, 0px)',
              position: 'relative',
              top: 'clamp(0px, 1vw, 0px)',
              left: 'clamp(50px, 2vw, 16px)',
              bottom: 'clamp(4px, 1vw, 8px)'
            }}
          >
            Pizza
          </span>
        </h1>
        <p className='text-xs sm:text-sm text-gray-600 mb-1 text-center'>
          Nhà hàng Pizza - Long Thạnh Mỹ, Quận 9, Tp Thủ Đức
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
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            opacity: 0.9
          }}
        />
        <input
          className='w-full px-3 py-2 mb-4 sm:mb-6 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
          type='tel'
          placeholder='Enter your phone number'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            opacity: 0.9
          }}
        />
        <button
          className='w-full max-w-sm px-4 py-2 bg-orange-500 text-white rounded-md text-lg font-medium hover:bg-orange-600'
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default LoginPage
