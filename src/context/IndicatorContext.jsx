import {createContext, useState, useEffect, useContext} from "react";
import { getAllIndicators } from "../services/api";
import { YearContext } from "./YearContext";
import { ScoresContext } from "./ScoresContext";

export const IndicatorContext = createContext();

export const IndicatorProvider = ({children}) => {
    const [indicators, setIndicators] = useState([]);
    const [defaultIndicators, setDefaultIndicators] = useState([]);
    const [indicatorsError, setIndicatorsError] = useState(null)
    const {year} = useContext(YearContext)
    const {scores} = useContext(ScoresContext)


    useEffect(() => {
    const fetchAllIndicators = async () => await getAllIndicators()
        .then(res => {
            if(res.status==='success'){
                setDefaultIndicators(res.message)
                const IndicatorsOfYearX = defaultIndicators.filter(indicator => scores.some(score => score.indicatorName === indicator.name));
                setIndicators(IndicatorsOfYearX)
            }
            else{
                setIndicatorsError(res.message)
            }
        })
        .catch(error => console.log(error))

        fetchAllIndicators()
    }, [year, scores])
    

    return (
        <IndicatorContext.Provider value={{indicators, setIndicators, defaultIndicators, setDefaultIndicators, indicatorsError, setIndicatorsError}}>
            {children}
        </IndicatorContext.Provider>
    )
}