import React from 'react'
import { ToastCalendar } from './components'

function Calendar() {
  return (
    <div className="bg-white rounded-md p-8 w-[99%] flex flex-col items-center h-[99%]">

      <ToastCalendar></ToastCalendar>
    </div>
  )
}

export default Calendar