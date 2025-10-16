'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load wishlist from localStorage when user changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
        if (savedWishlist) {
          try {
            const wishlistData = JSON.parse(savedWishlist);
            setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
          } catch (error) {
            console.error('Error parsing wishlist data:', error);
            setWishlist([]);
          }
        } else {
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    }
  }, [user]);

  // Save wishlist to localStorage when wishlist changes
  useEffect(() => {
    if (typeof window !== 'undefined' && user && wishlist.length >= 0) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const addToWishlist = (productId: string) => {
    if (!user) {
      return;
    }

    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(id => id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
