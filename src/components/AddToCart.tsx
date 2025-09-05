'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useCart } from '@/app/context/CartContext';
import { Product } from '../../interfaces/api';
import { useState } from 'react';
import { FiHeart } from "react-icons/fi";
interface Props {
  triggerProduct?: Product;
}

export default function CartSheet({ triggerProduct }: Props) {
  const { cart, removeFromCart, confirmOrder, addToCart } = useCart();
  const [open, setOpen] = useState(false);


  const handleTriggerClick = () => {
    if (triggerProduct) addToCart(triggerProduct);
    setOpen(true);
  };
 console.log('Current cart:', cart);

  return (
    <>
      <button onClick={handleTriggerClick}>
        <span role="img" aria-label="add-to-cart">
          <FiHeart  className='cursor-pointer'/>
        </span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full max-w-sm">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
            <SheetDescription>Manage your cart items</SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="border p-4 rounded shadow flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Rs. {Number(item.price) * item.quantity}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                    Delete
                  </button>
                </div>
              ))
            )}
            {cart.length > 0 && (
              <button
                onClick={confirmOrder}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
              >
                Confirm Order
              </button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
