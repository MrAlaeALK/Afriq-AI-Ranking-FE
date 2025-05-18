import { createContext, useState, useEffect } from 'react';

export const YearContext = createContext();
export const YearProvider = ({ children }) => {
    const [year, setYear] = useState(2020)


    return (
        <YearContext.Provider value={{ year, setYear }}>
            {children}
        </YearContext.Provider>
    )
}