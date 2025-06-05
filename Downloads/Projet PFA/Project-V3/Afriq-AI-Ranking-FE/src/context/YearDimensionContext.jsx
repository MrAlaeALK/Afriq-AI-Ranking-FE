import { getYearDimensions } from "../services/publicApi";
import {createContext, useState, useEffect, useContext} from "react";
import { YearContext } from "./YearContext";

export const YearDimensionContext = createContext();

export const YearDimensionProvider = ({children}) => {
    const [yearDimensions, setYearDimensions] = useState([]);
    const [defaultYearDimensions, setDefaultYearDimensions] = useState([])
    const [yearDimensionsError, setYearDimensionsError] = useState(null)
    const {year} = useContext(YearContext)


    useEffect(() => {
        const fetchYearDimensions = async () => {
            try {
                const res = await getYearDimensions(year);
                // apiClient already unwraps the response, so res is the actual data
                setDefaultYearDimensions(res || []);
                setYearDimensions(res || []);
            } catch (error) {
                console.log(error);
                setYearDimensionsError(error.message);
            }
        }

        fetchYearDimensions();
    }, [year])
    

    return (
        <YearDimensionContext.Provider value={{yearDimensions, setYearDimensions, yearDimensionsError, setYearDimensionsError, defaultYearDimensions}}>
            {children}
        </YearDimensionContext.Provider>
    )
}