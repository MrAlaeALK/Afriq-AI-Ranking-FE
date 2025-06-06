import React from 'react';

function SocialButton({ icon }) {
  return (
    <a href="https://www.linkedin.com/company/afriq-ai-institute/posts/?feedView=all" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-600 transition-colors">
      {icon}
    </a>
  );
}

export default SocialButton;