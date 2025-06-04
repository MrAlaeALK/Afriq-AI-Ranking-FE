function RegionalTrends() {
  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
        Aperçu des tendances régionales
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        L'Afrique de l'Est montre les meilleurs scores en matière d'ouverture des données (ODIN), avec le Rwanda et le Kenya en tête. L'Afrique du Sud et le Botswana dominent en Afrique australe, tandis que le Ghana et le Sénégal sont les leaders en Afrique de l'Ouest. Le Maroc et la Tunisie montrent les meilleures performances en Afrique du Nord.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard
          title="Meilleure région"
          content="Afrique de l'Est avec un score moyen de 76.8 sur 100"
          bgColor="bg-purple-50 dark:bg-purple-900"
          textColor="text-purple-700 dark:text-purple-200"
        />
        <InfoCard
          title="Plus grand progrès"
          content="Ghana avec une amélioration de 12.3 points depuis 2022"
          bgColor="bg-green-50 dark:bg-green-900"
          textColor="text-green-700 dark:text-green-200"
        />
        <InfoCard
          title="Potentiel d'amélioration"
          content="Afrique centrale avec un score moyen de 48.2 sur 100"
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
