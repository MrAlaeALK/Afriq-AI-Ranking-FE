// FAQ.js - Composant individuel adapté en style carte
import React, { useState } from 'react';

function FAQ({ question, answer, bgColor = "bg-gray-100" }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`rounded-xl shadow-md overflow-hidden ${bgColor}`}>
      <div 
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="font-medium text-gray-800">{question}</h4>
        <svg 
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className={`px-4 pb-4 text-gray-600 transition-all ${isOpen ? "block" : "hidden"}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default FAQ;