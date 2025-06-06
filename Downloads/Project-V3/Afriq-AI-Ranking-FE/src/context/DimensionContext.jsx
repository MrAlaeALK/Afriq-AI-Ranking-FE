import {createContext, useState, useEffect, useContext} from "react";
import { getAllDimensions } from "../services/publicApi";
import { YearContext } from "./YearContext";
import { ScoresContext } from "./ScoresContext";

export const DimensionContext = createContext();

export const DimensionProvider = ({children}) => {
    const [dimensions, setDimensions] = useState([]);
    const [dimensionsError, setDimensionsError] = useState(null)


    useEffect(() => {
        const fetchAllDimensions = async () => {
            try {
                const res = await getAllDimensions();
                // apiClient already unwraps the response, so res is the actual data
                setDimensions(res || []);
            } catch (error) {
                console.log(error);
                setDimensionsError(error.message);
            }
        }

        fetchAllDimensions();
    }, [])
    

    return (
        <DimensionContext.Provider value={{dimensions, setDimensions, dimensionsError, setDimensionsError}}>
            {children}
        </DimensionContext.Provider>
    )
}