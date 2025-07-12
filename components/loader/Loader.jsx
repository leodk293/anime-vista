import React from 'react'
import './styles.css'

export default function Loader() {
  return (
    <div className=' mt-10 flex flex-col items-center gap-5 min-h-screen'>
        <p className='font-bold text-2xl text-[#514b82]'>Loading</p>
        <span className='loader' />
    </div>
  )
}