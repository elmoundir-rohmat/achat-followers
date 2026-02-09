import React, { useState, useEffect } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { PageService, BioGeneratorPageData } from '../services/pageService';
import PortableText from './PortableText';
import FAQSection from './FAQSection';

type ProfileType = 'Influenceur' | 'Business / Marque' | 'Coach / Freelance' | 'Artiste / Créateur';
type ToneType = 'Pro' | 'Fun' | 'Inspirant' | 'Minimaliste';

const profileTypes: ProfileType[] = [
  'Influenceur',
  'Business / Marque',
  'Coach / Freelance',
  'Artiste / Créateur'
];

const toneTypes: ToneType[] = [
  'Pro',
  'Fun',
  'Inspirant',
  'Minimaliste'
];

const OUTPUT_COUNT = 8;
const MAX_CHARACTERS = 150;

export default function InstagramBioGenerator() {
  const [profileType, setProfileType] = useState<ProfileType>('Influenceur');
  const [tone, setTone] = useState<ToneType>('Pro');
  const [description, setDescription] = useState('');
  const [useEmojis, setUseEmojis] = useState(true);
  const [useHashtags, setUseHashtags] = useState(false);
  const [bios, setBios] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [pageData, setPageData] = useState<BioGeneratorPageData | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les données SEO depuis Sanity
  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        const data = await PageService.getBioGeneratorPage();
        setPageData(data);
      } catch (error) {
        console.error('Erreur lors du chargement de la page:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

  // Mise à jour des métadonnées SEO
  useEffect(() => {
    if (pageData?.seo) {
      if (pageData.seo.metaTitle) {
        document.title = pageData.seo.metaTitle;
      }

      if (pageData.seo.metaDescription) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', pageData.seo.metaDescription);
        } else {
          const metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          metaDesc.content = pageData.seo.metaDescription;
          document.head.appendChild(metaDesc);
        }
      }

      if (pageData.seo.keywords && pageData.seo.keywords.length > 0) {
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
          metaKeywords.setAttribute('content', pageData.seo.keywords.join(', '));
        } else {
          const metaKw = document.createElement('meta');
          metaKw.name = 'keywords';
          metaKw.content = pageData.seo.keywords.join(', ');
          document.head.appendChild(metaKw);
        }
      }

      if (pageData.seo.canonicalUrl) {
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
          canonical.setAttribute('href', pageData.seo.canonicalUrl);
        } else {
          const linkCanonical = document.createElement('link');
          linkCanonical.rel = 'canonical';
          linkCanonical.href = pageData.seo.canonicalUrl;
          document.head.appendChild(linkCanonical);
        }
      }
    }

    if (pageData?.openGraph) {
      if (pageData.openGraph.title) {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', pageData.openGraph.title);
        } else {
          const metaOgTitle = document.createElement('meta');
          metaOgTitle.setAttribute('property', 'og:title');
          metaOgTitle.setAttribute('content', pageData.openGraph.title);
          document.head.appendChild(metaOgTitle);
        }
      }

      if (pageData.openGraph.description) {
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
          ogDescription.setAttribute('content', pageData.openGraph.description);
        } else {
          const metaOgDesc = document.createElement('meta');
          metaOgDesc.setAttribute('property', 'og:description');
          metaOgDesc.setAttribute('content', pageData.openGraph.description);
          document.head.appendChild(metaOgDesc);
        }
      }

      if (pageData.openGraph.url) {
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
          ogUrl.setAttribute('content', pageData.openGraph.url);
        } else {
          const metaOgUrl = document.createElement('meta');
          metaOgUrl.setAttribute('property', 'og:url');
          metaOgUrl.setAttribute('content', pageData.openGraph.url);
          document.head.appendChild(metaOgUrl);
        }
      }

      if (pageData.openGraph.image?.url) {
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
          ogImage.setAttribute('content', pageData.openGraph.image.url);
        } else {
          const metaOgImage = document.createElement('meta');
          metaOgImage.setAttribute('property', 'og:image');
          metaOgImage.setAttribute('content', pageData.openGraph.image.url);
          document.head.appendChild(metaOgImage);
        }
      }
    }
  }, [pageData]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setBios([]);

    try {
      const response = await fetch('/api/tools/instagram-bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profileType,
          tone,
          description: description.trim() || undefined,
          emojis: useEmojis,
          hashtags: useHashtags,
          count: OUTPUT_COUNT
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Une erreur est survenue pendant la génération.');
      }

      const payload = await response.json();
      setBios(payload.bios || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center font-rounded">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-pink-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-rounded">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
            {pageData?.hero?.title || 'Générateur de bio Instagram'}
          </h1>
          {pageData?.hero?.description ? (
            <div className="text-slate-600 max-w-2xl mx-auto leading-relaxed text-lg">
              <PortableText content={pageData.hero.description} />
            </div>
          ) : (
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed text-lg">
              Créez 5 à 10 bios prêtes à l'emploi, courtes et optimisées pour les 150 caractères.
            </p>
          )}
        </div>

        {/* H2 avant le générateur */}
        {pageData?.h2BeforeGenerator && (
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-4 text-center">
              {pageData.h2BeforeGenerator}
            </h2>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-card shadow-soft-lg border border-soft-pink-200/50 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type de profil
              </label>
              <select
                value={profileType}
                onChange={(event) => setProfileType(event.target.value as ProfileType)}
                className="w-full p-3 border border-soft-pink-200/50 rounded-button focus:ring-2 focus:ring-soft-pink-300 focus:border-soft-pink-300 focus:outline-none bg-white/80 text-slate-900"
              >
                {profileTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ton
              </label>
              <select
                value={tone}
                onChange={(event) => setTone(event.target.value as ToneType)}
                className="w-full p-3 border border-soft-pink-200/50 rounded-button focus:ring-2 focus:ring-soft-pink-300 focus:border-soft-pink-300 focus:outline-none bg-white/80 text-slate-900"
              >
                {toneTypes.map((toneOption) => (
                  <option key={toneOption} value={toneOption}>
                    {toneOption}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Ex: J'aide les marques a vendre plus avec du contenu"
                className="w-full p-3 border border-soft-pink-200/50 rounded-button focus:ring-2 focus:ring-soft-pink-300 focus:border-soft-pink-300 focus:outline-none bg-white/80 text-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Emojis
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUseEmojis(true)}
                  className={`px-4 py-2 rounded-button text-sm font-medium transition-all border ${
                    useEmojis
                      ? 'bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white border-transparent shadow-soft'
                      : 'bg-white/80 text-slate-700 border-soft-pink-200/50 hover:bg-soft-pink-50'
                  }`}
                >
                  Oui
                </button>
                <button
                  type="button"
                  onClick={() => setUseEmojis(false)}
                  className={`px-4 py-2 rounded-button text-sm font-medium transition-all border ${
                    !useEmojis
                      ? 'bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white border-transparent shadow-soft'
                      : 'bg-white/80 text-slate-700 border-soft-pink-200/50 hover:bg-soft-pink-50'
                  }`}
                >
                  Non
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Hashtags
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUseHashtags(true)}
                  className={`px-4 py-2 rounded-button text-sm font-medium transition-all border ${
                    useHashtags
                      ? 'bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white border-transparent shadow-soft'
                      : 'bg-white/80 text-slate-700 border-soft-pink-200/50 hover:bg-soft-pink-50'
                  }`}
                >
                  Oui
                </button>
                <button
                  type="button"
                  onClick={() => setUseHashtags(false)}
                  className={`px-4 py-2 rounded-button text-sm font-medium transition-all border ${
                    !useHashtags
                      ? 'bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white border-transparent shadow-soft'
                      : 'bg-white/80 text-slate-700 border-soft-pink-200/50 hover:bg-soft-pink-50'
                  }`}
                >
                  Non
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              {OUTPUT_COUNT} bios seront générées à chaque clic.
            </p>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || description.trim() === ''}
              className="px-6 py-3 text-base bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white rounded-button hover:shadow-soft-lg transition-all shadow-soft font-medium flex items-center gap-2 disabled:opacity-60"
            >
              <Sparkles className="w-5 h-5" strokeWidth={1.5} />
              {isLoading ? 'Génération en cours...' : 'Générer les bios'}
            </button>
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-card-sm px-4 py-3">
              {error}
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-card shadow-soft-lg border border-soft-pink-200/50 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Bios générées</h2>
            <span className="text-sm text-slate-500">
              {bios.length > 0 ? `${bios.length} résultat${bios.length > 1 ? 's' : ''}` : 'Aucun résultat'}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-slate-500">
              Génération en cours...
            </div>
          ) : bios.length === 0 ? (
            <div className="text-center text-slate-500 py-10">
              Vos bios apparaîtront ici après génération.
            </div>
          ) : (
            <div className="space-y-3">
              {bios.map((bio, index) => (
                <div
                  key={`${bio}-${index}`}
                  className="bg-white/90 rounded-card-sm border border-soft-pink-200/40 p-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-soft"
                >
                  <div className="flex-1">
                    <p className="text-slate-800 text-base">{bio}</p>
                    <span className="text-xs text-slate-500">
                      {bio.length}/{MAX_CHARACTERS} caractères
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(bio, index)}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white rounded-button hover:shadow-soft-lg transition-all shadow-soft font-medium"
                  >
                    {copiedIndex === index ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3" strokeWidth={2} />
                        Copié
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="w-3 h-3" strokeWidth={1.5} />
                        Copier
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contenu enrichi après le générateur */}
        {pageData?.contentAfterGenerator && (
          <div className="mt-10 bg-white/80 backdrop-blur-sm rounded-card shadow-soft-lg border border-soft-pink-200/50 p-8">
            <PortableText content={pageData.contentAfterGenerator} />
          </div>
        )}

        {/* FAQ Section */}
        {pageData?.faq?.questions && pageData.faq.questions.length > 0 && (
          <div className="mt-10">
            <FAQSection 
              title={pageData.faq.title || "Questions fréquentes"}
              faqs={pageData.faq.questions.map(q => ({
                question: q.question || '',
                answer: q.answer || ''
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}

