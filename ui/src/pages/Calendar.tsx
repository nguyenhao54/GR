import { Outlet } from 'react-router-dom'

function Calendar() {
  return (
    <div className="bg-white rounded-md p-4 sm:p-8 pt-4 w-max sm:w-full h-max flex flex-col items-center">
      <Outlet></Outlet>
    </div>
  )
}

export default Calendar