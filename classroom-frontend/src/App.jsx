import { useState } from 'react'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import ProtectedRoute from './context/ProtectedRoutes'
import FacultyDashboard from './pages/FacultyDashboard'
import StudentDashboard from './pages/StudentDashboard'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import TADashboard from './pages/TADashboard'
import Unauthorized from './pages/Unauthorized'
import FacultyCourse from './pages/FacultyCourse'
import TACourse from './pages/TACourse'
import StudentCourse from './pages/StudentCourse'
import CheckSolution from './pages/CheckSolution'


const App = () => (
  <Router>
    <Routes>
      {/* <Route path='/' element={<div>Whalecum to the home page</div>} /> */}
      <Route path='/' element={<Login/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<SignUp />} />

      <Route path='/faculty' element={
        <ProtectedRoute roles={['faculty']} >
           <FacultyDashboard />
        </ProtectedRoute>
      } />

      <Route path='/ta' element={
        <ProtectedRoute roles={['ta']}>
          <TADashboard />
        </ProtectedRoute>
      } />

      <Route path='/student' element={
        <ProtectedRoute roles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />

      <Route path='/faculty/courses/:courseId' element={<FacultyCourse />} />
      <Route path='/ta/courses/:courseId' element={<TACourse />} />
      <Route path='/student/courses/:courseId' element={<StudentCourse />} />

      <Route path='/ta/checkSubmission/:assignmentId/:submissionId' element={<CheckSolution />}/>

      <Route path="/unauthorized" element={<Unauthorized />} />



    </Routes>
  </Router>
)

export default App
