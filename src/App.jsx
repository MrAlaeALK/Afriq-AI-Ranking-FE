// App.jsx
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import { CountriesRankingProvider } from './context/CountriesRankingContext';
import { DimensionProvider} from './context/DimensionContext';
import { ScoresProvider } from './context/ScoresContext';
import { YearProvider } from './context/YearContext';
import ComparisonPage from './pages/ComparisonPage';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import RankingPage from './pages/RankingPage';
import ContactPage from './pages/ContactPage';
import { YearDimensionProvider } from './context/YearDimensionContext';

function App() {

  return (
    <YearProvider>
      <ScoresProvider>
        <CountriesRankingProvider>
          <DimensionProvider>
            <YearDimensionProvider>
              <Router>
                <div className="font-sans">
                  <Header />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/carte" element={<MapPage />} />
                    <Route path="/classement" element={<RankingPage />} />
                    <Route path="/comparer" element={<ComparisonPage />} />
                    <Route path="/contact" element={<ContactPage/>} />
                  </Routes>
                  <Footer />
                </div>
              </Router>
            </YearDimensionProvider>
          </DimensionProvider>
        </CountriesRankingProvider>
      </ScoresProvider>
    </YearProvider>
  );
}

export default App;