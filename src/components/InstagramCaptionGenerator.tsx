import React, { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

type ToneType = 'Inspirant' | 'Humour' | 'Pro' | 'Storytelling' | 'Motivant' | 'Minimaliste';

const toneOptions: ToneType[] = [
  'Inspirant',
  'Humour',
  'Pro',
  'Storytelling',
  'Motivant',
  'Minimaliste'
];

const variantsOptions = [5, 6, 7, 8, 9, 10];

export default function InstagramCaptionGenerator() {
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState<ToneType>('Inspirant');
  const [addHashtags, setAddHashtags] = useState(true);
  const [addEmojis, setAddEmojis] = useState(true);
  const [variantsCount, setVariantsCount] = useState(6);
  const [captions, setCaptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setCaptions([]);

    try {
      const response = await fetch('/api/tools/instagram-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: description.trim(),
          tone,
          addHashtags,
          addEmojis,
          variantsCount
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Une erreur est survenue pendant la génération.');
      }

      const payload = await response.json();
      setCaptions(payload.captions || []);
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

  return (
    <div className="min-h-screen bg-cream font-rounded">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
            Générateur de captions Instagram
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed text-lg">
            Créez des captions engageantes adaptées au ton et au contenu de votre post.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-card shadow-soft-lg border border-soft-pink-200/50 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description du post <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Ex: Photo d un avant/apres, annonce d un nouveau produit, moment lifestyle..."
                className="w-full p-3 border border-soft-pink-200/50 rounded-button focus:ring-2 focus:ring-soft-pink-300 focus:border-soft-pink-300 focus:outline-none bg-white/80 text-slate-900 resize-none"
                rows={3}
              />
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
                {toneOptions.map((toneOption) => (
                  <option key={toneOption} value={toneOption}>
                    {toneOption}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Variantes
              </label>
              <select
                value={variantsCount}
                onChange={(event) => setVariantsCount(Number(event.target.value))}
                className="w-full p-3 border border-soft-pink-200/50 rounded-button focus:ring-2 focus:ring-soft-pink-300 focus:border-soft-pink-300 focus:outline-none bg-white/80 text-slate-900"
              >
                {variantsOptions.map((count) => (
                  <option key={count} value={count}>
                    {count} captions
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Emojis
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAddEmojis(true)}
                  className={`px-4 py-2 rounded-button text-sm font-medium transition-all border ${
                    addEmojis
                      ? 'bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white border-transparent shadow-soft'
                      : 'bg-white/80 text-slate-700 border-soft-pink-200/50 hover:bg-soft-pink-50'
                  }`}
                >
                  Oui
                </button>
                <button
                  type="button"
                  onClick={() => setAddEmojis(false)}
                  className={`px-4 py-2 rounded-button text-sm font-medium transition-all border ${
                    !addEmojis
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
                  onClick={() => setAddHashtags(true)}
                  className={`px-4 py-2 rounded-button text-sm font-medium transition-all border ${
                    addHashtags
                      ? 'bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white border-transparent shadow-soft'
                      : 'bg-white/80 text-slate-700 border-soft-pink-200/50 hover:bg-soft-pink-50'
                  }`}
                >
                  Oui
                </button>
                <button
                  type="button"
                  onClick={() => setAddHashtags(false)}
                  className={`px-4 py-2 rounded-button text-sm font-medium transition-all border ${
                    !addHashtags
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
              {variantsCount} captions seront générées à chaque clic.
            </p>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || description.trim() === ''}
              className="px-6 py-3 text-base bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white rounded-button hover:shadow-soft-lg transition-all shadow-soft font-medium flex items-center gap-2 disabled:opacity-60"
            >
              <Sparkles className="w-5 h-5" strokeWidth={1.5} />
              {isLoading ? 'Génération en cours...' : 'Générer les captions'}
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
            <h2 className="text-lg font-semibold text-slate-800">Captions générées</h2>
            <span className="text-sm text-slate-500">
              {captions.length > 0 ? `${captions.length} résultat${captions.length > 1 ? 's' : ''}` : 'Aucun résultat'}
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-slate-500">
              Génération en cours...
            </div>
          ) : captions.length === 0 ? (
            <div className="text-center text-slate-500 py-10">
              Vos captions apparaîtront ici après génération.
            </div>
          ) : (
            <div className="space-y-3">
              {captions.map((caption, index) => (
                <div
                  key={`${caption}-${index}`}
                  className="bg-white/90 rounded-card-sm border border-soft-pink-200/40 p-4 flex flex-col sm:flex-row sm:items-start gap-3 shadow-soft"
                >
                  <div className="flex-1">
                    <p className="text-slate-800 text-base whitespace-pre-line">{caption}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(caption, index)}
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
      </div>
    </div>
  );
}

