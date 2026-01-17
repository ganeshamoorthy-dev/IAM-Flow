import './App.css';
import LandingPage from './pages/app-landing/AppLanding';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <LandingPage />
    </>
  );
}

export default App;
