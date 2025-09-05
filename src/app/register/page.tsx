'use client';

import { useState } from 'react';
import Link from 'next/link'; 
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { register, isLoading } = useAuth(); 



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 
    setIsSubmitting(true);

    try {
      await register(username, password, email);
      toast( 'Sucesss',{
        description: 'You can now log in with your new account.',
      });
     
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration.');
      toast('Error', {
        
        description: err.message || 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md rounded-lg shadow-lg dark:bg-gray-800">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">Register Account</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Create a new account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="baburam"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="baburam@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? (
                <>
                  <CgSpinner className="animate-spin h-5 w-5 mr-2" />
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
