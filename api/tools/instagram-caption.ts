import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CaptionRequestBody {
  description: string;
  tone: string;
  addHashtags?: boolean;
  addEmojis?: boolean;
  variantsCount?: number;
}

const MIN_VARIANTS = 3;
const MAX_VARIANTS = 10;

const normalizeText = (text: string) =>
  text.replace(/\s+/g, ' ').replace(/\s([,.!?;:])/g, '$1').trim();

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      description,
      tone,
      addHashtags = true,
      addEmojis = true,
      variantsCount = 6
    }: CaptionRequestBody = req.body || {};

    if (!description || !tone) {
      return res.status(400).json({
        error: 'Missing required fields: description and tone'
      });
    }

    const openAiKey = process.env.OPENAI_API_KEY;
    if (!openAiKey) {
      return res.status(500).json({
        error: 'OpenAI API key is not configured'
      });
    }

    const desiredCount = clamp(Number(variantsCount) || 6, MIN_VARIANTS, MAX_VARIANTS);

    const systemPrompt = [
      'Tu es un expert en copywriting social media et en optimisation de contenu Instagram.',
      '',
      'Ta mission est de generer des captions Instagram engageantes a partir d un bref texte',
      'ou d une description fournie par l utilisateur.',
      '',
      'L utilisateur envoie :',
      '{',
      '  "description": "...",',
      '  "tone": "...",',
      '  "addHashtags": true/false,',
      '  "addEmojis": true/false,',
      '  "variantsCount": X',
      '}',
      '',
      'Pour generer les captions :',
      '1. Analyse le contenu de "description".',
      '2. Produis un texte clair qui :',
      '   - correspond au contexte visuel ou emotionnel du post',
      '   - reflete une personnalite (pas une phrase generique)',
      '   - stimule l engagement (ex : CTA, question, punchline, storytelling)',
      '3. Respecte le "tone" demande.',
      '4. Si addHashtags = true :',
      '   - Ajoute 2 a 6 hashtags pertinents integres naturellement dans le texte ou a la fin.',
      '5. Si addEmojis = true :',
      '   - Ajoute 1 a 4 emojis contextuels (pas excessifs, coherents avec le ton).',
      `6. Genere exactement "variantsCount" captions distinctes (ici: ${desiredCount}).`,
      '7. Chaque caption doit etre unique (angles differents, formulations variees).',
      '',
      'Criteres de qualite :',
      '- Pas de texte plat ou trop vague',
      '- Evite les repetitions entre variantes',
      '- Selectionne des hashtags pertinents a partir de "description"',
      '',
      'Reponds strictement en JSON :',
      '{',
      '  "captions": [',
      '     "...",',
      '     "..."',
      '  ]',
      '}'
    ].join('\n');

    const userPayload = {
      description,
      tone,
      addHashtags,
      addEmojis,
      variantsCount: desiredCount
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

    let captions: string[] = [];
    try {
      const parsed = JSON.parse(content);
      captions = Array.isArray(parsed?.captions) ? parsed.captions : [];
    } catch (error) {
      console.error('❌ Failed to parse OpenAI JSON:', error);
    }

    const cleaned = captions
      .map((caption) => (typeof caption === 'string' ? normalizeText(caption) : ''))
      .filter(Boolean);

    const uniqueCaptions = Array.from(new Set(cleaned));
    const finalCaptions = uniqueCaptions.slice(0, desiredCount);

    if (finalCaptions.length < Math.min(MIN_VARIANTS, desiredCount)) {
      return res.status(500).json({
        error: 'Failed to generate enough captions'
      });
    }

    return res.status(200).json({
      captions: finalCaptions
    });
  } catch (error) {
    console.error('❌ Error in /api/tools/instagram-caption:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
}

