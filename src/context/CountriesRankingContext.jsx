import { createContext, useEffect, useState, useContext } from "react";
import { getRankingByYear } from "../services/api";
import { YearContext } from "./YearContext";

export const CountriesRankingContext = createContext();

export const CountriesRankingProvider = ({ children }) => {
    const [countriesRanking, setCountriesRanking] = useState([]);
    const [countriesRankingError, setCountriesRankingError] = useState(null)
    // const [defaultcountriesRanking, setDefaultcountriesRanking] = useState([]);
    const { year, setYear } = useContext(YearContext)


    useEffect(() => {
        const fetchCountriesRanking = async () => await getRankingByYear(year)
            .then(res => {
                if (res.status === 'success') {
                    setCountriesRanking(res.data)
                }
                else {
                    setCountriesRankingError(res.message)
                }
            }
            )
            .catch(error => console.log(error))

            fetchCountriesRanking()
    }, [year])

    return (
        <CountriesRankingContext.Provider value={{ countriesRanking, setCountriesRanking, countriesRankingError, setCountriesRankingError }}>
            {children}
        </CountriesRankingContext.Provider>
    )
}