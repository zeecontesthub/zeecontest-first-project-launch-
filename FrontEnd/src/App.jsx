import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import './App.css';
import Login from './Pages/login';
import CreateAccount from './Pages/CreateAccount';
import OrganizerAccount from './Pages/OrganizerAccount';
import ForgotPassword from './Pages/ForgotPassword';
import InputCode from './Pages/InputCode';
import PasswordReset from './Pages/PasswordReset';
import Dashboard from './Pages/Dashboard';
import Createspotlightcontest from './Pages/createspotlightcontest';
import RoleSelectionPage from './Pages/RoleSelectionPage';
import SettingsPage from './Pages/SettingsPage';
import Contest from './Pages/contest';
import Contestdetails from './Pages/Contestdetails';
import Editcontest from './Pages/editcontest';
import Leaderboards from './Pages/Leaderboards';
import ContestantDetails from './Pages/contestantdetails';
import Contestant from './Pages/contestant';
import VotersDetails from './Pages/VotersDetails';
import Mywallet from './Pages/Mywallet';

import LandingHomePage from './Pages/LandingPages/Home.jsx';
import ContestHomePage from './Pages/LandingPages/Contest.jsx';
import ContestDetailHomePage from './Pages/LandingPages/vContestDetails.jsx';
import VotingFlow from './Pages/LandingPages/VotingFlow';
import Footer from './common/Footer.jsx';
import VoterRegistration from './Pages/LandingPages/VoterRegistration';
import VContestantDetails from './Pages/LandingPages/vcontestantdetails';
import ContactForm from './Pages/LandingPages/Contact.jsx';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";
import { useUser } from "./context/UserContext.jsx";
import Signup from './Pages/SignUp.jsx';
import ThankYouPage from './Pages/LandingPages/ThankYouPage.jsx';

// Simple error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, color: 'red' }}>
          <h2>Something went wrong.</h2>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Protected Route
function ProtectedRoute({ children }) {
  const { user } = useUser();
  if (!user) {
    return <Navigate to='/login' replace />;
  }
  return children;
}

// Layout wrapper for Footer
function Layout({ children }) {
  const location = useLocation();
  const footerPaths = ['/', '/contests', '/contest-details', '/vote'];
  return (
    <>
      {children}
      {footerPaths.includes(location.pathname) && <Footer />}
    </>
  );
}

function App() {
  useEffect(() => {
    window.onerror = function (message, source, lineno, colno, error) {
      console.error(
        'Global error handler:',
        message,
        source,
        lineno,
        colno,
        error
      );
    };
    window.onunhandledrejection = function (event) {
      console.error('Unhandled promise rejection:', event.reason);
    };
  }, []);

  return (
    <Router>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />
      <ErrorBoundary>
        <Layout>
          <Routes>
            {/* Public Routes with Footer */}
            <Route path='/' element={<LandingHomePage />} />
            <Route path='/contests' element={<ContestHomePage />} />
            <Route
              path='/contest-detail/:contestId'
              element={<ContestDetailHomePage />}
            />
            <Route path='/vote/:contestId' element={<VotingFlow />} />
            <Route
              path='/vote/:contestId/thank-you'
              element={<ThankYouPage />}
            />
            <Route path='/contact' element={<ContactForm />} />

            {/* Public Voter Registration Route */}
            <Route
              path='/voterregistration/:contestId'
              element={<VoterRegistration />}
            />
            <Route
              path='/vcontestantdetails/:position/:contestantId/:contestId'
              element={<VContestantDetails />}
            />

            {/* Auth Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/input-code" element={<InputCode />} />
            <Route path="/password-reset" element={<PasswordReset />} />

            {/* Protected Routes */}
            <Route
              path='/settings'
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/organizer-account'
              element={
                <ProtectedRoute>
                  <OrganizerAccount />
                </ProtectedRoute>
              }
            />
            <Route
              path='/create-spotlight-contest'
              element={
                <ProtectedRoute>
                  <Createspotlightcontest />
                </ProtectedRoute>
              }
            />
            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/role-selection'
              element={
                <ProtectedRoute>
                  <RoleSelectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/contest'
              element={
                <ProtectedRoute>
                  <Contest />
                </ProtectedRoute>
              }
            />
            <Route
              path='/contest-details/:contestId'
              element={
                <ProtectedRoute>
                  <Contestdetails />
                </ProtectedRoute>
              }
            />
            <Route
              path='/edit-contest/:contestId'
              element={
                <ProtectedRoute>
                  <Editcontest />
                </ProtectedRoute>
              }
            />
            <Route
              path='/leaderboards/:contestId'
              element={
                <ProtectedRoute>
                  <Leaderboards />
                </ProtectedRoute>
              }
            />
            <Route
              path='/contestantdetails/:position/:contestantId/:contestId'
              element={
                <ProtectedRoute>
                  <ContestantDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path='/contestant/:contestId'
              element={
                <ProtectedRoute>
                  <Contestant />
                </ProtectedRoute>
              }
            />
            <Route
              path='/voters-details/:contestId'
              element={
                <ProtectedRoute>
                  <VotersDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path='/mywallet'
              element={
                <ProtectedRoute>
                  <Mywallet />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
