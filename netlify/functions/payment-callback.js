// netlify/functions/payment-callback.js
exports.handler = async (event) => {
  console.log('=== PAYMENT CALLBACK RECEIVED ===');
  
  try {
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const paymentId = body.id || body.payment_id || 'unknown';
      const status = body.status || 'unknown';

      // ✅ Redirection absolue vers la page de succès (GET)
      return {
        statusCode: 302,
        headers: {
          Location: `https://doctorfollowers.com/payment/success?payment_id=${paymentId}&status=${status}`,
          'Cache-Control': 'no-cache',
        },
      };
    }

    // ✅ Fallback GET direct
    return {
      statusCode: 302,
      headers: {
        Location: `https://doctorfollowers.com/payment/success`,
        'Cache-Control': 'no-cache',
      },
    };
  } catch (error) {
    console.error('❌ Error in payment callback:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Payment callback failed', details: error.message }),
    };
  }
};
