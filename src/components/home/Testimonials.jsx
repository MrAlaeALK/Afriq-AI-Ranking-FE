import TestimonialCard from "./TestimonialCard";
import { useTranslation } from 'react-i18next';

const Testimonials = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      avatar: "",
      name: "Dr. Amadou Diallo",
      title: "Chercheur, Université de Dakar",
      quote: "\"Afriq'AI offre une vision claire et précise des progrès réalisés en matière d'ouverture des données sur le continent.\"",
      bgColor: "bg-purple-100 dark:bg-purple-300/20"
    },
    {
      avatar: "",
      name: "Sarah Okonjo",
      title: "Analyste de données, Open Data Kenya",
      quote: "\"Un outil indispensable pour les décideurs politiques et les acteurs du développement en Afrique.\"",
      bgColor: "bg-green-100 dark:bg-green-300/20"
    },
    {
      avatar: "",
      name: "Jean-Pierre Nkurunziza",
      title: "Ministre du Numérique, Rwanda",
      quote: "\"Grâce à Afriq'AI, nous pouvons identifier les domaines prioritaires pour améliorer notre politique d'ouverture des données.\"",
      bgColor: "bg-blue-100 dark:bg-blue-300/20"
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white transition-colors duration-300">
          {t('testimonial')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              avatar={testimonial.avatar}
              name={testimonial.name}
              title={testimonial.title}
              quote={testimonial.quote}
              bgColor={testimonial.bgColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
