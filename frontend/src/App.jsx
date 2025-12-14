import React from 'react'
import { Route,Routes } from 'react-router'
import Home from './pages/home'
import Doctors from './pages/Doctors'
import Contact from './pages/Contact'
import About from './pages/About'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './componenets/Navbar'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
       <Navbar/>
       <Routes>
          <Route path = '/' element = {<Home/>}/>
          <Route path = '/doctors' element = {<Doctors/>}/>
          <Route path = '/doctors/: speciality' element = {<Doctors/>}/>
          <Route path = '/contact' element = {<Contact/>}/>
          <Route path = '/about' element = {<About/>}/>
          <Route path = '/login' element = {<Login/>}/>
          <Route path = '/my-profile' element = {<MyProfile/>}/>
          <Route path = '/my-appointments' element = {<MyAppointments/>}/>
          <Route path = '/appointment' element = {<Appointment/>}/>

          
       </Routes>
    </div> 
  )
}

export default App

