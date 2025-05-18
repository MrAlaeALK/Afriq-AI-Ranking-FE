// App.jsx
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import { CountriesRankingProvider } from './context/CountriesRankingContext';
import { IndicatorProvider } from './context/IndicatorContext';
import { ScoresProvider } from './context/ScoresContext';
import { YearProvider } from './context/YearContext';
import ComparisonPage from './pages/ComparisonPage';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import RankingPage from './pages/RankingPage';

function App() {

  return (
    <YearProvider>
      <ScoresProvider>
        <CountriesRankingProvider>
          <IndicatorProvider>
            <Router>
              <div className="font-sans">
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/carte" element={<MapPage />} />
                  <Route path="/classement" element={<RankingPage />} />
                  <Route path="/comparer" element={<ComparisonPage />} />
                </Routes>
                <Footer />
              </div>
            </Router>
          </IndicatorProvider>
        </CountriesRankingProvider>
      </ScoresProvider>
    </YearProvider>
  );
}

export default App;