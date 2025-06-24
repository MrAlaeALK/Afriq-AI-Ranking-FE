import { getYearDimensions } from "../services/publicService";
import {createContext, useState, useEffect, useContext} from "react";
import { YearContext } from "./YearContext";

export const YearDimensionContext = createContext();

export const YearDimensionProvider = ({children}) => {
    const [yearDimensions, setYearDimensions] = useState([]);
    const [defaultYearDimensions, setDefaultYearDimensions] = useState([])
    const [yearDimensionsError, setYearDimensionsError] = useState(null)
    const {year} = useContext(YearContext)


    useEffect(() => {
    // const fetchYearDimensions = async () => await getYearDimensions(year)
    //     .then(res => {
    //         if(res.status==='success'){
    //             setDefaultYearDimensions(res.data)
    //             setYearDimensions(res.data)
    //         }
    //         else{
    //             setYearDimensionsError(res.message)
    //         }
    //     })
    //     .catch(error => console.log(error))

    const fetchYearDimensions = async () => {
        try{
            const res = await getYearDimensions(year)
            setDefaultYearDimensions(res)
            setYearDimensions(res)
        }
        catch(error){
            console.log(error.message)
        }}
        fetchYearDimensions()
    }, [year])
    

    return (
        <YearDimensionContext.Provider value={{yearDimensions, setYearDimensions, yearDimensionsError, setYearDimensionsError, defaultYearDimensions}}>
            {children}
        </YearDimensionContext.Provider>
    )
}