import { createContext, useEffect, useState, useContext } from "react";
import { getScoresByYear } from "../services/publicService";
import { YearContext } from "./YearContext";

export const ScoresContext = createContext();

export const ScoresProvider = ({ children }) => {
    const [scores, setScores] = useState([]);
    const [scoresError, setScoresError] = useState(null);

    const { year} = useContext(YearContext)


    useEffect(() => {
        // const fetchScoresByYear = async () => await getScoresByYear(year)
        //     .then(res => {
        //         if (res.status === "success") {
        //             setScores(res.data)
        //         }
        //         else {
        //             setScoresError(res.message)
        //         }
        //     }
        //     )
        //     .catch(error => setScoresError("server or network error"))
        const fetchScoresByYear = async () => {
            try{
                const res = await getScoresByYear(year)
                setScores(res)
            }
            catch(error){
                console.log(error.message)
            }}

            fetchScoresByYear()
    }, [year])

    return (
        <ScoresContext.Provider value={{ scores, setScores, scoresError, setScoresError }}>
            {children}
        </ScoresContext.Provider>
    )
}