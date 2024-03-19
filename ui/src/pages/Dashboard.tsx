import React from 'react'
import StackedAtendanceChart from './components/dashboard/AtendanceChart'
import { AttendanceCard } from './components'

function Dashboard() {
  return (
    <div className='w-screen h-max flex flex-row gap-2 sm:flex-col md:flex-col lg:flex-row'>
      <AttendanceCard></AttendanceCard>
      <StackedAtendanceChart></StackedAtendanceChart>
    </div>
  )
}

export default Dashboard