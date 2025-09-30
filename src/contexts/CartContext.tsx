import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  followers: number;
  likes?: number;
  comments?: number;
  views?: number;
  price: number;
  followerType: 'french' | 'international';
  username?: string;
  platform?: string;
  deliveryOption?: {
    runs: number;
    interval: number;
    totalTime: string;
    additionalCost: number;
  };
  selectedPosts?: Array<{
    postId: string;
    likesToAdd?: number;
    commentsToAdd?: number;
    viewsToAdd?: number;
    mediaUrl?: string;
  }>;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  addToCartWithPosts: (item: Omit<CartItem, 'id'>, selectedPosts?: Array<{postId: string; likesToAdd?: number; commentsToAdd?: number; viewsToAdd?: number; mediaUrl?: string}>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalFollowers: () => number;
  setItems: (items: CartItem[]) => void;
  saveCartToStorage: (items: CartItem[]) => void;
  getTotalLikes: () => number;
  getTotalComments: () => number;
  getTotalViews: () => number;
  updateLastItemUsername: (username: string) => void;
  updateLastItemPosts: (posts: Array<{postId: string; likesToAdd?: number; commentsToAdd?: number; viewsToAdd?: number; mediaUrl?: string}>) => void;
  updateLastItemPrice: (price: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Charger le panier depuis localStorage au démarrage
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('doctor-followers-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      return [];
    }
  });

  // Fonction pour sauvegarder le panier dans localStorage
  const saveCartToStorage = (cartItems: CartItem[]) => {
    try {
      localStorage.setItem('doctor-followers-cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du panier:', error);
    }
  };

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: `${item.followers || item.likes || item.comments || item.views || 0}-${item.followerType}-${Date.now()}`
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    saveCartToStorage(newItems);
  };

  const addToCartWithPosts = (item: Omit<CartItem, 'id'>, selectedPosts?: Array<{postId: string; likesToAdd?: number; commentsToAdd?: number; viewsToAdd?: number; mediaUrl?: string}>) => {
    const newItem: CartItem = {
      ...item,
      id: `${item.followers || item.likes || item.comments || item.views || 0}-${item.followerType}-${Date.now()}`,
      selectedPosts: selectedPosts || []
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    saveCartToStorage(newItems);
  };

  const removeFromCart = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    saveCartToStorage(newItems);
  };

  const clearCart = () => {
    setItems([]);
    saveCartToStorage([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const getTotalFollowers = () => {
    return items.reduce((total, item) => total + item.followers, 0);
  };

  const getTotalLikes = () => {
    return items.reduce((total, item) => {
      let itemLikes = item.likes || 0;
      // Si des posts sont sélectionnés, calculer le total réel
      if (item.selectedPosts && item.selectedPosts.length > 0) {
        itemLikes = item.selectedPosts.reduce((sum, post) => sum + (post.likesToAdd || 0), 0);
      }
      return total + itemLikes;
    }, 0);
  };

  const getTotalComments = () => {
    const total = items.reduce((total, item) => {
      let itemComments = item.comments || 0;
      // Si des posts sont sélectionnés, calculer le total réel
      if (item.selectedPosts && item.selectedPosts.length > 0) {
        itemComments = item.selectedPosts.reduce((sum, post) => sum + (post.commentsToAdd || 0), 0);
      }
      
      // DEBUG: Log du calcul
      console.log('🔍 DEBUG getTotalComments:', {
        itemId: item.id,
        originalComments: item.comments,
        calculatedComments: itemComments,
        selectedPostsCount: item.selectedPosts?.length,
        selectedPosts: item.selectedPosts
      });
      
      return total + itemComments;
    }, 0);
    
    console.log('🔍 DEBUG Total comments final:', total);
    return total;
  };

  const getTotalViews = () => {
    return items.reduce((total, item) => {
      let itemViews = item.views || 0;
      // Si des posts sont sélectionnés, calculer le total réel
      if (item.selectedPosts && item.selectedPosts.length > 0) {
        itemViews = item.selectedPosts.reduce((sum, post) => sum + (post.viewsToAdd || 0), 0);
      }
      return total + itemViews;
    }, 0);
  };

  const updateLastItemUsername = (username: string) => {
    if (items.length === 0) return;
    const updatedItems = [...items];
    updatedItems[updatedItems.length - 1] = {
      ...updatedItems[updatedItems.length - 1],
      username
    };
    setItems(updatedItems);
    saveCartToStorage(updatedItems);
  };

  const updateLastItemPosts = (posts: Array<{postId: string; likesToAdd?: number; commentsToAdd?: number; viewsToAdd?: number; mediaUrl?: string}>) => {
    console.log('🔍 DEBUG updateLastItemPosts called with:', posts);
    console.log('🔍 DEBUG Current items before update:', items);
    
    if (items.length === 0) {
      console.log('❌ ERROR: No items in cart to update!');
      return;
    }
    
    const updatedItems = [...items];
    updatedItems[updatedItems.length - 1] = {
      ...updatedItems[updatedItems.length - 1],
      selectedPosts: posts
    };
    
    console.log('🔍 DEBUG Updated item:', updatedItems[updatedItems.length - 1]);
    
    setItems(updatedItems);
    saveCartToStorage(updatedItems);
    
    console.log('🔍 DEBUG Items after update:', updatedItems);
  };

  const updateLastItemPrice = (price: number) => {
    if (items.length === 0) return;
    const updatedItems = [...items];
    updatedItems[updatedItems.length - 1] = {
      ...updatedItems[updatedItems.length - 1],
      price: price
    };
    setItems(updatedItems);
    saveCartToStorage(updatedItems);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      addToCartWithPosts,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getTotalFollowers,
      setItems,
      saveCartToStorage,
      getTotalLikes,
      getTotalComments,
      getTotalViews,
      updateLastItemUsername,
      updateLastItemPosts,
      updateLastItemPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};
