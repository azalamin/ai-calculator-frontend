import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { auth } from '../firebaseConfig';

const PrivateRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);
    const { isNewUser } = useUser();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
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
