import React from 'react';

function ContactInfo({ icon, title, content }) {
  return (
    <div className="flex">
      <div className="flex-shrink-0 mr-3 text-purple-600">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-gray-700">{title}</h4>
        <p className="text-gray-600">{content}</p>
      </div>
    </div>
  );
}

export default ContactInfo;