import { useState, useEffect } from "react";
import { getAllScores } from "../services/adminService";

const useScoreManagement = () => {
  const [scores, setScores] = useState([]);
  const [years, setYears] = useState([]);
  const [countries, setCountries] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedIndicator, setSelectedIndicator] = useState("all");

  useEffect(() => {
    async function fetchScores() {
      try {
        const scoresData = await getAllScores();
        setScores(scoresData);
        setIndicators([...new Set(scoresData.map((s) => s.indicatorName))]);
        setCountries([...new Set(scoresData.map((s) => s.countryName))]);
        setYears([...new Set(scoresData.map((s) => s.year))]);
      } catch (error) {
        console.error(error);
      }
    }
    fetchScores();
  }, []);

  return {
    scores,
    setScores,
    years,
    setYears,
    countries,
    setCountries,
    indicators,
    setIndicators,
    selectedYear,
    setSelectedYear,
    selectedCountry,
    setSelectedCountry,
    selectedIndicator,
    setSelectedIndicator,
  };
};

export default useScoreManagement;
