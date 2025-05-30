import React from 'react'

const Loader = () => {
  return (
    <div className='flex items-center justify-center w-full h-screen bg-lightBlue'>
      <span className='w-16 h-16 border-4 border-t-4 border-t-white animate-spin rounded-full'></span>
    </div>
  )
}

export default Loader 
