import React from 'react';

function ContactInfo({ icon, title, content }) {
  return (
    <div className="flex">
      <div className="flex-shrink-0 mr-3 text-purple-600 dark:text-purple-400">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-gray-700 dark:text-gray-200">
          {title}
        </h4>
        <p className="text-gray-600 dark:text-gray-400">
          {content}
        </p>
      </div>
    </div>
  );
}

export default ContactInfo;
