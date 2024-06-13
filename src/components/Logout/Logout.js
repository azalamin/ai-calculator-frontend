import { signOut } from 'firebase/auth';
import React from 'react';
import { auth } from '../firebaseConfig';

const Logout = () => {
    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('Logout successful');
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    return (
        <button onClick={handleLogout} className="btn btn-secondary">
            Logout
        </button>
    );
};

export default Logout;
