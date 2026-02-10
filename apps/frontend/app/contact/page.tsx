"use client";

import React, { useState } from 'react';
import { SectionTitle } from '@/components';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implémenter l'envoi du formulaire de contact
      // Pour l'instant, on simule juste un envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Votre message a été envoyé avec succès !');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-bg-primary min-h-screen">
      <SectionTitle title="Contactez-nous" path="Home | Contact" />
      
      <div className="container-custom section py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Informations de contact */}
            <div>
              <h2 className="text-3xl font-serif font-semibold text-brand-text-primary mb-6">
                Informations de contact
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-brand-text-primary mb-2">Adresse</h3>
                  <p className="text-brand-text-secondary">
                    Nouakchott, Mauritanie
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-brand-text-primary mb-2">Email</h3>
                  <p className="text-brand-text-secondary">
                    contact@talleltextile.com
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-brand-text-primary mb-2">Téléphone</h3>
                  <p className="text-brand-text-secondary">
                    +222 XX XX XX XX
                  </p>
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div>
              <h2 className="text-3xl font-serif font-semibold text-brand-text-primary mb-6">
                Envoyez-nous un message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-brand-text-primary mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brand-text-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-brand-text-primary mb-2">
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-brand-text-primary mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-brand-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-secondary text-white py-3 px-6 rounded-lg font-semibold hover:bg-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
