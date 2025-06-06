// FAQSection.js - Section adaptée pour afficher les cartes en grille
import React from 'react';
import FAQ from './FAQ';

function FAQSection() {
  // Couleurs de fond pour les différentes cartes FAQ
  const bgColors = ["bg-purple-100", "bg-green-100", "bg-blue-100"];
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-semibold mb-8">Foire aux questions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FAQ
            question="Comment puis-je accéder aux données brutes ?"
            answer="Vous pouvez télécharger les données brutes en format CSV ou PDF depuis la page de chaque pays. Un accès à notre API est également disponible pour les chercheurs et développeurs."
            bgColor={bgColors[0]}
          />
          <FAQ
            question="À quelle fréquence les données sont-elles mises à jour ?"
            answer="Les données sont mises à jour lorsqu'une de nos sources publie une nouvelle étude. La date de la dernière mise à jour est indiquée dans la liste déroulante lors de la sélection de l'année des données."
            bgColor={bgColors[1]}
          />
          <FAQ
            question="Comment puis-je suggérer une correction de données ?"
            answer="Vous pouvez nous envoyer vos suggestions via le formulaire de contact en précisant le pays et l'indicateur concernés, ainsi que la source de vos données."
            bgColor={bgColors[2]}
          />
        </div>
      </div>
    </section>
  );
}

export default FAQSection;