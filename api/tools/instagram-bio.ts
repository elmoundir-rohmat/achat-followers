import type { VercelRequest, VercelResponse } from '@vercel/node';

interface BioRequestBody {
  profileType: string;
  tone: string;
  keywords?: string;
  emojis?: boolean;
  count?: number;
}

const MIN_BIOS = 5;
const MAX_BIOS = 10;
const MAX_CHARACTERS = 150;

const normalizeText = (text: string) =>
  text.replace(/\s+/g, ' ').replace(/\s([,.!?;:])/g, '$1').trim();

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const splitKeywords = (keywords?: string) =>
  (keywords || '')
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

const buildFallbackBios = (payload: BioRequestBody) => {
  const keywords = splitKeywords(payload.keywords);
  const keywordShort = keywords.length > 0 ? keywords.slice(0, 3).join(' • ') : '';
  const emojiPrefix = payload.emojis ? '✨ ' : '';
  const cta = payload.emojis ? 'DM pour collab' : 'DM pour collab';

  const valueByProfile: Record<string, string> = {
    'Influenceur': 'Partage de contenus qui inspirent',
    'Business / Marque': 'Marque engagée, focus résultats',
    'Coach / Freelance': 'J aide mes clients a passer un cap',
    'Artiste / Créateur': 'Creatif et passionne, nouvelles idees'
  };

  const toneByType: Record<string, string> = {
    'Pro': 'Professionnel',
    'Fun': 'Fun',
    'Inspirant': 'Inspirant',
    'Minimaliste': 'Minimaliste'
  };

  const profileLabel = payload.profileType || 'Profil Instagram';
  const toneLabel = toneByType[payload.tone] || payload.tone || 'Authentique';
  const valueSentence = valueByProfile[payload.profileType] || 'Contenus utiles et clairs';

  const join = (...parts: string[]) =>
    normalizeText(parts.filter(Boolean).join(' | '));

  const joinSpace = (...parts: string[]) =>
    normalizeText(parts.filter(Boolean).join(' '));

  const templates = [
    joinSpace(emojiPrefix + profileLabel, toneLabel + '.', keywordShort),
    joinSpace(emojiPrefix + valueSentence + '.', keywordShort),
    joinSpace(emojiPrefix + keywordShort, cta),
    join(emojiPrefix + profileLabel, keywordShort, cta),
    joinSpace(emojiPrefix + toneLabel + '.', valueSentence),
    joinSpace(emojiPrefix + profileLabel + '.', 'Disponible pour projets.'),
    joinSpace(emojiPrefix + keywordShort, 'Dispo pour collaborations.'),
    join(emojiPrefix + toneLabel, profileLabel, keywordShort)
  ];

  return templates
    .map((line) => normalizeText(line))
    .filter(Boolean)
    .filter((line) => line.length <= MAX_CHARACTERS);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      profileType,
      tone,
      keywords,
      emojis = true,
      count = 8
    }: BioRequestBody = req.body || {};

    if (!profileType || !tone) {
      return res.status(400).json({
        error: 'Missing required fields: profileType and tone'
      });
    }

    const openAiKey = process.env.OPENAI_API_KEY;
    if (!openAiKey) {
      return res.status(500).json({
        error: 'OpenAI API key is not configured'
      });
    }

    const desiredCount = clamp(Number(count) || 8, MIN_BIOS, MAX_BIOS);

    const systemPrompt = [
      'Tu es un expert senior en copywriting Instagram et en personal branding.',
      'Ta mission est de generer des biographies Instagram COURTES mais FORTES,',
      'qui donnent immediatement envie de suivre le profil.',
      '',
      'Une bonne biographie Instagram :',
      '- exprime une identite claire (qui je suis / ce que je fais)',
      '- met en avant une valeur ou une promesse unique',
      '- reflete une personnalite (pas une phrase generique)',
      '- suscite de la curiosite, de l emotion ou de la projection',
      '- sonne naturelle, humaine et memorable',
      '',
      'Consignes obligatoires :',
      `- Genere ${desiredCount} biographies distinctes`,
      `- Maximum ${MAX_CHARACTERS} caracteres par biographie`,
      '- Respecte strictement :',
      `  - le type de profil (${profileType})`,
      `  - le ton (${tone})`,
      `  - les mots-cles (${keywords || ''})`,
      '- Les mots-cles doivent etre integres de maniere naturelle (jamais listes)',
      '- Evite absolument :',
      '  - les phrases plates ou descriptives',
      '  - les slogans creux',
      '  - les formulations vues et revues',
      '- Chaque bio doit proposer un ANGLE different :',
      '  (ex : promesse, storytelling court, positionnement, mindset, contraste)',
      '',
      'Emojis :',
      '- Si "emojis" = true → ajoute 1 a 2 emojis maximum',
      '- Si "emojis" = false → aucun emoji',
      '',
      'Format de sortie :',
      '- Reponds UNIQUEMENT en JSON strict',
      '- Cle unique : "bios"',
      '- Valeur : tableau de strings',
      '- Aucun texte hors JSON'
    ].join('\n');

    const userPayload = {
      profileType,
      tone,
      keywords,
      emojis
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.8,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(userPayload) }
        ]
      })
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      console.error('❌ OpenAI error:', errorPayload);
      return res.status(502).json({
        error: 'OpenAI request failed'
      });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';

    let bios: string[] = [];

    try {
      const parsed = JSON.parse(content);
      bios = Array.isArray(parsed?.bios) ? parsed.bios : [];
    } catch (error) {
      console.error('❌ Failed to parse OpenAI JSON:', error);
    }

    const cleaned = bios
      .map((bio) => (typeof bio === 'string' ? normalizeText(bio) : ''))
      .filter(Boolean);

    const uniqueBios = Array.from(new Set(cleaned));
    const withinLimit = uniqueBios.filter((bio) => bio.length <= MAX_CHARACTERS);

    const finalBios: string[] = [];
    for (const bio of withinLimit) {
      if (finalBios.length >= desiredCount) break;
      finalBios.push(bio);
    }

    if (finalBios.length < MIN_BIOS) {
      const fallbackBios = buildFallbackBios({
        profileType,
        tone,
        keywords,
        emojis
      });
      for (const bio of fallbackBios) {
        if (finalBios.length >= desiredCount) break;
        if (!finalBios.includes(bio)) {
          finalBios.push(bio);
        }
      }
    }

    if (finalBios.length < MIN_BIOS) {
      return res.status(500).json({
        error: 'Failed to generate enough bios'
      });
    }

    return res.status(200).json({
      bios: finalBios.slice(0, desiredCount)
    });
  } catch (error) {
    console.error('❌ Error in /api/tools/instagram-bio:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
}

