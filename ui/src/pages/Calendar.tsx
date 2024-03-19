import React from 'react'
import { ToastCalendar } from './components'
import { Outlet } from 'react-router-dom'

function Calendar() {
  return (
    <div className="bg-white rounded-md p-8 pt-4 w-[100%] h-max flex flex-col items-center">
      <Outlet></Outlet>
    </div>
  )
}

export default Calendar