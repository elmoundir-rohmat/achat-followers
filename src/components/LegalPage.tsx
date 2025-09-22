import React from 'react';
import { ArrowLeft, FileText, Shield, Building2, Truck, RefreshCw } from 'lucide-react';

interface LegalPageProps {
  onBack: () => void;
}

export default function LegalPage({ onBack }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Informations Légales</h1>
              <p className="text-gray-600">Conformité Cardinity</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="prose prose-lg max-w-none text-gray-800">
            
            {/* Informations de la société */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Building2 className="w-6 h-6 mr-2" />
                Informations de la Société
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Raison sociale :</strong> ThinkWell</p>
                    <p><strong>Adresse :</strong> 1 rue Teddy Riner, 92600 Asnières-sur-Seine, France</p>
                    <p><strong>SIRET :</strong> 947 844 965</p>
                    <p><strong>RCS :</strong> Paris B 947 844 965</p>
                  </div>
                  <div>
                    <p><strong>Capital social :</strong> 10 000 €</p>
                    <p><strong>Forme juridique :</strong> SARL</p>
                    <p><strong>TVA intracommunautaire :</strong> FR12 123456789</p>
                    <p><strong>Directeur de publication :</strong> M. Jean Dupont</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact client */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-2" />
                Contact Client
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                  <p><strong>Email support :</strong> support@doctorfollowers.com</p>
                  <p><strong>Téléphone :</strong> +33 6 19 47 05 19</p>
                    <p><strong>Chat en direct :</strong> 24/7 sur le site</p>
                  </div>
                  <div>
                    <p><strong>Horaires :</strong> Lun-Ven 9h-18h (CET)</p>
                    <p><strong>Réponse email :</strong> Sous 2h maximum</p>
                    <p><strong>Support technique :</strong> Disponible 24/7</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Conditions générales */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Conditions Générales de Vente</h2>
              <div className="space-y-4 text-gray-800">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Objet</h3>
                  <p>Les présentes conditions générales de vente régissent les relations entre ThinkWell et ses clients pour la fourniture de services de croissance organique sur les réseaux sociaux (Instagram, TikTok).</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Services</h3>
                  <p>Nous proposons des services de croissance organique incluant l'achat de followers, likes, commentaires et vues provenant de comptes réels et actifs.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Prix et Paiement</h3>
                  <p>Les prix sont indiqués en euros TTC. Le paiement s'effectue par carte bancaire via notre partenaire Cardinity (Visa, Mastercard, American Express).</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Garanties</h3>
                  <p>Nous garantissons que tous les followers, likes, commentaires et vues proviennent de comptes réels et actifs. Garantie de remplacement en cas de perte dans les 30 jours.</p>
                </div>
              </div>
            </section>

            {/* Conditions de livraison */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Truck className="w-6 h-6 mr-2" />
                Conditions de Livraison
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">Délais de livraison</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Livraison instantanée :</strong> 10-15 minutes</p>
                    <p><strong>Livraison 24h :</strong> Répartie sur 24 heures</p>
                    <p><strong>Livraison 3 jours :</strong> Répartie sur 3 jours</p>
                  </div>
                  <div>
                    <p><strong>Livraison 7 jours :</strong> Répartie sur 7 jours</p>
                    <p><strong>Livraison 14 jours :</strong> Répartie sur 14 jours</p>
                    <p><strong>Livraison 30 jours :</strong> Répartie sur 30 jours</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Politique de remboursement */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <RefreshCw className="w-6 h-6 mr-2" />
                Politique de Remboursement
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">Conditions de remboursement</h3>
                <div className="space-y-2 text-sm text-red-900">
                  <p>• <strong>Remboursement automatique :</strong> Livraison non effectuée dans les délais annoncés</p>
                  <p>• <strong>Remboursement sur demande :</strong> Commande effectuée par erreur (dans les 2h)</p>
                  <p>• <strong>Garantie de remplacement :</strong> Perte de plus de 20% des followers/likes dans les 7 premiers jours</p>
                  <p>• <strong>Délai de traitement :</strong> 2-5 jours ouvrés</p>
                  <p>• <strong>Contact :</strong> refunds@doctorfollowers.com</p>
                </div>
              </div>
            </section>

            {/* Politique de confidentialité */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Politique de Confidentialité</h2>
              <div className="space-y-4 text-gray-800">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Données collectées</h3>
                  <p>Nous collectons les données nécessaires à l'exécution de nos services : nom, email, adresse de facturation, liens des posts Instagram/TikTok.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Utilisation des données</h3>
                  <p>Vos données sont utilisées uniquement pour traiter vos commandes et vous fournir un support client. Nous ne partageons jamais vos données personnelles avec des tiers.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Vos droits</h3>
                  <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Contact : privacy@doctorfollowers.com</p>
                </div>
              </div>
            </section>

            {/* Droit applicable */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Droit Applicable</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="space-y-2 text-sm text-gray-800">
                  <p><strong>Loi applicable :</strong> Droit français</p>
                  <p><strong>Juridiction compétente :</strong> Tribunaux français</p>
                  <p><strong>Médiation :</strong> Médiation de la consommation (Code de la consommation)</p>
                  <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
