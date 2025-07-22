// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Pages/login";
import CreateAccount from "./Pages/CreateAccount";
import OrganizerAccount from "./Pages/OrganizerAccount";
import ForgotPassword from "./Pages/ForgotPassword";
import InputCode from "./Pages/InputCode";
import PasswordReset from "./Pages/PasswordReset";
import Dashboard from "./Pages/Dashboard";
import Createspotlightcontest from "./Pages/createspotlightcontest";
import RoleSelectionPage from "./Pages/RoleSelectionPage";
import SettingsPage from "./Pages/SettingsPage";
import Contest from "./Pages/contest";
import Contestdetails from "./Pages/Contestdetails";
import Editcontest from "./Pages/editcontest";
import Leaderboards from "./Pages/Leaderboards";
import ContestantDetails from "./Pages/contestantdetails";
import Contestant from "./Pages/contestant";
import VotersDetails from "./Pages/VotersDetails";
import Mywallet from "./Pages/Mywallet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/organizer-account" element={<OrganizerAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/input-code" element={<InputCode />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route
          path="/create-spotlight-contest"
          element={<Createspotlightcontest />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/contest" element={<Contest />} />
        <Route
          path="/contest-details/:contestId"
          element={<Contestdetails />}
        />
        <Route path="/edit-contest/:contestId" element={<Editcontest />} />
        <Route path="/leaderboards/:contestId" element={<Leaderboards />} />
        <Route
          path="/contestantdetails/:position/:contestantId/:contestId"
          element={<ContestantDetails />}
        />
        <Route path="/contestant/:contestId" element={<Contestant />} />
        <Route path="/voters-details/:contestId" element={<VotersDetails />} />
        <Route path="/mywallet" element={<Mywallet />} />
      </Routes>
    </Router>
  );
}

export default App;
