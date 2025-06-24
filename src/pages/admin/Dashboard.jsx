import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Globe, TrendingUp, Calendar, Award, Target, Activity, AlertTriangle, Loader2, Info, ArrowUp, ArrowDown, Minus } from 'lucide-react';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    countries: [],
    dimensions: [],
    indicators: [],
    topCountries: [],
    scores: [],
    yearsInfo: {},
    totalCountries: 0,
    totalDimensions: 0,
    totalIndicators: 0,
    isLoading: true,
    error: null
  });

  const currentYear = new Date().getFullYear();

  // Base URL for your Spring Boot backend
  const API_BASE_URL = 'http://localhost:8080/api'; // Adjust this to your backend URL

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, isLoading: true, error: null }));

      // Utiliser le nouveau endpoint pour obtenir toutes les données avec contexte
      const [contextResponse, countriesResponse, dimensionsResponse, indicatorsResponse, scoresResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard/context`),
        fetch(`${API_BASE_URL}/countries`),
        fetch(`${API_BASE_URL}/dimensions`),
        fetch(`${API_BASE_URL}/indicators`),
        fetch(`${API_BASE_URL}/scores`)
      ]);

      // Check if all requests were successful
      if (!contextResponse.ok || !countriesResponse.ok || !dimensionsResponse.ok || !indicatorsResponse.ok || !scoresResponse.ok) {
        throw new Error('Failed to fetch data from one or more endpoints');
      }

      const [contextData, countries, dimensions, indicators, scores] = await Promise.all([
        contextResponse.json(),
        countriesResponse.json(),
        dimensionsResponse.json(),
        indicatorsResponse.json(),
        scoresResponse.json()
      ]);

      // Process top countries data - now includes year context
      const topCountries = contextData.topCountries?.map((countryRank) => ({
        id: countryRank.countryId,
        name: countryRank.countryName,
        region: countryRank.countryRegion,
        code: countryRank.countryCode,
        score: countryRank.finalScore,
        rank: countryRank.rank,
        rankChange: countryRank.rankChange || "=",
        scoreChange: countryRank.scoreChange || "=",
        displayYear: countryRank.displayYear,
        isCurrentYear: countryRank.isCurrentYear
      })) || [];

      setDashboardData({
        countries,
        dimensions,
        indicators,
        topCountries,
        scores,
        yearsInfo: contextData.yearsInfo || {},
        totalCountries: countries.length,
        totalDimensions: dimensions.length,
        totalIndicators: indicators.length,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
    }
  };

  // Calculate completion percentage based on available data
  const calculateDataCompleteness = () => {
    const { countries, indicators, scores } = dashboardData;
  
    if (!countries || !indicators || !scores) return 0;
    if (countries.length === 0 || indicators.length === 0 || scores.length === 0) return 0;
  
    // Extraire les années uniques
    const uniqueYears = [...new Set(scores.map(score => score.year))];
  
    const expectedDataPoints = countries.length * indicators.length * uniqueYears.length;
    const actualDataPoints = scores.length;
  
    return Math.floor((actualDataPoints / expectedDataPoints) * 100);
  };

  // Calculate average score across all countries
  const calculateAverageScore = () => {
    if (!dashboardData.topCountries || dashboardData.topCountries.length === 0) return 0;
    const totalScore = dashboardData.topCountries.reduce((sum, country) => sum + country.score, 0);
    return (totalScore / dashboardData.topCountries.length).toFixed(1);
  };

  // Calculate score range
  const calculateScoreRange = () => {
    if (!dashboardData.topCountries || dashboardData.topCountries.length === 0) return 0;
    const scores = dashboardData.topCountries.map(c => c.score);
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    return (max - min).toFixed(1);
  };

  // Get unique regions for regional diversity
  const getUniqueRegions = () => {
    if (!dashboardData.countries) return [];
    const regions = [...new Set(dashboardData.countries.map(c => c.region))];
    return regions.filter(region => region); // Filter out null/undefined regions
  };

  // Function to get badge variant based on rank change
  const getRankChangeBadgeVariant = (change) => {
    if (!change || change === "=") return "secondary";
    if (change === "NEW") return "default";
    if (change.startsWith("+")) return "default"; // Improvement (moved up)
    return "destructive"; // Decline (moved down)
  };

  // Function to get badge variant based on score change
  const getScoreChangeBadgeVariant = (change) => {
    if (!change || change === "=") return "secondary";
    if (change === "NEW") return "default";
    if (change.startsWith("+")) return "default"; // Score improvement
    return "destructive"; // Score decline
  };

  // Function to format rank change display
  const formatRankChangeDisplay = (change) => {
    if (!change || change === "=") return "=";
    if (change === "NEW") return "NOUVEAU";
    return change;
  };

  // Function to format score change display
  const formatScoreChangeDisplay = (change) => {
    if (!change || change === "=") return "=";
    if (change === "NEW") return "NOUVEAU";
    return change;
  };

  // Fonction pour obtenir l'année d'affichage
  const getDisplayYear = () => {
    return dashboardData.yearsInfo.mostRecentYearWithData || currentYear;
  };

  // Fonction pour vérifier si on utilise des données anciennes
  const isUsingOldData = () => {
    return !dashboardData.yearsInfo.isUsingCurrentYearData && dashboardData.yearsInfo.yearsDifference > 0;
  };

  // Fonction pour obtenir l'icône de changement
  const getChangeIcon = (change) => {
    if (!change || change === "=" || change === "NEW") return <Minus className="h-3 w-3" />;
    if (change.startsWith("+")) return <ArrowUp className="h-3 w-3" />;
    return <ArrowDown className="h-3 w-3" />;
  };

  // Fonction pour obtenir les années disponibles formatées
  const getAvailableYearsText = () => {
    const years = dashboardData.yearsInfo.availableYears || [];
    if (years.length === 0) return "Aucune donnée";
    if (years.length === 1) return `${years[0]}`;
    return `${years[0]} - ${years[years.length - 1]} (${years.length} années)`;
  };

  if (dashboardData.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Erreur de chargement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {dashboardData.error}
            </p>
            <button 
              onClick={fetchDashboardData}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Aperçu du tableau de bord</h2>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">
              Données de classement pour {getDisplayYear()} • 
              Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
            </p>
            {isUsingOldData() && (
              <Badge variant="outline" className="text-amber-600 border-amber-600">
                <Info className="h-3 w-3 mr-1" />
                Données {getDisplayYear()}
              </Badge>
            )}
          </div>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Activity className="h-4 w-4" />
          Actualiser
        </button>
      </div>

      {/* Message d'information si les données ne sont pas de l'année courante */}
      {isUsingOldData() && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-amber-800">
              <Info className="h-4 w-4" />
              <p className="text-sm">
                <strong>Information:</strong> Les données pour {currentYear} ne sont pas encore disponibles. 
                Affichage des données de {getDisplayYear()} avec comparaison vs {getDisplayYear() - 1}.
                {dashboardData.yearsInfo.availableYears && dashboardData.yearsInfo.availableYears.length > 0 && (
                  <span className="ml-2">
                    Années disponibles: {getAvailableYearsText()}
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des indicateurs</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalIndicators}</div>
            <p className="text-xs text-muted-foreground">
              Indicateurs de mesure active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dimensions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalDimensions}</div>
            <p className="text-xs text-muted-foreground">
              Catégories d'évaluation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pays classés</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalCountries}</div>
            <p className="text-xs text-muted-foreground">
              Pays africains • {getUniqueRegions().length} régions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Année des données</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getDisplayYear()}
            </div>
            <p className="text-xs text-muted-foreground">
              {isUsingOldData() ? `${dashboardData.yearsInfo.yearsDifference} an(s) en retard` : 'Données actuelles'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top pays et métriques de performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top 5 des pays ({getDisplayYear()})
            </CardTitle>
            <CardDescription>
              Pays africains les mieux classés • Changements vs {getDisplayYear() - 1}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topCountries && dashboardData.topCountries.length > 0 ? (
                dashboardData.topCountries.map((country, index) => (
                  <div key={country.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center font-bold">
                        {country.rank || index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{country.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {country.region} • Code: {country.code}
                        </p>
                        <p className="text-sm font-medium text-blue-600">
                          Score: {country.score ? country.score.toFixed(2) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Badge de changement de rang */}
                      <div className="flex flex-col items-center gap-1">
                        <Badge 
                          variant={getRankChangeBadgeVariant(country.rankChange)}
                          className="text-xs flex items-center gap-1"
                        >
                          {getChangeIcon(country.rankChange)}
                          {formatRankChangeDisplay(country.rankChange)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Rang</span>
                      </div>
                      {/* Badge de changement de score */}
                      <div className="flex flex-col items-center gap-1">
                        <Badge 
                          variant={getScoreChangeBadgeVariant(country.scoreChange)}
                          className="text-xs flex items-center gap-1"
                        >
                          {getChangeIcon(country.scoreChange)}
                          {formatScoreChangeDisplay(country.scoreChange)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Score</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune donnée de classement disponible</p>
                  <p className="text-sm">Vérifiez la disponibilité des données pour {getDisplayYear()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Métriques de performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Métriques de performance
            </CardTitle>
            <CardDescription>
              Statistiques pour {getDisplayYear()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Score moyen</span>
                <span className="font-semibold">{calculateAverageScore()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Écart de scores</span>
                <span className="font-semibold">{calculateScoreRange()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Complétude des données</span>
                <span className="font-semibold">{calculateDataCompleteness()}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Régions couvertes</span>
                <span className="font-semibold">{getUniqueRegions().length}</span>
              </div>
            </div>
            
            {/* Informations sur les années disponibles */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Données disponibles</h4>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Année courante: {currentYear}
                </p>
                <p className="text-xs text-muted-foreground">
                  Année affichée: {getDisplayYear()}
                </p>
                {dashboardData.yearsInfo.availableYears && dashboardData.yearsInfo.availableYears.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Années: {getAvailableYearsText()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations détaillées sur les régions */}
      {getUniqueRegions().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Couverture régionale
            </CardTitle>
            <CardDescription>
              Répartition des pays par région
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {getUniqueRegions().map((region, index) => {
                const countriesInRegion = dashboardData.countries.filter(c => c.region === region).length;
                return (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {region} ({countriesInRegion})
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Dashboard;