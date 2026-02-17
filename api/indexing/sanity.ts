import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleAuth } from 'google-auth-library';

const getSecret = (req: VercelRequest) => {
  const headerSecret = req.headers['x-webhook-secret'];
  if (typeof headerSecret === 'string' && headerSecret.length > 0) {
    return headerSecret;
  }
  if (Array.isArray(headerSecret) && headerSecret[0]) {
    return headerSecret[0];
  }
  if (typeof req.query.secret === 'string') {
    return req.query.secret;
  }
  if (Array.isArray(req.query.secret) && req.query.secret[0]) {
    return req.query.secret[0];
  }
  return '';
};

const normalizeDoc = (payload: any) => payload?.document || payload?.result || payload;

const extractSlug = (doc: any) => doc?.slug?.current || doc?.slug;

const resolveIndexingType = (doc: any, override?: string) => {
  if (override === 'URL_UPDATED' || override === 'URL_DELETED') {
    return override;
  }
  if (doc?._deleted === true || doc?.published === false) {
    return 'URL_DELETED';
  }
  return 'URL_UPDATED';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expectedSecret = process.env.SANITY_WEBHOOK_SECRET || '';
  if (expectedSecret) {
    const provided = getSecret(req);
    if (!provided || provided !== expectedSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, status: 'ready' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawCredentials = process.env.GOOGLE_INDEXING_CREDENTIALS;
  if (!rawCredentials) {
    return res.status(500).json({ error: 'Missing GOOGLE_INDEXING_CREDENTIALS' });
  }

  let credentials: any;
  try {
    credentials = JSON.parse(rawCredentials);
  } catch (error) {
    return res.status(500).json({ error: 'Invalid GOOGLE_INDEXING_CREDENTIALS' });
  }

  const doc = normalizeDoc(req.body);
  if (!doc || doc._type !== 'blogPost') {
    return res.status(200).json({ ok: true, skipped: true, reason: 'Not a blogPost payload' });
  }

  const slug = extractSlug(doc);
  if (!slug) {
    return res.status(200).json({ ok: true, skipped: true, reason: 'Missing slug' });
  }

  if (!doc.indexNow) {
    return res.status(200).json({ ok: true, skipped: true, reason: 'indexNow is false' });
  }

  const baseUrl = process.env.SITE_URL || 'https://doctorfollowers.com';
  const url = `${baseUrl.replace(/\/$/, '')}/blogs/${slug}`;
  const type = resolveIndexingType(doc, typeof req.body?.type === 'string' ? req.body.type : undefined);

  try {
    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/indexing']
    });
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken.token}`
      },
      body: JSON.stringify({ url, type })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Indexing API error', details: data });
    }

    return res.status(200).json({ ok: true, url, type, response: data });
  } catch (error: any) {
    return res.status(500).json({ error: 'Indexing API request failed', details: error?.message });
  }
}

