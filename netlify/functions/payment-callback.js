// netlify/functions/payment-callback.js
exports.handler = async (event) => {
  console.log('=== PAYMENT CALLBACK RECEIVED ===');
  console.log('Method:', event.httpMethod);
  console.log('Path:', event.path);
  console.log('Body:', event.body);
  
  try {
    if (event.httpMethod === 'POST') {
      // Parser le body selon le content-type
      let paymentData = {};
      
      if (event.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
        // Cardinity envoie du form-data
        const params = new URLSearchParams(event.body || '');
        paymentData = {
          id: params.get('id') || params.get('payment_id'),
          status: params.get('status'),
          order_id: params.get('order_id'),
          amount: params.get('amount')
        };
      } else {
        // JSON
        paymentData = JSON.parse(event.body || '{}');
      }
      
      const paymentId = paymentData.id || paymentData.payment_id || 'unknown';
      const status = paymentData.status || 'unknown';
      const orderId = paymentData.order_id || 'unknown';
      const amount = paymentData.amount || 'unknown';

      console.log('Parsed payment data:', { paymentId, status, orderId, amount });

      // ✅ Redirection absolue vers la page de succès (GET)
      return {
        statusCode: 302,
        headers: {
          Location: `https://doctorfollowers.com/payment/success?payment_id=${paymentId}&status=${status}&order_id=${orderId}&amount=${amount}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      };
    }

    // ✅ Fallback GET direct
    return {
      statusCode: 302,
      headers: {
        Location: `https://doctorfollowers.com/payment/success`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
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
