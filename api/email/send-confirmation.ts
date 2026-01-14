/**
 * API Route Vercel : Envoi d'emails de confirmation de commande
 * 
 * Cette route envoie :
 * 1. Un email de confirmation au client
 * 2. Un email de notification à l'admin
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailRequest {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  customer: {
    email: string;
    country?: string;
  };
  username?: string;
  followers?: number;
  followerType?: string;
  platform?: string;
}

export default async function handler(req: any, res: any) {
  // Accepter uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      orderId,
      amount,
      currency = 'EUR',
      description,
      customer,
      username,
      followers,
      followerType,
      platform = 'Instagram'
    }: EmailRequest = req.body;

    // Validation des données requises
    if (!orderId || !amount || !customer?.email) {
      return res.status(400).json({ 
        error: 'Missing required fields: orderId, amount, and customer.email are required' 
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@doctorfollowers.com';
    const fromEmail = process.env.FROM_EMAIL || 'noreply@doctorfollowers.com';

    // 1. Email de confirmation au client
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .total { font-size: 1.2em; font-weight: bold; color: #667eea; }
            .footer { text-align: center; margin-top: 30px; color: #999; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Commande confirmée !</h1>
              <p>Merci pour votre achat</p>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Votre commande a été confirmée avec succès. Voici les détails :</p>
              
              <div class="order-details">
                <div class="detail-row">
                  <span class="label">Numéro de commande :</span>
                  <span class="value">${orderId}</span>
                </div>
                ${username ? `
                <div class="detail-row">
                  <span class="label">Compte ${platform} :</span>
                  <span class="value">${username}</span>
                </div>
                ` : ''}
                ${followers ? `
                <div class="detail-row">
                  <span class="label">Followers :</span>
                  <span class="value">${followers.toLocaleString()} ${followerType === 'french' ? 'français' : 'internationaux'}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                  <span class="label">Service :</span>
                  <span class="value">${description}</span>
                </div>
                <div class="detail-row total">
                  <span>Montant total :</span>
                  <span>${amount.toFixed(2)} ${currency}</span>
                </div>
              </div>

              <p>Votre commande est en cours de traitement. Le temps de livraison dépend du service choisi et varie en général entre quelques minutes à quelques jours si vous avez choisi d'être livré progressivement.</p>
              
              <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
              
              <div class="footer">
                <p>Merci de votre confiance !<br>L'équipe Doctor Followers</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // 2. Email de notification à l'admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .total { font-size: 1.2em; font-weight: bold; color: #f5576c; }
            .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛒 Nouvelle commande reçue !</h1>
              <p>Une nouvelle commande vient d'être passée</p>
            </div>
            <div class="content">
              <div class="alert">
                <strong>Action requise :</strong> Traiter cette commande dans le système SMMA.
              </div>
              
              <div class="order-details">
                <div class="detail-row">
                  <span class="label">Numéro de commande :</span>
                  <span class="value"><strong>${orderId}</strong></span>
                </div>
                <div class="detail-row">
                  <span class="label">Email client :</span>
                  <span class="value">${customer.email}</span>
                </div>
                ${customer.country ? `
                <div class="detail-row">
                  <span class="label">Pays :</span>
                  <span class="value">${customer.country}</span>
                </div>
                ` : ''}
                ${username ? `
                <div class="detail-row">
                  <span class="label">Compte ${platform} :</span>
                  <span class="value">${username}</span>
                </div>
                ` : ''}
                ${followers ? `
                <div class="detail-row">
                  <span class="label">Followers :</span>
                  <span class="value">${followers.toLocaleString()} ${followerType === 'french' ? 'français' : 'internationaux'}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                  <span class="label">Service :</span>
                  <span class="value">${description}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Plateforme :</span>
                  <span class="value">${platform}</span>
                </div>
                <div class="detail-row total">
                  <span>Montant total :</span>
                  <span>${amount.toFixed(2)} ${currency}</span>
                </div>
              </div>

              <p><strong>Prochaines étapes :</strong></p>
              <ul>
                <li>Vérifier que la commande a bien été traitée par le système SMMA</li>
                <li>Contacter le client si nécessaire</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `;

    // Envoyer les deux emails en parallèle
    const [customerResult, adminResult] = await Promise.allSettled([
      resend.emails.send({
        from: fromEmail,
        to: customer.email,
        subject: `Confirmation de votre commande #${orderId}`,
        html: customerEmailHtml,
      }),
      resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `🛒 Nouvelle commande #${orderId} - ${amount.toFixed(2)}${currency}`,
        html: adminEmailHtml,
      }),
    ]);

    // Logger les résultats (même en cas d'erreur, on ne bloque pas)
    if (customerResult.status === 'fulfilled') {
      console.log('✅ Email client envoyé avec succès:', customerResult.value);
    } else {
      console.error('❌ Erreur envoi email client:', customerResult.reason);
    }

    if (adminResult.status === 'fulfilled') {
      console.log('✅ Email admin envoyé avec succès:', adminResult.value);
    } else {
      console.error('❌ Erreur envoi email admin:', adminResult.reason);
    }

    // Retourner un succès même si un email échoue (pour ne pas bloquer l'utilisateur)
    return res.status(200).json({ 
      success: true,
      customerEmailSent: customerResult.status === 'fulfilled',
      adminEmailSent: adminResult.status === 'fulfilled'
    });

  } catch (error: any) {
    console.error('❌ Erreur dans /api/email/send-confirmation:', error);
    // Ne pas bloquer l'utilisateur en cas d'erreur d'email
    return res.status(500).json({ 
      error: 'Failed to send emails',
      message: error.message 
    });
  }
}

