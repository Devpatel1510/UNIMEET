import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import Signup from './pages/signup'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast';
import { useauthstore } from './store/auth.store';
import Nav from './components/Nav';
import Login from './pages/Login';
import EnterM from './components/EnterM';

import Otp1 from './pages/otp1';
import MeetingR from './pages/MeetingR';
import HomePage from './pages/chat';
import Account from './pages/Account';




function App() {
  const Location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup","/otp"];
  const shouldHideNavbar =  hideNavbarRoutes.includes(location.pathname) ||
  location.pathname.startsWith("/meet/");


  const { authUser, checkAuth } = useauthstore();
  useEffect(() => { checkAuth() }, [checkAuth]);
  return (
    <div>
      <Toaster />
      {!shouldHideNavbar && <Nav />}
      <Routes>
         <Route path='/' element={authUser ? <Home  /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path='/otp' element={<Otp1 />} />
        <Route path='/meet/:roomid' element={<MeetingR />} />
        <Route path="/enter" element={!authUser ?<EnterM />: <Navigate to="/login" />} />
        <Route path="/chat" element={<HomePage />} />
        <Route path="/account" element={<Account />} />
        

      </Routes>
    </div>
  )
}

export default App
