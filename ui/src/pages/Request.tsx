import React from 'react'
import RequestForm from './components/request/RequestForm'
import RequestTable from './components/request/RequestTable'
import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';

function Request() {
  const user = useSelector((appState: AppState) => appState.user.user);
if (!user) return <></>
  return (
    <div className="bg-white rounded-md p-8 pt-4 w-[100%] h-max flex flex-col items-center">
      {user.role === "student" && <RequestForm></RequestForm>}
      <RequestTable></RequestTable>
    </div>
  )
}

export default Request