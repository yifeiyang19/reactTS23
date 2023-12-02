import React from 'react'
import Login from './Login'
import './Landing.css'

const Landing = () => {
  return (
    <div className='auth-container'>
      <div className='title'> Book Review Club </div>
      <div className='container'>
        <Login />
      </div>
    </div>
  )
}

export default React.memo(Landing)
