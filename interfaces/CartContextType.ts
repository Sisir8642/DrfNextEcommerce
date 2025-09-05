import { Product } from "./api";
import { CartItem } from "./CartItem";

export interface CartContextType{
    cart: CartItem[];
    addToCart: (product:Product) => void;
    removeFromCart: (id: number) => void;
    confirmOrder: () => Promise<void>;
    
}