import StackedAtendanceChart from './components/dashboard/AtendanceChart'
import { AttendanceCard } from './components'

function Dashboard() {
  return (
    <div className='w-screen h-max flex items-stretch gap-2 flex-col sm:flex-row'>
      <AttendanceCard></AttendanceCard>
      <StackedAtendanceChart></StackedAtendanceChart>
    </div>
  )
}

export default Dashboard