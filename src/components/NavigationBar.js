// src/components/NavigationBar.js
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { auth } from '../firebaseConfig';

const NavigationBar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            const email = user.email;
            await signOut(auth);

            // Save logout time to database
            await axios.post('http://localhost:3002/user_logout', {
                email,
                logoutTime: new Date().toISOString()
            });

            console.log('Logout successful');
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
            <div className="container">
                <Link className="navbar-brand" to={'/sign-in'}>
                    AI-Calculator
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarTogglerDemo02"
                    aria-controls="navbarTogglerDemo02"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse flex justify-content-between" id="navbarTogglerDemo02">
                    <ul className="navbar-nav ml-auto">
                        {user ? (
                            <>
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
                            </>
                        ) : (
                            <>
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
                                    <Link className="nav-link" to={'/social'}>
                                        Social Page
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                    {
                        user ? <div className="">
                            <button className="dropdown-item" onClick={handleLogout}>
                                Logout
                            </button>
                        </div> : ''
                    }
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;





