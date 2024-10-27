// src/context/AttractionsContext.js
import React, { createContext, useContext, useState } from 'react';

const AttractionsContext = createContext();

export const AttractionsProvider = ({ children }) => {
    const [attractions, setAttractions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const value = {
        attractions,
        setAttractions,
        isLoading,
        setIsLoading,
    };

    return <AttractionsContext.Provider value={value}>{children}</AttractionsContext.Provider>;
};

export const useAttractions = () => useContext(AttractionsContext);
