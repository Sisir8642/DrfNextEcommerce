'use client';

import React, { useState, useEffect } from 'react';
import baseapi from '../../../../lib/axios';
import { Order } from '../../../../interfaces/api'; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CgSpinner } from 'react-icons/cg';
import { useRouter } from 'next/navigation';

const ORDER_STATUSES: Order['status'][] = ['pending', 'confirmation', 'cancelled', 'shipped', 'delivered'];

export default function OrdersManagement() {
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await baseapi.get<Order[]>('/api/orders/orders/');
      const sortedOrders = response.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast('ERROR',{
        description: 'Failed to load orders.',
        
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const calculateTotalAmount = (order: Order): number => {
    if (!order.items || order.items.length === 0) {
      return 0;
    }
    return order.items.reduce((sum, item) => sum + (item.quantity * item.price_at_order), 0);
  };

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    const originalOrders = [...orders]; 
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
  await baseapi.patch(`/api/orders/orders/${orderId}/`, { status: newStatus });
  toast('Success', {
    description: `Order ${orderId} status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}.`,
  });
} catch (error: unknown) {
  let message = 'Unknown error';
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'object' && error !== null && 'response' in error) {
   
    message = error.response?.data?.detail || JSON.stringify(error);
  }

  console.error('Failed to update order status:', message);
  toast('Error', {
    description: `Failed to update order status: ${message}`,
  });
  setOrders(originalOrders);
}
};

  const handleCancelOrder = async (orderId: number, currentStatus: Order['status']) => {
    if (currentStatus !== 'pending') {
      toast('Cancel',{
        
        description: 'Only orders with "pending" status can be cancelled.',
        
      });
      return;
    }

    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await baseapi.delete(`/api/orders/orders/${orderId}/`);
      toast('Cancel',{
        
        description: `Order ${orderId} has been cancelled.`,
      });
      } catch (error: unknown) {
  let message = 'Unknown error';

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'object' && error !== null && 'response' in error) {
   
    message = error.response?.data?.detail || JSON.stringify(error);
  }

  console.log('Failed to cancel order:', message);
  toast('Error', {
    description: `Failed to cancel order: ${message}`,
  });
}

  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <CgSpinner className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-50">Orders Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">No orders found.</TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.user.username}</TableCell>
                <TableCell>
                  
                  {order.items && order.items.length > 0 ? (
                    <ul className="list-disc list-inside text-sm">
                      {order.items.map(item => (
                        <li key={item.id}>
                          Product {item.product} (x{item.quantity}) @ ${typeof item.price_at_order === 'number' ?item.price_at_order.toFixed(2):'null'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'No items'
                  )}
                </TableCell>
                <TableCell>${calculateTotalAmount(order).toFixed(2)}</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(newStatus: Order['status']) => handleStatusChange(order.id, newStatus)}
                  >
                    <SelectTrigger className="w-[180px] dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:text-gray-50">
                      {ORDER_STATUSES.map((statusOption) => (
                        <SelectItem key={statusOption} value={statusOption}>
                          {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="mr-2">View</Button>
                  {order.status === 'pending' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelOrder(order.id, order.status)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
