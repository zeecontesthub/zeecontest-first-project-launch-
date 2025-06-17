// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './Pages/login'
import CreateAccount from './Pages/CreateAccount'
import OrganizerAccount from './Pages/OrganizerAccount'
import ForgotPassword from './Pages/ForgotPassword'
import InputCode from './Pages/InputCode'
import PasswordReset from './Pages/PasswordReset'
import Dashboard from './Pages/Dashboard'
import Createspotlightcontest from './Pages/createspotlightcontest'
import RoleSelectionPage from './Pages/RoleSelectionPage'
import SettingsPage from './Pages/SettingsPage'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/organizer-account" element={<OrganizerAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/input-code" element={<InputCode />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/create-spotlight-contest" element={<Createspotlightcontest/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  )
}

export default App
