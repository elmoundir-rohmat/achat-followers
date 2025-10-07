exports.handler = async (event, context) => {
  console.log('=== PAYMENT CALLBACK RECEIVED ===');
  console.log('Method:', event.httpMethod);
  console.log('Body:', event.body);
  console.log('Query:', event.queryStringParameters);
  
  if (event.httpMethod === 'POST') {
    try {
      const paymentData = JSON.parse(event.body || '{}');
      const paymentId = paymentData.id || paymentData.payment_id;
      const status = paymentData.status;
      
      console.log('Payment ID:', paymentId);
      console.log('Status:', status);
      
      // Redirection GET vers la page de succès
      return {
        statusCode: 303,
        headers: {
          'Location': `/payment/success?payment_id=${paymentId || 'unknown'}&status=${status || 'pending'}`
        }
      };
    } catch (error) {
      console.error('Error parsing payment data:', error);
      return {
        statusCode: 303,
        headers: {
          'Location': '/payment/success'
        }
      };
    }
  }
  
  // Fallback pour GET
  return {
    statusCode: 303,
    headers: {
      'Location': '/payment/success'
    }
  };
};
