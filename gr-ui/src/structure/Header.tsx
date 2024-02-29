import React from 'react'
import { NavLink } from 'react-router-dom'
import { Logo } from '../assets/img'

function Header() {
  return (
    <div className='fixed h-14 bg-whit top-0 w-full bg-white flex items-center justify-between'>
      <div className="bg-white h-12 flex items-center justify-between">
        <NavLink to="/" className="bg-white w-full ">
          <div className="w-32 p-30 px-8 text-3xl text-barnRed font-bold">TENDIFY</div>
        </NavLink>

      </div>
      <div className="p-4 px-8 flex justify-center items-center">
        <img className="w-10 h-10 bg-barnRed rounded-full"></img>
        <div className="flex flex-col p-4 text-neutral-800" >
          <p className="font-semibold">Nguyễn Hải Vũ</p>
          <p>20194567</p>
        </div>
      </div></div>
  )
}

export default Header