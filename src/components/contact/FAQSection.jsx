import React from 'react';
import FAQ from './FAQ';
import { useTranslation } from 'react-i18next';

function FAQSection() {
  // Couleurs claires + foncées (dark mode)
  const bgColors = [
    "bg-purple-100 dark:bg-purple-200", 
    "bg-green-100 dark:bg-green-200", 
    "bg-blue-100 dark:bg-blue-200"
  ];

  const { t } = useTranslation();
  
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-white">{t('questions')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FAQ
            question={t('question1')}
            answer={t('reponse1')}
            bgColor={bgColors[0]}
          />
          <FAQ
            question={t('question2')}
            answer={t('reponse2')}
            bgColor={bgColors[1]}
          />
          <FAQ
            question={t('question3')}
            answer={t('reponse3')}
            bgColor={bgColors[2]}
          />
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
