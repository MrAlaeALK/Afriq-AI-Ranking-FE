import { createContext, useEffect, useState, useContext } from "react";
import { getRankingByYear } from "../services/publicApi";
import { YearContext } from "./YearContext";

export const CountriesRankingContext = createContext();

export const CountriesRankingProvider = ({ children }) => {
    const [countriesRanking, setCountriesRanking] = useState([]);
    const [countriesRankingError, setCountriesRankingError] = useState(null)
    // const [defaultcountriesRanking, setDefaultcountriesRanking] = useState([]);
    const { year, setYear } = useContext(YearContext)


    useEffect(() => {
        const fetchCountriesRanking = async () => {
            try {
                const res = await getRankingByYear(year);
                // apiClient already unwraps the response
                setCountriesRanking(res || []);
            } catch (error) {
                console.log(error);
                setCountriesRankingError(error.message);
            }
        }
        
        fetchCountriesRanking();
    }, [year])

    return (
        <CountriesRankingContext.Provider value={{ countriesRanking, setCountriesRanking, countriesRankingError, setCountriesRankingError }}>
            {children}
        </CountriesRankingContext.Provider>
    )
}