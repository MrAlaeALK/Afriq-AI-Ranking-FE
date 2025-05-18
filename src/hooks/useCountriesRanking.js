import { useContext, useEffect } from "react";
import { countriesRankingContext } from "../context/countriesRankingContext";
import { getRankingByYear } from "../services/api";

const usecountriesRanking = (year) => {
    const { countriesRanking, setCountriesRanking, countriesRankingError, setCountriesRankingError } = useContext(countriesRankingContext);

    useEffect(() => {
        getRankingByYear(year)
            .then(res => {
                if (res.status === 'success') {
                    setCountriesRanking(res.message)
                }
                else {
                    setCountriesRankingError(res.message)
                }
            }
            )
            .catch(error => console.log(error))
    }, [])

    return { countriesRanking, setCountriesRanking, countriesRankingError }
}

export default usecountriesRanking;