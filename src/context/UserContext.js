import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isNewUser, setIsNewUser] = useState(true); // Default to true for demonstration

    return (
        <UserContext.Provider value={{ user, setUser, isNewUser, setIsNewUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);