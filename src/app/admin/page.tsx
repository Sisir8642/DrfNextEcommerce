'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { CgSpinner } from 'react-icons/cg';
import { Toaster } from '@/components/ui/sonner';

import ProductManagement from './products/page';
import CategoryMangement from './categories/page';
import OrdersManagement from './orders/page';


export default function AdminDashboard() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'products' | 'category' | 'orders'>('products');


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen gap-2">
        <CgSpinner className="animate-spin text-2xl" />
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Admin</h2>
        </div>
        <nav className="flex flex-col gap-2 px-4">
          <Button
            variant={activeTab === 'products' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('products')}
            className="justify-start"
          >
            Products
          </Button>
          <Button
            variant={activeTab === 'category' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('category')}
            className="justify-start"
          >
            Category
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('orders')}
            className="justify-start"
          >
            Orders
          </Button>
        </nav>
      </aside>

      
      <div className="flex-1 flex flex-col">
        
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-gray-800">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
          <Button variant="destructive" onClick={logout}>
            Logout
          </Button>
        </header>

        
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'category' && <CategoryMangement />}
          {activeTab === 'orders' && <OrdersManagement />}
        </main>
      </div>

      <Toaster />
    </div>
  );
}
