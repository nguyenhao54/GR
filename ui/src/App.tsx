import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Layout } from './structure';
import { Calendar, Dashboard, Profile, Request } from './pages';
import SignIn from './pages/SignIn';
import { useEffect } from 'react';
import { getMyInfo } from './api/user';
import { useDispatch } from 'react-redux';
import { Cookies, withCookies } from 'react-cookie';
import { setCurrentUser } from './redux/user.reducer';
import LessonDetail from './pages/components/calendar/LessonDetail';
import { ToastCalendar } from './pages/components';
import Grade from './pages/Grade';
import ManageUser from './pages/ManageUser';
import ManageClass from './pages/ManageClass';
import ChangePassword from './pages/ChangePassword';

function App(props: { cookies: Cookies }) {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { cookies } = props;
  useEffect(() => {
    if (cookies.get("token")) {
      getMyInfo(cookies.get("token") || "").then((res) => {
        if (res) {
          if (res.data && res.data.data) dispatch(setCurrentUser(res.data.data))
          else navigate("/login")
        }
        else navigate("/login")
      })
    } else navigate("/login")
  }, [cookies, dispatch, navigate])

  const setCookie = (name: string, value: any) => {
    cookies.set(name, value, { path: '/', maxAge: 86400 }); // set expires time
  }

  useEffect(() => {
    if (cookies.get("token")) {
      // navigate('/dashboard');
    }
    else navigate('/login')
  }, [cookies, navigate])

  return (
    <Routes>
      <Route path="/login" element={<SignIn setCookie={setCookie}></SignIn>}></Route>
      <Route path="/" element={<Layout />}>
        <Route path="/profile" element={<Profile />}>
        </Route>
        <Route path="/profile/changePassword" element={<ChangePassword />} />
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/requests" element={<Request />}></Route>
        <Route path="/grades" element={<Grade />}></Route>
        <Route path="/calendar" element={<Calendar />}>
          <Route path="" element={
            <ToastCalendar></ToastCalendar>
          }></Route>
          <Route path="/calendar/:id" element={<LessonDetail></LessonDetail>}></Route>
        </Route>
        <Route path="/admin/manage-user" element={<ManageUser />}></Route>
        <Route path="/admin/manage-class" element={<ManageClass />}></Route>
      </Route>
    </Routes>
  );
}

export default withCookies(App);
