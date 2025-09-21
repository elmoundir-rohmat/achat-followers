import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  followers: number;
  likes?: number;
  price: number;
  followerType: 'french' | 'international';
  username?: string;
  selectedPosts?: Array<{
    postId: string;
    likesToAdd: number;
    mediaUrl?: string;
  }>;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalFollowers: () => number;
  getTotalLikes: () => number;
  updateLastItemUsername: (username: string) => void;
  updateLastItemPosts: (posts: Array<{postId: string; likesToAdd: number; mediaUrl?: string}>) => void;
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
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: `${item.followers}-${item.followerType}-${Date.now()}`
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const getTotalFollowers = () => {
    return items.reduce((total, item) => total + item.followers, 0);
  };

  const getTotalLikes = () => {
    return items.reduce((total, item) => total + (item.likes || 0), 0);
  };

  const updateLastItemUsername = (username: string) => {
    setItems(prev => {
      if (prev.length === 0) return prev;
      const updatedItems = [...prev];
      updatedItems[updatedItems.length - 1] = {
        ...updatedItems[updatedItems.length - 1],
        username
      };
      return updatedItems;
    });
  };

  const updateLastItemPosts = (posts: Array<{postId: string; likesToAdd: number; mediaUrl?: string}>) => {
    setItems(prev => {
      if (prev.length === 0) return prev;
      const updatedItems = [...prev];
      updatedItems[updatedItems.length - 1] = {
        ...updatedItems[updatedItems.length - 1],
        selectedPosts: posts
      };
      return updatedItems;
    });
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getTotalFollowers,
      getTotalLikes,
      updateLastItemUsername,
      updateLastItemPosts
    }}>
      {children}
    </CartContext.Provider>
  );
};
