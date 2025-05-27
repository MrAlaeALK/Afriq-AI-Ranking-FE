import {createContext, useState, useEffect, useContext} from "react";
import { getAllDimensions} from "../services/api";
import { YearContext } from "./YearContext";
import { ScoresContext } from "./ScoresContext";

export const DimensionContext = createContext();

export const DimensionProvider = ({children}) => {
    const [dimensions, setDimensions] = useState([]);
    const [dimensionsError, setDimensionsError] = useState(null)


    useEffect(() => {
    const fetchAllDimensions = async () => await getAllDimensions()
        .then(res => {
            if(res.status==='success'){
                setDimensions(res.data)
            }
            else{
                setDimensionsError(res.message)
            }
        })
        .catch(error => console.log(error))

        fetchAllDimensions()
    }, [])
    

    return (
        <DimensionContext.Provider value={{dimensions, setDimensions, dimensionsError, setDimensionsError}}>
            {children}
        </DimensionContext.Provider>
    )
}