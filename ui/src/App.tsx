import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Layout } from './structure';
import { Calendar, Dashboard } from './pages';
import SignIn from './pages/SignIn';
import { useEffect, useState } from 'react';
import { getMyInfo } from './api/user';
import { useDispatch } from 'react-redux';
import { Cookies, withCookies } from 'react-cookie';
import { setCurrentUser } from './redux/user.reducer';

function App(props: { cookies: Cookies }) {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { cookies } = props;

  (async () => {
    if (cookies.get("token")) {
      const res = await getMyInfo(cookies.get("token") || "")
      console.log(res.data)
      if (res.data && res.data.data) dispatch(setCurrentUser(res.data.data))
    } else navigate("login")
  })()

  const setCookie = (name: string, value: any) => {
    cookies.set(name, value, { path: '/', maxAge: 360000 });
  }

  useEffect(() => {
    if (cookies.get("token")) {
      navigate('/dashboard');
    }
    else navigate('/login')
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<SignIn setCookie={setCookie}></SignIn>}></Route>
      <Route path="/" element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/calendar" element={<Calendar />}></Route>
      </Route>
    </Routes>
  );
}


export default withCookies(App);
