import React from 'react'

const Drinks: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-blue-50'>
      {/* Helper component for improved scroll behavior */}
      <div> Drink food</div>
    </div>
  )
}

export default React.memo(Drinks)
