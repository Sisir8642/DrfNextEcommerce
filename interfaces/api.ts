export interface Product{
    id: number;
    name: string;
    price: string;
    description?: string
    is_active: boolean
    category: string    
}

export interface Category{
    id: number;
    name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string; 
}


export interface Order {
  id: number;
  user: User; 
  status: 'pending' | 'confirmation' | 'cancelled' | 'shipped' | 'delivered'; 
  created_at: string; 
  updated_at: string;
  items: OrderItem[]; 
  total_amount?: number; 
}


export interface OrderItem {
  id: number;
  order: number; 
  product: number; 
  quantity: number;
  price_at_order: number;
}