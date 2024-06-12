import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const NavigationBar = () => {
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
    );
};

export default NavigationBar;