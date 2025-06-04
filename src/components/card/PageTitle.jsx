import { useTranslation } from "react-i18next";

function PageTitle() {
  const { t } = useTranslation();

  return (
    <main className="flex-grow pt-20 pb-16">
      <section className="bg-purple-700 dark:bg-purple-900 py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white dark:text-purple-300 mb-4">
            {t('titleCard')}
          </h1>
          <p className="text-lg text-purple-100 dark:text-purple-400">
            {t('titleDesc')}
          </p>
        </div>
      </section>
    </main>
  );
}

export default PageTitle;
