// src/components/PublicRoute.js
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const PublicRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PublicRoute;
