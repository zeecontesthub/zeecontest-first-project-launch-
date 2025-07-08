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
import Contest from './Pages/contest'
import Contestdetails from './Pages/Contestdetails'
import Editcontest from './Pages/editcontest'
import Leaderboards from './Pages/Leaderboards'
import ContestantDetails from './Pages/contestantdetails'
import Contestant from './Pages/contestant'

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
        <Route path="/contest" element={<Contest />} />
        <Route path="/contest-details" element={<Contestdetails />} />
        <Route path="/edit-contest" element={<Editcontest />} />
        <Route path="/leaderboards" element={<Leaderboards />} />
        <Route path="/contestantdetails/:position/:contestantId" element={<ContestantDetails />} />
        <Route path="/contestant" element={<Contestant />} />
      </Routes>
    </Router>
  )
}

export default App
