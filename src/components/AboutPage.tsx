import React from 'react';
import { ArrowLeft, Users, Target, Award, Shield, Clock, Globe, Heart, TrendingUp, CheckCircle, Star, Building2, Mail, Phone, MapPin } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
  const stats = [
    { icon: Users, value: "50,000+", label: "Clients satisfaits" },
    { icon: Target, value: "2M+", label: "Followers livrés" },
    { icon: Award, value: "99.8%", label: "Taux de satisfaction" },
    { icon: Clock, value: "24-72h", label: "Livraison moyenne" }
  ];

  const values = [
    {
      icon: Shield,
      title: "Sécurité Garantie",
      description: "Nous utilisons des méthodes 100% sûres et conformes aux politiques des plateformes sociales."
    },
    {
      icon: Heart,
      title: "Service Client Premium",
      description: "Notre équipe dédiée est disponible 24/7 pour vous accompagner dans votre croissance."
    },
    {
      icon: TrendingUp,
      title: "Résultats Mesurables",
      description: "Des statistiques détaillées et un suivi en temps réel de vos performances."
    },
    {
      icon: Globe,
      title: "Couverture Mondiale",
      description: "Nous servons des clients dans plus de 50 pays avec des followers de toutes nationalités."
    }
  ];

  const team = [
    {
      name: "Équipe Technique",
      role: "Développement & Infrastructure",
      description: "Nos experts en technologie développent constamment de nouvelles méthodes pour garantir la qualité et la sécurité de nos services."
    },
    {
      name: "Support Client",
      role: "Service & Satisfaction",
      description: "Une équipe dédiée disponible 24/7 pour répondre à toutes vos questions et vous accompagner dans votre projet."
    },
    {
      name: "Équipe Qualité",
      role: "Contrôle & Assurance",
      description: "Nous vérifions chaque livraison pour garantir que nos clients reçoivent exactement ce qu'ils ont commandé."
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
            <Building2 className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">À Propos de Doctor Followers</h1>
              <p className="text-gray-600">Votre partenaire de confiance pour la croissance sociale</p>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl text-white p-8 mb-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Qui Sommes-Nous ?</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Doctor Followers est une entreprise française spécialisée dans l'accompagnement des créateurs de contenu, 
              entreprises et influenceurs dans leur croissance sur les réseaux sociaux. Depuis notre création, nous nous 
              engageons à fournir des services de qualité supérieure avec une approche éthique et professionnelle.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
              <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Notre Mission</h3>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Accompagner chaque client dans sa croissance digitale en proposant des solutions innovantes, 
              sûres et efficaces pour développer sa présence sur les réseaux sociaux. Nous croyons que 
              chaque créateur mérite d'être vu et entendu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Notre Vision</h4>
              <p className="text-gray-600 mb-4">
                Devenir la référence européenne en matière de services de croissance sociale, 
                en combinant innovation technologique et approche humaine.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Innovation constante
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Transparence totale
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Satisfaction client
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Nos Valeurs</h4>
              <div className="space-y-4">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start">
                    <value.icon className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">{value.title}</h5>
                      <p className="text-sm text-gray-600">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Notre Équipe</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h4>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-gray-600">{member.description}</p>
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
                <Building2 className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-gray-900">ElseWay</h4>
                  <p className="text-sm text-gray-600">SIREN: 904 173 820</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-gray-900">Adresse</h4>
                  <p className="text-sm text-gray-600">1 rue Teddy Riner<br />92600 Asnières-sur-Seine, France</p>
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
                <Phone className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-gray-900">Téléphone</h4>
                  <p className="text-sm text-gray-600">+33 6 19 47 05 19</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
          <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Pourquoi Nous Choisir ?</h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Avec plus de 50,000 clients satisfaits et une expertise reconnue dans le domaine des réseaux sociaux, 
            Doctor Followers s'engage à vous offrir le meilleur service possible.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">✓ Garantie 30 jours</span>
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">✓ Support 24/7</span>
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">✓ Méthodes sûres</span>
            <span className="bg-white px-4 py-2 rounded-full shadow-sm">✓ Résultats garantis</span>
          </div>
        </div>
      </div>
    </div>
  );
}
