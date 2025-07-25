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
import VisitorLayout from './layouts/VisitorLayout';
import DocumentsPage from './pages/admin/DocumentsPage';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import IndicatorsPage from './pages/admin/IndicatorsPage';
import DimensionsPage from './pages/admin/DimensionsPage';
import ScoresPage from './pages/admin/ScoresPage';
import RankingsPage from './pages/admin/RankingsPage';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/auth/LoginPage';
import { AuthProvider } from './context/AuthContext';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

function App() {

  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route 
          path="/"
          element={
            <YearProvider>
              <ScoresProvider>
                <CountriesRankingProvider>
                  <DimensionProvider>
                    <YearDimensionProvider>
                      <VisitorLayout />
                    </YearDimensionProvider>
                  </DimensionProvider>
                </CountriesRankingProvider>
              </ScoresProvider>
            </YearProvider>
          }
        >
          {/* <Route index element={<PrivateRoute><HomePage /></PrivateRoute>} /> */}
          <Route index element={<HomePage />} />
          <Route path="/carte" element={<MapPage />} />
          <Route path="/classement" element={<RankingPage />} />
          <Route path="/comparer" element={<ComparisonPage />} />
          <Route path="/contact" element={<ContactPage/>} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/admin" element={<PrivateRoute><AdminLayout/></PrivateRoute>}>
        {/* <Route path="/admin" element={<AdminLayout/>}> */}
          <Route index element={<Dashboard/>}/>
          <Route path="indicators" element={<IndicatorsPage/>}/>
          <Route path="dimensions" element={<DimensionsPage/>}/>
          <Route path="scores" element={<ScoresPage/>}/>
          <Route path="rankings" element={<RankingsPage/>}/>
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;