import React, { useState, useEffect } from 'react'
import './LoginPage.css'
import profileuser from './profileuser.png'

const LoginPage = () => {
  const [captcha, setCaptcha] = useState('')
  const [userCaptcha, setUserCaptcha] = useState('')

  // Generate random captcha
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptcha(result)
  }

  // On first load
  useEffect(() => {
    generateCaptcha()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (userCaptcha === captcha) {
      alert('Captcha correct! Form submitted.')
    } else {
      alert('Captcha incorrect. Please try again.')
      generateCaptcha()
      setUserCaptcha('')
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <div>
          <img src={profileuser} alt="user logo" className='profileuser' />
        </div>

        <input type="text" className='userid' placeholder='user id' />
        <br />
        <input type="password" className='userid' placeholder='password' />
        <br />

        {/* Captcha display */}
        <div className="captcha-box" >
          {captcha}
           <button type="button" onClick={generateCaptcha}>Reload Captcha</button>
        </div>
        <br />
        <input 
          type="text" 
          className='captcha-input' 
          placeholder='Enter captcha' 
          value={userCaptcha}
          onChange={(e) => setUserCaptcha(e.target.value)} 
          required 
        />
        <br />
       
        <button type="submit" className='login-btn'>Login</button>
      </form>
    </div>
  )
}

export default LoginPage
