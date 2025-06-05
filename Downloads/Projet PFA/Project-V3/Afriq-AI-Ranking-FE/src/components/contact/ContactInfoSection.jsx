import React from 'react';
import ContactInfo from './ContactInfo';
import SocialButton from './SocialButton';
import { LocationIcon, EmailIcon, PhoneIcon, LinkedInIcon } from './Icons';

function ContactInfoSection() {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Coordonnées</h3>
      <div className="space-y-4">
        <ContactInfo 
          icon={<LocationIcon />}
          title="Adresse"
          content="123 Avenue de l'Innovation, Oujda, Maroc"
        />
        
        <ContactInfo 
          icon={<EmailIcon />}
          title="Email"
          content="info@afriq-ai.org"
        />
        
        <ContactInfo 
          icon={<PhoneIcon />}
          title="Téléphone"
          content="+123 456 789"
        />
      </div>
      
      <div className="mt-8">
        <h4 className="font-medium text-gray-700 mb-3">Suivez-nous</h4>
        <div className="flex space-x-4">
          <SocialButton icon={<LinkedInIcon />} />
        </div>
      </div>
    </div>
  );
}

export default ContactInfoSection;