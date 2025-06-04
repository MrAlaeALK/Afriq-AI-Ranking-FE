import React from 'react';
import ContactInfo from './ContactInfo';
import SocialButton from './SocialButton';
import { LocationIcon, EmailIcon, PhoneIcon, LinkedInIcon } from './Icons';
import { useTranslation } from 'react-i18next';

function ContactInfoSection() {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {t('coordonne')}
      </h3>
      <div className="space-y-4">
        <ContactInfo 
          icon={<LocationIcon />}
          title={t('address')}
          content={t('theAdd')}
        />
        
        <ContactInfo 
          icon={<EmailIcon />}
          title="Email"
          content="info@afriq-ai.org"
        />
        
        <ContactInfo 
          icon={<PhoneIcon />}
          title={t('tele')}
          content="+123 456 789"
        />
      </div>
      
      <div className="mt-8">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
          {t('follow')}
        </h4>
        <div className="flex space-x-4">
          <SocialButton icon={<LinkedInIcon />} />
        </div>
      </div>
    </div>
  );
}

export default ContactInfoSection;
