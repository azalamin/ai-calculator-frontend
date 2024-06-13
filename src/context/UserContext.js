// src/context/UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isNewUser, setIsNewUser] = useState(null); // Default to null to indicate "not determined"

    return (
        <UserContext.Provider value={{ user, setUser, isNewUser, setIsNewUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
