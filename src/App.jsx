// App.jsx
import React from 'react';
import {useState, useEffect} from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/pages/HomePage';
import ComparisonPage from './components/pages/ComparisonPage';
import MapPage from './components/pages/MapPage';
import RankingPage from './components/pages/RankingPage';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [error, setError] = useState(null)
  const [indicators, setIndicators] = useState([])
  const [defaultWeights, setDefaultWeights] = useState([])
  const [countries, setCountries] = useState([]);
  const [scores, setScores] = useState([])
  const [defaultFinalScores,setDefaultFinalScores] = useState([])

    useEffect(() => {
    axios.get('http://localhost:8080/api/indicator/allindicators')
    .then(response => {
      const res = response.data;
      if(res.status === 'success'){
        setIndicators(res.message)
        setDefaultWeights(res.message)
        console.log("first useEffect hit")
      }
      else {
        setError(res.message)
      }
    })
    .catch(err => {
        setError('Server error or network issue');
        console.error(err);
    })
  }, []) 
  
  useEffect(() => {
    axios.post('http://localhost:8080/api/country/ranking', {"year" : 2020})
    .then(response => {
      const res = response.data;
      if(res.status === 'success'){
        setCountries(res.message)
        setDefaultFinalScores(res.message)
        // console.log(countries)
        console.log("second useEffect hit")
      }
      else {
        setError(res.message)
      }
    })
    .catch(err => {
        setError('Server error or network issue');
        console.error(err);
    })
  }, [])

  useEffect(() => {
    axios.post('http://localhost:8080/api/scores/getScoresByYear', {"year" : 2020})
    .then(response => {
      const res = response.data;
      if(res.status === 'success'){
        setScores(res.message)
        console.log("third useEffect hit")
      }
      else {
        setError(res.message)
      }
    })
    .catch(err => {
      setError('Server error or network issue');
      console.error(err)
    })
  }, [])
  return (
    <Router>
      <div className="font-sans">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage indicators={indicators}/>} />
          <Route path="/carte" element={<MapPage indicators={indicators} setIndicators={setIndicators} defaultWeights={defaultWeights} setDefaultWeights={setDefaultWeights} countries={countries} setCountries={setCountries} scores={scores} setScores={setScores} defaultFinalScores={defaultFinalScores}/>} />
          <Route path="/classement" element={<RankingPage indicators={indicators} setIndicators={setIndicators} defaultWeights={defaultWeights} setDefaultWeights={setDefaultWeights} countries={countries} setCountries={setCountries} scores={scores} setScores={setScores} defaultFinalScores={defaultFinalScores}/>} />
          <Route path="/comparer" element={<ComparisonPage scores={scores} defaultWeights={defaultWeights} countries={countries} defaultFinalScores={defaultFinalScores} setCountries={setCountries}/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;