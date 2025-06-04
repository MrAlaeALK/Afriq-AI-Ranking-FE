import React from 'react';
import ContactForm from '../components/contact/ContactForm';
import ContactInfoSection from '../components/contact/ContactInfoSection';
import FAQSection from '../components/contact/FAQSection';
import { useTranslation } from 'react-i18next';

function ContactPage() {
  const {t} = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <main className="flex-grow pt-20 pb-16">
        {/* Bandeau violet */}
        <section className="bg-purple-700 dark:bg-purple-900 py-12 mb-8 transition-colors">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white dark:text-purple-300 mb-4">{t('contactUs')}</h1>
            <p className="text-lg text-purple-100 dark:text-purple-400">
              {t('askUs')} 
              <br />
              {t('fillForm')}
            </p>
          </div>
        </section>

        {/* Zone formulaire + info */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Formulaire de contact */}
            <div className="md:col-span-2">
              <h3 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">{t('sendMessage')}</h3>
              <ContactForm />
            </div>

            {/* Informations de contact */}
            <div>
              <ContactInfoSection />
            </div>
          </div>
        </div>

        {/* Foire aux questions */}
        <FAQSection />
      </main>
    </div>
  );
}

export default ContactPage;
