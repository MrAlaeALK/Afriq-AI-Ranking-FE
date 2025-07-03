import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

function RegionalTrends({ countriesRanking, yearDimensions, scores }) {
  const { t } = useTranslation();

  // 🌍 Mapping des pays vers leurs régions
  const countryToRegion = {
    // Afrique du Nord
    'MOR': 'Afrique du Nord', 'ALG': 'Afrique du Nord', 'TUN': 'Afrique du Nord', 
    'LBY': 'Afrique du Nord', 'EGY': 'Afrique du Nord', 'SUD': 'Afrique du Nord',

    // Afrique de l'Ouest  
    'NGA': 'Afrique de l\'Ouest', 'GHA': 'Afrique de l\'Ouest', 'CIV': 'Afrique de l\'Ouest',
    'SEN': 'Afrique de l\'Ouest', 'MLI': 'Afrique de l\'Ouest', 'BFA': 'Afrique de l\'Ouest',
    'NER': 'Afrique de l\'Ouest', 'GIN': 'Afrique de l\'Ouest', 'SLE': 'Afrique de l\'Ouest',
    'LBR': 'Afrique de l\'Ouest', 'GNB': 'Afrique de l\'Ouest', 'GMB': 'Afrique de l\'Ouest',
    'CPV': 'Afrique de l\'Ouest', 'MRT': 'Afrique de l\'Ouest', 'TGO': 'Afrique de l\'Ouest',
    'BEN': 'Afrique de l\'Ouest',

    // Afrique de l'Est
    'ETH': 'Afrique de l\'Est', 'KEN': 'Afrique de l\'Est', 'UGA': 'Afrique de l\'Est',
    'TZA': 'Afrique de l\'Est', 'RWA': 'Afrique de l\'Est', 'BDI': 'Afrique de l\'Est',
    'SOM': 'Afrique de l\'Est', 'DJI': 'Afrique de l\'Est', 'ERI': 'Afrique de l\'Est',
    'MWI': 'Afrique de l\'Est', 'SSD': 'Afrique de l\'Est',

    // Afrique Centrale
    'CMR': 'Afrique Centrale', 'CAF': 'Afrique Centrale', 'TCD': 'Afrique Centrale',
    'COG': 'Afrique Centrale', 'COD': 'Afrique Centrale', 'GAB': 'Afrique Centrale',
    'GNQ': 'Afrique Centrale', 'STP': 'Afrique Centrale',

    // Afrique Australe
    'ZAF': 'Afrique Australe', 'ZWE': 'Afrique Australe', 'ZMB': 'Afrique Australe',
    'BWA': 'Afrique Australe', 'NAM': 'Afrique Australe', 'AGO': 'Afrique Australe',
    'LSO': 'Afrique Australe', 'SWZ': 'Afrique Australe', 'MOZ': 'Afrique Australe',

    // Îles Africaines  
    'MDG': 'Îles Africaines', 'MUS': 'Îles Africaines', 'SYC': 'Îles Africaines', 'COM': 'Îles Africaines'
  };

  // 📊 Calcul dynamique des statistiques
  const dynamicStats = useMemo(() => {
    if (!countriesRanking || countriesRanking.length === 0) {
      return {
        mainText: "Aucune donnée disponible pour analyser les tendances régionales.",
        bestRegion: "Aucune région",
        bestRegionScore: "0",
        topProgressCountry: "Aucun pays",
        topProgressValue: "0",
        improvementRegion: "Aucune région",
        improvementScore: "0"
      };
    }

    // Regrouper par région et calculer les moyennes
    const regions = {};
    
    countriesRanking.forEach(country => {
      const regionName = countryToRegion[country.countryCode] || 'Région Inconnue';
      
      if (!regions[regionName]) {
        regions[regionName] = {
          name: regionName,
          countries: [],
          totalScore: 0,
          count: 0
        };
      }
      
      regions[regionName].countries.push(country);
      regions[regionName].totalScore += parseFloat(country.finalScore || 0);
      regions[regionName].count += 1;
    });

    // Calculer les moyennes
    Object.values(regions).forEach(region => {
      region.averageScore = region.count > 0 ? (region.totalScore / region.count).toFixed(1) : 0;
    });

    // Trouver la meilleure région
    const bestRegion = Object.values(regions).reduce((best, current) => 
      (!best || current.averageScore > best.averageScore) ? current : best, null
    );

    // Trouver le pays avec le meilleur score (représente le progrès)
    const topCountry = countriesRanking.reduce((best, current) => 
      (!best || parseFloat(current.finalScore) > parseFloat(best.finalScore)) ? current : best, null
    );

    // Région avec le plus de potentiel d'amélioration (score le plus bas)
    const improvementRegion = Object.values(regions).reduce((lowest, current) => 
      (!lowest || current.averageScore < lowest.averageScore) ? current : lowest, null
    );

    // Générer le texte principal
    const regionNames = Object.values(regions).map(r => r.name).join(', ');
    const leaderCountries = countriesRanking.slice(0, 2).map(c => c.countryName).join(' et le ');
    
    const mainText = countriesRanking.length === 1 
      ? `Le ${countriesRanking[0].countryName} est actuellement le seul pays avec des données disponibles dans notre analyse. `
      : `L'analyse couvre ${countriesRanking.length} pays répartis dans les régions suivantes : ${regionNames}. ${leaderCountries} montrent les meilleures performances.`;

    return {
      mainText,
      bestRegion: bestRegion?.name || "Aucune région",
      bestRegionScore: bestRegion?.averageScore || "0",
      topProgressCountry: topCountry?.countryName || "Aucun pays",
      topProgressValue: topCountry?.finalScore || "0",
      improvementRegion: improvementRegion?.name || "Aucune région", 
      improvementScore: improvementRegion?.averageScore || "0"
    };
  }, [countriesRanking]);

  // 🎨 Couleurs pour les régions
  const regionColors = {
    'Afrique du Nord': { bg: 'bg-blue-50 dark:bg-blue-900', text: 'text-blue-700 dark:text-blue-200' },
    'Afrique de l\'Ouest': { bg: 'bg-green-50 dark:bg-green-900', text: 'text-green-700 dark:text-green-200' },
    'Afrique de l\'Est': { bg: 'bg-purple-50 dark:bg-purple-900', text: 'text-purple-700 dark:text-purple-200' },
    'Afrique Centrale': { bg: 'bg-orange-50 dark:bg-orange-900', text: 'text-orange-700 dark:text-orange-200' },
    'Afrique Australe': { bg: 'bg-indigo-50 dark:bg-indigo-900', text: 'text-indigo-700 dark:text-indigo-200' },
    'Îles Africaines': { bg: 'bg-teal-50 dark:bg-teal-900', text: 'text-teal-700 dark:text-teal-200' }
  };

  if (!countriesRanking || countriesRanking.length === 0) {
    return (
      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Aperçu des tendances régionales
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          🌍 Aucune donnée disponible pour analyser les tendances régionales.
          <br />
          Ajoutez des scores pour les pays dans l'interface admin.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
        Aperçu des tendances régionales
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {dynamicStats.mainText}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard
          title="Meilleure région"
          content={`${dynamicStats.bestRegion} avec un score moyen de ${dynamicStats.bestRegionScore} sur 100`}
          bgColor="bg-purple-50 dark:bg-purple-900"
          textColor="text-purple-700 dark:text-purple-200"
        />
        <InfoCard
          title="Plus grand progrès"
          content={`${dynamicStats.topProgressCountry} avec un score de ${dynamicStats.topProgressValue} points`}
          bgColor="bg-green-50 dark:bg-green-900"
          textColor="text-green-700 dark:text-green-200"
        />
        <InfoCard
          title="Potentiel d'amélioration"
          content={`${dynamicStats.improvementRegion} avec un score moyen de ${dynamicStats.improvementScore} sur 100`}
          bgColor="bg-blue-50 dark:bg-blue-900"
          textColor="text-blue-700 dark:text-blue-200"
        />
      </div>
    </div>
  );
}

function InfoCard({ title, content, bgColor, textColor }) {
  return (
    <div className={`p-4 ${bgColor} rounded-lg`}>
      <h4 className={`font-medium ${textColor} mb-2`}>{title}</h4>
      <p className="text-gray-700 dark:text-gray-300">{content}</p>
    </div>
  );
}

export default RegionalTrends;
