import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Calculator from './components/Calculator';
import Contact from './components/Contact';
import Faq from './components/Faq';
import FinalFeedback from "./components/FinalFeedback";
import Payment from './components/Payment';
import Login from './components/login.component';
import SignUp from './components/signup.component';
import Social from './components/social';
function App() {
  const [loginData, setLoginData] = useState([]);

  useEffect(() => {
    fetchLoginData();
  }, []);

  const fetchLoginData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/get_user_login');
      setLoginData(response.data);
    } catch (error) {
      console.error('Error fetching login data:', error);
    }
  };
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={'/sign-in'}>
              AI-Calculator
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-in'}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-up'}>
                    Sign up
                  </Link>
                </li>
                {/* Add Payment Link */}
                <li className="nav-item">
                  <Link className="nav-link" to={'/payment'}>
                    Payment
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/contact'}>
                    Contact
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/faq'}>
                    FAQ
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/calculator'}>
                    AI Calculator
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/social'}>
                    Social Page
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/social" element={<Social />} />
          <Route path="/feedback" element={<FinalFeedback />} />
        </Routes>



        {/* <div className="container">
          <h2>Login Data</h2>
          <ul>
            {loginData.map((item, index) => (
              <li key={index}>{JSON.stringify(item)}</li>
            ))}
          </ul>
        </div> */}

      </div>
    </Router>
  );
}

export default App;
