import React, { useState } from 'react';
import { smmaService } from '../services/smmaService';

export default function SMMATest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [testType, setTestType] = useState<'followers' | 'likes'>('followers');

  const testOrder720 = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Test avec l'ID 720 pour followers internationaux
      const testOrder = {
        username: 'test_user',
        followers: 25, // Peut être 25, 100, 250, etc.
        followerType: 'international' as const,
        orderId: `TEST-${Date.now()}`,
        paymentId: 'test-payment-123'
      };

      console.log('🧪 Test avec service ID 720:', testOrder);
      
      const response = await smmaService.orderFollowers(testOrder);
      
      setResult(response);
      
      if (response.success) {
        console.log('✅ Test réussi:', response);
      } else {
        console.error('❌ Test échoué:', response);
      }

    } catch (err) {
      console.error('❌ Erreur lors du test:', err);
      setError('Erreur lors du test de commande');
    } finally {
      setLoading(false);
    }
  };

  const testOrder4343 = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Test avec l'ID 4343 pour likes internationaux
      const testOrder = {
        username: 'test_user',
        followers: 0, // Pas de followers pour les likes
        followerType: 'international' as const,
        orderId: `TEST-${Date.now()}`,
        paymentId: 'test-payment-123',
        postId: 'test_post_123',
        likesToAdd: 25 // Nombre de likes à ajouter
      };

      console.log('🧪 Test avec service ID 4343:', testOrder);
      
      const response = await smmaService.orderLikes(testOrder);
      
      setResult(response);
      
      if (response.success) {
        console.log('✅ Test réussi:', response);
      } else {
        console.error('❌ Test échoué:', response);
      }

    } catch (err) {
      console.error('❌ Erreur lors du test:', err);
      setError('Erreur lors du test de commande likes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
        🧪 Test SMMA
      </h3>
      
      <div className="space-y-4">
        {/* Sélecteur de type de test */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setTestType('followers')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              testType === 'followers'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Followers (ID 720)
          </button>
          <button
            onClick={() => setTestType('likes')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              testType === 'likes'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Likes (ID 4343)
          </button>
        </div>

        <div className={`p-4 rounded-lg ${
          testType === 'followers' ? 'bg-blue-50' : 'bg-pink-50'
        }`}>
          <h4 className={`font-bold mb-2 ${
            testType === 'followers' ? 'text-blue-800' : 'text-pink-800'
          }`}>
            Configuration du test :
          </h4>
          <ul className={`text-sm space-y-1 ${
            testType === 'followers' ? 'text-blue-700' : 'text-pink-700'
          }`}>
            {testType === 'followers' ? (
              <>
                <li>• Service: Instagram followers internationaux</li>
                <li>• ID SMMA: 720</li>
                <li>• Quantité: 25 followers</li>
                <li>• Profil: @test_user</li>
                <li>• URL: https://instagram.com/test_user</li>
              </>
            ) : (
              <>
                <li>• Service: Instagram likes internationaux</li>
                <li>• ID SMMA: 4343</li>
                <li>• Quantité: 25 likes</li>
                <li>• Profil: @test_user</li>
                <li>• Post: test_post_123</li>
                <li>• URL: https://instagram.com/p/test_post_123</li>
              </>
            )}
          </ul>
        </div>

        <button
          onClick={testType === 'followers' ? testOrder720 : testOrder4343}
          disabled={loading}
          className={`w-full ${
            testType === 'followers' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-pink-600 hover:bg-pink-700'
          } disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Test en cours...
            </span>
          ) : (
            `Tester la commande SMMA (${testType === 'followers' ? 'ID 720' : 'ID 4343'})`
          )}
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className={`border rounded-lg p-4 ${
            result.success 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <h4 className="font-bold mb-2">
              {result.success ? '✅ Résultat du test' : '❌ Erreur du test'}
            </h4>
            <div className="text-sm space-y-1">
              {result.success ? (
                <>
                  <p><strong>Commande SMMA:</strong> #{result.smma_order_id}</p>
                  <p><strong>Message:</strong> {result.message}</p>
                </>
              ) : (
                <p><strong>Erreur:</strong> {result.error}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center">
        <p>💡 Assurez-vous d'avoir configuré votre clé API dans le fichier .env</p>
        <p>🔧 VITE_SMMA_API_KEY=votre_cle_api_ici</p>
      </div>
    </div>
  );
}
