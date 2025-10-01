import React from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Clock, MessageCircle, Users, Shield, Zap } from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
}

export default function ContactPage({ onBack }: ContactPageProps) {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      value: "support@doctorfollowers.com",
      description: "Réponse sous 2h en moyenne",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Phone,
      title: "Téléphone",
      value: "+33 6 19 47 05 19",
      description: "Disponible 24h/24, 7j/7",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: MapPin,
      title: "Adresse",
      value: "1 rue Teddy Riner",
      description: "92600 Asnières-sur-Seine, France",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const supportFeatures = [
    {
      icon: Clock,
      title: "Réponse Rapide",
      description: "Notre équipe s'engage à répondre à toutes vos demandes dans les plus brefs délais."
    },
    {
      icon: Shield,
      title: "Support Technique",
      description: "Assistance complète pour tous vos besoins techniques et questions sur nos services."
    },
    {
      icon: Users,
      title: "Conseil Personnalisé",
      description: "Nos experts vous accompagnent dans le choix des meilleures stratégies pour votre croissance."
    },
    {
      icon: Zap,
      title: "Résolution Immédiate",
      description: "Problèmes résolus rapidement grâce à notre expertise et notre réactivité."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center">
            <MessageCircle className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contactez-Nous</h1>
              <p className="text-gray-600">Notre équipe est là pour vous accompagner</p>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl text-white p-8 mb-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Besoin d'Aide ?</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Notre équipe de support dédiée est disponible 24h/24 pour répondre à toutes vos questions. 
              Que vous ayez besoin d'assistance technique, de conseils personnalisés ou d'informations sur nos services, 
              nous sommes là pour vous accompagner dans votre réussite sur les réseaux sociaux.
            </p>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className={`${method.bgColor} rounded-xl p-6 text-center border-2 border-transparent hover:border-gray-200 transition-all`}>
              <method.icon className={`w-8 h-8 ${method.color} mx-auto mb-4`} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
              <p className={`text-lg font-bold ${method.color} mb-2`}>{method.value}</p>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
          ))}
        </div>

        {/* Support Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Pourquoi Nous Contacter ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportFeatures.map((feature, index) => (
              <div key={index} className="flex items-start p-4 bg-gray-50 rounded-xl">
                <feature.icon className="w-6 h-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Informations Entreprise</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-gray-900">Siège Social</h4>
                  <p className="text-sm text-gray-600">1 rue Teddy Riner<br />92600 Asnières-sur-Seine, France</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-gray-900">Téléphone</h4>
                  <p className="text-sm text-gray-600">+33 6 19 47 05 19</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-sm text-gray-600">support@doctorfollowers.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-gray-900">Horaires</h4>
                  <p className="text-sm text-gray-600">Support 24h/24, 7j/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
          <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Nous Sommes à Votre Écoute</h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Votre satisfaction est notre priorité. N'hésitez pas à nous contacter pour toute question, 
            demande d'assistance ou suggestion d'amélioration. Notre équipe expérimentée vous accompagne 
            dans votre projet de croissance sur les réseaux sociaux.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">✓ Réponse sous 2h</span>
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">✓ Support 24/7</span>
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">✓ Conseils experts</span>
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">✓ Satisfaction garantie</span>
          </div>
        </div>
      </div>
    </div>
  );
}
