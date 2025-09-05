'use client'
import React, { createContext, useContext, useState } from 'react';
import { Product } from '../../../interfaces/api';
import axios from 'axios';
import { CartContextType } from '../../../interfaces/CartContextType';
import { CartItem } from '../../../interfaces/CartItem';
import ProductCard from '@/components/productCard/page';
import baseapi from '../../../lib/axios';
import { toast } from 'sonner';

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider:React.FC<{children:any}> =({children})=>{
const [popoverOpen, setPopoverOpen] = React.useState(false);
 const [cart, setCart] = useState<CartItem[]>([]);
const [orderStatus, setOrderStatus] = useState<string | null>(null);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) =>{
    setCart(prev => prev.filter(item => item.id !== id)); 
  }

    const confirmOrder = async () => {
      

    try {
      const items = cart.map(item => ({
        product: item.id,
        quantity: item.quantity,
        product_name: item.name,
        
      }));
      const response = await baseapi.post('/api/orders/orders/', { items });
      console.log('Sending order:', { items });
      setOrderStatus('Pending');
      setCart([]);
       toast('Order placed successfully!', {
  description: 'We’ve received your order.',
  duration:3000,
});
    } catch (err) {
      console.log('Order failed:', err.response?.data || err.message);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, confirmOrder }}>
      {children}
    </CartContext.Provider>
  );
 };
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
