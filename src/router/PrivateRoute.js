// src/components/PrivateRoute.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, useLocation } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { useUser } from '../context/UserContext';
import { auth } from '../firebaseConfig';

const PrivateRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);
    const { isNewUser, setIsNewUser } = useUser();
    const [checkingAnswers, setCheckingAnswers] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const checkAnswers = async () => {
            if (user) {
                try {
                    const response = await axios.post('http://localhost:3002/check_user', { email: user.email });
                    if (response.data.message === 'User has answered the questions') {
                        setIsNewUser(false);
                    } else {
                        setIsNewUser(true);
                    }
                } catch (error) {
                    console.error('Error checking user answers:', error);
                }
            }
            setCheckingAnswers(false);
        };

        if (user) {
            checkAnswers();
        } else {
            setCheckingAnswers(false);
        }
    }, [user, setIsNewUser]);

    if (loading || checkingAnswers) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <ClipLoader size={50} color={"#123abc"} loading={true} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (isNewUser && location.pathname.startsWith('/calculator')) {
        return <Navigate to="/questions" />;
    }

    return children;
};

export default PrivateRoute;
