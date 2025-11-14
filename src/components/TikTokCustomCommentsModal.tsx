import React, { useState, useEffect } from 'react';
import { X, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';

interface TikTokCustomCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onConfirm: (comments: string[]) => void;
  commentsCount: number;
  tiktokUrl: string;
  basePrice: number;
}

export default function TikTokCustomCommentsModal({
  isOpen,
  onClose,
  onBack,
  onConfirm,
  commentsCount,
  tiktokUrl,
  basePrice
}: TikTokCustomCommentsModalProps) {
  const [comments, setComments] = useState<string[]>(Array(commentsCount).fill(''));
  const [errors, setErrors] = useState<boolean[]>(Array(commentsCount).fill(false));

  // Réinitialiser les commentaires quand le nombre change
  useEffect(() => {
    setComments(Array(commentsCount).fill(''));
    setErrors(Array(commentsCount).fill(false));
  }, [commentsCount]);

  const handleCommentChange = (index: number, value: string) => {
    const newComments = [...comments];
    newComments[index] = value;
    setComments(newComments);

    // Réinitialiser l'erreur pour ce champ
    const newErrors = [...errors];
    newErrors[index] = false;
    setErrors(newErrors);
  };

  const validateComments = (): boolean => {
    const newErrors = comments.map(comment => comment.trim() === '');
    setErrors(newErrors);
    
    // Vérifier qu'il n'y a pas de commentaires vides
    const hasEmpty = comments.some(comment => comment.trim() === '');
    
    if (hasEmpty) {
      alert('Veuillez remplir tous les commentaires. Aucun commentaire ne peut être vide.');
      return false;
    }
    
    return true;
  };

  const handleConfirm = () => {
    if (!validateComments()) {
      return;
    }

    // Nettoyer les commentaires (trim) avant de les envoyer
    const cleanedComments = comments.map(comment => comment.trim()).filter(comment => comment !== '');
    
    // Vérifier qu'on a bien le bon nombre de commentaires
    if (cleanedComments.length !== commentsCount) {
      alert(`Vous devez saisir exactement ${commentsCount} commentaires.`);
      return;
    }

    onConfirm(cleanedComments);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="w-6 h-6 mr-3" />
              <h2 className="text-xl font-bold">Saisissez vos commentaires personnalisés</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Important :</p>
                <p>Vous devez saisir exactement <strong>{commentsCount} commentaire{commentsCount > 1 ? 's' : ''}</strong>.</p>
                <p className="mt-1">Chaque commentaire doit être unique et ne peut pas être vide.</p>
              </div>
            </div>
          </div>

          {/* Résumé */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nombre de commentaires :</span>
                <span className="font-semibold text-gray-900 ml-2">{commentsCount}</span>
              </div>
              <div>
                <span className="text-gray-600">Prix total :</span>
                <span className="font-semibold text-green-600 ml-2">{basePrice.toFixed(2)}€</span>
              </div>
            </div>
          </div>

          {/* Liste des inputs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Vos commentaires ({comments.filter(c => c.trim() !== '').length}/{commentsCount})
            </h3>
            
            {comments.map((comment, index) => (
              <div key={index} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaire {index + 1} {comment.trim() !== '' && (
                    <CheckCircle className="w-4 h-4 text-green-500 inline-block ml-2" />
                  )}
                </label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => {
                    // Supprimer les retours à la ligne et les remplacer par des espaces
                    const value = e.target.value.replace(/\n/g, ' ').replace(/\r/g, '');
                    handleCommentChange(index, value);
                  }}
                  onPaste={(e) => {
                    // Empêcher le collage de texte avec retours à la ligne
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text');
                    const cleanedText = pastedText.replace(/\n/g, ' ').replace(/\r/g, '');
                    handleCommentChange(index, cleanedText);
                  }}
                  placeholder={`Saisissez votre commentaire ${index + 1}...`}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                    errors[index] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors[index] && (
                  <p className="text-red-500 text-xs mt-1">Ce commentaire ne peut pas être vide</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={onBack}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
            >
              Retour
            </button>
            <button
              onClick={handleConfirm}
              disabled={comments.filter(c => c.trim() !== '').length !== commentsCount}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Confirmer ({comments.filter(c => c.trim() !== '').length}/{commentsCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

