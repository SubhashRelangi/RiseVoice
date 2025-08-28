import React from 'react'
import '../StyleSheets/Navigation.css'

const Navigation = () => {
  return (
    <div className='navigation'>
        <div className='brand'>
            <h1 className='Title'>VoiceUp</h1>
        </div>
        <div className='navLinks'>
            <a href='#' className='navLinkEle'>Home</a>
            <a href='#' className='navLinkEle'>Services</a>
            <a href='#' className='navLinkEle'>Track</a>
            <a href='#' className='navLinkEle'>Login</a>
        </div>
    </div>
  )
}

export default Navigation