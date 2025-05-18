import { useContext, useEffect } from "react";
import { ScoresContext } from "../context/ScoresContext";
import { getScoresByYear } from "../services/api";

const useScores = (year) => {
    const { scores, setScores, scoresError, setScoresError } = useContext(ScoresContext);

    useEffect(() => {
        getScoresByYear(year)
            .then(res => {
                if (res.status === "success") {
                    setScores(res.message)
                }
                else {
                    setScoresError(res.message)
                }
            }
            )
            .catch(error => setScoresError("server or network error"))
    }, [year])

    return { scores, setScores, scoresError }
}

export default useScores;