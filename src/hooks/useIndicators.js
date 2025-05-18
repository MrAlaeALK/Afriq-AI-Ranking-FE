import { useContext, useEffect } from "react";
import { IndicatorContext } from "../context/IndicatorContext";
import { getAllIndicators } from "../services/api";

const useIndicators = () => {
    const { indicators, setIndicators, defaultIndicators, setDefaultIndicators, indicatorsError, setIndicatorsError } = useContext(IndicatorContext);

    useEffect(() => {
        getAllIndicators()
            .then(res => {
                if (res.status === 'success') {
                    setIndicators(res.message)
                    setDefaultIndicators(res.message)
                }
                else {
                    setIndicatorsError(res.message)
                }
            })
            .catch(error => console.log(error))
    }, [])

    return { indicators, setIndicators, defaultIndicators, indicatorsError }
}

export default useIndicators;