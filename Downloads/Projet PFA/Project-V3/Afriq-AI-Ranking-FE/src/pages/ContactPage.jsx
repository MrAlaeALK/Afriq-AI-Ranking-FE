import React from 'react';
import ContactForm from '../components/contact/ContactForm';
import ContactInfoSection from '../components/contact/ContactInfoSection';
import FAQSection from '../components/contact/FAQSection';

function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-20 pb-16">
        <section className="bg-purple-700 py-12 mb-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Contactez-nous</h1>
                <p className="text-lg text-purple-100">
                    Vous avez des questions ou des suggestions concernant notre plateforme de données africaines ? 
                    <br/>
                    N'hésitez pas à nous contacter en utilisant le formulaire ci-dessous.
                </p>
            </div>
        </section>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Formulaire de contact */}
              <div className="md:col-span-2">
                <h3 className="text-3xl font-semibold mb-8">Envoyez-nous un message</h3>
                <ContactForm />
              </div>
              
              {/* Informations de contact */}
              <div>
                <ContactInfoSection />
              </div>
            </div>
          </div>
          
          <FAQSection />
      </main>
    </div>
  );
}

export default ContactPage;