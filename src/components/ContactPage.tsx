import React, { useEffect } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Clock, MessageCircle, Users, Shield, Zap } from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
}

export default function ContactPage({ onBack }: ContactPageProps) {
  // Mise à jour des métadonnées SEO pour la page contact
  useEffect(() => {
    // Mise à jour du titre de la page
    document.title = 'Contact & Support Client 24/7 | Doctor Followers';
    
    // Mise à jour de la meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contactez Doctor Followers pour toute question ou assistance. Support client 24/7, réponse rapide, conseils personnalisés pour booster vos réseaux sociaux.');
    } else {
      const metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = 'Contactez Doctor Followers pour toute question ou assistance. Support client 24/7, réponse rapide, conseils personnalisés pour booster vos réseaux sociaux.';
      document.head.appendChild(metaDesc);
    }

    // Mise à jour de l'URL canonique
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://doctorfollowers.com/contact');
    } else {
      const linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      linkCanonical.href = 'https://doctorfollowers.com/contact';
      document.head.appendChild(linkCanonical);
    }

    // Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Contact & Support Client 24/7 | Doctor Followers');
    } else {
      const metaOgTitle = document.createElement('meta');
      metaOgTitle.setAttribute('property', 'og:title');
      metaOgTitle.setAttribute('content', 'Contact & Support Client 24/7 | Doctor Followers');
      document.head.appendChild(metaOgTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Contactez Doctor Followers pour toute question ou assistance. Support client 24/7, réponse rapide, conseils personnalisés pour booster vos réseaux sociaux.');
    } else {
      const metaOgDesc = document.createElement('meta');
      metaOgDesc.setAttribute('property', 'og:description');
      metaOgDesc.setAttribute('content', 'Contactez Doctor Followers pour toute question ou assistance. Support client 24/7, réponse rapide, conseils personnalisés pour booster vos réseaux sociaux.');
      document.head.appendChild(metaOgDesc);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', 'https://doctorfollowers.com/contact');
    } else {
      const metaOgUrl = document.createElement('meta');
      metaOgUrl.setAttribute('property', 'og:url');
      metaOgUrl.setAttribute('content', 'https://doctorfollowers.com/contact');
      document.head.appendChild(metaOgUrl);
    }

    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) {
      ogType.setAttribute('content', 'website');
    } else {
      const metaOgType = document.createElement('meta');
      metaOgType.setAttribute('property', 'og:type');
      metaOgType.setAttribute('content', 'website');
      document.head.appendChild(metaOgType);
    }
  }, []);
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      value: "support@doctorfollowers.com",
      description: "Réponse sous 2h en moyenne",
      color: "text-soft-pink-600",
      bgColor: "bg-soft-pink-50"
    },
    {
      icon: Phone,
      title: "Téléphone",
      value: "+33 6 19 47 05 19",
      description: "Disponible 24h/24, 7j/7",
      color: "text-peach-600",
      bgColor: "bg-peach-50"
    },
    {
      icon: MapPin,
      title: "Adresse",
      value: "1 rue Teddy Riner",
      description: "92600 Asnières-sur-Seine, France",
      color: "text-lavender-600",
      bgColor: "bg-lavender-50"
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
    <div className="min-h-screen bg-cream font-rounded">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-soft-pink-50 rounded-card-sm transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" strokeWidth={1.5} />
          </button>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 rounded-pill flex items-center justify-center mr-3 shadow-soft-lg">
              <MessageCircle className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-800">Contactez-Nous</h1>
              <p className="text-slate-600">Notre équipe est là pour vous accompagner</p>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-soft-pink-50 via-peach-50 to-lavender-50 rounded-card text-slate-800 p-10 mb-10 border border-soft-pink-200/50 shadow-soft-xl">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-slate-800">Besoin d'Aide ?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Notre équipe de support dédiée est disponible 24h/24 pour répondre à toutes vos questions. 
              Que vous ayez besoin d'assistance technique, de conseils personnalisés ou d'informations sur nos services, 
              nous sommes là pour vous accompagner dans votre réussite sur les réseaux sociaux.
            </p>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className={`${method.bgColor} rounded-card-sm p-8 text-center border border-soft-pink-200/50 hover:border-soft-pink-300/50 transition-all shadow-soft-lg hover:shadow-soft-xl`}>
              <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-pill flex items-center justify-center mx-auto mb-4 shadow-soft">
                <method.icon className={`w-8 h-8 ${method.color}`} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{method.title}</h3>
              <p className={`text-lg font-bold ${method.color} mb-2`}>{method.value}</p>
              <p className="text-sm text-slate-600">{method.description}</p>
            </div>
          ))}
        </div>

        {/* Support Features */}
        <div className="bg-white/80 backdrop-blur-sm rounded-card shadow-soft-xl p-10 mb-10 border border-soft-pink-200/50">
          <h3 className="text-3xl md:text-4xl font-semibold text-slate-800 text-center mb-10">Pourquoi Nous Contacter ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportFeatures.map((feature, index) => (
              <div key={index} className="flex items-start p-6 bg-gradient-to-br from-lavender-50/50 to-soft-pink-50/50 rounded-card-sm border border-lavender-100/50 shadow-soft-lg">
                <div className="w-12 h-12 bg-lavender-100 rounded-pill flex items-center justify-center mr-4 mt-1 flex-shrink-0 shadow-soft">
                  <feature.icon className="w-6 h-6 text-lavender-600" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-card shadow-soft-xl p-10 mb-10 border border-soft-pink-200/50">
          <h3 className="text-3xl md:text-4xl font-semibold text-slate-800 text-center mb-10">Informations Entreprise</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center p-4 bg-gradient-to-br from-lavender-50/50 to-soft-pink-50/50 rounded-card-sm border border-lavender-100/50">
                <div className="w-12 h-12 bg-lavender-100 rounded-pill flex items-center justify-center mr-4 shadow-soft">
                  <MapPin className="w-6 h-6 text-lavender-600" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Siège Social</h4>
                  <p className="text-sm text-slate-600">1 rue Teddy Riner<br />92600 Asnières-sur-Seine, France</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gradient-to-br from-peach-50/50 to-soft-pink-50/50 rounded-card-sm border border-peach-100/50">
                <div className="w-12 h-12 bg-peach-100 rounded-pill flex items-center justify-center mr-4 shadow-soft">
                  <Phone className="w-6 h-6 text-peach-600" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Téléphone</h4>
                  <p className="text-sm text-slate-600">+33 6 19 47 05 19</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center p-4 bg-gradient-to-br from-soft-pink-50/50 to-lavender-50/50 rounded-card-sm border border-soft-pink-100/50">
                <div className="w-12 h-12 bg-soft-pink-100 rounded-pill flex items-center justify-center mr-4 shadow-soft">
                  <Mail className="w-6 h-6 text-soft-pink-600" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Email</h4>
                  <p className="text-sm text-slate-600">support@doctorfollowers.com</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gradient-to-br from-warm-yellow-50/50 to-soft-orange-50/50 rounded-card-sm border border-warm-yellow-100/50">
                <div className="w-12 h-12 bg-warm-yellow-100 rounded-pill flex items-center justify-center mr-4 shadow-soft">
                  <Clock className="w-6 h-6 text-soft-orange-600" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Horaires</h4>
                  <p className="text-sm text-slate-600">Support 24h/24, 7j/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="bg-gradient-to-br from-lavender-50/50 via-soft-pink-50/50 to-peach-50/50 rounded-card p-10 text-center border border-lavender-200/50 shadow-soft-xl">
          <div className="w-16 h-16 bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 rounded-pill flex items-center justify-center mx-auto mb-6 shadow-soft-lg">
            <MessageCircle className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">Nous Sommes à Votre Écoute</h3>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Votre satisfaction est notre priorité. N'hésitez pas à nous contacter pour toute question, 
            demande d'assistance ou suggestion d'amélioration. Notre équipe expérimentée vous accompagne 
            dans votre projet de croissance sur les réseaux sociaux.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-pill shadow-soft border border-soft-pink-200/50 text-slate-700 font-medium">✓ Réponse sous 2h</span>
            <span className="bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-pill shadow-soft border border-soft-pink-200/50 text-slate-700 font-medium">✓ Support 24/7</span>
            <span className="bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-pill shadow-soft border border-soft-pink-200/50 text-slate-700 font-medium">✓ Conseils experts</span>
            <span className="bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-pill shadow-soft border border-soft-pink-200/50 text-slate-700 font-medium">✓ Satisfaction garantie</span>
          </div>
        </div>
      </div>
    </div>
  );
}
