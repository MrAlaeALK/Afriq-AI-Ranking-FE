import { useState, useContext } from "react";
import CriterionCard from "./CriterionCard";
import { DimensionContext } from "../../context/DimensionContext";
import { useTranslation } from 'react-i18next';

const Criteria = () => {
  const { dimensions } = useContext(DimensionContext);
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const toggleText = () => {
    setExpanded(!expanded);
  };

  //  const criteriaData = [
  //   {
  //     icon: (
  //       <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  //       </svg>
  //     ),
  //     title: "Indice ODIN",
  //     description: "L'indice d'ouverture des données (ODIN) mesure le niveau d'accessibilité et d'utilité des données publiques officielles.",
  //     bgColor: "bg-purple-100",
  //     textColor: "text-purple-600"
  //   },
  //   {
  //     icon: (
  //       <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  //       </svg>
  //     ),
  //     title: "Indice de Développement Humain",
  //     description: "L'IDH évalue le niveau de développement d'un pays en tenant compte de l'espérance de vie, l'éducation et le niveau de vie.",
  //     bgColor: "bg-green-100",
  //     textColor: "text-green-600"
  //   },
  //   {
  //     icon: (
  //       <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  //       </svg>
  //     ),
  //     title: "Accès à Internet",
  //     description: "Taux de pénétration d'Internet, qualité des infrastructures numériques et coût d'accès aux services Internet.",
  //     bgColor: "bg-blue-100",
  //     textColor: "text-blue-600"
  //   }
  // ];


  return (
    <section className="py-16 bg-white dark:bg-gray-800 dark:text-white">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
          {t('criteria')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dimensions.filter((dimension, index) => index < 3).map((dimension) => (
            <CriterionCard
              key={dimension.id}
              icon={dimension.id}
              title={dimension.name}
              description={dimension.description}
              bgColor={dimension?.bgColor}
              textColor={dimension?.textColor}
            />
          ))}
        </div>

        {expanded && (
          <>
            <br />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {dimensions.filter((dimension, index) => index >= 3).map((dimension) => (
                <CriterionCard
                  key={`expanded-${dimension.id}`}
                  icon={dimension.id}
                  title={dimension.name}
                  description={dimension.description}
                  bgColor={dimension?.bgColor}
                  textColor={dimension?.textColor}
                />
              ))}
            </div>
          </>
        )}

        <div className="text-center mt-6">
          <button
            onClick={toggleText}
            className="px-6 py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 dark:hover:bg-purple-700 transition-colors shadow-md"
          >
            {expanded ? t('seeLess') : t('seeMore')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Criteria;
