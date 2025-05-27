import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Adapter les données au format attendu par votre API
      const emailData = {
        name: formData.name,         // Pour la variable "senderName" dans Thymeleaf
        from: formData.email, // Email de l'expéditeur
        to: 'your_email',
        subject: formData.subject,
        text: formData.message
      };
      
      const response = await fetch('http://localhost:8080/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });
      
      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        const errorData = await response.text();
        setError(`Une erreur est survenue lors de l'envoi du message. ${errorData}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
            Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-2">Nom</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border-b border-gray-300 focus:border-purple-500 focus:outline-none transition-colors bg-transparent"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border-b border-gray-300 focus:border-purple-500 focus:outline-none transition-colors bg-transparent"
            required
          />
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-600 mb-2">Sujet</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border-b border-gray-300 focus:border-purple-500 focus:outline-none transition-colors bg-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-600 mb-2">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-3 border-b border-gray-300 focus:border-purple-500 focus:outline-none transition-colors bg-transparent resize-none"
            required
          ></textarea>
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors focus:outline-none rounded-full"
            disabled={loading}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;