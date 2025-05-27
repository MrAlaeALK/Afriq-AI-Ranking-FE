import { useContext, useEffect } from "react";
import { DimensionContext } from "../context/DimensionContext";
import { getAllIndicators } from "../services/api";

const useIndicators = () => {
    const { indicators, setIndicators, dimensions, setDimensions, dimensionsError, setDimensionsError } = useContext(DimensionContext);

    useEffect(() => {
        getAllIndicators()
            .then(res => {
                if (res.status === 'success') {
                    setIndicators(res.message)
                    setDimensions(res.message)
                }
                else {
                    setDimensionsError(res.message)
                }
            })
            .catch(error => console.log(error))
    }, [])

    return { indicators, setIndicators, dimensions, dimensionsError }
}

export default useIndicators;