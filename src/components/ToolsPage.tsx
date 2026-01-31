import React from 'react';

interface ToolsPageProps {
  onNavigate?: (page: string) => void;
}

export default function ToolsPage({ onNavigate }: ToolsPageProps) {
  return (
    <div className="min-h-screen bg-cream font-rounded">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
            Outils Instagram
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed text-lg">
            Choisissez l'outil qui vous aide à optimiser votre profil.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => onNavigate?.('tools-font')}
            className="text-left bg-white/80 backdrop-blur-sm rounded-card shadow-soft border border-soft-pink-200/50 p-6 hover:shadow-soft-lg transition-all"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Générateur de police
            </h2>
            <p className="text-slate-600">
              Transformez vos textes pour la bio, les légendes et les stories Instagram.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('tools-bio')}
            className="text-left bg-white/80 backdrop-blur-sm rounded-card shadow-soft border border-soft-pink-200/50 p-6 hover:shadow-soft-lg transition-all"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Générateur de bio
            </h2>
            <p className="text-slate-600">
              Créez des bios courtes et impactantes selon votre profil et votre ton.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('tools-caption')}
            className="text-left bg-white/80 backdrop-blur-sm rounded-card shadow-soft border border-soft-pink-200/50 p-6 hover:shadow-soft-lg transition-all"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Générateur de captions
            </h2>
            <p className="text-slate-600">
              Générez des captions engageantes à partir d'une description de post.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
