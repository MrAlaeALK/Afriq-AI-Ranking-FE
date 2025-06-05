import { createContext, useEffect, useState, useContext } from "react";
import { getScoresByYear } from "../services/publicApi";
import { YearContext } from "./YearContext";

export const ScoresContext = createContext();

export const ScoresProvider = ({ children }) => {
    const [scores, setScores] = useState([]);
    const [scoresError, setScoresError] = useState(null);

    const { year} = useContext(YearContext)


    useEffect(() => {
        const fetchScoresByYear = async () => {
            try {
                const res = await getScoresByYear(year);
                // apiClient already unwraps the response, so res is the actual data
                setScores(res || []);
            } catch (error) {
                console.log(error);
                setScoresError(error.message);
            }
        }

        fetchScoresByYear(); // Add the missing function call
    }, [year])

    return (
        <ScoresContext.Provider value={{ scores, setScores, scoresError, setScoresError }}>
            {children}
        </ScoresContext.Provider>
    )
}