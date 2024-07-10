import RequestTable from './components/request/RequestTable'
import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';

function Request() {
  const user = useSelector((appState: AppState) => appState.user.user);
  if (!user) return <></>
  return (
    <div className="bg-white rounded-md p-4 sm:p-8 pt-4 w-[100%] h-max flex flex-col items-center">
      <RequestTable></RequestTable>
    </div>
  )
}

export default Request