import { useTranslation } from "react-i18next";

function DisplayOptions({ colorScale, setColorScale }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('displayOp')}</h3>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="rounded text-purple-600 focus:ring-purple-500 dark:focus:ring-purple-400"
            defaultChecked
          />
          <span className="ml-2 text-gray-700 dark:text-gray-300">Afficher les noms des pays</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="rounded text-purple-600 focus:ring-purple-500 dark:focus:ring-purple-400"
            defaultChecked
          />
          <span className="ml-2 text-gray-700 dark:text-gray-300">Afficher les scores</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('colorScale')}</label>
        <select
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
            focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50
            dark:bg-gray-700 dark:text-gray-100 dark:focus:border-purple-400 dark:focus:ring-purple-400"
          value={colorScale}
          onChange={(e) => setColorScale(e.target.value)}
        >
          <option value="green-red">{t('gTor')}</option>
          <option value="blue-red">{t('bTor')}</option>
          <option value="purple-yellow">{t('pToy')}</option>
        </select>
      </div>
    </div>
  );
}

export default DisplayOptions;
