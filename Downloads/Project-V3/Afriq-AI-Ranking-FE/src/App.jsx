// App.jsx
// App.jsx
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import { CountriesRankingProvider } from './context/CountriesRankingContext';
import { DimensionProvider} from './context/DimensionContext';
import { ScoresProvider } from './context/ScoresContext';
import { YearProvider } from './context/YearContext';
import { YearDimensionProvider } from './context/YearDimensionContext';
import AuthProvider from './context/AuthProvider';  
import LoginPage from './pages/LoginPage';         
import RegisterPage from './pages/RegisterPage';   
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import ComparisonPage from './pages/ComparisonPage';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import RankingPage from './pages/RankingPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <AuthProvider>
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
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                    </Routes>
                    <Footer />
                  </div>
                </Router>
              </YearDimensionProvider>
            </DimensionProvider>
          </CountriesRankingProvider>
        </ScoresProvider>
      </YearProvider>
    </AuthProvider>
  );
}

export default App;